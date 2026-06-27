import { Navigate, useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import InvoiceHistoryTable from '../components/invoice/InvoiceHistoryTable.jsx';
import useAuthStore from '../store/authStore.js';
import { useInvoices } from '../hooks/useInvoices.js';

function InvoiceHistoryPage() {
  const role = useAuthStore((state) => state.user?.role);
  const navigate = useNavigate();
  const invoicesQuery = useInvoices();

  if (!['admin', 'manager'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

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
        />
      </SectionCard>
    </div>
  );
}

export default InvoiceHistoryPage;
