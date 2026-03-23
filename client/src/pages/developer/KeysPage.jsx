import { useState } from 'react'
import styled from 'styled-components'
import { Key, Plus, Copy, Trash2, Eye, EyeOff, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Styled ──────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 860px;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`

const IconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.625rem;

  svg { width: 1.25rem; height: 1.25rem; }
`

const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const PageDesc = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 2rem 0;
`

const CreateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.1rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.15s;

  &:hover { opacity: 0.88; }
  svg { width: 15px; height: 15px; }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 12px;
  color: #94a3b8;

  svg { width: 2.5rem; height: 2.5rem; margin-bottom: 1rem; color: #cbd5e1; }
  p { margin: 0; font-size: 0.9rem; }
`

const KeyCard = styled.div`
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 12px;
  padding: 1.25rem;
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const KeyTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`

const KeyName = styled.div`
  font-size: 0.95rem;
  font-weight: 600;
  color: #0f172a;
`

const KeyMeta = styled.div`
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 0.15rem;
`

const KeyActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #e2e8f0;
  background: white;
  border-radius: 7px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s;

  &:hover {
    background: ${props => props.$danger ? '#fee2e2' : '#eff6ff'};
    color: ${props => props.$danger ? '#dc2626' : '#1e40af'};
    border-color: ${props => props.$danger ? '#fecaca' : '#bfdbfe'};
  }

  svg { width: 14px; height: 14px; }
`

const KeyValueRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
`

const KeyValue = styled.code`
  flex: 1;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #334155;
  word-break: break-all;
  letter-spacing: 0.04em;
`

const StatusBadge = styled.span`
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 5px;
  background: ${props => props.$active ? '#dcfce7' : '#f1f5f9'};
  color: ${props => props.$active ? '#15803d' : '#64748b'};
`

// ── Helpers ─────────────────────────────────────────────────────────────────
const generateKey = () =>
  'pdb_' + Array.from({ length: 40 }, () =>
    'abcdefghijklmnopqrstuvwxyz0123456789'[Math.floor(Math.random() * 36)]
  ).join('')

// ── Page ────────────────────────────────────────────────────────────────────
const KeysPage = () => {
  const [keys, setKeys] = useState([
    {
      id: '1',
      name: 'Production Key',
      value: generateKey(),
      createdAt: new Date(Date.now() - 86400000 * 14).toLocaleDateString(),
      active: true,
      visible: false,
    },
  ])

  const addKey = () => {
    const name = `Key ${keys.length + 1}`
    setKeys(prev => [...prev, {
      id: Date.now().toString(),
      name,
      value: generateKey(),
      createdAt: new Date().toLocaleDateString(),
      active: true,
      visible: false,
    }])
    toast.success('New API key created')
  }

  const toggleVisible = (id) =>
    setKeys(prev => prev.map(k => k.id === id ? { ...k, visible: !k.visible } : k))

  const copyKey = (value) => {
    navigator.clipboard.writeText(value)
    toast.success('Copied to clipboard')
  }

  const rotateKey = (id) => {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, value: generateKey(), visible: false } : k))
    toast.success('Key rotated successfully')
  }

  const deleteKey = (id) => {
    setKeys(prev => prev.filter(k => k.id !== id))
    toast.success('Key deleted')
  }

  return (
    <PageWrap>
      <PageHeader>
        <TitleRow>
          <IconBox><Key /></IconBox>
          <PageTitle>API Keys</PageTitle>
        </TitleRow>
        <CreateBtn onClick={addKey}>
          <Plus /> Generate new key
        </CreateBtn>
      </PageHeader>
      <PageDesc>Create and manage API keys to authenticate requests to your vault.</PageDesc>

      {keys.length === 0 ? (
        <EmptyState>
          <Key />
          <p>No API keys yet. Generate one to get started.</p>
        </EmptyState>
      ) : (
        keys.map(k => (
          <KeyCard key={k.id}>
            <KeyTop>
              <div>
                <KeyName>
                  {k.name}
                  {' '}
                  <StatusBadge $active={k.active}>{k.active ? 'Active' : 'Inactive'}</StatusBadge>
                </KeyName>
                <KeyMeta>Created {k.createdAt}</KeyMeta>
              </div>
              <KeyActions>
                <IconBtn title="Toggle visibility" onClick={() => toggleVisible(k.id)}>
                  {k.visible ? <EyeOff /> : <Eye />}
                </IconBtn>
                <IconBtn title="Copy key" onClick={() => copyKey(k.value)}>
                  <Copy />
                </IconBtn>
                <IconBtn title="Rotate key" onClick={() => rotateKey(k.id)}>
                  <RefreshCw />
                </IconBtn>
                <IconBtn title="Delete key" $danger onClick={() => deleteKey(k.id)}>
                  <Trash2 />
                </IconBtn>
              </KeyActions>
            </KeyTop>
            <KeyValueRow>
              <KeyValue>
                {k.visible ? k.value : k.value.slice(0, 8) + '••••••••••••••••••••••••••••••••'}
              </KeyValue>
            </KeyValueRow>
          </KeyCard>
        ))
      )}
    </PageWrap>
  )
}

export default KeysPage