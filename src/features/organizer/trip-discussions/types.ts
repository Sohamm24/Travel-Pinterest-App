export interface TripDiscussion {
  trip_id: string;
  title: string;
  location_name?: string;
  discussion_id?: string;
  interested_count: number;
  cover_image?: string;
  has_new_activity?: boolean;
}
