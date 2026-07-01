export interface CreateTripActivity {
  sequence: number;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string;
}

export interface CreateTripDay {
  day_number: number;
  activities: CreateTripActivity[];
}

export interface CreateTripFAQ {
  question: string;
  answer: string;
}

export interface CreateTripPayload {
  title: string;
  location?: { name: string };
  start_date?: string;
  end_date?: string;
  is_one_day_trip?: boolean;
  budget?: number;
  confirmation_amount?: number;
  max_travellers?: number;
  description?: string;
  frequently_asked?: CreateTripFAQ[];
  itinerary?: CreateTripDay[];
}

export interface Step1Payload {
  title: string;
  thumbnail: string;
}

export interface ItineraryStepPayload {
  itinerary: any[];
}

export interface InclusionsStepPayload {
  inclusions: Record<string, boolean>;
}

export interface PricingStepPayload {
  max_travellers?: number;
  budget?: number;
  confirmation_amount?: number;
  confirmation_deadline: string;
}

export interface AudienceStepPayload {
  categories: string[];
}

export interface DescriptionStepPayload {
  description: string;
  frequently_asked?: { question: string; answer: string }[];
}

export type StepKey =
  | 'info'
  | 'itinerary'
  | 'inclusions'
  | 'pricing'
  | 'audience'
  | 'description';

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
  frequently_asked?: { question: string; answer: string }[];
  [key: string]: any;
}