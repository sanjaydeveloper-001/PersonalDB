import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {
  Lock, Trash2, Globe, Settings, User, GraduationCap, Briefcase,
  FolderKanban, Code, Award, Heart, ChevronDown,
  Database, ChevronLeft, ChevronRight, Terminal, Key, BarChart3, FileCode2, X
} from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

// ── Container ──────────────────────────────────────────────────────────────
const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
  border-right: 1px solid rgba(59, 130, 246, 0.1);
  transition: width 0.3s ease;
  width: 270px;
  overflow: hidden;
  flex-shrink: 0;

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    height: 100vh;
    width: 270px;
    transform: translateX(${props => props.$isMobileOpen ? '0' : '-100%'});
    transition: transform 0.3s ease;
    box-shadow: ${props => props.$isMobileOpen ? '0 10px 40px rgba(0,0,0,0.2)' : 'none'};
  }
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  flex-shrink: 0;

  @media (max-width: 768px) {
    justify-content: space-between;
  }
`

const LogoWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
`

const LogoMark = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  svg {
    width: 15px;
    height: 15px;
    color: white;
  }
`

const LogoText = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s ease;
`

const CloseBtn = styled.button`
  display: none;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  flex-shrink: 0;
  transition: background 0.15s;

  &:hover {
    background: #eff6ff;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    display: flex;
  }
`

const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  padding: 0.875rem 0.625rem;
  display: flex;
  flex-direction: column;
  gap: 2px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #bfdbfe;
    border-radius: 2px;
  }
`

const Divider = styled.div`
  height: 1px;
  background: rgba(59, 130, 246, 0.08);
  margin: 0.5rem 0.25rem;
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  width: 100%;
  padding: 0.55rem 0.75rem;
  border: none;
  background: ${props => props.$open ? '#eff6ff' : 'transparent'};
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
  text-align: left;

  &:hover {
    background: #eff6ff;
  }
`

const TriggerIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${props => props.$open ? '#3b82f6' : '#64748b'};
  transition: color 0.15s;

  ${Trigger}:hover & {
    color: #3b82f6;
  }

  svg {
    width: 17px;
    height: 17px;
  }
`

const TriggerLabel = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${props => props.$open ? '#1e40af' : '#334155'};
  letter-spacing: 0.01em;
  white-space: nowrap;
  opacity: 1;
  transition: opacity 0.2s ease, color 0.15s;

  ${Trigger}:hover & {
    color: #1e40af;
  }
`

const Chevron = styled(ChevronDown)`
  width: 14px !important;
  height: 14px !important;
  flex-shrink: 0;
  color: ${props => props.$open ? '#3b82f6' : '#94a3b8'};
  transform: ${props => props.$open ? 'rotate(180deg)' : 'rotate(0deg)'};
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s;
  opacity: 1;
`

const SubMenu = styled.div`
  overflow: hidden;
  max-height: ${props => props.$open ? `${props.$height}px` : '0'};
  transition: max-height 0.28s cubic-bezier(0.4, 0, 0.2, 1);
`

const SubInner = styled.div`
  padding: 0.2rem 0 0.35rem 2.25rem;
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const SubLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.42rem 0.625rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.825rem;
  font-weight: 400;
  color: #64748b;
  letter-spacing: 0.01em;
  transition: background 0.13s, color 0.13s;
  white-space: nowrap;

  &::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: transparent;
    flex-shrink: 0;
    transition: background 0.15s;
  }

  &:hover {
    background: #eff6ff;
    color: #1e40af;
  }

  &:hover::before {
    background: #bfdbfe;
  }

  &.active {
    background: #dbeafe;
    color: #1e40af;
    font-weight: 500;
  }

  &.active::before {
    background: #3b82f6;
  }
`

// ── Standalone link (Account / Settings) ───────────────────────────────────
const StandaloneLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.55rem 0.75rem;
  border-radius: 10px;
  text-decoration: none;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: 0.01em;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;

  svg {
    width: 17px;
    height: 17px;
    color: #64748b;
    flex-shrink: 0;
    transition: color 0.15s;
  }

  span {
    opacity: 1;
    transition: opacity 0.2s ease;
  }

  &:hover {
    background: #eff6ff;
    color: #1e40af;
  }

  &:hover svg {
    color: #3b82f6;
  }

  &.active {
    background: #dbeafe;
    color: #1e40af;
    font-weight: 500;
  }

  &.active svg {
    color: #3b82f6;
  }
`

// ── User area (avatar + username + theme, NO logout) ───────────────────────
const UserArea = styled.div`
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  padding: 0.875rem 0.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
`

const Avatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  flex-shrink: 0;
  font-family: 'Courier New', monospace;
`

const UserName = styled.span`
  flex: 1;
  font-size: 0.85rem;
  font-weight: 500;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 1;
  transition: opacity 0.2s ease;
`

// ── Nav data ──────────────────────────────────────────────────────────────
const sections = [
  {
    key: 'vault',
    label: 'Vault',
    icon: Lock,
    height: 108,
    links: [
      { name: 'Items', path: '/dashboard/vault/items' },
      { name: 'Bin', path: '/dashboard/vault/bin' },
      { name: 'Public Files', path: '/dashboard/vault/public' },
    ],
  },
  {
    key: 'portfolio',
    label: 'Portfolio',
    icon: Briefcase,
    height: 260,
    links: [
      { name: 'Profile', path: '/dashboard/portfolio/profile' },
      { name: 'Education', path: '/dashboard/portfolio/education' },
      { name: 'Experience', path: '/dashboard/portfolio/experience' },
      { name: 'Projects', path: '/dashboard/portfolio/projects' },
      { name: 'Skills', path: '/dashboard/portfolio/skills' },
      { name: 'Certifications', path: '/dashboard/portfolio/certifications' },
      { name: 'Interests', path: '/dashboard/portfolio/interests' },
    ],
  },
  {
    key: 'developer',
    label: 'Developer',
    icon: Terminal,
    height: 110,
    links: [
      { name: 'Docs', path: '/dashboard/developer/docs' },
      { name: 'Keys', path: '/dashboard/developer/keys' },
      { name: 'Analytics', path: '/dashboard/developer/analytics' },
    ],
  },
]

// ── Component ──────────────────────────────────────────────────────────────
const Sidebar = ({ collapsed, onToggle, isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth()
  const location = useLocation()

  const getDefaultOpen = () => {
    const matched = sections.find(s =>
      s.links.some(l => location.pathname.startsWith(l.path))
    )
    return matched?.key ?? null
  }

  const [openKey, setOpenKey] = useState(getDefaultOpen)
  const toggle = (key) => setOpenKey(prev => prev === key ? null : key)

  const handleLinkClick = () => {
    onCloseMobile?.()
  }

  const renderSection = (section) => (
    <div key={section.key}>
      <Trigger $open={openKey === section.key} onClick={() => toggle(section.key)}>
        <TriggerIcon $open={openKey === section.key}><section.icon /></TriggerIcon>
        <TriggerLabel $open={openKey === section.key}>{section.label}</TriggerLabel>
        <Chevron $open={openKey === section.key} />
      </Trigger>
      <SubMenu $open={openKey === section.key} $height={section.height}>
        <SubInner>
          {section.links.map(({ name, path }) => (
            <SubLink 
              key={path} 
              to={path}
              onClick={handleLinkClick}
            >
              {name}
            </SubLink>
          ))}
        </SubInner>
      </SubMenu>
    </div>
  )

  return (
    <SidebarContainer $isMobileOpen={isMobileOpen}>
      <Header>
        <LogoWrap>
          <LogoMark><Database /></LogoMark>
          <LogoText>PersonalDB</LogoText>
        </LogoWrap>
        <CloseBtn onClick={onCloseMobile}>
          <X />
        </CloseBtn>
      </Header>

      <Nav>
        {sections.map(renderSection)}

        <Divider />

        <StandaloneLink
          to="/dashboard/account"
          className={({ isActive }) => isActive ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <User />
          <span>Account</span>
        </StandaloneLink>

        <StandaloneLink
          to={`/u/${user?.username}`}
          className={({ isActive }) => isActive ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <User />
          <span>Public Profile</span>
        </StandaloneLink>

        <StandaloneLink
          to="/dashboard/settings"
          className={({ isActive }) => isActive ? 'active' : ''}
          onClick={handleLinkClick}
        >
          <Settings />
          <span>Settings</span>
        </StandaloneLink>
      </Nav>

      <UserArea>
        <Avatar>{user?.username?.[0]?.toUpperCase()}</Avatar>
        <UserName>{user?.username}</UserName>
        <ThemeToggle />
      </UserArea>
    </SidebarContainer>
  )
}

export default Sidebar