// ─── Itinerary UI types ────────────────────────────────────────────────────

export interface ItineraryItem {
  id: string;
  title: string;
  location: string;
  date: string;         // "DD Mon YYYY" — UI display only
  time: string;         // "HH:MM"       — UI display only
  image: string | null; // local preview URI or CDN URL
  imagePath: string | null; // confirmed bucket path → sent as `media` to API
  imageUploading?: boolean;
}

export interface Step1Payload {
  title: string;
  thumbnail: string;
}

export interface ItineraryActivityPayload {
  title: string;
  location: { name: string };
  time: string;   // ISO-8601
  media: string;  // bucket path
}

export interface ItineraryStepPayload {
  itinerary: ItineraryActivityPayload[];
}

export interface InclusionsStepPayload {
  inclusions: Record<string, boolean>;
}

export interface PricingStepPayload {
  max_travellers?: number;
  budget?: number;
  confirmation_amount?: number;
  confirmation_deadline: string; // ISO-8601
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

// ─── Backend draft response ────────────────────────────────────────────────

export interface TripDraftResponse {
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

// ─── Form values (single source of truth for useForm) ─────────────────────

export interface CreateTripFormValues {
  title: string;
  thumbnail: string | null;
  thumbnailPath: string | null;
  thumbnailUploading: boolean;
  itinerary: ItineraryItem[];
  inclusions: Record<string, boolean>;
  maxTravellers: string;
  budget: string;
  confirmationAmount: string;
  confirmLastByDate: string;
  confirmLastByTime: string;
  audience: string;
  description: string;
  frequently_asked: { id: string; question: string; answer: string }[];
}

export const INITIAL_FORM_VALUES: CreateTripFormValues = {
  title: '',
  thumbnail: null,
  thumbnailPath: null,
  thumbnailUploading: false,
  itinerary: [],
  inclusions: {},
  maxTravellers: '',
  budget: '',
  confirmationAmount: '',
  confirmLastByDate: '',
  confirmLastByTime: '',
  audience: '',
  description: '',
  frequently_asked: [],
};


/** Unique AsyncStorage key for a trip draft, scoped per trip_id. */
export const tripDraftStorageKey = (tripId: string) => `trip_draft_${tripId}`;

// ─── Legacy alias (some step payload types may reference TripResponse) ─────
/** @deprecated Use TripDraftResponse instead */
export type TripResponse = TripDraftResponse;