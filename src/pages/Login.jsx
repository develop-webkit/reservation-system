// src/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message, Select, Tag, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { mockLogin } from '../data/mockUsers';
import { ROLE_NAMES, ROLE_COLORS } from '../constants/roles';

const { Title, Text } = Typography;
const { Option } = Select;

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const [showDemoAccounts, setShowDemoAccounts] = useState(true);

    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const onSubmit = async (data) => {
        // Mock authentication delay
        await new Promise(resolve => setTimeout(resolve, 500));

        const user = mockLogin(data.email, data.password);

        if (user) {
            message.success(`Welcome ${user.name}!`);
            login(user);
            navigate('/');
        } else {
            message.error('Invalid email or password.');
        }
    };

    // Quick login for demo
    const quickLogin = (email, password) => {
        setValue('email', email);
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
                bordered={false}
                style={{ width: 450, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            >
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
                                    onClick={() => quickLogin('admin@hotel.com', 'admin123')}
                                    style={{ borderColor: ROLE_COLORS.SUPER_ADMIN }}
                                >
                                    <Tag color={ROLE_COLORS.SUPER_ADMIN}>Super Admin</Tag>
                                    admin@hotel.com / admin123
                                </Button>
                                <Button
                                    size="small"
                                    block
                                    onClick={() => quickLogin('john@hotel.com', 'employee123')}
                                    style={{ borderColor: ROLE_COLORS.EMPLOYEE }}
                                >
                                    <Tag color={ROLE_COLORS.EMPLOYEE}>Employee</Tag>
                                    john@hotel.com / employee123
                                </Button>
                                <Button
                                    size="small"
                                    block
                                    onClick={() => quickLogin('jane@customer.com', 'customer123')}
                                    style={{ borderColor: ROLE_COLORS.CUSTOMER }}
                                >
                                    <Tag color={ROLE_COLORS.CUSTOMER}>Customer</Tag>
                                    jane@customer.com / customer123
                                </Button>
                            </Space>
                        </div>
                        <Divider>Or Login Manually</Divider>
                    </>
                )}

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    <Controller
                        name="email"
                        control={control}
                        rules={{
                            required: 'Email is required',
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: 'Invalid email address'
                            }
                        }}
                        render={({ field }) => (
                            <Form.Item
                                label="Email"
                                validateStatus={errors.email ? 'error' : ''}
                                help={errors.email?.message}
                            >
                                <Input
                                    {...field}
                                    prefix={<UserOutlined />}
                                    placeholder="Email"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />

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
                                    placeholder="Password"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />

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