import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message, Tag, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, NumberOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { ROLE_COLORS } from '../constants/roles';
import authApi from '../api/services/auth';

const { Title, Text } = Typography;

/**
 * Login Component: Handles user authentication for the RMS System.
 * Supports manual login and quick login via demo accounts.
 */
const Login = () => {
    const navigate = useNavigate();

    // Auth store hook to update global user state upon successful login.
    const login = useAuthStore(state => state.login);

    // Local state to manage visibility of the demo accounts section.
    const [showDemoAccounts] = useState(true);

    /**
     * Initializing React Hook Form for robust form state management and validation.
     * clientNumber, username, and password are the core fields for the updated backend.
     */
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            clientNumber: '',
            username: '',
            password: '',
        }
    });

    /**
     * onSubmit handler: Processes the form data and attempts to log in via authApi.
     * @param {Object} data - Contains clientNumber, username, and password.
     */
    const onSubmit = async (data) => {
        try {
            // Making a POST request to the backend auth/login endpoint.
            const response = await authApi.login({
                clientNumber: data.clientNumber,
                username: data.username,
                password: data.password
            });

            message.success(`Welcome!`);

            // Updating the global auth state with the user info returned from the API.
            // Includes a fallback name if the response structure differs.
            login(response.user || { name: data.username, ...response });

            // Redirecting to the main dashboard after success.
            navigate('/');
        } catch (error) {
            console.error('Login Error:', error);
            message.error('info incorrect');
        }
    };

    /**
     * quickLogin helper: Utility function to pre-fill the form fields for demo purposes.
     */
    const quickLogin = (clientNumber, username, password) => {
        setValue('clientNumber', clientNumber);
        setValue('username', username);
        setValue('password', password);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#f0f2f5'
        }}>
            <Card
                title={<Title level={3} style={{ textAlign: 'center' }}>RMS System Login</Title>}
                variant="borderless"
                style={{ width: 450, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            >
                {/* Demo accounts section: Provides one-click login for testing. */}
                {showDemoAccounts && (
                    <>
                        <div style={{ marginBottom: 20 }}>
                            <Text strong style={{ display: 'block', marginBottom: 12 }}>
                                <SafetyOutlined /> Demo Accounts
                            </Text>
                            <Space direction="vertical" style={{ width: '100%' }}>
                                <Button
                                    size="small"
                                    block
                                    onClick={() => quickLogin('1001', 'admin', 'password123')}
                                    style={{ borderColor: ROLE_COLORS.SUPER_ADMIN }}
                                >
                                    <Tag color={ROLE_COLORS.SUPER_ADMIN}>Admin</Tag>
                                    1001 / admin / password123
                                </Button>
                            </Space>
                        </div>
                        <Divider>Or Login Manually</Divider>
                    </>
                )}

                {/* Main Login Form using Ant Design Layout and React Hook Form Controller */}
                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>

                    {/* Client Number Field */}
                    <Controller
                        name="clientNumber"
                        control={control}
                        rules={{ required: 'Client Number is required' }}
                        render={({ field }) => (
                            <Form.Item
                                label="Client Number"
                                validateStatus={errors.clientNumber ? 'error' : ''}
                                help={errors.clientNumber?.message}
                            >
                                <Input
                                    {...field}
                                    prefix={<NumberOutlined />}
                                    placeholder="Enter Client Number"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />

                    {/* Username Field */}
                    <Controller
                        name="username"
                        control={control}
                        rules={{ required: 'Username is required' }}
                        render={({ field }) => (
                            <Form.Item
                                label="Username"
                                validateStatus={errors.username ? 'error' : ''}
                                help={errors.username?.message}
                            >
                                <Input
                                    {...field}
                                    prefix={<UserOutlined />}
                                    placeholder="Enter Username"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />

                    {/* Password Field */}
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: 'Password is required' }}
                        render={({ field }) => (
                            <Form.Item
                                label="Password"
                                validateStatus={errors.password ? 'error' : ''}
                                help={errors.password?.message}
                            >
                                <Input.Password
                                    {...field}
                                    prefix={<LockOutlined />}
                                    placeholder="Enter Password"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />

                    {/* Submit Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            size="large"
                            style={{ width: '100%', marginTop: 8 }}
                        >
                            Log in
                        </Button>
                    </Form.Item>
                </Form>

            </Card>
        </div>
    );
};

export default Login;