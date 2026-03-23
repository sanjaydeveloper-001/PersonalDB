import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import Sidebar from './Sidebar'

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
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
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <Container>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <MainContent>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </MainContent>
    </Container>
  )
}

export default MainLayout
