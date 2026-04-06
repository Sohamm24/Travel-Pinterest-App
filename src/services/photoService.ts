import api from './api';
import type { PhotosResponse, TourismPhoto, Review, TourismTypeFilter } from '../types';

export const photoService = {
  async getFeed(params: {
    tourism_type?: TourismTypeFilter;
    offset?: number;
    limit?: number;
  }): Promise<PhotosResponse> {
    const { data } = await api.get<PhotosResponse>('/api/photos', { params });
    return data;
  },

  async getPhotoDetail(id: number): Promise<{ photo: TourismPhoto; guide: any; reviews: Review[] }> {
    const { data } = await api.get(`/api/photos/${id}`);
    return data;
  },

  async uploadPhoto(form: FormData): Promise<TourismPhoto> {
    const { data } = await api.post<TourismPhoto>('/api/photos', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  async deletePhoto(id: number): Promise<void> {
    await api.delete(`/api/photos/${id}`);
  },

  async savePhoto(photoId: number): Promise<void> {
    await api.post(`/api/saved/${photoId}`);
  },

  async unsavePhoto(photoId: number): Promise<void> {
    await api.delete(`/api/saved/${photoId}`);
  },

  async getSavedPhotos(): Promise<TourismPhoto[]> {
    const { data } = await api.get<TourismPhoto[]>('/api/saved');
    return data;
  },

  async createReview(payload: { photo_id: number; rating: number; comment: string }): Promise<Review> {
    const { data } = await api.post<Review>('/api/reviews', payload);
    return data;
  },

  async getReviews(photoId: number): Promise<Review[]> {
    const { data } = await api.get<Review[]>(`/api/reviews/${photoId}`);
    return data;
  },
};
