import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import {
  ChevronLeft,
  ShieldCheck,
  Check,
  CheckCheck,
  ArrowUp,
  CornerUpLeft,
  X,
  Wifi,
  WifiOff,
} from 'lucide-react-native';
import { Message, MessageStatus, ReplyMessage } from '../types';
import { formatChatTimestamp, isSameDay } from 'src/utils/helpers';
import { useAuthStore } from '../../../store/authStore';
import { useMessageScreen } from '../hooks';


const formatDateSeparator = (dateStr: string) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(date, today)) return 'Today';
  if (isSameDay(date, yesterday)) return 'Yesterday';

  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
};

export default function MessageScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const userId = useAuthStore((s) => s.userId) ?? '';

  // ── Route params ───────────────────────────────────────────────────────
  const {
    organizerUserId,
    organizerName,
    organizerPic,
    organizerProfileId,
    isVerified,
  } = route.params as {
    organizerUserId: string;
    organizerName: string;
    organizerPic: string | null;
    organizerProfileId: string | null;
    isVerified: boolean;
  };

  // ── Messaging hook ─────────────────────────────────────────────────────
  const { messages, isConnected, isConnecting, sendMessage } = useMessageScreen({
    organizerUserId,
    organizerName,
    organizerPic,
    organizerProfileId,
    isVerified,
  });

  // ── Local UI state ─────────────────────────────────────────────────────
  const [draft, setDraft] = useState('');
  const [inputHeight, setInputHeight] = useState(INPUT_MIN_HEIGHT);
  const [replyTarget, setReplyTarget] = useState<Message | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Keep feed pinned to latest message as keyboard opens/closes
  useEffect(() => {
    const showSub = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => flatListRef.current?.scrollToEnd({ animated: true }),
    );
    return () => showSub.remove();
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages.length]);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const nameForSender = (senderId: string) =>
    senderId === userId ? 'You' : organizerName;

  const renderTicks = (message: Message) => {
    if (message.sender_id !== userId) return null;

    if (message.status === MessageStatus.READ) {
      return <CheckCheck color={colors.primary} size={13} />;
    }
    if (message.status === MessageStatus.DELIVERED) {
      return <CheckCheck color={colors.textSecondary} size={13} />;
    }
    // SENDING or SENT
    return <Check color={colors.textSecondary} size={13} />;
  };

  // ── Header ─────────────────────────────────────────────────────────────
  const renderHeader = () => (
    <View style={[styles.header, { borderBottomColor: colors.border }]}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
        <ChevronLeft color={colors.textPrimary} size={24} />
      </TouchableOpacity>

      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.ternary }]}>
        {organizerPic ? (
          <Image source={{ uri: organizerPic }} style={styles.avatar} />
        ) : (
          <Text style={[styles.avatarInitial, { color: colors.primary }]}>
            {getInitials(organizerName)}
          </Text>
        )}
      </View>

      <View style={styles.headerInfo}>
        <View style={styles.nameRow}>
          <Text style={[styles.organizerName, { color: colors.textPrimary }]}>{organizerName}</Text>
          {isVerified && (
            <ShieldCheck color={colors.primary} fill={colors.primary} size={14} />
          )}
        </View>

        <View style={styles.onlineRow}>
          {isConnecting ? (
            <>
              <ActivityIndicator size="small" color={colors.textSecondary} style={{ transform: [{ scale: 0.6 }] }} />
              <Text style={[styles.onlineText, { color: colors.textSecondary }]}>Connecting…</Text>
            </>
          ) : isConnected ? (
            <>
              <View style={styles.onlineDot} />
              <Text style={[styles.onlineText, { color: colors.textSecondary }]}>Online</Text>
            </>
          ) : (
            <>
              <WifiOff color={colors.textSecondary} size={10} />
              <Text style={[styles.onlineText, { color: colors.textSecondary }]}>Reconnecting…</Text>
            </>
          )}
        </View>
      </View>

      {organizerProfileId && (
        <TouchableOpacity
          style={[styles.viewProfileBtn, { borderColor: colors.primary }]}
          onPress={() => navigation.navigate('OrganizerPublicProfile', { organizerId: organizerProfileId })}
        >
          <Text style={[styles.viewProfileText, { color: colors.primary }]}>View Profile</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Reply preview inside bubble ────────────────────────────────────────
  const renderReplyPreview = (message: Message, isMine: boolean) => {
    const replyTo = message.reply_to_message;
    if (!replyTo) return null;

    return (
      <View
        style={[
          styles.replyPreview,
          {
            backgroundColor: isMine ? colors.progressBg : colors.dim,
            borderLeftColor: colors.primary,
          },
        ]}
      >
        <Text style={[styles.replyPreviewName, { color: colors.primary }]}>{nameForSender(replyTo.sender_id)}</Text>
        <Text style={[styles.replyPreviewText, { color: colors.textSecondary }]} numberOfLines={1}>
          {replyTo.is_deleted ? 'Message deleted' : replyTo.text}
        </Text>
      </View>
    );
  };

  // ── Message bubble ─────────────────────────────────────────────────────
  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isMine = item.sender_id === userId;
    const nextItem = messages[index + 1];
    const isLastInGroup = !nextItem || nextItem.sender_id !== item.sender_id || !!nextItem.reply_to_message;

    const prevItem = messages[index - 1];
    const showDateSeparator =
      index === 0 || (!!prevItem && !isSameDay(new Date(prevItem.created_at), new Date(item.created_at)));

    const isSending = item.message_id < 0; // optimistic placeholder

    return (
      <View style={styles.messageBlock}>
        {showDateSeparator && (
          <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
            {formatDateSeparator(item.created_at)}
          </Text>
        )}

        <View style={[styles.messageRow, isMine ? styles.messageRowRight : styles.messageRowLeft]}>
          {!isMine && (
            <View style={styles.avatarSlot}>
              {isLastInGroup && (
                <View style={[styles.smallAvatarPlaceholder, { backgroundColor: colors.ternary }]}>
                  {organizerPic ? (
                    <Image source={{ uri: organizerPic }} style={styles.avatar} />
                  ) : (
                    <Text style={[styles.smallAvatarInitial, { color: colors.primary }]}>
                      {getInitials(organizerName)}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onLongPress={() => setReplyTarget(item)}
            style={[
              styles.bubble,
              isMine
                ? [styles.bubbleMine, { backgroundColor: colors.dim }]
                : [styles.bubbleOther, { backgroundColor: colors.ternary }],
              isSending && styles.bubbleSending,
            ]}
          >
            {renderReplyPreview(item, isMine)}
            <Text style={[styles.bubbleText, { color: isSending ? colors.textSecondary : colors.textPrimary }]}>
              {item.is_deleted ? <Text style={{ fontStyle: 'italic' }}>Message deleted</Text> : item.text}
            </Text>
          </TouchableOpacity>
        </View>

        {isLastInGroup && (
          <View style={[styles.metaRow, isMine ? styles.metaRowRight : styles.metaRowLeft]}>
            {isSending ? (
              <ActivityIndicator size="small" color={colors.textSecondary} style={{ transform: [{ scale: 0.5 }] }} />
            ) : (
              renderTicks(item)
            )}
            <Text style={[styles.timeText, { color: colors.textSecondary }]}>
              {isSending ? 'Sending…' : formatChatTimestamp(item.created_at)}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // ── Send ───────────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft.trim(), replyTarget);
    setDraft('');
    setReplyTarget(null);
    setInputHeight(INPUT_MIN_HEIGHT);
    requestAnimationFrame(() => flatListRef.current?.scrollToEnd({ animated: true }));
  };

  // ── Loading / connecting state ────────────────────────────────────────
  const showConnectingOverlay = isConnecting && messages.length === 0;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {renderHeader()}

      {showConnectingOverlay ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading conversation…</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => String(item.message_id)}
          renderItem={renderMessage}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <Text style={[styles.emptyChatText, { color: colors.textSecondary }]}>
                No messages yet. Say hello! 👋
              </Text>
            </View>
          }
        />
      )}

      {replyTarget && (
        <View style={[styles.replyBar, { borderTopColor: colors.border, backgroundColor: colors.background }]}>
          <CornerUpLeft color={colors.primary} size={16} />
          <View style={styles.replyBarBody}>
            <Text style={[styles.replyBarName, { color: colors.primary }]}>{nameForSender(replyTarget.sender_id)}</Text>
            <Text style={[styles.replyBarText, { color: colors.textSecondary }]} numberOfLines={1}>
              {replyTarget.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyTarget(null)} style={styles.replyBarClose}>
            <X color={colors.textSecondary} size={16} />
          </TouchableOpacity>
        </View>
      )}

      <View style={[styles.inputBar, { borderTopColor: colors.border }]}>
        <TextInput
          style={[
            styles.input,
            { borderColor: colors.border, color: colors.textPrimary, height: inputHeight },
          ]}
          placeholder="Write a message..."
          placeholderTextColor={colors.textSecondary}
          value={draft}
          onChangeText={setDraft}
          multiline
          textAlignVertical="top"
          scrollEnabled={inputHeight >= INPUT_MAX_HEIGHT}
          onContentSizeChange={(e) => {
            const nextHeight = Math.max(
              INPUT_MIN_HEIGHT,
              Math.min(INPUT_MAX_HEIGHT, e.nativeEvent.contentSize.height + INPUT_VERTICAL_PADDING),
            );
            setInputHeight(nextHeight);
          }}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            { backgroundColor: draft.trim() && isConnected ? colors.primary : colors.ternary },
          ]}
          onPress={handleSend}
          disabled={!draft.trim() || !isConnected}
        >
          <ArrowUp color={colors.textPrimary} size={18} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

// Input grows line-by-line (like WhatsApp) up to 8 lines, then scrolls internally.
const INPUT_LINE_HEIGHT = 20;
const INPUT_VERTICAL_PADDING = SPACING.sm * 2;
const INPUT_MIN_HEIGHT = INPUT_LINE_HEIGHT + INPUT_VERTICAL_PADDING;
const INPUT_MAX_LINES = 8;
const INPUT_MAX_HEIGHT = INPUT_LINE_HEIGHT * INPUT_MAX_LINES + INPUT_VERTICAL_PADDING;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
  },
  backBtn: { paddingRight: SPACING.xs },
  avatarPlaceholder: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexShrink: 0 },
  avatar: { width: '100%', height: '100%' },
  avatarInitial: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.sm },
  headerInfo: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  organizerName: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#3EC15A' },
  onlineText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  viewProfileBtn: { paddingVertical: 7, paddingHorizontal: SPACING.sm, borderRadius: SHAPES.roundedSmall, borderWidth: 1, flexShrink: 0 },
  viewProfileText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold },

  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md },
  loadingText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily },

  list: { flex: 1 },
  listContent: { padding: SPACING.lg, paddingBottom: SPACING.lg, flexGrow: 1, justifyContent: 'flex-end' },
  dateLabel: { textAlign: 'center', fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: SPACING.md },

  emptyChat: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: SPACING.xl * 3 },
  emptyChatText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center' },

  messageBlock: { marginBottom: SPACING.sm },
  messageRow: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.xs },
  messageRowLeft: { justifyContent: 'flex-start' },
  messageRowRight: { justifyContent: 'flex-end' },
  avatarSlot: { width: 28, alignItems: 'center' },
  smallAvatarPlaceholder: { width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  smallAvatarInitial: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.xs },

  bubble: { maxWidth: '75%', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.sm, borderRadius: SHAPES.roundedMedium },
  bubbleOther: { borderBottomLeftRadius: 4 },
  bubbleMine: { borderBottomRightRadius: 4 },
  bubbleSending: { opacity: 0.65 },
  bubbleText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 19 },

  replyPreview: {
    borderLeftWidth: 3,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  replyPreviewName: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 1 },
  replyPreviewText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  metaRowLeft: { justifyContent: 'flex-start', paddingLeft: 36 },
  metaRowRight: { justifyContent: 'flex-end' },
  timeText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },

  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
  },
  replyBarBody: { flex: 1, minWidth: 0 },
  replyBarName: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold },
  replyBarText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  replyBarClose: { padding: SPACING.xs },

  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: SPACING.sm, padding: SPACING.md, borderTopWidth: 1 },
  input: { flex: 1, borderWidth: 1, borderRadius: SHAPES.roundedMedium, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily },
  sendBtn: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', flexShrink: 0 },
});