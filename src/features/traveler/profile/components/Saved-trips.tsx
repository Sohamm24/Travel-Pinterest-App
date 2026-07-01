import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bookmark, MapPin, Calendar } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { useSavedTrips } from '../hooks';

function TripCard({ item, colors, onPress }: { item: any; colors: any; onPress: () => void }) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={[styles.cardImage, { backgroundColor: colors.ternary }]}>
        <Bookmark color={colors.primary} size={28} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: colors.textPrimary }]} numberOfLines={2}>
          {item.title}
        </Text>
        {item.location?.name ? (
          <View style={styles.metaRow}>
            <MapPin color={colors.textSecondary} size={13} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.location.name}</Text>
          </View>
        ) : null}
        {item.start_date ? (
          <View style={styles.metaRow}>
            <Calendar color={colors.textSecondary} size={13} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{item.start_date}</Text>
          </View>
        ) : null}
        <View style={[styles.budgetBadge, { backgroundColor: colors.dim }]}>
          <Text style={[styles.budgetText, { color: colors.primary }]}>
            ₹ {item.budget?.toLocaleString('en-IN') ?? 'TBD'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SavedTrips() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data: trips, isLoading } = useSavedTrips();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Saved Trips</Text>
        <View style={{ width: 40 }} />
      </View>

      {isLoading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.trip_id}
          renderItem={({ item }) => (
            <TripCard
              item={item}
              colors={colors}
              onPress={() => navigation.navigate('TripDetails', { tripId: item.trip_id })}
            />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Bookmark color={colors.textSecondary} size={48} />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No saved trips yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Trips you bookmark will appear here so you can easily find them later.
              </Text>
            </View>
          }
        />
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
  list: { padding: SPACING.md, gap: SPACING.md },
  card: { flexDirection: 'row', borderRadius: SHAPES.roundedMedium, overflow: 'hidden' },
  cardImage: { width: 90, height: 90, justifyContent: 'center', alignItems: 'center' },
  cardContent: { flex: 1, padding: SPACING.md, gap: 4 },
  cardTitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  budgetBadge: { alignSelf: 'flex-start', paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: SHAPES.roundedFull, marginTop: 4 },
  budgetText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptyBox: { padding: SPACING.xl * 2, alignItems: 'center', gap: SPACING.md },
  emptyTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptySubtitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center', lineHeight: 20 },
});
