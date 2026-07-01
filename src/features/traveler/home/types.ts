import type { TripResponse, TripListResponse, LocationModel, TripOrganizerInfo, FAQItem } from '../../../types/api';

export type { TripResponse, TripListResponse, LocationModel, TripOrganizerInfo, FAQItem };

export interface TripFilters {
  search?: string;
  category?: string;
  page?: number;
}
