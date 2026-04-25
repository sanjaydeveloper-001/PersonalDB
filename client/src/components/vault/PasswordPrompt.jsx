import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { itemService } from '../../services/itemService'
import Modal from '../common/Modal'
import toast from 'react-hot-toast'
import styled, { keyframes } from 'styled-components'
import { Lock, Eye, EyeOff, Edit, Trash2 } from 'lucide-react'

const slideUp = keyframes`
  from { opacity: 0; transform: scale(0.94) translateY(16px); }
  to   { opacity: 1; transform: scale(1)    translateY(0); }
`
const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

/* ─── Backdrop ─── */
const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; box-sizing: border-box;
  font-family: inherit;
  animation: ${fadeIn} 0.18s ease forwards;
`

/* ─── Card ─── */
const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 22px;
  width: 100%; max-width: 420px;
  box-shadow: 0 28px 70px rgba(15,23,42,0.18), 0 0 0 1px rgba(59,130,246,0.08);
  overflow: hidden;
  animation: ${slideUp} 0.22s cubic-bezier(0.34,1.1,0.64,1) forwards;
`

/* ─── Header ─── */
const Header = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
`
const HeaderLeft  = styled.div`display: flex; align-items: center; gap: 10px;`
const HeaderRight = styled.div`display: flex; align-items: center; gap: 8px;`

const TypeIcon = styled.div`
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${({ $action }) =>
    $action === 'view'   ? 'rgba(59,130,246,0.1)'  :
    $action === 'edit'   ? 'rgba(99,102,241,0.1)'  :
                           'rgba(239,68,68,0.08)'};
  color: ${({ $action }) =>
    $action === 'view'   ? '#2563eb' :
    $action === 'edit'   ? '#4f46e5' : '#dc2626'};
  svg { width: 15px; height: 15px; }
`

const HeaderTitle = styled.span`
  font-size: 0.97rem;
  font-weight: 600;
  color: #0f172a;
`

const Chip = styled.span`
  font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 20px; font-weight: 600;
  background: ${({ $action }) =>
    $action === 'view'   ? 'rgba(59,130,246,0.08)'  :
    $action === 'edit'   ? 'rgba(99,102,241,0.08)'  :
                           'rgba(239,68,68,0.07)'};
  color: ${({ $action }) =>
    $action === 'view'   ? '#2563eb' :
    $action === 'edit'   ? '#4f46e5' : '#dc2626'};
`

const CloseBtn = styled.button`
  width: 30px; height: 30px; border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: white; color: #94a3b8; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s;
  &:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
  svg { width: 13px; height: 13px; }
`

/* ─── Body ─── */
const Body = styled.div`padding: 28px 24px 24px;`

const IconRing = styled.div`
  width: 56px; height: 56px; border-radius: 50%;
  margin: 0 auto 18px;
  display: flex; align-items: center; justify-content: center;
  background: ${({ $action }) =>
    $action === 'view'   ? 'rgba(59,130,246,0.07)'  :
    $action === 'edit'   ? 'rgba(99,102,241,0.07)'  :
                           'rgba(239,68,68,0.06)'};
  border: 1.5px solid ${({ $action }) =>
    $action === 'view'   ? 'rgba(59,130,246,0.25)'  :
    $action === 'edit'   ? 'rgba(99,102,241,0.25)'  :
                           'rgba(239,68,68,0.22)'};
  color: ${({ $action }) =>
    $action === 'view'   ? '#2563eb' :
    $action === 'edit'   ? '#4f46e5' : '#dc2626'};
  svg { width: 24px; height: 24px; }
`

const Heading = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
  text-align: center;
  margin: 0 0 6px;
`

const Sub = styled.p`
  color: #64748b;
  font-size: 0.8rem;
  text-align: center;
  line-height: 1.6;
  margin: 0 0 24px;
`

const FieldLabel = styled.label`
  display: block;
  font-size: 0.72rem; font-weight: 600; color: #64748b;
  letter-spacing: 0.06em; text-transform: uppercase;
  margin-bottom: 7px;
`

const InputWrap = styled.div`position: relative; margin-bottom: 20px;`

const StyledInput = styled.input`
  width: 100%;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 44px 11px 14px;
  color: #0f172a; font-size: 0.9rem; font-family: inherit;
  outline: none; transition: all 0.2s; box-sizing: border-box;

  &:focus {
    border-color: ${({ $action }) =>
      $action === 'view'   ? '#3b82f6'  :
      $action === 'edit'   ? '#6366f1'  : '#ef4444'};
    background: white;
    box-shadow: 0 0 0 3px ${({ $action }) =>
      $action === 'view'   ? 'rgba(59,130,246,0.1)'  :
      $action === 'edit'   ? 'rgba(99,102,241,0.1)'  :
                             'rgba(239,68,68,0.08)'};
  }
  &::placeholder { color: #cbd5e1; }
`

const EyeBtn = styled.button`
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;
  display: flex; align-items: center; transition: color 0.2s;
  &:hover { color: #475569; }
  svg { width: 15px; height: 15px; }
`

const ActionsRow = styled.div`display: flex; gap: 10px;`

const CancelBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px;
  border: 1.5px solid #e2e8f0; background: white; color: #64748b;
  font-family: inherit; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;
  &:hover { background: #f1f5f9; color: #0f172a; }
`

const ConfirmBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px; border: none;
  background: ${({ $action }) =>
    $action === 'view'   ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' :
    $action === 'edit'   ? 'linear-gradient(135deg,#6366f1,#4f46e5)' :
                           'linear-gradient(135deg,#ef4444,#dc2626)'};
  color: white; font-family: inherit; font-size: 0.875rem; font-weight: 500;
  cursor: pointer; transition: all 0.25s;
  box-shadow: 0 3px 12px ${({ $action }) =>
    $action === 'view'   ? 'rgba(59,130,246,0.25)'  :
    $action === 'edit'   ? 'rgba(99,102,241,0.25)'  :
                           'rgba(239,68,68,0.25)'};
  display: flex; align-items: center; justify-content: center; gap: 6px;
  &:hover { transform: translateY(-1px); filter: brightness(1.07); }
  svg { width: 13px; height: 13px; }
`

/* ─── Per-action config ─── */
const ACTION_CONFIG = {
  view: {
    headerIcon: <Lock />,
    chipLabel:  'View',
    heading:    'Item is locked',
    sub:        'Enter the password to unlock and view this item\'s contents.',
    btnLabel:   'Unlock & View',
    btnIcon:    <Lock />,
  },
  edit: {
    headerIcon: <Edit />,
    chipLabel:  'Edit',
    heading:    'Unlock to edit',
    sub:        'This item is password protected. Verify the password before making changes.',
    btnLabel:   'Verify & Edit',
    btnIcon:    <Edit />,
  },
  delete: {
    headerIcon: <Trash2 />,
    chipLabel:  'Delete',
    heading:    'Confirm deletion',
    sub:        'This item is password protected. Enter the password to confirm deletion.',
    btnLabel:   'Verify & Delete',
    btnIcon:    <Trash2 />,
  },
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const PasswordPrompt = ({ itemId, action = 'view', onSuccess, onClose }) => {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)

  const cfg = ACTION_CONFIG[action] || ACTION_CONFIG.view

  useEffect(() => {
    setPassword(''); setShowPass(false)
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await itemService.verifyPassword(itemId, password)
      onSuccess(data)
    } catch {
      toast.error('Incorrect password')
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
    <Backdrop onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <Card>
        {/* Header */}
        <Header>
          <HeaderLeft>
            <TypeIcon $action={action}>{cfg.headerIcon}</TypeIcon>
            <HeaderTitle>Locked Item</HeaderTitle>
          </HeaderLeft>
          <HeaderRight>
            <Chip $action={action}>{cfg.chipLabel}</Chip>
            <CloseBtn onClick={onClose}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </CloseBtn>
          </HeaderRight>
        </Header>

        {/* Body */}
        <Body>
          <IconRing $action={action}><Lock /></IconRing>
          <Heading>{cfg.heading}</Heading>
          <Sub>{cfg.sub}</Sub>

          <form onSubmit={handleSubmit}>
            <FieldLabel>Password</FieldLabel>
            <InputWrap>
              <StyledInput
                $action={action}
                type={showPass ? 'text' : 'password'}
                placeholder="Enter item password…"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
                required
              />
              <EyeBtn type="button" onClick={() => setShowPass(s => !s)}>
                {showPass ? <EyeOff /> : <Eye />}
              </EyeBtn>
            </InputWrap>

            <ActionsRow>
              <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
              <ConfirmBtn type="submit" $action={action} disabled={loading}>
                {loading ? 'Verifying…' : <>{cfg.btnIcon} {cfg.btnLabel}</>}
              </ConfirmBtn>
            </ActionsRow>
          </form>
        </Body>
      </Card>
    </Backdrop>,
    document.body
  )
}

export default PasswordPrompt