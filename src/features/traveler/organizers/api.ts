import { api } from '../../../services/api';

export const organizersApi = {
  listOrganizers: (params?: any) => api.listOrganizers(params),
};
