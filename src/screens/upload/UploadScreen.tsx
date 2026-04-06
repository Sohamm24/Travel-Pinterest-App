import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { photoService } from '../../services/photoService';
import type { TourismTypeFilter } from '../../types';

const TYPES: { label: string; value: string; emoji: string }[] = [
  { label: 'Agro', value: 'agro', emoji: '🌾' },
  { label: 'Marine', value: 'marine', emoji: '🌊' },
  { label: 'History', value: 'history', emoji: '🏛️' },
  { label: 'Culture', value: 'culture', emoji: '🎭' },
];

export default function UploadScreen(): React.JSX.Element {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tourismType, setTourismType] = useState<string>('culture');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUpload = async () => {
    if (!imageUri || !title.trim()) {
      Alert.alert('Missing', 'Please select an image and enter a title.');
      return;
    }
    setUploading(true);
    try {
      const form = new FormData();
      form.append('image_file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      } as any);
      form.append('title', title.trim());
      form.append('description', description.trim());
      form.append('location', location.trim());

      const photo = await photoService.uploadPhoto(form);
      Alert.alert(
        '✅ Uploaded!',
        `Tourism type detected: ${photo.tourism_type}\nQuality score: ${photo.quality_score}/100`,
        [{ text: 'OK', onPress: () => { setImageUri(null); setTitle(''); setDescription(''); setLocation(''); } }]
      );
    } catch (e) {
      Alert.alert('Error', 'Upload failed. Make sure you are logged in as a guide.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Upload Photo</Text>
        <Text style={styles.subtitle}>Share your local experience with travellers</Text>

        {/* Image picker */}
        <TouchableOpacity style={styles.picker} onPress={pickImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.preview} resizeMode="cover" />
          ) : (
            <View style={styles.pickerPlaceholder}>
              <Text style={styles.pickerIcon}>📷</Text>
              <Text style={styles.pickerText}>Tap to select photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Tourism type selector */}
        <Text style={styles.label}>Tourism Type (AI will auto-detect, you can override)</Text>
        <View style={styles.typeRow}>
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[styles.typeBtn, tourismType === t.value && styles.typeBtnActive]}
              onPress={() => setTourismType(t.value)}
            >
              <Text style={styles.typeEmoji}>{t.emoji}</Text>
              <Text style={[styles.typeLabel, tourismType === t.value && styles.typeLabelActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form fields */}
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          placeholder="Give your photo a name..."
          placeholderTextColor="#555"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.multiline]}
          placeholder="Describe this experience..."
          placeholderTextColor="#555"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., Bali, Indonesia"
          placeholderTextColor="#555"
          value={location}
          onChangeText={setLocation}
        />

        {/* Upload button */}
        <TouchableOpacity
          style={[styles.uploadBtn, uploading && styles.uploadBtnDisabled]}
          onPress={handleUpload}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadBtnText}>🚀 Upload & Process</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.hint}>
          OpenCV will auto-detect tourism type, calculate quality score (0-100), and extract tags.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  scroll: { padding: 16, gap: 12, paddingBottom: 40 },
  header: { color: '#fff', fontSize: 24, fontWeight: '800' },
  subtitle: { color: '#888', fontSize: 14 },
  picker: {
    height: 220, borderRadius: 16, overflow: 'hidden',
    borderWidth: 2, borderColor: '#2a2a40', borderStyle: 'dashed',
    backgroundColor: '#16162a',
  },
  pickerPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  pickerIcon: { fontSize: 40 },
  pickerText: { color: '#555', fontSize: 14 },
  preview: { width: '100%', height: '100%' },
  label: { color: '#aaa', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  typeRow: { flexDirection: 'row', gap: 8 },
  typeBtn: {
    flex: 1, alignItems: 'center', paddingVertical: 10,
    backgroundColor: '#16162a', borderRadius: 12, borderWidth: 1, borderColor: '#2a2a40', gap: 4,
  },
  typeBtnActive: { borderColor: '#6C63FF', backgroundColor: '#6C63FF22' },
  typeEmoji: { fontSize: 20 },
  typeLabel: { color: '#888', fontSize: 11, fontWeight: '600' },
  typeLabelActive: { color: '#6C63FF' },
  input: {
    backgroundColor: '#16162a', borderRadius: 12, padding: 13,
    color: '#fff', fontSize: 14, borderWidth: 1, borderColor: '#2a2a40',
  },
  multiline: { height: 100, textAlignVertical: 'top' },
  uploadBtn: {
    backgroundColor: '#6C63FF', borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginTop: 4,
  },
  uploadBtnDisabled: { opacity: 0.6 },
  uploadBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  hint: { color: '#555', fontSize: 12, textAlign: 'center', lineHeight: 18 },
});
