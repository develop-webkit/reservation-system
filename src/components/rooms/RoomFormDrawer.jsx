import { Button, Drawer, Form, Input, InputNumber, Select } from 'antd';

const ROOM_TYPE_OPTIONS = ['ENSUITE', 'STAFF', 'EVENT', 'STUDIO', 'SUITE', 'STANDARD'].map(
  (t) => ({ label: t, value: t }),
);

const CLEAN_STATUS_OPTIONS = [
  { label: 'Clean', value: 'Clean' },
  { label: 'Dirty', value: 'Dirty' },
  { label: 'Inspect', value: 'Inspect' },
];

function RoomFormDrawer({ open, onClose, onSubmit, loading, initialValues }) {
  const [form] = Form.useForm();
  const isEditing = Boolean(initialValues?._id);

  const mappedValues = initialValues
    ? {
        ...initialValues,
        maxOccupancy: Number(initialValues.maxOccupancy) || 2,
        sortOrder: initialValues.sortOrder ?? undefined,
      }
    : {
        status: 'Clean',
        maxOccupancy: 2,
      };

  return (
    <Drawer
      title={isEditing ? 'Edit room' : 'New room'}
      open={open}
      onClose={onClose}
      width={480}
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
        <Form.Item
          label="Room name"
          name="name"
          rules={[{ required: true, message: 'Room name is required.' }]}
        >
          <Input placeholder="e.g. B01" />
        </Form.Item>

        <Form.Item
          label="Room type"
          name="type"
          rules={[{ required: true, message: 'Room type is required.' }]}
        >
          <Select
            placeholder="Select type"
            options={ROOM_TYPE_OPTIONS}
            showSearch
            allowClear
          />
        </Form.Item>

        <Form.Item label="Category" name="category">
          <Input placeholder="e.g. Standard Ensuite Benjamin" />
        </Form.Item>

        <Form.Item label="Clean status" name="status">
          <Select options={CLEAN_STATUS_OPTIONS} />
        </Form.Item>

        <Form.Item label="Max occupancy" name="maxOccupancy">
          <InputNumber min={1} max={20} className="full-width" />
        </Form.Item>

        <Form.Item label="Sort order" name="sortOrder">
          <InputNumber min={0} className="full-width" />
        </Form.Item>

        <Form.Item label="Import ID" name="importId">
          <Input placeholder="e.g. B01" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block size="large">
          {isEditing ? 'Update room' : 'Create room'}
        </Button>
      </Form>
    </Drawer>
  );
}

export default RoomFormDrawer;
