import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Route } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import type { OrganizerTrip } from '../types';

function formatDate(dateStr?: string): { month: string; day: string } | null {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return {
    month: d.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
    day: String(d.getDate()).padStart(2, '0'),
  };
}

function DateChip({ label, colors }: { label: { month: string; day: string }; colors: any }) {
  return (
    <View style={[styles.dateChip, { backgroundColor: colors.surface }]}>
      <Text style={[styles.dateChipMonth, { color: colors.textSecondary }]}>{label.month}</Text>
      <Text style={[styles.dateChipDay, { color: colors.textPrimary }]}>{label.day}</Text>
    </View>
  );
}

export default function TripCards({ trip, onPress }: { trip: OrganizerTrip; onPress: () => void }) {
  const { colors } = useTheme();
  const start = formatDate(trip.start_date);
  const end = formatDate(trip.end_date);
  return (
    <TouchableOpacity style={[styles.tripCard, { backgroundColor: colors.background, borderColor: colors.border }]} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.tripCardTop}>
        {trip.thumbnail ? (
          <Image source={{ uri: trip.thumbnail }} style={styles.tripImage} />
        ) : (
          <View style={[styles.tripImage, styles.tripImagePlaceholder, { backgroundColor: colors.dim }]}>
            <Route color={colors.ternary} size={24} />
          </View>
        )}
        <View style={styles.tripInfo}>
          <Text style={[styles.tripTitle, { color: colors.textPrimary }]} numberOfLines={2}>{trip.title}</Text>
          {trip.location?.name ? (
            <Text style={[styles.tripLocation, { color: colors.secondary }]}>From {trip.location.name}</Text>
          ) : null}
        </View>
      </View>

      {trip.interested_count !== undefined && (
        <View style={styles.interestedRow}>
          <View style={[styles.dot, { backgroundColor: colors.secondary }]} />
          <Text style={[styles.interestedText, { color: colors.textSecondary }]}>{trip.interested_count} People are interested</Text>
        </View>
      )}

      <View style={[styles.tripStats, { borderTopColor: colors.border }]}>
        <View style={[styles.statCell, styles.statBorderRight, { borderRightColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Dates</Text>
          <View style={styles.dateRow}>
            {start ? <DateChip label={start} colors={colors} /> : null}
            {end ? <DateChip label={end} colors={colors} /> : null}
            {!start && !end ? <Text style={[styles.statValue, { color: colors.textPrimary }]}>—</Text> : null}
          </View>
        </View>

        <View style={[styles.statCell, styles.statBorderRight, { borderRightColor: colors.border, paddingHorizontal: SPACING.md }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Budget</Text>
          <Text style={[styles.statValueLg, { color: colors.textPrimary }]}>
            {trip.budget ? `₹ ${trip.budget.toLocaleString('en-IN')}` : '—'}
          </Text>
        </View>

        <View style={[styles.statCell, { paddingLeft: SPACING.md }]}>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Seats Filled</Text>
          <Text style={[styles.statValueLg, { color: colors.textPrimary }]}>
            {trip.seats_filled !== undefined && trip.max_travellers !== undefined
              ? `${trip.seats_filled}/${trip.max_travellers}`
              : '—'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tripCard: { borderWidth: 1, borderRadius: SHAPES.roundedLarge, padding: SPACING.md, marginBottom: SPACING.sm },
  tripCardTop: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  tripImage: { width: 64, height: 64, borderRadius: SHAPES.roundedMedium, flexShrink: 0 },
  tripImagePlaceholder: { justifyContent: 'center', alignItems: 'center' },
  tripInfo: { flex: 1 },
  tripTitle: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.md, lineHeight: 22 },
  tripLocation: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm, marginTop: 4 },
  interestedRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: SPACING.sm, justifyContent: 'flex-end' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  interestedText: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.xs },
  tripStats: { flexDirection: 'row', borderTopWidth: 1, paddingTop: SPACING.sm },
  statCell: { flex: 1 },
  statBorderRight: { borderRightWidth: 1, paddingRight: SPACING.sm },
  statLabel: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.xs, marginBottom: 4 },
  statValue: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm },
  statValueLg: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.lg },
  dateRow: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  dateChip: { borderRadius: SHAPES.roundedSmall, paddingHorizontal: SPACING.sm, paddingVertical: 2, alignItems: 'center' },
  dateChipMonth: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: 9 },
  dateChipDay: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.sm },
});
