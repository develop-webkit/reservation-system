import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message, Tag, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, NumberOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { ROLE_COLORS } from '../constants/roles';
import authApi from '../api/services/auth';

const { Title, Text } = Typography;

const Login = () => {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const [showDemoAccounts] = useState(true);

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

    const onSubmit = async (data) => {
        try {
            const response = await authApi.login({
                clientNumber: data.clientNumber,
                username: data.username,
                password: data.password
            });

            message.success(`Welcome!`);
            login(response.user || { name: data.username, ...response });
            navigate('/');
        } catch (error) {
            console.error(error);
            message.error('Invalid credentials.');
        }
    };

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
                                    onClick={() => quickLogin('12345', 'admin', 'password123')}
                                    style={{ borderColor: ROLE_COLORS.SUPER_ADMIN }}
                                >
                                    <Tag color={ROLE_COLORS.SUPER_ADMIN}>Super Admin</Tag>
                                    12345 / admin / password123
                                </Button>
                            </Space>
                        </div>
                        <Divider>Or Login Manually</Divider>
                    </>
                )}

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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
                                    placeholder="Client Number"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />

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
                                    placeholder="Username"
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