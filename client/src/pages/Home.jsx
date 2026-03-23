import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Briefcase, FileText, Star, Target, BarChart3, Globe, Lock, Shield, Folder, Key, Eye, RefreshCw } from 'lucide-react';

const HomeContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #ffffff 0%, #f0f4f8 100%);
`;

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
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.5rem;
  color: #1e40af;
  transition: color 0.3s ease;

  &:hover {
    color: #1e3a8a;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const AuthButton = styled(Link)`
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &.login {
    color: #1e40af;
    border: 1.5px solid #1e40af;
    background: transparent;

    &:hover {
      background: #eff6ff;
    }
  }

  &.signup {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }
  }
`;

const HeroSection = styled.section`
  padding: 80px 2rem 100px;
  text-align: center;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 800px;
    height: 800px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const ExperienceSelector = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;

  .label {
    font-size: 0.95rem;
    color: #64748b;
    font-weight: 500;
  }

  .buttons {
    display: flex;
    gap: 0.5rem;
    background: rgba(203, 213, 225, 0.3);
    padding: 0.5rem;
    border-radius: 8px;
    border: 1px solid rgba(59, 130, 246, 0.2);
  }

  button {
    padding: 8px 20px;
    border: none;
    background: transparent;
    color: #64748b;
    font-weight: 500;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.95rem;

    &.active {
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      color: white;
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }

    &:hover:not(.active) {
      color: #1e40af;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const HeroHeadline = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }

  .accent {
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.3rem;
  color: #64748b;
  max-width: 800px;
  margin: 0 auto 2.5rem;
  line-height: 1.8;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ButtonGroup = styled(CTAButtons)``;

const PrimaryBtn = styled(Link)`
  padding: 14px 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  text-decoration: none;
  display: inline-block;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const SecondaryBtn = styled(Link)`
  padding: 14px 40px;
  background: white;
  color: #1e40af;
  border: 2px solid #1e40af;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;

  &:hover {
    background: #eff6ff;
    transform: translateY(-3px);
  }

  @media (max-width: 768px) {
    width: 100%;
    text-align: center;
  }
`;

const HeroVisual = styled.div`
  display: none;
`;

const DashboardPreview = styled.div`
  display: none;
`;

const StatsGrid = styled.div`
  display: none;
`;

const FeaturesSection = styled.section`
  padding: 100px 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -200px;
    left: -200px;
    width: 600px;
    height: 600px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 800;
  color: #0f172a;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 2rem;
  }

  &::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1e40af);
    margin: 1.5rem auto 0;
    border-radius: 2px;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 4rem;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.8;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 2.5rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2.5rem;
  max-width: 1300px;
  margin: 0 auto;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    gap: 1.5rem;
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #3b82f6, #1e40af);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-12px);
    box-shadow: 0 20px 40px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;

    &::before {
      transform: scaleX(1);
    }

    .icon {
      transform: scale(1.15) rotate(-5deg);
      filter: brightness(1.2);
    }

    h3 {
      color: #1e40af;
    }
  }

  .icon {
    margin-bottom: 1.5rem;
    transition: all 0.4s ease;
    display: inline-block;
    color: #3b82f6;
    flex-shrink: 0;
  }

  h3 {
    font-size: 1.5rem;
    font-weight: 700;
    color: #0f172a;
    margin-bottom: 1rem;
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 1.3rem;
    }
  }

  p {
    color: #64748b;
    line-height: 1.8;
    font-size: 0.95rem;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 0.9rem;
      line-height: 1.6;
    }
  }
`;

const ReviewsSection = styled.section`
  padding: 100px 2rem;
  background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -100px;
    left: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }
`;

const ReviewsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  max-width: 1300px;
  margin: 0 auto;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ReviewsContent = styled.div`
  position: relative;
  z-index: 1;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ReviewCard = styled.div`
  padding: 2.5rem;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #3b82f6, #1e40af);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s ease;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(59, 130, 246, 0.15);
    border-color: #3b82f6;

    &::before {
      transform: scaleX(1);
    }
  }

  .stars {
    font-size: 1.2rem;
    color: #f59e0b;
    margin-bottom: 1rem;
  }

  p {
    color: #64748b;
    line-height: 1.8;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
    font-style: italic;
  }

  .author {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(59, 130, 246, 0.1);

    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #1e40af);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 700;
      font-size: 1.1rem;
    }

    .author-info {
      .name {
        font-weight: 600;
        color: #0f172a;
        font-size: 0.95rem;
      }

      .title {
        color: #64748b;
        font-size: 0.8rem;
      }
    }
  }
`;

const InfoSidebar = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  border: 1px solid rgba(59, 130, 246, 0.1);
  height: fit-content;
  sticky: 50px;

  @media (max-width: 768px) {
    position: static;
    margin-top: -2rem;
  }

  .sidebar-title {
    font-size: 0.85rem;
    color: #3b82f6;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #3b82f6;
  }

  .sidebar-items {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 0;
    color: #1e40af;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      color: #3b82f6;
      transform: translateX(4px);
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }
`;

const CTASection = styled.section`
  padding: 120px 2rem;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f0f4f8 50%, #ffffff 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 300px;
    background: radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  h2 {
    font-size: 2.8rem;
    font-weight: 800;
    color: #0f172a;
    margin-bottom: 1rem;
    letter-spacing: -0.01em;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    &::after {
      content: '';
      display: block;
      width: 80px;
      height: 4px;
      background: linear-gradient(90deg, #3b82f6, #1e40af);
      margin: 1.5rem auto 0;
      border-radius: 2px;
    }
  }

  p {
    font-size: 1.2rem;
    color: #64748b;
    max-width: 600px;
    margin: 1rem auto 3rem;
    line-height: 1.8;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      font-size: 1rem;
      margin: 1rem auto 2rem;
    }
  }
`;

const FooterSection = styled.footer`
  padding: 4rem 2rem;
  text-align: center;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-top: 1px solid rgba(59, 130, 246, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, #3b82f6, transparent);
    pointer-events: none;
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
    margin: 0;
    position: relative;
    z-index: 1;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1.5rem;
  }
`;

const Home = () => {
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <HomeContainer>
      {/* Header */}
      <Header>
        <Logo to="/">PersonalDB</Logo>
        <AuthButtons>
          <AuthButton className="login" to="/login">
            Login
          </AuthButton>
          <AuthButton className="signup" to="/register">
            Sign Up
          </AuthButton>
        </AuthButtons>
      </Header>

      {/* Hero Section */}
      <HeroSection>
        <ExperienceSelector>
          <span className="label">Switch between:</span>
          <div className="buttons">
            <button 
              className={activeTab === 'portfolio' ? 'active' : ''} 
              onClick={() => setActiveTab('portfolio')}
            >
              Portfolio Showcase
            </button>
            <button 
              className={activeTab === 'vault' ? 'active' : ''} 
              onClick={() => setActiveTab('vault')}
            >
              Secure Vault
            </button>
          </div>
        </ExperienceSelector>
        
        <HeroHeadline>
          {activeTab === 'portfolio' ? (
            <>Build Your Professional <span className="accent">Portfolio</span></>
          ) : (
            <>Protect Your Most Sensitive <span className="accent">Information</span></>
          )}
        </HeroHeadline>
        
        <HeroSubtitle>
          {activeTab === 'portfolio'
            ? 'Showcase your skills, projects, and experience to impress employers and clients'
            : 'Military-grade encryption for complete peace of mind and data security'}
        </HeroSubtitle>
        
        <ButtonGroup>
          <PrimaryBtn to="/register">Start for Free</PrimaryBtn>
          <SecondaryBtn to="/portfolio">Explore Features</SecondaryBtn>
        </ButtonGroup>
      </HeroSection>

      {/* Features Section */}
      <FeaturesSection>
        <SectionTitle>Powerful Capabilities</SectionTitle>
        <Subtitle>Everything you need to showcase and organize your professional identity</Subtitle>
        <FeatureGrid>
          {activeTab === 'portfolio' ? (
            <>
              <FeatureCard>
                <Briefcase className="icon" size={56} strokeWidth={1.5} />
                <h3>Professional Portfolio</h3>
                <p>Create stunning portfolios that showcase your projects, experience, and skills to impress employers.</p>
              </FeatureCard>
              <FeatureCard>
                <FileText className="icon" size={56} strokeWidth={1.5} />
                <h3>Resume Generator</h3>
                <p>Generate professional resumes with a single click and keep them updated automatically.</p>
              </FeatureCard>
              <FeatureCard>
                <Star className="icon" size={56} strokeWidth={1.5} />
                <h3>Showcase Skills</h3>
                <p>Display your expertise, certifications, and achievements in an organized, professional manner.</p>
              </FeatureCard>
              <FeatureCard>
                <Target className="icon" size={56} strokeWidth={1.5} />
                <h3>Project Showcase</h3>
                <p>Highlight your best projects with detailed descriptions, images, and links to live demos.</p>
              </FeatureCard>
              <FeatureCard>
                <BarChart3 className="icon" size={56} strokeWidth={1.5} />
                <h3>Analytics & Stats</h3>
                <p>Track profile views, engagement metrics, and insights about who's visiting your portfolio.</p>
              </FeatureCard>
              <FeatureCard>
                <Globe className="icon" size={56} strokeWidth={1.5} />
                <h3>Custom Domain</h3>
                <p>Connect your own domain name to create a branded, professional online presence.</p>
              </FeatureCard>
            </>
          ) : (
            <>
              <FeatureCard>
                <Lock className="icon" size={56} strokeWidth={1.5} />
                <h3>Military-Grade Encryption</h3>
                <p>Your sensitive data is protected with the highest level of encryption security available.</p>
              </FeatureCard>
              <FeatureCard>
                <Shield className="icon" size={56} strokeWidth={1.5} />
                <h3>Password Protection</h3>
                <p>Secure vault access with master password and biometric authentication options.</p>
              </FeatureCard>
              <FeatureCard>
                <Folder className="icon" size={56} strokeWidth={1.5} />
                <h3>File Storage</h3>
                <p>Store and organize documents, certificates, and files securely in unlimited storage.</p>
              </FeatureCard>
              <FeatureCard>
                <Key className="icon" size={56} strokeWidth={1.5} />
                <h3>Password Manager</h3>
                <p>Manage all your passwords safely with auto-fill and password generation tools.</p>
              </FeatureCard>
              <FeatureCard>
                <Eye className="icon" size={56} strokeWidth={1.5} />
                <h3>Privacy Control</h3>
                <p>Full control over what data you store and share with granular permission settings.</p>
              </FeatureCard>
              <FeatureCard>
                <RefreshCw className="icon" size={56} strokeWidth={1.5} />
                <h3>Sync & Backup</h3>
                <p>Automatic backup and sync across all your devices to keep data always available.</p>
              </FeatureCard>
            </>
          )}
        </FeatureGrid>
      </FeaturesSection>

      {/* Reviews Section */}
      <ReviewsSection>
        <SectionTitle>User Testimonials</SectionTitle>
        <Subtitle>Join thousands of professionals already using PersonalDB</Subtitle>
        
        <ReviewsContainer>
          <ReviewsContent>
            <ReviewsGrid>
              <ReviewCard>
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"PersonalDB has completely transformed how I manage my professional life. The portfolio builder is intuitive and the secure vault gives me peace of mind."</p>
                <div className="author">
                  <div className="avatar">AJ</div>
                  <div className="author-info">
                    <div className="name">Alex Johnson</div>
                    <div className="title">Software Engineer</div>
                  </div>
                </div>
              </ReviewCard>
              <ReviewCard>
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"The resume generator saved me hours! I can now keep my resume updated automatically from my portfolio data. Highly recommended."</p>
                <div className="author">
                  <div className="avatar">SM</div>
                  <div className="author-info">
                    <div className="name">Sarah Miller</div>
                    <div className="title">Product Designer</div>
                  </div>
                </div>
              </ReviewCard>
              <ReviewCard>
                <div className="stars">⭐⭐⭐⭐⭐</div>
                <p>"Security is top-notch. I trust PersonalDB with all my sensitive information. The organization features are amazing and user-friendly."</p>
                <div className="author">
                  <div className="avatar">MC</div>
                  <div className="author-info">
                    <div className="name">Michael Chen</div>
                    <div className="title">Data Analyst</div>
                  </div>
                </div>
              </ReviewCard>
            </ReviewsGrid>
          </ReviewsContent>

          <InfoSidebar>
            <div className="sidebar-title">More Information</div>
            <div className="sidebar-items">
              <div className="sidebar-item">
                <span>→</span>
                <span>Getting Started Guide</span>
              </div>
              <div className="sidebar-item">
                <span>→</span>
                <span>Documentation</span>
              </div>
              <div className="sidebar-item">
                <span>→</span>
                <span>Video Tutorials</span>
              </div>
              <div className="sidebar-item">
                <span>→</span>
                <span>Pricing Plans</span>
              </div>
            </div>
          </InfoSidebar>
        </ReviewsContainer>
      </ReviewsSection>

      {/* Footer */}
      <FooterSection>
        <p>&copy; 2024 PersonalDB. All rights reserved. Your privacy matters to us.</p>
      </FooterSection>
    </HomeContainer>
  );
};

export default Home;
