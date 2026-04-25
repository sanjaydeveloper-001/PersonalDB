import { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  Mail, Trash2, Loader, AlertTriangle, Calendar, HardDrive,
  CheckCircle, Clock, Search, X, LayoutGrid, List, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

/* ── Animations ── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
const dropIn = keyframes`
  from { opacity: 0; transform: translateY(-6px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`

/* ── Main Container ── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  width: 100%;
  max-width: 1400px;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`

const IconBox = styled.div`
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(153, 27, 27, 0.12));
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
  box-shadow: 0 0 22px rgba(239, 68, 68, 0.14);
`

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary, #e2e8f0);
  margin: 0 0 0.35rem;
  line-height: 1;
  letter-spacing: -0.02em;
`

const PageSub = styled.p`
  font-size: 0.84rem;
  color: var(--text-muted, #64748b);
  margin: 0;
`

const HeadRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const RefreshBtn = styled.button`
  padding: 0.6rem 1.2rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 10px;
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.2s;

  &:hover {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg {
    width: 16px;
    height: 16px;
    ${({ $loading }) => $loading && `animation: ${spin} 1s linear infinite;`}
  }
`

/* ── Stats Grid ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: 18px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.08}s;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  }

  &:hover {
    border-color: rgba(59, 130, 246, 0.2);
    box-shadow: 0 8px 32px rgba(59, 130, 246, 0.08);
    transform: translateY(-2px);
  }
`

const StatValue = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 0.35rem;
  line-height: 1;
`

const StatLabel = styled.div`
  font-size: 0.78rem;
  color: var(--text-muted, #64748b);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

/* ── Columns Container ── */
const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`

/* ── Column Card ── */
const ColumnCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: 20px;
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
  }
`

const ColumnHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.08);
  background: rgba(255, 255, 255, 0.02);
`

const ColumnTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  margin: 0 0 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 20px;
    height: 20px;
  }
`

const ColumnDesc = styled.p`
  font-size: 0.8rem;
  color: var(--text-muted, #64748b);
  margin: 0;
`

const ColumnBody = styled.div`
  padding: 1.5rem;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(59, 130, 246, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(59, 130, 246, 0.5);
    }
  }
`

const UserItem = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(59, 130, 246, 0.08);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.2s;

  &:hover {
    border-color: rgba(59, 130, 246, 0.2);
    background: rgba(59, 130, 246, 0.05);
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const UserHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
`

const UserAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${({ $bgImage }) =>
    $bgImage
      ? `url(${$bgImage}) center/cover`
      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(30, 64, 175, 0.15))'};
  border: 1px solid rgba(59, 130, 246, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 800;
  color: #3b82f6;
  text-transform: uppercase;
  flex-shrink: 0;
`

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const Username = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const UserStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
`

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;

  svg {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }
`

const UserActions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const ActionBtn = styled.button`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 1px solid transparent;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;

  ${({ $variant }) => {
    if ($variant === 'send') {
      return css`
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border-color: rgba(34, 197, 94, 0.2);

        &:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.18);
          border-color: rgba(34, 197, 94, 0.4);
        }
      `
    }
    if ($variant === 'delete') {
      return css`
        background: rgba(239, 68, 68, 0.1);
        color: #f87171;
        border-color: rgba(239, 68, 68, 0.2);

        &:hover:not(:disabled) {
          background: rgba(239, 68, 68, 0.18);
          border-color: rgba(239, 68, 68, 0.4);
        }
      `
    }
  }}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  svg {
    width: 12px;
    height: 12px;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-muted, #64748b);
  font-size: 0.875rem;
`

/* ── Modal Styles ── */
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: ${fadeUp} 0.2s ease both;
  backdrop-filter: blur(3px);
  overflow: hidden;
`

const ModalContent = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 20px;
  padding: 2rem;
  max-width: 420px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: ${dropIn} 0.25s ease both;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const ModalIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
  font-size: 1.5rem;
`

const ModalTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  margin: 0;
  line-height: 1.3;
`

const ModalDescription = styled.div`
  color: var(--text-muted, #64748b);
  font-size: 0.875rem;
  line-height: 1.5;
`

const ModalActions = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
`

const ModalBtn = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  ${({ $variant }) => {
    if ($variant === 'danger') {
      return css`
        background: #f87171;
        color: white;
        border-color: #f87171;

        &:hover:not(:disabled) {
          background: #ef4444;
          box-shadow: 0 8px 16px rgba(239, 68, 68, 0.3);
          transform: translateY(-1px);
        }
      `
    }
    return css`
      background: rgba(59, 130, 246, 0.08);
      color: #3b82f6;
      border-color: rgba(59, 130, 246, 0.2);

      &:hover:not(:disabled) {
        background: rgba(59, 130, 246, 0.15);
        border-color: rgba(59, 130, 246, 0.4);
        transform: translateY(-1px);
      }
    `
  }}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`

const SpinLoader = styled(Loader)`
  animation: ${spin} 1s linear infinite;
`

/* ── MAIN COMPONENT ── */
const AdminUnusedUsers = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [modal, setModal] = useState({ open: false, type: null, userId: null, userName: null })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchUnusedUsers()
  }, [])

  const fetchUnusedUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/unused-users`, {
        credentials: 'include',
      })
      const result = await res.json()
      if (result.success) {
        setData(result.data)
      } else {
        toast.error(result.message || 'Failed to load unused users')
      }
    } catch {
      toast.error('Failed to load unused users')
    } finally {
      setLoading(false)
    }
  }

  const handleSendWarning = (userId, userName) => {
    setModal({ open: true, type: 'send-warning', userId, userName })
  }

  const handleConfirmSendWarning = async () => {
    const { userId } = modal
    setSending(userId)
    try {
      const res = await fetch(`${API_URL}/admin/unused-users/${userId}/send-warning`, {
        method: 'POST',
        credentials: 'include',
      })
      const result = await res.json()
      if (result.success) {
        toast.success('Warning email sent successfully')
        setModal({ open: false, type: null, userId: null, userName: null })
        fetchUnusedUsers()
      } else {
        toast.error(result.message || 'Failed to send warning email')
      }
    } catch {
      toast.error('Failed to send warning email')
    } finally {
      setSending(null)
    }
  }

  const handleDelete = (userId, userName) => {
    setModal({ open: true, type: 'delete', userId, userName })
  }

  const handleConfirmDelete = async () => {
    const { userId } = modal
    setDeleting(userId)
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const result = await res.json()
      if (result.success) {
        toast.success('User deleted successfully')
        setModal({ open: false, type: null, userId: null, userName: null })
        fetchUnusedUsers()
      } else {
        toast.error(result.message || 'Failed to delete user')
      }
    } catch {
      toast.error('Failed to delete user')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <Page>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '5rem 2rem', color: 'var(--text-muted, #64748b)' }}>
          <SpinLoader size={20} />
          Loading unused users…
        </div>
      </Page>
    )
  }

  const { warningNotSent = [], warningNotActivated = [], stats = {} } = data || {}

  return (
    <Page>
      {/* Header */}
      <PageHead>
        <HeadLeft>
          <IconBox>
            <AlertTriangle size={22} />
          </IconBox>
          <div>
            <PageTitle>Unused Users</PageTitle>
            <PageSub>Manage inactive accounts eligible for deletion</PageSub>
          </div>
        </HeadLeft>
        <HeadRight>
          <RefreshBtn onClick={fetchUnusedUsers} $loading={loading}>
            <RefreshCw />
            Refresh
          </RefreshBtn>
        </HeadRight>
      </PageHead>

      {/* Stats */}
      {stats && (
        <StatsGrid>
          <StatCard $i={0}>
            <StatValue>{stats.totalUnused || 0}</StatValue>
            <StatLabel>Total Unused</StatLabel>
          </StatCard>
          <StatCard $i={1}>
            <StatValue>{stats.pendingWarning || 0}</StatValue>
            <StatLabel>Pending Warning</StatLabel>
          </StatCard>
          <StatCard $i={2}>
            <StatValue>{stats.pendingDeletion || 0}</StatValue>
            <StatLabel>Pending Deletion</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      {/* Two Column Layout */}
      <ColumnsWrapper>
        {/* Column 1: Pending Warning */}
        <ColumnCard>
          <ColumnHeader>
            <ColumnTitle>
              <Clock size={20} style={{ color: '#fbbf24' }} />
              Pending Warning
            </ColumnTitle>
            <ColumnDesc>{warningNotSent.length} users to notify</ColumnDesc>
          </ColumnHeader>
          <ColumnBody>
            {warningNotSent.length === 0 ? (
              <EmptyState>No users pending warning</EmptyState>
            ) : (
              warningNotSent.map(user => (
                <UserItem key={user._id}>
                  <UserHeader>
                    <UserAvatar $bgImage={user.profileImage}>
                      {!user.profileImage && (user.username?.[0] || '?')}
                    </UserAvatar>
                    <UserInfo>
                      <Username>@{user.username}</Username>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserHeader>
                  <UserStats>
                    <StatItem>
                      <HardDrive />
                      {user.vaultItems} items
                    </StatItem>
                    <StatItem>
                      <Calendar />
                      {Math.floor((new Date() - new Date(user.lastActivity)) / (1000 * 60 * 60 * 24))}d inactive
                    </StatItem>
                  </UserStats>
                  <UserActions>
                    <ActionBtn
                      $variant="send"
                      onClick={() => handleSendWarning(user._id, user.username)}
                      disabled={sending === user._id}
                    >
                      {sending === user._id ? <SpinLoader size={12} /> : <Mail size={12} />}
                      {sending === user._id ? 'Sending...' : 'Send Warning'}
                    </ActionBtn>
                  </UserActions>
                </UserItem>
              ))
            )}
          </ColumnBody>
        </ColumnCard>

        {/* Column 2: Pending Deletion */}
        <ColumnCard>
          <ColumnHeader>
            <ColumnTitle>
              <AlertTriangle size={20} style={{ color: '#f87171' }} />
              Pending Deletion
            </ColumnTitle>
            <ColumnDesc>{warningNotActivated.length} users to delete</ColumnDesc>
          </ColumnHeader>
          <ColumnBody>
            {warningNotActivated.length === 0 ? (
              <EmptyState>No users pending deletion</EmptyState>
            ) : (
              warningNotActivated.map(user => (
                <UserItem key={user._id}>
                  <UserHeader>
                    <UserAvatar $bgImage={user.profileImage}>
                      {!user.profileImage && (user.username?.[0] || '?')}
                    </UserAvatar>
                    <UserInfo>
                      <Username>@{user.username}</Username>
                      <UserEmail>{user.email}</UserEmail>
                    </UserInfo>
                  </UserHeader>
                  <UserStats>
                    <StatItem>
                      <Mail />
                      Email sent{' '}
                      {Math.floor(
                        (new Date() - new Date(user.deletionWarning.emailSentAt)) /
                        (1000 * 60 * 60 * 24)
                      )}
                      d ago
                    </StatItem>
                    <StatItem>
                      <Calendar />
                      Delete on{' '}
                      {new Date(user.deletionWarning.deletionScheduledFor).toLocaleDateString()}
                    </StatItem>
                  </UserStats>
                  <UserActions>
                    <ActionBtn
                      $variant="delete"
                      onClick={() => handleDelete(user._id, user.username)}
                      disabled={deleting === user._id}
                    >
                      {deleting === user._id ? <SpinLoader size={12} /> : <Trash2 size={12} />}
                      {deleting === user._id ? 'Deleting...' : 'Delete Now'}
                    </ActionBtn>
                  </UserActions>
                </UserItem>
              ))
            )}
          </ColumnBody>
        </ColumnCard>
      </ColumnsWrapper>

      {/* Confirmation Modal */}
      {modal.open && (
        <ModalOverlay onClick={() => setModal({ open: false, type: null, userId: null, userName: null })}>
          <ModalContent onClick={e => e.stopPropagation()}>
            {modal.type === 'send-warning' ? (
              <>
                <ModalHeader>
                  <ModalIcon>📧</ModalIcon>
                  <ModalTitle>Send Warning Email?</ModalTitle>
                </ModalHeader>
                <ModalDescription>
                  Send a 7-day warning email to <strong>@{modal.userName}</strong>. If they don't become active,
                  their account will be deleted automatically.
                </ModalDescription>
                <ModalActions>
                  <ModalBtn onClick={() => setModal({ open: false, type: null, userId: null, userName: null })}>
                    Cancel
                  </ModalBtn>
                  <ModalBtn $variant="danger" onClick={handleConfirmSendWarning} disabled={sending === modal.userId}>
                    {sending === modal.userId ? <Loader size={16} /> : <Mail size={16} />}
                    {sending === modal.userId ? 'Sending...' : 'Send Warning'}
                  </ModalBtn>
                </ModalActions>
              </>
            ) : (
              <>
                <ModalHeader>
                  <ModalIcon>🗑️</ModalIcon>
                  <ModalTitle>Delete User Account?</ModalTitle>
                </ModalHeader>
                <ModalDescription>
                  This will permanently delete <strong>@{modal.userName}</strong> and all their data. This action
                  cannot be undone. They were warned 7 days ago and didn't become active.
                </ModalDescription>
                <ModalActions>
                  <ModalBtn onClick={() => setModal({ open: false, type: null, userId: null, userName: null })}>
                    Cancel
                  </ModalBtn>
                  <ModalBtn $variant="danger" onClick={handleConfirmDelete} disabled={deleting === modal.userId}>
                    {deleting === modal.userId ? <Loader size={16} /> : <Trash2 size={16} />}
                    {deleting === modal.userId ? 'Deleting...' : 'Delete Now'}
                  </ModalBtn>
                </ModalActions>
              </>
            )}
          </ModalContent>
        </ModalOverlay>
      )}
    </Page>
  )
}

export default AdminUnusedUsers
