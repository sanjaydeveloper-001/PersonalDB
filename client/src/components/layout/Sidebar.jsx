import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Lock, Briefcase, Globe, Settings, User,
  Database, ChevronLeft, ChevronDown, Terminal, BarChart3, X,
  LayoutGrid, Users, Mail, MessageSquare, AlertTriangle
} from 'lucide-react'
import { RiUserSettingsLine } from "react-icons/ri"
import { MdOutlineDashboard } from "react-icons/md"
import ThemeToggle from '../common/ThemeToggle'
import { useAuth } from '../../contexts/AuthContext'

/* ─── Constants ───────────────────────────────────────────── */
const RAIL_W = 56
const EXPANDED_W = 240

/* ─── Injected keyframe styles ────────────────────────────── */
const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes tooltipIn {
    from { opacity: 0; transform: translateX(-4px) translateY(-50%); }
    to   { opacity: 1; transform: translateX(0) translateY(-50%); }
  }
  .sidebar-nav::-webkit-scrollbar { width: 3px; }
  .sidebar-nav::-webkit-scrollbar-track { background: transparent; }
  .sidebar-nav::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 99px; }

  .sidebar-toggle-btn {
    transition: background 0.15s, box-shadow 0.15s, transform 0.2s;
  }
  .sidebar-toggle-btn:hover {
    background: #eff6ff !important;
    box-shadow: 0 4px 14px rgba(59,130,246,0.2) !important;
    transform: scale(1.1) !important;
  }

  .sidebar-trigger { transition: background 0.13s; }
  .sidebar-trigger:hover { background: #eff6ff !important; }
  .sidebar-trigger:hover .trigger-icon { color: #3b82f6 !important; }
  .sidebar-trigger:hover .trigger-label { color: #1e40af !important; }

  .sidebar-standalone-link { transition: background 0.13s, color 0.13s; }
  .sidebar-standalone-link:hover { background: #eff6ff !important; color: #1e40af !important; }
  .sidebar-standalone-link:hover svg { color: #3b82f6 !important; }
  .sidebar-standalone-link.active { background: #dbeafe !important; color: #1e40af !important; font-weight: 500 !important; }
  .sidebar-standalone-link.active svg { color: #3b82f6 !important; }

  .sidebar-sub-link {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.38rem 0.6rem; border-radius: 8px;
    text-decoration: none; font-size: 0.82rem; font-weight: 400;
    color: #64748b; transition: background 0.13s, color 0.13s;
    white-space: nowrap; line-height: 1.2;
  }
  .sidebar-sub-link::before {
    content: ''; display: inline-block; width: 5px; height: 5px;
    border-radius: 50%; background: transparent; flex-shrink: 0; transition: background 0.15s;
  }
  .sidebar-sub-link:hover { background: #eff6ff; color: #1e40af; }
  .sidebar-sub-link:hover::before { background: #bfdbfe; }
  .sidebar-sub-link.active { background: #dbeafe; color: #1e40af; font-weight: 500; }
  .sidebar-sub-link.active::before { background: #3b82f6; }

  /* Tooltip shown on collapsed hover */
  .sidebar-tooltip-wrap { position: relative; }
  .sidebar-tooltip-wrap:hover .sidebar-tooltip,
  .sidebar-trigger:hover .sidebar-tooltip,
  .sidebar-user-area:hover .sidebar-tooltip {
    opacity: 1;
    animation: tooltipIn 0.15s ease forwards;
  }

  .close-btn:hover { background: #eff6ff !important; }

  .mobile-menu-btn {
    display: none; align-items: center; justify-content: center;
    width: 36px; height: 36px; border: none; background: transparent;
    border-radius: 8px; cursor: pointer; color: #3b82f6; transition: background 0.15s;
  }
  .mobile-menu-btn:hover { background: #eff6ff; }

  @media (max-width: 768px) {
    .sidebar-toggle-btn { display: none !important; }
    .close-btn { display: flex !important; }
    .mobile-menu-btn { display: flex !important; }
    .sidebar-container {
      position: fixed !important; left: 0 !important; top: 0 !important;
      z-index: 1001 !important; width: ${EXPANDED_W}px !important;
    }
  }
  @media (min-width: 769px) {
    .close-btn { display: none !important; }
    .mobile-menu-btn { display: none !important; }
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

/* ─── Nav Data ────────────────────────────────────────────── */
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
    height: 144,
    links: [
      { name: 'Docs',      path: '/dashboard/developer/docs' },
      { name: 'Keys',      path: '/dashboard/developer/keys' },
      { name: 'Analytics', path: '/dashboard/developer/analytics' },
    ],
  },
]

/* ─── Component ───────────────────────────────────────────── */
const Sidebar = ({ isMobileOpen, onCloseMobile, onOpenMobile }) => {
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
  const isMobile = window.innerWidth <= 768

  /* ── Styles ── */
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
    ...(isMobile ? {
      position: 'fixed',
      left: 0, top: 0,
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
    padding: 0,
  }

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    height: '60px',
    padding: collapsed ? '0' : '0 0.85rem',
    justifyContent: collapsed ? 'center' : 'space-between',
    borderBottom: '1.5px solid rgba(59, 130, 246, 0.08)',
    flexShrink: 0,
    overflow: 'hidden',
    transition: 'padding 0.28s',
  }

  const logoMarkStyle = {
    width: '34px',
    height: '34px',
    minWidth: '34px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #3b82f6, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(59,130,246,0.25)',
  }

  const navStyle = {
    flex: 1,
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0.5rem 0 0.75rem',
    display: 'flex',
    flexDirection: 'column',
  }

  const dividerStyle = {
    height: '1px',
    background: 'rgba(59, 130, 246, 0.07)',
    margin: `0.35rem ${collapsed ? '10px' : '0.6rem'}`,
    transition: 'margin 0.28s',
    flexShrink: 0,
  }

  const sectionGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
    padding: `0 ${collapsed ? '6px' : '6px'}`,
  }

  const sectionLabelStyle = {
    fontSize: '0.62rem',
    fontWeight: 700,
    letterSpacing: '0.11em',
    textTransform: 'uppercase',
    color: '#94a3b8',
    padding: collapsed ? '0' : '0.85rem 0.75rem 0.3rem',
    opacity: collapsed ? 0 : 1,
    maxHeight: collapsed ? '0' : '2rem',
    overflow: 'hidden',
    transition: 'opacity 0.18s ease, max-height 0.28s ease, padding 0.28s ease',
    pointerEvents: 'none',
    lineHeight: 1.2,
  }

  const userAreaStyle = {
    borderTop: '1.5px solid rgba(59, 130, 246, 0.08)',
    padding: collapsed ? '0.65rem 6px' : '0.65rem 0.75rem',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.55rem',
    overflow: 'hidden',
    transition: 'padding 0.28s',
    justifyContent: collapsed ? 'center' : 'flex-start',
    position: 'relative',
  }

  const avatarStyle = {
    width: '30px',
    height: '30px',
    minWidth: '30px',
    borderRadius: '50%',
    background: user?.profileImage
      ? `url(${user.profileImage}) center/cover`
      : 'linear-gradient(135deg, #3b82f6, #1e40af)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: user?.profileImage ? 'transparent' : 'white',
    fontSize: '0.75rem',
    fontWeight: 700,
    flexShrink: 0,
    fontFamily: "'Courier New', monospace",
  }

  const getTriggerStyle = (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    padding: collapsed ? '0.55rem 0' : '0.48rem 0.6rem',
    border: 'none',
    background: !collapsed && isOpen ? '#eff6ff' : 'transparent',
    borderRadius: '9px',
    cursor: 'pointer',
    textAlign: 'left',
    justifyContent: collapsed ? 'center' : 'flex-start',
    gap: collapsed ? '0' : '0.55rem',
    position: 'relative',
    transition: 'background 0.13s, padding 0.28s',
  })

  const getTriggerIconStyle = (isOpen) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    color: isOpen ? '#3b82f6' : '#64748b',
    transition: 'color 0.15s',
    width: '17px',
    height: '17px',
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
    padding: '0.1rem 0 0.25rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1px',
  }

  const getStandaloneLinkStyle = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: collapsed ? '0' : '0.55rem',
    padding: collapsed ? '0.55rem 0' : '0.48rem 0.6rem',
    borderRadius: '9px',
    textDecoration: 'none',
    color: '#334155',
    fontSize: '0.875rem',
    fontWeight: 400,
    whiteSpace: 'nowrap',
    justifyContent: collapsed ? 'center' : 'flex-start',
    position: 'relative',
    lineHeight: 1.2,
    transition: 'background 0.13s, color 0.13s, padding 0.28s',
  })

  const standaloneIconStyle = {
    width: '17px',
    height: '17px',
    color: '#64748b',
    flexShrink: 0,
    transition: 'color 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
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

  /* ── Render helpers ── */
  const renderSection = (section) => {
    const isOpen = openKey === section.key
    return (
      <div key={section.key} style={{ position: 'relative' }} className="sidebar-tooltip-wrap">
        <button
          style={getTriggerStyle(isOpen)}
          className="sidebar-trigger"
          onClick={() => toggle(section.key)}
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

  const renderStandalone = (name, path, Icon) => (
    <div key={path} style={{ position: 'relative' }} className="sidebar-tooltip-wrap">
      <NavLink
        to={path}
        className="sidebar-standalone-link"
        style={getStandaloneLinkStyle()}
        onClick={handleLinkClick}
      >
        <Icon style={standaloneIconStyle} />
        <span style={standaloneLabelStyle}>{name}</span>
        {collapsed && <Tooltip>{name}</Tooltip>}
      </NavLink>
    </div>
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          onClick={onCloseMobile}
          style={{
            display: isMobileOpen ? 'block' : 'none',
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 45, 107, 0.35)',
            backdropFilter: 'blur(2px)',
            zIndex: 1000,
          }}
        />
      )}

      <aside style={containerStyle} className="sidebar-container">
        {/* Desktop collapse toggle */}
        <button
          style={toggleBtnStyle}
          className="sidebar-toggle-btn"
          onClick={() => setCollapsed(c => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            style={{
              width: 13,
              height: 13,
              transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />
        </button>

        {/* Header */}
        <div style={headerStyle}>
          {collapsed ? (
            <div style={logoMarkStyle} onClick={() => setCollapsed(false)} title="Expand">
              <Database style={{ width: 16, height: 16, color: 'white' }} />
            </div>
          ) : (
            <>
              <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '0.55rem', minWidth: 0 }}>
                <div style={logoMarkStyle}>
                  <Database style={{ width: 16, height: 16, color: 'white' }} />
                </div>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: '#1e40af',
                  whiteSpace: 'nowrap',
                  lineHeight: 1.2,
                }}>
                  PersonalDB
                </span>
              </Link>
              <button
                className="close-btn"
                style={{
                  width: '28px', height: '28px', border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  borderRadius: '6px', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: '#3b82f6', flexShrink: 0, transition: 'background 0.15s',
                }}
                onClick={onCloseMobile}
              >
                <X style={{ width: 17, height: 17 }} />
              </button>
            </>
          )}
        </div>

        {/* Nav */}
        <nav style={navStyle} className="sidebar-nav">

          {/* ── Group 1: Dashboard ── */}
          <div style={sectionGroupStyle}>
            {renderStandalone('Dashboard', '/dashboard', MdOutlineDashboard)}
          </div>

          <div style={dividerStyle} />

          {/* ── Group 2: Vault, Portfolio, Developer ── */}
          <div style={sectionGroupStyle}>
            {sections.map(renderSection)}
          </div>

          <div style={dividerStyle} />

          {/* ── Group 3: Profile / Settings ── */}
          <div style={sectionGroupStyle}>
            {renderStandalone('Account', '/dashboard/account', User)}
            {renderStandalone('Port Settings', '/dashboard/portsettings', RiUserSettingsLine)}
            {renderStandalone('Settings', '/dashboard/settings', Settings)}
          </div>

          <div style={dividerStyle} />

          {/* ── Group 4: Public Profile + Contact ── */}
          <div style={sectionGroupStyle}>
            <div style={{ position: 'relative' }} className="sidebar-tooltip-wrap">
              <NavLink
                to={`/u/${user?.username}`}
                className="sidebar-standalone-link"
                style={getStandaloneLinkStyle()}
                onClick={handleLinkClick}
                target="_blank"
              >
                <Globe style={standaloneIconStyle} />
                <span style={standaloneLabelStyle}>Public Profile</span>
                {collapsed && <Tooltip>Public Profile</Tooltip>}
              </NavLink>
            </div>
            {renderStandalone('Contact', '/dashboard/contact', Mail)}
          </div>

          {/* ── Admin section ── */}
          {isAdmin && (
            <>
              <div style={dividerStyle} />
              <p style={sectionLabelStyle}>Admin</p>
              <div style={sectionGroupStyle}>
                <div style={{ position: 'relative' }} className="sidebar-tooltip-wrap">
                  <button
                    style={getTriggerStyle(openKey === 'admin')}
                    className="sidebar-trigger"
                    onClick={() => toggle('admin')}
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

                  <div style={getSubMenuStyle(openKey === 'admin', 110)}>
                    <div style={subInnerStyle}>
                      <NavLink to="/dashboard/admin/templates" className="sidebar-sub-link" onClick={handleLinkClick}>
                        <LayoutGrid size={13} style={{ marginRight: '3px' }} />
                        Templates
                      </NavLink>
                      <NavLink to="/dashboard/admin/users" className="sidebar-sub-link" onClick={handleLinkClick}>
                        <Users size={13} style={{ marginRight: '3px' }} />
                        Users
                      </NavLink>
                      <NavLink to="/dashboard/admin/reviews" className="sidebar-sub-link" onClick={handleLinkClick}>
                        <MessageSquare size={13} style={{ marginRight: '3px' }} />
                        Pending Reviews
                      </NavLink>
                      <NavLink to="/dashboard/admin/unused" className="sidebar-sub-link" onClick={handleLinkClick}>
                        <AlertTriangle size={13} style={{ marginRight: '3px' }} />
                        Unused Users
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </nav>

        {/* User area */}
        <div style={userAreaStyle} className="sidebar-user-area">
          <div style={avatarStyle}>{!user?.profileImage && user?.username?.[0]?.toUpperCase()}</div>
          <div style={{
            flex: 1, overflow: 'hidden',
            opacity: collapsed ? 0 : 1,
            width: collapsed ? '0' : 'auto',
            transition: 'opacity 0.18s ease, width 0.28s ease',
            pointerEvents: 'none',
            display: 'flex', flexDirection: 'column', gap: '0.15rem',
          }}>
            <span style={{ display: 'block', fontSize: '0.82rem', fontWeight: 500, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
              {user?.username}
            </span>
            {isAdmin && (
              <span style={{ display: 'block', fontSize: '0.68rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.2 }}>
                👑 {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
              </span>
            )}
          </div>
          <div style={{
            flexShrink: 0,
            opacity: collapsed ? 0 : 1,
            width: collapsed ? '0' : 'auto',
            overflow: 'hidden',
            transition: 'opacity 0.18s ease, width 0.28s ease',
            pointerEvents: collapsed ? 'none' : 'auto',
          }}>
            <ThemeToggle />
          </div>
          {collapsed && <Tooltip>{user?.username}</Tooltip>}
        </div>
      </aside>
    </>
  )
}

export default Sidebar