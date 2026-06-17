import { App, Col, Row, Typography } from 'antd';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { forgotPassword, login } from '../api/services/auth.js';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal.jsx';
import LoginForm from '../components/auth/LoginForm.jsx';
import useAuthStore from '../store/authStore.js';
import { getErrorMessage } from '../api/utils.js';

function LoginPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const loginStore = useAuthStore((state) => state.login);
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (values) => {
    setLoading(true);

    try {
      const response = await login(values);

      if (response.requiresTwoFactor) {
        navigate('/2fa-verify', {
          state: { pendingToken: response.pendingToken, from: location.state?.from },
        });
        return;
      }

      loginStore(response);
      message.success('Welcome back.');
      const redirect = location.state?.from?.pathname || '/dashboard';
      navigate(redirect, { replace: true });
    } catch (error) {
      setAttempts((current) => current + 1);
      message.error(getErrorMessage(error, 'Unable to log in.'));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (values) => {
    setResetLoading(true);

    try {
      await forgotPassword(values);
      message.success('Reset instructions generated successfully.');
      setShowReset(false);
    } catch (error) {
      message.error(getErrorMessage(error, 'Unable to start password reset.'));
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-background" />
      <Row gutter={[32, 32]} align="middle" className="login-layout">
        <Col xs={24} lg={12}>
          <Typography.Text className="eyebrow">Property management system</Typography.Text>
          <Typography.Title className="login-hero-title">
            Reservation workflows, room control, and housekeeping in one place.
          </Typography.Title>
          <Typography.Paragraph className="login-hero-copy">
            The frontend is now aligned to your backend contracts and uses TanStack Query
            for all operational data flows.
          </Typography.Paragraph>
        </Col>
        <Col xs={24} lg={12}>
          <LoginForm
            onSubmit={handleSubmit}
            loading={loading}
            onForgotPassword={() => setShowReset(true)}
            isLocked={attempts >= 5}
          />
        </Col>
      </Row>
      <ForgotPasswordModal
        open={showReset}
        onCancel={() => setShowReset(false)}
        onSubmit={handleForgotPassword}
        loading={resetLoading}
      />
    </div>
  );
}

export default LoginPage;
