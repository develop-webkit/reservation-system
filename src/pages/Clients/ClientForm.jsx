import React, { useEffect, useMemo } from 'react';
import { Form, Input, Button, Select, Card, Typography, Space, message, Spin, Divider } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useClient, useCreateClient, useUpdateClient } from '../../hooks/useClients';
import { useCompanies } from '../../hooks/useCompanies';

const { Title } = Typography;
const { Option } = Select;

const ClientForm = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    
    const isEditMode = !!id && id !== 'new';
    const isViewMode = searchParams.get('mode') === 'view';

    const { data: client, isLoading: isFetching } = useClient(isEditMode ? id : null);
    const { data: companiesFromApi } = useCompanies();
    const createClientMutation = useCreateClient();
    const updateClientMutation = useUpdateClient();

    // Normalize and sort companies
    const companies = useMemo(() => {
        const list = Array.isArray(companiesFromApi) ? companiesFromApi : (companiesFromApi?.data || []);
        return [...list].sort((a,b) => (a.name || '').localeCompare(b.name || ''));
    }, [companiesFromApi]);

    useEffect(() => {
        if (client) {
            // Handle populated company object
            const formData = {
                ...client,
                company: typeof client.company === 'object' ? client.company?._id : client.company
            };
            form.setFieldsValue(formData);
        } else {
            form.resetFields();
        }
    }, [client, form]);

    const onFinish = (values) => {
        if (isEditMode) {
            updateClientMutation.mutate({ id, data: values }, {
                onSuccess: () => {
                    message.success('Client updated successfully');
                    navigate('/clients');
                },
                onError: (err) => message.error('Update failed: ' + err.message)
            });
        } else {
            createClientMutation.mutate(values, {
                onSuccess: () => {
                    message.success('Client created successfully');
                    navigate('/clients');
                },
                onError: (err) => message.error('Creation failed: ' + err.message)
            });
        }
    };

    if (isFetching) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading client data..." />
            </div>
        );
    }

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/clients')} style={{ marginRight: '16px' }} />
                <Title level={3} style={{ margin: 0 }}>
                    {isViewMode ? 'Client Details' : isEditMode ? 'Edit Client' : 'Create New Client'}
                </Title>
            </div>

            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={isViewMode}
            >
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
                    <Form.Item
                        label="Client Number (ID)"
                        name="clientNo"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input placeholder="e.g. CL-1001" />
                    </Form.Item>

                    <Form.Item
                        label="Group Name"
                        name="groupName"
                    >
                        <Input placeholder="e.g. Corporate Partners" />
                    </Form.Item>

                    <Form.Item
                        label="Client Display Name"
                        name="clientName"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input placeholder="e.g. Acme Pty Ltd" />
                    </Form.Item>

                    <Form.Item
                        label="Surname"
                        name="surname"
                        rules={[{ required: true, message: 'Required' }]}
                    >
                        <Input placeholder="e.g. Smith" />
                    </Form.Item>

                    <Form.Item
                        label="Given Name"
                        name="given"
                    >
                        <Input placeholder="e.g. John" />
                    </Form.Item>

                    <Form.Item
                        label="Title"
                        name="title"
                    >
                        <Select placeholder="Select Title">
                            <Option value="Mr">Mr</Option>
                            <Option value="Ms">Ms</Option>
                            <Option value="Mrs">Mrs</Option>
                            <Option value="Dr">Dr</Option>
                            <Option value="Prof">Prof</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Company"
                        name="company"
                    >
                        <Select placeholder="Select Company" allowClear showSearch optionFilterProp="children">
                            {companies.map(c => (
                                <Option key={c._id || c.id} value={c._id || c.id}>{c.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Address"
                        name="address"
                    >
                        <Input placeholder="e.g. 123 Sample Street, Sydney NSW 2000" />
                    </Form.Item>

                    <Form.Item
                        label="Mobile"
                        name="mobile"
                    >
                        <Input placeholder="e.g. 04XX XXX XXX" />
                    </Form.Item>

                    <Form.Item
                        label="After Hours Phone"
                        name="phoneAH"
                    >
                        <Input placeholder="e.g. 02 XXXX XXXX" />
                    </Form.Item>

                    <Form.Item
                        label="Business Hours Phone"
                        name="phoneBH"
                    >
                        <Input placeholder="e.g. 02 XXXX XXXX" />
                    </Form.Item>

                    <Form.Item
                        label="Email Address"
                        name="email"
                        rules={[{ type: 'email', message: 'Invalid email' }]}
                    >
                        <Input placeholder="e.g. name@example.com.au" />
                    </Form.Item>

                    <Form.Item
                        label="Client Type"
                        name="clientType"
                    >
                        <Select placeholder="Select Type">
                            <Option value="Corporate">Corporate</Option>
                            <Option value="Internal">Internal</Option>
                            <Option value="Standard">Standard</Option>
                            <Option value="VIP">VIP</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Import ID"
                        name="importId"
                    >
                        <Input placeholder="e.g. IMPORT-001" />
                    </Form.Item>
                </div>

                {!isViewMode && (
                    <Form.Item style={{ marginTop: '24px' }}>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />}
                                loading={createClientMutation.isLoading || updateClientMutation.isLoading}
                            >
                                {isEditMode ? 'Update Client' : 'Save Client'}
                            </Button>
                            <Button onClick={() => navigate('/clients')}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
};

export default ClientForm;
