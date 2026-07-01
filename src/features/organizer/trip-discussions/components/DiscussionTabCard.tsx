import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MessageCircle } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import type { TripDiscussion } from '../types';

export default function DiscussionTabCard({ item, onPress }: { item: TripDiscussion; onPress: () => void }) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!item.discussion_id}
    >
      {item.cover_image ? (
        <Image source={{ uri: item.cover_image }} style={styles.cardImage} />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder, { backgroundColor: colors.dim }]}>
          <MessageCircle color={colors.ternary} size={24} />
        </View>
      )}

      <View style={styles.cardContent}>
        <Text style={[styles.tripTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        
        {item.has_new_activity && (
          <View style={styles.badgeRow}>
            <View style={[styles.badgeDot, { backgroundColor: colors.confirmation }]} />
            <Text style={[styles.badgeText, { color: colors.confirmation }]}>new activity</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: SHAPES.roundedMedium, marginBottom: SPACING.sm, overflow: 'hidden', minHeight: 80 },
  cardImage: { width: 80, height: 80, flexShrink: 0 },
  cardImagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, justifyContent: 'center' },
  tripTitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 4 },
  badgeText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
});