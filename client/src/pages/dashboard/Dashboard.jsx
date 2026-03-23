import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import {
  Lock, Briefcase, Terminal, User, Settings,
  ArrowRight, Shield, Globe, Key, FolderKanban,
  GraduationCap, BarChart3, FileCode2
} from 'lucide-react'

const Container = styled.div`
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`

const Hero = styled.div`
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 60%, #60a5fa 100%);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  color: white;
`

const HeroGreeting = styled.p`
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 0.8;
  margin: 0 0 0.5rem 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.2;

  @media (max-width: 768px) { font-size: 1.5rem; }
`

const HeroDesc = styled.p`
  font-size: 0.95rem;
  opacity: 0.85;
  margin: 0;
  max-width: 560px;
  line-height: 1.6;
`

const SectionLabel = styled.h2`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #94a3b8;
  margin: 0 0 1rem 0;
`

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

const FeatureCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 14px;
  padding: 1.5rem;
  text-decoration: none;
  transition: all 0.2s ease;
  color: inherit;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 20px rgba(59, 130, 246, 0.1);
    transform: translateY(-2px);
  }
`

const CardTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`

const CardIconWrap = styled.div`
  width: 44px; height: 44px;
  border-radius: 10px;
  background: ${props => props.$bg || '#eff6ff'};
  display: flex; align-items: center; justify-content: center;
  svg { width: 20px; height: 20px; color: ${props => props.$color || '#3b82f6'}; }
`

const CardArrow = styled(ArrowRight)`
  width: 16px; height: 16px; color: #cbd5e1;
  transition: color 0.15s, transform 0.15s;
  ${FeatureCard}:hover & { color: #3b82f6; transform: translateX(3px); }
`

const CardTitle = styled.h3`
  font-size: 1rem; font-weight: 600; color: #0f172a; margin: 0;
`

const CardDesc = styled.p`
  font-size: 0.85rem; color: #64748b; margin: 0; line-height: 1.5;
`

const SubLinkList = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.4rem; margin-top: 0.25rem;
`

const SubTag = styled.span`
  font-size: 0.72rem; font-weight: 500;
  background: #f1f5f9; color: #64748b;
  padding: 0.2rem 0.55rem; border-radius: 5px;
`

const QuickGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`

const QuickCard = styled(Link)`
  display: flex; align-items: center; gap: 0.75rem;
  background: white; border: 1px solid rgba(59,130,246,0.1);
  border-radius: 10px; padding: 1rem 1.1rem;
  text-decoration: none; color: #334155;
  font-size: 0.875rem; font-weight: 500;
  transition: all 0.15s ease;

  svg { width: 16px; height: 16px; color: #3b82f6; flex-shrink: 0; }
  &:hover { background: #eff6ff; border-color: #bfdbfe; color: #1e40af; }
`

const Dashboard = () => {
  const { user } = useAuth()

  return (
    <Container>
      {/* Hero */}
      <Hero>
        <HeroGreeting>Welcome back</HeroGreeting>
        <HeroTitle>Hello, {user?.username} 👋</HeroTitle>
        <HeroDesc>
          PersonalDB is your private workspace for securely storing items,
          building your portfolio, and managing your developer integrations —
          all in one place.
        </HeroDesc>
      </Hero>

      {/* Main features */}
      <div>
        <SectionLabel>What you can do</SectionLabel>
        <CardGrid>
          <FeatureCard to="/dashboard/vault/items">
            <CardTop>
              <CardIconWrap $bg="#eff6ff" $color="#3b82f6"><Lock /></CardIconWrap>
              <CardArrow />
            </CardTop>
            <div>
              <CardTitle>Vault</CardTitle>
              <CardDesc>
                Securely store notes, links, and files with optional password protection.
                Keep sensitive information encrypted and organised.
              </CardDesc>
            </div>
            <SubLinkList>
              <SubTag>Items</SubTag>
              <SubTag>Bin</SubTag>
              <SubTag>Public Files</SubTag>
            </SubLinkList>
          </FeatureCard>

          <FeatureCard to="/dashboard/portfolio/profile">
            <CardTop>
              <CardIconWrap $bg="#f0fdf4" $color="#16a34a"><Briefcase /></CardIconWrap>
              <CardArrow />
            </CardTop>
            <div>
              <CardTitle>Portfolio</CardTitle>
              <CardDesc>
                Build a shareable public profile. Add your education, work experience,
                projects, skills, certifications, and interests.
              </CardDesc>
            </div>
            <SubLinkList>
              <SubTag>Profile</SubTag>
              <SubTag>Education</SubTag>
              <SubTag>Experience</SubTag>
              <SubTag>Projects</SubTag>
              <SubTag>Skills</SubTag>
            </SubLinkList>
          </FeatureCard>

          <FeatureCard to="/dashboard/developer/docs">
            <CardTop>
              <CardIconWrap $bg="#faf5ff" $color="#7c3aed"><Terminal /></CardIconWrap>
              <CardArrow />
            </CardTop>
            <div>
              <CardTitle>Developer</CardTitle>
              <CardDesc>
                Explore the full REST API, manage your personal API keys,
                and track request analytics for your integrations.
              </CardDesc>
            </div>
            <SubLinkList>
              <SubTag>Docs</SubTag>
              <SubTag>API Keys</SubTag>
              <SubTag>Analytics</SubTag>
            </SubLinkList>
          </FeatureCard>

          <FeatureCard to="/dashboard/account">
            <CardTop>
              <CardIconWrap $bg="#fff7ed" $color="#ea580c"><User /></CardIconWrap>
              <CardArrow />
            </CardTop>
            <div>
              <CardTitle>Account</CardTitle>
              <CardDesc>
                View your account profile, registration details, birth year,
                and API key usage statistics.
              </CardDesc>
            </div>
            <SubLinkList>
              <SubTag>Profile info</SubTag>
              <SubTag>API key stats</SubTag>
            </SubLinkList>
          </FeatureCard>

          <FeatureCard to="/dashboard/settings">
            <CardTop>
              <CardIconWrap $bg="#fef2f2" $color="#dc2626"><Settings /></CardIconWrap>
              <CardArrow />
            </CardTop>
            <div>
              <CardTitle>Settings</CardTitle>
              <CardDesc>
                Change your password, manage your session, or permanently
                delete your account with full verification.
              </CardDesc>
            </div>
            <SubLinkList>
              <SubTag>Password</SubTag>
              <SubTag>Logout</SubTag>
              <SubTag>Delete account</SubTag>
            </SubLinkList>
          </FeatureCard>
        </CardGrid>
      </div>

      {/* Quick access */}
      <div>
        <SectionLabel>Quick access</SectionLabel>
        <QuickGrid>
          <QuickCard to="/dashboard/vault/items"><Lock />Vault items</QuickCard>
          <QuickCard to="/dashboard/portfolio/profile"><User />My profile</QuickCard>
          <QuickCard to="/dashboard/portfolio/projects"><FolderKanban />Projects</QuickCard>
          <QuickCard to="/dashboard/portfolio/education"><GraduationCap />Education</QuickCard>
          <QuickCard to="/dashboard/developer/keys"><Key />API keys</QuickCard>
          <QuickCard to="/dashboard/developer/docs"><FileCode2 />API docs</QuickCard>
          <QuickCard to="/dashboard/developer/analytics"><BarChart3 />Analytics</QuickCard>
          <QuickCard to="/dashboard/vault/public"><Globe />Public files</QuickCard>
        </QuickGrid>
      </div>
    </Container>
  )
}

export default Dashboard