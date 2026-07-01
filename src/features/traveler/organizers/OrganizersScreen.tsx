import React, { useState } from 'react';
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
import { ShieldCheck, Star, MapPin, Sparkles } from 'lucide-react-native';
import { useOrganizers } from './hooks';

export default function OrganizersScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading } = useOrganizers(searchQuery);
  const organizers = data?.organizers || [];

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((w) => w[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

  const renderHeader = () => (
    <>
      <View style={[styles.ctaBanner, { backgroundColor: colors.dim }]}>
        <View style={styles.ctaDeco}>
          <View style={[styles.ctaDot, { opacity: 0.3, backgroundColor: colors.primary }]} />
          <View style={[styles.ctaDot, { opacity: 0.5, backgroundColor: colors.primary }]} />
          <View style={[styles.ctaDot, { opacity: 0.9, backgroundColor: colors.primary }]} />
        </View>

        <View style={styles.ctaEyebrow}>
          <Sparkles color={colors.primary} size={12} />
          <Text style={[styles.ctaEyebrowText, { color: colors.primary }]}>Featured this month</Text>
        </View>

        <Text style={[styles.ctaHeadline, { color: colors.textPrimary }]}>
          Your next adventure{"\n"}starts with the{" "}
          <Text style={[styles.ctaHeadlineAccent, { color: colors.primary }]}>right guide</Text>
        </Text>

        <Text style={[styles.ctaSub, { color: colors.textSecondary }]}>
          Hand-picked organizers with verified reviews, real routes, and zero fluff.
        </Text>
      </View>

      <View>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Suggested organizers</Text>
      </View>
    </>
  );

  const renderOrganizerCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
      onPress={() => navigation.navigate('OrganizerPublicProfile', { organizerId: item.organizer_id })}
    >
      <View style={[styles.avatarPlaceholder, { backgroundColor: colors.ternary }]}>
        {item.profile_pic ? (
          <Image source={{ uri: item.profile_pic }} style={styles.avatar} />
        ) : (
          <Text style={[styles.avatarInitial, { color: colors.primary }]}>{getInitials(item.name || 'Org')}</Text>
        )}
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={[styles.organizerName, { color: colors.textPrimary }]}>{item.name}</Text>
          {item.verification_status && (
            <ShieldCheck color={colors.secondary} size={15} />
          )}
        </View>
        {item.bio && (
          <Text style={[styles.bioText, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.bio}
          </Text>
        )}
        <View style={styles.metaRow}>
          <View style={styles.ratingRow}>
            <Star color="#E8A020" fill="#E8A020" size={11} />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {item.rating || '4.5'} ({item.reviews || 0} reviews)
            </Text>
          </View>
          <View style={styles.tripsChip}>
            <MapPin color={colors.textSecondary} size={11} />
            <Text style={[styles.tripsText, { color: colors.textSecondary }]}>{item.trip_count || 0} trips</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.viewBtn, { borderColor: colors.primary }]}
        onPress={() => navigation.navigate('OrganizerPublicProfile', { organizerId: item.organizer_id })}
      >
        <Text style={[styles.viewBtnText, { color: colors.primary }]}>View profile</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={organizers}
        keyExtractor={(item) => item.organizer_id || String(Math.random())}
        renderItem={renderOrganizerCard}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator color={colors.primary} style={{ padding: SPACING.md }} />
          ) : null
        }
        ListEmptyComponent={
          !isLoading ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No organizers found</Text>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContent: { padding: SPACING.lg, paddingBottom: 100 },
  ctaBanner: { borderRadius: SHAPES.roundedMedium, padding: SPACING.lg, marginBottom: SPACING.md, marginTop: SPACING.xl, overflow: 'hidden' },
  ctaDeco: { position: 'absolute', top: 14, right: 14, flexDirection: 'row', gap: 4 },
  ctaDot: { width: 6, height: 6, borderRadius: 3 },
  ctaEyebrow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: SPACING.xs },
  ctaEyebrowText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold, textTransform: 'uppercase', letterSpacing: 0.8 },
  ctaHeadline: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold, lineHeight: 26, marginBottom: SPACING.xs },
  ctaHeadlineAccent: {},
  ctaSub: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 20, marginBottom: SPACING.md },
  sectionLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold, textTransform: 'uppercase', letterSpacing: 0.7, marginBottom: SPACING.sm, marginTop: SPACING.xs },
  card: { marginBottom: SPACING.sm, padding: SPACING.md, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderBottomWidth: 1 },
  avatarPlaceholder: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', flexShrink: 0 },
  avatar: { width: '100%', height: '100%' },
  avatarInitial: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.md },
  infoContainer: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  organizerName: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  bioText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  tripsChip: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  tripsText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  viewBtn: { paddingVertical: 7, paddingHorizontal: SPACING.sm, borderRadius: SHAPES.roundedSmall, borderWidth: 0.5, flexShrink: 0 },
  viewBtnText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptyText: { textAlign: 'center', fontFamily: TYPOGRAPHY.fontFamily, marginTop: SPACING.xl },
});
