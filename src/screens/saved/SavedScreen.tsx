import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { photoService } from '../../services/photoService';
import { useStore } from '../../store/useStore';
import type { TourismPhoto } from '../../types';
import type { RootStackParamList } from '../../navigation/RootNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Saved'>;
};

export default function SavedScreen({ navigation }: Props): React.JSX.Element {
  const toggleSaved = useStore((s) => s.toggleSaved);
  const setSavedIds = useStore((s) => s.setSavedIds);

  const [saved, setSaved] = useState<TourismPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await photoService.getSavedPhotos();
      setSaved(data);
      setSavedIds(data.map((p) => p.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (id: number) => {
    toggleSaved(id);
    setSaved((prev) => prev.filter((p) => p.id !== id));
    await photoService.unsavePhoto(id);
  };

  const renderItem = ({ item }: { item: TourismPhoto }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PhotoDetail', { photoId: item.id })}
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.photo_url }} style={styles.img} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
        {!!item.location && <Text style={styles.cardLoc} numberOfLines={1}>📍 {item.location}</Text>}
        <Text style={styles.cardType}>{item.tourism_type.toUpperCase()}</Text>
      </View>
      <TouchableOpacity onPress={() => handleUnsave(item.id)} style={styles.unsaveBtn}>
        <Text style={styles.unsaveIcon}>❤️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.header}>Saved Places</Text>
      {loading ? (
        <ActivityIndicator color="#6C63FF" style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={saved}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No saved places yet 💔</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f0f1a' },
  header: { color: '#fff', fontSize: 24, fontWeight: '800', padding: 16, paddingBottom: 8 },
  list: { padding: 12, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16162a',
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  img: { width: 80, height: 80 },
  cardInfo: { flex: 1, padding: 12, gap: 3 },
  cardTitle: { color: '#fff', fontWeight: '700', fontSize: 14 },
  cardLoc: { color: '#888', fontSize: 12 },
  cardType: {
    color: '#6C63FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  unsaveBtn: { padding: 14 },
  unsaveIcon: { fontSize: 20 },
  empty: { alignItems: 'center', marginTop: 80 },
  emptyText: { color: '#555', fontSize: 16 },
});
