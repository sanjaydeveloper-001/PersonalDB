import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Plus, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import { apiService } from '../../services/apiService';
import { useConfirm } from '../../hooks/useConfirm';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1.5rem 0;
`;

const FormGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.95rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const DangerButton = styled(Button)`
  background: #dc2626;
  
  &:hover:not(:disabled) {
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
  }
`;

const KeysList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const KeyCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s;

  &:hover {
    border-color: #cbd5e1;
    background: #f1f5f9;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const KeyInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const KeyName = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`;

const KeyMeta = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.25rem 0;

  strong {
    color: #0f172a;
    font-weight: 600;
  }
`;

const KeyValue = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.75rem 1rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 0.5rem;
  word-break: break-all;
  user-select: all;
`;

const ActionsRow = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-start;
  }
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 0.5rem;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;

  &:hover {
    border-color: #cbd5e1;
    background: #f1f5f9;
    color: ${props => props.danger ? '#dc2626' : '#3b82f6'};
    border-color: ${props => props.danger ? '#fca5a5' : '#93c5fd'};
  }

  svg {
    width: 1rem;
    height: 1rem;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #64748b;

  p {
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const LoadingContainer = styled.div`
  text-align: center;
  padding: 2rem;
  color: #64748b;
`;

const Spinner = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  display: inline-block;
  margin-right: 0.5rem;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const Modal = styled.div`
  display: ${props => props.open ? 'flex' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
`;

const ModalText = styled.p`
  color: #475569;
  line-height: 1.6;
  margin: 0 0 1.5rem 0;
  font-size: 0.95rem;
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const ApiKeys = () => {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [generatingKey, setGeneratingKey] = useState(false);
  const [newKeyData, setNewKeyData] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showRevealKey, setShowRevealKey] = useState({});
  const { confirm, ConfirmModal } = useConfirm();

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const { data } = await apiService.getKeys();
      setKeys(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch API keys');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateKey = async (e) => {
    e.preventDefault();
    if (!newKeyName.trim()) {
      toast.error('Key name is required');
      return;
    }

    try {
      setGeneratingKey(true);
      const { data } = await apiService.generateKey(newKeyName);
      setNewKeyData(data);
      setShowKeyModal(true);
      setNewKeyName('');
      await fetchKeys();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate key');
    } finally {
      setGeneratingKey(false);
    }
  };

  const handleCopyKey = (key) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard!');
  };

  const handleRevokeKey = async (id) => {
    const ok = await confirm({
      title: 'Revoke API Key?',
      message: 'This will permanently revoke the API key and any applications using it will stop working. This action cannot be undone.',
    });

    if (!ok) return;

    try {
      await apiService.revokeKey(id);
      setKeys(prev => prev.filter(k => k._id !== id));
      toast.success('API key revoked successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke key');
    }
  };

  return (
    <Container>
      <ConfirmModal />

      <Section>
        <SectionTitle>Generate New API Key</SectionTitle>
        <form onSubmit={handleGenerateKey}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Enter a name for this key (e.g., 'Mobile App', 'Analytics')"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              disabled={generatingKey}
            />
            <Button type="submit" disabled={generatingKey}>
              <Plus /> {generatingKey ? 'Generating...' : 'Generate'}
            </Button>
          </FormGroup>
        </form>
      </Section>

      <Section>
        <SectionTitle>
          Your API Keys ({keys.length}/10)
        </SectionTitle>

        {loading ? (
          <LoadingContainer>
            <Spinner /> Loading API keys...
          </LoadingContainer>
        ) : keys.length === 0 ? (
          <EmptyState>
            <p>No API keys yet. Create one above to get started with our API.</p>
          </EmptyState>
        ) : (
          <KeysList>
            {keys.map(key => (
              <KeyCard key={key._id}>
                <KeyInfo>
                  <KeyName>{key.name}</KeyName>
                  <KeyMeta>
                    Created: <strong>{new Date(key.createdAt).toLocaleDateString()}</strong>
                  </KeyMeta>
                  <KeyMeta>
                    Last Used: <strong>{key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}</strong>
                  </KeyMeta>
                  <KeyMeta>
                    Requests: <strong>{key.requestCount || 0}</strong>
                  </KeyMeta>
                  <KeyValue>
                    <span>{key.partialKey}</span>
                  </KeyValue>
                </KeyInfo>
                <ActionsRow>
                  <DangerButton onClick={() => handleRevokeKey(key._id)}>
                    <Trash2 /> Revoke
                  </DangerButton>
                </ActionsRow>
              </KeyCard>
            ))}
          </KeysList>
        )}
      </Section>

      <Modal open={showKeyModal} onClick={() => setShowKeyModal(false)}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <ModalTitle>✨ API Key Created Successfully</ModalTitle>
          <ModalText>
            Your new API key has been generated! <strong>This is the only time it will be displayed.</strong> 
            Make sure to copy and save it in a secure location.
          </ModalText>

          {newKeyData && (
            <KeyValue>
              {newKeyData.key}
              <IconButton onClick={() => handleCopyKey(newKeyData.key)}>
                <Copy />
              </IconButton>
            </KeyValue>
          )}

          <ModalText style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
            Use this key in the Authorization header of your API requests:
            <br />
            <code style={{ background: '#f1f5f9', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', display: 'inline-block', marginTop: '0.5rem' }}>
              Authorization: Bearer {newKeyData?.key}
            </code>
          </ModalText>

          <ModalButtons>
            <Button onClick={() => setShowKeyModal(false)}>
              Done
            </Button>
          </ModalButtons>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ApiKeys;
