import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react-native';

export default function ThemeToggle() {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={[styles.btn, { backgroundColor: colors.surface, borderColor: colors.border }]}
      accessibilityLabel={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Text style={styles.icon}>
        {theme === 'dark' ? <Sun size={24} color={colors.primary} /> : <Moon size={24} color={colors.primary} />}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
  },
  icon: { fontSize: 16 },
});
