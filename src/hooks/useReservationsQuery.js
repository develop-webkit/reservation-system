import { useQuery } from '@tanstack/react-query';
import { getReservations } from '../api/services/reservations.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useReservationsQuery(filters) {
  return useQuery({
    queryKey: [...queryKeys.reservations, filters],
    queryFn: () => getReservations(filters),
  });
}
