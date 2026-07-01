import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Mail, Phone, AtSign, Camera, Globe } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

const SOCIAL = [
  { icon: Globe, label: 'Website', url: 'https://example.com', handle: 'wandertrail.app' },
  { icon: Camera, label: 'Instagram', url: 'https://instagram.com', handle: '@wandertrail' },
  { icon: AtSign, label: 'Twitter', url: 'https://twitter.com', handle: '@wandertrail' },
];

export default function AboutUs() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>About Us</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.brandCard, { backgroundColor: colors.surface }]}>
          <View style={[styles.logoCircle, { backgroundColor: colors.primary }]}>
            <Text style={[styles.logoText, { color: colors.background }]}>W</Text>
          </View>
          <Text style={[styles.brandName, { color: colors.textPrimary }]}>WanderTrail</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>Every journey tells a story</Text>
          <View style={[styles.versionBadge, { backgroundColor: colors.dim }]}>
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>Version 1.0.0</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Our Mission</Text>
          <Text style={[styles.body, { color: colors.textSecondary }]}>
            WanderTrail connects passionate travelers with expert local organizers to create unforgettable group adventures. We believe that travel is transformative, and every destination has a story waiting to be discovered.
          </Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Connect With Us</Text>
          {SOCIAL.map(({ icon: Icon, label, url, handle }) => (
            <TouchableOpacity
              key={label}
              style={[styles.socialRow, { borderBottomColor: colors.border }]}
              onPress={() => Linking.openURL(url)}
            >
              <View style={[styles.socialIcon, { backgroundColor: colors.dim }]}>
                <Icon color={colors.primary} size={18} />
              </View>
              <View>
                <Text style={[styles.socialLabel, { color: colors.textSecondary }]}>{label}</Text>
                <Text style={[styles.socialHandle, { color: colors.textPrimary }]}>{handle}</Text>
              </View>
              <ChevronLeft color={colors.textSecondary} size={16} style={{ marginLeft: 'auto', transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('mailto:hello@wandertrail.app')}>
            <Mail color={colors.primary} size={18} />
            <Text style={[styles.contactText, { color: colors.textPrimary }]}>hello@wandertrail.app</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL('tel:+918000000000')}>
            <Phone color={colors.primary} size={18} />
            <Text style={[styles.contactText, { color: colors.textPrimary }]}>+91 80000 00000</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: colors.textSecondary }]}>
          © 2025 WanderTrail. All rights reserved.
        </Text>
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
  brandCard: { borderRadius: SHAPES.roundedLarge, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm },
  logoCircle: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center' },
  logoText: { fontSize: 36, fontFamily: TYPOGRAPHY.fontFamilyBold },
  brandName: { fontSize: TYPOGRAPHY.sizes.xxl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  tagline: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, fontStyle: 'italic' },
  versionBadge: { paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: SHAPES.roundedFull, marginTop: 4 },
  versionText: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  section: { borderRadius: SHAPES.roundedMedium, padding: SPACING.md, gap: SPACING.sm },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 4 },
  body: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 22 },
  socialRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm, borderBottomWidth: 1 },
  socialIcon: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  socialLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  socialHandle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.sm },
  contactText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily },
  footer: { textAlign: 'center', fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, marginTop: SPACING.md },
});
