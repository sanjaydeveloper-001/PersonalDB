import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { CheckCircle } from 'lucide-react'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
`

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.5rem;
  color: #1e40af;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: #1e3a8a;
  }
`

const MainContent = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`

const SuccessContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 16px;
  padding: 3rem 2.5rem;
  box-shadow: 0 10px 40px rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.1);
  text-align: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 100%;
  }
`

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  animation: scaleIn 0.6s ease-out;

  svg {
    color: white;
    width: 48px;
    height: 48px;
  }

  @keyframes scaleIn {
    from {
      transform: scale(0);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`

const Title = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const Description = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`

const InfoBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  text-align: left;

  strong {
    color: #1e40af;
    display: block;
    margin-bottom: 0.5rem;
  }

  ul {
    margin: 0.5rem 0 0 1.5rem;
    color: #0c4a6e;
    font-size: 0.9rem;

    li {
      margin-bottom: 0.4rem;
    }
  }
`

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  font-weight: 600;
  padding: 0.9rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    padding: 0.85rem 1.5rem;
  }
`

const SecurityQuestions = () => (
  <Container>
    <Header>
      <Logo to="/">PersonalDB</Logo>
    </Header>

    <MainContent>
      <SuccessContainer>
        <IconWrapper>
          <CheckCircle />
        </IconWrapper>

        <Title>Account Created Successfully!</Title>

        <Description>
          Your security questions have been saved securely. You can use them to recover your account if you ever forget your password.
        </Description>

        <InfoBox>
          <strong>Next Steps:</strong>
          <ul>
            <li>Head to your dashboard to get started</li>
            <li>Set up your portfolio or vault</li>
            <li>Customize your profile settings</li>
          </ul>
        </InfoBox>

        <CTAButton to="/dashboard">
          Go to Dashboard
        </CTAButton>
      </SuccessContainer>
    </MainContent>
  </Container>
)

export default SecurityQuestions
