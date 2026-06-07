import { useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import {
  Button, Col, DatePicker, Divider, Input,
  InputNumber, Modal, Row, Space, Typography,
} from 'antd';
import { DownloadOutlined, EyeOutlined, PrinterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InvoiceGeneratorPDF from '../components/invoice/InvoiceGeneratorPDF.jsx';
import InvoiceLineItemsTable from '../components/invoice/InvoiceLineItemsTable.jsx';
import PageHeader from '../components/common/PageHeader.jsx';
import SectionCard from '../components/common/SectionCard.jsx';
import useAuthStore from '../store/authStore.js';
import { useInvoiceGenerator } from '../hooks/useInvoiceGenerator.js';

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

function InvoiceTotals({ net, gst, total }) {
  return (
    <div>
      <TotalRow label="NET" value={net} />
      <TotalRow label="GST (10%)" value={gst} />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Divider style={{ width: 270, minWidth: 0, margin: '6px 0' }} />
      </div>
      <TotalRow label="Total (Inc. GST)" value={total} bold />
      <TotalRow label="Balance Due" value={total} />
    </div>
  );
}

function DownloadButton({ invoice }) {
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
  const { invoice, setField, addLineItem, removeLineItem, updateLineItem, resetInvoice, totals } =
    useInvoiceGenerator();

  if (role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handlePrint = () => {
    if (!pdfViewerRef.current) return;
    const iframe = pdfViewerRef.current.querySelector('iframe');
    if (iframe) iframe.contentWindow?.print();
  };

  return (
    <div className="page-stack">
      <PageHeader
        title="Invoice Generator"
        subtitle="Create professional Tax Invoices (AUD) for corporate clients."
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={resetInvoice}>New Invoice</Button>
            <Button icon={<EyeOutlined />} onClick={() => setPreviewOpen(true)}>Preview / Print</Button>
            <DownloadButton invoice={invoice} />
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
                <FieldLabel>Arrive Date</FieldLabel>
                <DatePicker
                  value={invoice.arriveDate ? dayjs(invoice.arriveDate) : null}
                  onChange={(d) => setField('arriveDate', d?.format('YYYY-MM-DD') ?? null)}
                  format="DD MMM YYYY"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel>Departure Date</FieldLabel>
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
                <Input
                  value={invoice.voucherNo}
                  onChange={(e) => setField('voucherNo', e.target.value)}
                  placeholder="Optional"
                />
              </Col>
              <Col xs={24} sm={8}>
                <FieldLabel>Cashier Name</FieldLabel>
                <Input
                  value={invoice.cashierName}
                  onChange={(e) => setField('cashierName', e.target.value)}
                  placeholder="Staff name"
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel optional>Account No</FieldLabel>
                <Input
                  value={invoice.accountNo}
                  onChange={(e) => setField('accountNo', e.target.value)}
                  placeholder="Optional"
                />
              </Col>
              <Col xs={24} sm={12}>
                <FieldLabel optional>Reservation No</FieldLabel>
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
        <InvoiceTotals net={totals.net} gst={totals.gst} total={totals.total} />
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
          <DownloadButton key="download" invoice={invoice} />,
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
