export interface LocationModel {
  name?: string;
  lat?: number;
  lng?: number;
}

export interface Itinerary {
  title: string;
  media: string;
  time: string;
  location: LocationModel;
}

export interface FAQItem {
  question: string;
  answer: string;
}


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
  itinerary?: Itinerary[];
  frequently_asked?: FAQItem[];
}

