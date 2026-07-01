import { api } from '../../../services/api';
import type { OrganizerTrip } from './types';

export const tripsDashboardApi = {
  getOrganizerTrips: (organizerId?: string): Promise<OrganizerTrip[]> =>
    api.getOrganizerTrips(organizerId).then((res) => res.trips as unknown as OrganizerTrip[]),
};
