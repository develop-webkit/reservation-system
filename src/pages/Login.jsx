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
 * Login Component
 * 
 * Handles user authentication for the Reserviation Management System (RMS).
 * Features:
 * - Secure manual login using Client Number, Username, and Password.
 * - Quick login via Demo Accounts for development/testing visibility.
 * - Integration with global authentication state via Zustand (authStore).
 * - Form validation and state management using React Hook Form.
 */
const Login = () => {
    const navigate = useNavigate();

    // Auth store hook to update global user state upon successful login.
    const login = useAuthStore(state => state.login);

    // Local state to manage visibility of the demo accounts section.
    const [showDemoAccounts] = useState(true);

    /**
     * React Hook Form initialization.
     * Manages form state, validation, and submission for:
     * - clientNumber: Required for multi-tenant backend identification.
     * - username: User's unique identifier.
     * - password: Secure password for authentication.
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
     * Handle form submission and authentication attempt.
     * 
     * @param {Object} data - Form payload containing credentials.
     * @param {string} data.clientNumber - The organization/client ID.
     * @param {string} data.username - The user's account name.
     * @param {string} data.password - The user's password.
     */
    const onSubmit = async (data) => {
        try {
            // Making a POST request to the backend auth/login endpoint.
            const response = await authApi.login({
                clientNumber: data.clientNumber,
                username: data.username,
                password: data.password
            });

            // Perspective: Ensure the token is persisted for subsequent API calls.
            if (response.access_token) {
                localStorage.setItem('authToken', response.access_token);
            }

            message.success(`Welcome back! Authenticated successfully.`);

            // Synchronize the global authStore with user details.
            // Includes a fallback mechanism if the API returns a flattened user object.
            login(response.user || { name: data.username, ...response });

            // Navigate the user to the application's home/dashboard.
            navigate('/');
        } catch (error) {
            console.error('Login Error:', error);
            message.error('Invalid credentials. Please check your client number, username, and password.');
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