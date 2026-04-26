import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import {
  FileText, Lock, BookOpen, Play, Users, Shield, Globe, Briefcase, Heart,
  ArrowLeft, ChevronRight, Award, Rocket, Star, Code, Image, Archive, Video,
  CheckCircle2, AlertCircle, Search, Smartphone, Key, Zap, Folder, Eye, Download, 
  Upload, Trash, Share, Tag, Bell, Edit, Mail
} from 'lucide-react';

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;

const Page = styled.div`
  min-height: 100vh;
  background: #f4f6fd;
  font-family: 'DM Sans', sans-serif;
  color: #1e293b;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(244, 246, 253, 0.92);
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
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: white;
  border: 1px solid #e4eaf5;
  border-radius: 14px;
  padding: 18px 14px;
  position: sticky;
  top: 74px;
  z-index: 10;
  animation: ${slideLeft} 0.4s ease both;
  height: fit-content;

  @media (max-width: 900px) {
    display: none;
  }
`;

const SideLabel = styled.p`
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.9px;
  color: #94a3b8;
  margin: 0 6px 10px;
  padding-top: 12px;

  &:first-child {
    padding-top: 0;
  }
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

const Content = styled.main`
  animation: ${fadeUp} 0.4s ease both;
`;

const Card = styled.div`
  background: white;
  border: 1px solid #e4eaf5;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 2px 16px rgba(30, 64, 175, 0.04);
`;

const CardTop = styled.div`
  padding: 32px 36px 26px;
  border-bottom: 1px solid #f0f4fb;
  background: linear-gradient(180deg, #fafbff, white);

  @media (max-width: 600px) {
    padding: 24px 20px 20px;
  }
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
  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

const H2 = styled.h2`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.1px;
  margin: 28px 0 12px;
  &:first-child {
    margin-top: 0;
  }
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

const BulletList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0;
`;

const BulletRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 13.5px;
  color: #374151;
  line-height: 1.6;

  .ico {
    width: 24px;
    height: 24px;
    min-width: 24px;
    background: #eff6ff;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e40af;
    margin-top: 2px;
  }
`;

const Tip = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  background: #f8faff;
  border-left: 3px solid #3b82f6;
  border-radius: 0 8px 8px 0;
  font-size: 13.5px;
  color: #374151;
  line-height: 1.6;
  margin: 12px 0;

  .num {
    font-size: 11px;
    font-weight: 700;
    color: #3b82f6;
    background: #dbeafe;
    border-radius: 4px;
    min-width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

const FGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin: 16px 0;
`;

const FCard = styled.div`
  border: 1px solid #e4eaf5;
  border-radius: 12px;
  padding: 16px;
  transition: all 0.15s ease;

  &:hover {
    border-color: #bfdbfe;
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.08);
    transform: translateY(-2px);
  }

  .ico {
    width: 32px;
    height: 32px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1e40af;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    margin: 0 0 4px;
  }

  p {
    font-size: 12px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
`;

const SecurityBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 12px;
  padding: 20px;
  margin: 16px 0;

  h4 {
    font-size: 13.5px;
    font-weight: 700;
    color: #15803d;
    margin: 0 0 12px;
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
  font-size: 13px;
  color: #166534;
  border-bottom: 1px solid rgba(134, 239, 172, 0.3);

  &:last-child {
    border-bottom: none;
  }

  .dot {
    width: 16px;
    height: 16px;
    background: #16a34a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    flex-shrink: 0;
    font-size: 10px;
  }
`;

const HelpCenterPage = () => {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(() => {
    const cat = searchParams.get('cat');
    return cat || 'products';
  });
  const [activeSection, setActiveSection] = useState(() => {
    const sec = searchParams.get('sec');
    return sec || 'portfolio';
  });

  useEffect(() => {
    const cat = searchParams.get('cat');
    const sec = searchParams.get('sec');
    if (cat) setActiveCategory(cat);
    if (sec) setActiveSection(sec);
  }, [searchParams]);

  // Navigation structure
  const nav = {
    products: [
      { id: 'portfolio', label: 'Portfolio', Icon: FileText },
      { id: 'vault', label: 'Secure Vault', Icon: Lock },
    ],
    resources: [
      { id: 'documentation', label: 'Documentation', Icon: BookOpen },
      { id: 'getting-started', label: 'Getting Started', Icon: ChevronRight },
      { id: 'video-tutorials', label: 'Video Tutorials', Icon: Play },
    ],
    company: [
      { id: 'about', label: 'About Us', Icon: Heart },
      { id: 'privacy', label: 'Privacy Policy', Icon: Shield },
      { id: 'terms', label: 'Terms of Service', Icon: FileText },
    ],
  };

  const activeNav = nav[activeCategory] || [];

  return (
    <Page>
      <Header>
        <Logo to="/">Personal<span>DB</span></Logo>
        <BackBtn to="/"><ArrowLeft size={14} /> Back to Home</BackBtn>
      </Header>

      <Layout>
        {/* Sidebar */}
        <Sidebar>
          <SideLabel>Products</SideLabel>
          {nav.products.map(({ id, label, Icon }) => (
            <NavBtn
              key={id}
              $active={activeCategory === 'products' && activeSection === id}
              onClick={() => {
                setActiveCategory('products');
                setActiveSection(id);
              }}
            >
              <span className="ico"><Icon size={13} /></span>
              {label}
            </NavBtn>
          ))}

          <SideLabel>Resources</SideLabel>
          {nav.resources.map(({ id, label, Icon }) => (
            <NavBtn
              key={id}
              $active={activeCategory === 'resources' && activeSection === id}
              onClick={() => {
                setActiveCategory('resources');
                setActiveSection(id);
              }}
            >
              <span className="ico"><Icon size={13} /></span>
              {label}
            </NavBtn>
          ))}

          <SideLabel>Company</SideLabel>
          {nav.company.map(({ id, label, Icon }) => (
            <NavBtn
              key={id}
              $active={activeCategory === 'company' && activeSection === id}
              onClick={() => {
                setActiveCategory('company');
                setActiveSection(id);
              }}
            >
              <span className="ico"><Icon size={13} /></span>
              {label}
            </NavBtn>
          ))}
        </Sidebar>

        {/* Content */}
        <Content>
          {/* PORTFOLIO CONTENT */}
          {activeCategory === 'products' && activeSection === 'portfolio' && (
            <Card>
              <CardTop>
                <Badge><FileText size={11} /> Products</Badge>
                <CardTitle>Building Your Portfolio</CardTitle>
                <CardSub>Create and customize a professional portfolio that truly represents your work and career.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Getting Started with Your Portfolio</H2>
                <Prose>
                  Your portfolio is your digital storefront. It's where potential employers, clients, and collaborators can learn about your skills, experience, and projects. PersonalDB makes it easy to create a stunning, professional portfolio in minutes without any coding knowledge.
                </Prose>

                <H2>Portfolio Sections</H2>
                <Prose>Your portfolio can include multiple sections to showcase your complete professional journey:</Prose>
                <FGrid>
                  {[
                    { Icon: Users, title: 'Profile', desc: 'Bio & contact' },
                    { Icon: Briefcase, title: 'Experience', desc: 'Work history' },
                    { Icon: Briefcase, title: 'Education', desc: 'Degrees & studies' },
                    { Icon: Rocket, title: 'Projects', desc: 'Showcase work' },
                    { Icon: Star, title: 'Skills', desc: 'Expertise areas' },
                    { Icon: Award, title: 'Certifications', desc: 'Credentials' },
                  ].map(({ Icon, title, desc }) => (
                    <FCard key={title}>
                      <div className="ico"><Icon size={16} /></div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
                    </FCard>
                  ))}
                </FGrid>

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
                    { Icon: Globe, text: 'Include links to LinkedIn, GitHub, Twitter, and other profiles' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Adding Experience & Education</H2>
                <Prose>
                  List your professional experience and education in reverse chronological order (most recent first). For each position or degree, include the job title/program name, company/institution name, dates, and a detailed description.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Briefcase, text: 'Use action verbs (Led, Managed, Developed) to describe achievements' },
                    { Icon: Star, text: 'Include quantifiable results when possible (e.g., "Increased sales by 30%")' },
                    { Icon: Code, text: 'Add relevant technologies and tools you used in each role' },
                    { Icon: Award, text: 'Highlight your key accomplishments rather than just listing duties' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Showcasing Your Projects</H2>
                <Prose>
                  Projects are one of the best ways to demonstrate your skills and capabilities. Include screenshots, descriptions, and links to live projects or code repositories to give potential employers a complete picture of your work.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Image, text: 'Upload high-quality screenshots or demo videos' },
                    { Icon: FileText, text: 'Write detailed descriptions of the problem and your solution' },
                    { Icon: Code, text: 'Link to GitHub repositories or live project URLs' },
                    { Icon: Star, text: 'Highlight the technologies and tools you used' },
                    { Icon: Rocket, text: 'Share the impact or results of your projects' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Portfolio Best Practices</H2>
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

                <Divider />

                <H2>Using Templates</H2>
                <Prose>
                  PersonalDB includes multiple professionally designed templates to choose from. Each template is fully customizable, allowing you to adjust colors, fonts, layout, and content sections to match your personal brand and industry.
                </Prose>
                <BulletList>
                  {[
                    { Icon: FileText, text: 'Choose from 10+ professionally designed templates' },
                    { Icon: Zap, text: 'Customize colors to match your brand' },
                    { Icon: Globe, text: 'Select from a variety of modern fonts' },
                    { Icon: Rocket, text: 'Adjust layout and section order' },
                    { Icon: Eye, text: 'Preview changes in real-time' },
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

          {/* VAULT CONTENT - showing similar structure */}
          {activeCategory === 'products' && activeSection === 'vault' && (
            <Card>
              <CardTop>
                <Badge><Lock size={11} /> Products</Badge>
                <CardTitle>Personal Vault</CardTitle>
                <CardSub>Securely store and organize your important files, memories, and documents in one encrypted place.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Your Secure Storage Solution</H2>
                <Prose>
                  Your Personal Vault is a completely private, encrypted storage space for any file type you want to secure and organize. Unlike traditional cloud storage services, PersonalDB ensures complete privacy through end-to-end encryption. Only you have access to your vault.
                </Prose>

                <H2>What You Can Store</H2>
                <FGrid>
                  {[
                    { Icon: FileText, title: 'Documents', desc: 'PDFs, Word docs, spreadsheets' },
                    { Icon: Image, title: 'Images', desc: 'Photos, artwork, screenshots' },
                    { Icon: Video, title: 'Media', desc: 'Videos and audio recordings' },
                    { Icon: Archive, title: 'Archives', desc: 'Backups and compressed files' },
                  ].map(({ Icon, title, desc }) => (
                    <FCard key={title}>
                      <div className="ico"><Icon size={16} /></div>
                      <h3>{title}</h3>
                      <p>{desc}</p>
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
                      <span className="dot">✓</span>
                      {item}
                    </SecItem>
                  ))}
                </SecurityBox>

                <Divider />

                <H2>Organizing Your Vault</H2>
                <Prose>
                  Create a folder structure that makes sense for your files. You can organize by category, date, project, or any other system that works for you.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Folder, text: 'Create unlimited folders and subfolders' },
                    { Icon: Tag, text: 'Tag files for quick categorization' },
                    { Icon: Search, text: 'Use powerful search to find files instantly' },
                    { Icon: Eye, text: 'Preview files before opening them' },
                    { Icon: Archive, text: 'Archive old files to free up space' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>File Management</H2>
                <Prose>
                  PersonalDB provides intuitive tools for managing your files. Upload, download, delete, or share files with ease. Set custom permissions to control who can access what.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Upload, text: 'Drag and drop files to upload' },
                    { Icon: Download, text: 'Download files directly to your device' },
                    { Icon: Share, text: 'Share files with specific people via secure links' },
                    { Icon: Lock, text: 'Set password protection on any file for extra security' },
                    { Icon: Eye, text: 'Control visibility of each file' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Best Practices for Vault Security</H2>
                {[
                  'Use a strong, unique password to access your vault.',
                  'Enable two-factor authentication for added security.',
                  'Regularly back up important files outside your vault.',
                  'Review your shared file links periodically and revoke access as needed.',
                  'Use the trash folder before permanently deleting important files.',
                  'Keep your encryption keys and recovery codes safe.',
                  'Never share your master password with anyone.',
                ].map((tip, i) => (
                  <Tip key={i}>
                    <span className="num">{i + 1}</span>
                    {tip}
                  </Tip>
                ))}
              </CardBody>
            </Card>
          )}

          {/* DOCUMENTATION CONTENT */}
          {activeCategory === 'resources' && activeSection === 'documentation' && (
            <Card>
              <CardTop>
                <Badge><BookOpen size={11} /> Resources</Badge>
                <CardTitle>Complete Documentation</CardTitle>
                <CardSub>In-depth guides covering all features and functionalities of PersonalDB.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Getting Started Guide</H2>
                <Prose>
                  Welcome to PersonalDB! This guide will help you get up and running in just a few minutes. Whether you're new to portfolio building or managing personal documents, we've made it easy.
                </Prose>

                <H2>Creating Your Account</H2>
                <Prose>
                  Getting started with PersonalDB is simple and takes less than 2 minutes.
                </Prose>
                {[
                  'Visit the registration page and enter your desired username, email, and password',
                  'Create a strong password (minimum 6 characters recommended) to protect your account',
                  'Verify your email address by clicking the verification link sent to your inbox',
                  'Complete your profile with a profile picture and brief bio',
                  'You\'re ready to start using PersonalDB!',
                ].map((tip, i) => (
                  <Tip key={i}>
                    <span className="num">{i + 1}</span>
                    {tip}
                  </Tip>
                ))}

                <Divider />

                <H2>Portfolio Documentation</H2>
                <Prose>
                  Your portfolio is your professional showcase. Learn how to make the most of it with these detailed guides.
                </Prose>
                <BulletList>
                  {[
                    { Icon: FileText, text: 'Create and edit profile information' },
                    { Icon: Briefcase, text: 'Add work experience and employment history' },
                    { Icon: Briefcase, text: 'Include educational background and qualifications' },
                    { Icon: Rocket, text: 'Showcase projects with images and descriptions' },
                    { Icon: Star, text: 'List skills and areas of expertise' },
                    { Icon: Award, text: 'Display certifications and credentials' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Vault Documentation</H2>
                <Prose>
                  Learn how to securely store and manage your personal files and documents in the vault.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Folder, text: 'Create folders and organize your files' },
                    { Icon: Lock, text: 'Understand encryption and security features' },
                    { Icon: Share, text: 'Share files securely with others' },
                    { Icon: Trash, text: 'Recover deleted files from trash' },
                    { Icon: Search, text: 'Search for files using various filters' },
                    { Icon: Download, text: 'Download and export your data' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Account Settings</H2>
                <Prose>
                  Manage your account preferences, privacy settings, and security options.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Users, text: 'Update your profile information' },
                    { Icon: Key, text: 'Change your password regularly' },
                    { Icon: Shield, text: 'Enable two-factor authentication' },
                    { Icon: Eye, text: 'Control privacy and visibility settings' },
                    { Icon: Bell, text: 'Manage notification preferences' },
                    { Icon: Download, text: 'Download your data' },
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

          {/* GETTING STARTED CONTENT */}
          {activeCategory === 'resources' && activeSection === 'getting-started' && (
            <Card>
              <CardTop>
                <Badge><ChevronRight size={11} /> Resources</Badge>
                <CardTitle>Getting Started</CardTitle>
                <CardSub>Quick start guide to begin using PersonalDB in minutes.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Welcome to PersonalDB</H2>
                <Prose>
                  PersonalDB is an all-in-one platform for managing your professional identity and personal documents. With an intuitive interface and powerful features, you can build a stunning portfolio and securely store important files.
                </Prose>

                <H2>Step 1: Sign Up</H2>
                <Prose>
                  Create your account by visiting our registration page. You'll need:
                </Prose>
                <BulletList>
                  {[
                    { Icon: Users, text: 'A unique username (this will be part of your public profile URL)' },
                    { Icon: Mail, text: 'A valid email address (for account verification)' },
                    { Icon: Key, text: 'A strong password (at least 6 characters)' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Step 2: Verify Your Email</H2>
                <Prose>
                  After signing up, check your email for a verification link. Click the link to verify your account. This ensures your email is valid and helps us send you important notifications.
                </Prose>

                <Divider />

                <H2>Step 3: Complete Your Profile</H2>
                <Prose>
                  Add a profile picture and basic information. This is what visitors see first when they visit your profile.
                </Prose>

                <Divider />

                <H2>Step 4: Build Your Portfolio</H2>
                <Prose>
                  Choose a template and start building your portfolio. Add your:
                </Prose>
                <BulletList>
                  {[
                    { Icon: FileText, text: 'Professional headline and bio' },
                    { Icon: Briefcase, text: 'Work experience and employment history' },
                    { Icon: Briefcase, text: 'Education and qualifications' },
                    { Icon: Rocket, text: 'Projects and work samples' },
                    { Icon: Star, text: 'Skills and expertise' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Step 5: Use Your Vault</H2>
                <Prose>
                  Start uploading files to your secure vault. Create folders, organize your files, and rest assured they're protected with encryption.
                </Prose>

                <Divider />

                <H2>Step 6: Publish Your Profile</H2>
                <Prose>
                  When you're ready, publish your portfolio and share it with the world. You can make it public, private, or share it with specific people.
                </Prose>

                <Divider />

                <H2>Quick Tips</H2>
                {[
                  'Use a professional headshot for your profile picture.',
                  'Write clear, concise descriptions for your projects.',
                  'Update your portfolio regularly with new achievements.',
                  'Use the vault to store sensitive documents safely.',
                  'Enable two-factor authentication for extra security.',
                  'Preview your portfolio before making it public.',
                ].map((tip, i) => (
                  <Tip key={i}>
                    <span className="num">{i + 1}</span>
                    {tip}
                  </Tip>
                ))}
              </CardBody>
            </Card>
          )}

          {/* VIDEO TUTORIALS CONTENT */}
          {activeCategory === 'resources' && activeSection === 'video-tutorials' && (
            <Card>
              <CardTop>
                <Badge><Play size={11} /> Resources</Badge>
                <CardTitle>Video Tutorials</CardTitle>
                <CardSub>Learn through step-by-step video guides.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Learning by Video</H2>
                <Prose>
                  Our video tutorials walk you through common tasks and features step-by-step. Whether you prefer visual learning or need help with a specific feature, these guides have you covered.
                </Prose>

                <H2>Available Tutorials</H2>
                <FGrid>
                  {[
                    { Icon: FileText, title: 'Getting Started', duration: '5 min' },
                    { Icon: Briefcase, title: 'Portfolio Setup', duration: '8 min' },
                    { Icon: Rocket, title: 'Adding Projects', duration: '6 min' },
                    { Icon: Lock, title: 'Vault Basics', duration: '7 min' },
                    { Icon: Shield, title: 'Security Settings', duration: '5 min' },
                    { Icon: Globe, title: 'Publishing Profile', duration: '4 min' },
                  ].map(({ Icon, title, duration }) => (
                    <FCard key={title}>
                      <div className="ico"><Icon size={16} /></div>
                      <h3>{title}</h3>
                      <p>{duration}</p>
                    </FCard>
                  ))}
                </FGrid>

                <Divider />

                <H2>Tutorial Descriptions</H2>
                <Prose>
                  Each tutorial is designed to teach you a specific feature or task. You can watch them in order or jump to the tutorial you need help with.
                </Prose>

                <H2>Getting Started Tutorial</H2>
                <Prose>
                  In this introductory video, we cover everything you need to know to create an account and start using PersonalDB. Perfect for new users! Learn how to navigate the platform and find the features you need.
                </Prose>

                <H2>Portfolio Setup Tutorial</H2>
                <Prose>
                  Learn how to set up your portfolio, choose a template, and customize it to match your brand. This tutorial covers all the basics you need to get started with your professional showcase.
                </Prose>

                <H2>Advanced Features</H2>
                <Prose>
                  Once you're comfortable with the basics, explore these advanced tutorials to get the most out of PersonalDB.
                </Prose>
                <BulletList>
                  {[
                    { Icon: Zap, text: 'Custom domain setup' },
                    { Icon: Share, text: 'Advanced sharing and permissions' },
                    { Icon: Code, text: 'Embedding your portfolio' },
                    { Icon: Rocket, text: 'Tracking portfolio views' },
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

          {/* ABOUT US CONTENT */}
          {activeCategory === 'company' && activeSection === 'about' && (
            <Card>
              <CardTop>
                <Badge><Heart size={11} /> Company</Badge>
                <CardTitle>About PersonalDB</CardTitle>
                <CardSub>Learn more about our mission and the team behind PersonalDB.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Our Mission</H2>
                <Prose>
                  At PersonalDB, our mission is simple: to provide individuals with powerful, user-friendly tools to manage their professional identity and personal data securely. We believe that everyone deserves a safe, easy way to showcase their work and organize important information.
                </Prose>

                <H2>Why We Built PersonalDB</H2>
                <Prose>
                  We recognized a gap in the market. Existing solutions either focus solely on portfolio building or secure storage, but not both. Professionals had to use multiple tools, manage multiple passwords, and compromise on either functionality or security.
                </Prose>

                <Prose>
                  That's why we built PersonalDB — a unified platform that brings together the best of both worlds. Professional portfolio building with security you can trust.
                </Prose>

                <Divider />

                <H2>Our Values</H2>
                <BulletList>
                  {[
                    { Icon: Shield, text: 'Security: Your data is encrypted and protected with industry-standard security.' },
                    { Icon: Users, text: 'User-Centric: Everything we build is designed with our users in mind.' },
                    { Icon: Heart, text: 'Privacy: We believe in privacy first. We never sell or share your data.' },
                    { Icon: Zap, text: 'Innovation: We continuously improve and add new features based on user feedback.' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Our Team</H2>
                <Prose>
                  PersonalDB is built by a passionate team of developers, designers, and security experts who are committed to creating the best possible platform for personal data management. We're constantly learning, improving, and listening to our users.
                </Prose>

                <Divider />

                <H2>The Future</H2>
                <Prose>
                  We're just getting started. As we grow, we're committed to maintaining the values that make PersonalDB special: security, simplicity, and user focus. We have exciting plans for new features and improvements that will make PersonalDB even more valuable for our users.
                </Prose>

                <H2>Get Involved</H2>
                <Prose>
                  We'd love to hear from you! Have a feature request? Found a bug? Want to collaborate? Get in touch with our team at contact@personaldb.com.
                </Prose>
              </CardBody>
            </Card>
          )}

          {/* PRIVACY POLICY CONTENT */}
          {activeCategory === 'company' && activeSection === 'privacy' && (
            <Card>
              <CardTop>
                <Badge><Shield size={11} /> Company</Badge>
                <CardTitle>Privacy Policy</CardTitle>
                <CardSub>How we collect, use, and protect your personal information.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Introduction</H2>
                <Prose>
                  At PersonalDB, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
                </Prose>

                <H2>Information We Collect</H2>
                <Prose>
                  We collect information that you provide directly to us, such as when you create an account or update your profile. This may include:
                </Prose>
                <BulletList>
                  {[
                    { Icon: Users, text: 'Personal identification information (name, email, phone)' },
                    { Icon: FileText, text: 'Profile information (bio, profile picture, links)' },
                    { Icon: Briefcase, text: 'Portfolio content (experience, projects, skills)' },
                    { Icon: Archive, text: 'Files stored in your vault' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>How We Use Your Information</H2>
                <Prose>
                  We use the information we collect to:
                </Prose>
                <BulletList>
                  {[
                    { Icon: Zap, text: 'Provide and improve our services' },
                    { Icon: Mail, text: 'Send you important notifications and updates' },
                    { Icon: Shield, text: 'Protect against fraudulent activity' },
                    { Icon: Search, text: 'Analyze usage patterns to improve user experience' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Data Security</H2>
                <Prose>
                  Your vault files are encrypted end-to-end using AES-256 encryption. We also use industry-standard security practices to protect your account and personal information.
                </Prose>
                <SecurityBox>
                  <h4><Shield size={16} /> Security Measures</h4>
                  {[
                    'End-to-end encryption for vault files',
                    'HTTPS/TLS for all data in transit',
                    'Regular security audits and penetration testing',
                    'Secure password storage with hashing',
                    'Multi-factor authentication support',
                  ].map((item, i) => (
                    <SecItem key={i}>
                      <span className="dot">✓</span>
                      {item}
                    </SecItem>
                  ))}
                </SecurityBox>

                <Divider />

                <H2>Sharing Your Information</H2>
                <Prose>
                  We do not sell, trade, or rent your personal information to third parties. We only share information when necessary to provide our services or comply with legal requirements.
                </Prose>

                <Divider />

                <H2>Your Rights</H2>
                <Prose>
                  You have the right to:
                </Prose>
                <BulletList>
                  {[
                    { Icon: Eye, text: 'Access your personal data' },
                    { Icon: Edit, text: 'Correct inaccurate information' },
                    { Icon: Trash, text: 'Delete your account and data' },
                    { Icon: Download, text: 'Export your data in a readable format' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Contact Us</H2>
                <Prose>
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at privacy@personaldb.com.
                </Prose>
              </CardBody>
            </Card>
          )}

          {/* TERMS OF SERVICE CONTENT */}
          {activeCategory === 'company' && activeSection === 'terms' && (
            <Card>
              <CardTop>
                <Badge><FileText size={11} /> Company</Badge>
                <CardTitle>Terms of Service</CardTitle>
                <CardSub>Please review our terms and conditions carefully.</CardSub>
              </CardTop>
              <CardBody>
                <H2>Agreement to Terms</H2>
                <Prose>
                  By using PersonalDB, you agree to comply with these Terms of Service. If you disagree with any part of these terms, you may not use our services.
                </Prose>

                <H2>Use License</H2>
                <Prose>
                  We grant you a limited, non-exclusive, non-transferable license to use PersonalDB for personal and professional use. You may not:
                </Prose>
                <BulletList>
                  {[
                    { Icon: AlertCircle, text: 'Modify or copy the content' },
                    { Icon: AlertCircle, text: 'Use the content for commercial purposes without permission' },
                    { Icon: AlertCircle, text: 'Attempt to decompile or reverse engineer' },
                    { Icon: AlertCircle, text: 'Remove any copyright or proprietary notices' },
                    { Icon: AlertCircle, text: 'Interfere with the proper functioning of the service' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>User Content</H2>
                <Prose>
                  You retain ownership of all content you upload to PersonalDB. By uploading content, you grant us a license to store and display your public portfolio as you configure it.
                </Prose>

                <Divider />

                <H2>Prohibited Activities</H2>
                <Prose>
                  You may not:
                </Prose>
                <BulletList>
                  {[
                    { Icon: Shield, text: 'Harass or harm other users' },
                    { Icon: Shield, text: 'Hack or gain unauthorized access' },
                    { Icon: Shield, text: 'Transmit viruses or malicious code' },
                    { Icon: Shield, text: 'Engage in any illegal activity' },
                    { Icon: Shield, text: 'Violate any applicable laws or regulations' },
                  ].map(({ Icon, text }) => (
                    <BulletRow key={text}>
                      <span className="ico"><Icon size={15} /></span>
                      {text}
                    </BulletRow>
                  ))}
                </BulletList>

                <Divider />

                <H2>Limitation of Liability</H2>
                <Prose>
                  To the fullest extent permitted by law, PersonalDB shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services, even if we have been advised of the possibility of such damages.
                </Prose>

                <Divider />

                <H2>Indemnification</H2>
                <Prose>
                  You agree to indemnify and hold harmless PersonalDB, its officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the service or violation of these terms.
                </Prose>

                <Divider />

                <H2>Changes to Terms</H2>
                <Prose>
                  We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of PersonalDB constitutes your acceptance of the modified terms.
                </Prose>

                <Divider />

                <H2>Governing Law</H2>
                <Prose>
                  These Terms of Service are governed by and construed in accordance with the laws of the United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </Prose>

                <Divider />

                <H2>Contact Us</H2>
                <Prose>
                  If you have any questions about these Terms of Service, please contact us at legal@personaldb.com.
                </Prose>
              </CardBody>
            </Card>
          )}
        </Content>
      </Layout>
    </Page>
  );
};

export default HelpCenterPage;
