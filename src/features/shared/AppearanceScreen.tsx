import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../constants/theme';

export default function AppearanceScreen() {
  const navigation = useNavigation<any>();
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Appearance</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.iconCircle, { backgroundColor: colors.dim }]}>
              {isDark
                ? <Moon size={22} color={colors.primary} />
                : <Sun size={22} color={colors.primary} />
              }
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Dark Mode</Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {isDark ? 'Dark theme is active' : 'Light theme is active'}
              </Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.ternary }}
            thumbColor={isDark ? colors.primary : colors.surface}
          />
        </View>

        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>PREVIEW</Text>
          <View style={styles.previewRow}>
            <View style={[styles.previewSwatch, { backgroundColor: colors.primary }]} />
            <View style={[styles.previewSwatch, { backgroundColor: colors.secondary }]} />
            <View style={[styles.previewSwatch, { backgroundColor: colors.ternary }]} />
            <View style={[styles.previewSwatch, { backgroundColor: colors.dim }]} />
          </View>
          <View style={[styles.previewTextBlock, { backgroundColor: colors.surface, borderRadius: SHAPES.roundedSmall }]}>
            <Text style={[styles.previewPrimary, { color: colors.textPrimary }]}>Primary Text</Text>
            <Text style={[styles.previewSecondary, { color: colors.textSecondary }]}>Secondary Text</Text>
          </View>
          <View style={styles.previewButtonRow}>
            <View style={[styles.previewButton, { backgroundColor: colors.primary }]}>
              <Text style={[styles.previewButtonText, { color: colors.background }]}>Button</Text>
            </View>
            <View style={[styles.previewButton, { backgroundColor: colors.confirmation }]}>
              <Text style={[styles.previewButtonText, { color: '#fff' }]}>Confirm</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xl + 10,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.lg,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
  },
  content: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderRadius: SHAPES.roundedMedium,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  previewCard: {
    borderRadius: SHAPES.roundedMedium,
    borderWidth: 1,
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  previewLabel: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    letterSpacing: 1,
  },
  previewRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  previewSwatch: {
    flex: 1,
    height: 32,
    borderRadius: SHAPES.roundedSmall,
  },
  previewTextBlock: {
    padding: SPACING.md,
    gap: 4,
  },
  previewPrimary: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
  },
  previewSecondary: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
  previewButtonRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  previewButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: SHAPES.roundedSmall,
    alignItems: 'center',
  },
  previewButtonText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
  },
});
