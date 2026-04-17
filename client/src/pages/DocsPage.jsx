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
  CheckCircle2, ExternalLink
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
  max-width: 1120px;
  margin: 0 auto;
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
                    PersonalDB combines a secure personal vault with a professional portfolio builder. Whether you're managing important documents, showcasing your achievements, or organizing your digital life — PersonalDB provides an intuitive and secure environment built for individuals.
                  </Prose>

                  <H2>Key Features</H2>
                  <BulletList>
                    {[
                      { Icon: Lock,       text: 'Encrypted storage for sensitive files' },
                      { Icon: FileText,   text: 'Professional portfolio templates and builder' },
                      { Icon: Globe,      text: 'Public profile sharing with custom domains' },
                      { Icon: Search,     text: 'Lightning-fast search across everything' },
                      { Icon: Smartphone, text: 'Fully responsive — works on any device' },
                      { Icon: Key,        text: 'Optional two-factor authentication' },
                    ].map(({ Icon, text }) => (
                      <BulletRow key={text}>
                        <span className="ico"><Icon size={15} /></span>
                        {text}
                      </BulletRow>
                    ))}
                  </BulletList>
                </CardBody>
              </Card>
            )}

            {/* ── Features ── */}
            {active === 'features' && (
              <Card>
                <CardTop>
                  <Badge><Zap size={11} /> Core Features</Badge>
                  <CardTitle>Everything You Need</CardTitle>
                  <CardSub>Explore the powerful features that make PersonalDB your go-to platform for digital organization.</CardSub>
                </CardTop>
                <CardBody>
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
                </CardBody>
              </Card>
            )}

            {/* ── Portfolio ── */}
            {active === 'portfolio' && (
              <Card>
                <CardTop>
                  <Badge><FileText size={11} /> Portfolio</Badge>
                  <CardTitle>Building Your Portfolio</CardTitle>
                  <CardSub>Create and customize a professional portfolio that truly represents your work and career.</CardSub>
                </CardTop>
                <CardBody>
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

                  <H2>Tips for Success</H2>
                  <TipList>
                    {[
                      'Keep your profile information accurate and up-to-date at all times.',
                      'Use high-quality images and write detailed, engaging descriptions for each entry.',
                      'Add relevant links to projects and external profiles like GitHub or LinkedIn.',
                      'Preview your portfolio before making it public to ensure everything looks right.',
                    ].map((tip, i) => (
                      <Tip key={i}>
                        <span className="num">{i + 1}</span>
                        {tip}
                      </Tip>
                    ))}
                  </TipList>
                </CardBody>
              </Card>
            )}

            {/* ── Vault ── */}
            {active === 'vault' && (
              <Card>
                <CardTop>
                  <Badge><Lock size={11} /> Vault</Badge>
                  <CardTitle>Personal Vault</CardTitle>
                  <CardSub>Securely store and organize your important files, memories, and documents in one place.</CardSub>
                </CardTop>
                <CardBody>
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

                  <SecurityBox>
                    <h4><CheckCircle2 size={16} /> Security Guarantees</h4>
                    {[
                      'End-to-end encryption for all stored files',
                      'Secure password protection on every entry',
                      'Automatic daily backups',
                      'Full activity logs and audit trails',
                      '30-day trash retention for deleted items',
                    ].map((item, i) => (
                      <SecItem key={i}>
                        <span className="dot"><Check size={10} /></span>
                        {item}
                      </SecItem>
                    ))}
                  </SecurityBox>
                </CardBody>
              </Card>
            )}

            {/* ── API ── */}
            {active === 'api' && (
              <Card>
                <CardTop>
                  <Badge><Code size={11} /> API Reference</Badge>
                  <CardTitle>Developer API</CardTitle>
                  <CardSub>Integrate PersonalDB with your applications using our clean, predictable REST API.</CardSub>
                </CardTop>
                <CardBody>
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

                  <H2>Authentication</H2>
                  <Prose>All API requests require authentication using your API key in the Authorization header:</Prose>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>Header</CodeLang>
                      <CopyBtn onClick={() => copy('Authorization: Bearer YOUR_API_KEY', 'auth')} className={copied === 'auth' ? 'copied' : ''}>
                        {copied === 'auth' ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
                      </CopyBtn>
                    </CodeBar>
                    <Pre><code>Authorization: Bearer YOUR_API_KEY</code></Pre>
                  </CodeWrap>

                  <H2>Example Request</H2>
                  <CodeWrap>
                    <CodeBar>
                      <CodeLang>JavaScript</CodeLang>
                      <CopyBtn
                        onClick={() => copy(`const response = await fetch(\n  'https://api.personaldb.josan.tech/api/portfolio/profile',\n  {\n    method: 'GET',\n    headers: {\n      'Authorization': 'Bearer YOUR_API_KEY',\n      'Content-Type': 'application/json'\n    }\n  }\n);\nconst data = await response.json();`, 'code')}
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
const data = await response.json();`}</code></Pre>
                  </CodeWrap>
                </CardBody>
              </Card>
            )}

            {/* ── FAQ ── */}
            {active === 'faq' && (
              <Card>
                <CardTop>
                  <Badge><Users size={11} /> FAQ</Badge>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardSub>Answers to questions we hear most often from our users.</CardSub>
                </CardTop>
                <CardBody>
                  {[
                    { q: 'Is my data encrypted?',            a: 'Yes, all data is encrypted end-to-end. Only you can access your vault and portfolio — not even our team can view your files.' },
                    { q: 'Can I share my portfolio publicly?', a: 'Absolutely. You can create a public profile with a custom domain to share your portfolio with employers, clients, or the world.' },
                    { q: 'What file types can I store?',      a: 'You can store most file types including documents, images, videos, and archives. Check your plan settings for specific limits.' },
                    { q: 'How do I recover a deleted item?',  a: 'Deleted items go to the Bin and are retained for 30 days. You can restore them from the Bin at any point before permanent removal.' },
                    { q: 'Is there a storage limit?',         a: 'Storage limits depend on your plan. The free plan includes 5 GB. Premium plans offer significantly more storage and advanced features.' },
                  ].map(({ q, a }) => (
                    <FAQItem key={q}>
                      <FAQQ>{q} <ChevronRight size={16} /></FAQQ>
                      <FAQA>{a}</FAQA>
                    </FAQItem>
                  ))}
                </CardBody>
              </Card>
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