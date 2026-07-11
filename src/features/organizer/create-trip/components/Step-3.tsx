import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';
import type { CreateTripFormValues } from '../types';

interface Props {
  watch: UseFormWatch<CreateTripFormValues>;
  setValue: UseFormSetValue<CreateTripFormValues>;
}

const INCLUSION_OPTIONS: { label: string; key: string }[] = [
  { label: 'Breakfast',                   key: 'breakfast' },
  { label: 'Lunch',                       key: 'lunch' },
  { label: 'Dinner',                      key: 'dinner' },
  { label: 'Accommodation',               key: 'accommodation' },
  { label: 'Driver Charges',              key: 'vehicle_charges' },
  { label: 'Guide',                       key: 'guide' },
  { label: 'Toll, Permit & Entry fees',   key: 'toll_permit_entry_fees' },
];

const DEFAULT_INCLUSIONS = Object.fromEntries(
  INCLUSION_OPTIONS.map(({ key }) => [key, false])
);

export default function Step3Inclusions({ watch, setValue }: Props) {
  const { colors } = useTheme();
  const inclusions = watch('inclusions') ?? DEFAULT_INCLUSIONS;

  const toggle = (key: string) => {
    setValue('inclusions', { ...inclusions, [key]: !inclusions[key] });
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionLabel, { color: colors.textPrimary }]}>
        TICK THE INCLUSIONS
      </Text>

      <View style={styles.list}>
        {INCLUSION_OPTIONS.map(({ label, key }) => {
          const checked = !!inclusions[key];
          return (
            <TouchableOpacity
              key={key}
              style={styles.row}
              onPress={() => toggle(key)}
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
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>{label}</Text>
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
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  checkbox: { width: 22, height: 22, borderRadius: 4 },
  checkboxChecked: { backgroundColor: '#C62828' },
  checkboxUnchecked: { borderWidth: 2, backgroundColor: 'transparent' },
  optionText: { fontSize: 15, fontFamily: TYPOGRAPHY.fontFamily },
});