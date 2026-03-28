import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'

/* ─── Injected styles for pseudo-classes & keyframes ─────── */
const styleTag = document.createElement('style')
styleTag.id = 'main-layout-styles'
styleTag.textContent = `
  @keyframes mainLayoutFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  .menu-btn:hover { background: #eff6ff !important; }
`
if (!document.head.querySelector('#main-layout-styles')) {
  document.head.appendChild(styleTag)
}

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  /* ── styles ── */
  const containerStyle = {
    display: 'flex',
    height: '100vh',
    overflow: 'hidden',
    background: 'linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%)',
  }

  const mobileHeaderStyle = {
    display: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '60px',
    background: 'white',
    borderBottom: '1px solid rgba(59, 130, 246, 0.1)',
    padding: '0 1rem',
    zIndex: 999,
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const menuBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3b82f6',
    padding: '0.5rem',
    transition: 'background 0.2s ease',
    borderRadius: '6px',
  }

  const logoTextStyle = {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: '#1e40af',
  }

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 999,
    animation: 'mainLayoutFadeIn 0.3s ease',
  }

  const mainContentStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    background: 'linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%)',
  }

  const contentWrapperStyle = {
    flex: 1,
    padding: '2rem',
    maxWidth: '1400px',
    width: '100%',
  }

  /* Mobile styles injected via a responsive style block */
  const responsiveStyle = document.createElement('style')
  responsiveStyle.id = 'main-layout-responsive'
  responsiveStyle.textContent = `
    @media (max-width: 768px) {
      .main-layout-container { flex-direction: column; }
      .mobile-header { display: flex !important; }
      .main-content { padding-top: 60px !important; }
      .content-wrapper { padding: 1rem !important; }
    }
  `
  if (!document.head.querySelector('#main-layout-responsive')) {
    document.head.appendChild(responsiveStyle)
  }

  return (
    <div style={containerStyle} className="main-layout-container">
      {/* Mobile Header */}
      <div style={mobileHeaderStyle} className="mobile-header">
        <button
          className="menu-btn"
          style={menuBtnStyle}
          onClick={() => setSidebarOpen(s => !s)}
        >
          {sidebarOpen
            ? <X style={{ width: 24, height: 24 }} />
            : <Menu style={{ width: 24, height: 24 }} />
          }
        </button>
        <div style={logoTextStyle}>PersonalDB</div>
        <div style={{ width: '40px' }} />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div style={overlayStyle} onClick={closeSidebar} />
      )}

      <Sidebar
        collapsed={false}
        onToggle={() => {}}
        isMobileOpen={sidebarOpen}
        onCloseMobile={closeSidebar}
      />

      <main style={mainContentStyle} className="main-content">
        <div style={contentWrapperStyle} className="content-wrapper">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default MainLayout