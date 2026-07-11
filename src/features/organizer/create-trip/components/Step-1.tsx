import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { PlusCircle, X } from 'lucide-react-native';
import type { UseFormWatch, UseFormSetValue } from 'react-hook-form';
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';
import { uploadMedia } from './Upload-media';
import type { CreateTripFormValues } from '../types';

interface Props {
  watch: UseFormWatch<CreateTripFormValues>;
  setValue: UseFormSetValue<CreateTripFormValues>;
  tripId: string | null;
}

export default function Step1BasicInfo({ watch, setValue, tripId }: Props) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);

  const title = watch('title');
  const thumbnail = watch('thumbnail');
  const thumbnailPath = watch('thumbnailPath');

  const handlePickThumbnail = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow access to your photo library to upload a thumbnail.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];

    // Show local preview immediately — upload happens in background
    setValue('thumbnail', asset.uri);
    setValue('thumbnailPath', null);
    setValue('thumbnailUploading', true);

    setUploading(true);
    try {
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const { filePath, publicUrl } = await uploadMedia({
        localUri: compressed.uri,
        mimeType: 'image/jpeg',
        mediaContext: 'thumbnail',
        tripId: tripId ?? 'draft',
      });

      setValue('thumbnailPath', filePath);
      setValue('thumbnail', publicUrl);
    } catch {
      Alert.alert('Upload failed', 'Could not upload thumbnail. You can retry.');
    } finally {
      setValue('thumbnailUploading', false);
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setValue('thumbnail', null);
    setValue('thumbnailPath', null);
    setValue('thumbnailUploading', false);
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>TRIP TITLE</Text>
      <TextInput
        style={[styles.titleInput, { color: title ? colors.textPrimary : '#9CA3AF' }]}
        value={title}
        onChangeText={(t) => setValue('title', t)}
        placeholder={`A creative title like "This trip will\nchange the way you look at\nladakh"`}
        placeholderTextColor="#C4C4CF"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      <Text style={[styles.fieldLabel, { color: colors.textPrimary, marginTop: 4 }]}>
        TRIP THUMBNAIL
      </Text>

      {thumbnail ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: thumbnail }} style={styles.thumbnailImage} />

          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.uploadingText}>Uploading…</Text>
            </View>
          )}

          {!uploading && (
            <TouchableOpacity style={styles.removeBtn} onPress={handleRemoveThumbnail} hitSlop={8}>
              <X color="#fff" size={16} />
            </TouchableOpacity>
          )}

          {!uploading && !thumbnailPath && (
            <TouchableOpacity style={styles.retryBadge} onPress={handlePickThumbnail}>
              <Text style={styles.retryText}>Upload failed · Tap to retry</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.uploadArea, { backgroundColor: colors.border ?? '#E8E8E8' }]}
          onPress={handlePickThumbnail}
          activeOpacity={0.7}
        >
          <Text style={[styles.uploadLabel, { color: colors.textSecondary }]}>
            Upload Trip Thumbnail
          </Text>
          <PlusCircle color={colors.textSecondary} size={28} strokeWidth={1.5} />
        </TouchableOpacity>
      )}

      <Text style={[styles.hint, { color: '#9CA3AF' }]}>
        Recommended: 16:9 image, max 10 MB
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  fieldLabel: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamilyBold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  titleInput: {
    fontSize: 20,
    fontFamily: TYPOGRAPHY.fontFamily,
    lineHeight: 28,
    minHeight: 90,
    paddingTop: 0,
  },
  uploadArea: {
    borderRadius: 12,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  uploadLabel: { fontSize: 14, fontFamily: TYPOGRAPHY.fontFamily },
  previewWrapper: {
    borderRadius: 12,
    height: 180,
    marginTop: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: { width: '100%', height: '100%' },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  uploadingText: { color: '#fff', fontSize: 14, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  removeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 4,
  },
  retryBadge: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(200,50,50,0.85)',
    paddingVertical: 8,
    alignItems: 'center',
  },
  retryText: { color: '#fff', fontSize: 13, fontFamily: TYPOGRAPHY.fontFamilySemiBold },
  hint: { fontSize: 12, fontFamily: TYPOGRAPHY.fontFamily },
});