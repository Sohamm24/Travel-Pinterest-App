import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Route } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import { useMyOrganizerTrips } from './hooks';
import TripCards from './components/TripCards';
import type { OrganizerTrip } from './types';


function EmptyState({ onCreateTrip, colors }: { onCreateTrip: () => void; colors: any }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={[styles.banner, { backgroundColor: colors.dim }]}>
        <Text style={[styles.bannerHeading, { color: colors.textPrimary }]}>
          Design trips, share itineraries, and lead your community
        </Text>
        <TouchableOpacity style={[styles.bannerButton, { backgroundColor: colors.background }]} onPress={onCreateTrip} activeOpacity={0.85}>
          <Text style={[styles.bannerButtonText, { color: colors.textPrimary }]}>Create your first trip as Organizer</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PopulatedState({ trips, onCreateTrip, onTripPress, colors }: { trips: OrganizerTrip[]; onCreateTrip: () => void; onTripPress: (trip: OrganizerTrip) => void; colors: any }) {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const filtered = trips.filter((t) => activeTab === 'active' ? t.is_active !== false : t.is_active === false);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, { borderColor: colors.border }, activeTab === 'active' && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setActiveTab('active')}>
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'active' && { color: colors.background }]}>Active Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, { borderColor: colors.border }, activeTab === 'inactive' && { backgroundColor: colors.primary, borderColor: colors.primary }]} onPress={() => setActiveTab('inactive')}>
          <Text style={[styles.tabText, { color: colors.textSecondary }, activeTab === 'inactive' && { color: colors.background }]}>In-Active Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.createBtn, { borderColor: colors.border }]} onPress={onCreateTrip}>
          <Text style={[styles.createBtnText, { color: colors.textPrimary }]}>Create New Trip</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TripCards trip={item} onPress={() => onTripPress(item)} />}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: SPACING.sm }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyTab}>
            <Route color={colors.ternary} size={32} />
            <Text style={[styles.emptyTabTitle, { color: colors.textPrimary }]}>No {activeTab} trips</Text>
            <Text style={[styles.emptyTabSub, { color: colors.textSecondary }]}>Create a new trip to see it here.</Text>
          </View>
        }
      />
    </View>
  );
}

export default function TripDashboard() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { data: trips, isLoading } = useMyOrganizerTrips();

  const handleCreateTrip = () => navigation.navigate('CreateTrip');
  const handleTripPress = (trip: OrganizerTrip) => navigation.navigate('TripDetails', { tripId: trip.id.toString() });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !trips || trips.length === 0 ? (
        <EmptyState onCreateTrip={handleCreateTrip} colors={colors} />
      ) : (
        <PopulatedState trips={trips} onCreateTrip={handleCreateTrip} onTripPress={handleTripPress} colors={colors} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 20 },
  loadingBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  banner: { borderRadius: SHAPES.roundedMedium, padding: SPACING.lg, marginBottom: SPACING.lg },
  bannerHeading: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold, lineHeight: 30, marginBottom: SPACING.md },
  bannerButton: { borderRadius: SHAPES.roundedMedium, paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, alignSelf: 'flex-start' },
  bannerButtonText: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm },
  stepsHeading: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold, letterSpacing: 0.6, marginBottom: SPACING.sm },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.md },
  stepIcon: { width: 32, height: 32, borderRadius: SHAPES.roundedSmall, justifyContent: 'center', alignItems: 'center' },
  stepLabel: { flex: 1, fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm },
  stepBody: { paddingLeft: 44, paddingBottom: SPACING.md, paddingRight: SPACING.xs },
  stepBodyInner: { borderLeftWidth: 2, paddingLeft: SPACING.sm },
  stepTitle: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm, marginBottom: 4 },
  stepDesc: { fontFamily: TYPOGRAPHY.fontFamily, fontSize: TYPOGRAPHY.sizes.sm, lineHeight: 20 },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  tab: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: SHAPES.roundedFull, borderWidth: 1.5 },
  tabText: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm },
  createBtn: { marginLeft: 'auto', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: SHAPES.roundedFull, borderWidth: 1.5 },
  createBtnText: { fontFamily: TYPOGRAPHY.fontFamilySemiBold, fontSize: TYPOGRAPHY.sizes.sm },
  emptyTab: { alignItems: 'center', paddingVertical: SPACING.xl, gap: SPACING.sm },
  emptyTabTitle: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.md },
  emptyTabSub: { fontFamily: TYPOGRAPHY.fontFamily, fontSize: TYPOGRAPHY.sizes.sm },
});
