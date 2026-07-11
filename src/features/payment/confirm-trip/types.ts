import { Itinerary } from "src/features/traveler/trip-details/types";

export interface ConfirmationData {
  title: string;
  itinerary: Itinerary[];
  organizer?: {
    id: number;
    user_id?: string;
    organizer_id?: number;
    name: string;
    profile_pic?: string;
    average_rating?: number;
    total_reviews?: number;
    trip_count?: number;
    verification_status?: boolean;
  };
  confirmation_amount?: number;
  max_travellers?: number;
  confirmed_travellers?: number;
}

export interface PaymentMethod {
  id: string;
  label: string;
  subLabel?: string;
  icon: string;
};