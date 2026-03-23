import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Home, AlertTriangle } from 'lucide-react'

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
  padding: 2rem;
`

const ContentWrapper = styled.div`
  text-align: center;
  max-width: 600px;
`

const ErrorCode = styled.div`
  font-size: 8rem;
  font-weight: 900;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 5rem;
  }
`

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;

  svg {
    color: #f97316;
    width: 80px;
    height: 80px;
  }
`

const Title = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`

const Description = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
  line-height: 1.6;
`

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  font-weight: 600;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 1rem;

  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 2rem;
    font-size: 0.95rem;
  }
`

const NotFoundPage = () => (
  <Container>
    <ContentWrapper>
      <ErrorCode>404</ErrorCode>

      <IconWrapper>
        <AlertTriangle />
      </IconWrapper>

      <Title>Page Not Found</Title>
      <Description>
        The page you're looking for doesn't exist or has been moved. Let's get you back on track!
      </Description>

      <CTAButton to="/dashboard">
        <Home size={20} />
        Go to Dashboard
      </CTAButton>
    </ContentWrapper>
  </Container>
)

export default NotFoundPage
