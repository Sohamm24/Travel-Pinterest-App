import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { ChevronLeft, Clock, MapPin } from 'lucide-react-native';
import { useItinerary } from '../hooks';

export default function ViewItinerary() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { tripId } = route.params;
  const { data, isLoading } = useItinerary(tripId);

  const itinerary = data?.itinerary || [];

  if (isLoading) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Itinerary</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {itinerary.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No itinerary available</Text>
          </View>
        ) : (
          itinerary.map((day: any, di: number) => (
            <View key={di} style={[styles.dayCard, { backgroundColor: colors.surface, borderLeftColor: colors.secondary }]}>
              <View style={[styles.dayBadge, { backgroundColor: colors.primary }]}>
                <Text style={[styles.dayBadgeText, { color: colors.background }]}>Day {day.day_number}</Text>
              </View>
              {(day.activities || []).map((act: any, ai: number) => (
                <View key={ai} style={[styles.actCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.actTitle, { color: colors.textPrimary }]}>{act.title}</Text>
                  {act.description ? <Text style={[styles.actDesc, { color: colors.textSecondary }]}>{act.description}</Text> : null}
                  <View style={styles.actMeta}>
                    {act.location ? (
                      <View style={styles.actMetaRow}>
                        <MapPin color={colors.secondary} size={12} />
                        <Text style={[styles.actMetaText, { color: colors.textSecondary }]}>{act.location}</Text>
                      </View>
                    ) : null}
                    {act.start_time || act.end_time ? (
                      <View style={styles.actMetaRow}>
                        <Clock color={colors.textSecondary} size={12} />
                        <Text style={[styles.actMetaText, { color: colors.textSecondary }]}>{act.start_time || ''}{act.end_time ? ` - ${act.end_time}` : ''}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
  emptyBox: { alignItems: 'center', paddingTop: SPACING.xl * 2 },
  emptyText: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamily },
  dayCard: { borderRadius: SHAPES.roundedLarge, padding: SPACING.md, marginBottom: SPACING.md, borderLeftWidth: 3, gap: SPACING.sm },
  dayBadge: { paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: SHAPES.roundedFull, alignSelf: 'flex-start' },
  dayBadgeText: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.xs },
  actCard: { padding: SPACING.md, borderRadius: SHAPES.roundedSmall, borderWidth: 1 },
  actTitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginBottom: 4 },
  actDesc: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 20, marginBottom: SPACING.xs },
  actMeta: { gap: 4 },
  actMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actMetaText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
});
