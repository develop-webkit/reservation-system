import { Button, DatePicker, Drawer, Form, Input, InputNumber, Select, Switch } from 'antd';
import dayjs from 'dayjs';

function VoucherFormDrawer({ open, onClose, onSubmit, loading, clients, companies, initialValues }) {
  const [form] = Form.useForm();

  const mappedValues = initialValues
    ? {
        ...initialValues,
        client: initialValues.client?._id || initialValues.client,
        usedByCompany: initialValues.usedByCompany?._id || initialValues.usedByCompany,
        expiryDate: initialValues.expiryDate ? dayjs(initialValues.expiryDate) : null,
      }
    : { isActive: true };

  return (
    <Drawer
      title={initialValues ? 'Edit voucher' : 'Create voucher'}
      open={open}
      onClose={onClose}
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
        validateTrigger={[]}
        onFinish={(values) =>
          onSubmit({
            ...values,
            expiryDate: values.expiryDate?.toISOString(),
          })
        }
      >
        <Form.Item label="Code" name="code" rules={[{ required: true, message: 'Code is required.' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} />
        </Form.Item>
        <Form.Item label="Expiry date" name="expiryDate">
          <DatePicker showTime className="full-width" />
        </Form.Item>
        <Form.Item label="Credit amount" name="creditAmount">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Manager client number" name="managerClientNumber">
          <Input />
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
        <Form.Item label="Company" name="usedByCompany">
          <Select
            allowClear
            showSearch
            options={(companies || []).map((company) => ({
              label: company.name || company.companyName || company._id,
              value: company._id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Active" name="isActive" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          {initialValues ? 'Update voucher' : 'Create voucher'}
        </Button>
      </Form>
    </Drawer>
  );
}

export default VoucherFormDrawer;
