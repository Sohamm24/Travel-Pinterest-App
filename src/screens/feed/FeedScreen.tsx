import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import FilterTabs from '../../components/FilterTabs';
import PhotoCard from '../../components/PhotoCard';
import { photoService } from '../../services/photoService';
import { useStore } from '../../store/useStore';
import type { TourismPhoto } from '../../types';
import type { RootStackParamList } from '../../navigation/RootNavigator';

const { width } = Dimensions.get('window');
const COLUMN_GAP = 12;
const PADDING = 12;

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Feed'>;
};

export default function FeedScreen({ navigation }: Props): React.JSX.Element {
  const selectedType = useStore((s) => s.selectedType);
  const savedPhotoIds = useStore((s) => s.savedPhotoIds);
  const toggleSaved = useStore((s) => s.toggleSaved);
  const { photoService: ps } = { photoService };

  const [photos, setPhotos] = useState<TourismPhoto[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchPhotos = useCallback(
    async (newOffset: number, isRefresh = false) => {
      if (loading && !isRefresh) return;
      setLoading(true);
      try {
        const res = await photoService.getFeed({
          tourism_type: selectedType === 'all' ? undefined : selectedType,
          offset: newOffset,
          limit: 20,
        });
        const incoming = res.photos;
        if (newOffset === 0) {
          setPhotos(incoming);
        } else {
          setPhotos((prev) => [...prev, ...incoming]);
        }
        setOffset(newOffset + incoming.length);
        setHasMore(incoming.length === 20);
      } catch (e) {
        console.error('Feed fetch error', e);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [selectedType]
  );

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    fetchPhotos(0);
  }, [selectedType]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPhotos(0, true);
  };

  const onEndReached = () => {
    if (!loading && hasMore) fetchPhotos(offset);
  };

  const handleSave = async (photoId: number) => {
    toggleSaved(photoId);
    try {
      if (savedPhotoIds.has(photoId)) {
        await photoService.unsavePhoto(photoId);
      } else {
        await photoService.savePhoto(photoId);
      }
    } catch {
      toggleSaved(photoId); // revert optimistic update
    }
  };

  const filtered = search.trim()
    ? photos.filter(
        (p) =>
          p.title?.toLowerCase().includes(search.toLowerCase()) ||
          p.location?.toLowerCase().includes(search.toLowerCase())
      )
    : photos;

  const renderItem = ({ item, index }: { item: TourismPhoto; index: number }) => (
    <View style={{ marginLeft: index % 2 === 1 ? COLUMN_GAP : 0 }}>
      <PhotoCard
        photo={item}
        isSaved={savedPhotoIds.has(item.id)}
        onPress={() => navigation.navigate('PhotoDetail', { photoId: item.id })}
        onSave={() => handleSave(item.id)}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>✈️ TravelPin</Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Text style={styles.notifIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Search destinations..."
          placeholderTextColor="#555"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filters */}
      <FilterTabs />

      {/* Grid */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        numColumns={2}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6C63FF"
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No photos found 🌐</Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loading && photos.length > 0 ? (
            <ActivityIndicator color="#6C63FF" style={{ marginVertical: 20 }} />
          ) : null
        }
      />

      {loading && photos.length === 0 && (
        <View style={styles.loadingCenter}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  notifBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1e1e30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifIcon: {
    fontSize: 16,
  },
  searchRow: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  search: {
    backgroundColor: '#1e1e30',
    borderRadius: 12,
    height: 42,
    paddingHorizontal: 14,
    color: '#fff',
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#2a2a40',
  },
  grid: {
    padding: PADDING,
    paddingBottom: 32,
  },
  row: {
    justifyContent: 'space-between',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
  },
  loadingCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
