import { useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';

const newLineItem = () => ({
  id: Date.now() + Math.random(),
  date: dayjs().format('YYYY-MM-DD'),
  roomNo: '',
  withMeals: true,
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
  cashierName: '',
  dueDate: dayjs().add(14, 'days').format('YYYY-MM-DD'),
  accountNo: '',
  reservationNo: '',
  notes:
    'Please note: Payment Terms are strictly 14 days from the date of invoice. Your account is required to be 14 days in credit at all times.',
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
      if (field === 'withMeals' && value) items[index].roomOnly = false;
      if (field === 'roomOnly' && value) items[index].withMeals = false;
      return { ...prev, lineItems: items };
    });
  }, []);

  const resetInvoice = useCallback(() => setInvoice(buildInitial), []);

  const totals = useMemo(() => {
    const net = invoice.lineItems.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
    const gst = net * 0.1;
    const total = net + gst;
    return { net, gst, total };
  }, [invoice.lineItems]);

  return { invoice, setField, addLineItem, removeLineItem, updateLineItem, resetInvoice, totals };
}
