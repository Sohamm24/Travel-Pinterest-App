import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ChevronDown, ChevronUp, Mail, Phone, MessageCircle } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

const FAQS = [
  { q: 'How do I book a trip?', a: 'Browse trips on the home screen, tap on a trip you like, and press "Interested" to join the discussion and get confirmed by the organizer.' },
  { q: 'Can I cancel a confirmed trip?', a: 'Please contact the trip organizer directly through the discussion forum. Cancellation policies vary by organizer.' },
  { q: 'How do I become an organizer?', a: 'Go to your Profile and tap "Become Organizer". Fill in your details and start creating trips.' },
  { q: 'Is my payment secure?', a: 'All payments are processed through secure payment gateways. We never store your card details.' },
  { q: 'What if I have a problem during the trip?', a: 'Reach out to your organizer through the discussion forum. For urgent issues, contact our support team via the options below.' },
];

function FAQItem({ item, colors }: { item: typeof FAQS[0]; colors: any }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.faqItem, { borderBottomColor: colors.border }]}>
      <TouchableOpacity style={styles.faqHeader} onPress={() => setOpen(!open)} activeOpacity={0.7}>
        <Text style={[styles.faqQ, { color: colors.textPrimary }]}>{item.q}</Text>
        {open
          ? <ChevronUp color={colors.textSecondary} size={18} />
          : <ChevronDown color={colors.textSecondary} size={18} />}
      </TouchableOpacity>
      {open && (
        <Text style={[styles.faqA, { color: colors.textSecondary }]}>{item.a}</Text>
      )}
    </View>
  );
}

export default function CustomerCare() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Customer Care</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.contactCard, { backgroundColor: colors.primary }]}>
          <MessageCircle color={colors.background} size={32} />
          <Text style={[styles.contactCardTitle, { color: colors.background }]}>We're here to help</Text>
          <Text style={[styles.contactCardSub, { color: colors.background }]}>Typically responds within 2 hours</Text>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Contact Us</Text>
          <TouchableOpacity style={[styles.contactRow, { borderColor: colors.border }]} onPress={() => Linking.openURL('mailto:support@wandertrail.app')}>
            <View style={[styles.contactIcon, { backgroundColor: colors.dim }]}>
              <Mail color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Email</Text>
              <Text style={[styles.contactValue, { color: colors.textPrimary }]}>support@wandertrail.app</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactRow, { borderColor: colors.border }]} onPress={() => Linking.openURL('tel:+918000000000')}>
            <View style={[styles.contactIcon, { backgroundColor: colors.dim }]}>
              <Phone color={colors.primary} size={20} />
            </View>
            <View>
              <Text style={[styles.contactLabel, { color: colors.textSecondary }]}>Phone</Text>
              <Text style={[styles.contactValue, { color: colors.textPrimary }]}>+91 80000 00000</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Frequently Asked Questions</Text>
          {FAQS.map((faq, i) => (
            <FAQItem key={i} item={faq} colors={colors} />
          ))}
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
  contactCard: { borderRadius: SHAPES.roundedLarge, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm },
  contactCardTitle: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  contactCardSub: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, opacity: 0.8 },
  section: { borderRadius: SHAPES.roundedMedium, padding: SPACING.md, gap: SPACING.sm },
  sectionTitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold, marginBottom: 4 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, padding: SPACING.sm, borderRadius: SHAPES.roundedSmall, borderWidth: 1 },
  contactIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  contactValue: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  faqItem: { paddingVertical: SPACING.md, borderBottomWidth: 1 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold, flex: 1, paddingRight: SPACING.sm },
  faqA: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 20, marginTop: SPACING.sm },
});
