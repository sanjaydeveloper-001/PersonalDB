import { useState } from 'react';
import styled from 'styled-components';
import { Code2, Key, BarChart3 } from 'lucide-react';
import ApiDocs from './api/ApiDocs';
import ApiKeys from './api/ApiKeys';
import ApiAnalytics from './api/ApiAnalytics';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const TitleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.625rem;
  font-weight: 700;
  font-size: 1.25rem;

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Description = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
  margin-top: -0.75rem;
`;

const TabContainer = styled.div`
  border-bottom: 2px solid #e2e8f0;
  display: flex;
  gap: 0;
  overflow-x: auto;
  padding-bottom: 0;
`;

const TabButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: ${props => props.$active ? '#3b82f6' : '#64748b'};
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  font-size: 0.95rem;

  &:hover {
    color: #3b82f6;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    transform: scaleX(${props => props.$active ? 1 : 0});
    transition: transform 0.3s ease;
  }

  svg {
    width: 1.125rem;
    height: 1.125rem;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    font-size: 0.875rem;

    svg {
      width: 1rem;
      height: 1rem;
    }
  }
`;

const ContentContainer = styled.div`
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ApiPage = () => {
  const [activeTab, setActiveTab] = useState('docs');

  return (
    <PageContainer>
      <Header>
        <div>
          <Title>
            <TitleIcon>
              <Code2 />
            </TitleIcon>
            API Management
          </Title>
          <Description>
            Manage your API keys, documentation, and usage analytics
          </Description>
        </div>
      </Header>

      <TabContainer>
        <TabButton
          $active={activeTab === 'docs'}
          onClick={() => setActiveTab('docs')}
        >
          <Code2 />
          Documentation
        </TabButton>
        <TabButton
          $active={activeTab === 'keys'}
          onClick={() => setActiveTab('keys')}
        >
          <Key />
          API Keys
        </TabButton>
        <TabButton
          $active={activeTab === 'analytics'}
          onClick={() => setActiveTab('analytics')}
        >
          <BarChart3 />
          Analytics
        </TabButton>
      </TabContainer>

      <ContentContainer>
        {activeTab === 'docs' && <ApiDocs />}
        {activeTab === 'keys' && <ApiKeys />}
        {activeTab === 'analytics' && <ApiAnalytics />}
      </ContentContainer>
    </PageContainer>
  );
};

export default ApiPage;
