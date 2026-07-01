import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, ShieldCheck, Upload } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../constants/theme';

export default function OrganizerVerificationForm() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Verification documents submitted successfully. We will review them shortly.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }, 1500);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Get Verified</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.banner}>
          <ShieldCheck color={colors.secondary} size={48} />
          <Text style={[styles.bannerTitle, { color: colors.textPrimary }]}>Verify your account</Text>
          <Text style={[styles.bannerText, { color: colors.textSecondary }]}>
            Verified organizers get more bookings and trust from the community. Submit your ID and registration documents to get the badge.
          </Text>
        </View>

        <TouchableOpacity style={[styles.uploadBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Upload color={colors.primary} size={24} />
          <Text style={[styles.uploadText, { color: colors.textPrimary }]}>Upload ID Document</Text>
          <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>Passport, Aadhar, or Driver's License</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.submitBtn, { backgroundColor: colors.primary }]} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.submitBtnText, { color: colors.background }]}>Submit for Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  content: { flex: 1, padding: SPACING.lg, gap: SPACING.xl },
  banner: { alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.xl },
  bannerTitle: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  bannerText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center', lineHeight: 22 },
  uploadBox: { borderWidth: 1, borderStyle: 'dashed', borderRadius: SHAPES.roundedMedium, padding: SPACING.xl, alignItems: 'center', gap: SPACING.sm },
  uploadText: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  uploadSub: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily },
  submitBtn: { padding: SPACING.md, borderRadius: SHAPES.roundedSmall, alignItems: 'center', marginTop: 'auto' },
  submitBtnText: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
});
