import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';

function InfoChip({ label, children, colors }: any) {
  return (
    <View style={styles.infoChipWrapper}>
      <Text style={[styles.infoChipLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View>{children}</View>
    </View>
  );
}

function DatePill({ text, colors }: { text: string; colors: any }) {
  return (
    <View style={[styles.datePill, { backgroundColor: colors.border ?? '#EEE' }]}>
      <Text style={[styles.datePillText, { color: colors.textPrimary }]}>{text}</Text>
    </View>
  );
}

export default function TripPreview({ formData, colors: colorsOverride }: any) {
  const { colors: themeColors } = useTheme();
  const colors = colorsOverride ?? themeColors;

  // Parse date strings for display
  const startParts = formData.startDate ? formData.startDate.split(' ') : [];
  const endParts = formData.endDate ? formData.endDate.split(' ') : [];

  const budgetDisplay = formData.budget
    ? `₹ ${parseInt(formData.budget).toLocaleString('en-IN')}`
    : '₹ —';

  const seatsDisplay = formData.maxTravellers ? `0/${formData.maxTravellers}` : '0/—';

  const faqs = (formData.frequently_asked ?? []).filter((f: any) => f.question && f.answer);

  return (
    <View style={styles.container}>
      {/* Hero Image */}
      <View style={[styles.heroContainer, { backgroundColor: colors.border }]}>
        {formData.thumbnail ? (
          <Image source={{ uri: formData.thumbnail }} style={styles.heroImage} />
        ) : (
          <View style={[styles.heroPlaceholder, { backgroundColor: '#C0D8F0' }]}>
            <Text style={styles.heroPlaceholderText}>Trip thumbnail</Text>
          </View>
        )}
      </View>

      {/* Info Card */}
      <View style={[styles.infoCard, { backgroundColor: '#fff' }]}>
        <Text style={[styles.tripTitle, { color: colors.textPrimary }]}>
          {formData.title || 'Your trip title goes here'}
        </Text>

        {/* Date | Budget | Seats row */}
        <View style={styles.statsRow}>
          {/* Dates */}
          <InfoChip label="Date" colors={colors}>
            <View style={styles.datePillRow}>
              {startParts.length >= 2 ? (
                <DatePill text={`${startParts[0]}\n${startParts[1]}`} colors={colors} />
              ) : (
                <DatePill text="—" colors={colors} />
              )}
              {endParts.length >= 2 && (
                <DatePill text={`${endParts[0]}\n${endParts[1]}`} colors={colors} />
              )}
            </View>
          </InfoChip>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <InfoChip label="Budget" colors={colors}>
            <Text style={[styles.budgetText, { color: colors.textPrimary }]}>{budgetDisplay}</Text>
          </InfoChip>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <InfoChip label="Seats Filled" colors={colors}>
            <Text style={[styles.seatsText, { color: colors.textPrimary }]}>{seatsDisplay}</Text>
          </InfoChip>
        </View>

        {/* Map placeholder */}
        <View style={[styles.mapPlaceholder, { backgroundColor: '#DDE8F0' }]}>
          <Text style={{ color: '#666', fontSize: 13 }}>Route map</Text>
          {formData.locationName ? (
            <Text style={{ color: '#333', fontSize: 13, fontWeight: '600', marginTop: 4 }}>
              📍 {formData.locationName}
            </Text>
          ) : null}
        </View>
      </View>

      {/* Description */}
      {!!formData.description && (
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About this trip</Text>
          <Text style={[styles.sectionBody, { color: colors.textSecondary }]}>
            {formData.description}
          </Text>
        </View>
      )}

      {/* Inclusions */}
      {(formData.inclusions ?? []).length > 0 && (
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Inclusions</Text>
          <View style={styles.tagRow}>
            {formData.inclusions.map((inc: string) => (
              <View key={inc} style={[styles.tag, { backgroundColor: colors.primaryLight ?? '#EDE9FA' }]}>
                <Text style={[styles.tagText, { color: colors.primary }]}>{inc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* FAQs */}
      {faqs.length > 0 && (
        <View style={[styles.section, { borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>FAQs</Text>
          {faqs.map((faq: any, i: number) => (
            <View key={faq.id ?? i} style={styles.faqItem}>
              <Text style={[styles.faqQ, { color: colors.textPrimary }]}>Q: {faq.question}</Text>
              <Text style={[styles.faqA, { color: colors.textSecondary }]}>A: {faq.answer}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 0, overflow: 'hidden' },

  heroContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 220,
    marginBottom: -16, // overlapped by card below
  },
  heroImage: { width: '100%', height: '100%' },
  heroPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroPlaceholderText: { color: '#888', fontSize: 14 },

  infoCard: {
    borderRadius: 16,
    padding: 16,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 8,
  },

  tripTitle: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    lineHeight: 26,
  },

  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
  },
  infoChipWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  infoChipLabel: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  datePillRow: { flexDirection: 'row', gap: 4 },
  datePill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignItems: 'center',
  },
  datePillText: {
    fontSize: 11,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
    textAlign: 'center',
    lineHeight: 14,
    textTransform: 'uppercase',
  },
  budgetText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
  },
  seatsText: {
    fontSize: 18,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
  },
  divider: {
    width: 1,
    height: 40,
    marginHorizontal: 4,
  },

  mapPlaceholder: {
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: {
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 16,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionBody: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily,
    lineHeight: 20,
  },

  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  tagText: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamilySemiBold },

  faqItem: { gap: 4 },
  faqQ: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  faqA: { fontSize: 13, fontFamily: TYPOGRAPHY.fontFamily },
});