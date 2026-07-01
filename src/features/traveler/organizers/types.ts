export interface OrganizerItem {
  organizer_id: string;
  name: string;
  bio?: string;
  profile_pic?: string;
  rating?: number;
  reviews?: number;
  trip_count?: number;
  verification_status?: boolean;
}

export interface OrganizersListResponse {
  organizers: OrganizerItem[];
}
