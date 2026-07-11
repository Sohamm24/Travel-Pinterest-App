/**
 * features/payment/confirm-trip/api.ts
 *
 * API calls for the trip confirmation page.
 */

import { client } from '../../../utils/apiClient';
import { ConfirmationData } from './types';

export interface CreateHoldPayload {
  trip_id: string;
  seats_count: number;
  idempotency_key: string;
}

export interface HoldResult {
  trip_confirmation_id: string;
  price_locked: number;
  total_amount: number;
  hold_expires_at: string;   // ISO datetime
  seats_left: number;
  razorpay_order_id: string;
  razorpay_key_id: string;
}

export const confirmTripApi = {
  /** Read-only snapshot for the confirmation page — nothing is locked yet. */
  getConfirmationData: (tripId: string): Promise<ConfirmationData> =>
    client
      .get(`/api/v1/trips/${tripId}/confirmation-data`)
      .then((r) => r.data),

  /** Atomically create a seat hold + Stripe PaymentIntent in one call. */
  createHold: (payload: CreateHoldPayload): Promise<HoldResult> =>
    client
      .post('/api/v1/payments/hold', payload)
      .then((r) => r.data),
};
