import { Outlet } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'

const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  min-height: 100vh;
`

const Header = styled.div`
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.5rem 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 28px;
    height: 28px;
    color: #3b82f6;
  }
`

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.5rem 0 0;
`

const Content = styled.main`
  flex: 1;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const AdminLayout = () => {
  const { user } = useAuth()

  // Check if user is admin
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return (
      <Root>
        <Header>
          <Title>⛔ Access Denied</Title>
        </Header>
        <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            textAlign: 'center',
            background: 'white',
            padding: '2rem',
            borderRadius: '0.875rem',
            border: '1px solid #e2e8f0',
          }}>
            <h2 style={{ color: '#dc2626', margin: '0 0 0.5rem' }}>Access Denied</h2>
            <p style={{ color: '#64748b', margin: 0 }}>You do not have permission to access this page.</p>
          </div>
        </Content>
      </Root>
    )
  }

  return (
    <Root>
      <Content>
        <Outlet />
      </Content>
    </Root>
  )
}

export default AdminLayout