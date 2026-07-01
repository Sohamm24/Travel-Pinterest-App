import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';

const INCLUSION_OPTIONS = [
  'Breakfast',
  'Lunch',
  'Dinner',
  'Accommodation',
  'Driver Charges',
  'Guide',
  'Toll, Permit & Entry fees',
];

export default function Step3Inclusions({ formData, setFormData }: any) {
  const { colors } = useTheme();
  const selected: string[] = formData.inclusions ?? [];

  const toggle = (option: string) => {
    const next = selected.includes(option)
      ? selected.filter((s) => s !== option)
      : [...selected, option];
    setFormData({ ...formData, inclusions: next });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
        TICK THE INCLUSIONS
      </Text>

      <View style={styles.list}>
        {INCLUSION_OPTIONS.map((option) => {
          const checked = selected.includes(option);
          return (
            <TouchableOpacity
              key={option}
              style={styles.row}
              onPress={() => toggle(option)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  checked
                    ? styles.checkboxChecked
                    : [styles.checkboxUnchecked, { borderColor: colors.border }],
                ]}
              />
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },

  sectionLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  list: { gap: 16 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#C62828', // red filled as per design
  },
  checkboxUnchecked: {
    borderWidth: 2,
    backgroundColor: 'transparent',
  },

  optionText: {
    fontSize: 15,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
});