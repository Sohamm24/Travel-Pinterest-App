export interface ImageResult {
  id: string;
  path: string;
  category: string;
  image_url: string;
  quality_score: number;
  mood: string;
  similarity_score?: number;
  [key: string]: any;
}

export interface FeedResponse {
  total: number;
  returned: number;
  offset: number;
  limit: number;
  images: ImageResult[];
}

export interface MatchResponse {
  query_image: string;
  top_n: number;
  matches: ImageResult[];
}

export interface HistoryEntry {
  id: string;
  action: 'view' | 'long_press';
  timestamp: number;
}
