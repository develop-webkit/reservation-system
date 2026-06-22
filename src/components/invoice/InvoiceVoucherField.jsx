import { useState } from 'react';
import { Input, Typography } from 'antd';
import { validateVoucher } from '../../api/services/vouchers.js';

const { Text } = Typography;

function InvoiceVoucherField({ code, discount, onCodeChange, onApply }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleApply = async (value) => {
    const trimmed = value?.trim();
    if (!trimmed) return;
    setLoading(true);
    setError('');
    try {
      const result = await validateVoucher(trimmed);
      onApply(Number(result?.creditAmount) || 0);
    } catch (err) {
      onApply(0);
      setError(err.response?.data?.message || 'Voucher not valid');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input.Search
        value={code}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder="Optional"
        enterButton="Apply"
        loading={loading}
        onSearch={handleApply}
      />
      {error && (
        <Text type="danger" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
          {error}
        </Text>
      )}
      {!error && discount > 0 && (
        <Text type="success" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
          Voucher applied: -${discount.toFixed(2)}
        </Text>
      )}
    </div>
  );
}

export default InvoiceVoucherField;
