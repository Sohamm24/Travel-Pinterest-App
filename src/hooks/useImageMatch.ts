import { useState, useCallback } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { api } from '../services/api';
import { friendlyError } from '../services/utils';
import type { ImageResult } from '../types/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export function useImageMatch() {
  const [selectedAsset, setSelectedAsset] =
    useState<ImagePicker.ImagePickerAsset | null>(null);
  const [matches, setMatches] = useState<ImageResult[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const _handleAsset = useCallback(
    (asset: ImagePicker.ImagePickerAsset) => {
      if (asset.fileSize && asset.fileSize > MAX_FILE_SIZE) {
        setError('Image must be smaller than 10 MB.');
        return;
      }
      setSelectedAsset(asset);
      setMatches([]);
      setError(null);
      setProgress(0);
    },
    [],
  );

  /**
   * Called by ImageUploadForm's CameraView ref after takePictureAsync().
   * Constructs a minimal ImagePickerAsset-compatible object so the rest
   * of the hook (upload, clear, preview) works without any changes.
   */
  const onPhotoTaken = useCallback(
    (uri: string, width: number, height: number) => {
      const asset: ImagePicker.ImagePickerAsset = {
        uri,
        width,
        height,
        type: 'image',
        fileName: uri.split('/').pop() ?? 'photo.jpg',
        mimeType: 'image/jpeg',
        // fileSize unavailable from CameraView — 10 MB check skipped
        fileSize: undefined,
        base64: undefined,
        exif: undefined,
        duration: undefined,
        pairedVideoAsset: undefined,
        assetId: undefined,
      };
      _handleAsset(asset);
    },
    [_handleAsset],
  );

  const pickFromGallery = useCallback(async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Photo library permission denied.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled && result.assets[0]) {
      _handleAsset(result.assets[0]);
    }
  }, [_handleAsset]);

  const upload = useCallback(async () => {
    if (!selectedAsset) return;
    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const result = await api.matchImage(
        selectedAsset.uri,
        10,
        setProgress,
      );
      setMatches(result.matches);
    } catch (e) {
      setError(friendlyError(e));
    } finally {
      setUploading(false);
      setProgress(100);
    }
  }, [selectedAsset]);

  const clearImage = useCallback(() => {
    setSelectedAsset(null);
    setMatches([]);
    setError(null);
    setProgress(0);
  }, []);

  return {
    selectedAsset,
    matches,
    uploading,
    progress,
    error,
    onPhotoTaken,
    pickFromGallery,
    upload,
    clearImage,
  };
}