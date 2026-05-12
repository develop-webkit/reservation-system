import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createVoucher, updateVoucher } from '../api/services/vouchers.js';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import VoucherFormDrawer from '../components/vouchers/VoucherFormDrawer.jsx';
import VouchersTable from '../components/vouchers/VouchersTable.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useClientsQuery } from '../hooks/useClientsQuery.js';
import { useCompaniesQuery } from '../hooks/useCompaniesQuery.js';
import { useVouchersQuery } from '../hooks/useVouchersQuery.js';

function VouchersPage() {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState(null);
  const vouchersQuery = useVouchersQuery();
  const clientsQuery = useClientsQuery({});
  const companiesQuery = useCompaniesQuery();

  const createMutation = useAppMutation({
    mutationFn: createVoucher,
    successMessage: 'Voucher created successfully.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers });
      setDrawerOpen(false);
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateVoucher(id, payload),
    successMessage: 'Voucher updated successfully.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.vouchers });
      setDrawerOpen(false);
      setEditingVoucher(null);
    },
  });

  const handleSubmit = async (values) => {
    if (editingVoucher?._id) {
      await updateMutation.mutateAsync({ id: editingVoucher._id, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Vouchers"
        subtitle="Create and maintain guest credits, client-scoped voucher programs, and expiry-controlled offers."
        actionLabel="New voucher"
        onActionClick={() => {
          setEditingVoucher(null);
          setDrawerOpen(true);
        }}
      />
      <SectionCard title="Voucher directory">
        <VouchersTable
          data={vouchersQuery.data || []}
          loading={vouchersQuery.isLoading}
          onEdit={(record) => {
            setEditingVoucher(record);
            setDrawerOpen(true);
          }}
        />
      </SectionCard>
      <VoucherFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingVoucher(null);
        }}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        clients={clientsQuery.data}
        companies={companiesQuery.data}
        initialValues={editingVoucher}
      />
    </div>
  );
}

export default VouchersPage;
