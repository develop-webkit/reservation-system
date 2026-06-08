import { Document, Image, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import logoSrc from '../../assets/logo.png';
import dayjs from 'dayjs';

const COMPANY = {
  name: 'Mount Morgan Space Solutions',
  address: '35 Hall St',
  suburb: 'Mount Morgan QLD 4714',
  abn: 'ABN: 89 680 289 276',
  phone: 'Phone: +61 447 675 067',
  email: 'mtmorganmanager@gmail.com',
  website: 'www.mtmorganvillage.com',
  bankAccountName: 'Mount Morgan Space Solutions Pty Ltd',
  bsb: '064-034',
  bankAccountNo: '306037269',
};

const fd = (d) => (d ? dayjs(d).format('DD MMM YYYY') : '—');
const fm = (n) => Number(n || 0).toFixed(2);

const S = StyleSheet.create({
  page: { padding: '28pt 34pt', fontSize: 8.5, fontFamily: 'Helvetica', color: '#1a1a1a' },
  // Header
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  logoImage: { width: 90, height: 90, objectFit: 'contain' },
  companyBlock: { alignItems: 'flex-end' },
  companyName: { fontFamily: 'Helvetica-Bold', fontSize: 12, marginBottom: 2 },
  companyLine: { marginBottom: 1.5 },
  divider: { borderBottomWidth: 1, borderBottomColor: '#888', marginVertical: 10 },
  // Invoice body
  bodyRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  leftBlock: { flex: 1, paddingRight: 8 },
  invoiceTitle: { fontFamily: 'Helvetica-Bold', fontSize: 13, marginBottom: 3 },
  invoiceNoLine: { marginBottom: 10 },
  billedLabel: { fontFamily: 'Helvetica-Bold', marginBottom: 2 },
  // Info box
  infoBox: { width: 244, borderWidth: 0.5, borderColor: '#999', padding: '5pt 7pt' },
  infoRow: { flexDirection: 'row', marginBottom: 2.5 },
  infoLabel: { fontFamily: 'Helvetica-Bold', width: 82 },
  infoValue: { flex: 1 },
  // Table
  table: { marginTop: 14 },
  tableHeader: { flexDirection: 'row', backgroundColor: '#ddd', paddingVertical: 4, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#555' },
  tableHeaderCell: { fontFamily: 'Helvetica-Bold' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: '#ddd', paddingVertical: 4, paddingHorizontal: 4, minHeight: 24 },
  cDate: { width: '14%' },
  cDetail: { width: '55%' },
  cGst: { width: '15%', textAlign: 'right' },
  cAmount: { width: '16%', textAlign: 'right' },
  detailLine: { marginBottom: 1.5, lineHeight: 1.35 },
  // Totals
  totalsOuter: { alignItems: 'flex-end', marginTop: 10 },
  totalRow: { flexDirection: 'row', width: 200, marginBottom: 3 },
  totalLabel: { flex: 1, fontFamily: 'Helvetica-Bold' },
  totalValue: { width: 70, textAlign: 'right' },
  totalDivider: { width: 200, borderBottomWidth: 0.5, borderBottomColor: '#555', marginVertical: 3 },
  totalBold: { fontFamily: 'Helvetica-Bold' },
  // Notes
  notesBox: { marginTop: 14, borderWidth: 0.5, borderColor: '#999', padding: '6pt 8pt' },
  notesTitle: { fontFamily: 'Helvetica-Bold', marginBottom: 3 },
  notesText: { lineHeight: 1.5 },
  // Powered by
  poweredBy: {
    marginTop: 12,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#aaa',
    borderTopStyle: 'dashed',
    textAlign: 'center',
    fontSize: 7.5,
    color: '#888',
  },
  // Remittance
  remittanceRow: { flexDirection: 'row', marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#555' },
  remittanceTitle: { fontFamily: 'Helvetica-Bold', fontSize: 9, marginBottom: 5 },
  remittanceLine: { marginBottom: 2.5, lineHeight: 1.35 },
});

function InfoRow({ label, value }) {
  return (
    <View style={S.infoRow}>
      <Text style={S.infoLabel}>{label}</Text>
      <Text style={S.infoValue}>{value ?? '—'}</Text>
    </View>
  );
}

function InvoiceGeneratorPDF({ invoice }) {
  const net = invoice.lineItems.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
  const gst = net * 0.1;
  const total = net + gst;

  return (
    <Document title={`Invoice-${invoice.invoiceNo}`}>
      <Page size="A4" style={S.page}>
        {/* Company header */}
        <View style={S.topRow}>
          <Image src={logoSrc} style={S.logoImage} />
          <View style={S.companyBlock}>
            <Text style={S.companyName}>{COMPANY.name}</Text>
            <Text style={S.companyLine}>{COMPANY.address}</Text>
            <Text style={S.companyLine}>{COMPANY.suburb}</Text>
            <Text style={S.companyLine}> </Text>
            <Text style={S.companyLine}>{COMPANY.abn}</Text>
            <Text style={S.companyLine}>{COMPANY.phone}</Text>
            <Text style={S.companyLine}> </Text>
            <Text style={S.companyLine}>{COMPANY.email}</Text>
            <Text style={S.companyLine}>{COMPANY.website}</Text>
          </View>
        </View>

        <View style={S.divider} />

        {/* Invoice title + right info box */}
        <View style={S.bodyRow}>
          <View style={S.leftBlock}>
            <Text style={S.invoiceTitle}>Tax Invoice (AUD)</Text>
            <Text style={S.invoiceNoLine}>Invoice No: {invoice.invoiceNo}</Text>
            <Text style={{ marginBottom: 3 }}> </Text>
            <Text style={S.billedLabel}>Billed To:</Text>
            <Text>{invoice.billedTo || '—'}</Text>
          </View>
          <View style={S.infoBox}>
            <InfoRow label="Client" value={invoice.clientName} />
            <InfoRow label="Date" value={fd(invoice.invoiceDate)} />
            <InfoRow label="Adults" value={String(invoice.adults ?? '')} />
            <InfoRow label="Arrive Date" value={fd(invoice.arriveDate)} />
            <InfoRow label="Depart Date" value={fd(invoice.departDate)} />
            <InfoRow label="Voucher No" value={invoice.voucherNo || '—'} />
            <InfoRow label="Account No" value={invoice.accountNo || '—'} />
            <InfoRow label="Reservation No" value={invoice.reservationNo || '—'} />
            <InfoRow label="Cashier" value={invoice.cashierName} />
            <InfoRow label="Due Date" value={fd(invoice.dueDate)} />
          </View>
        </View>

        {/* Line items table */}
        <View style={S.table}>
          <View style={S.tableHeader}>
            <Text style={[S.tableHeaderCell, S.cDate]}>Date</Text>
            <Text style={[S.tableHeaderCell, S.cDetail]}>Detail</Text>
            <Text style={[S.tableHeaderCell, S.cGst]}>GST</Text>
            <Text style={[S.tableHeaderCell, S.cAmount]}>Amount (Inc. GST)</Text>
          </View>
          {invoice.lineItems.map((item, idx) => {
            const nights =
              item.fromDate && item.toDate
                ? Math.max(0, dayjs(item.toDate).diff(dayjs(item.fromDate), 'day'))
                : 0;
            const rateType = item.withMeals
              ? 'HM Occupied Rate Including Meals'
              : 'Room Only Rate';
            const rowGst = Number(item.totalPrice || 0) * 0.1;
            const rowAmt = Number(item.totalPrice || 0) * 1.1;
            return (
              <View key={item.id || idx} style={S.tableRow}>
                <Text style={S.cDate}>{fd(item.date)}</Text>
                <View style={S.cDetail}>
                  {item.roomNo ? (
                    <Text style={S.detailLine}>
                      {item.roomNo}: Occupied Room Rate PRPN -{' '}
                      {item.date ? `(${dayjs(item.date).format('DD-MMM-YY')})` : ''}
                    </Text>
                  ) : null}
                  <Text style={S.detailLine}>{nights} x {rateType}.</Text>
                  <Text style={S.detailLine}>
                    {nights} Bednights {fd(item.fromDate)} to {fd(item.toDate)}
                  </Text>
                </View>
                <Text style={S.cGst}>${fm(rowGst)}</Text>
                <Text style={S.cAmount}>${fm(rowAmt)}</Text>
              </View>
            );
          })}
        </View>

        {/* Totals */}
        <View style={S.totalsOuter}>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>NET</Text>
            <Text style={S.totalValue}>${fm(net)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>GST</Text>
            <Text style={S.totalValue}>${fm(gst)}</Text>
          </View>
          <View style={S.totalDivider} />
          <View style={S.totalRow}>
            <Text style={[S.totalLabel, S.totalBold]}>Total</Text>
            <Text style={[S.totalValue, S.totalBold]}>${fm(total)}</Text>
          </View>
          <View style={S.totalRow}>
            <Text style={S.totalLabel}>Balance</Text>
            <Text style={S.totalValue}>${fm(total)}</Text>
          </View>
        </View>

        {/* Notes */}
        <View style={S.notesBox}>
          <Text style={S.notesTitle}>Notes</Text>
          <Text style={S.notesText}>
            {invoice.notes ||
              'Please note: Payment Terms are strictly 14 days from the date of invoice. Your account is required to be 14 days in credit at all times.'}
          </Text>
        </View>

        {/* Powered by separator */}
        <View style={S.poweredBy}>
          <Text>Powered by rmcloud.com</Text>
        </View>

        {/* Remittance */}
        <View style={S.remittanceRow}>
          <View style={{ flex: 1 }}>
            <Text style={S.remittanceTitle}>Remittance</Text>
            <Text style={S.remittanceLine}>{invoice.billedTo || '—'}</Text>
            <Text style={S.remittanceLine}> </Text>
            <Text style={S.remittanceLine}>Reference No: {invoice.reservationNo || '—'}</Text>
            <Text style={S.remittanceLine}>Invoice No: {invoice.invoiceNo}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={S.remittanceTitle}>Bank Details</Text>
            <Text style={S.remittanceLine}>Account Name: {COMPANY.bankAccountName}</Text>
            <Text style={S.remittanceLine}>BSB Number: {COMPANY.bsb}</Text>
            <Text style={S.remittanceLine}>Account Number: {COMPANY.bankAccountNo}</Text>
            <Text style={[S.remittanceLine, S.totalBold, { marginTop: 6 }]}>
              Total: $ {fm(total)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export default InvoiceGeneratorPDF;
