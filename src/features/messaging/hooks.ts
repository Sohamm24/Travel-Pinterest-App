/**
 * features/messaging/hooks.ts
 *
 * Two custom hooks for the messaging feature:
 *
 *  useUserChats()      — REST: fetch the authenticated user's chat list
 *  useMessageScreen()  — WS: drives the full MessageScreen state machine
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { client } from '../../utils/apiClient';
import { useAuthStore } from '../../store/authStore';
import { Message, MessageStatus, ReplyMessage, User, UserChat } from './types';
import { useMessagingWebSocket, WS_EVENTS } from './websocket';

// ─────────────────────────────────────────────────────────────────────────────
// useUserChats
// ─────────────────────────────────────────────────────────────────────────────

interface UseUserChatsResult {
  chats: UserChat[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useUserChats(): UseUserChatsResult {
  const [chats, setChats] = useState<UserChat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    client
      .get('/api/v1/messaging/chats')
      .then((res) => {
        if (!cancelled) {
          // Backend returns { data: UserChat[] }
          setChats(res.data?.data ?? []);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err?.response?.data?.detail ?? 'Failed to load chats');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => { cancelled = true; };
  }, [tick]);

  const refetch = useCallback(() => setTick((t) => t + 1), []);

  return { chats, isLoading, error, refetch };
}

// ─────────────────────────────────────────────────────────────────────────────
// useMessageScreen
// ─────────────────────────────────────────────────────────────────────────────

interface MessageScreenParams {
  organizerUserId: string;
  organizerName: string;
  organizerPic: string | null;
  organizerProfileId: string | null;
  isVerified: boolean;
}

interface UseMessageScreenResult {
  messages: Message[];
  isConnecting: boolean;
  isConnected: boolean;
  participant: User | null;
  userChatId: string | null;
  chatId: string | null;
  sendMessage: (text: string, replyTo?: Message | null) => void;
}

export function useMessageScreen(params: MessageScreenParams): UseMessageScreenResult {
  const { organizerUserId } = params;
  const userId = useAuthStore((s) => s.userId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [participant, setParticipant] = useState<User | null>(null);
  const [userChatId, setUserChatId] = useState<string | null>(null);
  const [chatId, setChatId] = useState<string | null>(null);

  // Track the last message_id we have for the race-condition guard
  const lastSeqRef = useRef<number>(0);
  // Have we already sent the join event?
  const joinedRef = useRef(false);

  // ── WebSocket ────────────────────────────────────────────────────────────
  const { emitJoinUserChat, emitSendMessage, isConnected, isConnecting, readyState } =
    useMessagingWebSocket({
      enabled: true,
      onMessage: handleWsMessage,
    });

  // Send joinUserChat once the connection is open
  useEffect(() => {
    if (isConnected && !joinedRef.current) {
      joinedRef.current = true;
      emitJoinUserChat({
        organizer_user_id: organizerUserId,
        last_received_sequence: lastSeqRef.current,
      });
    }
  }, [isConnected, organizerUserId]);

  // Reset join flag on reconnect so we rejoin automatically
  useEffect(() => {
    if (readyState === ReadyState.CONNECTING) {
      joinedRef.current = false;
    }
  }, [readyState]);

  // ── Inbound WS message handler ────────────────────────────────────────────
  function handleWsMessage(event: { event: string; data: any }) {
    switch (event.event) {
      case WS_EVENTS.USER_CHAT_JOINED: {
        const { messages: serverMessages, participant: serverParticipant, user_chat_id, chat_id } = event.data;

        const parsed: Message[] = (serverMessages ?? []).map(parseMessage);
        // Merge with any optimistic messages already in state (avoid duplicates)
        setMessages((prev) => {
          const serverIds = new Set(parsed.map((m) => m.message_id));
          const nonDupe = prev.filter((m) => !serverIds.has(m.message_id));
          return [...parsed, ...nonDupe].sort((a, b) => a.message_id - b.message_id);
        });

        if (parsed.length > 0) {
          lastSeqRef.current = parsed[parsed.length - 1].message_id;
        }

        if (serverParticipant) {
          setParticipant(serverParticipant as User);
        }
        if (user_chat_id) setUserChatId(user_chat_id);
        if (chat_id) setChatId(chat_id);
        break;
      }

      case WS_EVENTS.NEW_MESSAGE: {
        const { message: serverMsg } = event.data;
        const parsed = parseMessage(serverMsg);

        setMessages((prev) => {
          // Replace optimistic placeholder if it exists, else append
          const existingIdx = prev.findIndex(
            (m) =>
              m.message_id < 0 &&
              m.sender_id === parsed.sender_id &&
              m.text === parsed.text,
          );
          if (existingIdx !== -1) {
            const updated = [...prev];
            updated[existingIdx] = parsed;
            return updated;
          }
          // Avoid duplicates from echo
          if (prev.some((m) => m.message_id === parsed.message_id)) return prev;
          return [...prev, parsed];
        });

        lastSeqRef.current = Math.max(lastSeqRef.current, parsed.message_id);
        break;
      }

      default:
        break;
    }
  }

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    (text: string, replyTo?: Message | null) => {
      if (!text.trim() || !userId) return;

      // Optimistic update: append with a temporary negative id
      const optimisticId = -Date.now();
      const optimistic: Message = {
        message_id: optimisticId,
        chat_id: chatId ?? '',
        sender_id: userId,
        text: text.trim(),
        is_edited: false,
        is_deleted: false,
        reply_to_message: replyTo
          ? ({
              message_id: replyTo.message_id,
              sender_id: replyTo.sender_id,
              text: replyTo.text,
              is_deleted: replyTo.is_deleted,
            } as ReplyMessage)
          : null,
        status: MessageStatus.SENDING,
        created_at: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, optimistic]);

      emitSendMessage({
        text: text.trim(),
        reply_to_message_id: replyTo?.message_id ?? null,
      });
    },
    [userId, chatId, emitSendMessage],
  );

  return {
    messages,
    isConnecting,
    isConnected,
    participant,
    userChatId,
    chatId,
    sendMessage,
  };
}

// ── Parser helper ─────────────────────────────────────────────────────────────

function parseMessage(raw: any): Message {
  return {
    message_id: raw.message_id,
    chat_id: raw.chat_id,
    sender_id: raw.sender_id,
    text: raw.text,
    is_edited: raw.is_edited ?? false,
    is_deleted: raw.is_deleted ?? false,
    reply_to_message: raw.reply_to_message
      ? {
          message_id: raw.reply_to_message.message_id,
          sender_id: raw.reply_to_message.sender_id,
          text: raw.reply_to_message.text,
          is_deleted: raw.reply_to_message.is_deleted ?? false,
        }
      : null,
    status: raw.status as MessageStatus,
    created_at: raw.created_at,
  };
}
