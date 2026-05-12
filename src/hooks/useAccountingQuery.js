import { useQuery } from '@tanstack/react-query';
import { getAccountingEntries } from '../api/services/accounting.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useAccountingQuery(filters) {
  return useQuery({
    queryKey: [...queryKeys.accounting, filters],
    queryFn: () => getAccountingEntries(filters),
  });
}
