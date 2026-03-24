import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import {
  Lock, Trash2, Globe, Settings, User, GraduationCap, Briefcase,
  FolderKanban, Code, Award, Heart, ChevronDown,
  Database, ChevronLeft, ChevronRight, Terminal, Key, BarChart3, FileCode2, X,
  ChevronRight as ChevronRightIcon
} from 'lucide-react'
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

/* ─── Constants ───────────────────────────────────────────── */
const RAIL_W = 62       // collapsed icon rail width
const EXPANDED_W = 264  // full sidebar width

/* ─── Animations ──────────────────────────────────────────── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-4px); }
  to   { opacity: 1; transform: translateX(0); }
`

const tooltipIn = keyframes`
  from { opacity: 0; transform: translateX(-4px) translateY(-50%); }
  to   { opacity: 1; transform: translateX(0) translateY(-50%); }
`

/* ─── Sidebar Shell ───────────────────────────────────────── */
const SidebarContainer = styled.aside`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #fff;
  border-right: 1.5px solid rgba(59, 130, 246, 0.1);
  flex-shrink: 0;
  position: relative;
  z-index: 100;

  /* Desktop: animate between rail and expanded */
  width: ${({ $collapsed }) => ($collapsed ? `${RAIL_W}px` : `${EXPANDED_W}px`)};
  transition: width 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: visible; /* allow tooltip to overflow */

  @media (max-width: 768px) {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1001;
    height: 100vh;
    width: ${EXPANDED_W}px;
    transform: translateX(${({ $isMobileOpen }) => ($isMobileOpen ? '0' : '-100%')});
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: ${({ $isMobileOpen }) =>
      $isMobileOpen ? '8px 0 40px rgba(15,45,107,0.14)' : 'none'};
    overflow: hidden;
  }
`

/* ─── Toggle Button (desktop) ─────────────────────────────── */
const ToggleBtn = styled.button`
  position: absolute;
  top: 20px;
  right: -12px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #fff;
  border: 1.5px solid rgba(59, 130, 246, 0.25);
  color: #3b82f6;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  box-shadow: 0 2px 8px rgba(59,130,246,0.12);
  transition: background 0.15s, box-shadow 0.15s, transform 0.2s;

  &:hover {
    background: #eff6ff;
    box-shadow: 0 4px 14px rgba(59,130,246,0.2);
    transform: scale(1.1);
  }

  svg {
    width: 13px;
    height: 13px;
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    transform: ${({ $collapsed }) => ($collapsed ? 'rotate(0deg)' : 'rotate(180deg)')};
  }

  @media (max-width: 768px) {
    display: none;
  }
`

/* ─── Header ──────────────────────────────────────────────── */
const Header = styled.div`
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 ${({ $collapsed }) => ($collapsed ? '0' : '1rem')};
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
  border-bottom: 1.5px solid rgba(59, 130, 246, 0.08);
  flex-shrink: 0;
  overflow: hidden;
`

const LogoMark = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    color: white;
  }
`

const LogoText = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? '0' : 'auto')};
  margin-left: ${({ $collapsed }) => ($collapsed ? '0' : '0.6rem')};
  transition: opacity 0.2s ease, width 0.28s ease, margin 0.28s ease;
  pointer-events: none;
`

const CloseBtn = styled.button`
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

  &:hover { background: #eff6ff; }

  svg { width: 18px; height: 18px; }

  @media (min-width: 769px) { display: none; }
`

/* ─── Nav ─────────────────────────────────────────────────── */
const Nav = styled.nav`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 1px;

  &::-webkit-scrollbar { width: 3px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }
`

const Divider = styled.div`
  height: 1px;
  background: rgba(59, 130, 246, 0.07);
  margin: 0.4rem ${({ $collapsed }) => ($collapsed ? '10px' : '0.75rem')};
  transition: margin 0.28s;
`

/* ─── Tooltip (collapsed mode) ───────────────────────────── */
const Tooltip = styled.span`
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  transform: translateY(-50%);
  background: #1e293b;
  color: #fff;
  font-size: 0.76rem;
  font-family: 'Outfit', system-ui, sans-serif;
  font-weight: 500;
  padding: 5px 10px;
  border-radius: 7px;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  z-index: 9999;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);

  &::before {
    content: '';
    position: absolute;
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: #1e293b;
  }
`

/* ─── Section (accordion) ─────────────────────────────────── */
const SectionWrap = styled.div`
  position: relative;
  padding: 0 ${({ $collapsed }) => ($collapsed ? '6px' : '8px')};
  transition: padding 0.28s;
`

const Trigger = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  padding: ${({ $collapsed }) => ($collapsed ? '0.6rem 0' : '0.52rem 0.65rem')};
  border: none;
  background: ${({ $open, $collapsed }) => (!$collapsed && $open ? '#eff6ff' : 'transparent')};
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s, padding 0.28s;
  text-align: left;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '0.6rem')};
  position: relative;

  &:hover {
    background: ${({ $collapsed }) => ($collapsed ? 'transparent' : '#eff6ff')};
  }

  /* Collapsed highlight ring */
  ${({ $collapsed, $open }) =>
    $collapsed && $open &&
    css`
      &::after {
        content: '';
        position: absolute;
        inset: 2px;
        border-radius: 8px;
        background: #dbeafe;
      }
    `}

  /* Show tooltip on hover in collapsed mode */
  &:hover > ${Tooltip} {
    opacity: 1;
    animation: ${tooltipIn} 0.15s ease forwards;
  }
`

const TriggerIcon = styled.span`
  display: flex;
  align-items: center;
  flex-shrink: 0;
  color: ${({ $open }) => ($open ? '#3b82f6' : '#64748b')};
  transition: color 0.15s;
  position: relative;
  z-index: 1;

  ${Trigger}:hover & { color: #3b82f6; }

  svg { width: 17px; height: 17px; }
`

const TriggerLabel = styled.span`
  flex: 1;
  font-size: 0.875rem;
  font-weight: 400;
  color: ${({ $open }) => ($open ? '#1e40af' : '#334155')};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? '0' : 'auto')};
  transition: opacity 0.18s ease, width 0.28s ease;
  pointer-events: none;

  ${Trigger}:hover & { color: #1e40af; }
`

const Chevron = styled(ChevronDown)`
  width: 13px !important;
  height: 13px !important;
  flex-shrink: 0;
  color: ${({ $open }) => ($open ? '#3b82f6' : '#94a3b8')};
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'rotate(0deg)')};
  transition: transform 0.22s cubic-bezier(0.4,0,0.2,1), color 0.15s, opacity 0.18s;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  pointer-events: none;
`

/* ─── SubMenu ─────────────────────────────────────────────── */
const SubMenu = styled.div`
  overflow: hidden;
  max-height: ${({ $open, $height, $collapsed }) =>
    $collapsed ? '0' : ($open ? `${$height}px` : '0')};
  transition: max-height 0.26s cubic-bezier(0.4,0,0.2,1);
`

const SubInner = styled.div`
  padding: 0.15rem 0 0.3rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1px;
`

const SubLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.6rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 400;
  color: #64748b;
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

  &:hover { background: #eff6ff; color: #1e40af; }
  &:hover::before { background: #bfdbfe; }

  &.active {
    background: #dbeafe;
    color: #1e40af;
    font-weight: 500;
  }
  &.active::before { background: #3b82f6; }
`

/* ─── Standalone Link ─────────────────────────────────────── */
const StandaloneWrap = styled.div`
  position: relative;
  padding: 0 ${({ $collapsed }) => ($collapsed ? '6px' : '8px')};
  transition: padding 0.28s;

  &:hover > a > ${Tooltip} {
    opacity: 1;
    animation: ${tooltipIn} 0.15s ease forwards;
  }
`

const StandaloneLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ $collapsed }) => ($collapsed ? '0' : '0.6rem')};
  padding: ${({ $collapsed }) => ($collapsed ? '0.6rem 0' : '0.52rem 0.65rem')};
  border-radius: 10px;
  text-decoration: none;
  color: #334155;
  font-size: 0.875rem;
  font-weight: 400;
  transition: background 0.15s, color 0.15s, padding 0.28s;
  white-space: nowrap;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  position: relative;

  svg {
    width: 17px;
    height: 17px;
    color: #64748b;
    flex-shrink: 0;
    transition: color 0.15s;
  }

  span {
    overflow: hidden;
    opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
    width: ${({ $collapsed }) => ($collapsed ? '0' : 'auto')};
    transition: opacity 0.18s ease, width 0.28s ease;
    pointer-events: none;
  }

  &:hover { background: #eff6ff; color: #1e40af; }
  &:hover svg { color: #3b82f6; }

  &.active { background: #dbeafe; color: #1e40af; font-weight: 500; }
  &.active svg { color: #3b82f6; }
`

/* ─── User Area ───────────────────────────────────────────── */
const UserArea = styled.div`
  border-top: 1.5px solid rgba(59, 130, 246, 0.08);
  padding: ${({ $collapsed }) => ($collapsed ? '0.75rem 6px' : '0.75rem 0.75rem')};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
  transition: padding 0.28s;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  position: relative;

  &:hover > ${Tooltip} {
    opacity: ${({ $collapsed }) => ($collapsed ? 1 : 0)};
    animation: ${({ $collapsed }) => ($collapsed ? css`${tooltipIn} 0.15s ease forwards` : 'none')};
  }
`

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  min-width: 32px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.78rem;
  font-weight: 700;
  flex-shrink: 0;
  font-family: 'Courier New', monospace;
`

const UserInfo = styled.div`
  flex: 1;
  overflow: hidden;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? '0' : 'auto')};
  transition: opacity 0.18s ease, width 0.28s ease;
  pointer-events: none;
`

const UserName = styled.span`
  display: block;
  font-size: 0.84rem;
  font-weight: 500;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const ThemeWrap = styled.div`
  flex-shrink: 0;
  opacity: ${({ $collapsed }) => ($collapsed ? 0 : 1)};
  width: ${({ $collapsed }) => ($collapsed ? '0' : 'auto')};
  overflow: hidden;
  transition: opacity 0.18s ease, width 0.28s ease;
  pointer-events: ${({ $collapsed }) => ($collapsed ? 'none' : 'auto')};
`

/* ─── Overlay (mobile) ────────────────────────────────────── */
const Overlay = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: ${({ $show }) => ($show ? 'block' : 'none')};
    position: fixed;
    inset: 0;
    background: rgba(15, 45, 107, 0.35);
    backdrop-filter: blur(2px);
    z-index: 1000;
  }
`

/* ─── Nav data ────────────────────────────────────────────── */
const sections = [
  {
    key: 'vault',
    label: 'Vault',
    icon: Lock,
    height: 108,
    links: [
      { name: 'Items',        path: '/dashboard/vault/items' },
      { name: 'Bin',          path: '/dashboard/vault/bin' },
      { name: 'Public Files', path: '/dashboard/vault/public' },
    ],
  },
  {
    key: 'portfolio',
    label: 'Portfolio',
    icon: Briefcase,
    height: 262,
    links: [
      { name: 'Profile',        path: '/dashboard/portfolio/profile' },
      { name: 'Education',      path: '/dashboard/portfolio/education' },
      { name: 'Experience',     path: '/dashboard/portfolio/experience' },
      { name: 'Projects',       path: '/dashboard/portfolio/projects' },
      { name: 'Skills',         path: '/dashboard/portfolio/skills' },
      { name: 'Certifications', path: '/dashboard/portfolio/certifications' },
      { name: 'Interests',      path: '/dashboard/portfolio/interests' },
    ],
  },
  {
    key: 'developer',
    label: 'Developer',
    icon: Terminal,
    height: 108,
    links: [
      { name: 'Docs',      path: '/dashboard/developer/docs' },
      { name: 'Keys',      path: '/dashboard/developer/keys' },
      { name: 'Analytics', path: '/dashboard/developer/analytics' },
    ],
  },
]

/* ─── Component ───────────────────────────────────────────── */
const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth()
  const location = useLocation()

  const getDefaultOpen = () => {
    const matched = sections.find(s =>
      s.links.some(l => location.pathname.startsWith(l.path))
    )
    return matched?.key ?? null
  }

  const [collapsed, setCollapsed] = useState(false)
  const [openKey, setOpenKey] = useState(getDefaultOpen)

  const toggle = (key) => {
    if (collapsed) {
      setCollapsed(false)
      setOpenKey(key)
    } else {
      setOpenKey(prev => (prev === key ? null : key))
    }
  }

  const handleLinkClick = () => onCloseMobile?.()

  const renderSection = (section) => (
    <SectionWrap key={section.key} $collapsed={collapsed}>
      <Trigger
        $open={openKey === section.key}
        $collapsed={collapsed}
        onClick={() => toggle(section.key)}
        title={collapsed ? section.label : undefined}
      >
        <TriggerIcon $open={openKey === section.key}>
          <section.icon />
        </TriggerIcon>
        <TriggerLabel $open={openKey === section.key} $collapsed={collapsed}>
          {section.label}
        </TriggerLabel>
        <Chevron $open={openKey === section.key} $collapsed={collapsed} />
        {collapsed && <Tooltip>{section.label}</Tooltip>}
      </Trigger>

      <SubMenu $open={openKey === section.key} $height={section.height} $collapsed={collapsed}>
        <SubInner>
          {section.links.map(({ name, path }) => (
            <SubLink key={path} to={path} onClick={handleLinkClick}>
              {name}
            </SubLink>
          ))}
        </SubInner>
      </SubMenu>
    </SectionWrap>
  )

  return (
    <>
      <Overlay $show={isMobileOpen} onClick={onCloseMobile} />

      <SidebarContainer $collapsed={collapsed} $isMobileOpen={isMobileOpen}>
        {/* Desktop toggle button */}
        <ToggleBtn
          $collapsed={collapsed}
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft />
        </ToggleBtn>

        {/* Header */}
        <Header $collapsed={collapsed}>
          <LogoMark onClick={() => collapsed && setCollapsed(false)}>
            <Database />
          </LogoMark>
          <LogoText $collapsed={collapsed}>PersonalDB</LogoText>
          <CloseBtn onClick={onCloseMobile}><X /></CloseBtn>
        </Header>

        {/* Nav */}
        <Nav>
          {sections.map(renderSection)}

          <Divider $collapsed={collapsed} />

          {/* Account */}
          <StandaloneWrap $collapsed={collapsed}>
            <StandaloneLink
              to="/dashboard/account"
              $collapsed={collapsed}
              onClick={handleLinkClick}
            >
              <User />
              <span>Account</span>
              {collapsed && <Tooltip>Account</Tooltip>}
            </StandaloneLink>
          </StandaloneWrap>

          {/* Public Profile */}
          <StandaloneWrap $collapsed={collapsed}>
            <StandaloneLink
              to={`/u/${user?.username}`}
              $collapsed={collapsed}
              onClick={handleLinkClick}
            >
              <Globe />
              <span>Public Profile</span>
              {collapsed && <Tooltip>Public Profile</Tooltip>}
            </StandaloneLink>
          </StandaloneWrap>

          {/* Settings */}
          <StandaloneWrap $collapsed={collapsed}>
            <StandaloneLink
              to="/dashboard/settings"
              $collapsed={collapsed}
              onClick={handleLinkClick}
            >
              <Settings />
              <span>Settings</span>
              {collapsed && <Tooltip>Settings</Tooltip>}
            </StandaloneLink>
          </StandaloneWrap>
        </Nav>

        {/* User area */}
        <UserArea $collapsed={collapsed}>
          <Avatar>{user?.username?.[0]?.toUpperCase()}</Avatar>
          <UserInfo $collapsed={collapsed}>
            <UserName>{user?.username}</UserName>
          </UserInfo>
          <ThemeWrap $collapsed={collapsed}>
            <ThemeToggle />
          </ThemeWrap>
          {collapsed && <Tooltip>{user?.username}</Tooltip>}
        </UserArea>
      </SidebarContainer>
    </>
  )
}

export default Sidebar