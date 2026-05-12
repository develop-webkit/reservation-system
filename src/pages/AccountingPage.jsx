import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { updateAccountingEntry } from '../api/services/accounting.js';
import AccountingEditDrawer from '../components/accounting/AccountingEditDrawer.jsx';
import AccountingFilters from '../components/accounting/AccountingFilters.jsx';
import AccountingTable from '../components/accounting/AccountingTable.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAccountingQuery } from '../hooks/useAccountingQuery.js';
import { useAppMutation } from '../hooks/useAppMutation.js';

function AccountingPage() {
  const queryClient = useQueryClient();
  const [editingEntry, setEditingEntry] = useState(null);
  const [filters, setFilters] = useState({
    clientNumber: '',
    voucherCode: '',
    referenceNo: '',
    hasVoucher: undefined,
  });

  const accountingQuery = useAccountingQuery(filters);
  const updateMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateAccountingEntry(id, payload),
    successMessage: 'Accounting entry updated successfully.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounting });
      setEditingEntry(null);
    },
  });

  return (
    <div className="page-stack">
      <PageHeader
        title="Accounting"
        subtitle="Use ledger entries for financial history, voucher tracking, and balance visibility."
      />
      <SectionCard title="Ledger filters">
        <AccountingFilters
          filters={filters}
          onChange={(key, value) => setFilters((current) => ({ ...current, [key]: value }))}
        />
      </SectionCard>
      <SectionCard title="Accounting history">
        <AccountingTable
          data={accountingQuery.data || []}
          loading={accountingQuery.isLoading}
          onEdit={setEditingEntry}
        />
      </SectionCard>
      <AccountingEditDrawer
        open={Boolean(editingEntry)}
        onClose={() => setEditingEntry(null)}
        onSubmit={(values) =>
          updateMutation.mutateAsync({ id: editingEntry._id, payload: values })
        }
        loading={updateMutation.isPending}
        initialValues={editingEntry}
      />
    </div>
  );
}

export default AccountingPage;
