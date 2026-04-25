import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Copy, Check, Eye, EyeOff, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { twoFactorService } from '../services/twoFactorService';

const Modal = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.875rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;

  h2 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }
`;

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #0f172a;
  }
`;

const Step = styled.div`
  margin-bottom: 1.5rem;
`;

const StepLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
`;

const QRCodeContainer = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
  }
`;

const ManualCodeBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  font-weight: 600;
  color: #0f172a;
  word-break: break-all;
`;

const CopyButton = styled.button`
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  padding: 0.375rem 0.75rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  white-space: nowrap;
  transition: all 0.15s;

  &:hover {
    background: #dbeafe;
    border-color: #93c5fd;
  }

  &.copied {
    background: #f0fdf4;
    border-color: #86efac;
    color: #16a34a;
  }
`;

const BackupCodesContainer = styled.div`
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 0.625rem;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const BackupCodesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  code {
    background: white;
    border: 1px solid #bbf7d0;
    border-radius: 0.375rem;
    padding: 0.5rem;
    font-size: 0.75rem;
    font-family: 'Courier New', monospace;
    color: #15803d;
    text-align: center;
  }
`;

const BackupCodesWarning = styled.p`
  font-size: 0.75rem;
  color: #15803d;
  margin: 0;
  line-height: 1.5;
`;

const OTPInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  font-size: 1.5rem;
  letter-spacing: 0.5em;
  text-align: center;
  font-weight: 600;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &::placeholder {
    color: #cbd5e1;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
`;

const PrimaryBtn = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #2563eb;
  }

  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const SecondaryBtn = styled.button`
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const InfoText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem;
  line-height: 1.6;
`;

const ErrorText = styled.p`
  font-size: 0.875rem;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
`;

const AlreadyEnabledBox = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;

  div {
    width: 48px;
    height: 48px;
    background: #f0fdf4;
    border: 2px solid #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 0.5rem;
  }

  p {
    font-size: 0.875rem;
    color: #64748b;
    margin: 0;
  }
`;

export default function TwoFactorModal({ isOpen, onClose }) {
  const [step, setStep] = useState('initial'); // initial, setup, verify, complete, already-enabled
  const [qrCode, setQrCode] = useState('');
  const [manualCode, setManualCode] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep('initial');
    setOtp('');
    setError('');
    setCopied(null);
    onClose();
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await twoFactorService.generate();
      setQrCode(data.qrCode);
      setManualCode(data.manualCode);
      setBackupCodes(data.backupCodes);
      setStep('setup');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to generate 2FA setup';
      if (errorMessage.includes('already enabled')) {
        setStep('already-enabled');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      if (!otp || otp.length !== 6 || isNaN(otp)) {
        setError('Please enter a valid 6-digit code');
        return;
      }

      setLoading(true);
      setError('');
      await twoFactorService.verifySetup(otp);
      setStep('complete');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    toast.success('Copied!');
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <Modal onClick={handleClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <h2>Enable Two-Factor Authentication</h2>
          <CloseBtn onClick={handleClose}>
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        {step === 'initial' && (
          <>
            <InfoText>
              Two-factor authentication adds an extra layer of security to your account. You'll need to enter a code from your authenticator app each time you sign in.
            </InfoText>
            <ButtonGroup>
              <PrimaryBtn onClick={handleGenerate} disabled={loading}>
                {loading ? 'Generating...' : 'Get Started'}
              </PrimaryBtn>
              <SecondaryBtn onClick={handleClose}>Cancel</SecondaryBtn>
            </ButtonGroup>
          </>
        )}

        {step === 'already-enabled' && (
          <>
            <AlreadyEnabledBox>
              <div>
                <Check size={24} color="#16a34a" />
              </div>
              <h3>2FA is Already Enabled</h3>
              <p>Your account is protected with two-factor authentication.</p>
            </AlreadyEnabledBox>
            <ButtonGroup>
              <PrimaryBtn onClick={handleClose}>Close</PrimaryBtn>
            </ButtonGroup>
          </>
        )}

        {step === 'setup' && (
          <>
            <Step>
              <StepLabel>Step 1: Scan QR Code</StepLabel>
              <InfoText>
                Scan this QR code with Google Authenticator, Microsoft Authenticator, or Authy.
              </InfoText>
              <QRCodeContainer>
                <img src={qrCode} alt="2FA QR Code" />
              </QRCodeContainer>
            </Step>

            <Step>
              <StepLabel>Step 2: Manual Entry (if needed)</StepLabel>
              <InfoText>Can't scan? Enter this code manually:</InfoText>
              <ManualCodeBox>
                {manualCode}
                <CopyButton
                  onClick={() => copy(manualCode, 'manual')}
                  className={copied === 'manual' ? 'copied' : ''}
                >
                  <Copy size={14} />
                  {copied === 'manual' ? 'Copied' : 'Copy'}
                </CopyButton>
              </ManualCodeBox>
            </Step>

            <Step>
              <StepLabel>Step 3: Save Backup Codes</StepLabel>
              <InfoText>
                Save these codes in a safe place. You can use them to access your account if you lose your authenticator.
              </InfoText>
              <BackupCodesContainer>
                <BackupCodesGrid>
                  {backupCodes.map((code, i) => (
                    <code key={i}>{code}</code>
                  ))}
                </BackupCodesGrid>
                <BackupCodesWarning>
                  💡 Store these codes somewhere safe. Each code can only be used once.
                </BackupCodesWarning>
              </BackupCodesContainer>
            </Step>

            <Step>
              <StepLabel>Step 4: Enter Code from Authenticator</StepLabel>
              <OTPInput
                type="text"
                inputMode="numeric"
                maxLength="6"
                placeholder="000000"
                value={otp}
                onChange={e => {
                  setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                  setError('');
                }}
                disabled={loading}
              />
            </Step>

            {error && <ErrorText>{error}</ErrorText>}

            <ButtonGroup>
              <PrimaryBtn onClick={handleVerify} disabled={loading || otp.length !== 6}>
                {loading ? 'Verifying...' : 'Verify & Enable'}
              </PrimaryBtn>
              <SecondaryBtn onClick={handleClose} disabled={loading}>
                Cancel
              </SecondaryBtn>
            </ButtonGroup>
          </>
        )}

        {step === 'complete' && (
          <>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#f0fdf4',
                  border: '2px solid #16a34a',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Check size={24} color="#16a34a" />
              </div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.5rem' }}>
                2FA Enabled!
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                Your account is now protected with two-factor authentication.
              </p>
            </div>
            <ButtonGroup>
              <PrimaryBtn onClick={handleClose}>Done</PrimaryBtn>
            </ButtonGroup>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
