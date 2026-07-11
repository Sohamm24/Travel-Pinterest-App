import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { useUserStore } from '../../../../store/userStore';
import { profileApi } from '../api';

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { profile, setProfile } = useUserStore();
  
  const [name, setName] = useState(profile?.name || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const updated = await profileApi.updateMe({ name: name.trim() });
      setProfile(updated as any);
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ChevronLeft color={colors.textPrimary} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Full Name</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={loading || !name.trim()}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.saveBtnText, { color: colors.background }]}>Save Changes</Text>
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
  content: { flex: 1, padding: SPACING.lg, gap: SPACING.lg },
  inputGroup: { gap: SPACING.xs },
  label: { fontSize: TYPOGRAPHY.sizes.xs, fontFamily: TYPOGRAPHY.fontFamilySemiBold, marginLeft: 4 },
  input: { borderWidth: 1, borderRadius: SHAPES.roundedSmall, padding: SPACING.md, fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamily },
  saveBtn: { padding: SPACING.md, borderRadius: SHAPES.roundedSmall, alignItems: 'center', marginTop: SPACING.md },
  saveBtnText: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
});
