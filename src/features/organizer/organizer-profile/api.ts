import { api } from '../../../services/api';

export const organizerProfileApi = {
  getOrganizer: (id: string) => api.getOrganizer(id),
};
