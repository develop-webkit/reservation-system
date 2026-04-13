import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, message, Tag, Divider, Checkbox, Modal } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined, NumberOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useForm, Controller } from 'react-hook-form';
import useAuthStore from '../store/authStore';
import { ROLE_COLORS, ROLES } from '../constants/roles';
import authApi from '../api/services/auth';

const { Title, Text } = Typography;

// Constants for account lockout
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;
const LOCKOUT_STORAGE_KEY = 'rms_login_lockout';

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

    // State for tracking login attempts and lockout
    const [isLocked, setIsLocked] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetLoading, setResetLoading] = useState(false);

    /**
     * Check if account is locked due to too many failed login attempts
     */
    const checkAccountLockout = () => {
        const lockoutData = localStorage.getItem(LOCKOUT_STORAGE_KEY);
        if (!lockoutData) return false;

        const { attempts, lockedUntil } = JSON.parse(lockoutData);
        const now = Date.now();

        if (now < lockedUntil) {
            const timeRemaining = Math.ceil((lockedUntil - now) / 1000 / 60);
            setIsLocked(true);
            setRemainingTime(timeRemaining);
            return true;
        } else {
            // Lockout period expired, reset attempts
            localStorage.removeItem(LOCKOUT_STORAGE_KEY);
            setIsLocked(false);
            setRemainingTime(0);
            return false;
        }
    };

    /**
     * Record a failed login attempt and implement account lockout
     */
    const recordFailedAttempt = () => {
        const lockoutData = localStorage.getItem(LOCKOUT_STORAGE_KEY);
        let attempts = 1;

        if (lockoutData) {
            const parsed = JSON.parse(lockoutData);
            const now = Date.now();

            // If lockout period hasn't expired, increment attempts
            if (now < parsed.lockedUntil) {
                attempts = parsed.attempts + 1;
            } else {
                // Lockout period expired, reset to 1 attempt
                attempts = 1;
            }
        }

        const lockedUntil = Date.now() + (LOCKOUT_DURATION_MINUTES * 60 * 1000);

        localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify({
            attempts,
            lockedUntil
        }));

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            setIsLocked(true);
            setRemainingTime(LOCKOUT_DURATION_MINUTES);
        }
    };

    /**
     * Clear login attempt tracking on successful login
     */
    const clearLoginAttempts = () => {
        localStorage.removeItem(LOCKOUT_STORAGE_KEY);
    };

    /**
     * Check lockout status on component mount and set up interval for countdown
     */
    useEffect(() => {
        checkAccountLockout();

        const interval = setInterval(() => {
            checkAccountLockout();
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, []);

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
        // Check if account is locked before attempting login
        if (isLocked) {
            message.error(`Account is temporarily locked. Please try again in ${remainingTime} minute(s).`);
            return;
        }

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

                // If "Keep Me Logged In" is checked, store token with longer expiry
                if (keepLoggedIn) {
                    localStorage.setItem('rememberMe', 'true');
                } else {
                    localStorage.removeItem('rememberMe');
                }
            }

            message.success(`Welcome back! Authenticated successfully.`);

            // Clear failed login attempts on successful login
            clearLoginAttempts();

            // Synchronize the global authStore with user details.
            // Includes a fallback mechanism if the API returns a flattened user object.
            login(response.user || { name: data.username, ...response });

            // Navigate the user to the application's home/dashboard.
            navigate('/');
        } catch (error) {
            console.error('Login Error:', error);

            // Record the failed login attempt
            recordFailedAttempt();

            // Display generic error message for security
            message.error('Invalid Client Number, Username, or Password.');

            // If account is now locked, show additional message
            if (isLocked || remainingTime > 0) {
                message.warning(`Account locked due to multiple failed attempts. Please try again later.`);
            }
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

    /**
     * Handle forgot password request
     */
    const handleForgotPassword = async () => {
        if (!resetEmail) {
            message.error('Please enter your email address');
            return;
        }

        setResetLoading(true);
        try {
            await authApi.forgotPassword({ email: resetEmail });
            message.success('Password reset link has been sent to your email. Please check your inbox.');
            setShowForgotPassword(false);
            setResetEmail('');
        } catch (error) {
            console.error('Forgot Password Error:', error);
            message.error('Failed to process password reset. Please try again later.');
        } finally {
            setResetLoading(false);
        }
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
                                    onClick={() => quickLogin('CL-ADMIN', 'admin', 'password123')}
                                    style={{ borderColor: ROLE_COLORS[ROLES.SUPER_ADMIN] }}
                                >
                                    <Tag color={ROLE_COLORS[ROLES.SUPER_ADMIN]}>Admin</Tag>
                                    CL-ADMIN / admin / password123
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

                    {/* Keep Me Logged In Checkbox */}
                    <Form.Item>
                        <Checkbox
                            checked={keepLoggedIn}
                            onChange={(e) => setKeepLoggedIn(e.target.checked)}
                        >
                            Keep Me Logged In
                        </Checkbox>
                    </Form.Item>

                    {/* Submit Button */}
                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSubmitting}
                            size="large"
                            style={{ width: '100%', marginTop: 8 }}
                            disabled={isLocked}
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    {/* Account Lockout Warning */}
                    {isLocked && (
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fff7e6',
                            border: '1px solid #ffbb96',
                            borderRadius: '4px',
                            marginTop: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <ExclamationCircleOutlined style={{ color: '#ff7a45' }} />
                            <Text style={{ color: '#ff7a45', fontSize: '12px' }}>
                                Account locked. Try again in {remainingTime} minute(s).
                            </Text>
                        </div>
                    )}
                </Form>

                {/* Forgot Password Link */}
                <div style={{ textAlign: 'center', marginTop: '16px' }}>
                    <Button
                        type="link"
                        onClick={() => setShowForgotPassword(true)}
                        style={{ padding: 0 }}
                    >
                        Forgot Password?
                    </Button>
                </div>
            </Card>

            {/* Forgot Password Modal */}
            <Modal
                title="Reset Password"
                open={showForgotPassword}
                onCancel={() => setShowForgotPassword(false)}
                footer={[
                    <Button key="cancel" onClick={() => setShowForgotPassword(false)}>
                        Cancel
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={resetLoading}
                        onClick={handleForgotPassword}
                    >
                        Send Reset Link
                    </Button>,
                ]}
            >
                <div style={{ marginTop: '16px' }}>
                    <Text>Enter your email address and we'll send you a password reset link.</Text>
                    <Input
                        type="email"
                        placeholder="Enter your email address"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        style={{ marginTop: '12px' }}
                        size="large"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default Login;