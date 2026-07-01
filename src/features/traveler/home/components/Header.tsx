import React from 'react';
import { View, Text, TextInput, StyleSheet, Dimensions } from 'react-native';
import { Search } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchSubmit: () => void;
}

export default function Header({ searchQuery, onSearchChange, onSearchSubmit }: HeaderProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
      <Text style={[styles.logoText, { color: colors.secondary }]}>T</Text>
      <View style={[styles.searchBar, { backgroundColor: colors.background }]}>
        <Search color={colors.textSecondary} size={16} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Find your next destination"
          placeholderTextColor={colors.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          onSubmitEditing={onSearchSubmit}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xl + 20,
    paddingBottom: SPACING.sm,
  },
  logoText: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    flexShrink: 0,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SHAPES.roundedSmall,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: TYPOGRAPHY.sizes.sm,
    fontFamily: TYPOGRAPHY.fontFamily,
    padding: 0,
  },
});