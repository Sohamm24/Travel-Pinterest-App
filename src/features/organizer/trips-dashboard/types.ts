export interface OrganizerTrip {
  id: number;
  title: string;
  location?: { name: string };
  start_date?: string;
  end_date?: string;
  budget?: number;
  max_travellers?: number;
  seats_filled?: number;
  interested_count?: number;
  is_active?: boolean;
  cover_image?: string;
}
