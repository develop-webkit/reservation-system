import { useQuery } from '@tanstack/react-query';
import { getBookings } from '../api/services/bookings.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useBookingsQuery(filters) {
  return useQuery({
    queryKey: [...queryKeys.bookings, filters],
    queryFn: () => getBookings(filters),
  });
}
