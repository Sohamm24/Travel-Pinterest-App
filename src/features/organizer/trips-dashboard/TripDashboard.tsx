import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Plus, Route } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import { useMyOrganizerTrips } from './hooks';
import TripCards from './components/TripCards';
import type { OrganizerTrip } from './types';
import { tripsDashboardApi } from './api';
import { useUserStore } from 'src/store/userStore';


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

function PopulatedState({ profile,trips, onCreateTrip, onTripPress, colors }: { profile: any; trips: OrganizerTrip[]; onCreateTrip: () => void; onTripPress: (trip: OrganizerTrip) => void; colors: any }) {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const filtered = trips.filter((t) => activeTab === 'active' ? t.is_active !== false : t.is_active === false);

  return (
    <View style={{ flex: 1 }}>
     
        {/* Top Row */}
        <View style={styles.topRow}>
          <Image 
            source={require('../../../../assets/logo-header.png')} 
            style={styles.logo} 
            resizeMode='contain'
          />
          <TouchableOpacity
            style={[
              styles.createIconBtn,
              { backgroundColor: colors.background },
            ]}
            onPress={onCreateTrip}
            activeOpacity={0.8}
          >
            <Plus
              size={22}
              color={colors.primary}
              strokeWidth={2.5}
            />
          </TouchableOpacity>
        </View>


        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: colors.border },
              activeTab === 'active' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveTab('active')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === 'active' && {
                  color: colors.background,
                },
              ]}
            >
              Active Trips
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={[
              styles.tab,
              { borderColor: colors.border },
              activeTab === 'inactive' && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setActiveTab('inactive')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === 'inactive' && {
                  color: colors.background,
                },
              ]}
            >
              Inactive Trips
            </Text>
          </TouchableOpacity>
        </View>
   
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.trip_id)}
        renderItem={({ item }) => <TripCards trip={item} onPress={() => onTripPress(item)} />}
        contentContainerStyle={{ paddingBottom: 100 }}
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
  const { data: trips = [], isLoading } = useMyOrganizerTrips();
  const { profile } = useUserStore();

  const handleCreateTrip = async () => {
    try {
      const { trip_id } = await tripsDashboardApi.createEmptyDraft();
      navigation.navigate('CreateTrip', { tripId: trip_id });
    } catch (err) {
      Alert.alert('Error', 'Could not start a new trip. Please try again.');
    }
  };
  
  const handleTripPress = (trip: OrganizerTrip) => {
    if (trip.status.toLowerCase() === "draft") {
      navigation.navigate('CreateTrip', {
        tripId: trip.trip_id.toString(),
      });
    } else {
      navigation.navigate('TripDetails', {
        tripId: trip.trip_id.toString(),
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {isLoading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      ) : !trips || trips.length === 0 ? (
        <EmptyState onCreateTrip={handleCreateTrip} colors={colors} />
      ) : (
        <PopulatedState profile={profile} trips={trips} onCreateTrip={handleCreateTrip} onTripPress={handleTripPress} colors={colors} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  loadingBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  banner: {
    borderRadius: SHAPES.roundedMedium,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  bannerHeading: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    lineHeight: 30,
    marginBottom: SPACING.md,
  },

  bannerButton: {
    borderRadius: SHAPES.roundedMedium,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignSelf: 'flex-start',
  },

  bannerButtonText: {
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },

  stepsHeading: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    letterSpacing: 0.6,
  },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm
  },

  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: SHAPES.roundedSmall,
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepLabel: {
    flex: 1,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },

  stepBody: {
    paddingLeft: 44,
    paddingBottom: SPACING.md,
    paddingRight: SPACING.xs,
  },

  stepBodyInner: {
    borderLeftWidth: 2,
    paddingLeft: SPACING.sm,
  },

  stepTitle: {
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    fontSize: TYPOGRAPHY.sizes.sm,
    marginBottom: 4,
  },

  stepDesc: {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 20,
  },

  // ---------- NEW LAYOUT ----------
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
    alignItems: 'center',
    gap: SPACING.sm,
  },

  createIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  tab: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: SHAPES.roundedFull,
    borderWidth: 1.5,
  },

  tabText: {
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    fontSize: TYPOGRAPHY.sizes.sm,
  },

  emptyTab: {
    alignItems: 'center',
    gap: SPACING.sm,
  },

  emptyTabTitle: {
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    fontSize: TYPOGRAPHY.sizes.md,
  },

  emptyTabSub: {
    fontFamily: TYPOGRAPHY.fontFamily,
    fontSize: TYPOGRAPHY.sizes.sm,
  },
});
