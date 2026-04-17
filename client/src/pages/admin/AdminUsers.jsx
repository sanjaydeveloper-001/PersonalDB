import { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  Trash2, Loader, Users, Search, X, ExternalLink,
  Shield, Mail, Calendar, LayoutGrid, List,
  ChevronDown, UserCircle2, Crown
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

/* ── Shell ── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  width: 100%;
  max-width: 1400px;
`

/* ── Page Header ── */
const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex; align-items: center; gap: 1.25rem;
`

const IconBox = styled.div`
  width: 54px; height: 54px;
  background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(30,64,175,0.12));
  border: 1px solid rgba(59,130,246,0.3);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: #3b82f6;
  box-shadow: 0 0 22px rgba(59,130,246,0.14);
`

const TitleGroup = styled.div``

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: var(--text-primary, #e2e8f0);
  margin: 0 0 0.35rem; line-height: 1; letter-spacing: -0.02em;
`

const PageSub = styled.p`
  font-size: 0.84rem; color: var(--text-muted, #64748b); margin: 0;
`

const HeadRight = styled.div`
  display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
`

/* ── View Toggle ── */
const ViewToggle = styled.div`
  display: flex;
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.1);
  border-radius: 10px;
  overflow: hidden;
`

const ViewBtn = styled.button`
  padding: 0.55rem 0.75rem;
  border: none;
  background: ${({ $active }) => $active ? 'rgba(59,130,246,0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? '#3b82f6' : 'var(--text-muted, #64748b)'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex; align-items: center;
  svg { width: 16px; height: 16px; }
  &:hover { color: #3b82f6; }
`

/* ── Search ── */
const SearchWrap = styled.div`
  position: relative; width: 240px;
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
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem; margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.08);
  border-radius: 18px;
  padding: 1.5rem;
  position: relative; overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.08}s;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent);
  }

  &:hover {
    border-color: rgba(59,130,246,0.2);
    box-shadow: 0 8px 32px rgba(59,130,246,0.08);
    transform: translateY(-2px);
  }
`

const StatValue = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 2.25rem; font-weight: 800;
  color: #3b82f6; margin-bottom: 0.35rem; line-height: 1;
`

const StatLabel = styled.div`
  font-size: 0.78rem; color: var(--text-muted, #64748b);
  font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
`

/* ── Shared Card wrapper ── */
const SCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.08);
  border-radius: 20px;
  overflow: visible;
  position: relative;
  animation: ${fadeUp} 0.4s ease both;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.4), transparent);
  }
`

/* ── TABLE VIEW ── */
const TableHead = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr 0.8fr 1.4fr 0.6fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid rgba(59,130,246,0.08);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted, #64748b);
  @media (max-width: 768px) { display: none; }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr 0.8fr 1.4fr 0.6fr;
  gap: 1rem;
  padding: 0.85rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  align-items: center;
  font-size: 0.875rem;
  transition: background 0.2s;
  &:last-child { border-bottom: none; }
  &:hover { background: rgba(59,130,246,0.03); }
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    border-bottom: 1px solid rgba(59,130,246,0.08);
  }
`

const UserNameCell = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
`

const SmallAvatar = styled.div`
  width: 36px; height: 36px;
  border-radius: 10px;
  background: ${({ $bgImage }) => $bgImage ? `url(${$bgImage}) center/cover` : 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(30,64,175,0.15))'};
  border: 1px solid rgba(59,130,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; font-weight: 800;
  color: #3b82f6;
  text-transform: uppercase;
  flex-shrink: 0;
`

const CellName = styled.div`
  font-weight: 700; color: var(--text-primary, #e2e8f0);
  font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
`

const CellEmail = styled.div`
  font-size: 0.73rem; color: var(--text-muted, #64748b); margin-top: 0.1rem;
`

const StatCell = styled.div`
  color: var(--text-muted, #64748b); font-size: 0.82rem;
`

const TableActions = styled.div`
  display: flex; gap: 0.4rem;
`

const IconBtn = styled.button`
  width: 32px; height: 32px;
  border: 1px solid ${({ $danger }) => $danger ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.15)'};
  background: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.06)'};
  color: ${({ $danger }) => $danger ? '#f87171' : '#3b82f6'};
  border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s;
  svg { width: 14px; height: 14px; }
  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.18)' : 'rgba(59,130,246,0.14)'};
    border-color: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.35)' : 'rgba(59,130,246,0.3)'};
    transform: translateY(-1px);
  }
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

/* ── GRID VIEW ── */
const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
`

const UCard = styled.div`
  background: rgba(255,255,255,0.025);
  border: 1px solid rgba(59,130,246,0.08);
  border-radius: 18px;
  padding: 1.4rem;
  transition: all 0.25s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => Math.min($i * 0.05, 0.3)}s;
  display: flex; flex-direction: column; gap: 1rem;
  position: relative; overflow: visible;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.2), transparent);
  }

  &:hover {
    border-color: rgba(59,130,246,0.22);
    transform: translateY(-3px);
    box-shadow: 0 12px 40px rgba(59,130,246,0.08);
  }
`

const UserTop = styled.div`
  display: flex; align-items: center; gap: 0.85rem;
`

const Avatar = styled.div`
  width: 44px; height: 44px;
  border-radius: 13px;
  background: ${({ $bgImage }) => $bgImage ? `url(${$bgImage}) center/cover` : 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(30,64,175,0.15))'};
  border: 1px solid rgba(59,130,246,0.2);
  display: flex; align-items: center; justify-content: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 1.1rem; font-weight: 800;
  color: #3b82f6;
  text-transform: uppercase;
  flex-shrink: 0;
  color: ${({ $bgImage }) => $bgImage ? 'transparent' : '#3b82f6'};
`

const UserInfo = styled.div`
  flex: 1; min-width: 0;
`

const Username = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`

const UserEmail = styled.div`
  font-size: 0.75rem; color: var(--text-muted, #64748b);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  display: flex; align-items: center; gap: 0.3rem; margin-top: 0.2rem;
  svg { width: 11px; height: 11px; flex-shrink: 0; }
`

const UserMeta = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;
`

const JoinDate = styled.div`
  display: flex; align-items: center; gap: 0.3rem;
  font-size: 0.73rem; color: var(--text-muted, #64748b);
  svg { width: 12px; height: 12px; }
`

/* ── Role badge ── */
const RoleBadge = styled.span`
  display: inline-flex; align-items: center; gap: 0.25rem;
  padding: 0.22rem 0.55rem;
  border-radius: 7px;
  font-size: 0.67rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.06em;
  background: ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin' ? 'rgba(251,191,36,0.12)' : 'rgba(100,116,139,0.12)'};
  color: ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin' ? '#fbbf24' : '#94a3b8'};
  border: 1px solid ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin' ? 'rgba(251,191,36,0.22)' : 'rgba(100,116,139,0.2)'};
  svg { width: 10px; height: 10px; }
`

/* ══════════════════════════════════
   CUSTOM ROLE SWITCHER STYLES
══════════════════════════════════ */
const RoleSwitcherWrap = styled.div`
  position: relative;
`

const RoleTrigger = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(59,130,246,0.15);
  border-radius: 11px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'DM Sans', sans-serif;
  color: var(--text-primary, #e2e8f0);

  &:hover {
    background: rgba(59,130,246,0.06);
    border-color: rgba(59,130,246,0.3);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`

const RoleIconWrap = styled.div`
  width: 28px; height: 28px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin'
      ? 'rgba(251,191,36,0.12)'
      : 'rgba(59,130,246,0.1)'};
  color: ${({ $role }) =>
    $role === 'admin' || $role === 'superadmin' ? '#fbbf24' : '#3b82f6'};
  svg { width: 14px; height: 14px; }
`

const RoleTriggerLabel = styled.div`
  flex: 1; text-align: left;
`

const RoleTriggerName = styled.div`
  font-size: 0.8rem; font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  line-height: 1.2;
`

const RoleTriggerDesc = styled.div`
  font-size: 0.68rem;
  color: var(--text-muted, #64748b);
  margin-top: 0.1rem;
`

const ChevronIcon = styled(ChevronDown)`
  width: 14px; height: 14px;
  color: var(--text-muted, #64748b);
  transition: transform 0.2s;
  flex-shrink: 0;
  transform: ${({ $open }) => $open ? 'rotate(180deg)' : 'rotate(0deg)'};
`

const RoleDropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 13px;
  overflow: hidden;
  z-index: 100;
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  animation: ${dropIn} 0.18s ease both;
`

const RoleOption = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.75rem 0.9rem;
  background: ${({ $active }) => $active ? '#f3f4f6' : 'transparent'};
  border: none;
  cursor: pointer;
  transition: background 0.15s;
  font-family: 'DM Sans', sans-serif;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
  color: #1f2937;

  &:last-child { border-bottom: none; }
  &:hover { background: #f9fafb; }
`

const OptionIconWrap = styled.div`
  width: 30px; height: 30px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: ${({ $color }) => $color === 'gold' ? 'rgba(251,191,36,0.12)' : 'rgba(59,130,246,0.1)'};
  color: ${({ $color }) => $color === 'gold' ? '#fbbf24' : '#3b82f6'};
  svg { width: 15px; height: 15px; }
`

const OptionText = styled.div`
  flex: 1;
`

const OptionName = styled.div`
  font-size: 0.82rem; font-weight: 700;
  color: #1f2937;
`

const OptionDesc = styled.div`
  font-size: 0.7rem; color: #9ca3af; margin-top: 0.1rem;
`

const ActiveDot = styled.div`
  width: 7px; height: 7px;
  border-radius: 50%;
  background: #3b82f6;
  flex-shrink: 0;
  box-shadow: 0 0 6px rgba(59,130,246,0.6);
`

/* ── Card Actions ── */
const CardActions = styled.div`
  display: flex; gap: 0.5rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255,255,255,0.05);
`

const ActionBtn = styled.button`
  flex: 1;
  display: flex; align-items: center; justify-content: center; gap: 0.35rem;
  padding: 0.48rem 0.65rem;
  border-radius: 9px;
  font-size: 0.75rem; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: all 0.18s;
  border: 1px solid transparent; text-decoration: none;
  svg { width: 13px; height: 13px; flex-shrink: 0; }

  ${({ $variant }) => {
    if ($variant === 'view') return css`
      background: rgba(59,130,246,0.07); color: #3b82f6;
      border-color: rgba(59,130,246,0.15);
      &:hover { background: rgba(59,130,246,0.14); border-color: rgba(59,130,246,0.3); transform: translateY(-1px); }
    `
    if ($variant === 'delete') return css`
      background: rgba(239,68,68,0.07); color: #f87171;
      border-color: rgba(239,68,68,0.15);
      flex: 0 0 auto; padding: 0.48rem 0.65rem;
      &:hover { background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); transform: translateY(-1px); }
    `
  }}
  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none !important; }
`

/* ── Misc ── */
const SpinLoader = styled(Loader)`
  animation: ${spin} 1s linear infinite;
`

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
  font-size: 0.75rem; color: var(--text-muted, #64748b);
  margin-bottom: 1rem; padding-left: 0.25rem;
  span { color: #3b82f6; font-weight: 600; }
`

/* ══════════════════════════════════
   ROLE OPTIONS CONFIG
══════════════════════════════════ */
const ROLES = [
  { value: 'user',  label: 'User',  desc: 'Standard access',  icon: <UserCircle2 />, color: 'blue' },
  { value: 'admin', label: 'Admin', desc: 'Full permissions',  icon: <Crown />,       color: 'gold' },
]

/* ── Custom Role Switcher Component ── */
const RoleSwitcher = ({ value, onChange, disabled }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = ROLES.find(r => r.value === value) || ROLES[0]

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <RoleSwitcherWrap ref={ref}>
      <RoleTrigger
        type="button"
        onClick={() => !disabled && setOpen(o => !o)}
        disabled={disabled}
      >
        <RoleIconWrap $role={value}>
          {current.icon}
        </RoleIconWrap>
        <RoleTriggerLabel>
          <RoleTriggerName>{current.label}</RoleTriggerName>
          <RoleTriggerDesc>{current.desc}</RoleTriggerDesc>
        </RoleTriggerLabel>
        <ChevronIcon $open={open} />
      </RoleTrigger>

      {open && (
        <RoleDropdown>
          {ROLES.map(role => (
            <RoleOption
              key={role.value}
              $active={role.value === value}
              onClick={() => { onChange(role.value); setOpen(false) }}
            >
              <OptionIconWrap $color={role.color}>
                {role.icon}
              </OptionIconWrap>
              <OptionText>
                <OptionName>{role.label}</OptionName>
                <OptionDesc>{role.desc}</OptionDesc>
              </OptionText>
              {role.value === value && <ActiveDot />}
            </RoleOption>
          ))}
        </RoleDropdown>
      )}
    </RoleSwitcherWrap>
  )
}

/* ══════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════ */
const AdminUsers = () => {
  const [users, setUsers]   = useState([])
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [search, setSearch] = useState('')
  const [view, setView]     = useState('grid')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res  = await fetch(`${API_URL}/admin/users`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) { setUsers(data.users); setStats(data.stats) }
      else toast.error(data.message)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  const handleUpdateRole = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const res  = await fetch(`${API_URL}/admin/users/${userId}/role`, {
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
      const res  = await fetch(`${API_URL}/admin/users/${userId}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (data.success) { toast.success('User deleted'); fetchUsers() }
      else toast.error(data.message)
    } catch { toast.error('Failed to delete user') }
    finally { setDeleting(null) }
  }

  const filtered = users.filter(u => {
    const username = u?.username?.toLowerCase() || ''
    const email    = u?.email?.toLowerCase()    || ''
    const s        = search.toLowerCase()
    return username.includes(s) || email.includes(s)
  })

  if (loading) return <LoadingWrap><Loader size={20} /> Loading users…</LoadingWrap>

  return (
    <Page>
      {/* ── Header ── */}
      <PageHead>
        <HeadLeft>
          <IconBox><Users size={22} /></IconBox>
          <TitleGroup>
            <PageTitle>Users</PageTitle>
            <PageSub>Manage accounts and permissions</PageSub>
          </TitleGroup>
        </HeadLeft>
        <HeadRight>
          <SearchWrap>
            <Search className="s-icon" />
            <SearchInput
              placeholder="Search by name or email…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <ClearBtn onClick={() => setSearch('')}><X /></ClearBtn>}
          </SearchWrap>
          <ViewToggle>
            <ViewBtn $active={view === 'grid'}  onClick={() => setView('grid')}><LayoutGrid /></ViewBtn>
            <ViewBtn $active={view === 'table'} onClick={() => setView('table')}><List /></ViewBtn>
          </ViewToggle>
        </HeadRight>
      </PageHead>

      {/* ── Stats ── */}
      {stats && (
        <StatsGrid>
          {[
            { label: 'Total Users',   value: stats.total        },
            { label: 'Admins',        value: stats.admins       },
            { label: 'Regular Users', value: stats.regularUsers },
            { label: 'Active Today',  value: stats.activeToday  },
          ].map((s, i) => (
            <StatCard key={s.label} $i={i}>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      )}

      {search && (
        <ResultCount>
          Showing <span>{filtered.length}</span> of {users.length} users
        </ResultCount>
      )}

      {/* ── Content ── */}
      <SCard>
        {view === 'table' ? (
          <>
            <TableHead>
              <div>User</div>
              <div>Joined</div>
              <div>Role</div>
              <div>Change Role</div>
              <div>Actions</div>
            </TableHead>
            {filtered.length === 0
              ? <EmptyWrap>{search ? `No users matching "${search}"` : 'No users found'}</EmptyWrap>
              : filtered.map((user) => (
                <TableRow key={user._id}>
                  <UserNameCell>
                    <SmallAvatar $bgImage={user.profileImage}>{!user.profileImage && (user.username?.[0] || '?')}</SmallAvatar>
                    <div>
                      <CellName>@{user.username || 'unknown'}</CellName>
                      <CellEmail>{user.email || 'no email'}</CellEmail>
                    </div>
                  </UserNameCell>
                  <StatCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'unknown'}
                  </StatCell>
                  <StatCell>
                    <RoleBadge $role={user.role}>
                      {(user.role === 'admin' || user.role === 'superadmin') && <Shield size={10} />}
                      {user.role}
                    </RoleBadge>
                  </StatCell>
                  <div>
                    <RoleSwitcher
                      value={user.role}
                      onChange={(newRole) => handleUpdateRole(user._id, newRole)}
                      disabled={updating === user._id}
                    />
                  </div>
                  <TableActions>
                    <IconBtn as="a" href={`/u/${user.username}`} rel="noopener noreferrer" title="View profile">
                      <ExternalLink />
                    </IconBtn>
                    <IconBtn $danger onClick={() => handleDelete(user._id)} disabled={deleting === user._id} title="Delete user">
                      {deleting === user._id ? <SpinLoader size={14} /> : <Trash2 />}
                    </IconBtn>
                  </TableActions>
                </TableRow>
              ))
            }
          </>
        ) : (
          <GridView>
            {filtered.length === 0
              ? <EmptyWrap>{search ? `No users matching "${search}"` : 'No users found'}</EmptyWrap>
              : filtered.map((user, i) => (
                <UCard key={user._id} $i={i}>
                  <UserTop>
                    <Avatar $bgImage={user.profileImage}>{!user.profileImage && (user.username?.[0] || '?')}</Avatar>
                    <UserInfo>
                      <Username>@{user.username || 'unknown'}</Username>
                      <UserEmail>
                        <Mail />
                        {user.email || 'no email'}
                      </UserEmail>
                    </UserInfo>
                  </UserTop>

                  <UserMeta>
                    <JoinDate>
                      <Calendar />
                      Joined {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'unknown'}
                    </JoinDate>
                    <RoleBadge $role={user.role}>
                      {(user.role === 'admin' || user.role === 'superadmin') && <Shield size={10} />}
                      {user.role}
                    </RoleBadge>
                  </UserMeta>

                  <RoleSwitcher
                    value={user.role}
                    onChange={(newRole) => handleUpdateRole(user._id, newRole)}
                    disabled={updating === user._id}
                  />

                  <CardActions>
                    <ActionBtn as="a" href={`/u/${user.username}`} rel="noopener noreferrer" $variant="view">
                      <ExternalLink /> View Profile
                    </ActionBtn>
                    <ActionBtn
                      $variant="delete"
                      onClick={() => handleDelete(user._id)}
                      disabled={deleting === user._id}
                      title="Delete user"
                    >
                      {deleting === user._id ? <SpinLoader size={13} /> : <Trash2 />}
                    </ActionBtn>
                  </CardActions>
                </UCard>
              ))
            }
          </GridView>
        )}
      </SCard>
    </Page>
  )
}

export default AdminUsers