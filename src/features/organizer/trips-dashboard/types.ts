import { ItineraryActivityPayload } from "../create-trip/types";

export interface OrganizerTrip {
  trip_id: string;
  status: 'DRAFT' | 'PUBLISHED';
  title?: string;
  location?: { name: string };
  budget?: number;
  max_travellers?: number;
  confirmed_travellers?: number;
  is_active?: boolean;
  thumbnail?: string;
  itinerary: ItineraryActivityPayload[];
}
