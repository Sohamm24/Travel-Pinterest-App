import type { TripResponse } from '../home/types';

export interface OrganizerDetail {
  organizer_id: string;
  name: string;
  bio?: string;
  profile_pic?: string;
  rating?: number;
  reviews?: number;
  trip_count?: number;
  verification_status?: boolean;
  contact_email?: string;
  phone?: string;
}

export interface OrganizerReview {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
}

export type { TripResponse };
