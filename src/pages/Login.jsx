// src/pages/Login.jsx (UPDATED for Ant Design and React Hook Form)
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd'; 
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form'; 
import useAuthStore from '../store/authStore'; // <-- NEW IMPORT: Zustand Store

const { Title, Text } = Typography;

// We no longer need the 'onLogin' prop, as state is managed globally by Zustand.
const Login = () => { 
    const navigate = useNavigate();
    // Get the login action from the store
    const login = useAuthStore(state => state.login); // <-- NEW: Use Zustand action
    
    // --- React Hook Form Setup ---
    const { 
        control, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm({
        defaultValues: {
            username: 'HGManager',
            password: '1234',
        }
    });
    // ----------------------------

    const onSubmit = async (data) => {
        // Mock authentication delay
        await new Promise(resolve => setTimeout(resolve, 1000)); 

        if (data.username === 'HGManager' && data.password === '1234') {
            message.success('Login Successful!');
            login({ username: data.username }); // <-- NEW: Call the Zustand login action
            navigate('/'); // Redirect to Dashboard
        } else {
            message.error('Invalid Credentials.');
            // We don't need to explicitly call onLogin(false) anymore, 
            // the state remains logged out.
        }
    };

    return (
        // ... (rest of the component is the same) ...
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
                style={{ width: 400, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}
            >
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', marginBottom: 24 }}>
                    Enter your credentials to access the Booking Chart.
                </Text>

                <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
                    {/* ... (Username Controller) ... */}
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
                                    placeholder="Username (e.g., HGManager)"
                                    size="large"
                                />
                            </Form.Item>
                        )}
                    />
                    
                    {/* ... (Password Controller) ... */}
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
                                    placeholder="Password (e.g., 1234)"
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
                            style={{ width: '100%', marginTop: 16 }}
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