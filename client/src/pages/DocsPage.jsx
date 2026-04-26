import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import {
  BookOpen, Code, Lock, FileText, Zap, Users,
  ChevronRight, Copy, Check, ArrowLeft,
  Bug, Lightbulb, MessageCircle, CreditCard, ShieldAlert, HelpCircle,
  Briefcase, GraduationCap, Rocket, Star, Award,
  Globe, Smartphone, Key, Search,
  File, Image, Video, Archive, StickyNote,
  CheckCircle2, ExternalLink, Folder, Tag, Pin, Clock, Eye, AlertCircle, Filter,
  Layers, Grid2X2
} from 'lucide-react';

const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
`;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

/* ── Shell ──────────────────────────────────────────────── */

const Page = styled.div`
  min-height: 100vh;
  background: #f4f6fd;
  font-family: 'DM Sans', sans-serif;
  color: #1e293b;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(244,246,253,0.92);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid #e2e8f0;
  padding: 0 2rem;
  height: 58px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e3a8a;
  text-decoration: none;
  letter-spacing: -0.2px;
  span { color: #3b82f6; }
`;

const BackBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  padding: 7px 14px;
  border-radius: 8px;
  border: 1px solid #dde3ef;
  background: white;
  transition: all 0.15s ease;

  &:hover {
    color: #1e40af;
    border-color: #bfdbfe;
    background: #eff6ff;
  }
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  gap: 20px;
  width: 100%;
  padding: 28px 24px 80px;
  align-items: start;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

/* ── Sidebar ────────────────────────────────────────────── */

const Sidebar = styled.aside`
  background: white;
  border: 1px solid #e4eaf5;
  border-radius: 14px;
  padding: 18px 14px;
  position: sticky;
  top: 74px;
  animation: ${slideLeft} 0.4s ease both;

  @media (max-width: 900px) { display: none; }
`;

const SideLabel = styled.p`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #94a3b8;
  margin: 0 6px 10px;
`;

const NavBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 9px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13.5px;
  font-family: 'DM Sans', sans-serif;
  font-weight: ${p => p.$active ? '600' : '400'};
  color: ${p => p.$active ? '#1e40af' : '#4b5563'};
  background: ${p => p.$active ? '#eff6ff' : 'transparent'};
  border: ${p => p.$active ? '1px solid #bfdbfe' : '1px solid transparent'};
  cursor: pointer;
  text-align: left;
  transition: all 0.15s ease;
  margin-bottom: 2px;

  .ico {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    background: ${p => p.$active ? 'linear-gradient(135deg,#3b82f6,#1e40af)' : '#f1f5f9'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${p => p.$active ? 'white' : '#64748b'};
    flex-shrink: 0;
    transition: all 0.15s ease;
  }

  &:hover:not([data-active]) {
    background: #f8fafc;
    color: #1e40af;
  }
`;

/* ── Content area ───────────────────────────────────────── */

const Content = styled.main`
  animation: ${fadeUp} 0.4s ease both;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e4eaf5;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 16px rgba(30,64,175,0.04);
`;

const CardTop = styled.div`
  padding: 32px 36px 26px;
  border-bottom: 1px solid #f0f4fb;
  background: linear-gradient(180deg,#fafbff,white);

  @media (max-width: 600px) { padding: 24px 20px 20px; }
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
`;

const CardTitle = styled.h1`
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.4px;
  margin: 0 0 8px;
`;

const CardSub = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 0;
  line-height: 1.6;
  font-weight: 400;
  max-width: 520px;
`;

const CardBody = styled.div`
  padding: 32px 36px;
  @media (max-width: 600px) { padding: 24px 20px; }
`;

/* ── Typography helpers ─────────────────────────────────── */

const H2 = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.1px;
  margin: 28px 0 12px;
  &:first-child { margin-top: 0; }
`;

const Prose = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.75;
  margin: 0 0 16px;
  font-weight: 400;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #f0f4fb;
  margin: 28px 0;
`;

/* ── Feature grid ───────────────────────────────────────── */

const FGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
`;

const FCard = styled.div`
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.15s, box-shadow 0.15s, transform 0.15s;

  &:hover {
    border-color: #bfdbfe;
    box-shadow: 0 6px 20px rgba(30,64,175,0.08);
    transform: translateY(-2px);
  }
`;

const FIco = styled.div`
  width: 38px;
  height: 38px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e40af;
  margin-bottom: 12px;
`;

const FTitle = styled.h3`
  font-size: 13.5px;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 5px;
`;

const FDesc = styled.p`
  font-size: 12.5px;
  color: #64748b;
  line-height: 1.55;
  margin: 0;
`;

/* ── TOC grid ───────────────────────────────────────────── */

const TOCGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
  margin-bottom: 8px;
`;

const TOCItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  background: #f8faff;
  border: 1px solid #e4eaf5;
  border-radius: 9px;
  font-size: 13px;
  color: #1e40af;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #eff6ff;
    border-color: #bfdbfe;
    transform: translateX(2px);
  }

  svg { flex-shrink: 0; }
`;

/* ── Bullet list ────────────────────────────────────────── */

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const BulletRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13.5px;
  color: #374151;

  .ico {
    width: 30px;
    height: 30px;
    min-width: 30px;
    background: #eff6ff;
    border-radius: 7px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e40af;
  }
`;

/* ── Portfolio section grid ─────────────────────────────── */

const PortGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin: 12px 0;

  @media (max-width: 500px) { grid-template-columns: repeat(2, 1fr); }
`;

const PortChip = styled.div`
  background: #f8faff;
  border: 1px solid #e4eaf5;
  border-radius: 10px;
  padding: 16px 14px;
  text-align: center;

  .ico {
    width: 34px;
    height: 34px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e40af;
    margin: 0 auto 8px;
  }

  strong { display: block; font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 2px; }
  span   { font-size: 11.5px; color: #64748b; }
`;

/* ── Tip list ───────────────────────────────────────────── */

const TipList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Tip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: #f8faff;
  border-left: 3px solid #3b82f6;
  border-radius: 0 8px 8px 0;
  font-size: 13.5px;
  color: #374151;
  line-height: 1.5;

  .num {
    font-size: 11px;
    font-weight: 700;
    color: #3b82f6;
    background: #dbeafe;
    border-radius: 5px;
    min-width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1px;
    flex-shrink: 0;
  }
`;

/* ── Vault storage grid ─────────────────────────────────── */

const SecurityBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 22px;
  margin-top: 20px;

  h4 {
    font-size: 13.5px;
    font-weight: 700;
    color: #15803d;
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 7px;
  }
`;

const SecItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  font-size: 13.5px;
  color: #166534;
  border-bottom: 1px solid rgba(134,239,172,0.3);
  &:last-child { border-bottom: none; }

  .dot {
    width: 18px;
    height: 18px;
    background: #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
  }
`;

/* ── Code block ─────────────────────────────────────────── */

const CodeWrap = styled.div`
  background: #0f172a;
  border-radius: 12px;
  overflow: hidden;
  margin: 16px 0;
`;

const CodeBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 18px;
  background: #1e293b;
  border-bottom: 1px solid #334155;
`;

const CodeLang = styled.span`
  font-size: 11.5px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CopyBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #334155;
  color: #94a3b8;
  border: none;
  padding: 5px 11px;
  border-radius: 6px;
  font-size: 12px;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover   { background: #475569; color: white; }
  &.copied  { background: #166534; color: #86efac; }
`;

const Pre = styled.pre`
  margin: 0;
  padding: 22px;
  color: #e2e8f0;
  font-size: 13px;
  line-height: 1.7;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
`;

/* ── FAQ ────────────────────────────────────────────────── */

const FAQItem = styled.div`
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 10px;
  transition: border-color 0.15s;

  &:hover { border-color: #bfdbfe; }
`;

const FAQQ = styled.div`
  padding: 16px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  background: #fafbff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  svg { flex-shrink: 0; color: #3b82f6; }
`;

const FAQA = styled.div`
  padding: 14px 20px;
  font-size: 13.5px;
  color: #4b5563;
  line-height: 1.7;
  background: white;
  border-top: 1px solid #f0f4fb;
`;

/* ── CTA ────────────────────────────────────────────────── */

const CTA = styled.div`
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  border-radius: 16px;
  padding: 44px 40px;
  text-align: center;
  color: white;

  h3 {
    font-size: 22px;
    font-weight: 700;
    margin: 0 0 10px;
    letter-spacing: -0.3px;
  }
  p {
    font-size: 14.5px;
    color: rgba(255,255,255,0.75);
    margin: 0 0 24px;
  }
`;

const CTABtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: white;
  color: #1e40af;
  padding: 12px 28px;
  border-radius: 9px;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  transition: all 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0,0,0,0.25);
  }
`;

/* ══════════════════════════════════════════════════════════ */

export default function DocsPage() {
  const [copied, setCopied]           = useState(null);
  const [active, setActive]           = useState('intro');

  const copy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const nav = [
    { id: 'intro',     label: 'Getting Started', Icon: BookOpen },
    { id: 'features',  label: 'Features',         Icon: Zap },
    { id: 'portfolio', label: 'Portfolio',         Icon: FileText },
    { id: 'vault',     label: 'Vault',             Icon: Lock },
    { id: 'api',       label: 'API Reference',     Icon: Code },
    { id: 'faq',       label: 'FAQ',               Icon: Users },
  ];

  return (
    <>
      <GlobalStyle />
      <Page>
        <Header>
          <Logo to="/">Personal<span>DB</span></Logo>
          <BackBtn to="/"><ArrowLeft size={14} /> Back to Home</BackBtn>
        </Header>

        <Layout>
          {/* ── Sidebar ── */}
          <Sidebar>
            <SideLabel>Documentation</SideLabel>
            {nav.map(({ id, label, Icon }) => (
              <NavBtn key={id} $active={active === id} onClick={() => setActive(id)}>
                <span className="ico"><Icon size={13} /></span>
                {label}
              </NavBtn>
            ))}
          </Sidebar>

          {/* ── Main content ── */}
          <Content>

            {/* ── Getting Started ── */}
            {active === 'intro' && (
              <>
              <Card>
                <CardTop>
                  <Badge><BookOpen size={11} /> Documentation</Badge>
                  <CardTitle>Getting Started</CardTitle>
                  <CardSub>Everything you need to know to start using PersonalDB in minutes.</CardSub>
                </CardTop>
                <CardBody>
                  <H2>Quick Navigation</H2>
                  <TOCGrid>
                    {['What is PersonalDB?', 'Creating Your Account', 'Your First Portfolio', 'Organizing Your Vault'].map(t => (
                      <TOCItem key={t}><ChevronRight size={13} /> {t}</TOCItem>
                    ))}
                  </TOCGrid>

                  <Divider />

                  <H2>What is PersonalDB?</H2>
                  <Prose>
                    PersonalDB is an all-in-one digital platform designed to help individuals manage, organize, and share their professional and personal information securely. Unlike traditional solutions that require multiple tools, PersonalDB combines a secure personal vault with a professional portfolio builder in one unified interface.
                  </Prose>
                  <Prose>
                    Whether you're a freelancer showcasing your projects, a student organizing your achievements, or a professional managing confidential documents, PersonalDB provides an intuitive and secure environment built specifically for individuals. Our platform is designed with privacy and security at its core, ensuring your data remains under your control at all times.
                  </Prose>

                  <H2>Why Choose PersonalDB?</H2>
                  <BulletList>
                    {[
                      { Icon: Lock,       text: 'End-to-end encryption ensures only you can access your data' },
                      { Icon: FileText,   text: 'Multiple professional portfolio templates to match your style' },
                      { Icon: Globe,      text: 'Custom domain support for a personalized online presence' },
                      { Icon: Search,     text: 'Instant full-text search across all your content' },
                      { Icon: Smartphone, text: 'Fully responsive design works perfectly on any device' },
                      { Icon: Key,        text: 'Two-factor authentication available for enhanced security' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Creating Your Account</H2>
                  <Prose>
                    Getting started with PersonalDB is simple and takes less than 2 minutes. Follow these steps to create your account:
                  </Prose>
                  <TipList>
                    {[
                      'Visit the registration page and enter your desired username, email, and password',
                      'Create a strong password (minimum 6 characters recommended) to protect your account',
                      'Verify your email address by clicking the verification link sent to your inbox',
                      'Complete your profile with a profile picture and brief bio',
                      'You\'re ready to start using PersonalDB!'
                    ].map((tip, i) => (
                      <Tip key={i}>
                        <span className="num">{i + 1}</span>
                        {tip}
                      </Tip>
                    ))}
                  </TipList>

                  <Divider />

                  <H2>Your First Portfolio</H2>
                  <Prose>
                    After creating your account, you can immediately start building your portfolio. Choose from our collection of professionally designed templates, or start with a blank canvas and customize it to your preferences.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: FileText, text: 'Select a template that matches your professional style and industry' },
                      { Icon: Briefcase, text: 'Add your profile information, experience, education, and skills' },
                      { Icon: Rocket, text: 'Showcase your projects with images, descriptions, and links' },
                      { Icon: Globe, text: 'Configure your public profile and choose a custom domain' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Organizing Your Vault</H2>
                  <Prose>
                    The Personal Vault is your secure storage space for documents, photos, files, and personal data - any file type you want to keep private and encrypted.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Archive, text: 'Create folders and subfolders to organize your files logically' },
                      { Icon: Image, text: 'Upload documents, images, videos, and other file types securely' },
                      { Icon: Lock, text: 'Set custom access controls and protect any file with passwords' },
                      { Icon: Search, text: 'Use our powerful search to quickly find files by name or content' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>
                </CardBody>
              </Card>
              </>
            )}

            {/* ── Features ── */}
            {active === 'features' && (
              <>
              <Card>
                <CardTop>
                  <Badge><Zap size={11} /> Core Features</Badge>
                  <CardTitle>Everything You Need</CardTitle>
                  <CardSub>Explore the powerful features that make PersonalDB your go-to platform for digital organization.</CardSub>
                </CardTop>
                <CardBody>
                  <H2>Key Features Overview</H2>
                  <FGrid>
                    {[
                      { Icon: Lock,       title: 'Secure Vault',      desc: 'End-to-end encrypted storage for your confidential documents, photos, and memories.' },
                      { Icon: FileText,   title: 'Portfolio Builder',  desc: 'Create stunning professional portfolios with fully customizable templates.' },
                      { Icon: Globe,      title: 'Public Profiles',    desc: 'Share your profile publicly with custom domain support and built-in SEO.' },
                      { Icon: Search,     title: 'Fast Search',        desc: 'Instant search across all stored items and portfolio data.' },
                      { Icon: Smartphone, title: 'Responsive Design',  desc: 'Seamlessly access your vault from any device, anywhere, anytime.' },
                      { Icon: Key,        title: 'Two-Factor Auth',    desc: 'Extra security layer with optional two-factor authentication via TOTP.' },
                    ].map(({ Icon, title, desc }) => (
                      <FCard key={title}>
                        <FIco><Icon size={17} /></FIco>
                        <FTitle>{title}</FTitle>
                        <FDesc>{desc}</FDesc>
                      </FCard>
                    ))}
                  </FGrid>

                  <Divider />

                  <H2>Feature Deep Dive</H2>

                  <H2>🔒 Secure Vault Storage</H2>
                  <Prose>
                    Your vault is a completely private space where you can store anything you want to keep confidential. Every file is encrypted using industry-standard encryption, and only you have access to your vault.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Lock, text: 'Military-grade AES-256 encryption for all files' },
                      { Icon: Archive, text: 'Unlimited folder structure for perfect organization' },
                      { Icon: Smartphone, text: 'Access from desktop, tablet, or smartphone' },
                      { Icon: Search, text: 'Full-text search to find anything instantly' },
                      { Icon: FileText, text: 'Support for all file types and sizes' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>🎨 Portfolio Builder</H2>
                  <Prose>
                    Create a professional portfolio that stands out. Our builder features multiple carefully designed templates and an easy-to-use editor that requires no coding knowledge.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: FileText, text: '10+ professionally designed templates' },
                      { Icon: Rocket, text: 'Drag-and-drop editor with live preview' },
                      { Icon: Globe, text: 'Custom domain integration' },
                      { Icon: Zap, text: 'Mobile-first responsive design' },
                      { Icon: Star, text: 'Built-in SEO optimization' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>🌍 Public Profile Sharing</H2>
                  <Prose>
                    Share your portfolio with the world. You can make your profile public, set it to private, or share specific sections. Custom domains and social media integration make it easy for others to find and share your work.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Globe, text: 'Custom domain support (yourname.com, etc.)' },
                      { Icon: Link, text: 'Shareable direct links to your portfolio' },
                      { Icon: Search, text: 'Built-in SEO for better search visibility' },
                      { Icon: ExternalLink, text: 'Social media integration buttons' },
                      { Icon: Smartphone, text: 'Beautiful mobile presentation' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>⚡ Advanced Search</H2>
                  <Prose>
                    Find anything in seconds. Our search engine indexes all your content and delivers results instantly, supporting both simple keyword searches and advanced filters.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Search, text: 'Real-time search results as you type' },
                      { Icon: Filter, text: 'Advanced filtering by file type, date, and more' },
                      { Icon: Zap, text: 'Lightweight and fast — indexed search technology' },
                      { Icon: FileText, text: 'Full-text search including document content' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>
                </CardBody>
              </Card>
              </>
            )}

            {/* ── Portfolio ── */}
            {active === 'portfolio' && (
              <>
              <Card>
                <CardTop>
                  <Badge><FileText size={11} /> Portfolio</Badge>
                  <CardTitle>Building Your Portfolio</CardTitle>
                  <CardSub>Create and customize a professional portfolio that truly represents your work and career.</CardSub>
                </CardTop>
                <CardBody>
                  <H2>Getting Started with Your Portfolio</H2>
                  <Prose>
                    Your portfolio is your digital storefront. It's where potential employers, clients, and collaborators can learn about your skills, experience, and projects. PersonalDB makes it easy to create a stunning, professional portfolio in minutes.
                  </Prose>

                  <H2>Portfolio Sections</H2>
                  <Prose>Your portfolio can include multiple sections to showcase your complete professional journey:</Prose>

                  <PortGrid>
                    {[
                      { Icon: Users,       title: 'Profile',         desc: 'Bio & info' },
                      { Icon: Briefcase,   title: 'Experience',      desc: 'Work history' },
                      { Icon: GraduationCap, title: 'Education',     desc: 'Degrees' },
                      { Icon: Rocket,      title: 'Projects',        desc: 'Showcase work' },
                      { Icon: Star,        title: 'Skills',          desc: 'Expertise areas' },
                      { Icon: Award,       title: 'Certifications',  desc: 'Credentials' },
                    ].map(({ Icon, title, desc }) => (
                      <PortChip key={title}>
                        <div className="ico"><Icon size={16} /></div>
                        <strong>{title}</strong>
                        <span>{desc}</span>
                      </PortChip>
                    ))}
                  </PortGrid>

                  <Divider />

                  <H2>Creating Your Profile Section</H2>
                  <Prose>
                    Your profile is the first thing visitors see. Make a great impression with a professional headshot, compelling headline, and engaging bio. Include links to your social media profiles and other online presence.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Image, text: 'Upload a high-quality professional headshot' },
                      { Icon: FileText, text: 'Write a compelling headline that summarizes your expertise' },
                      { Icon: Briefcase, text: 'Add a detailed bio highlighting your unique value proposition' },
                      { Icon: Link, text: 'Include links to LinkedIn, GitHub, Twitter, and other profiles' },
                      { Icon: Globe, text: 'Specify your location and contact information' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Adding Experience</H2>
                  <Prose>
                    List your professional experience in reverse chronological order (most recent first). For each position, include the job title, company name, dates, and a detailed description of your responsibilities and achievements.
                  </Prose>
                  <TipList>
                    {[
                      'Use action verbs (Led, Managed, Developed, Designed) to describe your achievements',
                      'Include quantifiable results when possible (e.g., "Increased sales by 30%")',
                      'Add relevant technologies and tools you used in each role',
                      'Highlight your key accomplishments rather than just listing duties',
                      'Update your experience as you take on new roles and responsibilities'
                    ].map((tip, i) => (
                      <Tip key={i}>
                        <span className="num">{i + 1}</span>
                        {tip}
                      </Tip>
                    ))}
                  </TipList>

                  <Divider />

                  <H2>Showcasing Your Projects</H2>
                  <Prose>
                    Projects are one of the best ways to demonstrate your skills and capabilities. Include screenshots, descriptions, and links to live projects or code repositories.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Rocket, text: 'Upload high-quality screenshots or demo videos' },
                      { Icon: FileText, text: 'Write detailed descriptions of the problem and your solution' },
                      { Icon: Code, text: 'Link to GitHub repositories or live project URLs' },
                      { Icon: Star, text: 'Highlight the technologies and tools you used' },
                      { Icon: Award, text: 'Share the impact or results of your projects' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Portfolio Best Practices</H2>
                  <TipList>
                    {[
                      'Keep your profile information accurate and up-to-date at all times.',
                      'Use high-quality images and write detailed, engaging descriptions for each entry.',
                      'Add relevant links to projects and external profiles like GitHub or LinkedIn.',
                      'Preview your portfolio before making it public to ensure everything looks right.',
                      'Include a call-to-action or contact information to make it easy for opportunities to reach you.',
                      'Update your portfolio regularly with new projects, skills, and experience.',
                      'Choose a template that matches your industry and personal style.',
                    ].map((tip, i) => (
                      <Tip key={i}>
                        <span className="num">{i + 1}</span>
                        {tip}
                      </Tip>
                    ))}
                  </TipList>

                  <Divider />

                  <H2>Using Templates</H2>
                  <Prose>
                    PersonalDB includes multiple professionally designed templates to choose from. Each template is fully customizable, allowing you to adjust colors, fonts, layout, and content sections to match your personal brand.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: FileText, text: 'Choose from 10+ professionally designed templates' },
                      { Icon: Zap, text: 'Customize colors to match your brand' },
                      { Icon: Layers, text: 'Select from a variety of modern fonts' },
                      { Icon: Grid2X2, text: 'Adjust layout and section order' },
                      { Icon: Star, text: 'Preview changes in real-time' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>
                </CardBody>
              </Card>
              </>
            )}

            {/* ── Vault ── */}
            {active === 'vault' && (
              <>
              <Card>
                <CardTop>
                  <Badge><Lock size={11} /> Vault</Badge>
                  <CardTitle>Personal Vault</CardTitle>
                  <CardSub>Securely store and organize your important files, memories, and documents in one place.</CardSub>
                </CardTop>
                <CardBody>
                  <H2>Your Secure Storage Solution</H2>
                  <Prose>
                    Your Personal Vault is a completely private, encrypted storage space designed to keep any file type safe and organized. Unlike cloud storage services that may analyze your data, PersonalDB ensures complete privacy through end-to-end encryption.
                  </Prose>

                  <H2>What You Can Store</H2>
                  <FGrid>
                    {[
                      { Icon: File,     title: 'Documents',  desc: 'PDFs, Word docs, spreadsheets and more' },
                      { Icon: Image,    title: 'Images',     desc: 'Photos, artwork and screenshots' },
                      { Icon: Video,    title: 'Media',      desc: 'Videos and audio recordings' },
                      { Icon: Archive,  title: 'Archives',   desc: 'Backups and compressed files' },
                    ].map(({ Icon, title, desc }) => (
                      <FCard key={title}>
                        <FIco><Icon size={17} /></FIco>
                        <FTitle>{title}</FTitle>
                        <FDesc>{desc}</FDesc>
                      </FCard>
                    ))}
                  </FGrid>

                  <Divider />

                  <H2>Security Features</H2>
                  <SecurityBox>
                    <h4><CheckCircle2 size={16} /> Enterprise-Grade Security</h4>
                    {[
                      'End-to-end encryption for all stored files',
                      'Secure password protection on every entry',
                      'Automatic daily backups to prevent data loss',
                      'Full activity logs and audit trails',
                      '30-day trash retention for deleted items',
                      'Two-factor authentication for account protection',
                      'Regular security audits and updates',
                    ].map((item, i) => (
                      <SecItem key={i}>
                        <span className="dot"><Check size={10} /></span>
                        {item}
                      </SecItem>
                    ))}
                  </SecurityBox>

                  <Divider />

                  <H2>Organizing Your Files</H2>
                  <Prose>
                    Keep your vault organized with unlimited folders and subfolders. Create a structure that makes sense for your needs, whether that's by document type, date, project, or any other system you prefer.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Folder, text: 'Create unlimited folders and subfolders' },
                      { Icon: FileText, text: 'Organize by category, date, project, or any system you prefer' },
                      { Icon: Tag, text: 'Add tags and labels to files for easier searching' },
                      { Icon: Pin, text: 'Pin important files to the top for quick access' },
                      { Icon: Archive, text: 'Archive old files to keep your vault clean' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Uploading and Managing Files</H2>
                  <Prose>
                    Uploading files to your vault is simple and intuitive. Drag and drop files, or use the file browser to select files from your computer. Your files are encrypted immediately upon upload.
                  </Prose>
                  <TipList>
                    {[
                      'Drag and drop files directly into your vault for quick uploads',
                      'Select multiple files at once to upload in bulk',
                      'Add descriptions and metadata to your files for better organization',
                      'Set file-level permissions to control who can access each file',
                      'Use versioning to keep track of file changes over time'
                    ].map((tip, i) => (
                      <Tip key={i}>
                        <span className="num">{i + 1}</span>
                        {tip}
                      </Tip>
                    ))}
                  </TipList>

                  <Divider />

                  <H2>File Types and Limits</H2>
                  <Prose>
                    PersonalDB supports virtually all file types. Depending on your plan, you have different storage limits. The free plan includes 5 GB of storage, with premium plans offering significantly more space.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: File, text: 'Documents: PDF, Word, Excel, PowerPoint, Text files' },
                      { Icon: Image, text: 'Images: JPG, PNG, GIF, WebP, SVG' },
                      { Icon: Video, text: 'Videos: MP4, WebM, MOV, AVI (up to 2GB per file)' },
                      { Icon: Archive, text: 'Archives: ZIP, RAR, 7Z, TAR' },
                      { Icon: Code, text: 'Code: All programming language files' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Search and Retrieval</H2>
                  <Prose>
                    Find any file instantly with our powerful search feature. Search by filename, content, tags, or any metadata you've added. Results appear in real-time as you type.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Search, text: 'Real-time search as you type' },
                      { Icon: Filter, text: 'Advanced filtering by date, type, size, and more' },
                      { Icon: FileText, text: 'Full-text search including document content' },
                      { Icon: Tag, text: 'Search by tags and custom metadata' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Sharing Files Securely</H2>
                  <Prose>
                    Need to share a file with someone? Generate secure, time-limited share links without compromising security. Recipients can download the file without creating an account.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Link, text: 'Generate shareable links for individual files' },
                      { Icon: Clock, text: 'Set expiration dates on shared links' },
                      { Icon: Key, text: 'Optionally protect shared links with passwords' },
                      { Icon: Eye, text: 'Track download activity and view count' },
                      { Icon: FileText, text: 'Download multiple files as a ZIP archive' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Best Practices for Vault Management</H2>
                  <TipList>
                    {[
                      'Organize your vault with a clear folder structure from the start',
                      'Use descriptive filenames and add metadata to files for easy searching',
                      'Regularly review and delete outdated files to save space',
                      'Create backups of critical files outside of PersonalDB',
                      'Use strong, unique passwords and enable two-factor authentication',
                      'Review your shared links regularly and revoke access when no longer needed',
                      'Keep your PersonalDB account information secure and private'
                    ].map((tip, i) => (
                      <Tip key={i}>
                        <span className="num">{i + 1}</span>
                        {tip}
                      </Tip>
                    ))}
                  </TipList>
                </CardBody>
              </Card>
              </>
            )}

            {/* ── API ── */}
            {active === 'api' && (
              <>
              <Card>
                <CardTop>
                  <Badge><Code size={11} /> API Reference</Badge>
                  <CardTitle>Developer API</CardTitle>
                  <CardSub>Integrate PersonalDB with your applications using our clean, predictable REST API.</CardSub>
                </CardTop>
                <CardBody>
                  <H2>Getting Started with the API</H2>
                  <Prose>
                    The PersonalDB API allows developers to programmatically access and manage portfolio and vault data. Our RESTful API is designed to be simple, intuitive, and powerful.
                  </Prose>

                  <H2>Base URL</H2>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>Endpoint</CodeLang>
                      <CopyBtn onClick={() => copy('https://api.personaldb.josan.tech/api', 'url')} className={copied === 'url' ? 'copied' : ''}>
                        {copied === 'url' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                      </CopyBtn>
                    </CodeBar>
                    <Pre><code>https://api.personaldb.josan.tech/api</code></Pre>
                  </CodeWrap>

                  <Divider />

                  <H2>Authentication</H2>
                  <Prose>All API requests require authentication using your API key in the Authorization header. You can generate API keys from your account settings.</Prose>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>Header</CodeLang>
                      <CopyBtn onClick={() => copy('Authorization: Bearer YOUR_API_KEY', 'auth')} className={copied === 'auth' ? 'copied' : ''}>
                        {copied === 'auth' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                      </CopyBtn>
                    </CodeBar>
                    <Pre><code>Authorization: Bearer YOUR_API_KEY</code></Pre>
                  </CodeWrap>

                  <Divider />

                  <H2>Common Headers</H2>
                  <Prose>Include these headers with all API requests:</Prose>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>Headers</CodeLang>
                      <CopyBtn onClick={() => copy(`Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
Accept: application/json`, 'headers')} className={copied === 'headers' ? 'copied' : ''}>
                        {copied === 'headers' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                      </CopyBtn>
                    </CodeBar>
                    <Pre><code>{`Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
Accept: application/json`}</code></Pre>
                  </CodeWrap>

                  <Divider />

                  <H2>Example Request</H2>
                  <Prose>Here's how to fetch your portfolio profile using JavaScript:</Prose>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>JavaScript</CodeLang>
                      <CopyBtn
                        onClick={() => copy(`const response = await fetch(
  'https://api.personaldb.josan.tech/api/portfolio/profile',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
console.log(data);`, 'code')}
                        className={copied === 'code' ? 'copied' : ''}
                      >
                        {copied === 'code' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                      </CopyBtn>
                    </CodeBar>
                    <Pre><code>{`const response = await fetch(
  'https://api.personaldb.josan.tech/api/portfolio/profile',
  {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);
const data = await response.json();
console.log(data);`}</code></Pre>
                  </CodeWrap>

                  <Divider />

                  <H2>Example Request in Python</H2>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>Python</CodeLang>
                      <CopyBtn
                        onClick={() => copy(`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.personaldb.josan.tech/api/portfolio/profile',
    headers=headers
)

data = response.json()
print(data)`, 'python')}
                        className={copied === 'python' ? 'copied' : ''}
                      >
                        {copied === 'python' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                      </CopyBtn>
                    </CodeBar>
                    <Pre><code>{`import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.personaldb.josan.tech/api/portfolio/profile',
    headers=headers
)

data = response.json()
print(data)`}</code></Pre>
                  </CodeWrap>

                  <Divider />

                  <H2>API Endpoints</H2>
                  <Prose>PersonalDB provides endpoints for managing your portfolio and vault:</Prose>
                  <BulletList>
                    {[
                      { Icon: FileText, text: 'GET /portfolio/profile - Retrieve your portfolio profile' },
                      { Icon: Briefcase, text: 'GET /portfolio/experience - List all experience entries' },
                      { Icon: Rocket, text: 'GET /portfolio/projects - List all projects' },
                      { Icon: GraduationCap, text: 'GET /portfolio/education - List all education entries' },
                      { Icon: Lock, text: 'GET /vault/files - List vault files' },
                      { Icon: Archive, text: 'POST /vault/upload - Upload a file to vault' },
                      { Icon: Search, text: 'GET /search - Full-text search across content' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Error Handling</H2>
                  <Prose>The API returns standard HTTP status codes. Here are the most common:</Prose>
                  <BulletList>
                    {[
                      { Icon: CheckCircle2, text: '200 OK - Request successful' },
                      { Icon: CheckCircle2, text: '201 Created - Resource created successfully' },
                      { Icon: AlertCircle, text: '400 Bad Request - Invalid parameters or request format' },
                      { Icon: AlertCircle, text: '401 Unauthorized - Missing or invalid API key' },
                      { Icon: AlertCircle, text: '403 Forbidden - Insufficient permissions' },
                      { Icon: AlertCircle, text: '404 Not Found - Resource not found' },
                      { Icon: AlertCircle, text: '500 Server Error - Internal server error' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>

                  <Divider />

                  <H2>Rate Limiting</H2>
                  <Prose>
                    To ensure fair usage and system stability, the PersonalDB API enforces rate limits. Standard limits are 100 requests per 15 minutes. Premium API plans offer higher limits.
                  </Prose>
                  <BulletList>
                    {[
                      { Icon: Zap, text: 'Free Tier: 100 requests per 15 minutes' },
                      { Icon: Zap, text: 'Pro Tier: 1,000 requests per 15 minutes' },
                      { Icon: Zap, text: 'Enterprise: Custom limits based on agreement' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>
                </CardBody>
              </Card>
              </>
            )}

            {/* ── FAQ ── */}
            {active === 'faq' && (
              <>
              <Card>
                <CardTop>
                  <Badge><Users size={11} /> FAQ</Badge>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardSub>Answers to questions we hear most often from our users.</CardSub>
                </CardTop>
                <CardBody>
                  {[
                    { q: 'Is my data encrypted?',            a: 'Yes, all data is encrypted end-to-end using industry-standard AES-256 encryption. Only you have access to your vault and portfolio — not even our team can view your files. Your password is never stored in plaintext and is hashed using bcrypt.' },
                    { q: 'Can I share my portfolio publicly?', a: 'Absolutely. You can create a public profile with a custom domain to share your portfolio with employers, clients, or the world. You can also choose to keep it private or share only specific sections.' },
                    { q: 'What file types can I store?',      a: 'You can store virtually any file type including documents (PDF, Word, Excel), images (JPG, PNG, GIF), videos (MP4, WebM), audio files, code files, and archives. Supported types include: PDF, DOCX, XLSX, PPTX, JPG, PNG, GIF, MP4, MOV, ZIP, RAR, and many others.' },
                    { q: 'How do I recover a deleted item?',  a: 'Deleted items go to the Bin and are retained for 30 days. You can restore them from the Bin at any point before permanent removal. After 30 days, items are permanently deleted and cannot be recovered.' },
                    { q: 'Is there a storage limit?',         a: 'Storage limits depend on your plan. The free plan includes 5 GB. Premium plans offer significantly more storage: Pro plan includes 100 GB, and Enterprise plans offer unlimited storage with custom terms.' },
                    { q: 'How do I enable two-factor authentication?', a: 'You can enable 2FA from your account settings. PersonalDB supports Time-based One-Time Password (TOTP) authentication via apps like Google Authenticator, Microsoft Authenticator, or Authy. Once enabled, you\'ll need to provide a 6-digit code when logging in.' },
                    { q: 'Can I use PersonalDB on mobile devices?',  a: 'Yes, PersonalDB is fully responsive and works seamlessly on all devices including smartphones and tablets. You can access your portfolio and vault from any device with an internet connection.' },
                    { q: 'How do I update my portfolio?',     a: 'Your portfolio can be updated at any time from your account dashboard. You can add or edit experience, projects, education, skills, and other sections. Changes are published immediately or can be scheduled for later.' },
                    { q: 'Can I export my data?',            a: 'Yes, you can export your portfolio as a PDF or HTML file. For vault files, you can download individual files or multiple files as a ZIP archive. PersonalDB respects your data ownership.' },
                    { q: 'What payment methods do you accept?', a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and cryptocurrency payments. All payments are processed securely through industry-standard payment gateways.' },
                    { q: 'Is there a free trial for premium plans?', a: 'Yes, you get a 14-day free trial of all premium features when you first sign up. No credit card required for the trial. After the trial ends, your account reverts to the free plan unless you choose to subscribe.' },
                    { q: 'How do I cancel my subscription?', a: 'You can cancel your subscription anytime from your account settings. Your account will revert to the free plan at the end of the billing period. You\'ll still have access to your data.' },
                    { q: 'Is my data backed up?', a: 'Yes, your data is automatically backed up daily to geographically distributed servers. We maintain multiple redundant backups to ensure your data is always protected and recoverable.' },
                    { q: 'Can I have multiple portfolios?', a: 'Currently, PersonalDB supports one primary portfolio per account. However, you can create multiple portfolio versions or drafts and switch between them. Custom domain mapping allows different subdomains for different portfolio themes.' },
                    { q: 'How do I contact support?', a: 'You can contact our support team through the support form in your account settings, via email at support@personaldb.josan.tech, or through our live chat. Most inquiries are answered within 24 hours.' },
                  ].map(({ q, a }) => (
                    <FAQItem key={q}>
                      <FAQQ>{q} <ChevronRight size={16} /></FAQQ>
                      <FAQA>{a}</FAQA>
                    </FAQItem>
                  ))}
                </CardBody>
              </Card>
              </>
            )}

            <CTA>
              <h3>Ready to get started?</h3>
              <p>Join thousands of users organizing their digital life with PersonalDB.</p>
              <CTABtn to="/register"><ExternalLink size={14} /> Create Free Account</CTABtn>
            </CTA>

          </Content>
        </Layout>
      </Page>
    </>
  );
}