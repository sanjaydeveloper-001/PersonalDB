import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { createGlobalStyle, keyframes, css } from 'styled-components'
import { Key, Plus, Copy, Trash2, X, CheckCircle, Shield, Sparkles, Lock, Calendar, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiService } from '../../services/apiService'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&display=swap');
`

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
  0%   { background-position: -400% 0; }
  100% { background-position:  400% 0; }
`
const pulseDot = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.45); }
  50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
`
const spin = keyframes`to { transform: rotate(360deg); }`
const floatOrb = keyframes`
  0%, 100% { transform: translateY(0) scale(1); }
  50%       { transform: translateY(-10px) scale(1.03); }
`
const cardReveal = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

// ── Page ──────────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 100%;
  font-family: 'Plus Jakarta Sans', sans-serif;
  animation: ${fadeUp} 0.4s ease both;
`

// ── Hero ──────────────────────────────────────────────────────────────────────
const HeroBanner = styled.div`
  position: relative;
  background: linear-gradient(135deg, #060d1f 0%, #0c1e4a 55%, #0a2060 100%);
  border-radius: 24px; padding: 2.5rem 2.75rem; margin-bottom: 2rem;
  overflow: hidden; border: 1px solid rgba(99,179,237,0.1);
`
const HeroGrid = styled.div`
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%);
`
const Orb = styled.div`
  position: absolute; border-radius: 50%; pointer-events: none;
  ${p => p.$t ? `top:${p.$t};` : ''} ${p => p.$b ? `bottom:${p.$b};` : ''}
  ${p => p.$l ? `left:${p.$l};` : ''} ${p => p.$r ? `right:${p.$r};` : ''}
  width:${p => p.$s}; height:${p => p.$s};
  background: radial-gradient(circle, ${p => p.$c} 0%, transparent 70%);
  animation: ${floatOrb} ${p => p.$dur || '6s'} ease-in-out infinite ${p => p.$rev ? 'reverse' : ''};
`
const HeroContent = styled.div`
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1.5rem; flex-wrap: wrap;
`
const HeroBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: rgba(59,130,246,0.15); border: 1px solid rgba(59,130,246,0.3);
  border-radius: 100px; padding: 0.3rem 0.875rem;
  font-size: 0.7rem; font-weight: 700; color: #7dd3fc;
  letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.875rem;
  svg { width: 0.65rem; height: 0.65rem; }
`
const HeroTitle = styled.h1`
  font-size: 2.1rem; font-weight: 800; color: #f0f6ff;
  margin: 0 0 0.45rem; letter-spacing: -0.04em; line-height: 1.1;
`
const HeroSub = styled.p`color: rgba(255,255,255,0.45); font-size: 0.875rem; margin: 0;`

const StatPill = styled.div`
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px; padding: 1.25rem 1.75rem; text-align: center;
  backdrop-filter: blur(10px); min-width: 120px;
  .num  { font-size: 2.4rem; font-weight: 800; color: #fff; line-height: 1; font-family: 'IBM Plex Mono', monospace; }
  .lbl  { font-size: 0.68rem; font-weight: 700; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 0.25rem; }
  .trk  { margin-top: 0.75rem; height: 3px; border-radius: 2px; background: rgba(255,255,255,0.08); overflow: hidden; }
  .fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg,#3b82f6,#a78bfa); transition: width 0.8s cubic-bezier(0.4,0,0.2,1); }
`
const CreateBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.375rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: #fff; border: none; border-radius: 12px;
  font-size: 0.875rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
  cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(59,130,246,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(59,130,246,0.45); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  svg { width: 14px; height: 14px; }
`
const LimitBanner = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  background: linear-gradient(135deg,#fef3c7,#fffbeb); border: 1px solid #fcd34d;
  border-radius: 12px; padding: 0.875rem 1.25rem;
  font-size: 0.875rem; color: #78350f; font-weight: 500; margin-bottom: 1.5rem;
`

// ── GRID ─────────────────────────────────────────────────────────────────────
const KeysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(295px, 1fr));
  gap: 1.125rem;
`

// ── Card ──────────────────────────────────────────────────────────────────────
const CardWrap = styled.div`
  position: relative; border-radius: 20px;
  animation: ${cardReveal} 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
  animation-delay: ${p => p.$i * 0.08}s;
  &::before {
    content: ''; position: absolute; inset: -1px; border-radius: 21px;
    background: linear-gradient(135deg, rgba(99,179,237,0.35), rgba(139,92,246,0.2), rgba(59,130,246,0.35));
    z-index: 0; opacity: 0; transition: opacity 0.3s;
  }
  &:hover::before { opacity: 1; }
`
const CardSurface = styled.div`
  position: relative; z-index: 1;
  background: linear-gradient(160deg, #ffffff 0%, #f4f8ff 100%);
  border-radius: 20px; border: 1px solid rgba(203,213,225,0.8);
  overflow: hidden; display: flex; flex-direction: column;
  transition: transform 0.25s cubic-bezier(0.4,0,0.2,1),
              box-shadow 0.25s, border-color 0.25s;
  ${CardWrap}:hover & {
    transform: translateY(-3px) scale(1.005);
    box-shadow: 0 20px 50px rgba(30,64,175,0.12), 0 4px 12px rgba(30,64,175,0.06);
    border-color: rgba(147,197,253,0.7);
  }
`

/* Animated hue bar per card */
const CardBar = styled.div`
  height: 3px;
  background: linear-gradient(90deg,
    hsl(${p => p.$hue},80%,55%) 0%,
    hsl(${p => p.$hue+40},75%,60%) 50%,
    hsl(${p => p.$hue},80%,55%) 100%
  );
  background-size: 200%;
  animation: ${shimmer} ${p => 3 + p.$i * 0.4}s linear infinite;
`
const CardTop = styled.div`
  padding: 1.25rem 1.375rem 0.875rem;
  display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;
`
const KeyIconBox = styled.div`
  width: 2.75rem; height: 2.75rem; flex-shrink: 0;
  background: linear-gradient(135deg,#dbeafe,#c7d7fe); border-radius: 13px;
  display: flex; align-items: center; justify-content: center; color: #1d4ed8;
  box-shadow: 0 2px 8px rgba(59,130,246,0.2), inset 0 1px 0 rgba(255,255,255,0.8);
  svg { width: 1.1rem; height: 1.1rem; }
`
const TopRight = styled.div`display: flex; align-items: center; gap: 0.5rem;`
const StatusChip = styled.div`
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.67rem; font-weight: 700; color: #15803d;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  padding: 0.2rem 0.55rem; border-radius: 100px;
`
const GreenDot = styled.span`
  width: 5px; height: 5px; border-radius: 50%; background: #22c55e;
  display: inline-block; animation: ${pulseDot} 1.8s ease infinite;
`
const IndexTag = styled.div`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.65rem; font-weight: 600; color: #94a3b8;
  background: #f1f5f9; border: 1px solid #e2e8f0;
  padding: 0.2rem 0.5rem; border-radius: 6px;
`
const CardMid = styled.div`padding: 0 1.375rem 0.875rem;`
const KeyName = styled.h3`
  font-size: 1rem; font-weight: 800; color: #0f172a;
  letter-spacing: -0.025em; margin: 0 0 0.75rem; line-height: 1.2;
`

/* Terminal strip */
const KeyTerminal = styled.div`
  position: relative; background: #0f172a; border-radius: 11px;
  padding: 0.7rem 0.875rem; overflow: hidden; cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #1e293b; }
  &:hover .hint { opacity: 1; }
  &:hover .kval { color: #93c5fd; }
`
const TermDots = styled.div`
  display: flex; align-items: center; gap: 4px; margin-bottom: 0.45rem;
  span { width: 7px; height: 7px; border-radius: 50%; }
  span:nth-child(1) { background: #f87171; opacity: 0.8; }
  span:nth-child(2) { background: #fbbf24; opacity: 0.8; }
  span:nth-child(3) { background: #4ade80; opacity: 0.8; }
`
const KeyVal = styled.div`
  font-family: 'IBM Plex Mono', monospace; font-size: 0.72rem; color: #64748b;
  letter-spacing: 0.04em; word-break: break-all; line-height: 1.5; transition: color 0.2s;
`
const CopyHint = styled.div`
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.65rem; font-weight: 700; color: #60a5fa;
  margin-top: 0.4rem; opacity: 0; transition: opacity 0.2s;
  svg { width: 9px; height: 9px; }
`
const MetaRow = styled.div`
  display: flex; align-items: center; gap: 0.375rem; margin-top: 0.75rem; flex-wrap: wrap;
`
const MetaTag = styled.div`
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.7rem; color: #94a3b8; font-weight: 500;
  background: #f8fafc; border: 1px solid #f1f5f9;
  padding: 0.2rem 0.5rem; border-radius: 6px;
  svg { width: 10px; height: 10px; }
`
const CardFooter = styled.div`
  margin-top: auto; padding: 0.75rem 1.375rem 1.125rem;
  display: flex; align-items: center; justify-content: space-between;
  border-top: 1px solid #f1f5f9;
`
const FooterLeft = styled.div`font-size: 0.72rem; color: #94a3b8; font-weight: 500;`
const ActionRow  = styled.div`display: flex; gap: 0.4rem;`
const ActBtn = styled.button`
  height: 32px; padding: 0 0.75rem;
  display: inline-flex; align-items: center; gap: 0.35rem;
  border-radius: 8px; border: 1px solid; cursor: pointer;
  font-size: 0.72rem; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
  transition: all 0.18s; background: transparent;
  ${p => p.$danger ? css`
    border-color:#fecaca; color:#f87171;
    &:hover { background:#fef2f2; border-color:#f87171; color:#dc2626; transform:scale(1.04); }
  ` : css`
    border-color:#e2e8f0; color:#64748b;
    &:hover { background:#eff6ff; border-color:#93c5fd; color:#2563eb; transform:scale(1.04); }
  `}
  svg { width: 12px; height: 12px; }
`

// ── Empty / Loading ───────────────────────────────────────────────────────────
const EmptyWrap = styled.div`
  text-align: center; padding: 4.5rem 2rem;
  background: linear-gradient(160deg,#f8fbff,#f0f6ff);
  border: 2px dashed #c7d7fe; border-radius: 24px;
`
const EmptyIconWrap = styled.div`
  width: 5rem; height: 5rem;
  background: linear-gradient(135deg,#dbeafe,#c7d7fe); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.25rem; color: #1d4ed8;
  box-shadow: 0 8px 24px rgba(59,130,246,0.15);
  svg { width: 2rem; height: 2rem; }
`
const EmptyTitle = styled.h3`font-size:1.1rem; font-weight:700; color:#0f172a; margin:0 0 0.5rem;`
const EmptyText  = styled.p `color:#64748b; font-size:0.875rem; margin:0 0 1.75rem;`
const LoadWrap   = styled.div`
  display:flex; align-items:center; justify-content:center;
  gap:0.75rem; padding:3.5rem; color:#94a3b8; font-size:0.875rem;
`
const Spinner = styled.div`
  width:1.1rem; height:1.1rem;
  border:2px solid #e0eaff; border-top-color:#3b82f6;
  border-radius:50%; animation:${spin} 0.65s linear infinite;
`

// ── Modals ────────────────────────────────────────────────────────────────────
const Overlay = styled.div`
  display: flex;
  position: fixed;
  inset: 0;
  /* cover everything — sidebar included */
  top: 0; left: 0; right: 0; bottom: 0;
  width: 100vw; height: 100vh;
  background: rgba(8, 18, 48, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  align-items: center;
  justify-content: center;
  z-index: 99999;
  opacity: ${p => p.$open ? 1 : 0};
  pointer-events: ${p => p.$open ? 'all' : 'none'};
  transition: opacity 0.2s ease;
`

/* Renders the overlay via a Portal so it always mounts on document.body,
   escaping any parent transform / z-index stacking context (e.g. the sidebar). */
const Modal = ({ open, onClose, children }) => {
  if (typeof document === 'undefined') return null
  return createPortal(
    <Overlay $open={open} onClick={onClose}>
      {children}
    </Overlay>,
    document.body
  )
}
const ModalBox = styled.div`
  background:#fff; border-radius:24px; padding:2.25rem;
  max-width:480px; width:92%;
  box-shadow:0 32px 96px rgba(10,25,80,0.2),0 0 0 1px rgba(203,213,225,0.5);
  position:relative; overflow:hidden; animation:${fadeUp} 0.25s ease both;
  &::before { content:''; position:absolute; top:0; left:0; right:0; height:3px;
    background:linear-gradient(90deg,#3b82f6,#8b5cf6,#3b82f6); background-size:200%;
    animation:${shimmer} 2s linear infinite; }
`
const ModalHead  = styled.div`display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1.5rem;`
const ModalLabel = styled.div`font-size:0.68rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#6366f1; margin-bottom:0.25rem;`
const ModalTitle = styled.h3`font-size:1.35rem; font-weight:800; color:#0f172a; margin:0; letter-spacing:-0.03em;`
const CloseBtn   = styled.button`
  background:#f1f5f9; border:none; border-radius:9px; width:32px; height:32px;
  display:flex; align-items:center; justify-content:center;
  cursor:pointer; color:#64748b; transition:all 0.15s; flex-shrink:0;
  &:hover { background:#e2e8f0; color:#0f172a; } svg { width:15px; height:15px; }
`
const BodyText   = styled.p`font-size:0.875rem; color:#475569; line-height:1.65; margin:0 0 1.25rem;`
const InputWrap  = styled.div`position:relative;`
const InputIcon  = styled.div`
  position:absolute; left:1rem; top:50%; transform:translateY(-50%);
  color:#94a3b8; display:flex; svg { width:15px; height:15px; }
`
const StyledInput = styled.input`
  width:100%; padding:0.875rem 1rem 0.875rem 2.75rem;
  border:1.5px solid #e2e8f0; border-radius:12px;
  font-size:0.9rem; font-family:'Plus Jakarta Sans',sans-serif;
  color:#0f172a; transition:all 0.2s; box-sizing:border-box;
  &::placeholder { color:#c4cdd8; }
  &:focus { outline:none; border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,0.1); }
  &:disabled { background:#f8fafc; cursor:not-allowed; }
`
const ModalFooter  = styled.div`display:flex; gap:0.75rem; justify-content:flex-end; margin-top:1.75rem;`
const BtnSecondary = styled.button`
  padding:0.75rem 1.375rem; border-radius:10px; border:1.5px solid #e2e8f0;
  background:#fff; color:#64748b; font-size:0.875rem; font-weight:600;
  font-family:'Plus Jakarta Sans',sans-serif; cursor:pointer; transition:all 0.15s;
  &:hover:not(:disabled) { background:#f8fafc; border-color:#cbd5e1; color:#0f172a; }
  &:disabled { opacity:0.5; cursor:not-allowed; }
`
const BtnPrimary = styled.button`
  display:inline-flex; align-items:center; gap:0.5rem;
  padding:0.75rem 1.5rem; border-radius:10px; border:none;
  background:linear-gradient(135deg,#6366f1,#4f46e5); color:#fff;
  font-size:0.875rem; font-weight:700; font-family:'Plus Jakarta Sans',sans-serif;
  cursor:pointer; transition:all 0.2s;
  box-shadow:0 4px 14px rgba(99,102,241,0.3),inset 0 1px 0 rgba(255,255,255,0.12);
  &:hover:not(:disabled) { transform:translateY(-1px); box-shadow:0 8px 22px rgba(99,102,241,0.4); }
  &:disabled { opacity:0.5; cursor:not-allowed; transform:none; }
  svg { width:14px; height:14px; }
`
const SuccessRing = styled.div`
  width:4rem; height:4rem; background:linear-gradient(135deg,#dcfce7,#bbf7d0);
  border-radius:50%; display:flex; align-items:center; justify-content:center;
  margin:0 auto 1.25rem; color:#15803d; box-shadow:0 0 0 8px rgba(34,197,94,0.1);
  svg { width:1.75rem; height:1.75rem; }
`
const KeyRevealBox = styled.div`
  background:linear-gradient(160deg,#0f172a,#1e1b4b); border-radius:14px;
  padding:1.125rem 1.25rem; margin-bottom:1.25rem; position:relative; overflow:hidden;
  border:1px solid rgba(99,102,241,0.25);
  &::after { content:''; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(99,102,241,0.06),transparent);
    background-size:200%; animation:${shimmer} 3s linear infinite; pointer-events:none; }
`
const RevealKey = styled.div`
  font-family:'IBM Plex Mono',monospace; font-size:0.75rem; color:#a5b4fc;
  word-break:break-all; line-height:1.7; position:relative; z-index:1;
`
const CopyRevealBtn = styled.button`
  display:flex; align-items:center; gap:0.4rem;
  background:rgba(255,255,255,0.07); border:1px solid rgba(255,255,255,0.12);
  color:#94a3b8; padding:0.4rem 0.875rem; border-radius:7px;
  cursor:pointer; font-size:0.72rem; font-family:'Plus Jakarta Sans',sans-serif;
  font-weight:600; margin-top:0.75rem; transition:all 0.15s; position:relative; z-index:1;
  &:hover { background:rgba(255,255,255,0.12); color:#e2e8f0; }
  svg { width:11px; height:11px; }
`
const WarnNote = styled.div`
  display:flex; align-items:flex-start; gap:0.625rem;
  background:#fffbeb; border:1px solid #fde68a; border-radius:10px;
  padding:0.75rem 1rem; font-size:0.8rem; color:#92400e; line-height:1.55;
`

const HUE_CYCLE = [215, 255, 190, 30, 160, 280, 350, 40, 120, 200]

// ─────────────────────────────────────────────────────────────────────────────
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
    } finally { setLoading(false) }
  }

  const handleOpenModal = () => {
    if (keys.length >= 10) { toast.error('Maximum 10 API keys allowed.'); return }
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
    } finally { setCreatingKey(false) }
  }

  const handleCopy   = (val) => { navigator.clipboard.writeText(val); toast.success('Copied to clipboard!') }
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this API key?')) return
    try {
      await apiService.revokeKey(id)
      setKeys(prev => prev.filter(k => k._id !== id))
      toast.success('Key deleted')
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to delete key') }
  }

  const closeNameModal    = () => { setShowNameModal(false); setInputName('') }
  const closeSuccessModal = () => { setShowSuccessModal(false); setNewKeyData(null) }

  return (
    <>
      <GlobalStyle />
      <PageWrap>

        {/* Hero */}
        <HeroBanner>
          <HeroGrid />
          <Orb $t="-60px" $r="-60px" $s="280px" $c="rgba(59,130,246,0.18)" $dur="6s" />
          <Orb $b="-80px" $l="20%"   $s="220px" $c="rgba(139,92,246,0.1)"  $dur="8s" $rev />
          <HeroContent>
            <div>
              <HeroBadge><Lock /> Authentication</HeroBadge>
              <HeroTitle>API Keys</HeroTitle>
              <HeroSub>Manage credentials for secure programmatic access to your portfolio data.</HeroSub>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
              <StatPill>
                <div className="num">{loading ? '—' : keys.length}</div>
                <div className="lbl">of 10 keys</div>
                <div className="trk"><div className="fill" style={{ width:`${(keys.length/10)*100}%` }} /></div>
              </StatPill>
              <CreateBtn onClick={handleOpenModal} disabled={loading || keys.length >= 10}>
                <Plus /> New Key
              </CreateBtn>
            </div>
          </HeroContent>
        </HeroBanner>

        {keys.length >= 10 && (
          <LimitBanner>⚠️ You've reached the 10-key limit. Delete an existing key to create a new one.</LimitBanner>
        )}

        {/* Content */}
        {loading ? (
          <LoadWrap><Spinner /> Loading keys…</LoadWrap>
        ) : keys.length === 0 ? (
          <EmptyWrap>
            <EmptyIconWrap><Key /></EmptyIconWrap>
            <EmptyTitle>No API Keys Yet</EmptyTitle>
            <EmptyText>Generate your first key to start making authenticated requests.</EmptyText>
            <CreateBtn onClick={handleOpenModal}><Plus /> Generate First Key</CreateBtn>
          </EmptyWrap>
        ) : (
          <KeysGrid>
            {keys.map((k, i) => (
              <CardWrap key={k._id} $i={i}>
                <CardSurface>
                  <CardBar $hue={HUE_CYCLE[i % HUE_CYCLE.length]} $i={i} />

                  <CardTop>
                    <KeyIconBox><Key /></KeyIconBox>
                    <TopRight>
                      <StatusChip><GreenDot /> Active</StatusChip>
                      <IndexTag>#{String(i + 1).padStart(2, '0')}</IndexTag>
                    </TopRight>
                  </CardTop>

                  <CardMid>
                    <KeyName>{k.name}</KeyName>
                    <KeyTerminal onClick={() => handleCopy(k.partialKey)} title="Click to copy">
                      <TermDots><span /><span /><span /></TermDots>
                      <KeyVal className="kval">{k.partialKey}</KeyVal>
                      <CopyHint className="hint"><Copy /> Click to copy</CopyHint>
                    </KeyTerminal>
                    <MetaRow>
                      <MetaTag>
                        <Calendar />
                        {new Date(k.createdAt).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' })}
                      </MetaTag>
                      <MetaTag><Zap /> REST API</MetaTag>
                    </MetaRow>
                  </CardMid>

                  <CardFooter>
                    <FooterLeft>Bearer token</FooterLeft>
                    <ActionRow>
                      <ActBtn onClick={() => handleCopy(k.partialKey)}>
                        <Copy /> Copy
                      </ActBtn>
                      <ActBtn $danger onClick={() => handleDelete(k._id)}>
                        <Trash2 /> Delete
                      </ActBtn>
                    </ActionRow>
                  </CardFooter>
                </CardSurface>
              </CardWrap>
            ))}
          </KeysGrid>
        )}

        {/* Name Modal */}
        <Modal open={showNameModal} onClose={closeNameModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <div><ModalLabel>New Credential</ModalLabel><ModalTitle>Create API Key</ModalTitle></div>
              <CloseBtn onClick={closeNameModal}><X /></CloseBtn>
            </ModalHead>
            <BodyText>Give your key a descriptive name — e.g. "Portfolio Widget" or "Mobile App".</BodyText>
            <form onSubmit={handleCreateKey}>
              <InputWrap>
                <InputIcon><Key /></InputIcon>
                <StyledInput
                  type="text" placeholder="e.g., Portfolio Widget"
                  value={inputName} onChange={e => setInputName(e.target.value)}
                  disabled={creatingKey} autoFocus
                />
              </InputWrap>
              <ModalFooter>
                <BtnSecondary type="button" onClick={closeNameModal} disabled={creatingKey}>Cancel</BtnSecondary>
                <BtnPrimary type="submit" disabled={creatingKey || !inputName.trim()}>
                  {creatingKey
                    ? <><Spinner style={{width:'13px',height:'13px',borderWidth:'2px'}} /> Creating…</>
                    : <><Sparkles /> Generate Key</>}
                </BtnPrimary>
              </ModalFooter>
            </form>
          </ModalBox>
        </Modal>
        {/* Success Modal */}
        <Modal open={showSuccessModal} onClose={closeSuccessModal}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalHead>
              <div><ModalLabel>Key Generated</ModalLabel><ModalTitle>Save Your Key</ModalTitle></div>
              <CloseBtn onClick={closeSuccessModal}><X /></CloseBtn>
            </ModalHead>
            <SuccessRing><CheckCircle /></SuccessRing>
            <WarnNote style={{ marginBottom:'1.25rem' }}>
              <Shield size={14} style={{ flexShrink:0, marginTop:1 }} />
              <span><strong>One-time display only.</strong> This key won't be shown again. Copy and store it securely now.</span>
            </WarnNote>
            {newKeyData?.key && (
              <KeyRevealBox>
                <RevealKey>{newKeyData.key}</RevealKey>
                <CopyRevealBtn onClick={() => handleCopy(newKeyData.key)}>
                  <Copy /> Copy Key
                </CopyRevealBtn>
              </KeyRevealBox>
            )}
            <BodyText style={{ fontSize:'0.82rem', color:'#64748b', margin:0 }}>
              Usage: <code style={{ background:'#f1f5f9', padding:'0.15rem 0.4rem', borderRadius:5, fontFamily:'IBM Plex Mono,monospace', fontSize:'0.78rem' }}>
                Authorization: Bearer {newKeyData?.key}
              </code>
            </BodyText>
            <ModalFooter>
              <BtnPrimary onClick={() => { handleCopy(newKeyData?.key || ''); closeSuccessModal() }}>
                <Copy /> Copy & Close
              </BtnPrimary>
            </ModalFooter>
          </ModalBox>
        </Modal>

      </PageWrap>
    </>
  )
}

export default KeysPage