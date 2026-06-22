import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';

const RATE_TYPE_FIELDS = ['withMeals', 'mealOnly', 'roomOnly'];

const newLineItem = () => ({
  id: Date.now() + Math.random(),
  date: dayjs().format('YYYY-MM-DD'),
  roomNo: '',
  withMeals: true,
  mealOnly: false,
  roomOnly: false,
  fromDate: null,
  toDate: null,
  totalPrice: 0,
});

const buildInitial = () => ({
  invoiceNo: String(Math.floor(Math.random() * 9000) + 1000),
  billedTo: '',
  clientName: '',
  invoiceDate: dayjs().format('YYYY-MM-DD'),
  adults: 1,
  arriveDate: null,
  departDate: null,
  voucherNo: '',
  voucherDiscount: 0,
  cashierName: '',
  dueDate: dayjs().add(14, 'days').format('YYYY-MM-DD'),
  accountNo: '',
  reservationNo: '',
  notes:
    'Please Note: Payments are to be paid in full in advance. Payment must be received by the due date.',
  lineItems: [newLineItem()],
});

export function useInvoiceGenerator() {
  const [invoice, setInvoice] = useState(buildInitial);

  const setField = useCallback((field, value) => {
    setInvoice((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'invoiceDate' && value) {
        next.dueDate = dayjs(value).add(14, 'days').format('YYYY-MM-DD');
      }
      // Editing the voucher code invalidates any previously-applied discount until re-validated
      if (field === 'voucherNo') {
        next.voucherDiscount = 0;
      }
      return next;
    });
  }, []);

  const addLineItem = useCallback(() => {
    setInvoice((prev) => ({ ...prev, lineItems: [...prev.lineItems, newLineItem()] }));
  }, []);

  const removeLineItem = useCallback((index) => {
    setInvoice((prev) => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index),
    }));
  }, []);

  const updateLineItem = useCallback((index, field, value) => {
    setInvoice((prev) => {
      const items = [...prev.lineItems];
      items[index] = { ...items[index], [field]: value };
      if (RATE_TYPE_FIELDS.includes(field) && value) {
        RATE_TYPE_FIELDS.forEach((otherField) => {
          if (otherField !== field) items[index][otherField] = false;
        });
      }
      return { ...prev, lineItems: items };
    });
  }, []);

  const resetInvoice = useCallback(() => setInvoice(buildInitial), []);

  const totals = useMemo(() => {
    const net = invoice.lineItems.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
    const gst = net * 0.1;
    const voucherDiscount = Number(invoice.voucherDiscount || 0);
    const total = Math.max(0, net + gst - voucherDiscount);
    return { net, gst, voucherDiscount, total };
  }, [invoice.lineItems, invoice.voucherDiscount]);

  return { invoice, setField, addLineItem, removeLineItem, updateLineItem, resetInvoice, totals };
}
