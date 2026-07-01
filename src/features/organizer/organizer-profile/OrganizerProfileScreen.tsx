import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronRight, Sun, Star, CreditCard, CircleDollarSign, HeadphonesIcon, Settings, LogOut, Play } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING, COLORS } from '../../../constants/theme';
import { useAuthStore } from '../../../store/authStore';
import { useUserStore } from '../../../store/userStore';
import { api } from '../../../services/api';
import { useMyOrganizerProfile } from './hooks';

function SectionHeading({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={styles.sectionHeadingRow}>
      <View style={[styles.sectionAccent, { backgroundColor: colors.primary }]} />
      <Text style={[styles.sectionHeadingText, { color: colors.textPrimary }]}>{label}</Text>
    </View>
  );
}

function MenuRow({ icon, label, onPress, danger, colors }: { icon: React.ReactNode; label: string; onPress: () => void; danger?: boolean; colors: any }) {
  return (
    <TouchableOpacity style={styles.menuRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.menuRowIcon}>{icon}</View>
      <Text style={[styles.menuRowLabel, { color: danger ? colors.error : colors.textPrimary }]}>{label}</Text>
      <ChevronRight size={18} color={colors.textSecondary} />
    </TouchableOpacity>
  );
}

function StatTile({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: string | number; colors: any }) {
  return (
    <View style={styles.statTile}>
      <View style={[styles.statIcon, { backgroundColor: colors.surface }]}>{icon}</View>
      <View>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
      </View>
    </View>
  );
}

const StatCard = ({ icon, label, value, colors }: { icon: React.ReactNode; label: string; value: number | string; colors: any }) => (
  <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
    {icon}
    <View>
      <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  </View>
);

export default function OrganizerProfileScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { logout } = useAuthStore();
  const { profile, setOrganizerMode } = useUserStore();
  
  const { data: orgProfile, isLoading: loading } = useMyOrganizerProfile();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: async () => { try { await api.logout(); } catch {} await logout(); } },
    ]);
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: colors.dim }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const displayName = profile?.name || 'Organizer';
  const initial = displayName[0]?.toUpperCase() ?? 'O';
  const avatarUri = orgProfile?.profile_pic || profile?.profile_pic;
  const avgRating = orgProfile?.average_rating ?? 0;
  const totalReviews = orgProfile?.total_reviews ?? 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.dim }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.profileCard, { backgroundColor: colors.surface }]}>
          <View style={styles.profileCardInner}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colors.ternary }]}>
                <Text style={[styles.avatarInitial, { color: colors.primary }]}>{initial}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>{displayName}</Text>
              <TouchableOpacity style={styles.editProfileRow} onPress={() => navigation.navigate('EditOrganizerProfile')}>
                <Text style={[styles.editProfileText, { color: colors.secondary }]}>Edit Profile</Text>
                <ChevronRight size={14} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          <StatCard
            icon={<Star color={colors.textSecondary} size={22} />}
            label="average ratings"
            value={0}
            colors={colors}
          />
          <StatCard
            icon={<Play color={colors.textSecondary} size={22} />}
            label="total reviews"
            value={0}
            colors={colors}
          />
        </View>


        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SectionHeading label="preferences" colors={colors} />
          <MenuRow icon={<Sun size={20} color={colors.textSecondary} />} label="appearance" onPress={() => navigation.navigate('Appearance')} colors={colors} />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <MenuRow icon={<CreditCard size={20} color={colors.textSecondary} />} label="payment methods" onPress={() => navigation.navigate('PaymentMethods')} colors={colors} />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <SectionHeading label="more" colors={colors} />
          <MenuRow icon={<CircleDollarSign size={20} color={colors.textSecondary} />} label="earnings" onPress={() => navigation.navigate('Earnings')} colors={colors} />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <MenuRow icon={<HeadphonesIcon size={20} color={colors.textSecondary} />} label="organizer support" onPress={() => navigation.navigate('OrganizerSupport')} colors={colors} />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <MenuRow icon={<Settings size={20} color={colors.textSecondary} />} label="settings" onPress={() => navigation.navigate('Settings')} colors={colors} />
          <View style={[styles.rowDivider, { backgroundColor: colors.border }]} />
          <MenuRow icon={<LogOut size={20} color={colors.textSecondary} />} label="logout" onPress={handleLogout} danger colors={colors} />
        </View>

        <View style={styles.switchBanner}>
          <TouchableOpacity style={[styles.switchButton, { backgroundColor: colors.background }]} onPress={() => setOrganizerMode(false)}>
            <Text style={[styles.switchButtonText, { color: colors.primary }]}>Switch to Traveler</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 100},
  profileCard: { marginHorizontal: SPACING.md, borderRadius: SHAPES.roundedSmall, padding: SPACING.md, marginBottom: SPACING.md, marginTop: 60 },
  profileCardInner: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  avatarPlaceholder: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  profileInfo: { flex: 1 },
  profileName: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 4 },
  editProfileRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  editProfileText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  statsRow: { flexDirection: 'row', marginHorizontal: SPACING.md, borderRadius: SHAPES.roundedSmall, marginBottom: SPACING.md,gap: SPACING.md },
  statCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, borderRadius: SHAPES.roundedSmall, padding: SPACING.md },
  statTile: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md },
  statIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  statLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginBottom: 2 },
  statValue: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  section: { marginHorizontal: SPACING.md, borderRadius: SHAPES.roundedSmall, marginBottom: SPACING.md, paddingVertical: SPACING.xs },
  sectionHeadingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  sectionAccent: { width: 3, height: 16, borderRadius: 2 },
  sectionHeadingText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.md },
  menuRowIcon: { width: 28, alignItems: 'center' },
  menuRowLabel: { flex: 1, fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily },
  rowDivider: { height: 1, marginLeft: SPACING.md + 28 + SPACING.md },
  switchBanner: { marginHorizontal: SPACING.md, borderRadius: SHAPES.roundedLarge, padding: SPACING.lg, alignItems: 'center', marginTop: SPACING.sm },
  switchButton: { borderRadius: SHAPES.roundedSmall, paddingVertical: SPACING.sm + 2, paddingHorizontal: SPACING.xl },
  switchButtonText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
});
