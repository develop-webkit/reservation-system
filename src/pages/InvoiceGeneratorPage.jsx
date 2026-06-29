import { useEffect, useRef, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import {
  Button, Col, DatePicker, Divider, Input,
  InputNumber, Modal, Row, Space, Tooltip, Typography,
} from 'antd';
import { DownloadOutlined, EyeOutlined, PrinterOutlined, ReloadOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InvoiceGeneratorPDF from '../components/invoice/InvoiceGeneratorPDF.jsx';
import InvoiceLineItemsTable from '../components/invoice/InvoiceLineItemsTable.jsx';
import VoucherCodeField from '../components/common/VoucherCodeField.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import useAuthStore from '../store/authStore.js';
import { useInvoiceGenerator } from '../hooks/useInvoiceGenerator.js';
import { useInvoice, useCreateInvoice, useUpdateInvoice } from '../hooks/useInvoices.js';

const { Text } = Typography;

function FieldLabel({ children, optional }) {
  return (
    <Text strong style={{ display: 'block', marginBottom: 4 }}>
      {children}
      {optional && <Text type="secondary" style={{ fontWeight: 400 }}> (optional)</Text>}
    </Text>
  );
}

function TotalRow({ label, value, bold }) {
  const fmtMoney = (n) => `$${Number(n).toFixed(2)}`;
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 6 }}>
      <Text strong={bold} style={{ minWidth: 150, textAlign: 'right' }}>{label}</Text>
      <Text strong={bold} style={{ minWidth: 100, textAlign: 'right' }}>{fmtMoney(value)}</Text>
    </div>
  );
}

function InvoiceTotals({ net, gst, voucherDiscount, total }) {
  return (
    <div>
      <TotalRow label="NET" value={net} />
      <TotalRow label="GST (10%)" value={gst} />
      {voucherDiscount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginBottom: 6 }}>
          <Text type="danger" style={{ minWidth: 150, textAlign: 'right' }}>Voucher Discount</Text>
          <Text type="danger" style={{ minWidth: 100, textAlign: 'right' }}>-${Number(voucherDiscount).toFixed(2)}</Text>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Divider style={{ width: 270, minWidth: 0, margin: '6px 0' }} />
      </div>
      <TotalRow label="Total (Inc. GST)" value={total} bold />
      <TotalRow label="Balance Due" value={total} />
    </div>
  );
}

function DownloadButton({ invoice, disabled }) {
  if (disabled) {
    return (
      <Tooltip title="Fill in client name and at least one line item with a price to download">
        <Button type="primary" icon={<DownloadOutlined />} disabled>
          Download PDF
        </Button>
      </Tooltip>
    );
  }
  return (
    <PDFDownloadLink
      document={<InvoiceGeneratorPDF invoice={invoice} />}
      fileName={`Invoice-${invoice.invoiceNo}.pdf`}
    >
      {({ loading }) => (
        <Button type="primary" icon={<DownloadOutlined />} loading={loading}>
          Download PDF
        </Button>
      )}
    </PDFDownloadLink>
  );
}

function InvoiceGeneratorPage() {
  const role = useAuthStore((state) => state.user?.role);
  const [previewOpen, setPreviewOpen] = useState(false);
  const pdfViewerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const invoiceId = searchParams.get('invoiceId');
  const {
    invoice, meta, setField, addLineItem, removeLineItem, updateLineItem,
    loadInvoice, resetInvoice, totals,
  } = useInvoiceGenerator();

  const savedInvoiceQuery = useInvoice(invoiceId);
  const createMutation = useCreateInvoice();
  const updateMutation = useUpdateInvoice();

  useEffect(() => {
    if (savedInvoiceQuery.data) {
      loadInvoice(savedInvoiceQuery.data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedInvoiceQuery.data]);

  if (!['admin', 'manager'].includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  const hasData =
    (invoice.billedTo?.trim() || invoice.clientName?.trim()) &&
    invoice.lineItems.some((item) => Number(item.totalPrice) > 0);

  const isSaving = createMutation.isPending || updateMutation.isPending;
  const editLocked = Boolean(meta.id) && meta.canEdit === false;

  const handlePrint = () => {
    if (!pdfViewerRef.current) return;
    const iframe = pdfViewerRef.current.querySelector('iframe');
    if (iframe) iframe.contentWindow?.print();
  };

  const handleSaveInvoice = () => {
    if (isSaving || editLocked) return;
    const payload = {
      ...invoice,
      lineItems: invoice.lineItems.map((item) => ({
        date: item.date,
        roomNo: item.roomNo,
        withMeals: item.withMeals,
        mealOnly: item.mealOnly,
        roomOnly: item.roomOnly,
        fromDate: item.fromDate,
        toDate: item.toDate,
        totalPrice: item.totalPrice,
      })),
    };
    if (meta.id) {
      updateMutation.mutate({ id: meta.id, data: payload });
    } else {
      createMutation.mutate(payload, {
        onSuccess: (created) => {
          setSearchParams({ invoiceId: created._id }, { replace: true });
        },
      });
    }
  };

  const handleNewInvoice = () => {
    resetInvoice();
    setSearchParams({}, { replace: true });
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Invoice Generator"
        subtitle="Create professional Tax Invoices (AUD) for corporate clients."
        extra={
          <Space>
            <Tooltip title={editLocked ? 'This invoice can no longer be edited — the 5-day edit window has expired' : ''}>
              <Button
                type="primary"
                danger
                icon={<SaveOutlined />}
                onClick={handleSaveInvoice}
                loading={isSaving}
                disabled={!hasData || editLocked}
              >
                Save Invoice
              </Button>
            </Tooltip>
            <Button icon={<ReloadOutlined />} onClick={handleNewInvoice}>New Invoice</Button>
            <Tooltip title={!hasData ? 'Fill in client name and at least one line item with a price to preview' : ''}>
              <Button
                icon={<EyeOutlined />}
                onClick={() => setPreviewOpen(true)}
                disabled={!hasData}
              >
                Preview / Print
              </Button>
            </Tooltip>
            <DownloadButton invoice={invoice} disabled={!hasData} />
          </Space>
        }
      />

      <SectionCard title="Invoice Header">
        <Row gutter={[24, 0]}>
          {/* Left column — billing info */}
          <Col xs={24} md={11}>
            <Row gutter={[16, 14]}>
              <Col span={24}>
                <FieldLabel>Invoice No</FieldLabel>
                <Input
                  value={invoice.invoiceNo}
                  onChange={(e) => setField('invoiceNo', e.target.value)}
                  placeholder="e.g. 42"
                />
              </Col>
              <Col span={24}>
                <FieldLabel>Billed To (Client Company Name)</FieldLabel>
                <Input
                  value={invoice.billedTo}
                  onChange={(e) => setField('billedTo', e.target.value)}
                  placeholder="Company being billed"
                />
              </Col>
              <Col span={24}>
                <FieldLabel>Client Name</FieldLabel>
                <Input
                  value={invoice.clientName}
                  onChange={(e) => setField('clientName', e.target.value)}
                  placeholder="Contact person name"
                />
              </Col>
            </Row>
          </Col>

          <Col xs={0} md={2} style={{ display: 'flex', justifyContent: 'center' }}>
            <Divider type="vertical" style={{ height: '100%' }} />
          </Col>

          {/* Right column — dates and reference fields */}
          <Col xs={24} md={11}>
            <Row gutter={[16, 14]}>
              <Col xs={24} sm={12}>
                <FieldLabel>Invoice Date</FieldLabel>
                <DatePicker
                  value={invoice.invoiceDate ? dayjs(invoice.invoiceDate) : null}
                  onChange={(d) => setField('invoiceDate', d?.format('YYYY-MM-DD') ?? null)}
                  format="DD MMM YYYY"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel>Due Date</FieldLabel>
                <DatePicker
                  value={invoice.dueDate ? dayjs(invoice.dueDate) : null}
                  onChange={(d) => setField('dueDate', d?.format('YYYY-MM-DD') ?? null)}
                  format="DD MMM YYYY"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel>Start Date</FieldLabel>
                <DatePicker
                  value={invoice.arriveDate ? dayjs(invoice.arriveDate) : null}
                  onChange={(d) => setField('arriveDate', d?.format('YYYY-MM-DD') ?? null)}
                  format="DD MMM YYYY"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel>End Date</FieldLabel>
                <DatePicker
                  value={invoice.departDate ? dayjs(invoice.departDate) : null}
                  onChange={(d) => setField('departDate', d?.format('YYYY-MM-DD') ?? null)}
                  format="DD MMM YYYY"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <FieldLabel>Adults</FieldLabel>
                <InputNumber
                  value={invoice.adults}
                  min={1}
                  onChange={(v) => setField('adults', v ?? 1)}
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={8}>
                <FieldLabel optional>Voucher No</FieldLabel>
                <VoucherCodeField
                  code={invoice.voucherNo}
                  discount={invoice.voucherDiscount}
                  onCodeChange={(v) => setField('voucherNo', v)}
                  onApply={(amount) => setField('voucherDiscount', amount)}
                />
              </Col>
              <Col xs={24} sm={8}>
                <FieldLabel>Invoice Generated By</FieldLabel>
                <Input
                  value={invoice.cashierName}
                  onChange={(e) => setField('cashierName', e.target.value)}
                  placeholder="Staff name"
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel optional>Rate</FieldLabel>
                <Input
                  value={invoice.accountNo}
                  onChange={(e) => setField('accountNo', e.target.value)}
                  placeholder="Optional"
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel optional>Duration</FieldLabel>
                <Input
                  value={invoice.reservationNo}
                  onChange={(e) => setField('reservationNo', e.target.value)}
                  placeholder="Optional"
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </SectionCard>

      <SectionCard title="Invoice Details">
        <InvoiceLineItemsTable
          lineItems={invoice.lineItems}
          onAdd={addLineItem}
          onRemove={removeLineItem}
          onUpdate={updateLineItem}
        />
        <Divider />
        <InvoiceTotals net={totals.net} gst={totals.gst} voucherDiscount={totals.voucherDiscount} total={totals.total} />
      </SectionCard>

      <SectionCard title="Notes">
        <Input.TextArea
          value={invoice.notes}
          onChange={(e) => setField('notes', e.target.value)}
          rows={3}
          autoSize={{ minRows: 2, maxRows: 5 }}
        />
      </SectionCard>

      <Modal
        title={`Invoice Preview — #${invoice.invoiceNo}`}
        open={previewOpen}
        onCancel={() => setPreviewOpen(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setPreviewOpen(false)}>Close</Button>,
          <Button key="print" icon={<PrinterOutlined />} onClick={handlePrint}>Print</Button>,
          <DownloadButton key="download" invoice={invoice} disabled={!hasData} />,
        ]}
      >
        <div ref={pdfViewerRef} style={{ width: '100%', height: 600 }}>
          <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
            <InvoiceGeneratorPDF invoice={invoice} />
          </PDFViewer>
        </div>
      </Modal>
    </div>
  );
}

export default InvoiceGeneratorPage;
