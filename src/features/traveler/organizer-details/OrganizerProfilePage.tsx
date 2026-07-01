import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ChevronLeft, ShieldCheck, Star, MapPin, Mail, Phone } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import { useOrganizerDetails, useOrganizerTrips } from './hooks';
import OrganizerTripCards from './components/OrganizerTripCards';

export default function OrganizerProfilePage() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { organizerId } = route.params;

  const { data: organizer, isLoading: loadingOrg } = useOrganizerDetails(organizerId);
  const { trips, isLoading: loadingTrips, isFetchingMore, hasMore, loadMore } = useOrganizerTrips(organizerId);

  const getInitials = (name?: string) =>
    (name || 'O')
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const renderHeader = () => {
    if (loadingOrg) {
      return (
        <View style={styles.loaderBox}>
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      );
    }
    if (!organizer) return null;

    return (
      <View style={styles.headerContent}>
        <View style={styles.profileSection}>
          <View style={[styles.avatarContainer, { borderColor: colors.primary }]}>
            {organizer.profile_pic ? (
              <Image source={{ uri: organizer.profile_pic }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.dim }]}>
                <Text style={[styles.avatarInitial, { color: colors.primary }]}>
                  {getInitials(organizer.name)}
                </Text>
              </View>
            )}
            {organizer.verification_status && (
              <View style={styles.verifiedBadge}>
                <ShieldCheck color={colors.secondary} size={16} fill="#fff" />
              </View>
            )}
          </View>

          <Text style={[styles.nameText, { color: colors.textPrimary }]}>{organizer.name}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBadge}>
              <Star color="#E8A020" fill="#E8A020" size={14} />
              <Text style={[styles.statText, { color: colors.textPrimary }]}>
                {organizer.rating || '4.5'} <Text style={{ color: colors.textSecondary }}>({organizer.reviews || 0})</Text>
              </Text>
            </View>
            <View style={styles.statBadge}>
              <MapPin color={colors.secondary} size={14} />
              <Text style={[styles.statText, { color: colors.textPrimary }]}>
                {organizer.trip_count || 0} <Text style={{ color: colors.textSecondary }}>Trips</Text>
              </Text>
            </View>
          </View>

          {organizer.bio ? (
            <Text style={[styles.bioText, { color: colors.textSecondary }]}>{organizer.bio}</Text>
          ) : null}

          <View style={[styles.contactBox, { backgroundColor: colors.surface }]}>
            <View style={styles.contactRow}>
              <Mail color={colors.textSecondary} size={16} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>{organizer.contact_email || 'Contact not provided'}</Text>
            </View>
            <View style={styles.contactRow}>
              <Phone color={colors.textSecondary} size={16} />
              <Text style={[styles.contactText, { color: colors.textSecondary }]}>{organizer.phone || 'Phone not provided'}</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Upcoming Trips</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Organizer Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <OrganizerTripCards
        trips={trips}
        isLoading={loadingTrips}
        isFetchingMore={isFetchingMore}
        hasMore={hasMore}
        onLoadMore={loadMore}
        onTripPress={(tripId) => navigation.push('TripDetails', { tripId })}
        ListHeaderComponent={renderHeader() ?? undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  loaderBox: { padding: SPACING.xl * 2, alignItems: 'center' },
  headerContent: { paddingBottom: SPACING.md },
  profileSection: { alignItems: 'center', padding: SPACING.xl, gap: SPACING.md },
  avatarContainer: { position: 'relative', width: 90, height: 90, borderRadius: 45, borderWidth: 3, padding: 2 },
  avatarPlaceholder: { width: '100%', height: '100%', borderRadius: 45, justifyContent: 'center', alignItems: 'center' },
  avatar: { width: '100%', height: '100%', borderRadius: 45 },
  avatarInitial: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  verifiedBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#fff', borderRadius: 10 },
  nameText: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  statsRow: { flexDirection: 'row', gap: SPACING.md },
  statBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  bioText: { textAlign: 'center', fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 22, paddingHorizontal: SPACING.lg },
  contactBox: { width: '100%', borderRadius: SHAPES.roundedMedium, padding: SPACING.md, gap: SPACING.sm, marginTop: SPACING.sm },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  contactText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily },
  sectionHeader: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
});