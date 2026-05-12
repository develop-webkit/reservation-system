import { Button, Drawer, Form, Input, InputNumber } from 'antd';

function AccountingEditDrawer({ open, onClose, onSubmit, loading, initialValues }) {
  const [form] = Form.useForm();

  return (
    <Drawer
      title="Edit accounting entry"
      open={open}
      onClose={onClose}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible && initialValues) {
          form.setFieldsValue(initialValues);
        } else {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Type" name="type">
          <Input />
        </Form.Item>
        <Form.Item label="Reference No" name="referenceNo">
          <Input />
        </Form.Item>
        <Form.Item label="Voucher Code" name="voucherCode">
          <Input />
        </Form.Item>
        <Form.Item label="Amount" name="amount">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Form.Item label="Voucher Amount" name="voucherAmount">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          Update entry
        </Button>
      </Form>
    </Drawer>
  );
}

export default AccountingEditDrawer;
