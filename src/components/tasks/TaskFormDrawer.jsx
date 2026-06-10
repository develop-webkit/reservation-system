import { Button, Drawer, Form, InputNumber, Select } from 'antd';
import { taskStatuses } from '../../constants/statuses.js';

function TaskFormDrawer({ open, onClose, onSubmit, loading, rooms, users, initialValues }) {
  const [form] = Form.useForm();

  const mappedValues = initialValues
    ? {
        ...initialValues,
        room: initialValues.room?._id || initialValues.room,
        assignedTo: initialValues.assignedTo?._id || initialValues.assignedTo,
      }
    : {};

  return (
    <Drawer
      title={initialValues ? 'Edit task' : 'Create task'}
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
      <Form form={form} layout="vertical" onFinish={onSubmit} validateTrigger={[]}>
        <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Type is required.' }]}>
          <Select
            options={[
              { label: 'Clean', value: 'Clean' },
              { label: 'Inspect', value: 'Inspect' },
              { label: 'Turnover', value: 'Turnover' },
              { label: 'Maintenance Follow-up', value: 'Maintenance Follow-up' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Room" name="room">
          <Select
            allowClear
            showSearch
            options={(rooms || []).map((room) => ({ label: room.name, value: room._id }))}
          />
        </Form.Item>
        <Form.Item label="Assigned to" name="assignedTo">
          <Select
            allowClear
            showSearch
            options={(users || []).map((user) => ({
              label: user.fullName || user.username,
              value: user._id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select options={taskStatuses.map((status) => ({ label: status, value: status }))} />
        </Form.Item>
        <Form.Item label="Time required (minutes)" name="timeRequired">
          <InputNumber className="full-width" min={0} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          {initialValues ? 'Update task' : 'Create task'}
        </Button>
      </Form>
    </Drawer>
  );
}

export default TaskFormDrawer;
