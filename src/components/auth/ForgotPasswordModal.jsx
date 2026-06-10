import { Button, Form, Input, Modal } from 'antd';

function ForgotPasswordModal({ open, onCancel, onSubmit, loading }) {
  const [form] = Form.useForm();

  const handleFinish = async (values) => {
    await onSubmit(values);
    form.resetFields();
  };

  return (
    <Modal
      title="Reset password"
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish} validateTrigger={[]}>
        <Form.Item
          label="Email address"
          name="email"
          rules={[{ required: true, message: 'Email is required.' }]}
        >
          <Input placeholder="guest@company.com" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Send reset link
        </Button>
      </Form>
    </Modal>
  );
}

export default ForgotPasswordModal;
