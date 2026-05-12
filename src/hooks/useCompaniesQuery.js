import { useQuery } from '@tanstack/react-query';
import { getCompanies } from '../api/services/companies.js';
import { queryKeys } from '../constants/queryKeys.js';

export function useCompaniesQuery() {
  return useQuery({
    queryKey: queryKeys.companies,
    queryFn: getCompanies,
  });
}
