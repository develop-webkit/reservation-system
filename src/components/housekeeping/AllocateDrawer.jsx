import { Button, DatePicker, Drawer, Form, InputNumber, Select } from 'antd';

function AllocateDrawer({ open, onClose, onSubmit, loading, users, rooms, tasks }) {
  const [form] = Form.useForm();

  return (
    <Drawer title="Allocate housekeeping" open={open} onClose={onClose} width={640} destroyOnHidden>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Housekeeper"
          name="housekeeperId"
          rules={[{ required: true, message: 'Housekeeper is required.' }]}
        >
          <Select
            showSearch
            options={(users || []).map((user) => ({
              label: user.fullName || user.username,
              value: user._id,
            }))}
          />
        </Form.Item>
        <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Date is required.' }]}>
          <DatePicker className="full-width" />
        </Form.Item>
        <Form.List name="tasks" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div className="allocation-block" key={field.key}>
                  <Form.Item
                    {...field}
                    label="Task type"
                    name={[field.name, 'type']}
                    rules={[{ required: true, message: 'Task type is required.' }]}
                  >
                    <Select
                      options={[
                        { label: 'Clean', value: 'Clean' },
                        { label: 'Turnover', value: 'Turnover' },
                        { label: 'Inspect', value: 'Inspect' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    {...field}
                    label="Room"
                    name={[field.name, 'roomId']}
                    rules={[{ required: true, message: 'Room is required.' }]}
                  >
                    <Select
                      showSearch
                      options={(rooms || []).map((room) => ({ label: room.name, value: room._id }))}
                    />
                  </Form.Item>
                  <Form.Item {...field} label="Booking" name={[field.name, 'bookingId']}>
                    <Select
                      allowClear
                      showSearch
                      options={(tasks || []).map((task) => ({
                        label: task.booking?.guestName || task._id,
                        value: task.booking?._id,
                      }))}
                    />
                  </Form.Item>
                  <Form.Item {...field} label="Time required" name={[field.name, 'timeRequired']}>
                    <InputNumber min={0} className="full-width" />
                  </Form.Item>
                  <Button danger onClick={() => remove(field.name)} block>
                    Remove row
                  </Button>
                </div>
              ))}
              <Button onClick={() => add()} block>
                Add task row
              </Button>
            </>
          )}
        </Form.List>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          block
          className="top-gap"
        >
          Save allocation
        </Button>
      </Form>
    </Drawer>
  );
}

export default AllocateDrawer;
