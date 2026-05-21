import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select, Switch } from 'antd';
import { STATUS_OPTIONS } from '../../data/options';
import dayjs from 'dayjs';

function ReservationFormDrawer({
  open,
  onClose,
  onSubmit,
  loading,
  rooms,
  clients,
  companies,
  initialValues,
}) {
  const [form] = Form.useForm();

  const mappedValues = initialValues
    ? {
        ...initialValues,
        room: initialValues.room?._id || initialValues.room,
        client: initialValues.client?._id || initialValues.client,
        company: initialValues.company?._id || initialValues.company,
        checkIn: initialValues.checkIn ? dayjs(initialValues.checkIn) : null,
        checkOut: initialValues.checkOut ? dayjs(initialValues.checkOut) : null,
      }
    : { adults: 1, children: 0, infants: 0, isFixed: false };

  return (
    <Drawer
      title={initialValues ? 'Edit reservation' : 'New reservation'}
      open={open}
      onClose={onClose}
      width={720}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue(mappedValues);
        } else {
          form.resetFields();
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) =>
          onSubmit({
            ...values,
            checkIn: values.checkIn?.toISOString(),
            checkOut: values.checkOut?.toISOString(),
          })
        }
      >
        <Form.Item label="Reservation No" name="resNo">
          <Input placeholder="RES-1001" />
        </Form.Item>
        <Form.Item
          label="Guest name"
          name="guestName"
          rules={[{ required: true, message: 'Guest name is required.' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Room" name="room">
          <Select
            allowClear
            showSearch
            options={(rooms || []).map((room) => ({ label: room.name, value: room._id }))}
          />
        </Form.Item>
        <Form.Item label="Client" name="client">
          <Select
            allowClear
            showSearch
            options={(clients || []).map((client) => ({
              label: `${client.clientNo} - ${client.clientName || client.given || 'Client'}`,
              value: client._id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Company" name="company">
          <Select
            allowClear
            showSearch
            options={(companies || []).map((company) => ({
              label: company.name || company.companyName || company._id,
              value: company._id,
            }))}
          />
        </Form.Item>
        <Form.Item
          label="Check in"
          name="checkIn"
          rules={[{ required: true, message: 'Check in is required.' }]}
        >
          <DatePicker showTime className="full-width" />
        </Form.Item>
        <Form.Item
          label="Check out"
          name="checkOut"
          rules={[{ required: true, message: 'Check out is required.' }]}
        >
          <DatePicker showTime className="full-width" />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select placeholder="Select status" allowClear>
            {STATUS_OPTIONS.map((s) => (
              <Select.Option key={s} value={s}>{s}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Booking source" name="bookingSource">
          <Input placeholder="Direct" />
        </Form.Item>
        <Form.Item label="Voucher No" name="voucherNo">
          <Input placeholder="VCHR-2026-001" />
        </Form.Item>
        <Form.Item label="Total tariff" name="totalTariff">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Balance" name="balance">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Adults" name="adults">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Children" name="children">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Infants" name="infants">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Fixed reservation" name="isFixed" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Update reservation' : 'Create reservation'}
        </Button>
      </Form>
    </Drawer>
  );
}

export default ReservationFormDrawer;
