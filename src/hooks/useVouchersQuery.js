import { useQuery } from '@tanstack/react-query';
import { getVouchers } from '../api/services/vouchers.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useVouchersQuery() {
  return useQuery({
    queryKey: queryKeys.vouchers,
    queryFn: getVouchers,
  });
}
