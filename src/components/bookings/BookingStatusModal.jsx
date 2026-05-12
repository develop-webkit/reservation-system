import { Button, Form, Modal, Select } from 'antd';
import { bookingStatuses } from '../../constants/statuses.js';

function BookingStatusModal({ open, onCancel, onSubmit, loading, booking }) {
  const [form] = Form.useForm();

  return (
    <Modal
      title={`Update status${booking?.guestName ? ` - ${booking.guestName}` : ''}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnHidden
      afterOpenChange={(visible) => {
        if (visible) {
          form.setFieldsValue({ status: booking?.status });
        } else {
          form.resetFields();
        }
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Status is required.' }]}
        >
          <Select options={bookingStatuses.map((status) => ({ label: status, value: status }))} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Save status
        </Button>
      </Form>
    </Modal>
  );
}

export default BookingStatusModal;
