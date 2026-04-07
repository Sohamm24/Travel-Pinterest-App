import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { Camera, Image as ImageIcon, Search, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { typography } from '../constants/typography';
import { spacing } from '../constants/spacing';
import { formatFileSize } from '../services/utils';
import type { ImagePickerAsset } from 'expo-image-picker';

interface Props {
  selectedAsset: ImagePickerAsset | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  onPickGallery: () => void;
  onClear: () => void;
  onUpload: () => void;
  // New: receives the taken photo URI back to the hook
  onPhotoTaken: (uri: string, width: number, height: number) => void;
}

export default function ImageUploadForm({
  selectedAsset,
  uploading,
  progress,
  error,
  onPickGallery,
  onClear,
  onUpload,
  onPhotoTaken,
}: Props) {
  const { colors } = useTheme();
  const [permission, requestPermission] = useCameraPermissions();
  const [isFocused, setIsFocused] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Manage camera active state based on screen focus — mirrors PhotoPage
  useFocusEffect(
    useCallback(() => {
      setIsFocused(true);
      return () => setIsFocused(false);
    }, [])
  );

  const takePicture = async () => {
    if (!cameraRef.current || isCapturing) return;
    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo) {
        onPhotoTaken(photo.uri, photo.width, photo.height);
      }
    } catch (e) {
      if (__DEV__) console.error('Failed to take picture:', e);
    } finally {
      setIsCapturing(false);
    }
  };

  const progressWidth = `${progress}%` as any;

  // ── Permission states ────────────────────────────────────────────────────────

  if (!permission) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: colors.surface }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.permissionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Camera size={40} color={colors.textSecondary} strokeWidth={1.5} />
        <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
          Camera access is needed to take photos
        </Text>
        <TouchableOpacity
          style={[styles.permissionBtn, { backgroundColor: colors.primary }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Preview mode (photo taken or gallery picked) ─────────────────────────────

  if (selectedAsset) {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.cameraContainer,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Image
            source={{ uri: selectedAsset.uri }}
            style={styles.cameraPreview}
            resizeMode="cover"
          />

          {/* Clear / Back button */}
          <TouchableOpacity
            style={styles.clearBtn}
            onPress={onClear}
            accessibilityLabel="Remove selected photo"
          >
            <ArrowLeft size={16} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* File size pill */}
          {selectedAsset.fileSize != null && (
            <View style={[styles.sizePill, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
              <Text style={styles.sizePillText}>
                {formatFileSize(selectedAsset.fileSize)}
              </Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        {uploading && (
          <View style={[styles.progressTrack, { backgroundColor: colors.progressBg }]}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth, backgroundColor: colors.primary }]}
            />
            <Text style={[styles.progressLabel, { color: colors.primary }]}>
              {progress}%
            </Text>
          </View>
        )}

        {/* Find Matches button */}
        <TouchableOpacity
          style={[
            styles.uploadBtn,
            { backgroundColor: colors.primary, opacity: uploading ? 0.65 : 1 },
          ]}
          onPress={onUpload}
          disabled={uploading}
          accessibilityLabel="Find matching destinations"
        >
          <Search size={18} color="#000" strokeWidth={2.5} />
          <Text style={styles.uploadBtnText}>
            {uploading ? 'Matching…' : 'Find Matches'}
          </Text>
        </TouchableOpacity>

        {/* Error message */}
        {!!error && (
          <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}
      </View>
    );
  }

  // ── Live camera mode ─────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      {/* Camera viewfinder */}
      <View
        style={[
          styles.cameraContainer,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {isFocused && (
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
        )}

        {/* Gallery picker — top-right overlay */}
        <TouchableOpacity
          style={[styles.galleryOverlayBtn, { backgroundColor: 'rgba(0,0,0,0.55)' }]}
          onPress={onPickGallery}
          accessibilityLabel="Select from gallery"
        >
          <ImageIcon size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      {/* Take Photo button */}
      <TouchableOpacity
        style={[
          styles.uploadBtn,
          { backgroundColor: colors.primary, opacity: isCapturing ? 0.65 : 1 },
        ]}
        onPress={takePicture}
        disabled={isCapturing}
        accessibilityLabel="Take a photo"
      >
        <Camera size={18} color="#000" strokeWidth={2.5} />
        <Text style={styles.uploadBtnText}>
          {isCapturing ? 'Capturing…' : 'Take Photo'}
        </Text>
      </TouchableOpacity>

      {/* Error message */}
      {!!error && (
        <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  cameraContainer: {
    flex: 1,
    
    borderRadius: spacing.cardRadius,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    width: '100%',
    height: '100%',
  },
  galleryOverlayBtn: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearBtn: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.65)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sizePill: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: spacing.pillRadius,
  },
  sizePillText: {
    color: '#fff',
    fontSize: typography.xs,
    fontWeight: typography.medium,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabel: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    marginLeft: spacing.sm,
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: spacing.buttonRadius,
    paddingVertical: spacing.base,
    minHeight: 52,
  },
  uploadBtnText: {
    color: '#000',
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  errorBox: {
    borderRadius: spacing.buttonRadius,
    padding: spacing.md,
  },
  errorText: {
    color: '#EF4444',
    fontSize: typography.sm,
    lineHeight: 18,
  },
  permissionContainer: {
    marginHorizontal: spacing.screenPadding,
    marginTop: spacing.md,
    height: 360,
    borderRadius: spacing.cardRadius,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  permissionText: {
    fontSize: typography.base,
    textAlign: 'center',
  },
  permissionBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.buttonRadius,
  },
  permissionBtnText: {
    color: '#000',
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
});