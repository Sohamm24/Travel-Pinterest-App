import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { MapPin } from 'lucide-react-native';

export default function MapPlaceholder() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.dim, borderColor: colors.border }]}>
      <MapPin color={colors.ternary} size={32} />
      <Text style={[styles.label, { color: colors.textSecondary }]}>Route map coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 200,
    borderRadius: SHAPES.roundedLarge,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  label: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
});
