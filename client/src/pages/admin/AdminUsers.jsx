import { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Trash2, Loader, Users, Search, X, ExternalLink, Shield, UserCheck, Mail, Calendar } from 'lucide-react'
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

/* ── Shell ── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  width: 100%;
  max-width: 1400px;
`

/* ── Page Header ── */
const PageHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex; align-items: center; gap: 1rem;
`

const IconBox = styled.div`
  width: 48px; height: 48px;
  background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(30,64,175,0.1));
  border: 1px solid rgba(59,130,246,0.3);
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  color: #3b82f6;
  box-shadow: 0 0 20px rgba(59,130,246,0.1);
`

const TitleGroup = styled.div``

const PageTitle = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: 1.75rem; font-weight: 800;
  color: var(--text-primary, #e2e8f0);
  margin: 0 0 0.2rem; line-height: 1; letter-spacing: -0.02em;
`

const PageSub = styled.p`
  font-size: 0.8rem; color: var(--text-muted, #64748b); margin: 0;
`

/* ── Search ── */
const SearchWrap = styled.div`
  position: relative; width: 260px;

  svg.s-icon {
    position: absolute; left: 0.85rem; top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted, #64748b);
    width: 14px; height: 14px;
    pointer-events: none;
  }
`

const SearchInput = styled.input`
  width: 100%;
  padding: 0.6rem 2.2rem 0.6rem 2.2rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(59,130,246,0.1);
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  color: var(--text-primary, #e2e8f0);
  transition: all 0.2s;
  box-sizing: border-box;

  &::placeholder { color: var(--text-muted, #64748b); }
  &:focus {
    outline: none;
    border-color: rgba(59,130,246,0.4);
    background: rgba(59,130,246,0.04);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.08);
  }
`

const ClearBtn = styled.button`
  position: absolute; right: 0.65rem; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  color: var(--text-muted, #64748b);
  cursor: pointer; padding: 2px;
  display: flex; align-items: center;
  &:hover { color: var(--text-primary, #e2e8f0); }
  svg { width: 13px; height: 13px; }
`

/* ── Stats ── */
const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem; margin-bottom: 2rem;

  @media (max-width: 768px) { grid-template-columns: repeat(2, 1fr); }
`

const StatCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.08);
  border-radius: 16px;
  padding: 1.25rem 1.5rem;
  position: relative; overflow: hidden;
  transition: all 0.25s;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => $i * 0.07}s;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.35), transparent);
  }

  &:hover {
    border-color: rgba(59,130,246,0.2);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(59,130,246,0.06);
  }
`

const StatValue = styled.div`
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: #3b82f6; line-height: 1; margin-bottom: 0.3rem;
`

const StatLabel = styled.div`
  font-size: 0.72rem; color: var(--text-muted, #64748b);
  font-weight: 600; text-transform: uppercase; letter-spacing: 0.07em;
`

/* ── User Cards Grid ── */
const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
`

/* ── User Card ── */
const UCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.08);
  border-radius: 20px;
  padding: 1.4rem;
  transition: all 0.25s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => Math.min($i * 0.05, 0.3)}s;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
  }

  &:hover {
    border-color: rgba(59,130,246,0.2);
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(0,0,0,0.25), 0 0 0 1px rgba(59,130,246,0.08);
  }
`

const UserTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.85rem;
`

const Avatar = styled.div`
  width: 44px; height: 44px;
  border-radius: 13px;
  background: linear-gradient(135deg, rgba(59,130,246,0.2), rgba(30,64,175,0.15));
  border: 1px solid rgba(59,130,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'Syne', sans-serif;
  font-size: 1.1rem; font-weight: 800;
  color: #3b82f6;
  text-transform: uppercase;
  flex-shrink: 0;
`

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const Username = styled.div`
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`

const UserEmail = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  display: flex; align-items: center; gap: 0.3rem;
  margin-top: 0.2rem;
  svg { width: 11px; height: 11px; flex-shrink: 0; }
`

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`

const JoinDate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.73rem;
  color: var(--text-muted, #64748b);
  svg { width: 12px; height: 12px; }
`

/* ── Role Select ── */
const RoleSelect = styled.select`
  padding: 0.32rem 1.5rem 0.32rem 0.55rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(59,130,246,0.12);
  border-radius: 8px;
  font-size: 0.75rem;
  font-family: 'DM Sans', sans-serif;
  font-weight: 600;
  cursor: pointer;
  color: var(--text-primary, #e2e8f0);
  transition: all 0.18s;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.4rem center;
  background-color: rgba(255,255,255,0.04);

  &:focus {
    outline: none;
    border-color: rgba(59,130,246,0.35);
    box-shadow: 0 0 0 2px rgba(59,130,246,0.08);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
  option { background: #161b27; }
`

/* ── Card Actions ── */
const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255,255,255,0.05);
`

const ActionBtn = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.48rem 0.65rem;
  border-radius: 9px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.18s;
  border: 1px solid transparent;
  text-decoration: none;

  svg { width: 13px; height: 13px; flex-shrink: 0; }

  ${({ $variant }) => {
    if ($variant === 'view') return css`
      background: rgba(59,130,246,0.07);
      color: #3b82f6;
      border-color: rgba(59,130,246,0.15);
      &:hover { background: rgba(59,130,246,0.14); border-color: rgba(59,130,246,0.3); transform: translateY(-1px); }
    `
    if ($variant === 'delete') return css`
      background: rgba(239,68,68,0.07);
      color: #f87171;
      border-color: rgba(239,68,68,0.15);
      flex: 0 0 auto;
      padding: 0.48rem 0.65rem;
      &:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); transform: translateY(-1px); }
    `
  }}

  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
`

/* ── Role badge ── */
const RoleBadge = styled.span`
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.22rem 0.55rem;
  border-radius: 7px;
  font-size: 0.67rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  background: ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin'
      ? 'rgba(251,191,36,0.12)'
      : 'rgba(100,116,139,0.12)'};
  color: ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin' ? '#fbbf24' : '#94a3b8'};
  border: 1px solid ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin'
      ? 'rgba(251,191,36,0.22)'
      : 'rgba(100,116,139,0.2)'};
  svg { width: 10px; height: 10px; }
`

/* ── Misc ── */
const LoadingWrap = styled.div`
  display: flex; align-items: center; justify-content: center;
  gap: 0.75rem; padding: 5rem 2rem;
  color: var(--text-muted, #64748b); font-size: 0.875rem;
  svg { animation: ${spin} 1s linear infinite; color: #3b82f6; }
`

const EmptyWrap = styled.div`
  padding: 4rem 2rem; text-align: center;
  color: var(--text-muted, #64748b); font-size: 0.875rem;
  grid-column: 1 / -1;
`

const ResultCount = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  margin-bottom: 1rem;
  padding-left: 0.25rem;
  span { color: #3b82f6; font-weight: 600; }
`

const BASE_URL = 'http://localhost:5000'

/* ══════════════════════════════════════════════ */
const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [search, setSearch] = useState('')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/users`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) { setUsers(data.users); setStats(data.stats) }
      else toast.error(data.message)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  const handleUpdateRole = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) { toast.success('Role updated'); fetchUsers() }
      else toast.error(data.message)
    } catch { toast.error('Failed to update role') }
    finally { setUpdating(null) }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setDeleting(userId)
    try {
      const res = await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (data.success) { toast.success('User deleted'); fetchUsers() }
      else toast.error(data.message)
    } catch { toast.error('Failed to delete user') }
    finally { setDeleting(null) }
  }

  // ✅ Safe filtering – handle undefined username/email
  const filtered = users.filter(u => {
    const username = u?.username?.toLowerCase() || ''
    const email = u?.email?.toLowerCase() || ''
    const searchLower = search.toLowerCase()
    return username.includes(searchLower) || email.includes(searchLower)
  })

  if (loading) return <LoadingWrap><Loader size={20} /> Loading users…</LoadingWrap>

  return (
    <Page>
      {/* ── Header ── */}
      <PageHead>
        <HeadLeft>
          <IconBox><Users size={20} /></IconBox>
          <TitleGroup>
            <PageTitle>Users</PageTitle>
            <PageSub>Manage accounts and permissions</PageSub>
          </TitleGroup>
        </HeadLeft>
        <SearchWrap>
          <Search className="s-icon" />
          <SearchInput
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <ClearBtn onClick={() => setSearch('')}><X /></ClearBtn>}
        </SearchWrap>
      </PageHead>

      {/* ── Stats ── */}
      {stats && (
        <StatsRow>
          {[
            { label: 'Total Users', value: stats.total },
            { label: 'Admins', value: stats.admins },
            { label: 'Regular Users', value: stats.regularUsers },
            { label: 'Active Today', value: stats.activeToday },
          ].map((s, i) => (
            <StatCard key={s.label} $i={i}>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsRow>
      )}

      {search && (
        <ResultCount>
          Showing <span>{filtered.length}</span> of {users.length} users
        </ResultCount>
      )}

      {/* ── Cards Grid ── */}
      <CardsGrid>
        {filtered.length > 0 ? (
          filtered.map((user, i) => (
            <UCard key={user._id} $i={i}>
              {/* Top: Avatar + Name + Email */}
              <UserTop>
                <Avatar>{user.username?.[0] || '?'}</Avatar>
                <UserInfo>
                  <Username>@{user.username || 'unknown'}</Username>
                  <UserEmail>
                    <Mail />
                    {user.email || 'no email'}
                  </UserEmail>
                </UserInfo>
              </UserTop>

              {/* Meta: Joined date + Role badge */}
              <UserMeta>
                <JoinDate>
                  <Calendar />
                  Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'unknown'}
                </JoinDate>
                <RoleBadge $role={user.role}>
                  {(user.role === 'admin' || user.role === 'superadmin') && <Shield />}
                  {user.role}
                </RoleBadge>
              </UserMeta>

              {/* Role select */}
              <RoleSelect
                value={user.role}
                onChange={e => handleUpdateRole(user._id, e.target.value)}
                disabled={updating === user._id}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </RoleSelect>

              {/* Actions */}
              <CardActions>
                <ActionBtn
                  as="a"
                  href={`/u/${user.username}`}
                  rel="noopener noreferrer"
                  $variant="view"
                >
                  <ExternalLink /> View Profile
                </ActionBtn>
                <ActionBtn
                  $variant="delete"
                  onClick={() => handleDelete(user._id)}
                  disabled={deleting === user._id}
                  title="Delete user"
                >
                  {deleting === user._id
                    ? <Loader size={13} style={{ animation: `${spin} 1s linear infinite` }} />
                    : <Trash2 />
                  }
                </ActionBtn>
              </CardActions>
            </UCard>
          ))
        ) : (
          <EmptyWrap>
            {search ? `No users matching "${search}"` : 'No users found'}
          </EmptyWrap>
        )}
      </CardsGrid>
    </Page>
  )
}

export default AdminUsers