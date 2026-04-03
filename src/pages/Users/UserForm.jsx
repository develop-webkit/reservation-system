import React, { useEffect } from 'react';
import { Form, Input, Button, Select, Card, Typography, Space, message, Spin, Divider } from 'antd';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useUser, useCreateUser, useUpdateUser } from '../../hooks/useUsers';
import { ROLES, ROLE_NAMES } from '../../constants/roles';

const { Title, Text } = Typography;
const { Option } = Select;

const UserForm = ({ role = 'customer' }) => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const isEditMode = !!id && id !== 'new';
    const isViewMode = searchParams.get('mode') === 'view';

    // Map role to internal role value
    const roleMap = { customer: ROLES.CUSTOMER, employee: ROLES.EMPLOYEE };
    const defaultRole = roleMap[role] || ROLES.CUSTOMER;

    const { data: user, isLoading: isFetching } = useUser(isEditMode ? id : null);
    const createUserMutation = useCreateUser();
    const updateUserMutation = useUpdateUser();

    useEffect(() => {
        if (user) {
            form.setFieldsValue(user);
        } else {
            form.resetFields();
            form.setFieldsValue({ role: defaultRole }); // Default role based on prop
        }
    }, [user, form, defaultRole]);

    const onFinish = (values) => {
        const backUrl = `/users/${role}s`;
        console.log('[UserForm] Form values being submitted:', values, 'Expected role:', defaultRole);
        if (isEditMode) {
            updateUserMutation.mutate({ id, userData: values }, {
                onSuccess: () => {
                    message.success('User updated successfully');
                    navigate(backUrl);
                },
                onError: (err) => message.error('Update failed: ' + err.message)
            });
        } else {
            createUserMutation.mutate(values, {
                onSuccess: () => {
                    message.success('User created successfully');
                    navigate(backUrl);
                },
                onError: (err) => message.error('Creation failed: ' + err.message)
            });
        }
    };

    if (isFetching) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <Spin size="large" tip="Loading user data..." />
            </div>
        );
    }

    return (
        <Card>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
                <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(`/users/${role}s`)} style={{ marginRight: '16px' }} />
                <Title level={3} style={{ margin: 0 }}>
                    {isViewMode ? (role === 'employee' ? 'Employee Details' : 'User Details') : isEditMode ? `Edit ${role === 'employee' ? 'Employee' : 'Customer'}` : `Create New ${role === 'employee' ? 'Employee' : 'Customer'}`}
                </Title>
            </div>

            <Divider />

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                disabled={isViewMode}
                initialValues={{ role: defaultRole }}
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true, message: 'Please enter full name' }]}
                    >
                        <Input placeholder="John Doe" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter email' },
                            { type: 'email', message: 'Please enter a valid email' }
                        ]}
                    >
                        <Input placeholder="john@example.com" />
                    </Form.Item>

                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please enter username' }]}
                    >
                        <Input placeholder="johndoe" />
                    </Form.Item>

                    {!isEditMode && (
                        <Form.Item
                            label="Password"
                            name="password"
                            rules={[{ required: true, message: 'Please enter password' }]}
                        >
                            <Input.Password placeholder="password123" />
                        </Form.Item>
                    )}

                    <Form.Item
                        label="Phone"
                        name="phone"
                    >
                        <Input placeholder="+1234567890" />
                    </Form.Item>

                    <Form.Item
                        label="Client Number"
                        name="clientNumber"
                        rules={[{ required: true, message: 'Please enter client number' }]}
                    >
                        <Input placeholder="asd2asd" />
                    </Form.Item>

                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true, message: 'Please select a role' }]}
                    >
                        <Select placeholder="Select role">
                            {Object.entries(ROLE_NAMES).map(([value, label]) => (
                                <Option key={value} value={value}>{label}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

                {!isViewMode && (
                    <Form.Item style={{ marginTop: '24px' }}>
                        <Space>
                            <Button 
                                type="primary" 
                                htmlType="submit" 
                                icon={<SaveOutlined />}
                                loading={createUserMutation.isLoading || updateUserMutation.isLoading}
                            >
                                {isEditMode ? 'Update User' : 'Save User'}
                            </Button>
                            <Button onClick={() => navigate('/users/customers')}>
                                Cancel
                            </Button>
                        </Space>
                    </Form.Item>
                )}
            </Form>
        </Card>
    );
};

export default UserForm;
