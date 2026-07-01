export interface TripDetail {
  trip_id: string;
  title: string;
  description?: string;
  location?: { name: string };
  start_date?: string;
  end_date?: string;
  budget?: number;
  confirmation_amount?: number;
  max_travellers?: number;
  confirmed_travellers?: number;
  interested_count?: number;
  is_interested?: boolean;
  is_bookmarked?: boolean;
  cover_image?: string;
  route_map_image?: string;
  organizer?: {
    id: number;
    name: string;
    profile_pic?: string;
    average_rating?: number;
    total_reviews?: number;
    trip_count?: number;
  };
  itinerary?: ItineraryDay[];
  frequently_asked?: FAQItem[];
}

export interface ItineraryDay {
  day_number: number;
  activities: ItineraryActivity[];
}

export interface ItineraryActivity {
  sequence: number;
  title: string;
  description?: string;
  location?: string;
  start_time?: string;
  end_time?: string;
  image?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
