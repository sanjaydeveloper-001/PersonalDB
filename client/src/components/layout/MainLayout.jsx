import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { Menu, X } from 'lucide-react'
import Sidebar from './Sidebar'

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);

  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const MobileHeader = styled.div`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
  padding: 0 1rem;
  z-index: 999;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    display: flex;
  }
`

const MenuButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  padding: 0.5rem;
  transition: background 0.2s ease;
  border-radius: 6px;

  &:hover {
    background: #eff6ff;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`

const LogoText = styled.div`
  font-weight: 700;
  font-size: 1.2rem;
  color: #1e40af;
`

const MobileOverlay = styled.div`
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);

  @media (max-width: 768px) {
    padding-top: 60px;
  }
`

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  max-width: 1400px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <Container>
      <MobileHeader>
        <MenuButton onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </MenuButton>
        <LogoText>PersonalDB</LogoText>
        <div style={{ width: '40px' }} />
      </MobileHeader>

      <MobileOverlay $isOpen={sidebarOpen} onClick={closeSidebar} />

      <Sidebar  
        isMobileOpen={sidebarOpen}
        onCloseMobile={closeSidebar}
      />

      <MainContent>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </Container>
  )
}

export default MainLayout