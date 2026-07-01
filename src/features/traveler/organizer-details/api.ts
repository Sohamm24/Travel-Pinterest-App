import { api } from '../../../services/api';

export const organizerDetailsApi = {
  getOrganizer: (id: string) => api.getOrganizer(id),
  getOrganizerTrips: (id: string, params?: any) => api.listTrips({ organizer_id: id, ...params }),
};
