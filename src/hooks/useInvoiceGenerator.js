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

// Keys that belong on the form/save-payload. Persistence-only fields (_id,
// clientNumber, createdBy, canEdit, net/gst/total, __v, timestamps) live in
// `meta`, never in `invoice` — otherwise they'd get serialized back into the
// next save request and rejected by the backend's forbidNonWhitelisted DTO.
const FORM_FIELDS = Object.keys(buildInitial()).filter((f) => f !== 'lineItems');

const initialMeta = () => ({ id: null, canEdit: true, createdAt: null });

export function useInvoiceGenerator() {
  const [invoice, setInvoice] = useState(buildInitial);
  const [meta, setMeta] = useState(initialMeta);

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

  const resetInvoice = useCallback(() => {
    setInvoice(buildInitial());
    setMeta(initialMeta());
  }, []);

  // Loads a previously saved invoice into the form. Deliberately bypasses
  // setField — going through it would zero out a real saved voucherDiscount
  // the moment voucherNo gets set (see FORM_FIELDS comment above).
  const loadInvoice = useCallback((saved) => {
    const next = buildInitial();
    FORM_FIELDS.forEach((field) => {
      if (saved[field] !== undefined && saved[field] !== null) {
        next[field] = saved[field];
      }
    });
    next.lineItems = saved.lineItems?.length
      ? saved.lineItems.map((item) => ({ id: Date.now() + Math.random(), ...item }))
      : [newLineItem()];
    setInvoice(next);
    setMeta({
      id: saved._id || saved.id || null,
      canEdit: saved.canEdit !== false,
      createdAt: saved.createdAt || null,
    });
  }, []);

  const totals = useMemo(() => {
    const net = invoice.lineItems.reduce((s, i) => s + Number(i.totalPrice || 0), 0);
    const gst = net * 0.1;
    const voucherDiscount = Number(invoice.voucherDiscount || 0);
    const total = Math.max(0, net + gst - voucherDiscount);
    return { net, gst, voucherDiscount, total };
  }, [invoice.lineItems, invoice.voucherDiscount]);

  return {
    invoice,
    meta,
    setField,
    addLineItem,
    removeLineItem,
    updateLineItem,
    loadInvoice,
    resetInvoice,
    totals,
  };
}
