import { Button, Drawer, Form, Input, InputNumber, Select } from 'antd';

function ClientFormDrawer({ open, onClose, onSubmit, loading, companies, initialValues }) {
  const [form] = Form.useForm();
  const hasCompanies = Array.isArray(companies) && companies.length > 0;

  const mappedValues = initialValues
    ? {
        ...initialValues,
        company: initialValues.company?._id || initialValues.company,
        companyName:
          initialValues.companyName ||
          initialValues.company?.name ||
          initialValues.company?.tradingAs ||
          '',
      }
    : {};

  return (
    <Drawer
      title={initialValues ? 'Edit client' : 'Create client'}
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
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Client No" name="clientNo">
          <Input placeholder="CL-1001" />
        </Form.Item>
        <Form.Item label="Client name" name="clientName">
          <Input />
        </Form.Item>
        <Form.Item label="Given name" name="given">
          <Input />
        </Form.Item>
        <Form.Item label="Surname" name="surname">
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>
        <Form.Item label="Mobile" name="mobile">
          <Input />
        </Form.Item>
        <Form.Item label="Client type" name="clientType">
          <Input />
        </Form.Item>
        {hasCompanies ? (
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
        ) : (
          <Form.Item label="Company" name="companyName">
            <Input placeholder="Enter company name" />
          </Form.Item>
        )}
        <Form.Item label="Rate" name="rate">
          <InputNumber min={0} className="full-width" />
        </Form.Item>
        <Button type="primary" htmlType="submit" block loading={loading}>
          {initialValues ? 'Update client' : 'Create client'}
        </Button>
      </Form>
    </Drawer>
  );
}

export default ClientFormDrawer;
