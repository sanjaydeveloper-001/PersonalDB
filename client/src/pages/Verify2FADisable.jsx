import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { twoFactorService } from '../services/twoFactorService';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
  padding: 1rem;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.1);
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;

  ${({ type }) => {
    if (type === 'success') return 'background: #f0fdf4; border: 2px solid #16a34a;';
    if (type === 'error') return 'background: #fef2f2; border: 2px solid #dc2626;';
    return 'background: #eff6ff; border: 2px solid #3b82f6;';
  }}

  svg {
    color: ${({ type }) => {
      if (type === 'success') return '#16a34a';
      if (type === 'error') return '#dc2626';
      return '#3b82f6';
    }};
  }
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem;
`;

const Message = styled.p`
  font-size: 1rem;
  color: #64748b;
  margin: 0 0 2rem;
  line-height: 1.6;
`;

const HomeLink = styled(Link)`
  display: inline-block;
  background: #3b82f6;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.625rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;

  &:hover {
    background: #2563eb;
    transform: translateY(-2px);
  }
`;

function Verify2FADisable() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('Verifying your 2FA disable request...');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token');
        return;
      }

      try {
        const result = await twoFactorService.verifyDisableToken(token);
        setStatus('success');
        setMessage(result.message || '2FA has been disabled successfully. You can now log in normally.');
        toast.success('2FA disabled successfully!');
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Failed to disable 2FA. The link may have expired.');
        toast.error(err.response?.data?.message || 'Verification failed');
      }
    };

    verify();
  }, [token]);

  return (
    <Container>
      <Card>
        {status === 'loading' && (
          <>
            <IconWrapper>
              <Loader size={32} style={{ animation: 'spin 1s linear infinite' }} />
            </IconWrapper>
            <Title>Verifying...</Title>
            <Message>{message}</Message>
          </>
        )}

        {status === 'success' && (
          <>
            <IconWrapper type="success">
              <CheckCircle size={40} />
            </IconWrapper>
            <Title>2FA Disabled</Title>
            <Message>{message}</Message>
            <HomeLink to="/login">Go to Login</HomeLink>
          </>
        )}

        {status === 'error' && (
          <>
            <IconWrapper type="error">
              <AlertCircle size={40} />
            </IconWrapper>
            <Title>Verification Failed</Title>
            <Message>{message}</Message>
            <HomeLink to="/login">Go to Login</HomeLink>
          </>
        )}
      </Card>
    </Container>
  );
}

export default Verify2FADisable;
