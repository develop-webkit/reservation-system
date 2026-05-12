import { useQuery } from '@tanstack/react-query';
import { getClients } from '../api/services/clients.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useClientsQuery(filters) {
  return useQuery({
    queryKey: [...queryKeys.clients, filters],
    queryFn: () => getClients(filters),
  });
}
