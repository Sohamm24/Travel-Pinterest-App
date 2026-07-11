import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import { ShieldCheck, Check, CheckCheck, MessageCircle } from 'lucide-react-native';
import { Message, MessageStatus, UserChat } from '../types';
import { formatChatTimestamp } from 'src/utils/helpers';
import { useAuthStore } from '../../../store/authStore';
import { useUserChats } from '../hooks';

export default function ChatsScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const userId = useAuthStore((s) => s.userId) ?? '';
  const { chats, isLoading, error, refetch } = useUserChats();

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const renderTicks = (message: Message) => {
    if (message.sender_id !== userId) return null;

    if (message.status === MessageStatus.READ) {
      return <CheckCheck color={colors.primary} size={14} />;
    }
    if (message.status === MessageStatus.DELIVERED) {
      return <CheckCheck color={colors.textSecondary} size={14} />;
    }
    return <Check color={colors.textSecondary} size={14} />;
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Image
        source={require('../../../../assets/logo-header.png')}
        style={styles.logo}
        resizeMode='contain'
      />
      <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Messages</Text>
    </View>
  );

  const renderChatCard = ({ item }: { item: UserChat }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('ChatMessages', {
          organizerUserId: item.user.user_id,
          organizerName: item.user.name,
          organizerPic: item.user.profile_pic ?? null,
          organizerProfileId: item.user.organizer_id ?? null,
          isVerified: item.user.is_verified ?? false,
        })
      }
    >
      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.ternary }]}>
        {item.user.profile_pic ? (
          <Image source={{ uri: item.user.profile_pic }} style={styles.avatar} />
        ) : (
          <Text style={[styles.avatarInitial, { color: colors.primary }]}>{getInitials(item.user.name)}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.chatName, { color: colors.textPrimary }]}>{item.user.name}</Text>
          {item.user.is_verified && <ShieldCheck color={colors.primary} fill={colors.primary} size={15} />}
        </View>
        {item.last_message ? (
          <View style={styles.messagePreviewRow}>
            {renderTicks(item.last_message)}
            <Text
              style={[styles.previewText, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {item.last_message.is_deleted ? 'Message deleted' : item.last_message.text}
            </Text>
          </View>
        ) : (
          <Text style={[styles.previewText, { color: colors.textSecondary }]}>Start a conversation</Text>
        )}
      </View>

      <View style={styles.metaCol}>
        {item.last_message && (
          <Text style={[styles.timeText, { color: colors.textSecondary }]}>
            {formatChatTimestamp(item.last_message.created_at)}
          </Text>
        )}
        {item.unread_count > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: colors.secondary }]}>
            <Text style={styles.unreadText}>{item.unread_count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MessageCircle color={colors.textSecondary} size={48} />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {error ? error : 'Messages to Organizers will appear here'}
      </Text>
      {error && (
        <TouchableOpacity onPress={refetch} style={[styles.retryBtn, { borderColor: colors.primary }]}>
          <Text style={[styles.retryText, { color: colors.primary }]}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {renderHeader()}
      <FlatList
        data={chats}
        keyExtractor={(item) => item.user_chat_id}
        renderItem={renderChatCard}
        contentContainerStyle={styles.listContent}
        onRefresh={refetch}
        refreshing={isLoading && chats.length > 0}
        ListFooterComponent={
          isLoading && chats.length === 0 ? (
            <ActivityIndicator color={colors.primary} style={{ padding: SPACING.md }} />
          ) : null
        }
        ListEmptyComponent={!isLoading ? renderEmptyState : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    paddingTop: SPACING.xl,
    paddingLeft: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  logo: {
    width: 80,
    height: 80,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    textAlign: 'center',
  },
  listContent: { padding: SPACING.lg, paddingBottom: 100, flexGrow: 1 },
  card: { marginBottom: SPACING.sm, paddingVertical: SPACING.sm, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexShrink: 0 },
  avatar: { width: '100%', height: '100%' },
  avatarInitial: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.md },
  infoContainer: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  chatName: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  messagePreviewRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  previewText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, flexShrink: 1 },
  metaCol: { alignItems: 'flex-end', gap: SPACING.xs, flexShrink: 0 },
  timeText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  unreadBadge: { minWidth: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 5 },
  unreadText: { color: '#FFFFFF', fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: SPACING.md, marginTop: SPACING.xl * 4 },
  emptyText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center' },
  retryBtn: { borderWidth: 1, borderRadius: SHAPES.roundedSmall, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  retryText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilyBold },
});