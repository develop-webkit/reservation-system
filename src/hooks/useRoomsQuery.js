import { useQuery } from '@tanstack/react-query';
import { getRooms } from '../api/services/rooms.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useRoomsQuery() {
  return useQuery({
    queryKey: queryKeys.rooms,
    queryFn: getRooms,
  });
}
