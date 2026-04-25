import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Briefcase, Star, Target, Globe, Lock, Shield, Folder, Eye, Github, Twitter, Linkedin, Mail, ArrowRight, MessageSquare, Zap, Share } from 'lucide-react';
import SearchBar from '../components/common/SearchBar';
import HorizontalScrollReviews from '../components/HorizontalScrollReviews';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';

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
  gap: 2rem;

  @media (max-width: 1024px) {
    flex-wrap: wrap;
  }
`;

const Logo = styled(Link)`
  font-weight: 700;
  font-size: 1.5rem;
  color: #1e40af;
  transition: color 0.3s ease;
  flex-shrink: 0;

  &:hover {
    color: #1e3a8a;
  }
`;

const SearchBarWrapper = styled.div`
  flex: 1;
  max-width: 400px;
  min-width: 250px;

  @media (max-width: 768px) {
    max-width: 100%;
    order: 3;
    flex-basis: 100%;
    margin-top: 1rem;
  }
`;

const AuthButtons = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
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

    @media (max-width: 768px) {
      padding: 6px 14px;
      font-size: 0.85rem;
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

    @media (max-width: 768px) {
      padding: 6px 14px;
      font-size: 0.85rem;
    }
  }
`;

const DashboardButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 20px;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  text-decoration: none;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
  }

  svg {
    transition: transform 0.3s ease;
  }

  &:hover svg {
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    padding: 6px 14px;
    font-size: 0.85rem;
  }
`;

const WelcomeBadge = styled.span`
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;

  strong {
    color: #1e40af;
  }

  @media (max-width: 768px) {
    display: none;
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
  display: block;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;

const ReviewsContent = styled.div`
  position: relative;
  z-index: 1;
  margin-bottom: 2rem;
`;

const ReviewsSidebarContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 3rem;
  align-items: start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
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

const ReviewsInfoCard = styled.div`
  position: relative;
  z-index: 1;
  padding: 2rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 1px solid #fcd34d;
  margin-top: 1.5rem;

  .review-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #f59e0b, #dc2626);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    margin-bottom: 1rem;
  }

  .review-title {
    font-weight: 700;
    color: #b45309;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  .review-desc {
    color: #92400e;
    font-size: 0.9rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .review-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #d97706;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;

    &:hover {
      color: #b45309;
      transform: translateX(2px);
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

/* ── Redesigned Footer ── */
const FooterSection = styled.footer`
  background: #0f172a;
  color: #94a3b8;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #3b82f6, #1e40af, transparent);
  }
`;

const FooterTop = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 3rem;
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 2rem 3rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 3rem 1.5rem 2rem;
  }
`;

const FooterBrand = styled.div`
  .logo {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ffffff;
    margin-bottom: 1rem;
    display: inline-block;

    span {
      background: linear-gradient(135deg, #3b82f6, #60a5fa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  .tagline {
    font-size: 0.9rem;
    line-height: 1.7;
    color: #64748b;
    max-width: 260px;
    margin-bottom: 1.5rem;
  }

  .socials {
    display: flex;
    gap: 0.75rem;
  }

  .social-link {
    width: 38px;
    height: 38px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #64748b;
    transition: all 0.3s ease;
    cursor: pointer;
    text-decoration: none;

    &:hover {
      background: rgba(59, 130, 246, 0.15);
      border-color: #3b82f6;
      color: #3b82f6;
      transform: translateY(-2px);
    }

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const FooterColumn = styled.div`
  .col-title {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #ffffff;
    margin-bottom: 1.25rem;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.65rem;
  }

  li a, li span {
    font-size: 0.9rem;
    color: #64748b;
    text-decoration: none;
    transition: color 0.2s ease;
    cursor: pointer;

    &:hover {
      color: #94a3b8;
    }
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 1.5rem 2rem;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .copy {
    font-size: 0.85rem;
    color: #475569;
  }

  .badges {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .badge {
    font-size: 0.75rem;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 0.35rem;

    &::before {
      content: '•';
      color: #3b82f6;
    }
  }
`;

const Home = () => {
  const [activeTab, setActiveTab] = useState('portfolio');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const { data } = await api.get('/reviews/all?limit=10');
        setReviews(data.data || []);
        setReviewsError(null);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviewsError(error.message);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <HomeContainer>
      {/* Header */}
      <Header>
        <Logo to="/">PersonalDB</Logo>
        <SearchBarWrapper>
          <SearchBar onSelectUser={(username) => {
            console.log('User selected:', username);
          }} />
        </SearchBarWrapper>
        <AuthButtons>
          {user ? (
            <>
              <WelcomeBadge>
                Hey, <strong>{user.username}</strong>!
              </WelcomeBadge>
              <DashboardButton to="/dashboard">
                Dashboard <ArrowRight size={16} />
              </DashboardButton>
            </>
          ) : (
            <>
              <AuthButton className="login" to="/login">
                Login
              </AuthButton>
              <AuthButton className="signup" to="/register">
                Sign Up
              </AuthButton>
            </>
          )}
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
          {user ? (
            <PrimaryBtn to="/dashboard">Go to Dashboard</PrimaryBtn>
          ) : (
            <>
              <PrimaryBtn to="/register">Start for Free</PrimaryBtn>
              <SecondaryBtn to="/portfolio">Explore Features</SecondaryBtn>
            </>
          )}
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
                <p>Create stunning portfolios that showcase your profile, projects, and experience to impress employers.</p>
              </FeatureCard>
              <FeatureCard>
                <Star className="icon" size={56} strokeWidth={1.5} />
                <h3>Showcase Skills</h3>
                <p>Display your expertise and technical skills in an organized, professional manner.</p>
              </FeatureCard>
              <FeatureCard>
                <Target className="icon" size={56} strokeWidth={1.5} />
                <h3>Project Showcase</h3>
                <p>Highlight your best projects with detailed descriptions, images, and links to live demos.</p>
              </FeatureCard>
              <FeatureCard>
                <Globe className="icon" size={56} strokeWidth={1.5} />
                <h3>Custom Domain</h3>
                <p>Connect your own domain name to create a branded, professional online presence.</p>
              </FeatureCard>
              <FeatureCard>
                <Briefcase className="icon" size={56} strokeWidth={1.5} />
                <h3>Experience & Education</h3>
                <p>Showcase your work experience, education history, and career progression in detail.</p>
              </FeatureCard>
              <FeatureCard>
                <Star className="icon" size={56} strokeWidth={1.5} />
                <h3>Interests & Certifications</h3>
                <p>Display your professional certifications, interests, and areas of expertise.</p>
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
                <h3>Secure Storage</h3>
                <p>Store and protect all your important files, documents, and sensitive information safely.</p>
              </FeatureCard>
              <FeatureCard>
                <Folder className="icon" size={56} strokeWidth={1.5} />
                <h3>File Organization</h3>
                <p>Organize your files with folders, categories, and easy-to-use management tools.</p>
              </FeatureCard>
              <FeatureCard>
                <Eye className="icon" size={56} strokeWidth={1.5} />
                <h3>Privacy Control</h3>
                <p>Full control over what data you store and share with granular permission settings.</p>
              </FeatureCard>
              <FeatureCard>
                <Zap className="icon" size={56} strokeWidth={1.5} />
                <h3>Trash & Recovery</h3>
                <p>Safely delete files with a trash bin that lets you recover deleted items anytime.</p>
              </FeatureCard>
              <FeatureCard>
                <Share className="icon" size={56} strokeWidth={1.5} />
                <h3>Public File Sharing</h3>
                <p>Share files and documents publicly with anyone, even without an account.</p>
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
          <ReviewsSidebarContainer>
            <ReviewsContent>
              <HorizontalScrollReviews 
                reviews={reviews}
                loading={reviewsLoading}
                error={reviewsError}
              />
            </ReviewsContent>

            <InfoSidebar>
              <ReviewsInfoCard>
                <div className="review-icon">
                  <MessageSquare size={24} />
                </div>
                <div className="review-title">Share Your Experience</div>
                <p className="review-desc">
                  Reviews help professionals showcase their credibility. Browse portfolios and leave authentic feedback.
                </p>
                <button 
                  onClick={() => user ? navigate('/dashboard') : navigate('/login')}
                  className="review-link"
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    padding: 0, 
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: '#d97706',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {user ? 'Go to Dashboard' : 'Explore & Review'} <ArrowRight size={16} />
                </button>
              </ReviewsInfoCard>
            </InfoSidebar>
          </ReviewsSidebarContainer>
        </ReviewsContainer>
      </ReviewsSection>

      {/* CTA Section */}
      <CTASection>
        <h2>Ready to get started?</h2>
        <p>Join thousands of professionals managing their portfolios and secure data with PersonalDB</p>
        <ButtonGroup>
          {user ? (
            <PrimaryBtn to="/dashboard">Go to Dashboard</PrimaryBtn>
          ) : (
            <>
              <PrimaryBtn to="/register">Create Account</PrimaryBtn>
              <SecondaryBtn to="/login">Sign In</SecondaryBtn>
            </>
          )}
        </ButtonGroup>
      </CTASection>

      {/* Footer */}
      <FooterSection>
        <FooterTop>
          <FooterBrand>
            <div className="logo">Personal<span>DB</span></div>
            <p className="tagline">
              Your all-in-one platform for professional portfolio building and secure personal data management.
            </p>
            <div className="socials">
              <a className="social-link" href="#"><Github /></a>
              <a className="social-link" href="#"><Twitter /></a>
              <a className="social-link" href="#"><Linkedin /></a>
              <a className="social-link" href="#"><Mail /></a>
            </div>
          </FooterBrand>

          <FooterColumn>
            <div className="col-title">Product</div>
            <ul>
              <li><span>Portfolio</span></li>
              <li><span>Secure Vault</span></li>
              <li><span>Resume Builder</span></li>
              <li><span>Analytics</span></li>
              <li><span>Pricing</span></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <div className="col-title">Resources</div>
            <ul>
              <li><span>Documentation</span></li>
              <li><span>Getting Started</span></li>
              <li><span>Video Tutorials</span></li>
              <li><span>Blog</span></li>
              <li><span>Changelog</span></li>
            </ul>
          </FooterColumn>

          <FooterColumn>
            <div className="col-title">Company</div>
            <ul>
              <li><span>About Us</span></li>
              <li><span>Careers</span></li>
              <li><span>Privacy Policy</span></li>
              <li><span>Terms of Service</span></li>
              <li><span>Contact</span></li>
            </ul>
          </FooterColumn>
        </FooterTop>

        <FooterBottom>
          <p className="copy">&copy; {new Date().getFullYear()} PersonalDB. All rights reserved.</p>
          <div className="badges">
            <span className="badge">SOC 2 Compliant</span>
            <span className="badge">256-bit Encryption</span>
            <span className="badge">GDPR Ready</span>
          </div>
        </FooterBottom>
      </FooterSection>
    </HomeContainer>
  );
};

export default Home;