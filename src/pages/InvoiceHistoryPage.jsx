import { message } from 'antd';
import { Navigate, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import InvoiceHistoryTable from '../components/invoice/InvoiceHistoryTable.jsx';
import useAuthStore from '../store/authStore.js';
import { useInvoices } from '../hooks/useInvoices.js';
import { useCreateInvoiceEditRequest, useInvoiceEditRequests } from '../hooks/useInvoiceEditRequests.js';

function InvoiceHistoryPage() {
  const role = useAuthStore((state) => state.user?.role);
  const navigate = useNavigate();
  const invoicesQuery = useInvoices();
  const isManager = role === 'manager';
  const editRequestsQuery = useInvoiceEditRequests({ enabled: isManager });
  const createEditRequest = useCreateInvoiceEditRequest();

  if (!['admin', 'manager'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const editRequests = Array.isArray(editRequestsQuery.data)
    ? editRequestsQuery.data
    : (editRequestsQuery.data?.data || []);
  const pendingInvoiceIds = new Set(
    editRequests.filter((r) => r.status === 'Pending').map((r) => r.invoice),
  );

  const handleRequestEdit = (record) => {
    createEditRequest.mutate(record._id, {
      onSuccess: () => message.success('Edit request submitted — waiting on admin review.'),
      onError: (err) => message.error(err.response?.data?.message || 'Failed to submit edit request'),
    });
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Invoice History"
        subtitle="Saved invoices — open one to continue editing within its allowed window."
      />
      <SectionCard title="Saved invoices">
        <InvoiceHistoryTable
          data={invoicesQuery.data || []}
          loading={invoicesQuery.isLoading}
          onOpen={(record) => navigate(`/invoice-generator?invoiceId=${record._id}`)}
          isManager={isManager}
          pendingInvoiceIds={pendingInvoiceIds}
          onRequestEdit={handleRequestEdit}
          requestingEdit={createEditRequest.isPending}
        />
      </SectionCard>
    </div>
  );
}

export default InvoiceHistoryPage;
