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
import { useTheme } from '../../../../context/ThemeContext';
import { TYPOGRAPHY } from '../../../../constants/theme';
import { uploadMedia } from './Upload-media';

export default function Step1BasicInfo({ formData, setFormData, tripId }: any) {
  const { colors } = useTheme();
  const [uploading, setUploading] = useState(false);

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
      quality: 1, // we compress manually below
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];

    // Show local preview immediately — no waiting on upload
    setFormData((prev: any) => ({
      ...prev,
      thumbnail: asset.uri,          // local URI for instant preview
      thumbnailPath: null,           // clears any previous confirmed path
      thumbnailUploading: true,
    }));

    setUploading(true);
    try {
      // Compress before upload: max 1200px wide, 80% quality
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      const { filePath, publicUrl } = await uploadMedia({
        localUri: compressed.uri,
        mimeType: 'image/jpeg',
        mediaContext: 'thumbnail',
        tripId: tripId ?? 'draft', // handled server-side if trip not created yet
      });

      setFormData((prev: any) => ({
        ...prev,
        thumbnailPath: filePath,     // confirmed bucket path
        thumbnail: publicUrl,        // swap preview to CDN URL
        thumbnailUploading: false,
      }));
    } catch (err: any) {
      Alert.alert('Upload failed', 'Could not upload thumbnail. You can retry.');
      setFormData((prev: any) => ({
        ...prev,
        thumbnailUploading: false,
        // keep local preview so user can retry without re-picking
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveThumbnail = () => {
    setFormData((prev: any) => ({
      ...prev,
      thumbnail: null,
      thumbnailPath: null,
      thumbnailUploading: false,
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.fieldLabel, { color: colors.textPrimary }]}>TRIP TITLE</Text>
      <TextInput
        style={[styles.titleInput, { color: formData.title ? colors.textPrimary : '#9CA3AF' }]}
        value={formData.title}
        onChangeText={(t) => setFormData((prev: any) => ({ ...prev, title: t }))}
        placeholder={`A creative title like "This trip will\nchange the way you look at\nladakh"`}
        placeholderTextColor="#C4C4CF"
        multiline
        numberOfLines={3}
        textAlignVertical="top"
      />

      {/* Thumbnail upload */}
      <Text style={[styles.fieldLabel, { color: colors.textPrimary, marginTop: 4 }]}>
        TRIP THUMBNAIL
      </Text>

      {formData.thumbnail ? (
        <View style={styles.previewWrapper}>
          <Image source={{ uri: formData.thumbnail }} style={styles.thumbnailImage} />

          {/* Uploading overlay */}
          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator color="#fff" size="large" />
              <Text style={styles.uploadingText}>Uploading…</Text>
            </View>
          )}

          {/* Remove button (top-right) */}
          {!uploading && (
            <TouchableOpacity style={styles.removeBtn} onPress={handleRemoveThumbnail} hitSlop={8}>
              <X color="#fff" size={16} />
            </TouchableOpacity>
          )}

          {/* Failed badge */}
          {!uploading && !formData.thumbnailPath && (
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
  uploadLabel: {
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamily,
  },

  previewWrapper: {
    borderRadius: 12,
    height: 180,
    marginTop: 4,
    overflow: 'hidden',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  uploadingText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
  },
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
  retryText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: TYPOGRAPHY.fontFamilySemiBold,
  },

  hint: {
    fontSize: 12,
    fontFamily: TYPOGRAPHY.fontFamily,
  },
});