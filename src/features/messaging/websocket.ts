/**
 * features/messaging/websocket.ts
 *
 * Typed WebSocket hook for the messaging module.
 * Built on top of react-use-websocket v3 (already installed).
 *
 * The backend WebSocket endpoint authenticates via ?token=<JWT> query param.
 */

import { useCallback, useEffect, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthStore } from '../../store/authStore';

const WS_BASE =
  (process.env.EXPO_PUBLIC_WS_URL ?? '').replace(/^http/, 'ws').replace(/^https/, 'wss');

// ── Event type constants ────────────────────────────────────────────────────

export const WS_EVENTS = {
  // Inbound (server → client)
  CONNECTED: 'connected',
  USER_CHAT_JOINED: 'userChatJoined',
  NEW_MESSAGE: 'newMessage',
  HEARTBEAT_ACK: 'heartbeat_ack',
  ERROR: 'error',

  // Outbound (client → server)
  JOIN_USER_CHAT: 'joinUserChat',
  SEND_MESSAGE: 'sendMessage',
  HEARTBEAT: 'heartbeat',
} as const;

// ── Payload types ────────────────────────────────────────────────────────────

export interface JoinUserChatPayload {
  organizer_user_id: string;
  last_received_sequence: number;
}

export interface SendMessagePayload {
  text: string;
  reply_to_message_id?: number | null;
}

// ── Hook ─────────────────────────────────────────────────────────────────────

interface UseMessagingWebSocketOptions {
  /** Called with every parsed inbound JSON message */
  onMessage?: (event: { event: string; data: any }) => void;
  /** Whether to actually open the connection */
  enabled?: boolean;
}

export function useMessagingWebSocket(options: UseMessagingWebSocketOptions = {}) {
  const { onMessage, enabled = true } = options;
  const accessToken = useAuthStore((s) => s.accessToken);
  const heartbeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const socketUrl =
    enabled && accessToken && WS_BASE
      ? `${WS_BASE}/api/v1/messaging/ws?token=${accessToken}`
      : null;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      // Reconnect automatically on drop (up to 5 attempts)
      shouldReconnect: () => true,
      reconnectAttempts: 5,
      reconnectInterval: 3000,
      share: false,
    },
    // Only connect when socketUrl is non-null
    Boolean(socketUrl),
  );

  // ── Forward inbound messages to caller ──────────────────────────────────
  useEffect(() => {
    if (lastJsonMessage && onMessage) {
      onMessage(lastJsonMessage as any);
    }
  }, [lastJsonMessage]);

  // ── Send heartbeat every 90s to keep presence alive ─────────────────────
  useEffect(() => {
    if (readyState === ReadyState.OPEN) {
      heartbeatTimer.current = setInterval(() => {
        sendJsonMessage({ event: WS_EVENTS.HEARTBEAT, data: {} });
      }, 90_000);
    }
    return () => {
      if (heartbeatTimer.current) clearInterval(heartbeatTimer.current);
    };
  }, [readyState]);

  // ── Typed emit helpers ───────────────────────────────────────────────────

  const emitJoinUserChat = useCallback(
    (payload: JoinUserChatPayload) => {
      sendJsonMessage({ event: WS_EVENTS.JOIN_USER_CHAT, data: payload });
    },
    [sendJsonMessage],
  );

  const emitSendMessage = useCallback(
    (payload: SendMessagePayload) => {
      sendJsonMessage({ event: WS_EVENTS.SEND_MESSAGE, data: payload });
    },
    [sendJsonMessage],
  );

  return {
    readyState,
    isConnected: readyState === ReadyState.OPEN,
    isConnecting: readyState === ReadyState.CONNECTING,
    emitJoinUserChat,
    emitSendMessage,
  };
}
