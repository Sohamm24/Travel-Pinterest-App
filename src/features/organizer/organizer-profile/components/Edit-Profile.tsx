import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY, SHAPES, SPACING } from '../../../../constants/theme';
import { useMyOrganizerProfile } from '../hooks';
import { useUserStore } from '../../../../store/userStore';
import { organizerProfileApi } from '../api';

export default function EditOrganizerProfile() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { organizerId } = useUserStore();
  const { data: orgProfile, refetch } = useMyOrganizerProfile();
  
  const [bio, setBio] = useState(orgProfile?.bio || '');
  const [region, setRegion] = useState(orgProfile?.region || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      if (!organizerId) return;
      await organizerProfileApi.updateOrganizer(organizerId, { bio, region });
      refetch();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to update organizer profile');
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
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>Edit Organizer Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Bio</Text>
          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about your organization"
            placeholderTextColor={colors.textSecondary}
            multiline
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Region</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.surface, color: colors.textPrimary, borderColor: colors.border }]}
            value={region}
            onChangeText={setRegion}
            placeholder="e.g. North India, Global"
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <TouchableOpacity 
          style={[styles.saveBtn, { backgroundColor: colors.primary }]}
          onPress={handleSave}
          disabled={loading}
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
  textArea: { minHeight: 100 },
  saveBtn: { padding: SPACING.md, borderRadius: SHAPES.roundedSmall, alignItems: 'center', marginTop: SPACING.md },
  saveBtnText: { fontSize: TYPOGRAPHY.sizes.md, fontFamily: TYPOGRAPHY.fontFamilyBold },
});
