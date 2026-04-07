import axios from 'axios';
import type { FeedResponse, MatchResponse } from '../types/api';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

/** Prefix relative image URLs with the API base URL. */
export function resolveImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${API_BASE}${url.startsWith('/') ? '' : '/'}${url}`;
}

export const api = {
  async getFeed(
    limit: number = 20,
    offset: number = 0,
    seenIds: string[] = [],
    history: object[] = [],
  ): Promise<FeedResponse> {
    const params = new URLSearchParams({
      limit: String(limit),
      offset: String(offset),
    });
    if (seenIds.length > 0) params.append('seen_ids', seenIds.join(','));
    if (history.length > 0) params.append('history', JSON.stringify(history));

    const { data } = await client.get<FeedResponse>(`/api/feed?${params}`);

    // Resolve all image URLs to absolute
    data.images = data.images.map((img) => ({
      ...img,
      image_url: resolveImageUrl(img.image_url),
    }));

    return data;
  },

  async matchImage(
    uri: string,
    topN: number = 10,
    onProgress?: (pct: number) => void,
  ): Promise<MatchResponse> {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    } as any);
    formData.append('top_n', String(topN));

    const { data } = await client.post<MatchResponse>('/api/match', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total));
        }
      },
    });

    // Resolve match image URLs
    data.matches = data.matches.map((m) => ({
      ...m,
      image_url: resolveImageUrl(m.image_url),
    }));

    return data;
  },
};
