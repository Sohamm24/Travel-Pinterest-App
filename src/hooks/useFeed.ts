import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import {
  addSeenIds,
  getFeedHistory,
  getSeenIds,
  saveInteraction,
} from '../services/storage';
import type { ImageResult } from '../types/api';

const LIMIT = 20;

export function useFeed() {
  const [images, setImages] = useState<ImageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const offsetRef = useRef(0);
  const isFetchingRef = useRef(false);

  const fetchBatch = useCallback(async (offset: number, isRefresh = false) => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (!isRefresh) setLoading(true);
    setError(null);

    try {
      const [seenIds, history] = await Promise.all([
        getSeenIds(),
        getFeedHistory(),
      ]);

      const data = await api.getFeed(LIMIT, offset, seenIds, history);

      // Persist all newly seen IDs
      if (data.images.length > 0) {
        await addSeenIds(data.images.map((img) => img.id));
      }

      if (isRefresh) {
        setImages(data.images);
      } else {
        setImages((prev) => {
          // De-duplicate by id
          const existingIds = new Set(prev.map((i) => i.id));
          const fresh = data.images.filter((i) => !existingIds.has(i.id));
          return [...prev, ...fresh];
        });
      }

      offsetRef.current = offset + data.images.length;
      setHasMore(data.images.length === LIMIT);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load feed. Check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      isFetchingRef.current = false;
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBatch(0);
  }, [fetchBatch]);

  const loadMore = useCallback(() => {
    if (!loading && !refreshing && hasMore) {
      fetchBatch(offsetRef.current);
    }
  }, [loading, refreshing, hasMore, fetchBatch]);

  const refresh = useCallback(() => {
    offsetRef.current = 0;
    setHasMore(true);
    setRefreshing(true);
    fetchBatch(0, true);
  }, [fetchBatch]);

  const recordView = useCallback((imageId: string) => {
    saveInteraction(imageId, 'view');
  }, []);

  const recordLongPress = useCallback((imageId: string) => {
    saveInteraction(imageId, 'long_press');
  }, []);

  return {
    images,
    loading,
    refreshing,
    hasMore,
    error,
    loadMore,
    refresh,
    recordView,
    recordLongPress,
  };
}
