import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createClient, updateClient } from '../api/services/clients.js';
import ClientFormDrawer from '../components/clients/ClientFormDrawer.jsx';
import ClientsTable from '../components/clients/ClientsTable.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import { queryKeys } from '../constants/queryKeys.js';
import { useAppMutation } from '../hooks/useAppMutation.js';
import { useClientsQuery } from '../hooks/useClientsQuery.js';
import { useCompaniesQuery } from '../hooks/useCompaniesQuery.js';

function ClientsPage() {
  const queryClient = useQueryClient();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const clientsQuery = useClientsQuery({});
  const companiesQuery = useCompaniesQuery();

  const createMutation = useAppMutation({
    mutationFn: createClient,
    successMessage: 'Client created successfully.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      setDrawerOpen(false);
    },
  });

  const updateMutation = useAppMutation({
    mutationFn: ({ id, payload }) => updateClient(id, payload),
    successMessage: 'Client updated successfully.',
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clients });
      setDrawerOpen(false);
      setEditingClient(null);
    },
  });

  const handleSubmit = async (values) => {
    if (editingClient?._id) {
      await updateMutation.mutateAsync({ id: editingClient._id, payload: values });
      return;
    }

    await createMutation.mutateAsync(values);
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Clients"
        subtitle="Manage tenant profiles, guest billing rates, and company-linked customer records."
        actionLabel="New client"
        onActionClick={() => {
          setEditingClient(null);
          setDrawerOpen(true);
        }}
      />
      <SectionCard title="Client directory">
        <ClientsTable
          data={clientsQuery.data || []}
          loading={clientsQuery.isLoading}
          onEdit={(record) => {
            setEditingClient(record);
            setDrawerOpen(true);
          }}
        />
      </SectionCard>
      <ClientFormDrawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSubmit}
        loading={createMutation.isPending || updateMutation.isPending}
        companies={companiesQuery.data}
        initialValues={editingClient}
      />
    </div>
  );
}

export default ClientsPage;
