import { Button, Checkbox, DatePicker, Input, InputNumber, Table, Typography } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text } = Typography;

function InvoiceLineItemsTable({ lineItems, onAdd, onRemove, onUpdate }) {
  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      width: 132,
      render: (val, _, index) => (
        <DatePicker
          size="small"
          value={val ? dayjs(val) : null}
          onChange={(d) => onUpdate(index, 'date', d?.format('YYYY-MM-DD') ?? null)}
          format="DD MMM YYYY"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Room No',
      dataIndex: 'roomNo',
      width: 90,
      render: (val, _, index) => (
        <Input
          size="small"
          value={val}
          onChange={(e) => onUpdate(index, 'roomNo', e.target.value)}
          placeholder="e.g. B09"
        />
      ),
    },
    {
      title: 'With Meals',
      dataIndex: 'withMeals',
      width: 88,
      align: 'center',
      render: (val, _, index) => (
        <Checkbox checked={val} onChange={(e) => onUpdate(index, 'withMeals', e.target.checked)} />
      ),
    },
    {
      title: 'Room Only',
      dataIndex: 'roomOnly',
      width: 88,
      align: 'center',
      render: (val, _, index) => (
        <Checkbox checked={val} onChange={(e) => onUpdate(index, 'roomOnly', e.target.checked)} />
      ),
    },
    {
      title: 'From Date',
      dataIndex: 'fromDate',
      width: 132,
      render: (val, _, index) => (
        <DatePicker
          size="small"
          value={val ? dayjs(val) : null}
          onChange={(d) => onUpdate(index, 'fromDate', d?.format('YYYY-MM-DD') ?? null)}
          format="DD MMM YYYY"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'To Date',
      dataIndex: 'toDate',
      width: 132,
      render: (val, _, index) => (
        <DatePicker
          size="small"
          value={val ? dayjs(val) : null}
          onChange={(d) => onUpdate(index, 'toDate', d?.format('YYYY-MM-DD') ?? null)}
          format="DD MMM YYYY"
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Total Price ($)',
      dataIndex: 'totalPrice',
      width: 130,
      render: (val, _, index) => (
        <InputNumber
          size="small"
          value={val}
          min={0}
          precision={2}
          onChange={(v) => onUpdate(index, 'totalPrice', v ?? 0)}
          style={{ width: '100%' }}
          prefix="$"
        />
      ),
    },
    {
      title: '',
      key: 'delete',
      width: 46,
      render: (_, __, index) => (
        <Button
          size="small"
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => onRemove(index)}
          disabled={lineItems.length === 1}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Text strong>Line Items</Text>
        <Button type="dashed" size="small" icon={<PlusOutlined />} onClick={onAdd}>
          Add Row
        </Button>
      </div>
      <Table
        dataSource={lineItems}
        columns={columns}
        rowKey="id"
        pagination={false}
        size="small"
        scroll={{ x: 860 }}
      />
    </div>
  );
}

export default InvoiceLineItemsTable;
