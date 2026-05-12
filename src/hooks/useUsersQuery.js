import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../api/services/users.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useUsersQuery(filters) {
  return useQuery({
    queryKey: [...queryKeys.users, filters],
    queryFn: () => getUsers(filters),
  });
}
