export interface TourismPhoto {
  id: number;
  photo_url: string;
  title: string;
  description: string;
  location: string;
  latitude?: number;
  longitude?: number;
  tourism_type: 'agro' | 'marine' | 'history' | 'culture';
  quality_score: number;
  auto_tags: string[];
  guide_id: number;
  guide: GuideProfile;
  reviews_count: number;
  saved_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
}

export interface GuideProfile {
  id: number;
  name: string;
  email: string;
  bio: string;
  avatar_url?: string;
  rating: number;
  total_reviews: number;
  tours_completed: number;
  member_since: string;
}

export interface Review {
  id: number;
  photo_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Experience {
  id: number;
  photo_id: number;
  guide_id: number;
  price: number;
  duration_minutes: number;
  max_people: number;
  description: string;
  photo?: TourismPhoto;
}

export interface Booking {
  id: number;
  experience_id: number;
  booking_date: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  guide?: GuideProfile;
  experience?: Experience & { photo: TourismPhoto };
  created_at: string;
}

export interface User {
  id: number;
  clerk_id: string;
  email: string;
  name?: string;
  bio?: string;
  avatar_url?: string;
  role: 'tourist' | 'guide';
  created_at: string;
}

export interface PhotosResponse {
  total: number;
  photos: TourismPhoto[];
}

export type TourismTypeFilter = 'all' | 'agro' | 'marine' | 'history' | 'culture';
