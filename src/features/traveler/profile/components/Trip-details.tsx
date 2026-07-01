import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, MapPin, Calendar, Clock } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { useTripHistory } from '../hooks';

function TripItem({ trip, colors, onPress }: { trip: any; colors: any; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.tripCard, { backgroundColor: colors.surface }]} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.tripAccent, { backgroundColor: colors.secondary }]} />
      <View style={styles.tripContent}>
        <Text style={[styles.tripTitle, { color: colors.textPrimary }]} numberOfLines={2}>{trip.title}</Text>
        {trip.location?.name && (
          <View style={styles.metaRow}>
            <MapPin color={colors.textSecondary} size={12} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{trip.location.name}</Text>
          </View>
        )}
        {trip.start_date && (
          <View style={styles.metaRow}>
            <Calendar color={colors.textSecondary} size={12} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{trip.start_date}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function TripDetailsHistory() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data, isLoading } = useTripHistory();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>My Trips</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {(data?.upcoming?.length ?? 0) > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <Clock color={colors.primary} size={16} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Upcoming</Text>
              </View>
              {data!.upcoming.map((trip: any) => (
                <TripItem key={trip.trip_id} trip={trip} colors={colors} onPress={() => navigation.navigate('TripDetails', { tripId: trip.trip_id })} />
              ))}
            </View>
          )}

          {(data?.past?.length ?? 0) > 0 && (
            <View>
              <View style={styles.sectionHeader}>
                <MapPin color={colors.textSecondary} size={16} />
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Past Trips</Text>
              </View>
              {data!.past.map((trip: any) => (
                <TripItem key={trip.trip_id} trip={trip} colors={colors} onPress={() => navigation.navigate('TripDetails', { tripId: trip.trip_id })} />
              ))}
            </View>
          )}

          {!data?.upcoming?.length && !data?.past?.length && (
            <View style={styles.emptyBox}>
              <MapPin color={colors.textSecondary} size={48} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No trips yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Your upcoming and past trips will appear here.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  content: { padding: SPACING.md, gap: SPACING.sm, paddingBottom: 60 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilyBold },
  tripCard: { flexDirection: 'row', borderRadius: SHAPES.roundedMedium, overflow: 'hidden', marginBottom: SPACING.sm },
  tripAccent: { width: 4 },
  tripContent: { flex: 1, padding: SPACING.md, gap: 4 },
  tripTitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  emptyBox: { paddingTop: SPACING.xl * 2, alignItems: 'center', gap: SPACING.md },
  emptyTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptySubtitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center', lineHeight: 20 },
});
