/**
 * features/traveler/home/types.ts
 *
 * Types for the traveler home/feed feature.
 * Global types inlined here to remove dependency on src/types/api.
 */

export interface LocationModel {
  name?: string;
  lat?: number;
  lng?: number;
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

export interface TripResponse {
  trip_id: string;
  status: 'draft' | 'published';
  last_completed_step: number;
  title?: string;
  thumbnail?: string;
  itinerary?: any[];
  inclusions?: Record<string, boolean>;
  max_travellers?: number;
  budget?: number;
  confirmation_amount?: number;
  confirmation_deadline?: string;
  categories?: string[];
  description?: string;
  frequently_asked?: FAQItem[];
  [key: string]: any;
}

export interface TripListResponse {
  trips: TripResponse[];
  page: number;
  total: number;
}

export interface TripFilters {
  search?: string;
  category?: string;
  page?: number;
}

export interface TripCard {
  
}