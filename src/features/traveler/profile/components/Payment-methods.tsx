import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, CreditCard, Plus, Lock } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

export default function PaymentMethods() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Payment Methods</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyBox}>
          <View style={[styles.emptyIconCircle, { backgroundColor: colors.surface }]}>
            <CreditCard color={colors.textSecondary} size={40} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>No payment methods</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Add a card or UPI ID to make trip payments seamlessly.
          </Text>
          <TouchableOpacity style={[styles.addBtn, { backgroundColor: colors.primary }]}>
            <Plus color={colors.background} size={18} />
            <Text style={[styles.addBtnText, { color: colors.background }]}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.securityCard, { backgroundColor: colors.surface }]}>
          <Lock color={colors.secondary} size={20} />
          <Text style={[styles.securityText, { color: colors.textSecondary }]}>
            Your payment information is encrypted and secured. We never store your full card details.
          </Text>
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
  content: { padding: SPACING.lg, gap: SPACING.lg, paddingBottom: 60 },
  emptyBox: { alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.xl },
  emptyIconCircle: { width: 96, height: 96, borderRadius: 48, justifyContent: 'center', alignItems: 'center' },
  emptyTitle: { fontSize: TYPOGRAPHY.sizes.lg, fontFamily: TYPOGRAPHY.fontFamilyBold },
  emptySubtitle: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamily, textAlign: 'center', lineHeight: 20 },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: SPACING.sm + 4, paddingHorizontal: SPACING.xl, borderRadius: SHAPES.roundedFull, marginTop: SPACING.sm },
  addBtnText: { fontSize: TYPOGRAPHY.sizes.sm, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  securityCard: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md, padding: SPACING.md, borderRadius: SHAPES.roundedMedium },
  securityText: { flex: 1, fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamily, lineHeight: 18 },
});
