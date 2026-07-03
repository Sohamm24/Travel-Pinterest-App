// types/api.ts — Travel Platform

export interface LocationModel {
  name?: string;
  lat?: number;
  lng?: number;
}

export interface AuthResponse {
  user_id: string;
  access_token: string;
  refresh_token?: string;
}

export interface RefreshAuthResponse {
  access_token: string;
  refresh_token: string;
}


export interface UserResponse {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  is_organizer: boolean;
  created_at?: string;
}

// Alias for compatibility with legacy hooks
export type UserProfile = UserResponse & {
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_pic_url?: string;
  onboarded?: boolean;
  liked_post_ids?: number[];
  saved_post_ids?: number[];
};

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  profilePicUri?: string;
}

export interface TripOrganizerInfo {
  organizer_id: string;
  id?: string;
  name?: string;
  profile_pic?: string;
  verification_status: boolean;
  ratings?: number;
  average_rating?: number;
  total_reviews?: number;
  trip_count: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Itinerary {
  title: string;
  media: string;
  time: string;
  location: LocationModel;
}


export interface TripResponse {
  trip_id: string;
  status: 'draft' | 'published';
  last_completed_step: number;
  title?: string;
  thumbnail?: string;
  itinerary: Itinerary[];
  inclusions?: Record<string, boolean>;
  max_travellers: number;
  budget?: number;
  confirmation_amount?: number;
  confirmation_deadline?: string;
  categories?: string[];
  description?: string;
  frequently_asked?: { question: string; answer: string }[];
  [key: string]: any;
}

export interface TripListResponse {
  trips: TripResponse[];
  page: number;
  total: number;
}

export interface TripDetailResponse extends TripResponse {
  discussion_id?: string;
  is_interested: boolean;
}

export interface TripCreatePayload {
  title: string;
  location?: LocationModel;
  start_date?: string;
  end_date?: string;
  is_one_day_trip: boolean;
  budget?: number;
  confirmation_amount?: number;
  max_travellers?: number;
  description?: string;
  frequently_asked?: FAQItem[];
}

export interface TripUpdatePayload {
  title?: string;
  location?: LocationModel;
  start_date?: string;
  end_date?: string;
  is_one_day_trip?: boolean;
  budget?: number;
  confirmation_amount?: number;
  max_travellers?: number;
  description?: string;
}

export interface ItineraryResponse {
  itinerary_id?: string;
  trip_id: string;
}

export interface OrganizerResponse {
  organizer_id: string;
  user_id: string;
  name?: string;
  bio?: string;
  verification_status: boolean;
  profile_pic?: string;
  region?: string;
  ratings?: number;
  rating?: number;
  reviews?: number;
  average_rating?: number;
  total_reviews?: number;
  trip_count: number;
  contact_email?: string;
  phone?: string;
  created_at?: string;
}

export interface OrganizerListResponse {
  organizers: OrganizerResponse[];
  page: number;
  total: number;
}

export interface OrganizerUpdatePayload {
  bio?: string;
  region?: string;
  profile_pic?: string;
}

export interface MessageUserInfo {
  user_id: string;
  name?: string;
}

export interface MessageResponse {
  message_id: string;
  discussion_id: string;
  user_id: string;
  user?: MessageUserInfo;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export interface DiscussionResponse {
  discussion_id: string;
  trip_id: string;
  messages: MessageResponse[];
  has_new_activity?: boolean;
  created_at?: string;
}

export interface MessageListResponse {
  messages: MessageResponse[];
  page: number;
  total: number;
}

export interface SearchResult {
  trips: any[];
  organizers: any[];
}
