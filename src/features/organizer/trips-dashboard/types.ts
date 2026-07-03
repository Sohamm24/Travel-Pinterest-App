export interface OrganizerTrip {
  trip_id: string;
  status: 'DRAFT' | 'PUBLISHED';
  title?: string;
  location?: { name: string };
  start_date?: string;
  end_date?: string;
  budget?: number;
  max_travellers?: number;
  seats_filled?: number;
  interested_count?: number;
  is_active?: boolean;
  thumbnail?: string;
  last_completed_step: number;
}
