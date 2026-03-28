import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Lock, Briefcase, Globe, Settings, User,
  Database, ChevronLeft, ChevronDown, Terminal, BarChart3, X,
  LayoutGrid, Users
} from 'lucide-react'
import { RiUserSettingsLine } from "react-icons/ri"
import { MdOutlineDashboard } from "react-icons/md"
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

/* ─── Constants ───────────────────────────────────────────── */
const RAIL_W = 62
const EXPANDED_W = 264

/* ─── Injected keyframe styles ────────────────────────────── */
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes tooltipIn {
    from { opacity: 0; transform: translateX(-4px) translateY(-50%); }
    to   { opacity: 1; transform: translateX(0) translateY(-50%); }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-4px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .sidebar-nav::-webkit-scrollbar { width: 3px; }
  .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
  .sidebar-nav::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }

  .sidebar-toggle-btn svg {
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .sidebar-toggle-btn:hover {
    background: #eff6ff !important;
    box-shadow: 0 4px 14px rgba(59,130,246,0.2) !important;
    transform: scale(1.1) !important;
  }

  .sidebar-trigger:hover { background: #eff6ff !important; }
  .sidebar-trigger:hover .trigger-icon { color: #3b82f6 !important; }
  .sidebar-trigger:hover .trigger-label { color: #1e40af !important; }

  .sidebar-standalone-link:hover { background: #eff6ff !important; color: #1e40af !important; }
  .sidebar-standalone-link:hover svg { color: #3b82f6 !important; }
  .sidebar-standalone-link.active { background: #dbeafe !important; color: #1e40af !important; font-weight: 500 !important; }
  .sidebar-standalone-link.active svg { color: #3b82f6 !important; }

  .sidebar-sub-link { display: flex; align-items: center; gap: 0.45rem; padding: 0.4rem 0.6rem; border-radius: 8px; text-decoration: none; font-size: 0.82rem; font-weight: 400; color: #64748b; transition: background 0.13s, color 0.13s; white-space: nowrap; line-height: 1.2; }
  .sidebar-sub-link::before { content: ''; display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: transparent; flex-shrink: 0; transition: background 0.15s; }
  .sidebar-sub-link:hover { background: #eff6ff; color: #1e40af; }
  .sidebar-sub-link:hover::before { background: #bfdbfe; }
  .sidebar-sub-link.active { background: #dbeafe; color: #1e40af; font-weight: 500; }
  .sidebar-sub-link.active::before { background: #3b82f6; }

  .sidebar-tooltip-wrap:hover .sidebar-tooltip {
    opacity: 1;
    animation: tooltipIn 0.15s ease forwards;
  }
  .sidebar-trigger:hover .sidebar-tooltip {
    opacity: 1;
    animation: tooltipIn 0.15s ease forwards;
  }
  .sidebar-user-area:hover .sidebar-tooltip {
    opacity: 1;
    animation: tooltipIn 0.15s ease forwards;
  }

  .close-btn:hover { background: #eff6ff !important; }

  @media (max-width: 768px) {
    .sidebar-toggle-btn { display: none !important; }
    .close-btn { display: flex !important; }
    .sidebar-container {
      position: fixed !important;
      left: 0 !important;
      top: 0 !important;
      z-index: 1001 !important;
      width: ${EXPANDED_W}px !important;
    }
  }
  @media (min-width: 769px) {
    .close-btn { display: none !important; }
  }
`
if (!document.head.querySelector('#sidebar-styles')) {
  styleTag.id = 'sidebar-styles'
  document.head.appendChild(styleTag)
}

/* ─── Tooltip ─────────────────────────────────────────────── */
const Tooltip = ({ children }) => (
  <span
    className="sidebar-tooltip"
    style={{
      position: 'absolute',
      left: 'calc(100% + 10px)',
      top: '50%',
      transform: 'translateY(-50%)',
      background: '#1e293b',
      color: '#fff',
      fontSize: '0.76rem',
      fontFamily: "'Outfit', system-ui, sans-serif",
      fontWeight: 500,
      padding: '5px 10px',
      borderRadius: '7px',
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      opacity: 0,
      zIndex: 9999,
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}
  >
    <span style={{
      content: '',
      position: 'absolute',
      right: '100%',
      top: '50%',
      transform: 'translateY(-50%)',
      border: '5px solid transparent',
      borderRightColor: '#1e293b',
      display: 'block',
      width: 0,
      height: 0,
    }} />
    {children}
  </span>
)

/* ─── Data ────────────────────────────────────────────────── */
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

const standaloneItems = [
  { name: 'Account',       path: '/dashboard/account',      icon: User },
  { name: 'Port Settings', path: '/dashboard/portsettings', icon: RiUserSettingsLine },
  { name: 'Settings',      path: '/dashboard/settings',     icon: Settings },
]

/* ─── Component ───────────────────────────────────────────── */
const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth()
  const location = useLocation()
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

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

  /* ── inline styles ── */
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    background: '#fff',
    borderRight: '1.5px solid rgba(59, 130, 246, 0.1)',
    flexShrink: 0,
    position: 'relative',
    zIndex: 100,
    width: collapsed ? `${RAIL_W}px` : `${EXPANDED_W}px`,
    transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'visible',
    // mobile handled via class + media query
    ...(window.innerWidth <= 768 ? {
      position: 'fixed',
      left: 0,
      top: 0,
      zIndex: 1001,
      height: '100vh',
      width: `${EXPANDED_W}px`,
      transform: isMobileOpen ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: isMobileOpen ? '8px 0 40px rgba(15,45,107,0.14)' : 'none',
      overflow: 'hidden',
    } : {}),
  }

  const toggleBtnStyle = {
    position: 'absolute',
    top: '20px',
    right: '-12px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#fff',
    border: '1.5px solid rgba(59, 130, 246, 0.25)',
    color: '#3b82f6',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
    boxShadow: '0 2px 8px rgba(59,130,246,0.12)',
    transition: 'background 0.15s, box-shadow 0.15s, transform 0.2s',
    padding: 0,
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '64px',
    padding: collapsed ? '0' : '0 1rem',
    justifyContent: collapsed ? 'center' : 'space-between',
    borderBottom: '1.5px solid rgba(59, 130, 246, 0.08)',
    flexShrink: 0,
    overflow: 'hidden',
    transition: 'padding 0.28s',
  }

  const logoMarkStyle = {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    borderRadius: '9px',
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
  }

  const logoTextStyle = {
    display: 'block',
    fontFamily: "'Courier New', monospace",
    fontSize: '1rem',
    fontWeight: 700,
    color: '#1e40af',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: collapsed ? 0 : 1,
    width: collapsed ? '0' : 'auto',
    marginLeft: collapsed ? '0' : '0.6rem',
    transition: 'opacity 0.2s ease, width 0.28s ease, margin 0.28s ease',
    pointerEvents: 'none',
    lineHeight: 1.2,
  }

  const closeBtnStyle = {
    width: '28px',
    height: '28px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
    flexShrink: 0,
    transition: 'background 0.15s',
  }

  const navStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0.75rem 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  }

  const dividerStyle = {
    height: '1px',
    background: 'rgba(59, 130, 246, 0.07)',
    margin: `0.4rem ${collapsed ? '10px' : '0.75rem'}`,
    transition: 'margin 0.28s',
  }

  const sectionWrapStyle = {
    position: 'relative',
    padding: `0 ${collapsed ? '6px' : '8px'}`,
    transition: 'padding 0.28s',
  }

  const sectionLabelStyle = {
    display: 'block',
    fontSize: '0.65rem',
    fontWeight: 700,
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: '#94a3b8',
    margin: collapsed ? '0.75rem 0 0.25rem' : '1.25rem 1rem 0.5rem 1rem',
    padding: 0,
    opacity: collapsed ? 0 : 1,
    transition: 'opacity 0.18s ease, margin 0.28s ease',
    pointerEvents: 'none',
    lineHeight: 1.2,
  }

  const userAreaStyle = {
    borderTop: '1.5px solid rgba(59, 130, 246, 0.08)',
    padding: collapsed ? '0.75rem 6px' : '0.75rem 0.75rem',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    overflow: 'hidden',
    transition: 'padding 0.28s',
    justifyContent: collapsed ? 'center' : 'flex-start',
    position: 'relative',
  }

  const avatarStyle = {
    width: '32px',
    height: '32px',
    minWidth: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.78rem',
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'Courier New', monospace",
  }

  const userInfoStyle = {
    flex: 1,
    overflow: 'hidden',
    opacity: collapsed ? 0 : 1,
    width: collapsed ? '0' : 'auto',
    transition: 'opacity 0.18s ease, width 0.28s ease',
    pointerEvents: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  }

  const themeWrapStyle = {
    flexShrink: 0,
    opacity: collapsed ? 0 : 1,
    width: collapsed ? '0' : 'auto',
    overflow: 'hidden',
    transition: 'opacity 0.18s ease, width 0.28s ease',
    pointerEvents: collapsed ? 'none' : 'auto',
  }

  const getTriggerStyle = (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: collapsed ? '0.6rem 0' : '0.52rem 0.65rem',
    border: 'none',
    background: !collapsed && isOpen ? '#eff6ff' : 'transparent',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'background 0.15s, padding 0.28s',
    textAlign: 'left',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: collapsed ? '0' : '0.6rem',
    position: 'relative',
  })

  const getTriggerIconStyle = (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
    color: isOpen ? '#3b82f6' : '#64748b',
    transition: 'color 0.15s',
    position: 'relative',
    zIndex: 1,
  })

  const getTriggerLabelStyle = (isOpen) => ({
    display: 'block',
    flex: 1,
    fontSize: '0.875rem',
    fontWeight: 400,
    color: isOpen ? '#1e40af' : '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: collapsed ? 0 : 1,
    width: collapsed ? '0' : 'auto',
    transition: 'opacity 0.18s ease, width 0.28s ease',
    pointerEvents: 'none',
    lineHeight: 1.2,
  })

  const getChevronStyle = (isOpen) => ({
    width: '13px',
    height: '13px',
    flexShrink: 0,
    color: isOpen ? '#3b82f6' : '#94a3b8',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
    transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), color 0.15s, opacity 0.18s',
    opacity: collapsed ? 0 : 1,
    pointerEvents: 'none',
  })

  const getSubMenuStyle = (isOpen, height) => ({
    overflow: 'hidden',
    maxHeight: collapsed ? '0' : (isOpen ? `${height}px` : '0'),
    transition: 'max-height 0.26s cubic-bezier(0.4,0,0.2,1)',
  })

  const subInnerStyle = {
    padding: '0.15rem 0 0.3rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  }

  const getStandaloneLinkStyle = (isCollapsed) => ({
    display: 'flex',
    alignItems: 'center',
    gap: isCollapsed ? '0' : '0.6rem',
    padding: isCollapsed ? '0.6rem 0' : '0.52rem 0.65rem',
    borderRadius: '10px',
    textDecoration: 'none',
    color: '#334155',
    fontSize: '0.875rem',
    fontWeight: 400,
    transition: 'background 0.15s, color 0.15s, padding 0.28s',
    whiteSpace: 'nowrap',
    justifyContent: isCollapsed ? 'center' : 'flex-start',
    position: 'relative',
    lineHeight: 1.2,
  })

  const standaloneIconStyle = {
    width: '17px',
    height: '17px',
    color: '#64748b',
    flexShrink: 0,
    transition: 'color 0.15s',
  }

  const standaloneLabelStyle = {
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    opacity: collapsed ? 0 : 1,
    width: collapsed ? '0' : 'auto',
    transition: 'opacity 0.18s ease, width 0.28s ease',
    pointerEvents: 'none',
    lineHeight: 1.2,
    whiteSpace: 'nowrap',
  }

  /* ── render helpers ── */
  const renderSection = (section) => {
    const isOpen = openKey === section.key
    return (
      <div key={section.key} style={sectionWrapStyle} className="sidebar-tooltip-wrap">
        <button
          style={getTriggerStyle(isOpen)}
          className="sidebar-trigger"
          onClick={() => toggle(section.key)}
          title={collapsed ? section.label : undefined}
        >
          <span style={getTriggerIconStyle(isOpen)} className="trigger-icon">
            <section.icon style={{ width: 17, height: 17 }} />
          </span>
          <span style={getTriggerLabelStyle(isOpen)} className="trigger-label">
            {section.label}
          </span>
          <ChevronDown style={getChevronStyle(isOpen)} />
          {collapsed && <Tooltip>{section.label}</Tooltip>}
        </button>

        <div style={getSubMenuStyle(isOpen, section.height)}>
          <div style={subInnerStyle}>
            {section.links.map(({ name, path }) => (
              <NavLink
                key={path}
                to={path}
                className="sidebar-sub-link"
                onClick={handleLinkClick}
              >
                {name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onCloseMobile}
        style={{
          display: isMobileOpen && window.innerWidth <= 768 ? 'block' : 'none',
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 45, 107, 0.35)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
        }}
      />

      <aside style={containerStyle} className="sidebar-container">
        {/* Desktop toggle */}
        <button
          style={{
            ...toggleBtnStyle,
            transform: collapsed ? 'rotate(0deg)' : 'rotate(0deg)',
          }}
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            style={{
              width: 13,
              height: 13,
              transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </button>

        {/* Header */}
        <div style={headerStyle}>
          <Link to="/">
            <div style={logoMarkStyle} onClick={() => collapsed && setCollapsed(false)}>
              <Database style={{ width: 16, height: 16, color: 'white' }} />
            </div>
          </Link>
          <span style={logoTextStyle}>PersonalDB</span>
          <button
            className="close-btn"
            style={closeBtnStyle}
            onClick={onCloseMobile}
          >
            <X style={{ width: 18, height: 18 }} />
          </button>
        </div>

        {/* Nav */}
        <nav style={navStyle} className="sidebar-nav">

          {/* Dashboard */}
          <div
            style={{ position: 'relative', padding: `0 ${collapsed ? '6px' : '8px'}`, transition: 'padding 0.28s' }}
            className="sidebar-tooltip-wrap"
          >
            <NavLink
              to="/dashboard"
              className="sidebar-standalone-link"
              style={getStandaloneLinkStyle(collapsed)}
            >
              <MdOutlineDashboard style={standaloneIconStyle} />
              <span style={standaloneLabelStyle}>Dashboard</span>
              {collapsed && <Tooltip>Dashboard</Tooltip>}
            </NavLink>
          </div>

          <div style={dividerStyle} />

          {/* Main sections */}
          {sections.map(renderSection)}

          <div style={dividerStyle} />

          {/* Standalone items */}
          {standaloneItems.map(({ name, path, icon: Icon }) => (
            <div
              key={path}
              style={{ position: 'relative', padding: `0 ${collapsed ? '6px' : '8px'}`, transition: 'padding 0.28s' }}
              className="sidebar-tooltip-wrap"
            >
              <NavLink
                to={path}
                className="sidebar-standalone-link"
                style={getStandaloneLinkStyle(collapsed)}
                onClick={handleLinkClick}
              >
                <Icon style={standaloneIconStyle} />
                <span style={standaloneLabelStyle}>{name}</span>
                {collapsed && <Tooltip>{name}</Tooltip>}
              </NavLink>
            </div>
          ))}

          {/* Public Profile */}
          <div
            style={{ position: 'relative', padding: `0 ${collapsed ? '6px' : '8px'}`, transition: 'padding 0.28s' }}
            className="sidebar-tooltip-wrap"
          >
            <NavLink
              to={`/u/${user?.username}`}
              className="sidebar-standalone-link"
              style={getStandaloneLinkStyle(collapsed)}
              onClick={handleLinkClick}
              target="_blank"
            >
              <Globe style={standaloneIconStyle} />
              <span style={standaloneLabelStyle}>Public Profile</span>
              {collapsed && <Tooltip>Public Profile</Tooltip>}
            </NavLink>
          </div>

          {/* Admin section */}
          {isAdmin && (
            <>
              <div style={dividerStyle} />
              <p style={sectionLabelStyle}>Admin</p>

              <div style={sectionWrapStyle} className="sidebar-tooltip-wrap">
                <button
                  style={getTriggerStyle(openKey === 'admin')}
                  className="sidebar-trigger"
                  onClick={() => toggle('admin')}
                  title={collapsed ? 'Admin' : undefined}
                >
                  <span style={getTriggerIconStyle(openKey === 'admin')} className="trigger-icon">
                    <BarChart3 style={{ width: 17, height: 17 }} />
                  </span>
                  <span style={getTriggerLabelStyle(openKey === 'admin')} className="trigger-label">
                    Admin Panel
                  </span>
                  <ChevronDown style={getChevronStyle(openKey === 'admin')} />
                  {collapsed && <Tooltip>Admin Panel</Tooltip>}
                </button>

                <div style={getSubMenuStyle(openKey === 'admin', 108)}>
                  <div style={subInnerStyle}>
                    <NavLink to="/dashboard/admin/templates" className="sidebar-sub-link" onClick={handleLinkClick}>
                      <LayoutGrid size={14} style={{ marginRight: '4px' }} />
                      Templates
                    </NavLink>
                    <NavLink to="/dashboard/admin/users" className="sidebar-sub-link" onClick={handleLinkClick}>
                      <Users size={14} style={{ marginRight: '4px' }} />
                      Users
                    </NavLink>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* User area */}
        <div style={userAreaStyle} className="sidebar-user-area">
          <div style={avatarStyle}>{user?.username?.[0]?.toUpperCase()}</div>
          <div style={userInfoStyle}>
            <span style={{ display: 'block', fontSize: '0.84rem', fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
              {user?.username}
            </span>
            {isAdmin && (
              <span style={{ display: 'block', fontSize: '0.7rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                👑 {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
              </span>
            )}
          </div>
          <div style={themeWrapStyle}>
            <ThemeToggle />
          </div>
          {collapsed && <Tooltip>{user?.username}</Tooltip>}
        </div>
      </aside>
    </>
  )
}

export default Sidebar