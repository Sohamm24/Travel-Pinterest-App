import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import type {
  AuthResponse,
  UserResponse,
  TripResponse,
  TripListResponse,
  TripDetailResponse,
  TripCreatePayload,
  TripUpdatePayload,
  OrganizerResponse,
  OrganizerListResponse,
  OrganizerUpdatePayload,
  DiscussionResponse,
  MessageResponse,
  MessageListResponse,
  ItineraryResponse,
  SearchResult,
  RefreshAuthResponse,
} from '../types/api';
import { AudienceStepPayload, DescriptionStepPayload, InclusionsStepPayload, ItineraryStepPayload, PricingStepPayload, Step1Payload } from 'src/features/organizer/create-trip/types';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:8000';

export const client = axios.create({
  baseURL: API_BASE,
  timeout: 30_000,
});

// Auto-inject JWT token into requests
client.interceptors.request.use(async (config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // ── Upload ───────────────────────────────────────────────────────────────────
  async getPresignedUrl(data: {
    trip_id: string;
    media_context: 'thumbnail' | 'itinerary';
    mime_type: 'image/jpeg' | 'image/png' | 'image/webp';
    itinerary_slot?: string | null;
  }): Promise<{ presigned_url: string; file_path: string }> {
    const res = await client.post('/api/v1/upload/presign', data);
    return res.data;
  },

  async confirmMediaUpload(data: {
    trip_id: string;
    file_path: string;
    media_context: 'thumbnail' | 'itinerary';
    itinerary_slot?: string | null;
  }): Promise<{ public_url: string }> {
    const res = await client.post('/api/v1/upload/confirm', data);
    return res.data.data;
  },


  // ── Auth ───────────────────────────────────────────────────────────────────
  async register(payload: any): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>('/api/v1/auth/register', payload);
    return data;
  },
  async login(payload: any): Promise<AuthResponse> {
    const { data } = await client.post<AuthResponse>('/api/v1/auth/login', payload);
    return data;
  },
  async logout(): Promise<void> {
    await client.post('/api/v1/auth/logout');
  },

  async refreshAuth(payload: any): Promise<RefreshAuthResponse> {
    const { data } = await client.post('/api/v1/auth/refresh', payload)
    return data;
  },

  // ── Users ──────────────────────────────────────────────────────────────────
  async getMe(): Promise<UserResponse> {
    const { data } = await client.get<UserResponse>('/api/v1/users/me');
    return data;
  },
  async updateMe(payload: any): Promise<UserResponse> {
    const { data } = await client.patch<UserResponse>('/api/v1/users/me', payload);
    return data;
  },
  async becomeOrganizer(): Promise<any> {
    const { data } = await client.post('/api/v1/users/become-organizer');
    return data;
  },
  async getUpcomingTrips(): Promise<TripResponse[]> {
    const { data } = await client.get<TripResponse[]>('/api/v1/users/me/upcoming-trips');
    return data;
  },
  async getPastTrips(): Promise<TripResponse[]> {
    const { data } = await client.get<TripResponse[]>('/api/v1/users/me/past-trips');
    return data;
  },
  async getInterestedTrips(): Promise<TripResponse[]> {
    const { data } = await client.get<TripResponse[]>('/api/v1/users/me/interested-trips');
    return data;
  },

  // ── Trips ──────────────────────────────────────────────────────────────────
  async createDraft(): Promise<TripResponse> {
    const { data } = await client.post<TripResponse>('/api/v1/trips/draft');
    return data;
  },
  async updateTripStep1(tripId: string, payload: Step1Payload): Promise<TripResponse> {
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}/step1`, payload);
    return data;
  },
  async updateTripStep2(tripId: string, payload: ItineraryStepPayload): Promise<TripResponse> {
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}/step2`, payload);
    return data;
  },
  async updateTripStep3(tripId: string, payload: InclusionsStepPayload): Promise<TripResponse> {
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}/step3`, payload);
    return data;
  },
  async updateTripStep4(tripId: string, payload: PricingStepPayload): Promise<TripResponse> {
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}/step4`, payload);
    return data;
  },
  async updateTripStep5(tripId: string, payload: AudienceStepPayload): Promise<TripResponse> {
    console.log(JSON.stringify(payload, null, 2));
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}/step5`, payload);
    return data;
  },
  async updateTripStep6(tripId: string, payload: DescriptionStepPayload): Promise<TripResponse> {
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}/step6`, payload);
    return data;
  },
  async publishTrip(tripId: string): Promise<TripResponse> {
    const { data } = await client.post<TripResponse>(`/api/v1/trips/${tripId}/publish`, {});
    return data;
  },
  async getTrip(tripId: string): Promise<TripResponse> {
    const { data } = await client.get<TripResponse>(`/api/v1/trips/${tripId}`);
    console.log(data.itinerary)
    return data;
  },
  async getMyDraftTrips(): Promise<TripResponse[]> {
    const { data } = await client.get<TripResponse[]>('/api/v1/trips', {
      params: { trip_status: 'draft' },
    });
    return data;
  },
  async listTrips(params?: any): Promise<TripListResponse> {
    const { data } = await client.get<TripListResponse>('/api/v1/trips/', { params });
    return data;
  },
  async updateTrip(tripId: string, payload: TripUpdatePayload): Promise<TripResponse> {
    const { data } = await client.patch<TripResponse>(`/api/v1/trips/${tripId}`, payload);
    return data;
  },
  async deleteTrip(tripId: string): Promise<void> {
    await client.delete(`/api/v1/trips/${tripId}`);
  },
  async getOrganizerTrips(organizerId: string, page = 1): Promise<TripListResponse> {
    const { data } = await client.get<TripListResponse>(`/api/v1/trips/organizers/${organizerId}`, { params: { page } });
    return data;
},
  // ── Interest ───────────────────────────────────────────────────────────────
  async markInterested(tripId: string): Promise<any> {
    const { data } = await client.post(`/api/v1/trips/${tripId}/interested`);
    return data;
  },
  async removeInterest(tripId: string): Promise<any> {
    const { data } = await client.delete(`/api/v1/trips/${tripId}/interested`);
    return data;
  },
  async listInterestedUsers(tripId: string): Promise<any> {
    const { data } = await client.get(`/api/v1/trips/${tripId}/interested`);
    return data;
  },

  // ── Itinerary ──────────────────────────────────────────────────────────────
  async getItinerary(tripId: string): Promise<ItineraryResponse> {
    const { data } = await client.get<ItineraryResponse>(`/api/v1/trips/${tripId}/itinerary`);
    return data;
  },
  async updateItinerary(tripId: string, itinerary: any[]): Promise<ItineraryResponse> {
    const { data } = await client.patch<ItineraryResponse>(`/api/v1/trips/${tripId}/itinerary`, { itinerary });
    return data;
  },

  // ── FAQ ────────────────────────────────────────────────────────────────────
  async getFAQs(tripId: string): Promise<any> {
    const { data } = await client.get(`/api/v1/trips/${tripId}/faqs`);
    return data;
  },
  async updateFAQs(tripId: string, frequently_asked: any[]): Promise<any> {
    const { data } = await client.patch(`/api/v1/trips/${tripId}/faqs`, { frequently_asked });
    return data;
  },

  // ── Organizers ─────────────────────────────────────────────────────────────
  async listOrganizers(params?: any): Promise<OrganizerListResponse> {
    const { data } = await client.get<OrganizerListResponse>('/api/v1/organizers/', { params });
    return data;
  },
  async getOrganizer(organizerId: string): Promise<OrganizerResponse> {
    const { data } = await client.get<OrganizerResponse>(`/api/v1/organizers/${organizerId}`);
    return data;
  },
  async updateOrganizer(organizerId: string, payload: OrganizerUpdatePayload): Promise<OrganizerResponse> {
    const { data } = await client.patch<OrganizerResponse>(`/api/v1/organizers/${organizerId}`, payload);
    return data;
  },

  // ── Discussions ────────────────────────────────────────────────────────────
  async createDiscussion(tripId: string): Promise<any> {
    const { data } = await client.post(`/api/v1/trips/${tripId}/discussions`);
    return data;
  },
  async getTripDiscussions(tripId: string): Promise<DiscussionResponse> {
    const { data } = await client.get<DiscussionResponse>(`/api/v1/trips/${tripId}/discussions`);
    return data;
  },
  async sendMessage(discussionId: string, message: string): Promise<MessageResponse> {
    const { data } = await client.post<MessageResponse>(`/api/v1/discussions/${discussionId}/messages`, { message });
    return data;
  },
  async getMessages(discussionId: string, page: number = 1): Promise<MessageListResponse> {
    const { data } = await client.get<MessageListResponse>(`/api/v1/discussions/${discussionId}/messages`, { params: { page } });
    return data;
  },
  async editMessage(messageId: string, message: string): Promise<MessageResponse> {
    const { data } = await client.patch<MessageResponse>(`/api/v1/messages/${messageId}`, { message });
    return data;
  },
  async deleteMessage(messageId: string): Promise<void> {
    await client.delete(`/api/v1/messages/${messageId}`);
  },

  // ── Search ─────────────────────────────────────────────────────────────────
  async search(q: string, type?: string): Promise<SearchResult> {
    const params: any = { q };
    if (type) params.type = type;
    const { data } = await client.get('/api/v1/search', { params });
    return data.data;
  },
  async searchTrips(q: string): Promise<any[]> {
    const { data } = await client.get('/api/v1/search/trips', { params: { q } });
    return data.data;
  },
  async searchOrganizers(q: string): Promise<any[]> {
    const { data } = await client.get('/api/v1/search/organizers', { params: { q } });
    return data.data;
  }
};
