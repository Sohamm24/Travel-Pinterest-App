export interface HoldStatus {
  trip_confirmation_id: string;
  status: 'pending_payment' | 'confirmed' | 'expired' | 'failed' | 'cancelled';
  hold_expires_at: string | null;
  price_locked: number;
  seats_count: number;
}
