import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ActivityIndicator, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '../../context/ThemeContext';
import { spacing } from '../../constants/spacing';
import { typography } from '../../constants/typography';
import axios from 'axios';

const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL;

export default function CreatePostScreen({ navigation }: any) {
  const { colors } = useTheme();
  const { userId } = useAuth();
  
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUris, setImageUris] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUris(result.assets.map((asset: any) => asset.uri));
    }
  };

  const handlePost = async () => {
    if (imageUris.length === 0) {
        Alert.alert("Image Required", "Please select at least one image for your post");
        return;
    }
    
    setUploading(true);
    try {
        const formData = new FormData();
        
        imageUris.forEach((uri) => {
            const filename = uri.split('/').pop() || 'photo.jpg';
            const match = /\.(\w+)$/.exec(filename);
            const type = match ? `image/${match[1]}` : `image`;

            formData.append('images', {
                uri: uri,
                name: filename,
                type,
            } as any);
        });

        if (description) formData.append('description', description);
        if (location) formData.append('location', location);

        await axios.post(`${BACKEND_URL}/api/posts/`, formData, {
            headers: {
                Authorization: `Bearer ${userId}`,
                'Content-Type': 'multipart/form-data',
            }
        });
        
        navigation.goBack();
    } catch (error) {
        console.error("Upload failed", error);
        Alert.alert("Upload Failed", "Something went wrong while posting.");
    } finally {
        setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={[styles.imageContainer, { backgroundColor: colors.surface }]} onPress={pickImage}>
        {imageUris.length > 0 ? (
          <Image source={{ uri: imageUris[0] }} style={styles.image} />
        ) : (
          <Text style={{ color: colors.textSecondary }}>Tap to select an image</Text>
        )}
        {imageUris.length > 1 && (
			<View style={styles.badge}>
				<Text style={styles.badgeText}>+{imageUris.length - 1}</Text>
			</View>
        )}
      </TouchableOpacity>

      <TextInput
        style={[styles.input, { color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="Location (e.g. Paris, France)"
        placeholderTextColor={colors.textSecondary}
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={[styles.input, styles.textArea, { color: colors.textPrimary, borderColor: colors.border }]}
        placeholder="Write a description..."
        placeholderTextColor={colors.textSecondary}
        multiline
        numberOfLines={4}
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity 
        style={[styles.submitBtn, { backgroundColor: colors.primary, opacity: uploading ? 0.7 : 1 }]} 
        onPress={handlePost}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.submitBtnText}>Post</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  imageContainer: {
    height: 250,
    borderRadius: spacing.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderRadius: spacing.sm,
    padding: spacing.md,
    fontSize: typography.md,
    marginBottom: spacing.md,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    padding: spacing.md,
    borderRadius: spacing.sm,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  submitBtnText: {
    color: '#000',
    fontSize: typography.lg,
    fontWeight: typography.bold,
  }
});
