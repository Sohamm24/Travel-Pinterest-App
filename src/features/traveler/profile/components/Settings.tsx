import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Bell, Globe, Trash2, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

function SettingRow({ icon, title, subtitle, right, colors }: { icon: React.ReactNode; title: string; subtitle?: string; right: React.ReactNode; colors: any }) {
  return (
    <View style={[styles.settingRow, { borderBottomColor: colors.border }]}>
      <View style={[styles.settingIcon, { backgroundColor: colors.dim }]}>{icon}</View>
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>{title}</Text>
        {subtitle ? <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

export default function Settings() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [tripAlerts, setTripAlerts] = useState(true);
  const [msgAlerts, setMsgAlerts] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(false);

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action is irreversible. All your data will be permanently deleted. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => Alert.alert('Submitted', 'Your account deletion request has been submitted.') },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>NOTIFICATIONS</Text>
          <SettingRow
            icon={<Bell color={colors.primary} size={18} />}
            title="Trip Alerts"
            subtitle="Updates on trips you're interested in"
            right={<Switch value={tripAlerts} onValueChange={setTripAlerts} trackColor={{ false: colors.border, true: colors.ternary }} thumbColor={tripAlerts ? colors.primary : colors.surface} />}
            colors={colors}
          />
          <SettingRow
            icon={<Bell color={colors.primary} size={18} />}
            title="Messages"
            subtitle="New messages in discussions"
            right={<Switch value={msgAlerts} onValueChange={setMsgAlerts} trackColor={{ false: colors.border, true: colors.ternary }} thumbColor={msgAlerts ? colors.primary : colors.surface} />}
            colors={colors}
          />
          <SettingRow
            icon={<Bell color={colors.textSecondary} size={18} />}
            title="Promotions"
            subtitle="Deals and new trip announcements"
            right={<Switch value={promoAlerts} onValueChange={setPromoAlerts} trackColor={{ false: colors.border, true: colors.ternary }} thumbColor={promoAlerts ? colors.primary : colors.surface} />}
            colors={colors}
          />
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>PREFERENCES</Text>
          <TouchableOpacity style={[styles.settingRow, { borderBottomColor: colors.border }]}>
            <View style={[styles.settingIcon, { backgroundColor: colors.dim }]}><Globe color={colors.primary} size={18} /></View>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.textPrimary }]}>Language</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>English (India)</Text>
            </View>
            <ChevronRight color={colors.textSecondary} size={18} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ACCOUNT</Text>
          <TouchableOpacity
            style={[styles.settingRow, { borderBottomColor: 'transparent' }]}
            onPress={handleDeleteAccount}
          >
            <View style={[styles.settingIcon, { backgroundColor: colors.dim }]}><Trash2 color={colors.error} size={18} /></View>
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.error }]}>Delete Account</Text>
              <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Permanently remove your account and data</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  content: { padding: SPACING.md, gap: SPACING.md, paddingBottom: 60 },
  section: { borderRadius: SHAPES.roundedMedium, overflow: 'hidden' },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilyBold, letterSpacing: 1, paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.xs },
  settingRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingText: { flex: 1 },
  settingTitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  settingSubtitle: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginTop: 2 },
});
