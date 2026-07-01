import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { ChevronLeft, CreditCard, CheckCircle2 } from 'lucide-react-native';

export default function ConfirmTrip() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { tripId } = route.params;
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setConfirmed(true);
      setTimeout(() => navigation.goBack(), 1500);
    }, 2000);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Confirm Trip</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        {confirmed ? (
          <View style={styles.successBox}>
            <CheckCircle2 color={colors.confirmation} size={64} />
            <Text style={[styles.successTitle, { color: colors.textPrimary }]}>Trip Confirmed!</Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              You'll receive a confirmation email shortly.
            </Text>
          </View>
        ) : (
          <>
            <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>
              <CreditCard color={colors.primary} size={32} />
              <Text style={[styles.infoTitle, { color: colors.textPrimary }]}>Payment Details</Text>
              <Text style={[styles.infoSubtitle, { color: colors.textSecondary }]}>
                Payment integration will be available soon. For now, this is a demo confirmation flow.
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.confirmButton, { backgroundColor: colors.confirmation }]}
              onPress={handleConfirm}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: SPACING.md, paddingTop: SPACING.xl + 10, paddingBottom: SPACING.sm, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  content: { flex: 1, padding: SPACING.lg, justifyContent: 'center' },
  infoCard: { padding: SPACING.xl, borderRadius: SHAPES.roundedLarge, alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl },
  infoTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  infoSubtitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center', lineHeight: 22 },
  confirmButton: { paddingVertical: SPACING.md, borderRadius: SHAPES.roundedMedium, alignItems: 'center' },
  confirmButtonText: { color: '#fff', fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
  successBox: { alignItems: 'center', gap: SPACING.md },
  successTitle: { fontSize: TYPOGRAPHY.sizes.xl, fontFamily: TYPOGRAPHY.fontFamilyBold },
  successSubtitle: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center' },
});
