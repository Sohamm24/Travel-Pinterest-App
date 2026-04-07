import React, { useRef, useState, useCallback } from 'react';
import {
  Animated,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useFocusEffect } from '@react-navigation/native';
import { Camera, Image as ImageIcon, Search, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useImageMatch } from '../../hooks/useImageMatch';
import ImageCard from '../../components/ImageCard';
import LoadingIndicator from '../../components/LoadingIndicator';
import { typography } from '../../constants/typography';
import { spacing } from '../../constants/spacing';
import { formatFileSize } from '../../services/utils';
import type { ImageResult } from '../../types/api';

export default function ImageUploadScreen(): React.JSX.Element {
  const { colors } = useTheme();
  const {
    selectedAsset,
    matches,
    uploading,
    progress,
    error,
    onPhotoTaken,
    pickFromGallery,
    upload,
    clearImage,
  } = useImageMatch();

  const [permission, requestPermission] = useCameraPermissions();
  const [isFocused, setIsFocused] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);

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

  const renderMatch = ({ item }: { item: ImageResult }) => (
    <ImageCard image={item} showSimilarity />
  );

  const keyExtractor = (item: ImageResult) => item.id;

  // ── Permission loading ────────────────────────────────────────────────────

  if (!permission) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  // ── Permission denied ─────────────────────────────────────────────────────

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.lg }}>
        <Camera size={48} color={colors.textSecondary} strokeWidth={1.5} />
        <Text style={[styles.permissionText, { color: colors.textSecondary, marginTop: spacing.md }]}>
          Camera access is needed to take photos
        </Text>
        <TouchableOpacity
          style={[styles.permissionBtn, { backgroundColor: colors.primary, marginTop: spacing.lg }]}
          onPress={requestPermission}
        >
          <Text style={styles.permissionBtnText}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ── Preview mode (photo taken or gallery picked) ──────────────────────────

  if (selectedAsset) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <StatusBar barStyle="light-content" />

        {/* Full-screen image preview */}
        <Image
          source={{ uri: selectedAsset.uri }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />

        {/* Back button — top-left */}
        <SafeAreaView style={styles.overlayTopLeft}>
          <TouchableOpacity
            style={styles.iconCircle}
            onPress={clearImage}
            accessibilityLabel="Remove selected photo"
          >
            <ArrowLeft size={18} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </SafeAreaView>

        {/* File size pill — bottom-left above button */}
        {selectedAsset.fileSize != null && (
          <View style={styles.sizePill}>
            <Text style={styles.sizePillText}>
              {formatFileSize(selectedAsset.fileSize)}
            </Text>
          </View>
        )}

        {/* Progress bar */}
        {uploading && (
          <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <Animated.View
              style={[styles.progressFill, { width: progressWidth, backgroundColor: colors.primary }]}
            />
            <Text style={[styles.progressLabel, { color: colors.primary }]}>
              {progress}%
            </Text>
          </View>
        )}

        {/* Error message */}
        {!!error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {error}</Text>
          </View>
        )}

        {/* Floating Find Matches button */}
        <SafeAreaView style={styles.floatingBtnWrapper}>
          <TouchableOpacity
            style={[
              styles.floatingBtn,
              { backgroundColor: colors.primary, opacity: uploading ? 0.65 : 1 },
            ]}
            onPress={upload}
            disabled={uploading}
            accessibilityLabel="Find matching destinations"
          >
            <Search size={18} color="#000" strokeWidth={2.5} />
            <Text style={styles.floatingBtnText}>
              {uploading ? 'Matching…' : 'Find Matches'}
            </Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Results list overlaid below (scrollable sheet) */}
        {(matches.length > 0 || uploading) && (
          <View style={[styles.resultsSheet, { backgroundColor: colors.background }]}>
            {matches.length > 0 && (
              <View style={styles.resultsHeader}>
                <Text style={[styles.resultsTitle, { color: colors.textPrimary }]}>
                  {matches.length} Matching Destinations
                </Text>
                <Text style={[styles.resultsSubtitle, { color: colors.textSecondary }]}>
                  Sorted by visual similarity
                </Text>
              </View>
            )}
            {uploading && (
              <View style={{ marginTop: spacing.md }}>
                <LoadingIndicator variant="skeleton" count={2} />
              </View>
            )}
            <FlatList
              data={matches}
              keyExtractor={keyExtractor}
              renderItem={renderMatch}
              contentContainerStyle={styles.list}
              removeClippedSubviews
              maxToRenderPerBatch={5}
            />
          </View>
        )}
      </View>
    );
  }

  // ── Live camera mode (full screen) ────────────────────────────────────────

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {/* Full-screen camera viewfinder */}
      {isFocused && (
        <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />
      )}

      {/* Gallery picker — top-right overlay */}
      <SafeAreaView style={styles.overlayTopRight}>
        <TouchableOpacity
          style={styles.iconCircle}
          onPress={pickFromGallery}
          accessibilityLabel="Select from gallery"
        >
          <ImageIcon size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Error message */}
      {!!error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      )}

      {/* Floating Take Photo button */}
      <SafeAreaView style={styles.floatingBtnWrapper}>
        <TouchableOpacity
          style={[
            styles.floatingBtn,
            { backgroundColor: '#fff', opacity: isCapturing ? 0.65 : 1 },
          ]}
          onPress={takePicture}
          disabled={isCapturing}
          accessibilityLabel="Take a photo"
        >
          <Camera size={18} color="#000" strokeWidth={2.5} />
          <Text style={[styles.floatingBtnText, { color: '#000' }]}>
            {isCapturing ? 'Capturing…' : 'Take Photo'}
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Overlay anchors
  overlayTopLeft: {
    position: 'absolute',
    top: 0,
    left: spacing.screenPadding,
  },
  overlayTopRight: {
    position: 'absolute',
    top: 0,
    right: spacing.screenPadding,
  },
  iconCircle: {
    marginTop: spacing.md,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating CTA at the bottom
  floatingBtnWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenPadding,
    paddingBottom: spacing.lg,
  },
  floatingBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: spacing.buttonRadius,
    paddingVertical: spacing.base,
    minHeight: 52,
    // Subtle shadow so button reads over any background
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingBtnText: {
    color: '#000',
    fontSize: typography.md,
    fontWeight: typography.bold,
  },

  // File size badge
  sizePill: {
    position: 'absolute',
    bottom: 90, // above the floating button
    left: spacing.screenPadding,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  sizePillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  // Progress
  progressTrack: {
    position: 'absolute',
    bottom: 80,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
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
    fontSize: 11,
    fontWeight: '700',
    marginLeft: spacing.sm,
  },

  // Error
  errorBox: {
    position: 'absolute',
    bottom: 110,
    left: spacing.screenPadding,
    right: spacing.screenPadding,
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: spacing.buttonRadius,
    padding: spacing.md,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 13,
    lineHeight: 18,
  },

  // Permission
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

  // Results sheet (preview mode only)
  resultsSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: '45%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: spacing.sm,
  },
  resultsHeader: {
    paddingHorizontal: spacing.screenPadding,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    gap: 4,
  },
  resultsTitle: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
  },
  resultsSubtitle: {
    fontSize: typography.sm,
  },
  list: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxxl,
  },
});