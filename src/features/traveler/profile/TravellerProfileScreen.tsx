import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Sun,
  Star,
  Bookmark,
  MessageSquare,
  Info,
  Phone,
  Settings,
  LogOut,
  ChevronRight,
  ArrowRightLeft,
  MapPin,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';
import { useAuthStore } from '../../../store/authStore';
import { useUserStore } from '../../../store/userStore';
import { api } from '../../../services/api';
import { useProfile } from './hooks';

const Avatar = ({ name, colors }: { name?: string; colors: any }) => (
  <View style={[styles.avatarPlaceholder, { backgroundColor: colors.ternary }]}>
    <Text style={[styles.avatarInitial, { color: colors.primary }]}>{name?.[0]?.toUpperCase() ?? 'U'}</Text>
  </View>
);

const SectionHeader = ({ title, colors }: { title: string; colors: any }) => (
  <View style={styles.sectionHeader}>
    <View style={[styles.sectionBar, { backgroundColor: colors.secondary }]} />
    <Text style={[styles.sectionHeaderText, { color: colors.textPrimary }]}>{title}</Text>
  </View>
);

const MenuItem = ({ icon, label, onPress, colors, danger }: { icon: React.ReactNode; label: string; onPress?: () => void; colors: any; danger?: boolean }) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.menuItemLeft}>
      {icon}
      <Text style={[styles.menuItemLabel, { color: danger ? colors.error : colors.textPrimary }]}>{label}</Text>
    </View>
    <ChevronRight color={colors.textSecondary} size={18} />
  </TouchableOpacity>
);

const StatCard = ({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: number | string; colors: any }) => (
  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
    {icon}
    <View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  </View>
);

export default function TravellerProfileScreen() {
  const { logout } = useAuthStore();
  const { profile, isOrganizer, setOrganizerMode, setOrganizerId } = useUserStore();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [switching, setSwitching] = useState(false);

  const { isLoading, refetch } = useProfile();

  const handleBecomeOrganizer = async () => {
    setSwitching(true);
    try {
      if (!isOrganizer) {
        const res = await api.becomeOrganizer();
        setOrganizerId(res.data.organizer_id);
        await refetch();
      }
      setOrganizerMode(true);
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Failed to switch to organizer mode';
      if (msg.includes('already')) {
        setOrganizerMode(true);
      } else {
        Alert.alert('Error', msg);
      }
    } finally {
      setSwitching(false);
    }
  };

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    await logout();
  };

  if (isLoading && !profile) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.dim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={styles.profileCardLeft}>
            <Avatar name={profile?.name} colors={colors} />
            <View>
              <Text style={[styles.userName, { color: colors.textPrimary }]}>{profile?.name ?? 'User'}</Text>
              <TouchableOpacity style={styles.editProfileRow} onPress={() => navigation.navigate('EditProfile')}>
                <Text style={[styles.editProfileText, { color: colors.primary }]}>Edit Profile </Text>
                <ChevronRight color={colors.primary} size={14} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon={<MapPin color={colors.textSecondary} size={22} />}
            label="upcoming trips"
            value={0}
            colors={colors}
          />
          <StatCard
            icon={<Star color={colors.textSecondary} size={22} />}
            label="previous trips"
            value={0}
            colors={colors}
          />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SectionHeader title="preferences" colors={colors} />
          <MenuItem icon={<Sun color={colors.textSecondary} size={20} />} label="appearance" onPress={() => navigation.navigate('Appearance')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon={<Bookmark color={colors.textSecondary} size={20} />} label="saved trips" onPress={() => navigation.navigate('SavedTrips')} colors={colors} />
        </View>

        <View style={[styles.sectionCard, { backgroundColor: colors.surface }]}>
          <SectionHeader title="more" colors={colors} />
          <MenuItem icon={<MessageSquare color={colors.textSecondary} size={20} />} label="your reviews" onPress={() => navigation.navigate('Reviews')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon={<Info color={colors.textSecondary} size={20} />} label="about us" onPress={() => navigation.navigate('AboutUs')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon={<Phone color={colors.textSecondary} size={20} />} label="customer care" onPress={() => navigation.navigate('CustomerCare')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon={<Settings color={colors.textSecondary} size={20} />} label="settings" onPress={() => navigation.navigate('Settings')} colors={colors} />
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <MenuItem icon={<LogOut color={colors.error} size={20} />} label="logout" onPress={handleLogout} colors={colors} danger />
        </View>

        <View style={[styles.organizerBanner, { backgroundColor: colors.ternary }]}>
          <View style={styles.organizerBannerLeft}>
            <ArrowRightLeft color={colors.primary} size={24} />
            <Text style={[styles.organizerBannerText, { color: colors.textPrimary }]}>
              Plan trips, lead groups, and{'\n'}make every journey memorable
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.organizerButton, { backgroundColor: colors.background }]}
            onPress={handleBecomeOrganizer}
            disabled={switching}
          >
            {switching ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Text style={[styles.organizerButtonText, { color: colors.primary }]}>
                {isOrganizer ? 'Switch to Organizer' : 'Become Organizer'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: SPACING.lg, paddingTop: SPACING.xl + 20, paddingBottom: 100 },
  profileCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: SHAPES.roundedSmall, padding: SPACING.lg, marginBottom: SPACING.md },
  profileCardLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatarPlaceholder: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontFamily: TYPOGRAPHY.fontFamilyBold, fontSize: TYPOGRAPHY.sizes.xl },
  userName: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 2 },
  editProfileRow: { flexDirection: 'row', alignItems: 'center' },
  editProfileText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  statsRow: { flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md },
  statCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderRadius: SHAPES.roundedSmall, padding: SPACING.md },
  statLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 2 },
  statValue: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  sectionCard: { borderRadius: SHAPES.roundedSmall, overflow: 'hidden', marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md },
  sectionBar: { width: 4, height: 16, borderRadius: 2 },
  sectionHeaderText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  menuItemLabel: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily },
  divider: { height: 1, marginLeft: SPACING.md + 20 + SPACING.md },
  organizerBanner: { borderRadius: SHAPES.roundedSmall, padding: SPACING.lg, marginBottom: SPACING.lg },
  organizerBannerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.md },
  organizerBannerText: { flex: 1, fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold, lineHeight: 20 },
  organizerButton: { borderRadius: SHAPES.roundedSmall, paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.md, alignItems: 'center' },
  organizerButtonText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
});
