import { useState, useEffect } from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { Key, Plus, Copy, Trash2, X, CheckCircle, Shield, Sparkles, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiService } from '../../services/apiService'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
`

// ── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
  0%   { background-position: -400% 0; }
  100% { background-position:  400% 0; }
`
const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
`
const spin = keyframes`
  to { transform: rotate(360deg); }
`
const scanline = keyframes`
  0%   { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
`

// ── Layout ────────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 100%;
  font-family: 'Sora', sans-serif;
  animation: ${fadeUp} 0.4s ease both;
`

// ── Hero Banner ───────────────────────────────────────────────────────────────
const HeroBanner = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0a2558 0%, #0f3b9c 45%, #1a5fc8 100%);
  border-radius: 20px;
  padding: 2.5rem 2.75rem;
  margin-bottom: 2rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: -80px; right: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(99,179,237,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
`

const HeroOrb = styled.div`
  position: absolute;
  bottom: -60px; left: 35%;
  width: 260px; height: 260px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%);
  pointer-events: none;
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
`

const HeroLeft = styled.div``

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 100px;
  padding: 0.3rem 0.75rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: rgba(255,255,255,0.85);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 0.875rem;
  backdrop-filter: blur(4px);
  svg { width: 0.75rem; height: 0.75rem; }
`

const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.03em;
  line-height: 1.1;
`

const HeroSub = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 0.9rem;
  margin: 0;
  font-weight: 400;
`

const KeyCountPill = styled.div`
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 14px;
  padding: 1.25rem 1.75rem;
  text-align: center;
  backdrop-filter: blur(8px);
  min-width: 130px;

  .num {
    font-size: 2.5rem;
    font-weight: 800;
    color: #fff;
    line-height: 1;
    font-family: 'JetBrains Mono', monospace;
  }
  .label {
    font-size: 0.72rem;
    font-weight: 600;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 0.25rem;
  }
  .bar {
    margin-top: 0.75rem;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.15);
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 2px;
    background: linear-gradient(90deg, #60a5fa, #a5f3fc);
    transition: width 0.6s ease;
  }
`

// ── Create Button ─────────────────────────────────────────────────────────────
const CreateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #fff;
  color: #1e40af;
  border: none;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
    transform: none;
  }

  svg { width: 15px; height: 15px; }
`

// ── Limit Warning ─────────────────────────────────────────────────────────────
const LimitWarn = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #fef3c7, #fde68a20);
  border: 1px solid #fbbf24;
  border-radius: 10px;
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  color: #92400e;
  font-weight: 500;
  margin-bottom: 1.5rem;
`

// ── Keys Grid ─────────────────────────────────────────────────────────────────
const KeysGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

const KeyCard = styled.div`
  background: #fff;
  border: 1.5px solid #e0eaff;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${p => p.$i * 0.06}s;

  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 8px 32px rgba(37, 99, 235, 0.1);
    transform: translateY(-1px);
  }
`

const KeyCardInner = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
`

const KeyIconWrap = styled.div`
  width: 3rem;
  height: 3rem;
  flex-shrink: 0;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1d4ed8;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    animation: ${scanline} 3s ease infinite;
    animation-delay: ${p => p.$d || '0s'};
  }

  svg { width: 1.25rem; height: 1.25rem; }
`

const KeyInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const KeyNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
`

const KeyNameText = styled.span`
  font-size: 0.95rem;
  font-weight: 700;
  color: #0f172a;
`

const ActiveDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
  display: inline-block;
  box-shadow: 0 0 0 2px rgba(34,197,94,0.2);
  animation: ${pulse} 2s ease infinite;
`

const ActiveLabel = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  color: #15803d;
  background: #dcfce7;
  border: 1px solid #bbf7d0;
  padding: 0.15rem 0.5rem;
  border-radius: 100px;
  letter-spacing: 0.04em;
`

const KeyDateText = styled.span`
  font-size: 0.78rem;
  color: #94a3b8;
`

const KeyValueStrip = styled.div`
  background: #f0f6ff;
  border: 1px solid #dbeafe;
  border-radius: 8px;
  padding: 0.5rem 0.875rem;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: #3b5a9e;
  letter-spacing: 0.04em;
  word-break: break-all;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #e0edff; }
`

const KeyActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`

const ActionBtn = styled.button`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1.5px solid;
  cursor: pointer;
  transition: all 0.18s;
  background: transparent;

  border-color: ${p => p.$danger ? '#fecaca' : '#e0eaff'};
  color:        ${p => p.$danger ? '#dc2626' : '#4b6280'};

  &:hover {
    background: ${p => p.$danger ? '#fee2e2' : '#eff6ff'};
    border-color: ${p => p.$danger ? '#f87171' : '#93c5fd'};
    color: ${p => p.$danger ? '#b91c1c' : '#1d4ed8'};
    transform: scale(1.07);
  }

  svg { width: 15px; height: 15px; }
`

// ── Empty State ───────────────────────────────────────────────────────────────
const EmptyWrap = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #f8fbff, #eff6ff);
  border: 2px dashed #bfdbfe;
  border-radius: 20px;
`

const EmptyIcon = styled.div`
  width: 5rem;
  height: 5rem;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.25rem;
  color: #1d4ed8;
  svg { width: 2rem; height: 2rem; }
`

const EmptyTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
`

const EmptyText = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 1.5rem 0;
`

// ── Loading ───────────────────────────────────────────────────────────────────
const LoadWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 3rem;
  color: #64748b;
  font-size: 0.9rem;
`

const Spinner = styled.div`
  width: 1.25rem; height: 1.25rem;
  border: 2.5px solid #dbeafe;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

// ── Modal ─────────────────────────────────────────────────────────────────────
const Overlay = styled.div`
  display: ${p => p.$open ? 'flex' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(10,25,60,0.55);
  backdrop-filter: blur(6px);
  align-items: center;
  justify-content: center;
  z-index: 999;
  animation: ${p => p.$open ? fadeUp : 'none'} 0.2s ease;
`

const ModalBox = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2.25rem;
  max-width: 480px;
  width: 92%;
  box-shadow: 0 24px 80px rgba(10,25,80,0.25);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1e40af, #7c3aed);
    background-size: 200%;
    animation: ${shimmer} 2s linear infinite;
  }
`

const ModalHead = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`

const ModalTitleBlock = styled.div``

const ModalLabel = styled.div`
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #3b82f6;
  margin-bottom: 0.3rem;
`

const ModalTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.02em;
`

const CloseBtn = styled.button`
  background: #f1f5f9;
  border: none;
  border-radius: 8px;
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  color: #64748b;
  transition: all 0.15s;
  flex-shrink: 0;

  &:hover { background: #e2e8f0; color: #0f172a; }
  svg { width: 16px; height: 16px; }
`

const ModalBodyText = styled.p`
  font-size: 0.9rem;
  color: #475569;
  line-height: 1.65;
  margin: 0 0 1.25rem 0;
`

const InputWrap = styled.div`
  position: relative;
  margin-bottom: 0.5rem;
`

const InputIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  display: flex;
  svg { width: 16px; height: 16px; }
`

const StyledInput = styled.input`
  width: 100%;
  padding: 0.875rem 1rem 0.875rem 2.75rem;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  font-size: 0.9rem;
  font-family: 'Sora', sans-serif;
  color: #0f172a;
  transition: all 0.2s;
  box-sizing: border-box;

  &::placeholder { color: #b0bec5; }

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 4px rgba(59,130,246,0.1);
  }

  &:disabled {
    background: #f8fafc;
    cursor: not-allowed;
  }
`

const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.75rem;
`

const BtnSecondary = styled.button`
  padding: 0.75rem 1.375rem;
  border-radius: 9px;
  border: 1.5px solid #e2e8f0;
  background: #fff;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.15s;

  &:hover:not(:disabled) { background: #f8fafc; border-color: #cbd5e1; color: #0f172a; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const BtnPrimary = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 9px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(37,99,235,0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(37,99,235,0.35);
  }
  &:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
  svg { width: 15px; height: 15px; }
`

// ── Success Modal ─────────────────────────────────────────────────────────────
const SuccessIcon = styled.div`
  width: 4rem; height: 4rem;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem;
  color: #15803d;
  svg { width: 1.75rem; height: 1.75rem; }
`

const SuccessKeyBox = styled.div`
  background: #0c1b3a;
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 1.25rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(59,130,246,0.08), transparent);
    pointer-events: none;
  }
`

const KeyDisplayText = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.78rem;
  color: #7dd3fc;
  word-break: break-all;
  line-height: 1.6;
`

const CopyKeyBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.15);
  color: #94a3b8;
  padding: 0.4rem 0.875rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.75rem;
  font-family: 'Sora', sans-serif;
  font-weight: 600;
  margin-top: 0.75rem;
  transition: all 0.15s;

  &:hover { background: rgba(255,255,255,0.14); color: #e2e8f0; }
  svg { width: 12px; height: 12px; }
`

const WarnNote = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.625rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-size: 0.8rem;
  color: #92400e;
  line-height: 1.5;
`

// ── Page ──────────────────────────────────────────────────────────────────────
const KeysPage = () => {
  const [keys, setKeys] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNameModal, setShowNameModal] = useState(false)
  const [inputName, setInputName] = useState('')
  const [creatingKey, setCreatingKey] = useState(false)
  const [newKeyData, setNewKeyData] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => { fetchKeys() }, [])

  const fetchKeys = async () => {
    try {
      setLoading(true)
      const { data } = await apiService.getKeys()
      setKeys(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch API keys')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = () => {
    if (keys.length >= 10) {
      toast.error('Maximum 10 API keys allowed.')
      return
    }
    setShowNameModal(true)
  }

  const handleCreateKey = async (e) => {
    e.preventDefault()
    if (!inputName.trim()) { toast.error('Key name is required'); return }
    try {
      setCreatingKey(true)
      const { data } = await apiService.generateKey(inputName)
      setNewKeyData(data)
      setShowNameModal(false)
      setShowSuccessModal(true)
      setInputName('')
      await fetchKeys()
      toast.success('API key created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create API key')
    } finally {
      setCreatingKey(false)
    }
  }

  const handleCopy = (val) => {
    navigator.clipboard.writeText(val)
    toast.success('Copied to clipboard!')
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this API key?')) return
    try {
      await apiService.revokeKey(id)
      setKeys(prev => prev.filter(k => k._id !== id))
      toast.success('Key deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete key')
    }
  }

  const closeNameModal = () => { setShowNameModal(false); setInputName('') }
  const closeSuccessModal = () => { setShowSuccessModal(false); setNewKeyData(null) }

  return (
    <>
      <GlobalStyle />
      <PageWrap>

        {/* Hero */}
        <HeroBanner>
          <HeroOrb />
          <HeroContent>
            <HeroLeft>
              <HeroBadge><Lock size={10} /> Authentication</HeroBadge>
              <HeroTitle>API Keys</HeroTitle>
              <HeroSub>Manage credentials for secure programmatic access to your portfolio data.</HeroSub>
            </HeroLeft>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <KeyCountPill>
                <div className="num">{loading ? '—' : keys.length}</div>
                <div className="label">of 10 keys</div>
                <div className="bar">
                  <div className="bar-fill" style={{ width: `${(keys.length / 10) * 100}%` }} />
                </div>
              </KeyCountPill>
              <CreateBtn onClick={handleOpenModal} disabled={loading || keys.length >= 10}>
                <Plus /> New Key
              </CreateBtn>
            </div>
          </HeroContent>
        </HeroBanner>

        {keys.length >= 10 && (
          <LimitWarn>⚠️ You've reached the 10-key limit. Delete an existing key to create a new one.</LimitWarn>
        )}

        {/* Key List */}
        {loading ? (
          <LoadWrap><Spinner /> Loading keys…</LoadWrap>
        ) : keys.length === 0 ? (
          <EmptyWrap>
            <EmptyIcon><Key /></EmptyIcon>
            <EmptyTitle>No API Keys Yet</EmptyTitle>
            <EmptyText>Generate your first key to start making authenticated requests.</EmptyText>
            <CreateBtn onClick={handleOpenModal} style={{ background: 'linear-gradient(135deg,#3b82f6,#1e40af)', color:'#fff' }}>
              <Plus /> Generate First Key
            </CreateBtn>
          </EmptyWrap>
        ) : (
          <KeysGrid>
            {keys.map((k, i) => (
              <KeyCard key={k._id} $i={i}>
                <KeyCardInner>
                  <KeyIconWrap $d={`${i * 0.8}s`}><Key /></KeyIconWrap>
                  <KeyInfo>
                    <KeyNameRow>
                      <KeyNameText>{k.name}</KeyNameText>
                      <ActiveDot />
                      <ActiveLabel>Active</ActiveLabel>
                    </KeyNameRow>
                    <KeyValueStrip onClick={() => handleCopy(k.partialKey)} title="Click to copy">
                      {k.partialKey}
                    </KeyValueStrip>
                    <KeyDateText style={{ marginTop: '0.375rem', display: 'block' }}>
                      Created {new Date(k.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </KeyDateText>
                  </KeyInfo>
                  <KeyActions>
                    <ActionBtn title="Copy key" onClick={() => handleCopy(k.partialKey)}>
                      <Copy />
                    </ActionBtn>
                    <ActionBtn title="Delete key" $danger onClick={() => handleDelete(k._id)}>
                      <Trash2 />
                    </ActionBtn>
                  </KeyActions>
                </KeyCardInner>
              </KeyCard>
            ))}
          </KeysGrid>
        )}

        {/* Name Modal */}
        <Overlay $open={showNameModal} onClick={closeNameModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitleBlock>
                <ModalLabel>New Credential</ModalLabel>
                <ModalTitle>Create API Key</ModalTitle>
              </ModalTitleBlock>
              <CloseBtn onClick={closeNameModal}><X /></CloseBtn>
            </ModalHead>
            <ModalBodyText>
              Give your key a descriptive name so you can identify it later — e.g. "Portfolio Widget" or "Mobile App".
            </ModalBodyText>
            <form onSubmit={handleCreateKey}>
              <InputWrap>
                <InputIcon><Key /></InputIcon>
                <StyledInput
                  type="text"
                  placeholder="e.g., Portfolio Widget"
                  value={inputName}
                  onChange={e => setInputName(e.target.value)}
                  disabled={creatingKey}
                  autoFocus
                />
              </InputWrap>
              <ModalFooter>
                <BtnSecondary type="button" onClick={closeNameModal} disabled={creatingKey}>Cancel</BtnSecondary>
                <BtnPrimary type="submit" disabled={creatingKey || !inputName.trim()}>
                  {creatingKey ? <><Spinner style={{width:'14px',height:'14px',borderWidth:'2px'}} /> Creating…</> : <><Sparkles /> Generate Key</>}
                </BtnPrimary>
              </ModalFooter>
            </form>
          </ModalBox>
        </Overlay>

        {/* Success Modal */}
        <Overlay $open={showSuccessModal} onClick={closeSuccessModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <ModalTitleBlock>
                <ModalLabel>Key Generated</ModalLabel>
                <ModalTitle>Save Your Key</ModalTitle>
              </ModalTitleBlock>
              <CloseBtn onClick={closeSuccessModal}><X /></CloseBtn>
            </ModalHead>
            <SuccessIcon><CheckCircle /></SuccessIcon>
            <WarnNote style={{ marginBottom: '1.25rem' }}>
              <Shield size={14} style={{ flexShrink: 0, marginTop: 1 }} />
              <span><strong>One-time display only.</strong> This key will not be shown again. Copy and store it securely now.</span>
            </WarnNote>
            {newKeyData?.key && (
              <SuccessKeyBox>
                <KeyDisplayText>{newKeyData.key}</KeyDisplayText>
                <CopyKeyBtn onClick={() => handleCopy(newKeyData.key)}>
                  <Copy /> Copy Key
                </CopyKeyBtn>
              </SuccessKeyBox>
            )}
            <ModalBodyText style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
              Usage: <code style={{ background:'#f1f5f9', padding:'0.15rem 0.4rem', borderRadius:4, fontFamily:'JetBrains Mono, monospace' }}>Authorization: Bearer {newKeyData?.key}</code>
            </ModalBodyText>
            <ModalFooter>
              <BtnPrimary onClick={() => { handleCopy(newKeyData?.key || ''); closeSuccessModal() }}>
                <Copy /> Copy & Close
              </BtnPrimary>
            </ModalFooter>
          </ModalBox>
        </Overlay>

      </PageWrap>
    </>
  )
}

export default KeysPage