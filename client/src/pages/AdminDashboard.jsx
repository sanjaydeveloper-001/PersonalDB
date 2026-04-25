import { useState } from 'react'
import styled from 'styled-components'
import { LayoutGrid, Users, Settings, LogOut, MessageSquare, AlertTriangle } from 'lucide-react'
import AdminTemplates from '../components/Admin/AdminTemplates'
import AdminUsers from '../components/Admin/AdminUsers'
import AdminUnusedUsers from '../pages/admin/AdminUnusedUsers'
import PendingReviewsPanel from '../components/Admin/PendingReviewsPanel'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const Root = styled.div`
  display: flex;
  height: 100vh;
  background: #f8fafc;
`

const Sidebar = styled.aside`
  width: 250px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    display: none;
  }
`

const Logo = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 2rem;
`

const NavItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: ${({ $active }) => $active ? '#eff6ff' : 'transparent'};
  color: ${({ $active }) => $active ? '#3b82f6' : '#64748b'};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active }) => $active ? '#eff6ff' : '#f1f5f9'};
    color: ${({ $active }) => $active ? '#3b82f6' : '#0f172a'};
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const MainContent = styled.main`
  flex: 1;
  overflow-y: auto;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const AdminDashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('templates')

  // Check if user is admin
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f8fafc',
      }}>
        <div style={{
          textAlign: 'center',
          background: 'white',
          padding: '2rem',
          borderRadius: '0.875rem',
          border: '1px solid #e2e8f0',
        }}>
          <h1 style={{ color: '#dc2626', margin: '0 0 0.5rem' }}>Access Denied</h1>
          <p style={{ color: '#64748b', margin: 0 }}>You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out')
  }

  return (
    <Root>
      {/* Sidebar */}
      <Sidebar>
        <Logo>🛠️ Admin Panel</Logo>
        
        <NavItem
          $active={activeSection === 'templates'}
          onClick={() => setActiveSection('templates')}
        >
          <LayoutGrid />
          Templates
        </NavItem>

        <NavItem
          $active={activeSection === 'users'}
          onClick={() => setActiveSection('users')}
        >
          <Users />
          Users
        </NavItem>

        <NavItem
          $active={activeSection === 'reviews'}
          onClick={() => setActiveSection('reviews')}
        >
          <MessageSquare />
          Reviews
        </NavItem>

        <NavItem
          $active={activeSection === 'unused'}
          onClick={() => setActiveSection('unused')}
        >
          <AlertTriangle />
          Unused Users
        </NavItem>

        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <NavItem onClick={handleLogout}>
            <LogOut />
            Logout
          </NavItem>
        </div>
      </Sidebar>

      {/* Main Content */}
      <MainContent>
        {activeSection === 'templates' && <AdminTemplates />}
        {activeSection === 'users' && <AdminUsers />}
        {activeSection === 'reviews' && <PendingReviewsPanel />}
        {activeSection === 'unused' && <AdminUnusedUsers />}
      </MainContent>
    </Root>
  )
}

export default AdminDashboard