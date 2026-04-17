import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail, MapPin, Globe, Linkedin, Github, ExternalLink,
  Code2, Award, Briefcase, BookOpen, User, Home,
  AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
  Image as ImageIcon, ChevronLeft, X, FileText,
  Twitter, Instagram, Youtube, Send, Rss, AtSign,
  Trophy, Twitch, MessageCircle, Download,
} from 'lucide-react';
import { publicService } from '../services/publicService';

/* ─────────────── ICON MAP (matches backend social.icon values) ─────────────── */
const SOCIAL_ICON_MAP = {
  Github:        { icon: Github,        label: 'GitHub' },
  Linkedin:      { icon: Linkedin,      label: 'LinkedIn' },
  Twitter:       { icon: Twitter,       label: 'Twitter / X' },
  Instagram:     { icon: Instagram,     label: 'Instagram' },
  Youtube:       { icon: Youtube,       label: 'YouTube' },
  Code2:         { icon: Code2,         label: 'LeetCode' },
  Trophy:        { icon: Trophy,        label: 'Codeforces' },
  Twitch:        { icon: Twitch,        label: 'Twitch' },
  MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
  Send:          { icon: Send,          label: 'Telegram' },
  Rss:           { icon: Rss,           label: 'Blog' },
  Globe:         { icon: Globe,         label: 'Website' },
  Mail:          { icon: Mail,          label: 'Email' },
  Phone:         { icon: Phone,         label: 'Phone' },
  AtSign:        { icon: AtSign,        label: 'Other' },
  ExternalLink:  { icon: ExternalLink,  label: 'Link' },
};

/* ─────────────── FONTS & RESET ─────────────── */
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --blue-deep:   #0f2d6b;
    --blue-vivid:  #1d4ed8;
    --blue-mid:    #3b82f6;
    --blue-light:  #93c5fd;
    --blue-ghost:  #eff6ff;
    --blue-border: #dbeafe;
    --ink:         #0b1529;
    --ink-soft:    #334155;
    --ink-muted:   #64748b;
    --ink-faint:   #94a3b8;
    --surface:     #ffffff;
    --bg:          #f4f8ff;
    --gold:        #f59e0b;
    --radius-xl:   2rem;
    --radius-lg:   1.25rem;
    --radius-md:   0.75rem;
    --shadow-card: 0 4px 40px rgba(15,45,107,0.10), 0 1px 4px rgba(15,45,107,0.06);
    --shadow-hover:0 16px 64px rgba(15,45,107,0.18), 0 2px 8px rgba(15,45,107,0.08);
    --font-display:'Playfair Display', Georgia, serif;
    --font-body:   'Outfit', system-ui, sans-serif;
  }
  html { scroll-behavior: smooth; }
  body { background: var(--bg); font-family: var(--font-body); color: var(--ink); -webkit-font-smoothing: antialiased; }
  img  { display: block; max-width: 100%; }
`;

/* ─────────────── KEYFRAMES ─────────────── */
const fadeUp = keyframes`
  from { opacity:0; transform:translateY(28px) scale(0.98); }
  to   { opacity:1; transform:translateY(0) scale(1); }
`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
const slideUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
const slideOut = keyframes`from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); }`;
const drift = keyframes`
  0%,100% { transform: translateY(0) rotate(0deg); }
  33% { transform: translateY(-12px) rotate(2deg); }
  66% { transform: translateY(6px) rotate(-1deg); }
`;
const spin = keyframes`to { transform: rotate(360deg); }`;
const shimmerMove = keyframes`
  0% { background-position: -800px 0; }
  100% { background-position: 800px 0; }
`;
const glowPulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(29,78,216,0.4); }
  50% { box-shadow: 0 0 0 10px rgba(29,78,216,0); }
`;

/* ─────────────── PAGE ─────────────── */
const Page = styled.div`
  min-height: 100vh;
  background: var(--bg);
  position: relative;
  overflow-x: hidden;
`;
const Orb = styled.div`
  position: fixed;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  z-index: 0;
  animation: ${drift} ${p => p.dur || '8s'} ease-in-out infinite;
  animation-delay: ${p => p.delay || '0s'};
`;
const OrbA = styled(Orb)`
  width: 600px; height: 600px; top: -180px; right: -180px;
  background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
  @media(max-width:640px){ width:300px; height:300px; top:-100px; right:-100px; }
`;
const OrbB = styled(Orb)`
  width: 500px; height: 500px; bottom: 20vh; left: -200px;
  background: radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 70%);
  @media(max-width:640px){ width:250px; height:250px; left:-120px; }
`;
const OrbC = styled(Orb)`
  width: 300px; height: 300px; top: 50vh; right: 10vw;
  background: radial-gradient(circle, rgba(147,197,253,0.15) 0%, transparent 70%);
  @media(max-width:640px){ display:none; }
`;
const Inner = styled.div`
  position: relative; z-index: 1;
  max-width: 1100px; margin: 0 auto;
  padding: 0 1.5rem 6rem;
  @media(max-width:640px){ padding: 0 1rem 4rem; }
`;

/* ─────────────── OVERLAY ─────────────── */
const OverlayContainer = styled.div`
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, ${p => p.$show ? '0.5' : '0'});
  display: flex; align-items: center; justify-content: center;
  z-index: ${p => p.$show ? '9999' : '-1'};
  padding: 1rem;
  animation: ${p => p.$show ? fadeIn : 'none'} 0.3s ease;
  backdrop-filter: ${p => p.$show ? 'blur(4px)' : 'none'};
  pointer-events: ${p => p.$show ? 'auto' : 'none'};
  transition: all 0.3s ease;
`;
const OverlayContent = styled.div`
  background: white; border-radius: 16px;
  padding: 2.5rem 2rem; max-width: 450px; width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  text-align: center; position: relative;
  animation: ${p => p.$isClosing ? slideOut : slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  @media(max-width:640px){ padding: 2rem 1.5rem; border-radius: 12px; }
`;
const CloseOverlayBtn = styled.button`
  position: absolute; top: 1rem; right: 1rem;
  background: #f1f5f9; border: none;
  width: 36px; height: 36px; border-radius: 8px;
  cursor: pointer; display: flex; align-items: center; justify-content: center;
  color: #64748b; transition: all 0.2s ease;
  &:hover { background: #e2e8f0; color: #1e40af; transform: rotate(90deg); }
  svg { width: 20px; height: 20px; }
`;
const OverlayIcon = styled.div`
  width: 80px; height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(59,130,246,0.3);
  animation: ${slideUp} 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  svg { width: 40px; height: 40px; color: white; }
`;
const OverlayTitle = styled.h2`
  font-size: 1.75rem; font-weight: 700; color: #0f172a;
  margin-bottom: 0.75rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.22,1,0.36,1) 0.15s both;
  @media(max-width:640px){ font-size: 1.5rem; }
`;
const OverlayDesc = styled.p`
  color: #64748b; font-size: 0.95rem; line-height: 1.6;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.22,1,0.36,1) 0.2s both;
`;
const TimerText = styled.p`
  color: #1e40af; font-size: 0.85rem; font-weight: 600;
  margin-bottom: 1.5rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.22,1,0.36,1) 0.25s both;
`;
const OverlayButtons = styled.div`
  display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
  animation: ${slideUp} 0.4s cubic-bezier(0.22,1,0.36,1) 0.3s both;
  @media(max-width:540px){ flex-direction: column; }
`;
const OverlayBtn = styled.button`
  padding: 0.85rem 2rem; border-radius: 8px;
  font-weight: 600; font-size: 0.95rem; cursor: pointer; border: none;
  transition: all 0.3s ease; display: inline-flex;
  align-items: center; justify-content: center;
  font-family: 'DM Sans', system-ui, sans-serif;
  ${props => props.$primary ? `
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white; box-shadow: 0 4px 12px rgba(59,130,246,0.3);
    &:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(59,130,246,0.4); }
  ` : `
    background: #f1f5f9; color: #1e40af; border: 2px solid #dbeafe;
    &:hover { background: #eff6ff; border-color: #3b82f6; transform: translateY(-1px); }
  `}
  @media(max-width:540px){ width: 100%; }
`;

/* ─────────────── TOP NAV ─────────────── */
const TopNav = styled.div`
  position: relative; z-index: 10;
  max-width: 1100px; margin: 0 auto;
  padding: 1.25rem 1.5rem 0;
  display: flex; align-items: center; gap: 1.25rem;
  @media(max-width:640px){ padding: 1rem 1rem 0; gap: 0.875rem; }
`;
const NavBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-family: var(--font-body); font-size: 0.875rem; font-weight: 700;
  color: var(--blue-vivid); background: transparent; border: none;
  padding: 0.25rem 0; cursor: pointer; transition: color 0.2s, gap 0.2s;
  white-space: nowrap;
  svg { width: 0.9rem; height: 0.9rem; flex-shrink: 0; }
  &:hover { color: var(--blue-deep); gap: 0.6rem; }
`;
const NavDivider = styled.span`
  width: 1px; height: 1.25rem; background: var(--blue-border); flex-shrink: 0;
`;

/* ─────────────── HERO ─────────────── */
const HeroSection = styled.div`
  padding: 2.5rem 0 0; margin-bottom: 2.5rem;
  @media(max-width:640px){ padding: 1.75rem 0 0; margin-bottom: 2rem; }
`;
const HeroGrid = styled.div`
  display: grid; grid-template-columns: 1fr 340px;
  gap: 2.5rem; align-items: end;
  @media(max-width:900px){ grid-template-columns: 1fr; gap: 2rem; }
`;
const HeroLeft = styled.div`
  animation: ${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both; min-width: 0;
`;
const EyebrowRow = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  margin-bottom: 1.25rem; flex-wrap: wrap;
`;
const Eyebrow = styled.span`
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--blue-mid);
  background: var(--blue-ghost); border: 1px solid var(--blue-border);
  padding: 0.35rem 1rem; border-radius: 99px;
`;
const EyebrowDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--gold); animation: ${glowPulse} 2s ease infinite; flex-shrink: 0;
`;
const HeroName = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 5rem);
  font-weight: 900; line-height: 1.05; color: var(--ink);
  letter-spacing: -0.02em; margin-bottom: 0.5rem; word-break: break-word;
  em {
    font-style: italic;
    background: linear-gradient(135deg, var(--blue-vivid) 0%, #0ea5e9 100%);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
`;
const HeroDomain = styled.p`
  font-size: clamp(0.9rem, 2vw, 1.1rem); color: var(--ink-muted);
  font-weight: 400; margin-bottom: 1.75rem;
  @media(max-width:480px){ margin-bottom: 1.25rem; }
`;
const HeroMeta = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.6rem; margin-bottom: 1.75rem;
  @media(max-width:480px){ gap: 0.5rem; margin-bottom: 1.25rem; }
`;
const MetaPill = styled.div`
  display: flex; align-items: center; gap: 0.45rem;
  font-size: 0.825rem; color: var(--ink-soft);
  background: var(--surface); border: 1px solid var(--blue-border);
  padding: 0.45rem 0.875rem; border-radius: 99px;
  box-shadow: 0 2px 8px rgba(15,45,107,0.06);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  svg { width: 0.8rem; height: 0.8rem; color: var(--blue-mid); flex-shrink: 0; }
  @media(max-width:480px){ font-size: 0.775rem; }
`;

/* ─────────────── SOCIAL ICONS ROW ─────────────── */
const HeroSocials = styled.div`
  display: flex; gap: 0.6rem; flex-wrap: wrap; align-items: center;
`;
const SocialIcon = styled.a`
  display: inline-flex; align-items: center; justify-content: center;
  width: 2.4rem; height: 2.4rem;
  background: var(--surface); border: 1.5px solid var(--blue-border);
  border-radius: 50%; color: var(--blue-vivid); text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 2px 8px rgba(15,45,107,0.06);
  flex-shrink: 0;
  &:hover {
    background: var(--blue-vivid); color: white;
    border-color: var(--blue-vivid);
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 24px rgba(29,78,216,0.35);
  }
  svg { width: 0.95rem; height: 0.95rem; }
`;

/* ─────────────── RESUME BUTTON ─────────────── */
const ResumeBtn = styled.a`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.55rem 1.1rem;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  color: white; border: none; border-radius: 99px;
  font-family: var(--font-body); font-size: 0.8rem; font-weight: 700;
  text-decoration: none; cursor: pointer;
  box-shadow: 0 4px 16px rgba(29,78,216,0.28);
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  flex-shrink: 0;
  svg { width: 0.85rem; height: 0.85rem; }
  &:hover {
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 24px rgba(29,78,216,0.4);
  }
`;

/* ─────────────── HERO RIGHT ─────────────── */
const HeroRight = styled.div`
  display: flex; flex-direction: column;
  align-items: flex-end; gap: 1.25rem;
  animation: ${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;
  @media(max-width:900px){ flex-direction: row; align-items: flex-start; gap: 1.5rem; }
  @media(max-width:540px){ flex-direction: column; align-items: flex-start; gap: 1.25rem; }
`;
const AvatarFrame = styled.div`
  position: relative; width: 220px; height: 260px; flex-shrink: 0;
  @media(max-width:900px){ width: 180px; height: 210px; }
  @media(max-width:540px){ width: 130px; height: 155px; }
  @media(max-width:380px){ width: 110px; height: 130px; }
`;
const AvatarBg = styled.div`
  position: absolute; inset: 0;
  background: linear-gradient(145deg, var(--blue-vivid), #0ea5e9);
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%; opacity: 0.18;
`;
const AvatarRing = styled.div`
  position: absolute; inset: -8px;
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  border: 2px dashed rgba(59,130,246,0.3);
  animation: ${spin} 20s linear infinite;
`;
const AvatarImg = styled.img`
  position: absolute; inset: 12px;
  width: calc(100% - 24px); height: calc(100% - 24px);
  object-fit: cover;
  border-radius: 35% 55% 50% 45% / 45% 40% 55% 50%;
  box-shadow: var(--shadow-card);
`;
const AvatarPlaceholder = styled.div`
  position: absolute; inset: 12px;
  width: calc(100% - 24px); height: calc(100% - 24px);
  background: linear-gradient(145deg, var(--blue-ghost), #dbeafe);
  border-radius: 35% 55% 50% 45% / 45% 40% 55% 50%;
  display: flex; align-items: center; justify-content: center;
  svg { width: 3.5rem; height: 3.5rem; color: var(--blue-mid); opacity: 0.5; }
  @media(max-width:540px){ svg { width: 2.5rem; height: 2.5rem; } }
`;
const StatsBadge = styled.div`
  background: var(--surface); border: 1px solid var(--blue-border);
  border-radius: var(--radius-lg); padding: 1rem 1.25rem;
  box-shadow: var(--shadow-card); display: flex; gap: 1.25rem; flex-wrap: wrap;
  @media(max-width:900px){ flex-direction: column; gap: 0.75rem; padding: 1rem; align-self: center; }
  @media(max-width:540px){ flex-direction: row; gap: 1rem; flex-wrap: wrap; }
`;
const StatItem = styled.div`
  text-align: center;
  @media(max-width:900px){ text-align: left; display: flex; align-items: center; gap: 0.5rem; }
  span:first-child {
    display: block; font-size: 1.4rem; font-weight: 700;
    color: var(--blue-vivid); font-family: var(--font-display);
    @media(max-width:900px){ font-size: 1.2rem; }
  }
  span:last-child {
    font-size: 0.7rem; color: var(--ink-faint);
    text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
    @media(max-width:900px){ font-size: 0.68rem; }
  }
`;

/* ─────────────── DIVIDER ─────────────── */
const Divider = styled.div`
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--blue-border) 20%, var(--blue-border) 80%, transparent);
  margin: 0 0 2.5rem;
`;

/* ─────────────── SUMMARY ─────────────── */
const SummaryStrip = styled.div`
  background: linear-gradient(135deg, var(--blue-deep) 0%, var(--blue-vivid) 60%, #0ea5e9 100%);
  border-radius: var(--radius-xl); padding: 2.25rem 2.5rem;
  margin-bottom: 2.75rem; position: relative; overflow: hidden;
  animation: ${fadeUp} 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  opacity: 0; animation-fill-mode: forwards;
  &::before {
    content: '"'; position: absolute; top: -1rem; left: 1.5rem;
    font-family: var(--font-display); font-size: 10rem;
    color: rgba(255,255,255,0.07); line-height: 1; pointer-events: none;
  }
  @media(max-width:640px){ padding: 1.5rem 1.25rem; border-radius: var(--radius-lg); &::before { font-size: 7rem; top: -0.5rem; } }
`;
const SummaryText = styled.p`
  font-size: clamp(0.95rem, 2vw, 1.15rem); color: rgba(255,255,255,0.92);
  line-height: 1.8; font-style: italic; font-family: var(--font-display);
  position: relative; z-index: 1; max-width: 800px;
`;

/* ─────────────── SECTION ─────────────── */
const SectionWrap = styled.div`
  margin-bottom: 2.75rem;
  animation: ${fadeUp} 0.65s cubic-bezier(0.22,1,0.36,1) ${p => p.delay || '0s'} both;
  opacity: 0; animation-fill-mode: forwards;
  @media(max-width:640px){ margin-bottom: 2.25rem; }
`;
const SectionLabel = styled.div`
  display: flex; align-items: center; gap: 0.875rem; margin-bottom: 1.5rem;
  @media(max-width:640px){ margin-bottom: 1.25rem; }
`;
const LabelLine = styled.div`
  flex: 1; height: 1px;
  background: linear-gradient(90deg, var(--blue-border), transparent);
`;
const LabelText = styled.h2`
  font-family: var(--font-display); font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 700; color: var(--ink); white-space: nowrap; letter-spacing: -0.01em;
`;
const LabelIcon = styled.div`
  width: 2.5rem; height: 2.5rem; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(29,78,216,0.3); flex-shrink: 0;
  svg { width: 1.05rem; height: 1.05rem; color: white; }
  @media(max-width:480px){ width: 2.25rem; height: 2.25rem; }
`;

/* ─────────────── TIMELINE ─────────────── */
const Timeline = styled.div`display: flex; flex-direction: column;`;
const TimelineItem = styled.div`
  display: grid; grid-template-columns: 160px 40px 1fr; min-width: 0;
  @media(max-width:720px){ grid-template-columns: 0px 28px 1fr; }
  @media(max-width:480px){ grid-template-columns: 0px 22px 1fr; }
`;
const TimelineDate = styled.div`
  padding: 0 1.25rem 2.25rem 0; text-align: right;
  @media(max-width:720px){ display:none; }
`;
const DateLabel = styled.span`
  display: inline-block; font-size: 0.7rem; font-weight: 700;
  color: var(--blue-vivid); background: var(--blue-ghost);
  border: 1px solid var(--blue-border); padding: 0.3rem 0.7rem;
  border-radius: 99px; letter-spacing: 0.04em;
`;
const TimelineSpine = styled.div`
  display: flex; flex-direction: column;
  align-items: center; min-width: 0; overflow: visible;
`;
const SpineDot = styled.div`
  width: 12px; height: 12px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  border: 2px solid var(--surface);
  box-shadow: 0 0 0 2px var(--blue-border), 0 4px 12px rgba(29,78,216,0.3);
  flex-shrink: 0; margin-top: 1.5rem; z-index: 1;
  @media(max-width:480px){ width: 9px; height: 9px; margin-top: 1.25rem; }
`;
const SpineLine = styled.div`
  flex: 1; width: 2px;
  background: linear-gradient(to bottom, var(--blue-light), rgba(147,197,253,0.1));
  margin-top: 4px;
`;
const TimelineBody = styled.div`
  padding: 0 0 2.25rem 1.25rem; min-width: 0;
  @media(max-width:720px){ padding: 0 0 1.75rem 0.875rem; }
  @media(max-width:480px){ padding: 0 0 1.5rem 0.625rem; }
`;
const TimelineCard = styled.div`
  background: var(--surface); border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem; border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card);
  transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; overflow: hidden; min-width: 0; word-break: break-word;
  &::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--blue-vivid), #0ea5e9);
    opacity: 0; transition: opacity 0.3s;
  }
  &:hover {
    transform: translateY(-4px) translateX(2px); box-shadow: var(--shadow-hover);
    border-color: var(--blue-light);
    &::before { opacity: 1; }
  }
  @media(max-width:480px){ padding: 1.125rem 1rem; }
`;
const CardTitle = styled.h3`
  font-size: clamp(0.925rem, 2vw, 1.05rem); font-weight: 700;
  color: var(--ink); margin-bottom: 0.2rem; letter-spacing: -0.01em; overflow-wrap: break-word;
`;
const CardSub = styled.p`
  font-size: 0.85rem; color: var(--blue-vivid);
  font-weight: 600; margin-bottom: 0.6rem; overflow-wrap: break-word;
`;
const CardDateMobile = styled.span`
  display: none; font-size: 0.7rem; font-weight: 700;
  color: var(--ink-faint); text-transform: uppercase; letter-spacing: 0.08em;
  margin-bottom: 0.65rem;
  @media(max-width:720px){ display:block; }
`;
const CardDesc = styled.p`
  font-size: 0.875rem; color: var(--ink-soft); line-height: 1.75; overflow-wrap: break-word;
`;

/* ─────────────── PROJECTS ─────────────── */
const ProjectGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  @media(max-width:600px){ grid-template-columns: 1fr; gap: 1rem; }
`;
const ProjectCard = styled.div`
  background: var(--surface); border-radius: var(--radius-lg);
  padding: 1.75rem; border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card); display: flex; flex-direction: column;
  gap: 0.875rem; transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; overflow: hidden;
  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(29,78,216,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  &:hover { transform: translateY(-6px); box-shadow: var(--shadow-hover); border-color: var(--blue-light); }
  @media(max-width:480px){ padding: 1.375rem; }
`;
const ProjectNum = styled.div`
  font-family: var(--font-display); font-size: 3.25rem; font-weight: 900;
  color: var(--blue-ghost); line-height: 1; position: absolute; top: 0.875rem; right: 1.1rem;
  pointer-events: none; user-select: none;
  @media(max-width:480px){ font-size: 2.75rem; }
`;
const ProjectTitle = styled.h3`
  font-size: clamp(0.975rem, 2vw, 1.1rem); font-weight: 700;
  color: var(--ink); letter-spacing: -0.01em; line-height: 1.3; padding-right: 2rem;
`;
const ProjectDesc = styled.p`
  font-size: 0.875rem; color: var(--ink-soft); line-height: 1.7; flex: 1;
`;
const TagRow = styled.div`display: flex; flex-wrap: wrap; gap: 0.4rem;`;
const Tech = styled.span`
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--blue-vivid);
  background: var(--blue-ghost); border: 1px solid var(--blue-border);
  padding: 0.22rem 0.6rem; border-radius: 0.35rem;
`;
const ProjectLinks = styled.div`display: flex; gap: 0.5rem; flex-wrap: wrap;`;
const ProjLink = styled.a`
  display: inline-flex; align-items: center; gap: 0.4rem;
  font-size: 0.78rem; font-weight: 700; padding: 0.45rem 0.875rem;
  border-radius: 0.6rem; text-decoration: none; transition: all 0.25s;
  border: 1.5px solid var(--blue-border); color: var(--blue-vivid); background: var(--blue-ghost);
  &:hover {
    background: var(--blue-vivid); color: white; border-color: var(--blue-vivid);
    transform: translateY(-2px); box-shadow: 0 6px 20px rgba(29,78,216,0.3);
  }
  svg { width: 0.7rem; height: 0.7rem; }
`;

/* ─────────────── SKILLS ─────────────── */
const SkillsLayout = styled.div`
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.1rem;
  @media(max-width:820px){ grid-template-columns: repeat(2, 1fr); }
  @media(max-width:520px){ grid-template-columns: 1fr; gap: 0.875rem; }
`;
const SkillPanel = styled.div`
  background: var(--surface); border-radius: var(--radius-lg);
  padding: 1.5rem; border: 1px solid var(--blue-border); box-shadow: var(--shadow-card);
`;
const SkillPanelTitle = styled.h4`
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.14em;
  text-transform: uppercase; color: var(--blue-mid);
  margin-bottom: 1.1rem; padding-bottom: 0.7rem; border-bottom: 1px solid var(--blue-border);
  display: flex; align-items: center; gap: 0.5rem;
  &::before {
    content: ''; width: 7px; height: 7px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9); flex-shrink: 0;
  }
`;
const SkillItems = styled.div`display: flex; flex-direction: column; gap: 0.45rem;`;
const SkillItem = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.55rem 0.8rem; background: var(--bg); border-radius: 0.5rem;
  border: 1px solid transparent; transition: all 0.2s; cursor: default;
  &:hover { background: var(--blue-ghost); border-color: var(--blue-border); }
  span { font-size: 0.85rem; font-weight: 500; color: var(--ink-soft); }
`;
const SkillDot = styled.div`
  width: 6px; height: 6px; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9); flex-shrink: 0;
`;

/* ─────────────── CERTS ─────────────── */
const CertGrid = styled.div`
  display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.1rem;
  @media(max-width:600px){ grid-template-columns: 1fr; gap: 0.875rem; }
`;
const CertCard = styled.div`
  background: var(--surface); border-radius: var(--radius-lg);
  padding: 1.375rem 1.5rem; border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card); display: flex; flex-direction: column;
  gap: 0.45rem; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  position: relative; overflow: hidden;
  &::before {
    content: '✦'; position: absolute; top: 0.875rem; right: 0.875rem;
    color: var(--gold); font-size: 1rem;
  }
  &:hover { transform: translateY(-4px); box-shadow: var(--shadow-hover); border-color: rgba(245,158,11,0.3); }
`;
const CertName = styled.h3`
  font-size: 0.975rem; font-weight: 700; color: var(--ink); line-height: 1.35; padding-right: 1.5rem;
`;
const CertIssuer = styled.p`font-size: 0.825rem; font-weight: 600; color: var(--blue-vivid);`;
const CertLink = styled.a`
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.78rem; font-weight: 700; color: var(--blue-vivid);
  text-decoration: none; margin-top: 0.25rem; transition: gap 0.2s;
  &:hover { gap: 0.6rem; }
  svg { width: 0.72rem; height: 0.72rem; }
`;

/* ─────────────── INTERESTS ─────────────── */
const InterestFlow = styled.div`display: flex; flex-wrap: wrap; gap: 0.65rem;`;
const InterestPill = styled.span`
  font-size: 0.9rem; font-weight: 600; color: var(--blue-vivid);
  background: var(--surface); border: 2px solid var(--blue-border);
  padding: 0.55rem 1.25rem; border-radius: 99px;
  box-shadow: 0 2px 8px rgba(29,78,216,0.07);
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1); cursor: default;
  &:hover {
    background: var(--blue-vivid); color: white; border-color: var(--blue-vivid);
    transform: translateY(-3px) scale(1.04); box-shadow: 0 8px 24px rgba(29,78,216,0.25);
  }
  @media(max-width:480px){ font-size: 0.825rem; padding: 0.45rem 1rem; }
`;

/* ─────────────── EMPTY ─────────────── */
const Empty = styled.div`
  background: var(--surface); border: 1.5px dashed var(--blue-border);
  border-radius: var(--radius-lg); padding: 2.5rem;
  display: flex; flex-direction: column; align-items: center;
  gap: 0.7rem; color: var(--ink-faint); font-size: 0.875rem; text-align: center;
  svg { width: 2.25rem; height: 2.25rem; opacity: 0.3; }
`;

/* ─────────────── LOADING ─────────────── */
const LoadPage = styled.div`
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 1.5rem;
  background: var(--bg); font-family: var(--font-body);
`;
const Spinner = styled.div`
  width: 3.25rem; height: 3.25rem; border: 3px solid var(--blue-border);
  border-top-color: var(--blue-vivid); border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;
const LoadText = styled.p`
  font-size: 0.85rem; color: var(--ink-faint); font-weight: 500;
  letter-spacing: 0.06em; text-transform: uppercase;
`;
const ShimmerBar = styled.div`
  width: 200px; height: 4px; border-radius: 99px;
  background: linear-gradient(90deg, var(--blue-ghost) 0%, var(--blue-border) 40%, var(--blue-ghost) 80%);
  background-size: 800px; animation: ${shimmerMove} 1.6s infinite linear;
`;

/* ─────────────── ERROR ─────────────── */
const ErrorWrap = styled.div`
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  padding: 2rem 1rem; background: var(--bg); font-family: var(--font-body);
`;
const ErrorBox = styled.div`
  background: var(--surface); border-radius: var(--radius-xl);
  padding: 3rem 2.5rem; max-width: 460px; width: 100%;
  text-align: center; border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-hover); animation: ${fadeUp} 0.5s ease both;
  @media(max-width:480px){ padding: 2.5rem 1.75rem; border-radius: var(--radius-lg); }
`;
const ErrorIcon = styled.div`
  width: 4.5rem; height: 4.5rem; border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-ghost), var(--blue-border));
  display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem;
  svg { color: var(--blue-vivid); width: 2rem; height: 2rem; }
`;
const ErrorTitle = styled.h2`
  font-family: var(--font-display); font-size: 1.6rem; color: var(--ink); margin-bottom: 0.75rem;
`;
const ErrorMsg = styled.p`
  color: var(--ink-muted); line-height: 1.6; margin-bottom: 2rem; font-size: 0.925rem;
`;
const HomeBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.6rem;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  color: white; border: none; padding: 0.875rem 2rem; border-radius: 0.875rem;
  font-family: var(--font-body); font-size: 0.9rem; font-weight: 700; cursor: pointer;
  box-shadow: 0 8px 24px rgba(29,78,216,0.3); transition: all 0.25s;
  &:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(29,78,216,0.4); }
`;

/* ─────────────── HELPERS ─────────────── */
const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

/* ─────────────── BUILD SOCIAL HREF ─────────────── */
const buildSocialHref = (item) => {
  // link is already the full URL stored by the backend
  const link = item.link || item.username || '';
  if (!link) return null;
  // If it's an email without mailto:, add prefix
  if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
  return link;
};

/* ═════════════════════════════════════════════════ */
const PublicProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});

  const [showOverlay, setShowOverlay] = useState(() => {
    const dismissed = sessionStorage.getItem('overlayDismissed');
    if (dismissed === 'true') return false;
    return !user;
  });
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  useEffect(() => {
    if (!showOverlay) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { handleCloseOverlay(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showOverlay]);

  const handleCloseOverlay = () => {
    setIsClosing(true);
    sessionStorage.setItem('overlayDismissed', 'true');
    setTimeout(() => setShowOverlay(false), 400);
  };

  const fetchImageUrl = async (path) => {
    if (!path) return null;
    try { return await publicService.getSignedUrl(path); }
    catch { return null; }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await publicService.getPortfolio(username);
        setPortfolio(data);

        const imagePaths = [];
        if (data.profile?.profilePhoto) imagePaths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
        data.projects?.forEach((proj, idx) => {
          if (proj.image) imagePaths.push({ key: `project_${idx}`, path: proj.image });
        });
        data.certifications?.forEach((cert, idx) => {
          if (cert.image) imagePaths.push({ key: `cert_${idx}`, path: cert.image });
        });

        const urlMap = {};
        await Promise.all(imagePaths.map(async ({ key, path }) => {
          const url = await fetchImageUrl(path);
          if (url) urlMap[key] = url;
        }));
        setImageUrls(urlMap);
      } catch (err) {
        setError(err.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };
    if (username) load();
  }, [username]);

  if (loading) {
    return (
      <>
        <GlobalStyle />
        <LoadPage><Spinner /><ShimmerBar /><LoadText>Loading portfolio</LoadText></LoadPage>
      </>
    );
  }

  if (error || !portfolio) {
    return (
      <>
        <GlobalStyle />
        <ErrorWrap>
          <ErrorBox>
            <ErrorIcon><AlertCircle /></ErrorIcon>
            <ErrorTitle>{error ? 'Profile Not Found' : 'No Portfolio Yet'}</ErrorTitle>
            <ErrorMsg>{error || "This user hasn't set up their portfolio yet."}</ErrorMsg>
            <HomeBtn onClick={() => navigate('/')}><Home size={16} /> Back to Home</HomeBtn>
          </ErrorBox>
        </ErrorWrap>
      </>
    );
  }

  const {
    profile = {}, education = [], experience = [],
    projects = [], skills = {}, certifications = [], interests = {}
  } = portfolio;

  const fullName = profile.name || 'Anonymous User';
  const [firstName, ...lastNameParts] = fullName.split(' ');
  const lastName = lastNameParts.join(' ') || '';
  const skillCategories = skills.skills || [];

  // ── Social links: use profile.social array, filter out empty links ──
  const socialLinks = (profile.social || []).filter(item => {
    const href = buildSocialHref(item);
    return !!href;
  });

  // ── CV link ──
  const cvLink = profile.cvLink?.trim() || null;

  return (
    <>
      <GlobalStyle />

      <OverlayContainer $show={showOverlay}>
        <OverlayContent $isClosing={isClosing}>
          <CloseOverlayBtn onClick={handleCloseOverlay}><X /></CloseOverlayBtn>
          <OverlayIcon><User /></OverlayIcon>
          <OverlayTitle>Create Your Public Profile</OverlayTitle>
          <OverlayDesc>
            Share your professional portfolio with the world. Login or create an account to build your public profile today!
          </OverlayDesc>
          <TimerText>Closes in {timeLeft}s</TimerText>
          <OverlayButtons>
            <OverlayBtn $primary onClick={() => navigate('/login')}>Sign In</OverlayBtn>
            <OverlayBtn onClick={() => navigate('/register')}>Create Account</OverlayBtn>
          </OverlayButtons>
        </OverlayContent>
      </OverlayContainer>

      <Page>
        <OrbA dur="9s" delay="0s" />
        <OrbB dur="11s" delay="2s" />
        <OrbC dur="7s" delay="1s" />

        <TopNav>
          <NavBtn onClick={() => navigate(-1)}><ChevronLeft />Back</NavBtn>
          <NavDivider />
          <NavBtn onClick={() => navigate('/')}><Home />Home</NavBtn>
        </TopNav>

        <Inner>
          {/* ═══ HERO ═══ */}
          <HeroSection>
            <HeroGrid>
              <HeroLeft>
                <EyebrowRow>
                  <EyebrowDot />
                  <Eyebrow>{profile.domain || 'Professional Portfolio'}</Eyebrow>
                </EyebrowRow>

                <HeroName>
                  {firstName}&nbsp;<em>{lastName}</em>
                </HeroName>

                <HeroDomain>
                  {profile.domain || 'Professional'}&nbsp;·&nbsp;{profile.location || 'Location not set'}
                </HeroDomain>

                {/* ── Contact meta pills — only render if values exist ── */}
                {(profile.email || profile.phone || profile.location) && (
                  <HeroMeta>
                    {profile.email    && <MetaPill><Mail />    {profile.email}</MetaPill>}
                    {profile.phone    && <MetaPill><Phone />   {profile.phone}</MetaPill>}
                    {profile.location && <MetaPill><MapPin />  {profile.location}</MetaPill>}
                  </HeroMeta>
                )}

                {/* ── Social icons + Resume button ── */}
                {(socialLinks.length > 0 || cvLink) && (
                  <HeroSocials>
                    {/* Dynamic social icons from profile.social array */}
                    {socialLinks.map((item) => {
                      const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
                      const Icon = meta.icon;
                      const href = buildSocialHref(item);
                      return (
                        <SocialIcon
                          key={item._id || item.id}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={item.name || meta.label}
                          style={{ color: item.color || 'var(--blue-vivid)' }}
                        >
                          <Icon />
                        </SocialIcon>
                      );
                    })}

                    {/* Resume / CV button — only if cvLink exists */}
                    {cvLink && (
                      <ResumeBtn href={cvLink} target="_blank" rel="noopener noreferrer">
                        <FileText /> Resume
                      </ResumeBtn>
                    )}
                  </HeroSocials>
                )}
              </HeroLeft>

              <HeroRight>
                <AvatarFrame>
                  <AvatarBg />
                  <AvatarRing />
                  {imageUrls.profilePhoto
                    ? <AvatarImg src={imageUrls.profilePhoto} alt={fullName} />
                    : <AvatarPlaceholder><User /></AvatarPlaceholder>
                  }
                </AvatarFrame>

                <StatsBadge>
                  <StatItem><span>{education.length || '—'}</span><span>Education</span></StatItem>
                  <StatItem><span>{experience.length || '—'}</span><span>Roles</span></StatItem>
                  <StatItem><span>{projects.length || '—'}</span><span>Projects</span></StatItem>
                  <StatItem><span>{certifications.length || '—'}</span><span>Certs</span></StatItem>
                </StatsBadge>
              </HeroRight>
            </HeroGrid>
          </HeroSection>

          <Divider />

          {/* ═══ SUMMARY ═══ */}
          {profile.summary && (
            <SummaryStrip>
              <SummaryText>"{profile.summary}"</SummaryText>
            </SummaryStrip>
          )}

          {/* ═══ EDUCATION ═══ */}
          <SectionWrap delay="0.25s">
            <SectionLabel>
              <LabelIcon><BookOpen /></LabelIcon>
              <LabelText>Education</LabelText>
              <LabelLine />
            </SectionLabel>
            {education.length > 0 ? (
              <Timeline>
                {education.map((edu, i) => {
                  const dur = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'Duration N/A';
                  const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : (edu.percentage ? `Percentage: ${edu.percentage}%` : null);
                  return (
                    <TimelineItem key={edu._id || i}>
                      <TimelineDate><DateLabel>{dur}</DateLabel></TimelineDate>
                      <TimelineSpine>
                        <SpineDot />
                        {i < education.length - 1 && <SpineLine />}
                      </TimelineSpine>
                      <TimelineBody>
                        <TimelineCard>
                          <CardDateMobile>{dur}</CardDateMobile>
                          <CardTitle>{na(edu.institution)}</CardTitle>
                          <CardSub>{na(edu.course)}</CardSub>
                          {score && <CardDesc>📊 {score}</CardDesc>}
                        </TimelineCard>
                      </TimelineBody>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            ) : (
              <Empty><BookOpen /><span>No education details added yet</span></Empty>
            )}
          </SectionWrap>

          {/* ═══ EXPERIENCE ═══ */}
          <SectionWrap delay="0.3s">
            <SectionLabel>
              <LabelIcon><Briefcase /></LabelIcon>
              <LabelText>Experience</LabelText>
              <LabelLine />
            </SectionLabel>
            {experience.length > 0 ? (
              <Timeline>
                {experience.map((exp, i) => (
                  <TimelineItem key={exp._id || i}>
                    <TimelineDate><DateLabel>{exp.duration || 'N/A'}</DateLabel></TimelineDate>
                    <TimelineSpine>
                      <SpineDot />
                      {i < experience.length - 1 && <SpineLine />}
                    </TimelineSpine>
                    <TimelineBody>
                      <TimelineCard>
                        <CardDateMobile>{exp.duration || 'N/A'}</CardDateMobile>
                        <CardTitle>{na(exp.role)}</CardTitle>
                        <CardSub>{na(exp.company)}{exp.type ? ` · ${exp.type}` : ''}</CardSub>
                        {exp.description && <CardDesc>{exp.description}</CardDesc>}
                      </TimelineCard>
                    </TimelineBody>
                  </TimelineItem>
                ))}
              </Timeline>
            ) : (
              <Empty><Briefcase /><span>No experience details added yet</span></Empty>
            )}
          </SectionWrap>

          {/* ═══ PROJECTS ═══ */}
          <SectionWrap delay="0.35s">
            <SectionLabel>
              <LabelIcon><Code2 /></LabelIcon>
              <LabelText>Projects</LabelText>
              <LabelLine />
            </SectionLabel>
            {projects.length > 0 ? (
              <ProjectGrid>
                {projects.map((proj, i) => (
                  <ProjectCard key={proj._id || i}>
                    <ProjectNum>0{i + 1}</ProjectNum>
                    <ProjectTitle>{na(proj.title)}</ProjectTitle>
                    {proj.description && <ProjectDesc>{proj.description}</ProjectDesc>}
                    {proj.tech?.length > 0 && (
                      <TagRow>{proj.tech.map((t, j) => <Tech key={j}>{t}</Tech>)}</TagRow>
                    )}
                    {(proj.demo || proj.repo) && (
                      <ProjectLinks>
                        {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLink>}
                        {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLink>}
                      </ProjectLinks>
                    )}
                  </ProjectCard>
                ))}
              </ProjectGrid>
            ) : (
              <Empty><Code2 /><span>No projects added yet</span></Empty>
            )}
          </SectionWrap>

          {/* ═══ SKILLS ═══ */}
          <SectionWrap delay="0.4s">
            <SectionLabel>
              <LabelIcon><Layers /></LabelIcon>
              <LabelText>Skills</LabelText>
              <LabelLine />
            </SectionLabel>
            {skillCategories.length > 0 ? (
              <SkillsLayout>
                {skillCategories.map((cat, idx) => (
                  <SkillPanel key={cat._id || idx}>
                    <SkillPanelTitle>{cat.category}</SkillPanelTitle>
                    <SkillItems>
                      {cat.items.map((item, i) => (
                        <SkillItem key={i}><span>{item}</span><SkillDot /></SkillItem>
                      ))}
                    </SkillItems>
                  </SkillPanel>
                ))}
              </SkillsLayout>
            ) : (
              <Empty><Layers /><span>No skills added yet</span></Empty>
            )}
          </SectionWrap>

          {/* ═══ CERTIFICATIONS ═══ */}
          <SectionWrap delay="0.45s">
            <SectionLabel>
              <LabelIcon><Award /></LabelIcon>
              <LabelText>Certifications</LabelText>
              <LabelLine />
            </SectionLabel>
            {certifications.length > 0 ? (
              <CertGrid>
                {certifications.map((cert, i) => (
                  <CertCard key={cert._id || i}>
                    <CertName>{na(cert.name)}</CertName>
                    <CertIssuer>{na(cert.issuer)}</CertIssuer>
                    {cert.link && (
                      <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">
                        View Credential <ArrowUpRight />
                      </CertLink>
                    )}
                  </CertCard>
                ))}
              </CertGrid>
            ) : (
              <Empty><Award /><span>No certifications added yet</span></Empty>
            )}
          </SectionWrap>

          {/* ═══ INTERESTS — only if data exists ═══ */}
          {interests?.interests?.length > 0 && (
            <SectionWrap delay="0.5s">
              <SectionLabel>
                <LabelIcon><Sparkles /></LabelIcon>
                <LabelText>Interests</LabelText>
                <LabelLine />
              </SectionLabel>
              <InterestFlow>
                {interests.interests.map((item, i) => (
                  <InterestPill key={i}>{item}</InterestPill>
                ))}
              </InterestFlow>
            </SectionWrap>
          )}
        </Inner>
      </Page>
    </>
  );
};

export default PublicProfilePage;























// ================================= Templete 2 =============================== //























// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Globe, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Download,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// /* ─────────────── ICON MAP ─────────────── */
// const SOCIAL_ICON_MAP = {
//   Github:        { icon: Github,        label: 'GitHub' },
//   Linkedin:      { icon: Linkedin,      label: 'LinkedIn' },
//   Twitter:       { icon: Twitter,       label: 'Twitter / X' },
//   Instagram:     { icon: Instagram,     label: 'Instagram' },
//   Youtube:       { icon: Youtube,       label: 'YouTube' },
//   Code2:         { icon: Code2,         label: 'LeetCode' },
//   Trophy:        { icon: Trophy,        label: 'Codeforces' },
//   Twitch:        { icon: Twitch,        label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send:          { icon: Send,          label: 'Telegram' },
//   Rss:           { icon: Rss,           label: 'Blog' },
//   Globe:         { icon: Globe,         label: 'Website' },
//   Mail:          { icon: Mail,          label: 'Email' },
//   Phone:         { icon: Phone,         label: 'Phone' },
//   AtSign:        { icon: AtSign,        label: 'Other' },
//   ExternalLink:  { icon: ExternalLink,  label: 'Link' },
// };

// /* ─────────────── GLOBAL STYLE ─────────────── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,700&family=Jost:wght@300;400;500;600;700&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     /* Palette */
//     --obsidian:    #080b10;
//     --void:        #0c1018;
//     --carbon:      #111520;
//     --graphite:    #1a2030;
//     --slate:       #242c3d;
//     --mist:        #2e3850;
//     --ash:         #4a5568;
//     --fog:         #718096;
//     --silver:      #a0aec0;
//     --pearl:       #e2e8f0;
//     --white:       #f8f9fc;

//     /* Gold system */
//     --gold-deep:   #7c5c1e;
//     --gold-warm:   #b8892a;
//     --gold:        #d4a843;
//     --gold-bright: #f0c060;
//     --gold-pale:   #fdecc8;
//     --gold-ghost:  rgba(212,168,67,0.08);
//     --gold-border: rgba(212,168,67,0.18);
//     --gold-glow:   rgba(212,168,67,0.35);

//     /* Typography */
//     --font-display: 'Cormorant Garamond', Georgia, serif;
//     --font-body:    'Jost', system-ui, sans-serif;

//     /* Surfaces */
//     --card-bg:     rgba(26, 32, 48, 0.8);
//     --card-border: rgba(212,168,67,0.12);
//     --card-hover:  rgba(26, 32, 48, 0.95);

//     /* Shadows */
//     --shadow-card:  0 4px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(212,168,67,0.08) inset;
//     --shadow-hover: 0 20px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,168,67,0.2);
//     --shadow-gold:  0 8px 40px rgba(212,168,67,0.25);

//     /* Radius */
//     --r-sm: 0.5rem;
//     --r-md: 0.875rem;
//     --r-lg: 1.25rem;
//     --r-xl: 2rem;
//   }

//   html { scroll-behavior: smooth; }

//   body {
//     background: var(--obsidian);
//     font-family: var(--font-body);
//     color: var(--pearl);
//     -webkit-font-smoothing: antialiased;
//     overflow-x: hidden;
//   }

//   img { display: block; max-width: 100%; }

//   ::-webkit-scrollbar { width: 6px; }
//   ::-webkit-scrollbar-track { background: var(--void); }
//   ::-webkit-scrollbar-thumb { background: var(--gold-warm); border-radius: 3px; }
// `;

// /* ─────────────── KEYFRAMES ─────────────── */
// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(40px); }
//   to   { opacity: 1; transform: translateY(0); }
// `;
// const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
// const slideUp = keyframes`from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); }`;
// const shimmer = keyframes`
//   0% { background-position: -800px 0; }
//   100% { background-position: 800px 0; }
// `;
// const spin = keyframes`to { transform: rotate(360deg); }`;
// const goldPulse = keyframes`
//   0%,100% { opacity: 0.6; transform: scale(1); }
//   50% { opacity: 1; transform: scale(1.08); }
// `;
// const borderGlow = keyframes`
//   0%,100% { box-shadow: 0 0 20px rgba(212,168,67,0.2); }
//   50% { box-shadow: 0 0 40px rgba(212,168,67,0.5); }
// `;
// const float = keyframes`
//   0%,100% { transform: translateY(0) rotate(0deg); }
//   50% { transform: translateY(-18px) rotate(1deg); }
// `;

// /* ─────────────── PAGE SHELL ─────────────── */
// const Page = styled.div`
//   min-height: 100vh;
//   background: var(--obsidian);
//   position: relative;
//   overflow-x: hidden;
// `;

// /* ─────────────── BACKGROUND FX ─────────────── */
// const BgCanvas = styled.div`
//   position: fixed;
//   inset: 0;
//   pointer-events: none;
//   z-index: 0;
//   overflow: hidden;

//   &::before {
//     content: '';
//     position: absolute;
//     top: -30vh; right: -20vw;
//     width: 80vw; height: 80vh;
//     background: radial-gradient(ellipse, rgba(212,168,67,0.06) 0%, transparent 65%);
//     animation: ${float} 14s ease-in-out infinite;
//   }

//   &::after {
//     content: '';
//     position: absolute;
//     bottom: -20vh; left: -15vw;
//     width: 60vw; height: 60vh;
//     background: radial-gradient(ellipse, rgba(29, 78, 216, 0.06) 0%, transparent 65%);
//     animation: ${float} 18s ease-in-out infinite reverse;
//   }
// `;

// const NoiseOverlay = styled.div`
//   position: fixed;
//   inset: 0;
//   pointer-events: none;
//   z-index: 0;
//   opacity: 0.025;
//   background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
//   background-size: 200px;
// `;

// const GridLines = styled.div`
//   position: fixed;
//   inset: 0;
//   pointer-events: none;
//   z-index: 0;
//   background-image:
//     linear-gradient(rgba(212,168,67,0.03) 1px, transparent 1px),
//     linear-gradient(90deg, rgba(212,168,67,0.03) 1px, transparent 1px);
//   background-size: 80px 80px;
// `;

// /* ─────────────── INNER WRAP ─────────────── */
// const Inner = styled.div`
//   position: relative;
//   z-index: 2;
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 0 2rem 8rem;
//   @media(max-width:640px){ padding: 0 1.25rem 5rem; }
// `;

// /* ─────────────── OVERLAY ─────────────── */
// const OverlayBackdrop = styled.div`
//   position: fixed; inset: 0;
//   background: rgba(0,0,0,0.85);
//   backdrop-filter: blur(12px);
//   display: flex; align-items: center; justify-content: center;
//   z-index: 9999; padding: 1.5rem;
//   opacity: ${p => p.$show ? 1 : 0};
//   pointer-events: ${p => p.$show ? 'auto' : 'none'};
//   transition: opacity 0.4s ease;
// `;
// const OverlayBox = styled.div`
//   background: var(--graphite);
//   border: 1px solid var(--gold-border);
//   border-radius: var(--r-xl);
//   padding: 3.5rem 3rem;
//   max-width: 460px; width: 100%;
//   box-shadow: var(--shadow-hover), 0 0 80px rgba(212,168,67,0.1);
//   text-align: center;
//   position: relative;
//   animation: ${p => p.$isClosing ? 'none' : slideUp} 0.5s cubic-bezier(0.22,1,0.36,1);
//   @media(max-width:480px){ padding: 2.5rem 1.75rem; }
// `;
// const OvClose = styled.button`
//   position: absolute; top: 1.25rem; right: 1.25rem;
//   background: var(--slate); border: 1px solid var(--mist);
//   color: var(--silver); border-radius: 50%;
//   width: 36px; height: 36px;
//   cursor: pointer; display: flex; align-items: center; justify-content: center;
//   transition: all 0.2s;
//   &:hover { background: var(--gold-ghost); border-color: var(--gold-border); color: var(--gold); transform: rotate(90deg); }
//   svg { width: 16px; height: 16px; }
// `;
// const OvGoldRing = styled.div`
//   width: 88px; height: 88px;
//   border: 2px solid var(--gold-border);
//   border-radius: 50%;
//   display: flex; align-items: center; justify-content: center;
//   margin: 0 auto 2rem;
//   position: relative;
//   animation: ${borderGlow} 3s ease infinite;

//   &::before {
//     content: '';
//     position: absolute; inset: 6px;
//     background: linear-gradient(135deg, var(--gold-warm), var(--gold-deep));
//     border-radius: 50%;
//     opacity: 0.6;
//   }

//   svg { width: 36px; height: 36px; color: var(--gold-bright); position: relative; z-index: 1; }
// `;
// const OvTitle = styled.h2`
//   font-family: var(--font-display);
//   font-size: 2.25rem; font-weight: 700;
//   color: var(--white);
//   margin-bottom: 0.875rem;
//   line-height: 1.1;
// `;
// const OvDesc = styled.p`
//   color: var(--fog); font-size: 0.95rem; line-height: 1.7;
//   margin-bottom: 1.5rem;
// `;
// const OvTimer = styled.p`
//   font-size: 0.78rem; letter-spacing: 0.12em; text-transform: uppercase;
//   color: var(--gold-warm); font-weight: 600; margin-bottom: 2rem;
// `;
// const OvBtns = styled.div`
//   display: flex; gap: 0.875rem; justify-content: center;
//   @media(max-width:400px){ flex-direction: column; }
// `;
// const OvBtnPrimary = styled.button`
//   flex: 1; padding: 0.875rem 1.5rem;
//   background: linear-gradient(135deg, var(--gold-warm), var(--gold));
//   color: var(--obsidian); border: none; border-radius: var(--r-md);
//   font-family: var(--font-body); font-size: 0.9rem; font-weight: 700;
//   cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase;
//   transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
//   &:hover { transform: translateY(-3px); box-shadow: var(--shadow-gold); filter: brightness(1.1); }
// `;
// const OvBtnSecondary = styled.button`
//   flex: 1; padding: 0.875rem 1.5rem;
//   background: transparent; border: 1px solid var(--gold-border);
//   color: var(--gold); border-radius: var(--r-md);
//   font-family: var(--font-body); font-size: 0.9rem; font-weight: 600;
//   cursor: pointer; letter-spacing: 0.05em; text-transform: uppercase;
//   transition: all 0.3s;
//   &:hover { background: var(--gold-ghost); border-color: var(--gold); transform: translateY(-2px); }
// `;

// /* ─────────────── TOP NAV ─────────────── */
// const TopNav = styled.div`
//   position: relative; z-index: 10;
//   max-width: 1200px; margin: 0 auto;
//   padding: 2rem 2rem 0;
//   display: flex; align-items: center; justify-content: space-between;
//   @media(max-width:640px){ padding: 1.25rem 1.25rem 0; }
// `;
// const NavLeft = styled.div`display: flex; align-items: center; gap: 0.375rem;`;
// const NavBtn = styled.button`
//   display: inline-flex; align-items: center; gap: 0.5rem;
//   font-family: var(--font-body); font-size: 0.78rem; font-weight: 600;
//   letter-spacing: 0.12em; text-transform: uppercase;
//   color: var(--fog); background: transparent; border: none;
//   padding: 0.5rem 0.75rem; cursor: pointer;
//   transition: color 0.2s;
//   svg { width: 0.85rem; height: 0.85rem; }
//   &:hover { color: var(--gold); }
// `;
// const NavSep = styled.span`
//   width: 1px; height: 16px; background: var(--mist);
// `;
// const NavBrand = styled.div`
//   font-family: var(--font-display);
//   font-size: 1.1rem; font-weight: 600;
//   color: var(--gold-warm);
//   letter-spacing: 0.06em;
// `;

// /* ─────────────── HERO ─────────────── */
// const HeroWrap = styled.div`
//   padding: 4rem 0 3rem;
//   @media(max-width:768px){ padding: 2.5rem 0 2rem; }
// `;

// const HeroLayout = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 400px;
//   gap: 4rem;
//   align-items: center;
//   @media(max-width:960px){ grid-template-columns: 1fr 320px; gap: 2.5rem; }
//   @media(max-width:768px){ grid-template-columns: 1fr; gap: 3rem; }
// `;

// const HeroText = styled.div`
//   animation: ${fadeUp} 0.8s cubic-bezier(0.22,1,0.36,1) both;
// `;

// const HeroEyebrow = styled.div`
//   display: inline-flex; align-items: center; gap: 0.75rem;
//   margin-bottom: 1.75rem;
// `;
// const EyebrowLine = styled.div`
//   width: 40px; height: 1px;
//   background: linear-gradient(90deg, var(--gold), transparent);
// `;
// const EyebrowText = styled.span`
//   font-size: 0.7rem; letter-spacing: 0.22em; text-transform: uppercase;
//   font-weight: 600; color: var(--gold-warm);
// `;

// const HeroName = styled.h1`
//   font-family: var(--font-display);
//   font-size: clamp(3rem, 7vw, 6.5rem);
//   font-weight: 300;
//   line-height: 0.95;
//   letter-spacing: -0.02em;
//   color: var(--white);
//   margin-bottom: 0.5rem;

//   span.italic {
//     font-style: italic;
//     font-weight: 700;
//     background: linear-gradient(135deg, var(--gold-bright) 0%, var(--gold) 50%, var(--gold-warm) 100%);
//     -webkit-background-clip: text;
//     -webkit-text-fill-color: transparent;
//     background-clip: text;
//   }
// `;

// const HeroTitle = styled.p`
//   font-size: clamp(0.875rem, 1.5vw, 1rem);
//   color: var(--fog);
//   font-weight: 400;
//   letter-spacing: 0.08em;
//   text-transform: uppercase;
//   margin-bottom: 2rem;
// `;

// const HeroMeta = styled.div`
//   display: flex; flex-wrap: wrap; gap: 0.625rem;
//   margin-bottom: 2.5rem;
// `;
// const MetaChip = styled.div`
//   display: flex; align-items: center; gap: 0.5rem;
//   font-size: 0.825rem; color: var(--silver);
//   background: var(--graphite);
//   border: 1px solid var(--slate);
//   padding: 0.5rem 1rem; border-radius: 99px;
//   transition: all 0.2s;
//   &:hover { border-color: var(--gold-border); color: var(--gold-pale); }
//   svg { width: 0.75rem; height: 0.75rem; color: var(--gold-warm); flex-shrink: 0; }
// `;

// const HeroSocials = styled.div`
//   display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
// `;
// const SocialBtn = styled.a`
//   display: inline-flex; align-items: center; justify-content: center;
//   width: 44px; height: 44px;
//   background: var(--graphite);
//   border: 1px solid var(--slate);
//   border-radius: 50%;
//   color: var(--silver); text-decoration: none;
//   transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
//   svg { width: 1rem; height: 1rem; }
//   &:hover {
//     background: var(--gold-ghost);
//     border-color: var(--gold-border);
//     color: var(--gold);
//     transform: translateY(-4px) scale(1.1);
//     box-shadow: 0 8px 24px rgba(212,168,67,0.2);
//   }
// `;
// const ResumeBtn = styled.a`
//   display: inline-flex; align-items: center; gap: 0.6rem;
//   padding: 0.7rem 1.5rem;
//   background: linear-gradient(135deg, var(--gold-warm), var(--gold));
//   color: var(--obsidian); border: none; border-radius: 99px;
//   font-family: var(--font-body); font-size: 0.78rem; font-weight: 700;
//   letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none;
//   cursor: pointer;
//   box-shadow: 0 4px 20px rgba(212,168,67,0.3);
//   transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
//   svg { width: 0.85rem; height: 0.85rem; }
//   &:hover {
//     transform: translateY(-3px) scale(1.04);
//     box-shadow: 0 10px 32px rgba(212,168,67,0.45);
//     filter: brightness(1.08);
//   }
// `;

// /* ─────────────── HERO RIGHT (Photo + Stats) ─────────────── */
// const HeroRight = styled.div`
//   animation: ${fadeUp} 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both;
//   display: flex; flex-direction: column; align-items: center; gap: 2rem;
//   @media(max-width:768px){ align-items: flex-start; flex-direction: row; flex-wrap: wrap; }
// `;

// const PhotoFrame = styled.div`
//   position: relative;
//   width: 100%;
//   max-width: 340px;
//   @media(max-width:960px){ max-width: 280px; }
//   @media(max-width:768px){ max-width: 200px; }
// `;
// const PhotoOuter = styled.div`
//   position: relative;
//   width: 100%;
//   padding-bottom: 120%;
//   border-radius: var(--r-xl);
//   overflow: hidden;
// `;
// const PhotoCornerTL = styled.div`
//   position: absolute; top: -1px; left: -1px;
//   width: 60px; height: 60px;
//   border-top: 2px solid var(--gold-warm);
//   border-left: 2px solid var(--gold-warm);
//   border-radius: var(--r-lg) 0 0 0;
//   z-index: 3; pointer-events: none;
// `;
// const PhotoCornerBR = styled.div`
//   position: absolute; bottom: -1px; right: -1px;
//   width: 60px; height: 60px;
//   border-bottom: 2px solid var(--gold-warm);
//   border-right: 2px solid var(--gold-warm);
//   border-radius: 0 0 var(--r-lg) 0;
//   z-index: 3; pointer-events: none;
// `;
// const PhotoImg = styled.img`
//   position: absolute; inset: 0;
//   width: 100%; height: 100%;
//   object-fit: cover;
// `;
// const PhotoPlaceholder = styled.div`
//   position: absolute; inset: 0;
//   background: linear-gradient(145deg, var(--graphite), var(--slate));
//   display: flex; align-items: center; justify-content: center;
//   svg { width: 5rem; height: 5rem; color: var(--ash); }
// `;
// const PhotoShine = styled.div`
//   position: absolute; inset: 0;
//   background: linear-gradient(135deg, rgba(212,168,67,0.06) 0%, transparent 50%, rgba(212,168,67,0.04) 100%);
//   z-index: 2; pointer-events: none;
// `;

// const StatsGrid = styled.div`
//   display: grid; grid-template-columns: repeat(2,1fr); gap: 0.875rem;
//   width: 100%; max-width: 340px;
//   @media(max-width:960px){ max-width: 280px; }
// `;
// const StatCard = styled.div`
//   background: var(--graphite);
//   border: 1px solid var(--card-border);
//   border-radius: var(--r-md);
//   padding: 1.125rem 1rem;
//   text-align: center;
//   transition: all 0.3s;
//   &:hover {
//     border-color: var(--gold-border);
//     box-shadow: 0 4px 20px rgba(212,168,67,0.12);
//     transform: translateY(-2px);
//   }
// `;
// const StatNum = styled.div`
//   font-family: var(--font-display);
//   font-size: 2.25rem; font-weight: 700;
//   background: linear-gradient(135deg, var(--gold-bright), var(--gold-warm));
//   -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
//   line-height: 1;
//   margin-bottom: 0.35rem;
// `;
// const StatLabel = styled.div`
//   font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase;
//   color: var(--ash); font-weight: 600;
// `;

// /* ─────────────── GOLD DIVIDER ─────────────── */
// const GoldDivider = styled.div`
//   display: flex; align-items: center; gap: 1.25rem;
//   margin: 0 0 3.5rem;
// `;
// const DivLine = styled.div`
//   flex: 1; height: 1px;
//   background: linear-gradient(${p => p.$dir === 'right' ? '90deg' : '270deg'}, transparent, var(--gold-border));
// `;
// const DivDiamond = styled.div`
//   width: 8px; height: 8px;
//   background: var(--gold);
//   transform: rotate(45deg);
//   flex-shrink: 0;
//   animation: ${goldPulse} 2.5s ease infinite;
// `;

// /* ─────────────── SUMMARY ─────────────── */
// const SummaryBlock = styled.div`
//   position: relative;
//   background: var(--graphite);
//   border: 1px solid var(--gold-border);
//   border-radius: var(--r-xl);
//   padding: 3rem 3.5rem;
//   margin-bottom: 3.5rem;
//   overflow: hidden;
//   animation: ${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both;

//   &::before {
//     content: '"';
//     position: absolute; top: -2rem; left: 2rem;
//     font-family: var(--font-display);
//     font-size: 14rem; font-weight: 700;
//     color: rgba(212,168,67,0.05);
//     line-height: 1; pointer-events: none; user-select: none;
//   }

//   &::after {
//     content: '';
//     position: absolute; top: 0; right: 0;
//     width: 200px; height: 200px;
//     background: radial-gradient(circle, rgba(212,168,67,0.06) 0%, transparent 70%);
//     pointer-events: none;
//   }

//   @media(max-width:640px){ padding: 2rem 1.75rem; &::before { font-size: 8rem; } }
// `;
// const SummaryText = styled.p`
//   font-family: var(--font-display);
//   font-size: clamp(1.1rem, 2.5vw, 1.5rem);
//   font-weight: 400; font-style: italic;
//   color: var(--pearl);
//   line-height: 1.75;
//   position: relative; z-index: 1;
// `;

// /* ─────────────── SECTION ─────────────── */
// const Section = styled.div`
//   margin-bottom: 4rem;
//   animation: ${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) ${p => p.$delay || '0s'} both;
//   @media(max-width:640px){ margin-bottom: 3rem; }
// `;

// const SectionHeader = styled.div`
//   display: flex; align-items: center; gap: 1.25rem;
//   margin-bottom: 2.25rem;
// `;
// const SectionIcon = styled.div`
//   width: 48px; height: 48px; flex-shrink: 0;
//   background: linear-gradient(135deg, var(--gold-warm), var(--gold-deep));
//   border-radius: var(--r-md);
//   display: flex; align-items: center; justify-content: center;
//   box-shadow: 0 4px 16px rgba(212,168,67,0.3);
//   svg { width: 1.2rem; height: 1.2rem; color: var(--obsidian); }
// `;
// const SectionTitle = styled.h2`
//   font-family: var(--font-display);
//   font-size: clamp(1.6rem, 3vw, 2.25rem);
//   font-weight: 600; letter-spacing: -0.01em;
//   color: var(--white);
//   flex-shrink: 0;
// `;
// const SectionRule = styled.div`
//   flex: 1; height: 1px;
//   background: linear-gradient(90deg, var(--gold-border), transparent);
// `;

// /* ─────────────── TIMELINE ─────────────── */
// const TimelineWrap = styled.div`
//   display: flex; flex-direction: column;
//   padding-left: 1rem;
//   @media(max-width:640px){ padding-left: 0; }
// `;

// const TLItem = styled.div`
//   display: grid;
//   grid-template-columns: 180px 2px 1fr;
//   gap: 0 2rem;
//   @media(max-width:860px){ grid-template-columns: 0 2px 1fr; gap: 0 1.5rem; }
//   @media(max-width:480px){ grid-template-columns: 0 2px 1fr; gap: 0 1rem; }
// `;

// const TLDateCol = styled.div`
//   display: flex; flex-direction: column; align-items: flex-end;
//   padding-top: 1.875rem; padding-bottom: 2.5rem;
//   @media(max-width:860px){ display: none; }
// `;
// const TLDateBadge = styled.span`
//   font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
//   color: var(--gold-warm);
//   background: rgba(212,168,67,0.08);
//   border: 1px solid rgba(212,168,67,0.15);
//   padding: 0.35rem 0.875rem; border-radius: 99px;
//   white-space: nowrap;
// `;

// const TLSpine = styled.div`
//   display: flex; flex-direction: column; align-items: center;
//   position: relative;
// `;
// const TLNode = styled.div`
//   width: 14px; height: 14px; flex-shrink: 0;
//   background: linear-gradient(135deg, var(--gold), var(--gold-warm));
//   border-radius: 50%;
//   border: 3px solid var(--obsidian);
//   box-shadow: 0 0 0 2px var(--gold-warm), 0 0 16px rgba(212,168,67,0.4);
//   margin-top: 1.875rem; z-index: 1;
// `;
// const TLLine = styled.div`
//   flex: 1; width: 2px;
//   background: linear-gradient(to bottom, var(--gold-border), transparent);
//   margin-top: 6px;
// `;

// const TLBody = styled.div`
//   padding: 1.5rem 0 2.5rem 0;
// `;

// const TLCard = styled.div`
//   background: var(--card-bg);
//   border: 1px solid var(--card-border);
//   border-radius: var(--r-lg);
//   padding: 1.875rem 2rem;
//   backdrop-filter: blur(12px);
//   transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
//   position: relative; overflow: hidden;
//   box-shadow: var(--shadow-card);

//   &::before {
//     content: '';
//     position: absolute; top: 0; left: 0; right: 0; height: 2px;
//     background: linear-gradient(90deg, transparent, var(--gold), transparent);
//     opacity: 0; transition: opacity 0.3s;
//   }

//   &:hover {
//     transform: translateX(8px);
//     border-color: var(--gold-border);
//     box-shadow: var(--shadow-hover);
//     &::before { opacity: 1; }
//   }

//   @media(max-width:480px){ padding: 1.375rem 1.25rem; }
// `;

// const TLCardDate = styled.span`
//   display: none; font-size: 0.68rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;
//   color: var(--gold-warm); margin-bottom: 0.6rem;
//   @media(max-width:860px){ display: block; }
// `;
// const TLTitle = styled.h3`
//   font-size: clamp(1rem, 2vw, 1.15rem); font-weight: 600;
//   color: var(--white); margin-bottom: 0.3rem; letter-spacing: -0.01em;
// `;
// const TLSub = styled.p`
//   font-size: 0.875rem; color: var(--gold-warm); font-weight: 500;
//   margin-bottom: 0.75rem; letter-spacing: 0.02em;
// `;
// const TLDesc = styled.p`
//   font-size: 0.875rem; color: var(--fog); line-height: 1.75;
// `;

// /* ─────────────── PROJECTS ─────────────── */
// const ProjectsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
//   gap: 1.5rem;
//   @media(max-width:640px){ grid-template-columns: 1fr; gap: 1.125rem; }
// `;

// const ProjCard = styled.div`
//   background: var(--card-bg);
//   border: 1px solid var(--card-border);
//   border-radius: var(--r-xl);
//   padding: 2.25rem 2rem;
//   backdrop-filter: blur(12px);
//   display: flex; flex-direction: column; gap: 1rem;
//   box-shadow: var(--shadow-card);
//   transition: all 0.4s cubic-bezier(0.34,1.56,0.64,1);
//   position: relative; overflow: hidden;

//   &::after {
//     content: '';
//     position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
//     background: linear-gradient(90deg, var(--gold-warm), var(--gold-bright));
//     opacity: 0; transition: opacity 0.3s;
//   }

//   &:hover {
//     transform: translateY(-8px);
//     border-color: var(--gold-border);
//     box-shadow: var(--shadow-hover);
//     &::after { opacity: 1; }
//   }

//   @media(max-width:480px){ padding: 1.75rem 1.5rem; }
// `;

// const ProjIndex = styled.div`
//   font-family: var(--font-display);
//   font-size: 5rem; font-weight: 700; line-height: 1;
//   color: rgba(212,168,67,0.08);
//   position: absolute; top: 1rem; right: 1.5rem;
//   user-select: none; pointer-events: none;
// `;

// const ProjTitle = styled.h3`
//   font-size: clamp(1.05rem, 2vw, 1.2rem); font-weight: 600;
//   color: var(--white); line-height: 1.3; padding-right: 3rem;
//   letter-spacing: -0.01em;
// `;
// const ProjDesc = styled.p`
//   font-size: 0.875rem; color: var(--fog); line-height: 1.75; flex: 1;
// `;
// const TechRow = styled.div`display: flex; flex-wrap: wrap; gap: 0.4rem;`;
// const TechTag = styled.span`
//   font-size: 0.65rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
//   color: var(--gold-warm); background: rgba(212,168,67,0.08);
//   border: 1px solid rgba(212,168,67,0.15);
//   padding: 0.25rem 0.65rem; border-radius: 0.35rem;
// `;
// const ProjLinks = styled.div`display: flex; gap: 0.625rem; flex-wrap: wrap;`;
// const ProjLink = styled.a`
//   display: inline-flex; align-items: center; gap: 0.4rem;
//   font-size: 0.75rem; font-weight: 600; padding: 0.5rem 1rem;
//   border-radius: var(--r-md); text-decoration: none;
//   letter-spacing: 0.06em; text-transform: uppercase;
//   border: 1px solid var(--card-border); color: var(--silver);
//   background: transparent;
//   transition: all 0.25s;
//   &:hover {
//     background: var(--gold-ghost); border-color: var(--gold-border);
//     color: var(--gold); transform: translateY(-2px);
//   }
//   svg { width: 0.7rem; height: 0.7rem; }
// `;

// /* ─────────────── SKILLS ─────────────── */
// const SkillsGrid = styled.div`
//   display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem;
//   @media(max-width:900px){ grid-template-columns: repeat(2,1fr); }
//   @media(max-width:520px){ grid-template-columns: 1fr; gap: 1rem; }
// `;
// const SkillCard = styled.div`
//   background: var(--card-bg);
//   border: 1px solid var(--card-border);
//   border-radius: var(--r-lg);
//   padding: 1.75rem;
//   backdrop-filter: blur(12px);
//   box-shadow: var(--shadow-card);
//   transition: all 0.3s;
//   &:hover { border-color: var(--gold-border); box-shadow: 0 4px 24px rgba(212,168,67,0.1); }
// `;
// const SkillCategory = styled.h4`
//   font-size: 0.65rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase;
//   color: var(--gold-warm); margin-bottom: 1.25rem;
//   padding-bottom: 0.875rem;
//   border-bottom: 1px solid var(--gold-border);
//   display: flex; align-items: center; gap: 0.6rem;
//   &::before {
//     content: '';
//     width: 6px; height: 6px;
//     background: var(--gold);
//     border-radius: 50%; flex-shrink: 0;
//   }
// `;
// const SkillList = styled.div`display: flex; flex-direction: column; gap: 0.5rem;`;
// const SkillRow = styled.div`
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 0.55rem 0.875rem;
//   background: var(--void);
//   border: 1px solid transparent;
//   border-radius: var(--r-sm);
//   transition: all 0.2s; cursor: default;
//   &:hover { border-color: var(--gold-border); background: var(--gold-ghost); }
//   span { font-size: 0.875rem; font-weight: 400; color: var(--silver); }
// `;
// const SkillDot = styled.div`
//   width: 5px; height: 5px; border-radius: 50%;
//   background: var(--gold); flex-shrink: 0;
// `;

// /* ─────────────── CERTIFICATIONS ─────────────── */
// const CertsGrid = styled.div`
//   display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem;
//   @media(max-width:600px){ grid-template-columns: 1fr; gap: 1rem; }
// `;
// const CertCard = styled.div`
//   background: var(--card-bg);
//   border: 1px solid var(--card-border);
//   border-radius: var(--r-lg);
//   padding: 1.875rem;
//   backdrop-filter: blur(12px);
//   box-shadow: var(--shadow-card);
//   display: flex; flex-direction: column; gap: 0.5rem;
//   transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
//   position: relative; overflow: hidden;

//   &::before {
//     content: '◆'; position: absolute; top: 1.125rem; right: 1.25rem;
//     color: var(--gold); font-size: 0.8rem;
//     animation: ${goldPulse} 3s ease infinite;
//   }

//   &:hover {
//     transform: translateY(-5px);
//     border-color: rgba(212,168,67,0.25);
//     box-shadow: var(--shadow-hover);
//   }
// `;
// const CertName = styled.h3`
//   font-size: 1rem; font-weight: 600; color: var(--white);
//   line-height: 1.35; padding-right: 1.5rem;
// `;
// const CertIssuer = styled.p`
//   font-size: 0.825rem; color: var(--gold-warm); font-weight: 500;
// `;
// const CertLink = styled.a`
//   display: inline-flex; align-items: center; gap: 0.4rem;
//   font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase;
//   color: var(--fog); text-decoration: none; margin-top: 0.5rem;
//   transition: all 0.2s;
//   &:hover { color: var(--gold); gap: 0.65rem; }
//   svg { width: 0.72rem; height: 0.72rem; }
// `;

// /* ─────────────── INTERESTS ─────────────── */
// const InterestWrap = styled.div`display: flex; flex-wrap: wrap; gap: 0.75rem;`;
// const InterestPill = styled.span`
//   font-size: 0.9rem; font-weight: 500; color: var(--silver);
//   background: var(--graphite);
//   border: 1px solid var(--slate);
//   padding: 0.625rem 1.375rem; border-radius: 99px;
//   letter-spacing: 0.03em;
//   transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); cursor: default;
//   &:hover {
//     background: var(--gold-ghost); border-color: var(--gold-border);
//     color: var(--gold-pale);
//     transform: translateY(-3px) scale(1.04);
//     box-shadow: 0 6px 20px rgba(212,168,67,0.15);
//   }
//   @media(max-width:480px){ font-size: 0.825rem; padding: 0.5rem 1.125rem; }
// `;

// /* ─────────────── EMPTY ─────────────── */
// const EmptyState = styled.div`
//   background: var(--card-bg);
//   border: 1px dashed rgba(212,168,67,0.12);
//   border-radius: var(--r-lg);
//   padding: 3rem;
//   display: flex; flex-direction: column; align-items: center;
//   gap: 0.875rem; color: var(--ash); font-size: 0.875rem; text-align: center;
//   backdrop-filter: blur(8px);
//   svg { width: 2.5rem; height: 2.5rem; opacity: 0.25; }
// `;

// /* ─────────────── LOADING ─────────────── */
// const LoadWrap = styled.div`
//   min-height: 100vh; display: flex; flex-direction: column;
//   align-items: center; justify-content: center; gap: 2rem;
//   background: var(--obsidian);
// `;
// const Spinner = styled.div`
//   width: 48px; height: 48px;
//   border: 2px solid var(--graphite);
//   border-top-color: var(--gold);
//   border-radius: 50%;
//   animation: ${spin} 0.9s linear infinite;
// `;
// const LoadLabel = styled.p`
//   font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
//   color: var(--ash); font-weight: 600;
// `;
// const ShimmerBar = styled.div`
//   width: 160px; height: 2px; border-radius: 99px;
//   background: linear-gradient(90deg, var(--graphite) 0%, var(--gold-border) 50%, var(--graphite) 100%);
//   background-size: 800px;
//   animation: ${shimmer} 1.8s infinite linear;
// `;

// /* ─────────────── ERROR ─────────────── */
// const ErrorWrap = styled.div`
//   min-height: 100vh; display: flex; align-items: center; justify-content: center;
//   padding: 2rem; background: var(--obsidian);
// `;
// const ErrorBox = styled.div`
//   background: var(--graphite);
//   border: 1px solid var(--gold-border);
//   border-radius: var(--r-xl);
//   padding: 4rem 3rem; max-width: 480px; width: 100%;
//   text-align: center;
//   box-shadow: var(--shadow-hover);
//   animation: ${fadeUp} 0.6s ease both;
//   @media(max-width:480px){ padding: 3rem 2rem; }
// `;
// const ErrorIconWrap = styled.div`
//   width: 72px; height: 72px; border-radius: 50%;
//   background: rgba(212,168,67,0.08); border: 1px solid var(--gold-border);
//   display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem;
//   svg { color: var(--gold); width: 2rem; height: 2rem; }
// `;
// const ErrorTitle = styled.h2`
//   font-family: var(--font-display); font-size: 2rem; font-weight: 600;
//   color: var(--white); margin-bottom: 0.875rem;
// `;
// const ErrorMsg = styled.p`color: var(--fog); line-height: 1.65; margin-bottom: 2.5rem;`;
// const ErrorBtn = styled.button`
//   display: inline-flex; align-items: center; gap: 0.6rem;
//   background: linear-gradient(135deg, var(--gold-warm), var(--gold));
//   color: var(--obsidian); border: none; padding: 0.875rem 2.25rem;
//   border-radius: var(--r-md); font-family: var(--font-body);
//   font-size: 0.85rem; font-weight: 700; letter-spacing: 0.08em;
//   text-transform: uppercase; cursor: pointer;
//   box-shadow: var(--shadow-gold);
//   transition: all 0.3s;
//   &:hover { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(212,168,67,0.4); }
// `;

// /* ─────────────── HELPERS ─────────────── */
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };

// /* ════════════════════════════════════════════ */
// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});

//   const [showOverlay, setShowOverlay] = useState(() => {
//     const dismissed = sessionStorage.getItem('overlayDismissed');
//     if (dismissed === 'true') return false;
//     return !user;
//   });
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);

//   useEffect(() => {
//     if (!showOverlay) return;
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) { handleCloseOverlay(); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timer);
//   }, [showOverlay]);

//   const handleCloseOverlay = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   const fetchImageUrl = async (path) => {
//     if (!path) return null;
//     try { return await publicService.getSignedUrl(path); }
//     catch { return null; }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const imagePaths = [];
//         if (data.profile?.profilePhoto) imagePaths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         data.projects?.forEach((proj, idx) => { if (proj.image) imagePaths.push({ key: `project_${idx}`, path: proj.image }); });
//         data.certifications?.forEach((cert, idx) => { if (cert.image) imagePaths.push({ key: `cert_${idx}`, path: cert.image }); });
//         const urlMap = {};
//         await Promise.all(imagePaths.map(async ({ key, path }) => {
//           const url = await fetchImageUrl(path);
//           if (url) urlMap[key] = url;
//         }));
//         setImageUrls(urlMap);
//       } catch (err) {
//         setError(err.message || 'Profile not found');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (username) load();
//   }, [username]);

//   if (loading) {
//     return (
//       <>
//         <GlobalStyle />
//         <LoadWrap>
//           <Spinner />
//           <ShimmerBar />
//           <LoadLabel>Loading Portfolio</LoadLabel>
//         </LoadWrap>
//       </>
//     );
//   }

//   if (error || !portfolio) {
//     return (
//       <>
//         <GlobalStyle />
//         <ErrorWrap>
//           <ErrorBox>
//             <ErrorIconWrap><AlertCircle /></ErrorIconWrap>
//             <ErrorTitle>{error ? 'Profile Not Found' : 'No Portfolio Yet'}</ErrorTitle>
//             <ErrorMsg>{error || "This user hasn't set up their portfolio yet."}</ErrorMsg>
//             <ErrorBtn onClick={() => navigate('/')}><Home size={16} /> Return Home</ErrorBtn>
//           </ErrorBox>
//         </ErrorWrap>
//       </>
//     );
//   }

//   const {
//     profile = {}, education = [], experience = [],
//     projects = [], skills = {}, certifications = [], interests = {}
//   } = portfolio;

//   const fullName = profile.name || 'Anonymous User';
//   const [firstName, ...rest] = fullName.split(' ');
//   const lastName = rest.join(' ') || '';
//   const skillCategories = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;

//   return (
//     <>
//       <GlobalStyle />

//       {/* ── OVERLAY ── */}
//       <OverlayBackdrop $show={showOverlay}>
//         <OverlayBox $isClosing={isClosing}>
//           <OvClose onClick={handleCloseOverlay}><X /></OvClose>
//           <OvGoldRing><User /></OvGoldRing>
//           <OvTitle>Build Your Portfolio</OvTitle>
//           <OvDesc>
//             Join the professionals who showcase their work with elegance. Create your public profile and make your mark.
//           </OvDesc>
//           <OvTimer>Closes in {timeLeft} seconds</OvTimer>
//           <OvBtns>
//             <OvBtnPrimary onClick={() => navigate('/login')}>Sign In</OvBtnPrimary>
//             <OvBtnSecondary onClick={() => navigate('/register')}>Create Account</OvBtnSecondary>
//           </OvBtns>
//         </OverlayBox>
//       </OverlayBackdrop>

//       <Page>
//         <BgCanvas />
//         <NoiseOverlay />
//         <GridLines />

//         {/* ── NAV ── */}
//         <TopNav>
//           <NavLeft>
//             <NavBtn onClick={() => navigate(-1)}><ChevronLeft /> Back</NavBtn>
//             <NavSep />
//             <NavBtn onClick={() => navigate('/')}><Home /> Home</NavBtn>
//           </NavLeft>
//           <NavBrand>Portfolio</NavBrand>
//         </TopNav>

//         <Inner>
//           {/* ══ HERO ══ */}
//           <HeroWrap>
//             <HeroLayout>
//               <HeroText>
//                 <HeroEyebrow>
//                   <EyebrowLine />
//                   <EyebrowText>{profile.domain || 'Professional Portfolio'}</EyebrowText>
//                   <EyebrowLine />
//                 </HeroEyebrow>

//                 <HeroName>
//                   {firstName}&nbsp;<br />
//                   <span className="italic">{lastName || firstName}</span>
//                 </HeroName>

//                 <HeroTitle>
//                   {profile.domain || 'Professional'}&nbsp;&nbsp;·&nbsp;&nbsp;{profile.location || 'Location not set'}
//                 </HeroTitle>

//                 {(profile.email || profile.phone || profile.location) && (
//                   <HeroMeta>
//                     {profile.email    && <MetaChip><Mail />    {profile.email}</MetaChip>}
//                     {profile.phone    && <MetaChip><Phone />   {profile.phone}</MetaChip>}
//                     {profile.location && <MetaChip><MapPin />  {profile.location}</MetaChip>}
//                   </HeroMeta>
//                 )}

//                 {(socialLinks.length > 0 || cvLink) && (
//                   <HeroSocials>
//                     {socialLinks.map((item) => {
//                       const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                       const Icon = meta.icon;
//                       const href = buildSocialHref(item);
//                       return (
//                         <SocialBtn key={item._id || item.id} href={href} target="_blank" rel="noopener noreferrer" title={item.name || meta.label}>
//                           <Icon />
//                         </SocialBtn>
//                       );
//                     })}
//                     {cvLink && (
//                       <ResumeBtn href={cvLink} target="_blank" rel="noopener noreferrer">
//                         <FileText /> Resume
//                       </ResumeBtn>
//                     )}
//                   </HeroSocials>
//                 )}
//               </HeroText>

//               <HeroRight>
//                 <PhotoFrame>
//                   <PhotoOuter>
//                     {imageUrls.profilePhoto
//                       ? <PhotoImg src={imageUrls.profilePhoto} alt={fullName} />
//                       : <PhotoPlaceholder><User /></PhotoPlaceholder>
//                     }
//                     <PhotoShine />
//                   </PhotoOuter>
//                   <PhotoCornerTL />
//                   <PhotoCornerBR />
//                 </PhotoFrame>

//                 <StatsGrid>
//                   <StatCard><StatNum>{education.length || '—'}</StatNum><StatLabel>Education</StatLabel></StatCard>
//                   <StatCard><StatNum>{experience.length || '—'}</StatNum><StatLabel>Experience</StatLabel></StatCard>
//                   <StatCard><StatNum>{projects.length || '—'}</StatNum><StatLabel>Projects</StatLabel></StatCard>
//                   <StatCard><StatNum>{certifications.length || '—'}</StatNum><StatLabel>Certifications</StatLabel></StatCard>
//                 </StatsGrid>
//               </HeroRight>
//             </HeroLayout>
//           </HeroWrap>

//           <GoldDivider>
//             <DivLine $dir="left" />
//             <DivDiamond />
//             <DivLine $dir="right" />
//           </GoldDivider>

//           {/* ══ SUMMARY ══ */}
//           {profile.summary && (
//             <SummaryBlock>
//               <SummaryText>"{profile.summary}"</SummaryText>
//             </SummaryBlock>
//           )}

//           {/* ══ EDUCATION ══ */}
//           <Section $delay="0.25s">
//             <SectionHeader>
//               <SectionIcon><BookOpen /></SectionIcon>
//               <SectionTitle>Education</SectionTitle>
//               <SectionRule />
//             </SectionHeader>

//             {education.length > 0 ? (
//               <TimelineWrap>
//                 {education.map((edu, i) => {
//                   const dur = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'N/A';
//                   const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : (edu.percentage ? `Percentage: ${edu.percentage}%` : null);
//                   return (
//                     <TLItem key={edu._id || i}>
//                       <TLDateCol><TLDateBadge>{dur}</TLDateBadge></TLDateCol>
//                       <TLSpine>
//                         <TLNode />
//                         {i < education.length - 1 && <TLLine />}
//                       </TLSpine>
//                       <TLBody>
//                         <TLCard>
//                           <TLCardDate>{dur}</TLCardDate>
//                           <TLTitle>{na(edu.institution)}</TLTitle>
//                           <TLSub>{na(edu.course)}</TLSub>
//                           {score && <TLDesc>📊 {score}</TLDesc>}
//                         </TLCard>
//                       </TLBody>
//                     </TLItem>
//                   );
//                 })}
//               </TimelineWrap>
//             ) : (
//               <EmptyState><BookOpen /><span>No education details added yet</span></EmptyState>
//             )}
//           </Section>

//           {/* ══ EXPERIENCE ══ */}
//           <Section $delay="0.3s">
//             <SectionHeader>
//               <SectionIcon><Briefcase /></SectionIcon>
//               <SectionTitle>Experience</SectionTitle>
//               <SectionRule />
//             </SectionHeader>

//             {experience.length > 0 ? (
//               <TimelineWrap>
//                 {experience.map((exp, i) => (
//                   <TLItem key={exp._id || i}>
//                     <TLDateCol><TLDateBadge>{exp.duration || 'N/A'}</TLDateBadge></TLDateCol>
//                     <TLSpine>
//                       <TLNode />
//                       {i < experience.length - 1 && <TLLine />}
//                     </TLSpine>
//                     <TLBody>
//                       <TLCard>
//                         <TLCardDate>{exp.duration || 'N/A'}</TLCardDate>
//                         <TLTitle>{na(exp.role)}</TLTitle>
//                         <TLSub>{na(exp.company)}{exp.type ? ` · ${exp.type}` : ''}</TLSub>
//                         {exp.description && <TLDesc>{exp.description}</TLDesc>}
//                       </TLCard>
//                     </TLBody>
//                   </TLItem>
//                 ))}
//               </TimelineWrap>
//             ) : (
//               <EmptyState><Briefcase /><span>No experience details added yet</span></EmptyState>
//             )}
//           </Section>

//           {/* ══ PROJECTS ══ */}
//           <Section $delay="0.35s">
//             <SectionHeader>
//               <SectionIcon><Code2 /></SectionIcon>
//               <SectionTitle>Projects</SectionTitle>
//               <SectionRule />
//             </SectionHeader>

//             {projects.length > 0 ? (
//               <ProjectsGrid>
//                 {projects.map((proj, i) => (
//                   <ProjCard key={proj._id || i}>
//                     <ProjIndex>0{i + 1}</ProjIndex>
//                     <ProjTitle>{na(proj.title)}</ProjTitle>
//                     {proj.description && <ProjDesc>{proj.description}</ProjDesc>}
//                     {proj.tech?.length > 0 && (
//                       <TechRow>{proj.tech.map((t, j) => <TechTag key={j}>{t}</TechTag>)}</TechRow>
//                     )}
//                     {(proj.demo || proj.repo) && (
//                       <ProjLinks>
//                         {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLink>}
//                         {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLink>}
//                       </ProjLinks>
//                     )}
//                   </ProjCard>
//                 ))}
//               </ProjectsGrid>
//             ) : (
//               <EmptyState><Code2 /><span>No projects added yet</span></EmptyState>
//             )}
//           </Section>

//           {/* ══ SKILLS ══ */}
//           <Section $delay="0.4s">
//             <SectionHeader>
//               <SectionIcon><Layers /></SectionIcon>
//               <SectionTitle>Skills</SectionTitle>
//               <SectionRule />
//             </SectionHeader>

//             {skillCategories.length > 0 ? (
//               <SkillsGrid>
//                 {skillCategories.map((cat, idx) => (
//                   <SkillCard key={cat._id || idx}>
//                     <SkillCategory>{cat.category}</SkillCategory>
//                     <SkillList>
//                       {cat.items.map((item, i) => (
//                         <SkillRow key={i}><span>{item}</span><SkillDot /></SkillRow>
//                       ))}
//                     </SkillList>
//                   </SkillCard>
//                 ))}
//               </SkillsGrid>
//             ) : (
//               <EmptyState><Layers /><span>No skills added yet</span></EmptyState>
//             )}
//           </Section>

//           {/* ══ CERTIFICATIONS ══ */}
//           <Section $delay="0.45s">
//             <SectionHeader>
//               <SectionIcon><Award /></SectionIcon>
//               <SectionTitle>Certifications</SectionTitle>
//               <SectionRule />
//             </SectionHeader>

//             {certifications.length > 0 ? (
//               <CertsGrid>
//                 {certifications.map((cert, i) => (
//                   <CertCard key={cert._id || i}>
//                     <CertName>{na(cert.name)}</CertName>
//                     <CertIssuer>{na(cert.issuer)}</CertIssuer>
//                     {cert.link && (
//                       <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">
//                         View Credential <ArrowUpRight />
//                       </CertLink>
//                     )}
//                   </CertCard>
//                 ))}
//               </CertsGrid>
//             ) : (
//               <EmptyState><Award /><span>No certifications added yet</span></EmptyState>
//             )}
//           </Section>

//           {/* ══ INTERESTS ══ */}
//           {interests?.interests?.length > 0 && (
//             <Section $delay="0.5s">
//               <SectionHeader>
//                 <SectionIcon><Sparkles /></SectionIcon>
//                 <SectionTitle>Interests</SectionTitle>
//                 <SectionRule />
//               </SectionHeader>
//               <InterestWrap>
//                 {interests.interests.map((item, i) => (
//                   <InterestPill key={i}>{item}</InterestPill>
//                 ))}
//               </InterestWrap>
//             </Section>
//           )}

//           {/* ── FOOTER LINE ── */}
//           <GoldDivider style={{ marginBottom: 0 }}>
//             <DivLine $dir="left" />
//             <DivDiamond />
//             <DivLine $dir="right" />
//           </GoldDivider>
//         </Inner>
//       </Page>
//     </>
//   );
// };

// export default PublicProfilePage;





















// ===================== Template 3 ======================= //

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Globe, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Download, ChevronRight,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// /* ─────────────── ICON MAP ─────────────── */
// const SOCIAL_ICON_MAP = {
//   Github:        { icon: Github,        label: 'GitHub' },
//   Linkedin:      { icon: Linkedin,      label: 'LinkedIn' },
//   Twitter:       { icon: Twitter,       label: 'Twitter / X' },
//   Instagram:     { icon: Instagram,     label: 'Instagram' },
//   Youtube:       { icon: Youtube,       label: 'YouTube' },
//   Code2:         { icon: Code2,         label: 'LeetCode' },
//   Trophy:        { icon: Trophy,        label: 'Codeforces' },
//   Twitch:        { icon: Twitch,        label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send:          { icon: Send,          label: 'Telegram' },
//   Rss:           { icon: Rss,           label: 'Blog' },
//   Globe:         { icon: Globe,         label: 'Website' },
//   Mail:          { icon: Mail,          label: 'Email' },
//   Phone:         { icon: Phone,         label: 'Phone' },
//   AtSign:        { icon: AtSign,        label: 'Other' },
//   ExternalLink:  { icon: ExternalLink,  label: 'Link' },
// };

// /* ─────────────── GLOBAL STYLE ─────────────── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --obsidian:    #0a0a0f;
//     --charcoal:    #111118;
//     --deep:        #16161f;
//     --panel:       #1c1c27;
//     --surface:     #22222f;
//     --surface-2:   #2a2a3a;
//     --border:      rgba(255,255,255,0.07);
//     --border-gold: rgba(196,164,102,0.25);

//     --gold:        #c4a466;
//     --gold-light:  #e2c98a;
//     --gold-dim:    rgba(196,164,102,0.15);
//     --gold-glow:   rgba(196,164,102,0.08);

//     --text-primary:   #f0ede8;
//     --text-secondary: #9b9895;
//     --text-muted:     #5a5855;

//     --accent:      #7b9cff;
//     --accent-dim:  rgba(123,156,255,0.12);

//     --r-sm:  6px;
//     --r-md:  12px;
//     --r-lg:  20px;
//     --r-xl:  32px;

//     --font-display: 'Cormorant Garamond', 'Georgia', serif;
//     --font-body:    'DM Sans', system-ui, sans-serif;

//     --transition: cubic-bezier(0.22, 1, 0.36, 1);
//   }

//   html { scroll-behavior: smooth; background: var(--obsidian); }

//   body {
//     font-family: var(--font-body);
//     background: var(--obsidian);
//     color: var(--text-primary);
//     -webkit-font-smoothing: antialiased;
//     overflow-x: hidden;
//   }

//   img { display: block; max-width: 100%; }
//   a { text-decoration: none; }

//   ::selection {
//     background: var(--gold);
//     color: var(--obsidian);
//   }
// `;

// /* ─────────────── KEYFRAMES ─────────────── */
// const fadeUp = keyframes`
//   from { opacity: 0; transform: translateY(40px); }
//   to   { opacity: 1; transform: translateY(0); }
// `;
// const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;
// const spin = keyframes`to { transform: rotate(360deg); }`;
// const shimmer = keyframes`
//   0%   { background-position: -600px 0; }
//   100% { background-position: 600px 0; }
// `;
// const slideUp = keyframes`
//   from { opacity: 0; transform: translateY(24px) scale(0.97); }
//   to   { opacity: 1; transform: translateY(0) scale(1); }
// `;
// const slideOut = keyframes`
//   from { opacity: 1; transform: translateY(0) scale(1); }
//   to   { opacity: 0; transform: translateY(24px) scale(0.97); }
// `;
// const goldPulse = keyframes`
//   0%,100% { opacity: 1; }
//   50%      { opacity: 0.4; }
// `;
// const breathe = keyframes`
//   0%,100% { transform: scale(1); }
//   50%      { transform: scale(1.015); }
// `;

// /* ─────────────── PAGE SHELL ─────────────── */
// const Page = styled.div`
//   min-height: 100vh;
//   background: var(--obsidian);
//   position: relative;
// `;

// /* Noise texture overlay */
// const NoiseLayer = styled.div`
//   position: fixed; inset: 0; z-index: 0; pointer-events: none;
//   opacity: 0.025;
//   background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
//   background-size: 256px 256px;
// `;

// /* ─────────────── OVERLAY ─────────────── */
// const OverlayBg = styled.div`
//   position: fixed; inset: 0;
//   background: rgba(0,0,0,${p => p.$show ? '0.85' : '0'});
//   backdrop-filter: ${p => p.$show ? 'blur(8px)' : 'none'};
//   display: flex; align-items: center; justify-content: center;
//   z-index: ${p => p.$show ? '9999' : '-1'};
//   padding: 1rem;
//   transition: background 0.4s ease, backdrop-filter 0.4s ease;
//   pointer-events: ${p => p.$show ? 'auto' : 'none'};
// `;
// const OverlayBox = styled.div`
//   background: var(--deep);
//   border: 1px solid var(--border-gold);
//   border-radius: var(--r-xl);
//   padding: 3.5rem 3rem;
//   max-width: 480px; width: 100%;
//   text-align: center; position: relative;
//   animation: ${p => p.$closing ? slideOut : slideUp} 0.5s var(--transition) both;
//   box-shadow: 0 40px 120px rgba(0,0,0,0.8), inset 0 1px 0 rgba(196,164,102,0.15);
//   @media(max-width: 540px) { padding: 2.5rem 1.75rem; border-radius: var(--r-lg); }
// `;
// const OverlayClose = styled.button`
//   position: absolute; top: 1.25rem; right: 1.25rem;
//   background: var(--surface); border: 1px solid var(--border);
//   width: 38px; height: 38px; border-radius: 50%;
//   cursor: pointer; display: flex; align-items: center; justify-content: center;
//   color: var(--text-secondary); transition: all 0.25s;
//   &:hover { background: var(--surface-2); color: var(--gold); border-color: var(--border-gold); transform: rotate(90deg); }
//   svg { width: 16px; height: 16px; }
// `;
// const OverlayGoldLine = styled.div`
//   width: 48px; height: 2px;
//   background: linear-gradient(90deg, transparent, var(--gold), transparent);
//   margin: 0 auto 2rem;
// `;
// const OverlayTitle = styled.h2`
//   font-family: var(--font-display);
//   font-size: 2.25rem; font-weight: 600; line-height: 1.1;
//   color: var(--text-primary); margin-bottom: 0.75rem;
//   em { font-style: italic; color: var(--gold-light); }
// `;
// const OverlayDesc = styled.p`
//   color: var(--text-secondary); font-size: 0.9rem; line-height: 1.7;
//   margin-bottom: 0.75rem;
// `;
// const OverlayTimer = styled.p`
//   font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
//   color: var(--text-muted); margin-bottom: 2rem;
//   span { color: var(--gold); font-weight: 500; }
// `;
// const OverlayActions = styled.div`
//   display: flex; gap: 0.75rem; justify-content: center;
//   @media(max-width: 480px) { flex-direction: column; }
// `;
// const OvBtn = styled.button`
//   flex: 1; padding: 0.875rem 1.5rem;
//   border-radius: var(--r-md);
//   font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
//   cursor: pointer; transition: all 0.25s;
//   ${p => p.$primary ? `
//     background: var(--gold);
//     color: var(--obsidian);
//     border: 1px solid var(--gold);
//     &:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(196,164,102,0.3); }
//   ` : `
//     background: transparent;
//     color: var(--text-secondary);
//     border: 1px solid var(--border);
//     &:hover { background: var(--surface); color: var(--text-primary); border-color: rgba(255,255,255,0.15); }
//   `}
// `;

// /* ─────────────── NAV ─────────────── */
// const NavBar = styled.nav`
//   position: fixed; top: 0; left: 0; right: 0; z-index: 100;
//   display: flex; align-items: center;
//   padding: 0 2.5rem;
//   height: 64px;
//   background: rgba(10,10,15,0.7);
//   backdrop-filter: blur(20px) saturate(150%);
//   border-bottom: 1px solid var(--border);
//   @media(max-width: 640px) { padding: 0 1.25rem; height: 56px; }
// `;
// const NavInner = styled.div`
//   max-width: 1280px; margin: 0 auto; width: 100%;
//   display: flex; align-items: center; gap: 1rem;
// `;
// const NavBackBtn = styled.button`
//   display: flex; align-items: center; gap: 0.375rem;
//   color: var(--text-secondary); background: transparent; border: none; cursor: pointer;
//   font-family: var(--font-body); font-size: 0.8rem; font-weight: 400;
//   letter-spacing: 0.05em; text-transform: uppercase;
//   transition: color 0.2s;
//   svg { width: 14px; height: 14px; }
//   &:hover { color: var(--gold); }
// `;
// const NavSep = styled.div`
//   width: 1px; height: 18px; background: var(--border);
// `;
// const NavWordmark = styled.div`
//   font-family: var(--font-display);
//   font-size: 1rem; font-weight: 600;
//   color: var(--text-muted);
//   letter-spacing: 0.02em;
// `;

// /* ─────────────── HERO ─────────────── */
// const HeroWrap = styled.section`
//   min-height: 100vh;
//   display: grid;
//   grid-template-columns: 1fr 1fr;
//   position: relative;
//   @media(max-width: 900px) { grid-template-columns: 1fr; min-height: auto; }
// `;

// /* Left – info panel */
// const HeroLeft = styled.div`
//   display: flex; flex-direction: column; justify-content: flex-end;
//   padding: 8rem 4rem 4rem 5rem;
//   position: relative; z-index: 2;
//   animation: ${fadeUp} 0.9s var(--transition) 0.1s both;
//   @media(max-width: 1200px) { padding: 8rem 3rem 4rem 3.5rem; }
//   @media(max-width: 900px)  { padding: 6rem 1.75rem 2.5rem; }
//   @media(max-width: 540px)  { padding: 5rem 1.25rem 2rem; }
// `;

// const HeroBadge = styled.div`
//   display: inline-flex; align-items: center; gap: 0.5rem;
//   margin-bottom: 1.5rem;
//   font-size: 0.68rem; letter-spacing: 0.2em; text-transform: uppercase;
//   color: var(--gold);
//   &::before, &::after {
//     content: ''; flex: 1; height: 1px; width: 24px;
//     background: var(--gold); opacity: 0.4;
//   }
// `;

// const HeroName = styled.h1`
//   font-family: var(--font-display);
//   font-size: clamp(3.5rem, 8vw, 7.5rem);
//   font-weight: 300;
//   line-height: 0.95;
//   letter-spacing: -0.02em;
//   color: var(--text-primary);
//   margin-bottom: 0.15em;
//   em {
//     display: block;
//     font-style: italic;
//     font-weight: 600;
//     color: var(--gold-light);
//   }
// `;

// const HeroDomain = styled.p`
//   font-size: clamp(0.8rem, 1.5vw, 0.95rem);
//   color: var(--text-muted);
//   letter-spacing: 0.12em; text-transform: uppercase;
//   margin-top: 1.5rem; margin-bottom: 2.5rem;
//   display: flex; align-items: center; gap: 0.75rem;
//   &::before {
//     content: ''; width: 32px; height: 1px;
//     background: var(--gold); opacity: 0.5;
//   }
// `;

// const HeroMetaRow = styled.div`
//   display: flex; flex-wrap: wrap; gap: 0.75rem;
//   margin-bottom: 2.5rem;
// `;
// const MetaChip = styled.div`
//   display: flex; align-items: center; gap: 0.5rem;
//   padding: 0.5rem 1rem;
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: 99px;
//   font-size: 0.8rem; color: var(--text-secondary);
//   svg { width: 13px; height: 13px; color: var(--gold); flex-shrink: 0; }
// `;

// const SocialRow = styled.div`
//   display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;
// `;
// const SocialBtn = styled.a`
//   display: inline-flex; align-items: center; justify-content: center;
//   width: 42px; height: 42px;
//   background: var(--surface);
//   border: 1px solid var(--border);
//   border-radius: 50%;
//   color: var(--text-secondary);
//   transition: all 0.3s var(--transition);
//   &:hover {
//     background: var(--gold);
//     color: var(--obsidian);
//     border-color: var(--gold);
//     transform: translateY(-3px);
//     box-shadow: 0 8px 20px rgba(196,164,102,0.25);
//   }
//   svg { width: 15px; height: 15px; }
// `;
// const ResumeBtn = styled.a`
//   display: inline-flex; align-items: center; gap: 0.5rem;
//   padding: 0 1.25rem; height: 42px;
//   background: transparent;
//   border: 1px solid var(--border-gold);
//   border-radius: 99px;
//   color: var(--gold-light);
//   font-size: 0.78rem; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase;
//   transition: all 0.3s var(--transition);
//   &:hover {
//     background: var(--gold);
//     color: var(--obsidian);
//     border-color: var(--gold);
//     transform: translateY(-3px);
//     box-shadow: 0 8px 20px rgba(196,164,102,0.25);
//   }
//   svg { width: 13px; height: 13px; }
// `;

// /* Right – photo panel */
// const HeroRight = styled.div`
//   position: relative;
//   overflow: hidden;
//   animation: ${fadeIn} 1.2s ease both;
//   @media(max-width: 900px) {
//     height: 55vw;
//     min-height: 300px; max-height: 520px;
//     order: -1;
//   }
// `;
// const HeroPhoto = styled.img`
//   width: 100%; height: 100%;
//   object-fit: cover; object-position: top center;
//   display: block;
// `;
// const HeroPhotoPlaceholder = styled.div`
//   width: 100%; height: 100%;
//   min-height: 100vh;
//   background: linear-gradient(160deg, var(--surface) 0%, var(--deep) 100%);
//   display: flex; align-items: center; justify-content: center;
//   color: var(--text-muted);
//   @media(max-width: 900px) { min-height: 300px; }
//   svg { width: 80px; height: 80px; opacity: 0.2; }
// `;
// const PhotoOverlay = styled.div`
//   position: absolute; inset: 0;
//   background: linear-gradient(
//     to right,
//     var(--obsidian) 0%,
//     rgba(10,10,15,0.3) 40%,
//     transparent 100%
//   );
//   @media(max-width: 900px) {
//     background: linear-gradient(
//       to bottom,
//       transparent 30%,
//       var(--obsidian) 100%
//     );
//   }
// `;

// /* Stats strip */
// const StatsStrip = styled.div`
//   background: var(--panel);
//   border-top: 1px solid var(--border);
//   border-bottom: 1px solid var(--border);
//   display: grid;
//   grid-template-columns: repeat(4, 1fr);
//   position: relative; z-index: 2;
//   @media(max-width: 600px) { grid-template-columns: repeat(2, 1fr); }
// `;
// const StatCell = styled.div`
//   padding: 2rem 1.5rem;
//   text-align: center;
//   border-right: 1px solid var(--border);
//   &:last-child { border-right: none; }
//   @media(max-width: 600px) {
//     &:nth-child(2) { border-right: none; }
//     &:nth-child(3) { border-right: 1px solid var(--border); }
//     border-bottom: 1px solid var(--border);
//     &:nth-child(3), &:nth-child(4) { border-bottom: none; }
//   }
// `;
// const StatNum = styled.div`
//   font-family: var(--font-display);
//   font-size: 3rem; font-weight: 600;
//   line-height: 1;
//   color: var(--gold-light);
//   margin-bottom: 0.35rem;
// `;
// const StatLabel = styled.div`
//   font-size: 0.68rem; letter-spacing: 0.15em; text-transform: uppercase;
//   color: var(--text-muted);
// `;

// /* ─────────────── MAIN CONTENT ─────────────── */
// const Main = styled.main`
//   max-width: 1280px; margin: 0 auto;
//   padding: 0 3rem 8rem;
//   @media(max-width: 900px)  { padding: 0 1.75rem 6rem; }
//   @media(max-width: 540px)  { padding: 0 1.25rem 4rem; }
// `;

// /* ─────────────── SUMMARY SECTION ─────────────── */
// const SummarySection = styled.section`
//   padding: 6rem 0;
//   display: grid;
//   grid-template-columns: 200px 1fr;
//   gap: 4rem; align-items: start;
//   border-bottom: 1px solid var(--border);
//   animation: ${fadeUp} 0.7s var(--transition) 0.2s both; opacity: 0; animation-fill-mode: forwards;
//   @media(max-width: 800px) { grid-template-columns: 1fr; gap: 1.5rem; padding: 4rem 0; }
// `;
// const SummaryMeta = styled.div``;
// const SummaryEyebrow = styled.p`
//   font-size: 0.68rem; letter-spacing: 0.18em; text-transform: uppercase;
//   color: var(--gold); margin-bottom: 0.75rem;
// `;
// const SummaryNum = styled.div`
//   font-family: var(--font-display);
//   font-size: 5rem; font-weight: 300; line-height: 1;
//   color: var(--text-muted); opacity: 0.3;
// `;
// const SummaryText = styled.blockquote`
//   font-family: var(--font-display);
//   font-size: clamp(1.5rem, 3vw, 2.25rem);
//   font-weight: 300; font-style: italic;
//   line-height: 1.5; color: var(--text-primary);
//   letter-spacing: -0.01em;
//   position: relative;
//   &::before {
//     content: '';
//     display: block; width: 40px; height: 2px;
//     background: var(--gold); margin-bottom: 1.5rem;
//   }
// `;

// /* ─────────────── SECTION HEADER ─────────────── */
// const SectionHead = styled.div`
//   display: flex; align-items: baseline;
//   gap: 1.5rem; margin-bottom: 3rem;
// `;
// const SectionIndex = styled.span`
//   font-family: var(--font-display);
//   font-size: 0.9rem; color: var(--text-muted);
//   font-style: italic;
// `;
// const SectionTitle = styled.h2`
//   font-family: var(--font-display);
//   font-size: clamp(2rem, 4vw, 3rem);
//   font-weight: 300; letter-spacing: -0.02em;
//   color: var(--text-primary);
// `;
// const SectionLine = styled.div`
//   flex: 1; height: 1px;
//   background: linear-gradient(90deg, var(--border), transparent);
//   align-self: center; min-width: 40px;
// `;

// /* ─────────────── CONTENT SECTION ─────────────── */
// const ContentSection = styled.section`
//   padding: 5rem 0;
//   border-bottom: 1px solid var(--border);
//   animation: ${fadeUp} 0.7s var(--transition) ${p => p.delay || '0.3s'} both;
//   opacity: 0; animation-fill-mode: forwards;
//   &:last-child { border-bottom: none; }
// `;

// /* ─────────────── EDUCATION / EXPERIENCE TIMELINE ─────────────── */
// const TimelineGrid = styled.div`
//   display: flex; flex-direction: column; gap: 2px;
// `;
// const TLItem = styled.div`
//   display: grid;
//   grid-template-columns: 180px 1px 1fr;
//   gap: 0 2.5rem;
//   @media(max-width: 720px) { grid-template-columns: 1px 1fr; gap: 0 1.5rem; }
// `;
// const TLDateCol = styled.div`
//   padding: 2rem 0; text-align: right;
//   @media(max-width: 720px) { display: none; }
// `;
// const TLDateText = styled.span`
//   font-size: 0.75rem; letter-spacing: 0.1em; text-transform: uppercase;
//   color: var(--gold); font-weight: 500;
// `;
// const TLSpine = styled.div`
//   position: relative; display: flex; flex-direction: column; align-items: center;
// `;
// const TLDot = styled.div`
//   width: 11px; height: 11px; border-radius: 50%;
//   background: var(--gold);
//   border: 2px solid var(--obsidian);
//   box-shadow: 0 0 0 1px var(--gold);
//   flex-shrink: 0; margin-top: 2.35rem; z-index: 1;
//   transition: box-shadow 0.3s;
// `;
// const TLLine = styled.div`
//   flex: 1; width: 1px;
//   background: linear-gradient(to bottom, rgba(196,164,102,0.3), rgba(196,164,102,0.05));
//   margin-top: 4px;
// `;
// const TLBody = styled.div`
//   padding: 1.75rem 0 2.5rem;
// `;
// const TLCard = styled.div`
//   background: var(--panel);
//   border: 1px solid var(--border);
//   border-radius: var(--r-lg);
//   padding: 2rem 2.25rem;
//   transition: all 0.35s var(--transition);
//   cursor: default;
//   position: relative; overflow: hidden;
//   &::after {
//     content: '';
//     position: absolute; top: 0; left: 0; bottom: 0; width: 2px;
//     background: linear-gradient(to bottom, var(--gold), transparent);
//     opacity: 0; transition: opacity 0.3s;
//   }
//   &:hover {
//     background: var(--surface);
//     border-color: var(--border-gold);
//     transform: translateX(4px);
//     &::after { opacity: 1; }
//   }
//   @media(max-width: 540px) { padding: 1.5rem 1.25rem; }
// `;
// const TLMobileDate = styled.div`
//   font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase;
//   color: var(--gold); margin-bottom: 0.75rem;
//   display: none;
//   @media(max-width: 720px) { display: block; }
// `;
// const TLTitle = styled.h3`
//   font-size: 1.1rem; font-weight: 500; color: var(--text-primary);
//   margin-bottom: 0.3rem; line-height: 1.3;
// `;
// const TLSub = styled.p`
//   font-size: 0.875rem; color: var(--gold);
//   font-weight: 400; margin-bottom: 0.75rem;
// `;
// const TLDesc = styled.p`
//   font-size: 0.875rem; color: var(--text-secondary); line-height: 1.75;
// `;

// /* ─────────────── PROJECT CARDS ─────────────── */
// const ProjectGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
//   gap: 1.5px;
//   border: 1px solid var(--border);
//   border-radius: var(--r-lg);
//   overflow: hidden;
//   @media(max-width: 720px) { grid-template-columns: 1fr; }
// `;
// const ProjCard = styled.div`
//   background: var(--panel);
//   padding: 2.5rem;
//   position: relative; overflow: hidden;
//   transition: background 0.3s;
//   display: flex; flex-direction: column; gap: 1rem;
//   &:hover { background: var(--surface); }
//   @media(max-width: 540px) { padding: 1.75rem 1.5rem; }
// `;
// const ProjNumberBg = styled.div`
//   position: absolute; top: -0.5rem; right: 1.5rem;
//   font-family: var(--font-display);
//   font-size: 7rem; font-weight: 700; line-height: 1;
//   color: rgba(255,255,255,0.025);
//   user-select: none; pointer-events: none;
// `;
// const ProjTitle = styled.h3`
//   font-size: 1.2rem; font-weight: 500; color: var(--text-primary);
//   line-height: 1.3; padding-right: 2rem;
// `;
// const ProjDesc = styled.p`
//   font-size: 0.875rem; color: var(--text-secondary); line-height: 1.75; flex: 1;
// `;
// const TechRow = styled.div`display: flex; flex-wrap: wrap; gap: 0.4rem;`;
// const TechTag = styled.span`
//   font-size: 0.65rem; letter-spacing: 0.08em; text-transform: uppercase;
//   font-weight: 500; color: var(--gold);
//   background: var(--gold-dim);
//   border: 1px solid var(--border-gold);
//   padding: 0.25rem 0.7rem; border-radius: var(--r-sm);
// `;
// const ProjLinks = styled.div`display: flex; gap: 0.6rem;`;
// const ProjLink = styled.a`
//   display: inline-flex; align-items: center; gap: 0.4rem;
//   font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase;
//   font-weight: 500; color: var(--text-secondary);
//   background: var(--surface-2);
//   border: 1px solid var(--border);
//   padding: 0.5rem 1rem; border-radius: var(--r-sm);
//   transition: all 0.25s;
//   svg { width: 12px; height: 12px; }
//   &:hover { color: var(--gold); border-color: var(--border-gold); background: var(--gold-dim); }
// `;

// /* ─────────────── SKILLS ─────────────── */
// const SkillsGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
//   gap: 1px;
//   border: 1px solid var(--border);
//   border-radius: var(--r-lg);
//   overflow: hidden;
// `;
// const SkillPanel = styled.div`
//   background: var(--panel);
//   padding: 2rem 2.25rem;
//   transition: background 0.3s;
//   &:hover { background: var(--surface); }
//   @media(max-width: 540px) { padding: 1.5rem 1.25rem; }
// `;
// const SkillCat = styled.h4`
//   font-size: 0.65rem; letter-spacing: 0.18em; text-transform: uppercase;
//   color: var(--gold); margin-bottom: 1.5rem;
//   padding-bottom: 0.875rem;
//   border-bottom: 1px solid var(--border-gold);
// `;
// const SkillList = styled.div`display: flex; flex-direction: column; gap: 0.35rem;`;
// const SkillRow = styled.div`
//   display: flex; align-items: center; justify-content: space-between;
//   padding: 0.6rem 0.75rem;
//   background: var(--deep);
//   border-radius: var(--r-sm);
//   transition: background 0.2s;
//   &:hover { background: var(--surface-2); }
// `;
// const SkillName = styled.span`
//   font-size: 0.875rem; color: var(--text-secondary);
// `;
// const SkillDot = styled.div`
//   width: 5px; height: 5px; border-radius: 50%;
//   background: var(--gold); opacity: 0.6;
// `;

// /* ─────────────── CERT CARDS ─────────────── */
// const CertGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 1.25rem;
//   @media(max-width: 640px) { grid-template-columns: 1fr; }
// `;
// const CertCard = styled.div`
//   background: var(--panel);
//   border: 1px solid var(--border);
//   border-radius: var(--r-lg);
//   padding: 2rem 2.25rem;
//   position: relative; overflow: hidden;
//   transition: all 0.35s var(--transition);
//   &::before {
//     content: '✦';
//     position: absolute; bottom: 1.5rem; right: 1.75rem;
//     font-size: 0.875rem; color: var(--gold); opacity: 0.4;
//   }
//   &:hover {
//     border-color: var(--border-gold);
//     background: var(--surface);
//     transform: translateY(-4px);
//     box-shadow: 0 16px 48px rgba(0,0,0,0.4);
//   }
//   @media(max-width: 540px) { padding: 1.5rem; }
// `;
// const CertGoldLine = styled.div`
//   width: 24px; height: 2px;
//   background: var(--gold);
//   margin-bottom: 1.25rem;
// `;
// const CertName = styled.h3`
//   font-size: 1.05rem; font-weight: 500; color: var(--text-primary);
//   line-height: 1.4; margin-bottom: 0.4rem; padding-right: 2rem;
// `;
// const CertIssuer = styled.p`
//   font-size: 0.825rem; color: var(--gold);
//   margin-bottom: 1rem;
// `;
// const CertLink = styled.a`
//   display: inline-flex; align-items: center; gap: 0.4rem;
//   font-size: 0.75rem; letter-spacing: 0.06em; text-transform: uppercase;
//   color: var(--text-muted); transition: color 0.2s, gap 0.2s;
//   svg { width: 11px; height: 11px; }
//   &:hover { color: var(--gold); gap: 0.65rem; }
// `;

// /* ─────────────── INTERESTS ─────────────── */
// const InterestWrap = styled.div`display: flex; flex-wrap: wrap; gap: 0.75rem;`;
// const InterestTag = styled.span`
//   padding: 0.7rem 1.5rem;
//   background: var(--panel);
//   border: 1px solid var(--border);
//   border-radius: 99px;
//   font-size: 0.875rem; color: var(--text-secondary);
//   cursor: default; transition: all 0.3s var(--transition);
//   &:hover {
//     background: var(--gold-dim);
//     border-color: var(--border-gold);
//     color: var(--gold-light);
//     transform: translateY(-2px);
//   }
// `;

// /* ─────────────── EMPTY STATE ─────────────── */
// const EmptyState = styled.div`
//   padding: 4rem 2rem;
//   background: var(--panel);
//   border: 1px solid var(--border);
//   border-radius: var(--r-lg);
//   display: flex; flex-direction: column; align-items: center; gap: 0.75rem;
//   color: var(--text-muted);
//   font-size: 0.875rem; text-align: center;
//   svg { width: 2.5rem; height: 2.5rem; opacity: 0.2; }
// `;

// /* ─────────────── LOADING ─────────────── */
// const LoadWrap = styled.div`
//   min-height: 100vh; display: flex; flex-direction: column;
//   align-items: center; justify-content: center; gap: 1.5rem;
//   background: var(--obsidian);
// `;
// const Spinner = styled.div`
//   width: 36px; height: 36px;
//   border: 1.5px solid var(--border);
//   border-top-color: var(--gold);
//   border-radius: 50%;
//   animation: ${spin} 0.8s linear infinite;
// `;
// const LoadLabel = styled.p`
//   font-size: 0.7rem; letter-spacing: 0.2em; text-transform: uppercase;
//   color: var(--text-muted);
// `;
// const LoadShimmer = styled.div`
//   width: 120px; height: 1px;
//   background: linear-gradient(90deg, transparent 0%, var(--gold) 50%, transparent 100%);
//   background-size: 600px;
//   animation: ${shimmer} 1.5s linear infinite;
// `;

// /* ─────────────── ERROR ─────────────── */
// const ErrorWrap = styled.div`
//   min-height: 100vh; display: flex; align-items: center; justify-content: center;
//   padding: 2rem; background: var(--obsidian);
// `;
// const ErrorBox = styled.div`
//   background: var(--panel); border: 1px solid var(--border);
//   border-radius: var(--r-xl);
//   padding: 4rem 3rem; max-width: 440px; width: 100%;
//   text-align: center;
//   animation: ${fadeUp} 0.5s ease both;
//   @media(max-width: 480px) { padding: 3rem 2rem; }
// `;
// const ErrorGold = styled.div`
//   width: 48px; height: 48px; border-radius: 50%;
//   background: var(--gold-dim); border: 1px solid var(--border-gold);
//   display: flex; align-items: center; justify-content: center;
//   margin: 0 auto 2rem;
//   svg { width: 20px; height: 20px; color: var(--gold); }
// `;
// const ErrorTitle = styled.h2`
//   font-family: var(--font-display);
//   font-size: 2rem; font-weight: 600; color: var(--text-primary);
//   margin-bottom: 0.75rem;
// `;
// const ErrorMsg = styled.p`
//   color: var(--text-muted); line-height: 1.7; margin-bottom: 2.5rem;
//   font-size: 0.9rem;
// `;
// const GoHomeBtn = styled.button`
//   display: inline-flex; align-items: center; gap: 0.5rem;
//   padding: 0.875rem 2rem;
//   background: var(--gold); color: var(--obsidian);
//   border: none; border-radius: var(--r-md);
//   font-family: var(--font-body); font-size: 0.875rem; font-weight: 500;
//   cursor: pointer; transition: all 0.25s;
//   &:hover { background: var(--gold-light); transform: translateY(-2px); }
//   svg { width: 15px; height: 15px; }
// `;

// /* ─────────────── HELPERS ─────────────── */
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };

// /* ═════════════════════════════════════════════════════════════ */

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});

//   const [showOverlay, setShowOverlay] = useState(() => {
//     const dismissed = sessionStorage.getItem('overlayDismissed');
//     if (dismissed === 'true') return false;
//     return !user;
//   });
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev <= 1) { handleCloseOverlay(); return 0; }
//         return prev - 1;
//       });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleCloseOverlay = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   const fetchImageUrl = async (path) => {
//     if (!path) return null;
//     try { return await publicService.getSignedUrl(path); }
//     catch { return null; }
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);

//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         data.projects?.forEach((p, i) => { if (p.image) paths.push({ key: `project_${i}`, path: p.image }); });
//         data.certifications?.forEach((c, i) => { if (c.image) paths.push({ key: `cert_${i}`, path: c.image }); });

//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           const url = await fetchImageUrl(path);
//           if (url) urlMap[key] = url;
//         }));
//         setImageUrls(urlMap);
//       } catch (err) {
//         setError(err.message || 'Profile not found');
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (username) load();
//   }, [username]);

//   /* ── Loading ── */
//   if (loading) {
//     return (
//       <>
//         <GlobalStyle />
//         <LoadWrap>
//           <Spinner />
//           <LoadShimmer />
//           <LoadLabel>Loading portfolio</LoadLabel>
//         </LoadWrap>
//       </>
//     );
//   }

//   /* ── Error ── */
//   if (error || !portfolio) {
//     return (
//       <>
//         <GlobalStyle />
//         <ErrorWrap>
//           <ErrorBox>
//             <ErrorGold><AlertCircle /></ErrorGold>
//             <ErrorTitle>{error ? 'Not Found' : 'No Portfolio Yet'}</ErrorTitle>
//             <ErrorMsg>{error || "This user hasn't set up their portfolio yet."}</ErrorMsg>
//             <GoHomeBtn onClick={() => navigate('/')}><Home size={15} /> Return Home</GoHomeBtn>
//           </ErrorBox>
//         </ErrorWrap>
//       </>
//     );
//   }

//   const {
//     profile = {}, education = [], experience = [],
//     projects = [], skills = {}, certifications = [], interests = {}
//   } = portfolio;

//   const fullName  = profile.name || 'Anonymous User';
//   const [firstName, ...rest] = fullName.split(' ');
//   const lastName  = rest.join(' ') || '';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink    = profile.cvLink?.trim() || null;

//   const sectionCount = [
//     education.length, experience.length, projects.length,
//     skillCats.length, certifications.length, (interests?.interests?.length || 0)
//   ].filter(Boolean).length;

//   let sectionIdx = 0;
//   const nextIdx = () => {
//     sectionIdx++;
//     return String(sectionIdx).padStart(2, '0');
//   };

//   return (
//     <>
//       <GlobalStyle />
//       <NoiseLayer />

//       {/* ── Auth Overlay ── */}
//       <OverlayBg $show={showOverlay}>
//         <OverlayBox $closing={isClosing}>
//           <OverlayClose onClick={handleCloseOverlay}><X /></OverlayClose>
//           <OverlayGoldLine />
//           <OverlayTitle>Build Your <em>Portfolio</em></OverlayTitle>
//           <OverlayDesc>
//             Create a stunning professional presence. Sign in or register to build your own public profile.
//           </OverlayDesc>
//           <OverlayTimer>Closes in <span>{timeLeft}s</span></OverlayTimer>
//           <OverlayActions>
//             <OvBtn $primary onClick={() => navigate('/login')}>Sign In</OvBtn>
//             <OvBtn onClick={() => navigate('/register')}>Create Account</OvBtn>
//           </OverlayActions>
//         </OverlayBox>
//       </OverlayBg>

//       {/* ── Nav ── */}
//       <NavBar>
//         <NavInner>
//           <NavBackBtn onClick={() => navigate(-1)}><ChevronLeft /> Back</NavBackBtn>
//           <NavSep />
//           <NavBackBtn onClick={() => navigate('/')}><Home size={13} /> Home</NavBackBtn>
//           <div style={{ flex: 1 }} />
//           <NavWordmark>{fullName}</NavWordmark>
//         </NavInner>
//       </NavBar>

//       <Page>

//         {/* ══════════════ HERO ══════════════ */}
//         <HeroWrap>
//           <HeroLeft>
//             <HeroBadge>{profile.domain || 'Professional Portfolio'}</HeroBadge>
//             <HeroName>
//               {firstName}
//               {lastName && <em>{lastName}</em>}
//             </HeroName>
//             <HeroDomain>
//               {profile.domain || 'Professional'}&nbsp;&nbsp;·&nbsp;&nbsp;{profile.location || 'Location not set'}
//             </HeroDomain>

//             {(profile.email || profile.phone || profile.location) && (
//               <HeroMetaRow>
//                 {profile.email    && <MetaChip><Mail />   {profile.email}</MetaChip>}
//                 {profile.phone    && <MetaChip><Phone />  {profile.phone}</MetaChip>}
//                 {profile.location && <MetaChip><MapPin /> {profile.location}</MetaChip>}
//               </HeroMetaRow>
//             )}

//             {(socialLinks.length > 0 || cvLink) && (
//               <SocialRow>
//                 {socialLinks.map((item) => {
//                   const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                   const Icon = meta.icon;
//                   const href = buildSocialHref(item);
//                   return (
//                     <SocialBtn
//                       key={item._id || item.id}
//                       href={href}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       title={item.name || meta.label}
//                     >
//                       <Icon />
//                     </SocialBtn>
//                   );
//                 })}
//                 {cvLink && (
//                   <ResumeBtn href={cvLink} target="_blank" rel="noopener noreferrer">
//                     <FileText /> Resume
//                   </ResumeBtn>
//                 )}
//               </SocialRow>
//             )}
//           </HeroLeft>

//           <HeroRight>
//             {imageUrls.profilePhoto
//               ? <HeroPhoto src={imageUrls.profilePhoto} alt={fullName} />
//               : <HeroPhotoPlaceholder><User /></HeroPhotoPlaceholder>
//             }
//             <PhotoOverlay />
//           </HeroRight>
//         </HeroWrap>

//         {/* Stats strip */}
//         <StatsStrip>
//           <StatCell>
//             <StatNum>{education.length || '—'}</StatNum>
//             <StatLabel>Education</StatLabel>
//           </StatCell>
//           <StatCell>
//             <StatNum>{experience.length || '—'}</StatNum>
//             <StatLabel>Roles</StatLabel>
//           </StatCell>
//           <StatCell>
//             <StatNum>{projects.length || '—'}</StatNum>
//             <StatLabel>Projects</StatLabel>
//           </StatCell>
//           <StatCell>
//             <StatNum>{certifications.length || '—'}</StatNum>
//             <StatLabel>Certificates</StatLabel>
//           </StatCell>
//         </StatsStrip>

//         {/* ══════════════ MAIN CONTENT ══════════════ */}
//         <Main>

//           {/* Summary */}
//           {profile.summary && (
//             <SummarySection>
//               <SummaryMeta>
//                 <SummaryEyebrow>About</SummaryEyebrow>
//                 <SummaryNum>—</SummaryNum>
//               </SummaryMeta>
//               <SummaryText>{profile.summary}</SummaryText>
//             </SummarySection>
//           )}

//           {/* Education */}
//           {(
//             <ContentSection delay="0.25s">
//               <SectionHead>
//                 <SectionIndex>{nextIdx()}</SectionIndex>
//                 <SectionTitle>Education</SectionTitle>
//                 <SectionLine />
//               </SectionHead>
//               {education.length > 0 ? (
//                 <TimelineGrid>
//                   {education.map((edu, i) => {
//                     const dur = edu.duration
//                       ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`)
//                       : 'N/A';
//                     const score = edu.cgpa
//                       ? `CGPA ${edu.cgpa}`
//                       : edu.percentage
//                         ? `${edu.percentage}%`
//                         : null;
//                     return (
//                       <TLItem key={edu._id || i}>
//                         <TLDateCol><TLDateText>{dur}</TLDateText></TLDateCol>
//                         <TLSpine>
//                           <TLDot />
//                           {i < education.length - 1 && <TLLine />}
//                         </TLSpine>
//                         <TLBody>
//                           <TLCard>
//                             <TLMobileDate>{dur}</TLMobileDate>
//                             <TLTitle>{na(edu.institution)}</TLTitle>
//                             <TLSub>{na(edu.course)}</TLSub>
//                             {score && <TLDesc>{score}</TLDesc>}
//                           </TLCard>
//                         </TLBody>
//                       </TLItem>
//                     );
//                   })}
//                 </TimelineGrid>
//               ) : (
//                 <EmptyState><BookOpen /><span>No education details added</span></EmptyState>
//               )}
//             </ContentSection>
//           )}

//           {/* Experience */}
//           <ContentSection delay="0.3s">
//             <SectionHead>
//               <SectionIndex>{nextIdx()}</SectionIndex>
//               <SectionTitle>Experience</SectionTitle>
//               <SectionLine />
//             </SectionHead>
//             {experience.length > 0 ? (
//               <TimelineGrid>
//                 {experience.map((exp, i) => (
//                   <TLItem key={exp._id || i}>
//                     <TLDateCol><TLDateText>{exp.duration || 'N/A'}</TLDateText></TLDateCol>
//                     <TLSpine>
//                       <TLDot />
//                       {i < experience.length - 1 && <TLLine />}
//                     </TLSpine>
//                     <TLBody>
//                       <TLCard>
//                         <TLMobileDate>{exp.duration || 'N/A'}</TLMobileDate>
//                         <TLTitle>{na(exp.role)}</TLTitle>
//                         <TLSub>{na(exp.company)}{exp.type ? ` · ${exp.type}` : ''}</TLSub>
//                         {exp.description && <TLDesc>{exp.description}</TLDesc>}
//                       </TLCard>
//                     </TLBody>
//                   </TLItem>
//                 ))}
//               </TimelineGrid>
//             ) : (
//               <EmptyState><Briefcase /><span>No experience details added</span></EmptyState>
//             )}
//           </ContentSection>

//           {/* Projects */}
//           <ContentSection delay="0.35s">
//             <SectionHead>
//               <SectionIndex>{nextIdx()}</SectionIndex>
//               <SectionTitle>Projects</SectionTitle>
//               <SectionLine />
//             </SectionHead>
//             {projects.length > 0 ? (
//               <ProjectGrid>
//                 {projects.map((proj, i) => (
//                   <ProjCard key={proj._id || i}>
//                     <ProjNumberBg>0{i + 1}</ProjNumberBg>
//                     <ProjTitle>{na(proj.title)}</ProjTitle>
//                     {proj.description && <ProjDesc>{proj.description}</ProjDesc>}
//                     {proj.tech?.length > 0 && (
//                       <TechRow>{proj.tech.map((t, j) => <TechTag key={j}>{t}</TechTag>)}</TechRow>
//                     )}
//                     {(proj.demo || proj.repo) && (
//                       <ProjLinks>
//                         {proj.demo && (
//                           <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">
//                             Live <ArrowUpRight />
//                           </ProjLink>
//                         )}
//                         {proj.repo && (
//                           <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">
//                             Repo <Github />
//                           </ProjLink>
//                         )}
//                       </ProjLinks>
//                     )}
//                   </ProjCard>
//                 ))}
//               </ProjectGrid>
//             ) : (
//               <EmptyState><Code2 /><span>No projects added</span></EmptyState>
//             )}
//           </ContentSection>

//           {/* Skills */}
//           <ContentSection delay="0.4s">
//             <SectionHead>
//               <SectionIndex>{nextIdx()}</SectionIndex>
//               <SectionTitle>Skills</SectionTitle>
//               <SectionLine />
//             </SectionHead>
//             {skillCats.length > 0 ? (
//               <SkillsGrid>
//                 {skillCats.map((cat, idx) => (
//                   <SkillPanel key={cat._id || idx}>
//                     <SkillCat>{cat.category}</SkillCat>
//                     <SkillList>
//                       {cat.items.map((item, i) => (
//                         <SkillRow key={i}>
//                           <SkillName>{item}</SkillName>
//                           <SkillDot />
//                         </SkillRow>
//                       ))}
//                     </SkillList>
//                   </SkillPanel>
//                 ))}
//               </SkillsGrid>
//             ) : (
//               <EmptyState><Layers /><span>No skills added</span></EmptyState>
//             )}
//           </ContentSection>

//           {/* Certifications */}
//           <ContentSection delay="0.45s">
//             <SectionHead>
//               <SectionIndex>{nextIdx()}</SectionIndex>
//               <SectionTitle>Certifications</SectionTitle>
//               <SectionLine />
//             </SectionHead>
//             {certifications.length > 0 ? (
//               <CertGrid>
//                 {certifications.map((cert, i) => (
//                   <CertCard key={cert._id || i}>
//                     <CertGoldLine />
//                     <CertName>{na(cert.name)}</CertName>
//                     <CertIssuer>{na(cert.issuer)}</CertIssuer>
//                     {cert.link && (
//                       <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">
//                         View Credential <ArrowUpRight />
//                       </CertLink>
//                     )}
//                   </CertCard>
//                 ))}
//               </CertGrid>
//             ) : (
//               <EmptyState><Award /><span>No certifications added</span></EmptyState>
//             )}
//           </ContentSection>

//           {/* Interests */}
//           {interests?.interests?.length > 0 && (
//             <ContentSection delay="0.5s">
//               <SectionHead>
//                 <SectionIndex>{nextIdx()}</SectionIndex>
//                 <SectionTitle>Interests</SectionTitle>
//                 <SectionLine />
//               </SectionHead>
//               <InterestWrap>
//                 {interests.interests.map((item, i) => (
//                   <InterestTag key={i}>{item}</InterestTag>
//                 ))}
//               </InterestWrap>
//             </ContentSection>
//           )}

//         </Main>
//       </Page>
//     </>
//   );
// };

// export default PublicProfilePage;














// ======================== Template 4 ======================== //

// ===================== Template 4: Bento Grid / Magazine Mosaic ===================== //
// Unique concept: The hero is a bento-style mosaic grid — avatar, name, stats, and
// social links are all separate grid cells that snap together like a magazine spread.
// Sections below use asymmetric two-column layouts that alternate direction.
// No left-photo / right-info split. Everything feels like editorial layout.

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Globe,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// /* ─── ICON MAP ─── */
// const SOCIAL_ICON_MAP = {
//   Github: { icon: Github, label: 'GitHub' },
//   Linkedin: { icon: Linkedin, label: 'LinkedIn' },
//   Twitter: { icon: Twitter, label: 'Twitter / X' },
//   Instagram: { icon: Instagram, label: 'Instagram' },
//   Youtube: { icon: Youtube, label: 'YouTube' },
//   Code2: { icon: Code2, label: 'LeetCode' },
//   Trophy: { icon: Trophy, label: 'Codeforces' },
//   Twitch: { icon: Twitch, label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send: { icon: Send, label: 'Telegram' },
//   Rss: { icon: Rss, label: 'Blog' },
//   Globe: { icon: Globe, label: 'Website' },
//   Mail: { icon: Mail, label: 'Email' },
//   Phone: { icon: Phone, label: 'Phone' },
//   AtSign: { icon: AtSign, label: 'Other' },
//   ExternalLink: { icon: ExternalLink, label: 'Link' },
// };

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };

// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// /* ─── GLOBAL ─── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   :root {
//     --bg:       #f7f5f0;
//     --surface:  #ffffff;
//     --ink:      #111111;
//     --ink-2:    #333333;
//     --ink-3:    #777777;
//     --ink-4:    #aaaaaa;
//     --border:   #e0ddd8;
//     --accent:   #1a1aff;
//     --accent-2: #ff3c00;
//     --accent-3: #00b37d;
//     --r-sm:     8px;
//     --r-md:     16px;
//     --r-lg:     24px;
//     --r-xl:     32px;
//     --font-display: 'Syne', system-ui, sans-serif;
//     --font-body:    'Inter', system-ui, sans-serif;
//   }
//   html { scroll-behavior: smooth; }
//   body {
//     background: var(--bg);
//     font-family: var(--font-body);
//     color: var(--ink);
//     -webkit-font-smoothing: antialiased;
//   }
//   img { display: block; max-width: 100%; }
//   ::selection { background: var(--accent); color: white; }
// `;

// /* ─── KEYFRAMES ─── */
// const fadeUp = keyframes`from{opacity:0;transform:translateY(32px)}to{opacity:1;transform:translateY(0)}`;
// const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
// const slideUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
// const spin = keyframes`to{transform:rotate(360deg)}`;
// const shimmer = keyframes`0%{background-position:-800px 0}100%{background-position:800px 0}`;
// const marquee = keyframes`from{transform:translateX(0)}to{transform:translateX(-50%)}`;

// /* ─── OVERLAY ─── */
// const OvBg = styled.div`
//   position:fixed;inset:0;
//   background:rgba(0,0,0,${p => p.$show ? '0.6' : '0'});
//   backdrop-filter:${p => p.$show ? 'blur(6px)' : 'none'};
//   display:flex;align-items:center;justify-content:center;
//   z-index:${p => p.$show ? '9999' : '-1'};
//   padding:1rem;
//   pointer-events:${p => p.$show ? 'auto' : 'none'};
//   transition:all 0.3s;
// `;
// const OvBox = styled.div`
//   background:var(--surface);
//   border:2px solid var(--ink);
//   border-radius:var(--r-xl);
//   padding:3rem 2.5rem;
//   max-width:440px;width:100%;
//   text-align:center;position:relative;
//   animation:${p => p.$closing ? 'none' : slideUp} 0.45s cubic-bezier(0.22,1,0.36,1) both;
//   box-shadow: 8px 8px 0 var(--ink);
//   @media(max-width:480px){padding:2.5rem 1.5rem;}
// `;
// const OvClose = styled.button`
//   position:absolute;top:1rem;right:1rem;
//   background:var(--ink);border:none;color:white;
//   width:36px;height:36px;border-radius:50%;
//   cursor:pointer;display:flex;align-items:center;justify-content:center;
//   transition:transform 0.2s;
//   &:hover{transform:rotate(90deg);}
//   svg{width:16px;height:16px;}
// `;
// const OvTag = styled.div`
//   display:inline-block;
//   background:var(--accent);color:white;
//   font-family:var(--font-display);
//   font-size:0.7rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
//   padding:0.35rem 0.9rem;border-radius:99px;
//   margin-bottom:1.25rem;
// `;
// const OvTitle = styled.h2`
//   font-family:var(--font-display);
//   font-size:2rem;font-weight:800;
//   color:var(--ink);margin-bottom:0.75rem;line-height:1.1;
// `;
// const OvDesc = styled.p`color:var(--ink-3);font-size:0.9rem;line-height:1.7;margin-bottom:0.75rem;`;
// const OvTimer = styled.p`
//   font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;
//   color:var(--ink-4);margin-bottom:2rem;
// `;
// const OvBtns = styled.div`display:flex;gap:0.75rem;@media(max-width:400px){flex-direction:column;}`;
// const OvBtn = styled.button`
//   flex:1;padding:0.875rem;border-radius:var(--r-md);
//   font-family:var(--font-display);font-size:0.875rem;font-weight:700;
//   cursor:pointer;transition:all 0.2s;
//   ${p => p.$primary ? `
//     background:var(--ink);color:white;border:2px solid var(--ink);
//     &:hover{background:var(--accent);border-color:var(--accent);}
//   ` : `
//     background:transparent;color:var(--ink);border:2px solid var(--ink);
//     &:hover{background:var(--ink);color:white;}
//   `}
// `;

// /* ─── NAV ─── */
// const TopBar = styled.div`
//   position:sticky;top:0;z-index:100;
//   background:var(--bg);border-bottom:1.5px solid var(--border);
//   display:flex;align-items:center;justify-content:space-between;
//   padding:0.875rem 2rem;
//   @media(max-width:640px){padding:0.75rem 1rem;}
// `;
// const NavLeft = styled.div`display:flex;align-items:center;gap:0.5rem;`;
// const NavBtn = styled.button`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-family:var(--font-display);font-size:0.75rem;font-weight:700;
//   letter-spacing:0.1em;text-transform:uppercase;
//   color:var(--ink-3);background:transparent;border:none;cursor:pointer;
//   padding:0.375rem 0.625rem;border-radius:var(--r-sm);
//   transition:all 0.2s;
//   svg{width:13px;height:13px;}
//   &:hover{background:var(--border);color:var(--ink);}
// `;
// const NavBrand = styled.div`
//   font-family:var(--font-display);font-size:0.85rem;font-weight:800;
//   color:var(--ink);letter-spacing:0.06em;text-transform:uppercase;
// `;

// /* ─── MARQUEE TICKER ─── */
// const TickerWrap = styled.div`
//   overflow:hidden;background:var(--accent);padding:0.6rem 0;
//   border-bottom:1.5px solid var(--ink);
// `;
// const TickerInner = styled.div`
//   display:flex;white-space:nowrap;
//   animation:${marquee} 18s linear infinite;
//   &:hover{animation-play-state:paused;}
// `;
// const TickerItem = styled.span`
//   font-family:var(--font-display);
//   font-size:0.7rem;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;
//   color:white;padding:0 2.5rem;
//   &::after{content:'✦';margin-left:2.5rem;opacity:0.6;}
// `;

// /* ─── BENTO HERO ─── */
// const BentoWrap = styled.section`
//   padding:2rem;
//   display:grid;
//   grid-template-columns:320px 1fr 1fr;
//   grid-template-rows:auto auto;
//   gap:1rem;
//   max-width:1280px;margin:0 auto;
//   animation:${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both;
//   @media(max-width:1100px){grid-template-columns:1fr 1fr;grid-template-rows:auto;}
//   @media(max-width:680px){grid-template-columns:1fr;padding:1.25rem;}
// `;

// const BentoCell = styled.div`
//   background:var(--surface);
//   border:1.5px solid var(--border);
//   border-radius:var(--r-xl);
//   overflow:hidden;
//   transition:box-shadow 0.25s, transform 0.25s;
//   &:hover{box-shadow:6px 6px 0 var(--border);transform:translate(-2px,-2px);}
// `;

// /* Photo cell */
// const PhotoCell = styled(BentoCell)`
//   grid-row:1 / 3;
//   min-height:420px;
//   position:relative;
//   @media(max-width:1100px){grid-row:auto;min-height:300px;}
//   @media(max-width:680px){min-height:260px;}
// `;
// const PhotoImg = styled.img`
//   width:100%;height:100%;object-fit:cover;object-position:top center;display:block;
//   min-height:inherit;
// `;
// const PhotoPlaceholder = styled.div`
//   width:100%;min-height:inherit;height:100%;
//   background:linear-gradient(145deg,#f0ece4,#e4dfd8);
//   display:flex;align-items:center;justify-content:center;
//   svg{width:5rem;height:5rem;color:var(--ink-4);}
// `;
// const PhotoOverlay = styled.div`
//   position:absolute;inset:0;
//   background:linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
// `;
// const PhotoTag = styled.div`
//   position:absolute;bottom:1.25rem;left:1.25rem;right:1.25rem;
// `;
// const PhotoTagBadge = styled.span`
//   display:inline-block;
//   background:var(--accent);color:white;
//   font-family:var(--font-display);font-size:0.65rem;font-weight:700;
//   letter-spacing:0.14em;text-transform:uppercase;
//   padding:0.3rem 0.75rem;border-radius:99px;
// `;

// /* Name cell */
// const NameCell = styled(BentoCell)`
//   padding:2rem;
//   display:flex;flex-direction:column;justify-content:flex-end;
//   background:var(--ink);color:white;
//   grid-column:2/4;
//   @media(max-width:1100px){grid-column:auto;}
// `;
// const NameText = styled.h1`
//   font-family:var(--font-display);
//   font-size:clamp(2.2rem,5vw,4.5rem);
//   font-weight:800;line-height:0.95;
//   letter-spacing:-0.025em;
//   color:white;
//   em{font-style:italic;color:rgba(255,255,255,0.55);}
// `;
// const NameMeta = styled.p`
//   font-size:0.825rem;color:rgba(255,255,255,0.5);
//   margin-top:0.75rem;letter-spacing:0.06em;text-transform:uppercase;
// `;

// /* Stats cell */
// const StatsCell = styled(BentoCell)`
//   padding:1.5rem;
//   display:grid;grid-template-columns:1fr 1fr;gap:1rem;
// `;
// const StatItem = styled.div`
//   text-align:center;padding:0.75rem;
//   background:var(--bg);border-radius:var(--r-md);
// `;
// const StatNum = styled.div`
//   font-family:var(--font-display);
//   font-size:2.25rem;font-weight:800;color:var(--ink);line-height:1;
// `;
// const StatLbl = styled.div`
//   font-size:0.65rem;color:var(--ink-4);
//   text-transform:uppercase;letter-spacing:0.12em;margin-top:0.35rem;
// `;

// /* Social cell */
// const SocialCell = styled(BentoCell)`
//   padding:1.5rem;
//   display:flex;flex-direction:column;justify-content:space-between;
//   gap:1rem;
// `;
// const SocialTitle = styled.p`
//   font-family:var(--font-display);
//   font-size:0.65rem;font-weight:700;letter-spacing:0.16em;
//   text-transform:uppercase;color:var(--ink-4);
// `;
// const SocialGrid = styled.div`
//   display:flex;flex-wrap:wrap;gap:0.5rem;
// `;
// const SocialIcon = styled.a`
//   display:inline-flex;align-items:center;justify-content:center;
//   width:40px;height:40px;
//   background:var(--bg);border:1.5px solid var(--border);
//   border-radius:var(--r-sm);
//   color:var(--ink);text-decoration:none;
//   transition:all 0.2s;
//   svg{width:16px;height:16px;}
//   &:hover{background:var(--accent);color:white;border-color:var(--accent);}
// `;
// const ResumeBtn = styled.a`
//   display:inline-flex;align-items:center;gap:0.5rem;
//   padding:0.7rem 1.25rem;
//   background:var(--accent-2);color:white;border:none;
//   border-radius:var(--r-md);
//   font-family:var(--font-display);font-size:0.75rem;font-weight:700;
//   letter-spacing:0.1em;text-transform:uppercase;text-decoration:none;
//   transition:all 0.2s;width:fit-content;
//   svg{width:14px;height:14px;}
//   &:hover{opacity:0.85;transform:translateY(-2px);}
// `;

// /* Contact pills cell */
// const ContactCell = styled(BentoCell)`
//   padding:1.5rem;
//   display:flex;flex-wrap:wrap;gap:0.5rem;align-items:flex-start;align-content:flex-start;
//   background:var(--accent-3);
// `;
// const ContactPill = styled.div`
//   display:flex;align-items:center;gap:0.4rem;
//   font-size:0.8rem;font-weight:500;color:white;
//   background:rgba(255,255,255,0.2);
//   padding:0.45rem 0.875rem;border-radius:99px;
//   svg{width:13px;height:13px;flex-shrink:0;}
// `;

// /* ─── SUMMARY BAND ─── */
// const SummaryBand = styled.section`
//   border-top:1.5px solid var(--border);border-bottom:1.5px solid var(--border);
//   padding:3rem 2rem;
//   max-width:1280px;margin:0 auto;
//   animation:${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both;
//   opacity:0;animation-fill-mode:forwards;
// `;
// const SummaryInner = styled.div`
//   max-width:800px;
// `;
// const SummaryEye = styled.p`
//   font-family:var(--font-display);font-size:0.65rem;font-weight:700;
//   letter-spacing:0.2em;text-transform:uppercase;color:var(--accent);
//   margin-bottom:1rem;
// `;
// const SummaryText = styled.blockquote`
//   font-family:var(--font-display);
//   font-size:clamp(1.4rem,3vw,2.1rem);
//   font-weight:400;line-height:1.45;color:var(--ink);
//   font-style:italic;
// `;

// /* ─── SECTION WRAPPER ─── */
// const SectionWrap = styled.section`
//   max-width:1280px;margin:0 auto;
//   padding:3rem 2rem;
//   border-bottom:1.5px solid var(--border);
//   animation:${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) ${p=>p.$delay||'0.3s'} both;
//   opacity:0;animation-fill-mode:forwards;
//   @media(max-width:640px){padding:2rem 1.25rem;}
// `;
// const SectionHeader = styled.div`
//   display:flex;align-items:center;justify-content:space-between;
//   margin-bottom:2.5rem;
// `;
// const SectionTitle = styled.h2`
//   font-family:var(--font-display);
//   font-size:clamp(1.6rem,3vw,2.25rem);
//   font-weight:800;color:var(--ink);letter-spacing:-0.02em;
// `;
// const SectionIndex = styled.span`
//   font-family:var(--font-display);
//   font-size:3rem;font-weight:800;
//   color:var(--border);line-height:1;
// `;

// /* ─── TIMELINE – 2-col asymmetric ─── */
// const TLGrid = styled.div`
//   display:grid;
//   grid-template-columns:1fr 1fr;
//   gap:1rem;
//   @media(max-width:720px){grid-template-columns:1fr;}
// `;
// const TLCard = styled.div`
//   background:var(--surface);
//   border:1.5px solid var(--border);
//   border-radius:var(--r-xl);
//   padding:1.75rem 2rem;
//   position:relative;overflow:hidden;
//   transition:all 0.3s;
//   &::before{
//     content:'';position:absolute;top:0;left:0;right:0;height:3px;
//     background:var(--accent);opacity:0;transition:opacity 0.3s;
//   }
//   &:hover{box-shadow:5px 5px 0 var(--border);transform:translate(-2px,-2px);&::before{opacity:1;}}
// `;
// const TLDate = styled.span`
//   font-family:var(--font-display);
//   font-size:0.65rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
//   color:var(--accent);background:rgba(26,26,255,0.08);
//   padding:0.3rem 0.75rem;border-radius:99px;
//   display:inline-block;margin-bottom:1rem;
// `;
// const TLTitle = styled.h3`
//   font-family:var(--font-display);font-size:1.1rem;font-weight:700;
//   color:var(--ink);margin-bottom:0.3rem;
// `;
// const TLSub = styled.p`font-size:0.875rem;font-weight:500;color:var(--accent);margin-bottom:0.75rem;`;
// const TLDesc = styled.p`font-size:0.85rem;color:var(--ink-3);line-height:1.75;`;

// /* ─── PROJECTS – bento-style mixed sizes ─── */
// const ProjGrid = styled.div`
//   display:grid;
//   grid-template-columns:repeat(12,1fr);
//   gap:1rem;
//   @media(max-width:900px){grid-template-columns:1fr 1fr;}
//   @media(max-width:540px){grid-template-columns:1fr;}
// `;
// const getProjGridStyle = (i) => {
//   const patterns = [
//     { gridColumn: 'span 7' },
//     { gridColumn: 'span 5' },
//     { gridColumn: 'span 5' },
//     { gridColumn: 'span 7' },
//     { gridColumn: 'span 4' },
//     { gridColumn: 'span 4' },
//     { gridColumn: 'span 4' },
//   ];
//   return patterns[i % patterns.length] || { gridColumn: 'span 6' };
// };
// const ProjCard = styled.div`
//   background:var(--surface);
//   border:1.5px solid var(--border);
//   border-radius:var(--r-xl);
//   padding:2rem;
//   display:flex;flex-direction:column;gap:0.875rem;
//   position:relative;overflow:hidden;
//   transition:all 0.3s;
//   ${p=>p.$style}
//   &:hover{box-shadow:5px 5px 0 var(--border);transform:translate(-2px,-2px);}
//   @media(max-width:900px){grid-column:span 1!important;}
//   @media(max-width:540px){grid-column:span 1!important;}
// `;
// const ProjNum = styled.div`
//   font-family:var(--font-display);
//   font-size:5rem;font-weight:800;line-height:1;
//   color:rgba(0,0,0,0.05);
//   position:absolute;top:0.5rem;right:1.25rem;
//   user-select:none;pointer-events:none;
// `;
// const ProjTitle = styled.h3`
//   font-family:var(--font-display);font-size:1.15rem;font-weight:700;
//   color:var(--ink);line-height:1.25;padding-right:3rem;
// `;
// const ProjDesc = styled.p`font-size:0.875rem;color:var(--ink-3);line-height:1.75;flex:1;`;
// const TechRow = styled.div`display:flex;flex-wrap:wrap;gap:0.4rem;`;
// const TechTag = styled.span`
//   font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;
//   color:var(--ink);background:var(--bg);border:1.5px solid var(--border);
//   padding:0.25rem 0.625rem;border-radius:0.35rem;
// `;
// const ProjLinks = styled.div`display:flex;gap:0.5rem;flex-wrap:wrap;`;
// const ProjLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-family:var(--font-display);font-size:0.7rem;font-weight:700;
//   letter-spacing:0.08em;text-transform:uppercase;
//   padding:0.5rem 0.875rem;border-radius:var(--r-sm);
//   background:var(--ink);color:white;text-decoration:none;
//   transition:all 0.2s;border:1.5px solid var(--ink);
//   svg{width:12px;height:12px;}
//   &:hover{background:var(--accent);border-color:var(--accent);}
// `;

// /* ─── SKILLS – horizontal scroll chips ─── */
// const SkillsLayout = styled.div`display:flex;flex-direction:column;gap:1rem;`;
// const SkillGroup = styled.div`
//   background:var(--surface);
//   border:1.5px solid var(--border);
//   border-radius:var(--r-xl);
//   padding:1.75rem 2rem;
//   display:flex;gap:1.5rem;align-items:flex-start;
//   @media(max-width:640px){flex-direction:column;gap:0.75rem;}
// `;
// const SkillCatLabel = styled.div`
//   font-family:var(--font-display);font-size:0.65rem;font-weight:700;
//   letter-spacing:0.16em;text-transform:uppercase;color:var(--ink-3);
//   white-space:nowrap;min-width:120px;padding-top:0.25rem;
//   @media(max-width:640px){min-width:0;}
// `;
// const SkillPills = styled.div`display:flex;flex-wrap:wrap;gap:0.5rem;`;
// const SkillPill = styled.span`
//   font-size:0.875rem;font-weight:500;color:var(--ink);
//   background:var(--bg);border:1.5px solid var(--border);
//   padding:0.5rem 1rem;border-radius:99px;
//   transition:all 0.2s;cursor:default;
//   &:hover{background:var(--ink);color:white;border-color:var(--ink);}
// `;

// /* ─── CERTS – horizontal cards with colored stripe ─── */
// const CertGrid = styled.div`
//   display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;
// `;
// const CertCard = styled.div`
//   background:var(--surface);
//   border:1.5px solid var(--border);
//   border-radius:var(--r-xl);
//   overflow:hidden;
//   transition:all 0.3s;
//   &:hover{box-shadow:5px 5px 0 var(--border);transform:translate(-2px,-2px);}
// `;
// const CertStripe = styled.div`
//   height:5px;
//   background:${p => {
//     const colors = ['var(--accent)', 'var(--accent-2)', 'var(--accent-3)', '#8b5cf6', '#f59e0b'];
//     return colors[p.$i % colors.length];
//   }};
// `;
// const CertBody = styled.div`padding:1.5rem 1.75rem;`;
// const CertName = styled.h3`
//   font-family:var(--font-display);font-size:1rem;font-weight:700;
//   color:var(--ink);line-height:1.35;margin-bottom:0.3rem;
// `;
// const CertIssuer = styled.p`font-size:0.825rem;font-weight:500;color:var(--ink-3);margin-bottom:0.875rem;`;
// const CertLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-family:var(--font-display);font-size:0.7rem;font-weight:700;
//   letter-spacing:0.08em;text-transform:uppercase;
//   color:var(--ink);text-decoration:none;transition:gap 0.2s;
//   svg{width:12px;height:12px;}
//   &:hover{gap:0.625rem;}
// `;

// /* ─── INTERESTS ─── */
// const InterestFlow = styled.div`display:flex;flex-wrap:wrap;gap:0.75rem;`;
// const InterestPill = styled.span`
//   font-family:var(--font-display);font-size:0.9rem;font-weight:600;
//   color:var(--ink);
//   border:2px solid var(--ink);
//   padding:0.55rem 1.375rem;border-radius:99px;
//   cursor:default;transition:all 0.2s;
//   &:hover{background:var(--ink);color:white;}
// `;

// /* ─── EMPTY ─── */
// const Empty = styled.div`
//   background:var(--surface);border:2px dashed var(--border);
//   border-radius:var(--r-xl);padding:3rem;
//   display:flex;flex-direction:column;align-items:center;gap:0.75rem;
//   color:var(--ink-4);font-size:0.875rem;text-align:center;
//   svg{width:2.5rem;height:2.5rem;opacity:0.3;}
// `;

// /* ─── LOADING ─── */
// const LoadWrap = styled.div`
//   min-height:100vh;display:flex;flex-direction:column;
//   align-items:center;justify-content:center;gap:1.5rem;
//   background:var(--bg);
// `;
// const Spinner = styled.div`
//   width:36px;height:36px;
//   border:2px solid var(--border);border-top-color:var(--accent);
//   border-radius:50%;animation:${spin} 0.8s linear infinite;
// `;
// const LoadLabel = styled.p`
//   font-family:var(--font-display);font-size:0.7rem;font-weight:700;
//   letter-spacing:0.2em;text-transform:uppercase;color:var(--ink-4);
// `;
// const LoadBar = styled.div`
//   width:120px;height:2px;border-radius:99px;
//   background:linear-gradient(90deg,var(--border) 0%,var(--accent) 50%,var(--border) 100%);
//   background-size:800px;animation:${shimmer} 1.5s linear infinite;
// `;

// /* ─── ERROR ─── */
// const ErrorWrap = styled.div`
//   min-height:100vh;display:flex;align-items:center;justify-content:center;
//   padding:2rem;background:var(--bg);
// `;
// const ErrorBox = styled.div`
//   background:var(--surface);border:2px solid var(--ink);border-radius:var(--r-xl);
//   padding:4rem 3rem;max-width:420px;width:100%;text-align:center;
//   box-shadow:8px 8px 0 var(--border);
//   animation:${fadeUp} 0.5s ease both;
//   @media(max-width:480px){padding:3rem 2rem;}
// `;
// const ErrorTitle = styled.h2`
//   font-family:var(--font-display);font-size:1.75rem;font-weight:800;
//   color:var(--ink);margin-bottom:0.75rem;margin-top:1rem;
// `;
// const ErrorMsg = styled.p`color:var(--ink-3);line-height:1.7;margin-bottom:2rem;font-size:0.9rem;`;
// const GoHomeBtn = styled.button`
//   display:inline-flex;align-items:center;gap:0.5rem;
//   padding:0.875rem 2rem;background:var(--ink);color:white;
//   border:none;border-radius:var(--r-md);
//   font-family:var(--font-display);font-size:0.875rem;font-weight:700;
//   cursor:pointer;transition:all 0.2s;
//   &:hover{background:var(--accent);}
//   svg{width:15px;height:15px;}
// `;

// /* ═══════════════════════════════════════════ */

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [showOverlay, setShowOverlay] = useState(() => {
//     const d = sessionStorage.getItem('overlayDismissed');
//     return d === 'true' ? false : !user;
//   });
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft(prev => { if (prev <= 1) { handleClose(); return 0; } return prev - 1; });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleClose = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         data.projects?.forEach((p, i) => { if (p.image) paths.push({ key: `project_${i}`, path: p.image }); });
//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           try { const url = await publicService.getSignedUrl(path); if (url) urlMap[key] = url; } catch {}
//         }));
//         setImageUrls(urlMap);
//       } catch (err) { setError(err.message || 'Profile not found'); }
//       finally { setLoading(false); }
//     };
//     if (username) load();
//   }, [username]);

//   if (loading) return (
//     <><GlobalStyle />
//     <LoadWrap><Spinner /><LoadBar /><LoadLabel>Loading portfolio</LoadLabel></LoadWrap></>
//   );

//   if (error || !portfolio) return (
//     <><GlobalStyle />
//     <ErrorWrap><ErrorBox>
//       <AlertCircle size={40} color="var(--accent)" />
//       <ErrorTitle>{error ? 'Not Found' : 'No Portfolio Yet'}</ErrorTitle>
//       <ErrorMsg>{error || "This user hasn't set up their portfolio yet."}</ErrorMsg>
//       <GoHomeBtn onClick={() => navigate('/')}><Home size={15} /> Return Home</GoHomeBtn>
//     </ErrorBox></ErrorWrap></>
//   );

//   const {
//     profile = {}, education = [], experience = [],
//     projects = [], skills = {}, certifications = [], interests = {}
//   } = portfolio;

//   const fullName = profile.name || 'Anonymous User';
//   const [firstName, ...rest] = fullName.split(' ');
//   const lastName = rest.join(' ') || '';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;

//   const tickerItems = [
//     profile.domain || 'Professional Portfolio',
//     fullName,
//     profile.location || 'Open to Work',
//     `${education.length} Education`,
//     `${experience.length} Experience`,
//     `${projects.length} Projects`,
//   ];

//   return (
//     <>
//       <GlobalStyle />

//       {/* Overlay */}
//       <OvBg $show={showOverlay}>
//         <OvBox $closing={isClosing}>
//           <OvClose onClick={handleClose}><X /></OvClose>
//           <OvTag>Portfolio Platform</OvTag>
//           <OvTitle>Build Yours Today</OvTitle>
//           <OvDesc>Create a stunning professional presence and share it with the world.</OvDesc>
//           <OvTimer>Auto-closes in {timeLeft}s</OvTimer>
//           <OvBtns>
//             <OvBtn $primary onClick={() => navigate('/login')}>Sign In</OvBtn>
//             <OvBtn onClick={() => navigate('/register')}>Register</OvBtn>
//           </OvBtns>
//         </OvBox>
//       </OvBg>

//       {/* Nav */}
//       <TopBar>
//         <NavLeft>
//           <NavBtn onClick={() => navigate(-1)}><ChevronLeft />Back</NavBtn>
//           <NavBtn onClick={() => navigate('/')}><Home />Home</NavBtn>
//         </NavLeft>
//         <NavBrand>Portfolio</NavBrand>
//       </TopBar>

//       {/* Ticker */}
//       <TickerWrap>
//         <TickerInner>
//           {[...tickerItems, ...tickerItems].map((t, i) => (
//             <TickerItem key={i}>{t}</TickerItem>
//           ))}
//         </TickerInner>
//       </TickerWrap>

//       {/* ── BENTO HERO ── */}
//       <BentoWrap>
//         {/* Photo */}
//         <PhotoCell>
//           {imageUrls.profilePhoto
//             ? <><PhotoImg src={imageUrls.profilePhoto} alt={fullName} /><PhotoOverlay /><PhotoTag><PhotoTagBadge>{profile.domain || 'Professional'}</PhotoTagBadge></PhotoTag></>
//             : <PhotoPlaceholder><User /></PhotoPlaceholder>
//           }
//         </PhotoCell>

//         {/* Name */}
//         <NameCell>
//           <NameText>{firstName}{lastName && <><br /><em>{lastName}</em></>}</NameText>
//           <NameMeta>{profile.domain || 'Professional'} &nbsp;·&nbsp; {profile.location || 'Location not set'}</NameMeta>
//         </NameCell>

//         {/* Stats */}
//         <StatsCell>
//           <StatItem><StatNum>{education.length||'—'}</StatNum><StatLbl>Education</StatLbl></StatItem>
//           <StatItem><StatNum>{experience.length||'—'}</StatNum><StatLbl>Roles</StatLbl></StatItem>
//           <StatItem><StatNum>{projects.length||'—'}</StatNum><StatLbl>Projects</StatLbl></StatItem>
//           <StatItem><StatNum>{certifications.length||'—'}</StatNum><StatLbl>Certs</StatLbl></StatItem>
//         </StatsCell>

//         {/* Social */}
//         <SocialCell>
//           <SocialTitle>Connect</SocialTitle>
//           <SocialGrid>
//             {socialLinks.map((item) => {
//               const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//               const Icon = meta.icon;
//               return (
//                 <SocialIcon key={item._id||item.id} href={buildSocialHref(item)} target="_blank" rel="noopener noreferrer" title={item.name||meta.label}>
//                   <Icon />
//                 </SocialIcon>
//               );
//             })}
//           </SocialGrid>
//           {cvLink && <ResumeBtn href={cvLink} target="_blank" rel="noopener noreferrer"><FileText /> Download Resume</ResumeBtn>}
//         </SocialCell>

//         {/* Contact */}
//         {(profile.email || profile.phone || profile.location) && (
//           <ContactCell>
//             {profile.email    && <ContactPill><Mail />    {profile.email}</ContactPill>}
//             {profile.phone    && <ContactPill><Phone />   {profile.phone}</ContactPill>}
//             {profile.location && <ContactPill><MapPin />  {profile.location}</ContactPill>}
//           </ContactCell>
//         )}
//       </BentoWrap>

//       {/* Summary */}
//       {profile.summary && (
//         <SummaryBand>
//           <SummaryInner>
//             <SummaryEye>About</SummaryEye>
//             <SummaryText>"{profile.summary}"</SummaryText>
//           </SummaryInner>
//         </SummaryBand>
//       )}

//       {/* Education */}
//       <SectionWrap $delay="0.25s">
//         <SectionHeader>
//           <SectionTitle>Education</SectionTitle>
//           <SectionIndex>01</SectionIndex>
//         </SectionHeader>
//         {education.length > 0 ? (
//           <TLGrid>
//             {education.map((edu, i) => {
//               const dur = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'N/A';
//               const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : null;
//               return (
//                 <TLCard key={edu._id||i}>
//                   <TLDate>{dur}</TLDate>
//                   <TLTitle>{na(edu.institution)}</TLTitle>
//                   <TLSub>{na(edu.course)}</TLSub>
//                   {score && <TLDesc>{score}</TLDesc>}
//                 </TLCard>
//               );
//             })}
//           </TLGrid>
//         ) : <Empty><BookOpen /><span>No education details added yet</span></Empty>}
//       </SectionWrap>

//       {/* Experience */}
//       <SectionWrap $delay="0.3s">
//         <SectionHeader>
//           <SectionTitle>Experience</SectionTitle>
//           <SectionIndex>02</SectionIndex>
//         </SectionHeader>
//         {experience.length > 0 ? (
//           <TLGrid>
//             {experience.map((exp, i) => (
//               <TLCard key={exp._id||i}>
//                 <TLDate>{exp.duration||'N/A'}</TLDate>
//                 <TLTitle>{na(exp.role)}</TLTitle>
//                 <TLSub>{na(exp.company)}{exp.type ? ` · ${exp.type}` : ''}</TLSub>
//                 {exp.description && <TLDesc>{exp.description}</TLDesc>}
//               </TLCard>
//             ))}
//           </TLGrid>
//         ) : <Empty><Briefcase /><span>No experience details added yet</span></Empty>}
//       </SectionWrap>

//       {/* Projects */}
//       <SectionWrap $delay="0.35s">
//         <SectionHeader>
//           <SectionTitle>Projects</SectionTitle>
//           <SectionIndex>03</SectionIndex>
//         </SectionHeader>
//         {projects.length > 0 ? (
//           <ProjGrid>
//             {projects.map((proj, i) => {
//               const gs = getProjGridStyle(i);
//               return (
//                 <ProjCard key={proj._id||i} $style={`grid-column:${gs.gridColumn};`}>
//                   <ProjNum>0{i+1}</ProjNum>
//                   <ProjTitle>{na(proj.title)}</ProjTitle>
//                   {proj.description && <ProjDesc>{proj.description}</ProjDesc>}
//                   {proj.tech?.length > 0 && <TechRow>{proj.tech.map((t,j)=><TechTag key={j}>{t}</TechTag>)}</TechRow>}
//                   {(proj.demo||proj.repo) && (
//                     <ProjLinks>
//                       {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLink>}
//                       {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLink>}
//                     </ProjLinks>
//                   )}
//                 </ProjCard>
//               );
//             })}
//           </ProjGrid>
//         ) : <Empty><Code2 /><span>No projects added yet</span></Empty>}
//       </SectionWrap>

//       {/* Skills */}
//       <SectionWrap $delay="0.4s">
//         <SectionHeader>
//           <SectionTitle>Skills</SectionTitle>
//           <SectionIndex>04</SectionIndex>
//         </SectionHeader>
//         {skillCats.length > 0 ? (
//           <SkillsLayout>
//             {skillCats.map((cat, idx) => (
//               <SkillGroup key={cat._id||idx}>
//                 <SkillCatLabel>{cat.category}</SkillCatLabel>
//                 <SkillPills>{cat.items.map((item,i)=><SkillPill key={i}>{item}</SkillPill>)}</SkillPills>
//               </SkillGroup>
//             ))}
//           </SkillsLayout>
//         ) : <Empty><Layers /><span>No skills added yet</span></Empty>}
//       </SectionWrap>

//       {/* Certifications */}
//       <SectionWrap $delay="0.45s">
//         <SectionHeader>
//           <SectionTitle>Certifications</SectionTitle>
//           <SectionIndex>05</SectionIndex>
//         </SectionHeader>
//         {certifications.length > 0 ? (
//           <CertGrid>
//             {certifications.map((cert, i) => (
//               <CertCard key={cert._id||i}>
//                 <CertStripe $i={i} />
//                 <CertBody>
//                   <CertName>{na(cert.name)}</CertName>
//                   <CertIssuer>{na(cert.issuer)}</CertIssuer>
//                   {cert.link && <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">View Credential <ArrowUpRight /></CertLink>}
//                 </CertBody>
//               </CertCard>
//             ))}
//           </CertGrid>
//         ) : <Empty><Award /><span>No certifications added yet</span></Empty>}
//       </SectionWrap>

//       {/* Interests */}
//       {interests?.interests?.length > 0 && (
//         <SectionWrap $delay="0.5s">
//           <SectionHeader>
//             <SectionTitle>Interests</SectionTitle>
//             <SectionIndex>06</SectionIndex>
//           </SectionHeader>
//           <InterestFlow>
//             {interests.interests.map((item, i) => <InterestPill key={i}>{item}</InterestPill>)}
//           </InterestFlow>
//         </SectionWrap>
//       )}
//     </>
//   );
// };

// export default PublicProfilePage;












// ========================= Templete 5 ====================== //

// ===================== Template 5: Terminal / Code Aesthetic ===================== //
// Unique concept: Everything looks like a terminal / IDE. The hero is a fake terminal
// window with typed-out content. Sections use code-block aesthetics with line numbers.
// The sidebar is a "file explorer" tree. Dark theme with green/cyan accents.
// Completely different from any split-layout template.

// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText, Terminal, Folder, FolderOpen,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Globe, ChevronRight,
//   Circle, Minus, Square,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// /* ─── ICON MAP ─── */
// const SOCIAL_ICON_MAP = {
//   Github: { icon: Github, label: 'GitHub' },
//   Linkedin: { icon: Linkedin, label: 'LinkedIn' },
//   Twitter: { icon: Twitter, label: 'Twitter / X' },
//   Instagram: { icon: Instagram, label: 'Instagram' },
//   Youtube: { icon: Youtube, label: 'YouTube' },
//   Code2: { icon: Code2, label: 'LeetCode' },
//   Trophy: { icon: Trophy, label: 'Codeforces' },
//   Twitch: { icon: Twitch, label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send: { icon: Send, label: 'Telegram' },
//   Rss: { icon: Rss, label: 'Blog' },
//   Globe: { icon: Globe, label: 'Website' },
//   Mail: { icon: Mail, label: 'Email' },
//   Phone: { icon: Phone, label: 'Phone' },
//   AtSign: { icon: AtSign, label: 'Other' },
//   ExternalLink: { icon: ExternalLink, label: 'Link' },
// };

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// /* ─── GLOBAL ─── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   :root {
//     --bg:       #0d1117;
//     --bg-2:     #161b22;
//     --bg-3:     #1c2128;
//     --panel:    #21262d;
//     --border:   #30363d;
//     --border-2: #3d444d;
//     --green:    #3fb950;
//     --green-dim:#1c4428;
//     --cyan:     #79c0ff;
//     --cyan-dim: #112d45;
//     --yellow:   #e3b341;
//     --yellow-dim:#3a2f05;
//     --purple:   #d2a8ff;
//     --red:      #f85149;
//     --comment:  #8b949e;
//     --text:     #c9d1d9;
//     --text-2:   #8b949e;
//     --text-3:   #6e7681;
//     --r-sm:     6px;
//     --r-md:     8px;
//     --r-lg:     12px;
//     --font-mono:   'JetBrains Mono', 'Fira Code', monospace;
//     --font-body:   'Inter', system-ui, sans-serif;
//   }
//   html { scroll-behavior: smooth; }
//   body {
//     background: var(--bg);
//     font-family: var(--font-mono);
//     color: var(--text);
//     -webkit-font-smoothing: antialiased;
//   }
//   img { display: block; max-width: 100%; }
//   ::selection { background: var(--cyan); color: var(--bg); }
//   ::-webkit-scrollbar { width: 6px; height: 6px; }
//   ::-webkit-scrollbar-track { background: var(--bg); }
//   ::-webkit-scrollbar-thumb { background: var(--border-2); border-radius: 3px; }
// `;

// /* ─── KEYFRAMES ─── */
// const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
// const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`;
// const slideUp = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
// const spin = keyframes`to{transform:rotate(360deg)}`;
// const shimmer = keyframes`0%{background-position:-800px 0}100%{background-position:800px 0}`;
// const scanline = keyframes`0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}`;

// /* ─── TERMINAL WINDOW ─── */
// const TermWindow = styled.div`
//   background:var(--bg-2);
//   border:1px solid var(--border);
//   border-radius:var(--r-lg);
//   overflow:hidden;
// `;
// const TermTitleBar = styled.div`
//   background:var(--panel);
//   border-bottom:1px solid var(--border);
//   padding:0.625rem 1rem;
//   display:flex;align-items:center;gap:0.625rem;
// `;
// const TermDot = styled.span`
//   width:12px;height:12px;border-radius:50%;
//   background:${p => p.$c || 'var(--border)'};
//   display:inline-block;
// `;
// const TermTitle = styled.span`
//   font-size:0.75rem;color:var(--text-3);
//   margin-left:0.5rem;letter-spacing:0.04em;flex:1;text-align:center;
// `;

// /* ─── OVERLAY ─── */
// const OvBg = styled.div`
//   position:fixed;inset:0;
//   background:rgba(0,0,0,${p=>p.$show?'0.85':'0'});
//   display:flex;align-items:center;justify-content:center;
//   z-index:${p=>p.$show?'9999':'-1'};
//   padding:1rem;
//   pointer-events:${p=>p.$show?'auto':'none'};
//   transition:all 0.3s;
//   backdrop-filter:${p=>p.$show?'blur(4px)':'none'};
// `;
// const OvBox = styled.div`
//   background:var(--bg-2);
//   border:1px solid var(--green);
//   border-radius:var(--r-lg);
//   padding:0;
//   max-width:440px;width:100%;
//   box-shadow:0 0 40px rgba(63,185,80,0.2);
//   animation:${p=>p.$closing?'none':slideUp} 0.4s ease both;
//   overflow:hidden;
// `;
// const OvTitleBar = styled.div`
//   background:var(--panel);border-bottom:1px solid var(--border);
//   padding:0.625rem 1rem;
//   display:flex;align-items:center;gap:0.625rem;
// `;
// const OvBody = styled.div`padding:2rem;`;
// const OvPrompt = styled.div`
//   font-size:0.875rem;color:var(--comment);margin-bottom:0.5rem;
//   &::before{content:'# ';color:var(--green);}
// `;
// const OvTitle = styled.div`
//   font-size:1.5rem;font-weight:700;color:var(--green);margin-bottom:1rem;line-height:1.2;
//   &::before{content:'> ';color:var(--comment);}
// `;
// const OvDesc = styled.p`font-size:0.8rem;color:var(--text-2);line-height:1.8;margin-bottom:1rem;margin-left:1rem;`;
// const OvTimer = styled.p`
//   font-size:0.75rem;color:var(--comment);margin-bottom:1.5rem;margin-left:1rem;
//   &::before{content:'# auto-close: ';color:var(--yellow);}
// `;
// const OvBtns = styled.div`display:flex;gap:0.75rem;@media(max-width:400px){flex-direction:column;}`;
// const OvBtn = styled.button`
//   flex:1;padding:0.75rem;
//   border-radius:var(--r-md);
//   font-family:var(--font-mono);font-size:0.8rem;font-weight:500;
//   cursor:pointer;transition:all 0.2s;
//   ${p=>p.$primary?`
//     background:var(--green-dim);color:var(--green);
//     border:1px solid var(--green);
//     &:hover{background:var(--green);color:var(--bg);}
//   `:`
//     background:transparent;color:var(--text-2);border:1px solid var(--border);
//     &:hover{border-color:var(--text-2);color:var(--text);}
//   `}
// `;
// const OvCloseBtn = styled.button`
//   background:transparent;border:none;color:var(--comment);
//   cursor:pointer;margin-left:auto;display:flex;align-items:center;
//   transition:color 0.2s;
//   &:hover{color:var(--red);}
//   svg{width:14px;height:14px;}
// `;

// /* ─── LAYOUT ─── */
// const AppShell = styled.div`min-height:100vh;display:flex;flex-direction:column;`;

// /* Tab bar (IDE-style) */
// const TabBar = styled.div`
//   background:var(--bg-2);
//   border-bottom:1px solid var(--border);
//   display:flex;align-items:stretch;
//   position:sticky;top:0;z-index:100;
//   overflow-x:auto;
//   &::-webkit-scrollbar{display:none;}
// `;
// const Tab = styled.div`
//   display:flex;align-items:center;gap:0.5rem;
//   padding:0.625rem 1.25rem;
//   border-right:1px solid var(--border);
//   font-size:0.75rem;color:${p=>p.$active?'var(--text)':'var(--text-3)'};
//   background:${p=>p.$active?'var(--bg)':'transparent'};
//   border-top:${p=>p.$active?'2px solid var(--cyan)':'2px solid transparent'};
//   cursor:pointer;white-space:nowrap;
//   svg{width:13px;height:13px;}
// `;
// const NavBtns = styled.div`
//   display:flex;align-items:center;gap:0.25rem;
//   padding:0 0.75rem;margin-left:auto;border-left:1px solid var(--border);
// `;
// const IconBtn = styled.button`
//   display:flex;align-items:center;justify-content:center;
//   background:transparent;border:none;
//   color:var(--text-3);cursor:pointer;
//   padding:0.25rem;border-radius:4px;
//   transition:all 0.15s;
//   svg{width:14px;height:14px;}
//   &:hover{background:var(--panel);color:var(--text);}
// `;

// /* Main area */
// const MainArea = styled.div`
//   display:flex;flex:1;
//   @media(max-width:900px){flex-direction:column;}
// `;

// /* File tree sidebar */
// const Sidebar = styled.div`
//   width:220px;flex-shrink:0;
//   background:var(--bg-2);
//   border-right:1px solid var(--border);
//   padding:0.75rem 0;
//   overflow-y:auto;
//   @media(max-width:900px){width:100%;border-right:none;border-bottom:1px solid var(--border);max-height:200px;}
// `;
// const TreeSection = styled.div`margin-bottom:1rem;`;
// const TreeLabel = styled.div`
//   font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;
//   color:var(--text-3);padding:0.25rem 0.875rem;margin-bottom:0.25rem;
// `;
// const TreeItem = styled.div`
//   display:flex;align-items:center;gap:0.5rem;
//   padding:0.3rem 0.875rem;
//   font-size:0.75rem;color:${p=>p.$active?'var(--text)':'var(--text-2)'};
//   background:${p=>p.$active?'rgba(121,192,255,0.1)':'transparent'};
//   cursor:pointer;transition:background 0.15s;
//   &:hover{background:var(--panel);}
//   svg{width:13px;height:13px;flex-shrink:0;color:${p=>p.$active?'var(--cyan)':'var(--text-3)'};}
// `;
// const TreeDot = styled.span`
//   width:6px;height:6px;border-radius:50%;
//   background:var(--green);flex-shrink:0;
//   margin-right:-0.2rem;
//   display:${p=>p.$show?'block':'none'};
// `;

// /* Content area */
// const Content = styled.div`
//   flex:1;overflow-y:auto;
//   background:var(--bg);
//   min-width:0;
// `;

// /* ─── HERO TERMINAL ─── */
// const HeroWrap = styled.div`
//   padding:1.5rem;
//   animation:${fadeUp} 0.6s ease both;
// `;
// const HeroTerminal = styled(TermWindow)``;
// const TermBody = styled.div`
//   padding:1.5rem;
//   @media(max-width:540px){padding:1rem;}
// `;
// const TermLine = styled.div`
//   display:flex;align-items:flex-start;gap:0.625rem;
//   font-size:0.875rem;line-height:1.8;
//   margin-bottom:${p=>p.$mb||'0'};
// `;
// const Prompt = styled.span`color:var(--green);flex-shrink:0;`;
// const Cmd = styled.span`color:var(--cyan);`;
// const Val = styled.span`color:var(--yellow);`;
// const Str = styled.span`color:var(--text);`;
// const Comment = styled.span`color:var(--comment);font-style:italic;`;
// const Cursor = styled.span`
//   display:inline-block;width:8px;height:1.1em;
//   background:var(--green);vertical-align:text-bottom;
//   animation:${blink} 1s step-end infinite;margin-left:2px;
// `;
// const AvatarInTerminal = styled.div`
//   display:flex;gap:1.5rem;align-items:flex-start;
//   padding:1.25rem 0;
//   @media(max-width:600px){flex-direction:column;gap:1rem;}
// `;
// const AvatarSmall = styled.div`
//   width:80px;height:80px;flex-shrink:0;border-radius:50%;overflow:hidden;
//   border:2px solid var(--green);
//   box-shadow:0 0 20px rgba(63,185,80,0.3);
// `;
// const AvatarImg = styled.img`width:100%;height:100%;object-fit:cover;`;
// const AvatarPH = styled.div`
//   width:100%;height:100%;
//   background:var(--bg-3);
//   display:flex;align-items:center;justify-content:center;
//   svg{width:2rem;height:2rem;color:var(--text-3);}
// `;
// const StatLine = styled.div`
//   font-size:0.8rem;margin-bottom:0.25rem;
//   span.k{color:var(--purple);}
//   span.v{color:var(--yellow);}
//   span.s{color:var(--comment);}
// `;
// const SocialLine = styled.div`
//   display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;
// `;
// const SocialLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-size:0.75rem;color:var(--cyan);text-decoration:none;
//   background:var(--cyan-dim);border:1px solid rgba(121,192,255,0.3);
//   padding:0.3rem 0.7rem;border-radius:var(--r-sm);
//   transition:all 0.2s;
//   svg{width:12px;height:12px;}
//   &:hover{background:var(--cyan);color:var(--bg);}
// `;
// const ResumeLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-size:0.75rem;color:var(--green);text-decoration:none;
//   background:var(--green-dim);border:1px solid rgba(63,185,80,0.3);
//   padding:0.3rem 0.875rem;border-radius:var(--r-sm);
//   transition:all 0.2s;
//   svg{width:12px;height:12px;}
//   &:hover{background:var(--green);color:var(--bg);}
// `;

// /* ─── CODE BLOCK SECTIONS ─── */
// const CodeSection = styled.div`
//   padding:1.5rem;
//   border-top:1px solid var(--border);
//   animation:${fadeUp} 0.6s ease ${p=>p.$delay||'0.2s'} both;
//   opacity:0;animation-fill-mode:forwards;
// `;
// const SectionCommentHeader = styled.div`
//   display:flex;align-items:center;gap:0.75rem;
//   margin-bottom:1.25rem;
// `;
// const SectionComment = styled.div`
//   font-size:0.75rem;color:var(--comment);font-style:italic;
//   &::before{content:'// ';color:var(--green);}
// `;
// const SectionDivider = styled.div`
//   flex:1;height:1px;background:var(--border);
// `;

// /* Code block wrapper with line numbers */
// const CodeBlock = styled.div`
//   background:var(--bg-2);
//   border:1px solid var(--border);
//   border-radius:var(--r-md);
//   overflow:hidden;
//   margin-bottom:0.75rem;
//   transition:border-color 0.2s;
//   &:hover{border-color:var(--border-2);}
// `;
// const CodeBlockHeader = styled.div`
//   background:var(--panel);
//   border-bottom:1px solid var(--border);
//   padding:0.5rem 1rem;
//   display:flex;align-items:center;justify-content:space-between;
// `;
// const CodeBlockTitle = styled.span`font-size:0.7rem;color:var(--text-3);`;
// const CodeBlockBadge = styled.span`
//   font-size:0.65rem;letter-spacing:0.08em;text-transform:uppercase;
//   color:var(--green);background:var(--green-dim);
//   border:1px solid rgba(63,185,80,0.25);
//   padding:0.15rem 0.5rem;border-radius:3px;
// `;
// const CodeBody = styled.div`
//   display:flex;
//   font-size:0.8rem;line-height:1.8;
// `;
// const LineNumbers = styled.div`
//   padding:0.875rem 0.75rem;
//   text-align:right;
//   color:var(--text-3);
//   background:var(--bg-3);
//   border-right:1px solid var(--border);
//   user-select:none;min-width:44px;
//   font-size:0.72rem;line-height:1.8;
// `;
// const CodeLines = styled.div`
//   padding:0.875rem 1rem;flex:1;overflow-x:auto;
// `;
// const CL = styled.div`
//   white-space:nowrap;
//   &:hover{background:rgba(255,255,255,0.02);}
// `;

// /* Item badge */
// const ItemBadge = styled.span`
//   display:inline-block;
//   font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;
//   padding:0.2rem 0.6rem;border-radius:3px;
//   background:${p=>p.$c==='cyan'?'var(--cyan-dim)':p.$c==='yellow'?'var(--yellow-dim)':'var(--green-dim)'};
//   color:${p=>p.$c==='cyan'?'var(--cyan)':p.$c==='yellow'?'var(--yellow)':'var(--green)'};
//   border:1px solid ${p=>p.$c==='cyan'?'rgba(121,192,255,0.3)':p.$c==='yellow'?'rgba(227,179,65,0.3)':'rgba(63,185,80,0.3)'};
//   margin-bottom:0.5rem;
// `;

// /* Projects – card grid */
// const ProjGrid = styled.div`
//   display:grid;
//   grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
//   gap:0.75rem;
// `;
// const ProjCard = styled.div`
//   background:var(--bg-2);
//   border:1px solid var(--border);
//   border-radius:var(--r-md);
//   overflow:hidden;
//   transition:all 0.25s;
//   &:hover{border-color:var(--green);box-shadow:0 0 16px rgba(63,185,80,0.1);}
// `;
// const ProjHeader = styled.div`
//   background:var(--panel);
//   border-bottom:1px solid var(--border);
//   padding:0.5rem 1rem;
//   display:flex;align-items:center;justify-content:space-between;
// `;
// const ProjFileName = styled.span`
//   font-size:0.75rem;color:var(--text-2);
//   &::before{content:'📄 ';font-size:0.7rem;}
// `;
// const ProjBody = styled.div`padding:1rem;`;
// const ProjTitle = styled.div`
//   font-size:0.875rem;color:var(--cyan);font-weight:500;margin-bottom:0.5rem;
//   &::before{content:'class ';color:var(--purple);}
// `;
// const ProjDesc = styled.div`
//   font-size:0.78rem;color:var(--comment);line-height:1.75;margin-bottom:0.75rem;
//   font-style:italic;
//   &::before{content:'/* ';} &::after{content:' */';}
// `;
// const TechLine = styled.div`
//   font-size:0.75rem;color:var(--text-2);margin-bottom:0.5rem;
//   span.k{color:var(--purple);}span.v{color:var(--yellow);}
// `;
// const ProjLinkRow = styled.div`display:flex;gap:0.5rem;flex-wrap:wrap;margin-top:0.75rem;`;
// const ProjLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-size:0.72rem;color:var(--green);text-decoration:none;
//   background:var(--green-dim);border:1px solid rgba(63,185,80,0.25);
//   padding:0.3rem 0.75rem;border-radius:3px;
//   transition:all 0.2s;
//   svg{width:11px;height:11px;}
//   &:hover{background:var(--green);color:var(--bg);}
// `;

// /* Skills – inline tags grid */
// const SkillsLayout = styled.div`display:flex;flex-direction:column;gap:1rem;`;
// const SkillGroup = styled.div`
//   display:grid;grid-template-columns:180px 1fr;gap:0.75rem;align-items:start;
//   @media(max-width:640px){grid-template-columns:1fr;}
// `;
// const SkillKey = styled.div`
//   font-size:0.8rem;color:var(--purple);padding-top:0.25rem;
//   &::after{content:':';color:var(--comment);}
// `;
// const SkillTags = styled.div`display:flex;flex-wrap:wrap;gap:0.35rem;`;
// const SkillTag = styled.span`
//   font-size:0.72rem;color:var(--text);
//   background:rgba(255,255,255,0.05);
//   border:1px solid var(--border);
//   padding:0.25rem 0.6rem;border-radius:3px;
//   transition:all 0.2s;cursor:default;
//   &:hover{border-color:var(--cyan);color:var(--cyan);}
// `;

// /* Cert list */
// const CertList = styled.div`display:flex;flex-direction:column;gap:0.5rem;`;
// const CertRow = styled.div`
//   background:var(--bg-2);
//   border:1px solid var(--border);
//   border-radius:var(--r-sm);
//   padding:0.875rem 1rem;
//   display:flex;align-items:center;justify-content:space-between;
//   flex-wrap:wrap;gap:0.5rem;
//   transition:border-color 0.2s;
//   &:hover{border-color:var(--yellow);}
// `;
// const CertInfo = styled.div``;
// const CertName = styled.div`font-size:0.825rem;color:var(--text);margin-bottom:0.2rem;`;
// const CertIssuer = styled.div`font-size:0.75rem;color:var(--comment);`;
// const CertLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-size:0.72rem;color:var(--yellow);text-decoration:none;
//   background:var(--yellow-dim);border:1px solid rgba(227,179,65,0.25);
//   padding:0.3rem 0.75rem;border-radius:3px;
//   transition:all 0.2s;
//   svg{width:11px;height:11px;}
//   &:hover{background:var(--yellow);color:var(--bg);}
// `;

// /* Interests */
// const InterestGrid = styled.div`display:flex;flex-wrap:wrap;gap:0.5rem;`;
// const InterestTag = styled.span`
//   font-size:0.8rem;color:var(--purple);
//   background:rgba(210,168,255,0.08);
//   border:1px solid rgba(210,168,255,0.2);
//   padding:0.375rem 0.875rem;border-radius:var(--r-sm);
//   cursor:default;transition:all 0.2s;
//   &::before{content:'"';}&::after{content:'"';}
//   &:hover{background:rgba(210,168,255,0.15);border-color:var(--purple);}
// `;

// /* Empty */
// const EmptyTerm = styled.div`
//   font-size:0.8rem;color:var(--comment);padding:1.5rem;
//   &::before{content:'// ';color:var(--text-3);}
// `;

// /* Loading */
// const LoadWrap = styled.div`
//   min-height:100vh;display:flex;flex-direction:column;
//   align-items:center;justify-content:center;gap:1.5rem;background:var(--bg);
// `;
// const Spinner = styled.div`
//   width:32px;height:32px;
//   border:1.5px solid var(--border);border-top-color:var(--green);
//   border-radius:50%;animation:${spin} 0.7s linear infinite;
// `;
// const LoadLabel = styled.p`font-size:0.75rem;color:var(--comment);letter-spacing:0.1em;`;
// const LoadBar = styled.div`
//   width:120px;height:1px;
//   background:linear-gradient(90deg,var(--bg-3) 0%,var(--green) 50%,var(--bg-3) 100%);
//   background-size:800px;animation:${shimmer} 1.5s linear infinite;
// `;

// /* Error */
// const ErrWrap = styled.div`
//   min-height:100vh;display:flex;align-items:center;justify-content:center;
//   padding:2rem;background:var(--bg);
// `;
// const ErrBox = styled(TermWindow)`
//   max-width:420px;width:100%;
//   animation:${fadeUp} 0.5s ease both;
// `;
// const ErrBody = styled.div`padding:2rem;text-align:center;`;
// const ErrTitle = styled.div`font-size:1.25rem;color:var(--red);margin:1rem 0 0.5rem;&::before{content:'Error: ';}`;
// const ErrMsg = styled.p`font-size:0.825rem;color:var(--comment);line-height:1.7;margin-bottom:1.5rem;`;
// const GoHomeBtn = styled.button`
//   display:inline-flex;align-items:center;gap:0.5rem;
//   padding:0.625rem 1.5rem;
//   background:var(--green-dim);color:var(--green);
//   border:1px solid var(--green);border-radius:var(--r-sm);
//   font-family:var(--font-mono);font-size:0.8rem;cursor:pointer;
//   transition:all 0.2s;
//   &:hover{background:var(--green);color:var(--bg);}
//   svg{width:14px;height:14px;}
// `;

// /* ─── SECTION IDs for sidebar nav ─── */
// const SECTIONS = ['hero','education','experience','projects','skills','certifications','interests'];

// /* ═══════════════════════════════════════════ */

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [activeSection, setActiveSection] = useState('hero');
//   const [showOverlay, setShowOverlay] = useState(() => {
//     return sessionStorage.getItem('overlayDismissed') === 'true' ? false : !user;
//   });
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft(prev => { if (prev <= 1) { handleClose(); return 0; } return prev - 1; });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleClose = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   const scrollTo = (id) => {
//     setActiveSection(id);
//     document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           try { const url = await publicService.getSignedUrl(path); if (url) urlMap[key] = url; } catch {}
//         }));
//         setImageUrls(urlMap);
//       } catch (err) { setError(err.message || 'Profile not found'); }
//       finally { setLoading(false); }
//     };
//     if (username) load();
//   }, [username]);

//   if (loading) return (
//     <><GlobalStyle /><LoadWrap><Spinner /><LoadBar /><LoadLabel>$ loading portfolio...</LoadLabel></LoadWrap></>
//   );

//   if (error || !portfolio) return (
//     <><GlobalStyle /><ErrWrap><ErrBox>
//       <TermTitleBar><TermDot $c="#f85149"/><TermDot $c="#e3b341"/><TermDot $c="#3fb950"/><TermTitle>error.log</TermTitle></TermTitleBar>
//       <ErrBody>
//         <Code2 size={32} color="var(--red)" />
//         <ErrTitle>{error ? 'ProfileNotFound' : 'NoPortfolioError'}</ErrTitle>
//         <ErrMsg>{error || "This user hasn't set up their portfolio yet."}</ErrMsg>
//         <GoHomeBtn onClick={() => navigate('/')}><Home size={14} /> cd ~</GoHomeBtn>
//       </ErrBody>
//     </ErrBox></ErrWrap></>
//   );

//   const {
//     profile = {}, education = [], experience = [],
//     projects = [], skills = {}, certifications = [], interests = {}
//   } = portfolio;

//   const fullName = profile.name || 'Anonymous User';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;

//   const hasSection = (name) => {
//     if (name === 'education') return education.length > 0;
//     if (name === 'experience') return experience.length > 0;
//     if (name === 'projects') return projects.length > 0;
//     if (name === 'skills') return skillCats.length > 0;
//     if (name === 'certifications') return certifications.length > 0;
//     if (name === 'interests') return interests?.interests?.length > 0;
//     return true;
//   };

//   return (
//     <>
//       <GlobalStyle />

//       {/* Overlay */}
//       <OvBg $show={showOverlay}>
//         <OvBox $closing={isClosing}>
//           <OvTitleBar>
//             <TermDot $c="#f85149"/><TermDot $c="#e3b341"/><TermDot $c="#3fb950"/>
//             <span style={{fontSize:'0.72rem',color:'var(--text-3)',marginLeft:'0.5rem'}}>register.sh</span>
//             <OvCloseBtn onClick={handleClose}><X /></OvCloseBtn>
//           </OvTitleBar>
//           <OvBody>
//             <OvPrompt>create your portfolio</OvPrompt>
//             <OvTitle>Build Your Profile</OvTitle>
//             <OvDesc>Sign in or create an account to build and share your professional portfolio with the world.</OvDesc>
//             <OvTimer>{timeLeft}s</OvTimer>
//             <OvBtns>
//               <OvBtn $primary onClick={() => navigate('/login')}>$ sign-in</OvBtn>
//               <OvBtn onClick={() => navigate('/register')}>$ register</OvBtn>
//             </OvBtns>
//           </OvBody>
//         </OvBox>
//       </OvBg>

//       <AppShell>
//         {/* Tab bar */}
//         <TabBar>
//           <Tab $active onClick={() => scrollTo('hero')}>
//             <Terminal size={13} />
//             {fullName.split(' ')[0].toLowerCase()}.json
//           </Tab>
//           <Tab onClick={() => scrollTo('projects')}>
//             <Code2 size={13} />
//             projects/
//           </Tab>
//           <Tab onClick={() => scrollTo('skills')}>
//             <Layers size={13} />
//             skills.ts
//           </Tab>
//           <NavBtns>
//             <IconBtn onClick={() => navigate(-1)} title="Back"><ChevronLeft /></IconBtn>
//             <IconBtn onClick={() => navigate('/')} title="Home"><Home /></IconBtn>
//           </NavBtns>
//         </TabBar>

//         <MainArea>
//           {/* Sidebar */}
//           <Sidebar>
//             <TreeSection>
//               <TreeLabel>Explorer</TreeLabel>
//               {['hero','education','experience','projects','skills','certifications','interests'].map(s => (
//                 hasSection(s) && (
//                   <TreeItem key={s} $active={activeSection===s} onClick={() => scrollTo(s)}>
//                     <TreeDot $show={activeSection===s} />
//                     {s==='hero'?<User/>:s==='education'?<BookOpen/>:s==='experience'?<Briefcase/>:s==='projects'?<Code2/>:s==='skills'?<Layers/>:s==='certifications'?<Award/>:<Sparkles/>}
//                     {s}.{s==='skills'?'ts':s==='hero'?'json':'md'}
//                   </TreeItem>
//                 )
//               ))}
//             </TreeSection>
//             <TreeSection>
//               <TreeLabel>Output</TreeLabel>
//               <TreeItem $active={false}>
//                 <Circle size={6} />
//                 {education.length} education
//               </TreeItem>
//               <TreeItem $active={false}>
//                 <Circle size={6} />
//                 {experience.length} roles
//               </TreeItem>
//               <TreeItem $active={false}>
//                 <Circle size={6} />
//                 {projects.length} projects
//               </TreeItem>
//               <TreeItem $active={false}>
//                 <Circle size={6} />
//                 {certifications.length} certs
//               </TreeItem>
//             </TreeSection>
//           </Sidebar>

//           {/* Main content */}
//           <Content>

//             {/* ── HERO ── */}
//             <HeroWrap id="section-hero">
//               <HeroTerminal>
//                 <TermTitleBar>
//                   <TermDot $c="#f85149"/><TermDot $c="#e3b341"/><TermDot $c="#3fb950"/>
//                   <TermTitle>~/portfolio/{username} — zsh</TermTitle>
//                 </TermTitleBar>
//                 <TermBody>
//                   <TermLine $mb="0.5rem">
//                     <Prompt>❯</Prompt>
//                     <span><Cmd>cat</Cmd> <Val>profile.json</Val></span>
//                   </TermLine>

//                   <AvatarInTerminal>
//                     <AvatarSmall>
//                       {imageUrls.profilePhoto
//                         ? <AvatarImg src={imageUrls.profilePhoto} alt={fullName} />
//                         : <AvatarPH><User /></AvatarPH>}
//                     </AvatarSmall>
//                     <div>
//                       <StatLine><span className="s">{'{'}</span></StatLine>
//                       <StatLine>&nbsp;&nbsp;<span className="k">"name"</span>: <span className="v">"{fullName}"</span>,</StatLine>
//                       {profile.domain && <StatLine>&nbsp;&nbsp;<span className="k">"role"</span>: <span className="v">"{profile.domain}"</span>,</StatLine>}
//                       {profile.location && <StatLine>&nbsp;&nbsp;<span className="k">"location"</span>: <span className="v">"{profile.location}"</span>,</StatLine>}
//                       {profile.email && <StatLine>&nbsp;&nbsp;<span className="k">"email"</span>: <span className="v">"{profile.email}"</span>,</StatLine>}
//                       {profile.phone && <StatLine>&nbsp;&nbsp;<span className="k">"phone"</span>: <span className="v">"{profile.phone}"</span>,</StatLine>}
//                       <StatLine>&nbsp;&nbsp;<span className="k">"education"</span>: <span className="v">{education.length}</span>,</StatLine>
//                       <StatLine>&nbsp;&nbsp;<span className="k">"projects"</span>: <span className="v">{projects.length}</span>,</StatLine>
//                       <StatLine>&nbsp;&nbsp;<span className="k">"skills"</span>: <span className="v">{skillCats.reduce((a,c)=>a+c.items.length,0)}</span></StatLine>
//                       <StatLine><span className="s">{'}'}</span></StatLine>
//                     </div>
//                   </AvatarInTerminal>

//                   {(socialLinks.length > 0 || cvLink) && (
//                     <>
//                       <TermLine $mb="0.5rem">
//                         <Prompt>❯</Prompt>
//                         <span><Cmd>ls</Cmd> <Val>--links</Val></span>
//                       </TermLine>
//                       <SocialLine>
//                         {socialLinks.map((item) => {
//                           const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                           const Icon = meta.icon;
//                           return (
//                             <SocialLink key={item._id||item.id} href={buildSocialHref(item)} target="_blank" rel="noopener noreferrer">
//                               <Icon /> {item.name || meta.label}
//                             </SocialLink>
//                           );
//                         })}
//                         {cvLink && <ResumeLink href={cvLink} target="_blank" rel="noopener noreferrer"><FileText /> resume.pdf</ResumeLink>}
//                       </SocialLine>
//                     </>
//                   )}

//                   {profile.summary && (
//                     <>
//                       <TermLine $mb="0.5rem" style={{marginTop:'1rem'}}>
//                         <Prompt>❯</Prompt>
//                         <span><Cmd>echo</Cmd> <Val>$ABOUT_ME</Val></span>
//                       </TermLine>
//                       <TermLine>
//                         <span style={{marginLeft:'1.5rem',color:'var(--text-2)',fontStyle:'italic',fontSize:'0.825rem',lineHeight:'1.7'}}>
//                           {profile.summary}
//                         </span>
//                       </TermLine>
//                     </>
//                   )}

//                   <TermLine style={{marginTop:'1.25rem'}}>
//                     <Prompt>❯</Prompt>
//                     <Cursor />
//                   </TermLine>
//                 </TermBody>
//               </HeroTerminal>
//             </HeroWrap>

//             {/* ── EDUCATION ── */}
//             <CodeSection id="section-education" $delay="0.2s">
//               <SectionCommentHeader>
//                 <SectionComment>education history</SectionComment>
//                 <SectionDivider />
//               </SectionCommentHeader>
//               {education.length > 0 ? education.map((edu, i) => {
//                 const dur = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'N/A';
//                 const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : null;
//                 const lines = [`const institution = "${na(edu.institution)}";`, `const course = "${na(edu.course)}";`, `const duration = "${dur}";`, ...(score ? [`const score = "${score}";`] : [])];
//                 return (
//                   <CodeBlock key={edu._id||i}>
//                     <CodeBlockHeader>
//                       <CodeBlockTitle>education_{i+1}.ts</CodeBlockTitle>
//                       <CodeBlockBadge>edu</CodeBlockBadge>
//                     </CodeBlockHeader>
//                     <CodeBody>
//                       <LineNumbers>{lines.map((_,j)=><div key={j}>{i*10+j+1}</div>)}</LineNumbers>
//                       <CodeLines>
//                         {lines.map((l, j) => (
//                           <CL key={j} style={{color: j===0?'var(--cyan)':j===1?'var(--yellow)':j===2?'var(--green)':'var(--text-2)'}}>{l}</CL>
//                         ))}
//                       </CodeLines>
//                     </CodeBody>
//                   </CodeBlock>
//                 );
//               }) : <EmptyTerm>No education records found</EmptyTerm>}
//             </CodeSection>

//             {/* ── EXPERIENCE ── */}
//             <CodeSection id="section-experience" $delay="0.25s">
//               <SectionCommentHeader>
//                 <SectionComment>work experience</SectionComment>
//                 <SectionDivider />
//               </SectionCommentHeader>
//               {experience.length > 0 ? experience.map((exp, i) => {
//                 const lines = [`const role = "${na(exp.role)}";`, `const company = "${na(exp.company)}";`, `const duration = "${exp.duration||'N/A'}";`, ...(exp.type?[`const type = "${exp.type}";`]:[]), ...(exp.description?[`/* ${exp.description.substring(0,60)}${exp.description.length>60?'...':''} */`]:[])];
//                 return (
//                   <CodeBlock key={exp._id||i}>
//                     <CodeBlockHeader>
//                       <CodeBlockTitle>role_{i+1}.ts</CodeBlockTitle>
//                       <CodeBlockBadge style={{background:'var(--cyan-dim)',color:'var(--cyan)',borderColor:'rgba(121,192,255,0.25)'}}>exp</CodeBlockBadge>
//                     </CodeBlockHeader>
//                     <CodeBody>
//                       <LineNumbers>{lines.map((_,j)=><div key={j}>{i*10+j+1}</div>)}</LineNumbers>
//                       <CodeLines>
//                         {lines.map((l, j) => (
//                           <CL key={j} style={{color:l.startsWith('/*')?'var(--comment)':j===0?'var(--cyan)':j===1?'var(--purple)':j===2?'var(--green)':'var(--yellow)'}}>{l}</CL>
//                         ))}
//                       </CodeLines>
//                     </CodeBody>
//                   </CodeBlock>
//                 );
//               }) : <EmptyTerm>No experience records found</EmptyTerm>}
//             </CodeSection>

//             {/* ── PROJECTS ── */}
//             <CodeSection id="section-projects" $delay="0.3s">
//               <SectionCommentHeader>
//                 <SectionComment>projects — {projects.length} total</SectionComment>
//                 <SectionDivider />
//               </SectionCommentHeader>
//               {projects.length > 0 ? (
//                 <ProjGrid>
//                   {projects.map((proj, i) => (
//                     <ProjCard key={proj._id||i}>
//                       <ProjHeader>
//                         <ProjFileName>{`project_${String(i+1).padStart(2,'0')}.ts`}</ProjFileName>
//                         {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">demo <ArrowUpRight /></ProjLink>}
//                       </ProjHeader>
//                       <ProjBody>
//                         <ProjTitle>{na(proj.title)}</ProjTitle>
//                         {proj.description && <ProjDesc>{proj.description}</ProjDesc>}
//                         {proj.tech?.length > 0 && (
//                           <TechLine>
//                             <span className="k">readonly</span> stack = [<span className="v">{proj.tech.join(', ')}</span>]
//                           </TechLine>
//                         )}
//                         {(proj.demo||proj.repo) && (
//                           <ProjLinkRow>
//                             {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">live() <ArrowUpRight /></ProjLink>}
//                             {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer" style={{color:'var(--cyan)',background:'var(--cyan-dim)',borderColor:'rgba(121,192,255,0.25)'}}>&lt;Github/&gt;</ProjLink>}
//                           </ProjLinkRow>
//                         )}
//                       </ProjBody>
//                     </ProjCard>
//                   ))}
//                 </ProjGrid>
//               ) : <EmptyTerm>No projects found</EmptyTerm>}
//             </CodeSection>

//             {/* ── SKILLS ── */}
//             <CodeSection id="section-skills" $delay="0.35s">
//               <SectionCommentHeader>
//                 <SectionComment>skills &amp; technologies</SectionComment>
//                 <SectionDivider />
//               </SectionCommentHeader>
//               {skillCats.length > 0 ? (
//                 <SkillsLayout>
//                   {skillCats.map((cat, idx) => (
//                     <SkillGroup key={cat._id||idx}>
//                       <SkillKey>{cat.category.toLowerCase().replace(/\s/g,'_')}</SkillKey>
//                       <SkillTags>{cat.items.map((item,i)=><SkillTag key={i}>{item}</SkillTag>)}</SkillTags>
//                     </SkillGroup>
//                   ))}
//                 </SkillsLayout>
//               ) : <EmptyTerm>No skills found</EmptyTerm>}
//             </CodeSection>

//             {/* ── CERTIFICATIONS ── */}
//             <CodeSection id="section-certifications" $delay="0.4s">
//               <SectionCommentHeader>
//                 <SectionComment>certifications</SectionComment>
//                 <SectionDivider />
//               </SectionCommentHeader>
//               {certifications.length > 0 ? (
//                 <CertList>
//                   {certifications.map((cert, i) => (
//                     <CertRow key={cert._id||i}>
//                       <CertInfo>
//                         <CertName>{na(cert.name)}</CertName>
//                         <CertIssuer>// {na(cert.issuer)}</CertIssuer>
//                       </CertInfo>
//                       {cert.link && <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">open() <ArrowUpRight /></CertLink>}
//                     </CertRow>
//                   ))}
//                 </CertList>
//               ) : <EmptyTerm>No certifications found</EmptyTerm>}
//             </CodeSection>

//             {/* ── INTERESTS ── */}
//             {interests?.interests?.length > 0 && (
//               <CodeSection id="section-interests" $delay="0.45s">
//                 <SectionCommentHeader>
//                   <SectionComment>interests &amp; hobbies</SectionComment>
//                   <SectionDivider />
//                 </SectionCommentHeader>
//                 <InterestGrid>
//                   {interests.interests.map((item,i)=><InterestTag key={i}>{item}</InterestTag>)}
//                 </InterestGrid>
//               </CodeSection>
//             )}

//           </Content>
//         </MainArea>
//       </AppShell>
//     </>
//   );
// };

// export default PublicProfilePage;













// ============================ Templete 6 ============================= //

// ===================== Template 6: Vertical Editorial Magazine ===================== //
// Unique concept: Newspaper/editorial spread. The hero occupies 100vh with a full-bleed
// background and oversized typography. Sections are laid out as magazine editorial
// spreads with pull quotes, numbered callouts, and alternating column layouts.
// Warm cream palette. Serif display type. Completely different structure.

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Globe, ChevronDown,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// /* ─── ICON MAP ─── */
// const SOCIAL_ICON_MAP = {
//   Github: { icon: Github, label: 'GitHub' },
//   Linkedin: { icon: Linkedin, label: 'LinkedIn' },
//   Twitter: { icon: Twitter, label: 'Twitter / X' },
//   Instagram: { icon: Instagram, label: 'Instagram' },
//   Youtube: { icon: Youtube, label: 'YouTube' },
//   Code2: { icon: Code2, label: 'LeetCode' },
//   Trophy: { icon: Trophy, label: 'Codeforces' },
//   Twitch: { icon: Twitch, label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send: { icon: Send, label: 'Telegram' },
//   Rss: { icon: Rss, label: 'Blog' },
//   Globe: { icon: Globe, label: 'Website' },
//   Mail: { icon: Mail, label: 'Email' },
//   Phone: { icon: Phone, label: 'Phone' },
//   AtSign: { icon: AtSign, label: 'Other' },
//   ExternalLink: { icon: ExternalLink, label: 'Link' },
// };

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// /* ─── GLOBAL ─── */
// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,700;1,900&family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&family=DM+Mono:wght@400;500&display=swap');

//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//   :root {
//     --cream:     #f9f6f0;
//     --cream-2:   #f0ebe0;
//     --cream-3:   #e8e0d0;
//     --ivory:     #faf8f4;
//     --ink:       #1a1814;
//     --ink-2:     #3a3630;
//     --ink-3:     #6b6358;
//     --ink-4:     #a09688;
//     --ink-5:     #c8bfb0;
//     --border:    #d4c9b8;
//     --border-2:  #e8e0d0;
//     --red:       #c0392b;
//     --red-pale:  #f9e8e6;

//     --font-display:  'Playfair Display', 'Georgia', serif;
//     --font-serif:    'Source Serif 4', 'Georgia', serif;
//     --font-mono:     'DM Mono', monospace;

//     --r-sm: 4px;
//     --r-md: 8px;
//     --r-lg: 16px;
//     --r-xl: 24px;

//     --col: 680px;
//   }

//   html { scroll-behavior: smooth; }

//   body {
//     background: var(--cream);
//     font-family: var(--font-serif);
//     color: var(--ink);
//     -webkit-font-smoothing: antialiased;
//   }

//   img { display: block; max-width: 100%; }

//   ::selection {
//     background: var(--ink);
//     color: var(--cream);
//   }

//   ::-webkit-scrollbar { width: 6px; }
//   ::-webkit-scrollbar-track { background: var(--cream); }
//   ::-webkit-scrollbar-thumb { background: var(--ink-4); border-radius: 3px; }
// `;

// /* ─── KEYFRAMES ─── */
// const fadeUp = keyframes`from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}`;
// const fadeIn = keyframes`from{opacity:0}to{opacity:1}`;
// const slideUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
// const spin = keyframes`to{transform:rotate(360deg)}`;
// const shimmer = keyframes`0%{background-position:-800px 0}100%{background-position:800px 0}`;
// const bobDown = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}`;

// /* ─── OVERLAY ─── */
// const OvBg = styled.div`
//   position:fixed;inset:0;
//   background:rgba(26,24,20,${p=>p.$show?'0.75':'0'});
//   display:flex;align-items:center;justify-content:center;
//   z-index:${p=>p.$show?'9999':'-1'};
//   padding:1rem;
//   pointer-events:${p=>p.$show?'auto':'none'};
//   transition:all 0.4s;
// `;
// const OvBox = styled.div`
//   background:var(--ivory);
//   border:2px solid var(--ink);
//   max-width:460px;width:100%;
//   text-align:center;position:relative;
//   animation:${p=>p.$closing?'none':slideUp} 0.45s ease both;
// `;
// const OvClose = styled.button`
//   position:absolute;top:0.875rem;right:0.875rem;
//   background:transparent;border:none;color:var(--ink-3);
//   cursor:pointer;display:flex;align-items:center;transition:color 0.2s;
//   &:hover{color:var(--ink);}
//   svg{width:18px;height:18px;}
// `;
// const OvMast = styled.div`
//   border-bottom:2px solid var(--ink);
//   padding:1.25rem 2rem;
// `;
// const OvIssueLine = styled.p`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.14em;
//   text-transform:uppercase;color:var(--ink-3);margin-bottom:0.5rem;
// `;
// const OvIssueTitle = styled.h2`
//   font-family:var(--font-display);font-size:2rem;font-weight:900;
//   color:var(--ink);line-height:1.05;
// `;
// const OvBody = styled.div`padding:2rem;`;
// const OvDesc = styled.p`
//   font-family:var(--font-serif);font-size:0.95rem;line-height:1.7;
//   color:var(--ink-2);margin-bottom:0.75rem;font-style:italic;
// `;
// const OvTimer = styled.p`
//   font-family:var(--font-mono);font-size:0.7rem;letter-spacing:0.1em;
//   color:var(--ink-4);margin-bottom:1.75rem;
// `;
// const OvBtns = styled.div`
//   display:flex;gap:0.75rem;
//   @media(max-width:400px){flex-direction:column;}
// `;
// const OvBtn = styled.button`
//   flex:1;padding:0.875rem;
//   font-family:var(--font-display);font-size:0.875rem;font-weight:700;
//   cursor:pointer;transition:all 0.2s;
//   ${p=>p.$primary?`
//     background:var(--ink);color:var(--cream);border:2px solid var(--ink);
//     &:hover{background:var(--red);border-color:var(--red);}
//   `:`
//     background:transparent;color:var(--ink);border:2px solid var(--ink);
//     &:hover{background:var(--cream-2);}
//   `}
// `;

// /* ─── MASTHEAD / NAV ─── */
// const Masthead = styled.header`
//   background:var(--ivory);
//   border-bottom:3px double var(--ink);
//   position:sticky;top:0;z-index:100;
// `;
// const MastheadTop = styled.div`
//   display:flex;align-items:center;justify-content:space-between;
//   padding:0.625rem 2.5rem;border-bottom:1px solid var(--border);
//   @media(max-width:640px){padding:0.5rem 1.25rem;}
// `;
// const MastheadBtns = styled.div`display:flex;gap:0.125rem;`;
// const NavBtn = styled.button`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.1em;text-transform:uppercase;
//   color:var(--ink-3);background:transparent;border:1px solid transparent;
//   padding:0.375rem 0.75rem;cursor:pointer;transition:all 0.2s;
//   svg{width:12px;height:12px;}
//   &:hover{border-color:var(--border);color:var(--ink);}
// `;
// const MastheadDate = styled.p`
//   font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.08em;
//   color:var(--ink-4);
// `;
// const MastheadTitle = styled.div`
//   text-align:center;
//   padding:0.875rem 2.5rem;
// `;
// const Nameplate = styled.p`
//   font-family:var(--font-display);font-size:0.7rem;font-weight:700;
//   letter-spacing:0.25em;text-transform:uppercase;color:var(--ink-3);margin-bottom:0.25rem;
// `;
// const MastheadWordmark = styled.h2`
//   font-family:var(--font-display);font-size:clamp(1.5rem,4vw,2.5rem);
//   font-weight:900;letter-spacing:-0.025em;color:var(--ink);line-height:1;
//   font-style:italic;
// `;

// /* ─── HERO ─── */
// const HeroSection = styled.section`
//   min-height:100vh;
//   display:grid;
//   grid-template-rows:1fr auto;
//   position:relative;
//   overflow:hidden;
//   background:var(--ink);
// `;
// const HeroBgImg = styled.img`
//   position:absolute;inset:0;width:100%;height:100%;
//   object-fit:cover;object-position:center top;
//   opacity:0.25;
// `;
// const HeroBgPlaceholder = styled.div`
//   position:absolute;inset:0;
//   background:linear-gradient(160deg, #2a2520 0%, #1a1814 100%);
// `;
// const HeroContent = styled.div`
//   position:relative;z-index:2;
//   display:flex;flex-direction:column;justify-content:flex-end;
//   padding:6rem 2.5rem 0;
//   max-width:1200px;margin:0 auto;width:100%;
//   animation:${fadeUp} 1s cubic-bezier(0.22,1,0.36,1) both;
//   @media(max-width:640px){padding:5rem 1.5rem 0;}
// `;
// const HeroEyebrow = styled.div`
//   display:flex;align-items:center;gap:1rem;margin-bottom:1.5rem;
// `;
// const HeroBrow = styled.span`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;
//   color:rgba(255,255,255,0.5);
// `;
// const HeroBrowLine = styled.div`height:1px;width:40px;background:rgba(255,255,255,0.3);`;
// const HeroName = styled.h1`
//   font-family:var(--font-display);
//   font-size:clamp(3.5rem,10vw,9rem);
//   font-weight:900;line-height:0.9;
//   letter-spacing:-0.03em;color:white;
//   margin-bottom:0.5em;
//   em{font-style:italic;color:rgba(255,255,255,0.6);}
// `;
// const HeroBottom = styled.div`
//   position:relative;z-index:2;
//   background:linear-gradient(to top, var(--ink) 0%, transparent 100%);
//   padding:3rem 2.5rem 2.5rem;
//   max-width:1200px;margin:0 auto;width:100%;
// `;
// const HeroBottomGrid = styled.div`
//   display:grid;grid-template-columns:1fr 1fr;gap:2.5rem;
//   @media(max-width:720px){grid-template-columns:1fr;gap:1.5rem;}
// `;
// const HeroDomain = styled.p`
//   font-family:var(--font-serif);font-size:clamp(1rem,2vw,1.3rem);
//   color:rgba(255,255,255,0.7);font-style:italic;line-height:1.5;
//   margin-bottom:1.25rem;
// `;
// const HeroMetaChips = styled.div`display:flex;flex-wrap:wrap;gap:0.5rem;`;
// const MetaChip = styled.div`
//   display:flex;align-items:center;gap:0.4rem;
//   font-family:var(--font-mono);font-size:0.7rem;letter-spacing:0.04em;
//   color:rgba(255,255,255,0.55);
//   background:rgba(255,255,255,0.08);
//   border:1px solid rgba(255,255,255,0.12);
//   padding:0.4rem 0.875rem;border-radius:99px;
//   svg{width:12px;height:12px;flex-shrink:0;}
// `;
// const HeroSocials = styled.div`
//   display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.875rem;
// `;
// const HeroSocialLink = styled.a`
//   display:inline-flex;align-items:center;justify-content:center;
//   width:40px;height:40px;border-radius:50%;
//   background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
//   color:rgba(255,255,255,0.7);text-decoration:none;
//   transition:all 0.2s;
//   svg{width:15px;height:15px;}
//   &:hover{background:white;color:var(--ink);}
// `;
// const HeroResumeBtn = styled.a`
//   display:inline-flex;align-items:center;gap:0.5rem;
//   font-family:var(--font-display);font-size:0.75rem;font-weight:700;
//   letter-spacing:0.1em;text-transform:uppercase;
//   padding:0.625rem 1.375rem;
//   background:white;color:var(--ink);
//   border:2px solid white;
//   text-decoration:none;transition:all 0.2s;
//   svg{width:13px;height:13px;}
//   &:hover{background:transparent;color:white;}
// `;
// const HeroStats = styled.div`
//   display:grid;grid-template-columns:repeat(2,1fr);gap:1px;
//   background:rgba(255,255,255,0.12);
//   border:1px solid rgba(255,255,255,0.12);
// `;
// const HeroStatCell = styled.div`
//   background:rgba(0,0,0,0.4);padding:1.25rem;text-align:center;
// `;
// const HeroStatNum = styled.div`
//   font-family:var(--font-display);font-size:2.5rem;font-weight:900;
//   color:white;line-height:1;
// `;
// const HeroStatLabel = styled.div`
//   font-family:var(--font-mono);font-size:0.62rem;letter-spacing:0.14em;
//   text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:0.35rem;
// `;
// const ScrollHint = styled.div`
//   position:relative;z-index:2;
//   text-align:center;padding:2rem;
//   animation:${bobDown} 2s ease infinite;
// `;

// /* ─── ISSUE NUMBER BAND ─── */
// const IssueBand = styled.div`
//   background:var(--ink);
//   padding:1.25rem 2.5rem;
//   display:flex;align-items:center;gap:2rem;flex-wrap:wrap;
//   @media(max-width:640px){padding:1rem 1.5rem;gap:1rem;}
// `;
// const IssueNum = styled.span`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.16em;
//   text-transform:uppercase;color:rgba(255,255,255,0.4);
// `;
// const IssueTitle = styled.span`
//   font-family:var(--font-display);font-size:0.875rem;font-weight:700;
//   color:rgba(255,255,255,0.85);font-style:italic;
// `;

// /* ─── MAIN CONTENT ─── */
// const MainContent = styled.main`max-width:1100px;margin:0 auto;padding:0 2.5rem;@media(max-width:640px){padding:0 1.5rem;}`;

// /* ─── EDITORIAL SECTION ─── */
// const EditorialSection = styled.section`
//   padding:5rem 0;
//   border-bottom:1px solid var(--border);
//   animation:${fadeUp} 0.7s ease ${p=>p.$delay||'0.2s'} both;
//   opacity:0;animation-fill-mode:forwards;
//   &:last-child{border-bottom:none;}
// `;
// const EditorialHead = styled.div`
//   display:flex;align-items:baseline;gap:1.5rem;
//   margin-bottom:3.5rem;
// `;
// const EditorialIssueNum = styled.span`
//   font-family:var(--font-mono);font-size:0.7rem;letter-spacing:0.12em;
//   text-transform:uppercase;color:var(--ink-4);padding-top:0.25rem;
// `;
// const EditorialTitle = styled.h2`
//   font-family:var(--font-display);
//   font-size:clamp(2.5rem,5vw,4rem);
//   font-weight:900;font-style:italic;
//   letter-spacing:-0.03em;color:var(--ink);
//   line-height:0.95;
// `;
// const EditorialRule = styled.div`
//   flex:1;height:2px;
//   background:var(--ink);
//   align-self:center;min-width:24px;
// `;

// /* ─── SUMMARY SPREAD ─── */
// const SummarySpread = styled.section`
//   padding:5rem 0;
//   border-bottom:1px solid var(--border);
//   animation:${fadeUp} 0.7s ease 0.2s both;
//   opacity:0;animation-fill-mode:forwards;
// `;
// const SummaryGrid = styled.div`
//   display:grid;grid-template-columns:140px 1fr;gap:3rem;
//   @media(max-width:720px){grid-template-columns:1fr;gap:1.5rem;}
// `;
// const SummaryMeta = styled.div`border-top:3px double var(--ink);padding-top:1rem;`;
// const SummaryMetaLine = styled.p`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;
//   text-transform:uppercase;color:var(--ink-4);margin-bottom:0.35rem;
// `;
// const SummaryPullQuote = styled.blockquote`
//   font-family:var(--font-display);
//   font-size:clamp(1.75rem,4vw,3rem);
//   font-weight:400;font-style:italic;
//   line-height:1.3;color:var(--ink);
//   letter-spacing:-0.02em;
//   border-top:3px double var(--ink);
//   padding-top:1.5rem;
//   position:relative;
//   &::before{
//     content:'\u201C';
//     font-size:6rem;font-weight:900;line-height:1;
//     color:var(--cream-3);position:absolute;top:-2rem;left:-1rem;
//     pointer-events:none;user-select:none;
//   }
// `;

// /* ─── TIMELINE – alternating spread cards ─── */
// const SpreadList = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
// const SpreadCard = styled.div`
//   display:grid;
//   grid-template-columns:${p=>p.$alt?'1fr 120px':'120px 1fr'};
//   gap:0;border:1px solid var(--border);
//   transition:box-shadow 0.3s,transform 0.3s;
//   &:hover{box-shadow:4px 4px 0 var(--ink-5);transform:translate(-2px,-2px);}
//   @media(max-width:680px){grid-template-columns:1fr;grid-template-rows:auto auto;}
// `;
// const SpreadDate = styled.div`
//   background:var(--ink);
//   padding:2rem 1.25rem;
//   display:flex;flex-direction:column;align-items:center;justify-content:center;
//   text-align:center;order:${p=>p.$alt?'2':'1'};
//   @media(max-width:680px){order:1;flex-direction:row;gap:1rem;padding:1rem 1.5rem;}
// `;
// const SpreadDateNum = styled.div`
//   font-family:var(--font-display);font-size:2rem;font-weight:900;
//   color:white;line-height:1;
//   @media(max-width:680px){font-size:1.25rem;}
// `;
// const SpreadDateLabel = styled.div`
//   font-family:var(--font-mono);font-size:0.58rem;letter-spacing:0.1em;
//   text-transform:uppercase;color:rgba(255,255,255,0.4);margin-top:0.25rem;
//   @media(max-width:680px){margin-top:0;}
// `;
// const SpreadBody = styled.div`
//   background:var(--ivory);
//   padding:2rem 2.25rem;
//   order:${p=>p.$alt?'1':'2'};
//   @media(max-width:680px){order:2;padding:1.5rem;}
// `;
// const SpreadTitle = styled.h3`
//   font-family:var(--font-display);font-size:1.35rem;font-weight:700;
//   color:var(--ink);margin-bottom:0.3rem;line-height:1.2;
// `;
// const SpreadSub = styled.p`
//   font-family:var(--font-mono);font-size:0.75rem;letter-spacing:0.04em;
//   color:var(--red);margin-bottom:0.75rem;
// `;
// const SpreadDesc = styled.p`
//   font-family:var(--font-serif);font-size:0.9rem;color:var(--ink-3);line-height:1.75;
// `;

// /* ─── PROJECTS – editorial list ─── */
// const ProjectList = styled.div`display:flex;flex-direction:column;gap:0;`;
// const ProjectRow = styled.div`
//   display:grid;grid-template-columns:56px 1fr auto;gap:0;
//   border-bottom:1px solid var(--border);
//   &:first-child{border-top:1px solid var(--border);}
//   transition:background 0.2s;
//   &:hover{background:var(--cream-2);}
//   @media(max-width:720px){grid-template-columns:48px 1fr;grid-template-rows:auto auto;}
// `;
// const ProjectIdx = styled.div`
//   background:var(--ink);
//   display:flex;align-items:flex-start;justify-content:center;
//   padding:1.75rem 0.875rem;
//   font-family:var(--font-display);font-size:0.75rem;font-weight:900;
//   color:rgba(255,255,255,0.4);
// `;
// const ProjectMain = styled.div`padding:1.75rem 2rem 1.75rem 0;@media(max-width:720px){padding:1.5rem;}`;
// const ProjectTitle = styled.h3`
//   font-family:var(--font-display);font-size:1.15rem;font-weight:700;
//   color:var(--ink);margin-bottom:0.35rem;line-height:1.2;
// `;
// const ProjectDesc = styled.p`font-family:var(--font-serif);font-size:0.875rem;color:var(--ink-3);line-height:1.7;margin-bottom:0.875rem;`;
// const TechRow = styled.div`display:flex;flex-wrap:wrap;gap:0.4rem;`;
// const TechTag = styled.span`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.06em;
//   color:var(--ink-3);background:var(--cream-3);
//   padding:0.25rem 0.6rem;border:1px solid var(--border);
// `;
// const ProjectActions = styled.div`
//   padding:1.75rem 0;display:flex;flex-direction:column;gap:0.5rem;align-items:flex-end;justify-content:flex-start;
//   @media(max-width:720px){display:none;}
// `;
// const ProjLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;
//   color:var(--ink);text-decoration:none;
//   border:1px solid var(--border);padding:0.45rem 0.875rem;
//   transition:all 0.2s;
//   svg{width:11px;height:11px;}
//   &:hover{background:var(--ink);color:white;border-color:var(--ink);}
// `;

// /* ─── SKILLS – table layout ─── */
// const SkillsTable = styled.table`
//   width:100%;border-collapse:collapse;
// `;
// const SkillsTH = styled.th`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.14em;text-transform:uppercase;
//   color:var(--ink-3);text-align:left;
//   padding:0.75rem 1rem;border-bottom:2px solid var(--ink);
//   background:var(--cream-2);
// `;
// const SkillsTR = styled.tr`
//   border-bottom:1px solid var(--border);
//   transition:background 0.15s;
//   &:hover{background:var(--cream-2);}
// `;
// const SkillsTD = styled.td`
//   padding:1rem 1rem;vertical-align:top;
// `;
// const SkillCategory = styled.p`
//   font-family:var(--font-display);font-size:0.875rem;font-weight:700;
//   color:var(--ink);font-style:italic;
// `;
// const SkillItems = styled.div`display:flex;flex-wrap:wrap;gap:0.4rem;`;
// const SkillItem = styled.span`
//   font-family:var(--font-serif);font-size:0.825rem;color:var(--ink-2);
//   padding:0.3rem 0.75rem;background:var(--cream-2);border:1px solid var(--border);
//   transition:all 0.2s;cursor:default;
//   &:hover{background:var(--ink);color:white;border-color:var(--ink);}
// `;

// /* ─── CERTIFICATIONS ─── */
// const CertGrid = styled.div`
//   display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.5rem;
// `;
// const CertCard = styled.div`
//   border:1px solid var(--border);background:var(--ivory);
//   padding:2rem;position:relative;overflow:hidden;
//   transition:all 0.3s;
//   &::before{
//     content:attr(data-num);
//     font-family:var(--font-display);font-size:7rem;font-weight:900;
//     color:var(--cream-3);position:absolute;top:-1rem;right:1rem;
//     line-height:1;user-select:none;pointer-events:none;
//   }
//   &:hover{box-shadow:4px 4px 0 var(--ink-5);}
// `;
// const CertStarline = styled.div`
//   font-family:var(--font-mono);font-size:0.65rem;letter-spacing:0.1em;
//   color:var(--red);margin-bottom:0.75rem;
//   &::before{content:'✦ ';}
// `;
// const CertName = styled.h3`
//   font-family:var(--font-display);font-size:1.1rem;font-weight:700;
//   color:var(--ink);line-height:1.3;margin-bottom:0.4rem;
// `;
// const CertIssuer = styled.p`
//   font-family:var(--font-mono);font-size:0.72rem;letter-spacing:0.04em;
//   color:var(--ink-3);margin-bottom:0.875rem;
// `;
// const CertLink = styled.a`
//   display:inline-flex;align-items:center;gap:0.375rem;
//   font-family:var(--font-mono);font-size:0.68rem;letter-spacing:0.08em;text-transform:uppercase;
//   color:var(--ink);text-decoration:none;border-bottom:1px solid var(--border);
//   transition:all 0.2s;
//   svg{width:11px;height:11px;}
//   &:hover{border-color:var(--ink);}
// `;

// /* ─── INTERESTS ─── */
// const InterestDropcaps = styled.div`
//   columns:3;gap:1.5rem;
//   @media(max-width:720px){columns:2;}
//   @media(max-width:480px){columns:1;}
// `;
// const InterestItem = styled.div`
//   break-inside:avoid;
//   padding:0.625rem 0;
//   border-bottom:1px solid var(--border);
//   font-family:var(--font-display);font-size:1rem;font-weight:400;
//   color:var(--ink-2);font-style:italic;
//   cursor:default;transition:color 0.2s;
//   &::before{content:'→ ';color:var(--ink-5);}
//   &:hover{color:var(--ink);&::before{color:var(--red);}}
// `;

// /* ─── EMPTY ─── */
// const Empty = styled.div`
//   border:1px dashed var(--border);padding:4rem 2rem;
//   text-align:center;color:var(--ink-4);font-style:italic;
//   font-family:var(--font-serif);font-size:0.9rem;
// `;

// /* ─── LOADING ─── */
// const LoadWrap = styled.div`
//   min-height:100vh;display:flex;flex-direction:column;
//   align-items:center;justify-content:center;gap:1.5rem;background:var(--cream);
// `;
// const Spinner = styled.div`
//   width:32px;height:32px;
//   border:1.5px solid var(--border);border-top-color:var(--ink);
//   border-radius:50%;animation:${spin} 0.8s linear infinite;
// `;
// const LoadLabel = styled.p`
//   font-family:var(--font-mono);font-size:0.7rem;letter-spacing:0.16em;
//   text-transform:uppercase;color:var(--ink-4);
// `;
// const LoadBar = styled.div`
//   width:120px;height:1px;
//   background:linear-gradient(90deg,var(--cream-3) 0%,var(--ink) 50%,var(--cream-3) 100%);
//   background-size:800px;animation:${shimmer} 1.6s linear infinite;
// `;

// /* ─── ERROR ─── */
// const ErrWrap = styled.div`
//   min-height:100vh;display:flex;align-items:center;justify-content:center;
//   padding:2rem;background:var(--cream);
// `;
// const ErrBox = styled.div`
//   background:var(--ivory);border:2px solid var(--ink);
//   padding:4rem 3rem;max-width:440px;width:100%;text-align:center;
//   animation:${fadeUp} 0.5s ease both;
//   @media(max-width:480px){padding:3rem 2rem;}
// `;
// const ErrTitle = styled.h2`
//   font-family:var(--font-display);font-size:2rem;font-weight:900;font-style:italic;
//   color:var(--ink);margin:1rem 0 0.75rem;
// `;
// const ErrMsg = styled.p`
//   font-family:var(--font-serif);font-size:0.9rem;color:var(--ink-3);
//   line-height:1.7;margin-bottom:2rem;font-style:italic;
// `;
// const GoHomeBtn = styled.button`
//   display:inline-flex;align-items:center;gap:0.5rem;
//   padding:0.875rem 2rem;background:var(--ink);color:var(--cream);
//   border:2px solid var(--ink);
//   font-family:var(--font-display);font-size:0.875rem;font-weight:700;
//   cursor:pointer;transition:all 0.2s;
//   &:hover{background:transparent;color:var(--ink);}
//   svg{width:15px;height:15px;}
// `;

// /* ═══════════════════════════════════════════ */

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [showOverlay, setShowOverlay] = useState(() => {
//     return sessionStorage.getItem('overlayDismissed') === 'true' ? false : !user;
//   });
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft(prev => { if (prev <= 1) { handleClose(); return 0; } return prev - 1; });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleClose = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           try { const url = await publicService.getSignedUrl(path); if (url) urlMap[key] = url; } catch {}
//         }));
//         setImageUrls(urlMap);
//       } catch (err) { setError(err.message || 'Profile not found'); }
//       finally { setLoading(false); }
//     };
//     if (username) load();
//   }, [username]);

//   if (loading) return (
//     <><GlobalStyle /><LoadWrap><Spinner /><LoadBar /><LoadLabel>Loading edition...</LoadLabel></LoadWrap></>
//   );

//   if (error || !portfolio) return (
//     <><GlobalStyle /><ErrWrap><ErrBox>
//       <AlertCircle size={40} color="var(--red)" />
//       <ErrTitle>{error ? 'Not Found' : 'No Portfolio Yet'}</ErrTitle>
//       <ErrMsg>{error || "This edition hasn't been published yet."}</ErrMsg>
//       <GoHomeBtn onClick={() => navigate('/')}><Home size={15} /> Return to Front Page</GoHomeBtn>
//     </ErrBox></ErrWrap></>
//   );

//   const {
//     profile = {}, education = [], experience = [],
//     projects = [], skills = {}, certifications = [], interests = {}
//   } = portfolio;

//   const fullName = profile.name || 'Anonymous User';
//   const [firstName, ...rest] = fullName.split(' ');
//   const lastName = rest.join(' ') || '';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;
//   const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

//   return (
//     <>
//       <GlobalStyle />

//       {/* Overlay */}
//       <OvBg $show={showOverlay}>
//         <OvBox $closing={isClosing}>
//           <OvClose onClick={handleClose}><X /></OvClose>
//           <OvMast>
//             <OvIssueLine>Portfolio Platform — Special Edition</OvIssueLine>
//             <OvIssueTitle>Create Yours</OvIssueTitle>
//           </OvMast>
//           <OvBody>
//             <OvDesc>Join professionals who present their work with editorial elegance. Sign in or create an account today.</OvDesc>
//             <OvTimer>Closes automatically in {timeLeft}s</OvTimer>
//             <OvBtns>
//               <OvBtn $primary onClick={() => navigate('/login')}>Sign In</OvBtn>
//               <OvBtn onClick={() => navigate('/register')}>Register</OvBtn>
//             </OvBtns>
//           </OvBody>
//         </OvBox>
//       </OvBg>

//       {/* Masthead */}
//       <Masthead>
//         <MastheadTop>
//           <MastheadBtns>
//             <NavBtn onClick={() => navigate(-1)}><ChevronLeft />Back</NavBtn>
//             <NavBtn onClick={() => navigate('/')}><Home />Home</NavBtn>
//           </MastheadBtns>
//           <MastheadDate>{today}</MastheadDate>
//         </MastheadTop>
//         <MastheadTitle>
//           <Nameplate>{profile.domain || 'Professional Portfolio'}</Nameplate>
//           <MastheadWordmark>{fullName}</MastheadWordmark>
//         </MastheadTitle>
//       </Masthead>

//       {/* ── HERO ── */}
//       <HeroSection>
//         {imageUrls.profilePhoto
//           ? <HeroBgImg src={imageUrls.profilePhoto} alt={fullName} />
//           : <HeroBgPlaceholder />}

//         <HeroContent>
//           <HeroEyebrow>
//             <HeroBrowLine/>
//             <HeroBrow>{profile.domain || 'Professional Portfolio'}</HeroBrow>
//             <HeroBrowLine/>
//           </HeroEyebrow>
//           <HeroName>
//             {firstName}<br /><em>{lastName || firstName}</em>
//           </HeroName>
//         </HeroContent>

//         <HeroBottom>
//           <HeroBottomGrid>
//             <div>
//               <HeroDomain>
//                 {profile.domain || 'Professional'} · {profile.location || 'Location not set'}
//               </HeroDomain>
//               {(profile.email || profile.phone || profile.location) && (
//                 <HeroMetaChips>
//                   {profile.email    && <MetaChip><Mail /> {profile.email}</MetaChip>}
//                   {profile.phone    && <MetaChip><Phone /> {profile.phone}</MetaChip>}
//                   {profile.location && <MetaChip><MapPin /> {profile.location}</MetaChip>}
//                 </HeroMetaChips>
//               )}
//               {(socialLinks.length > 0 || cvLink) && (
//                 <HeroSocials style={{marginTop:'1.25rem'}}>
//                   {socialLinks.map((item) => {
//                     const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                     const Icon = meta.icon;
//                     return (
//                       <HeroSocialLink key={item._id||item.id} href={buildSocialHref(item)} target="_blank" rel="noopener noreferrer" title={item.name||meta.label}>
//                         <Icon />
//                       </HeroSocialLink>
//                     );
//                   })}
//                   {cvLink && <HeroResumeBtn href={cvLink} target="_blank" rel="noopener noreferrer"><FileText /> Resume</HeroResumeBtn>}
//                 </HeroSocials>
//               )}
//             </div>
//             <HeroStats>
//               <HeroStatCell><HeroStatNum>{education.length||'—'}</HeroStatNum><HeroStatLabel>Education</HeroStatLabel></HeroStatCell>
//               <HeroStatCell><HeroStatNum>{experience.length||'—'}</HeroStatNum><HeroStatLabel>Roles</HeroStatLabel></HeroStatCell>
//               <HeroStatCell><HeroStatNum>{projects.length||'—'}</HeroStatNum><HeroStatLabel>Projects</HeroStatLabel></HeroStatCell>
//               <HeroStatCell><HeroStatNum>{certifications.length||'—'}</HeroStatNum><HeroStatLabel>Certs</HeroStatLabel></HeroStatCell>
//             </HeroStats>
//           </HeroBottomGrid>
//         </HeroBottom>

//         <ScrollHint><ChevronDown size={24} color="rgba(255,255,255,0.3)"/></ScrollHint>
//       </HeroSection>

//       {/* Issue band */}
//       <IssueBand>
//         <IssueNum>Vol. I, No. {education.length + experience.length + projects.length}</IssueNum>
//         <IssueTitle>{profile.domain || 'Professional Portfolio'} — {fullName}</IssueTitle>
//       </IssueBand>

//       <MainContent>

//         {/* Summary */}
//         {profile.summary && (
//           <SummarySpread>
//             <SummaryGrid>
//               <SummaryMeta>
//                 <SummaryMetaLine>Statement</SummaryMetaLine>
//                 <SummaryMetaLine>from the</SummaryMetaLine>
//                 <SummaryMetaLine>Author</SummaryMetaLine>
//               </SummaryMeta>
//               <SummaryPullQuote>{profile.summary}</SummaryPullQuote>
//             </SummaryGrid>
//           </SummarySpread>
//         )}

//         {/* Education */}
//         <EditorialSection $delay="0.25s">
//           <EditorialHead>
//             <EditorialIssueNum>01</EditorialIssueNum>
//             <EditorialTitle>Education</EditorialTitle>
//             <EditorialRule />
//           </EditorialHead>
//           {education.length > 0 ? (
//             <SpreadList>
//               {education.map((edu, i) => {
//                 const dur = edu.duration ? (edu.duration === '1' ? '1 yr' : `${edu.duration} yrs`) : 'N/A';
//                 const score = edu.cgpa ? `CGPA ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : null;
//                 return (
//                   <SpreadCard key={edu._id||i} $alt={i%2===1}>
//                     <SpreadDate $alt={i%2===1}>
//                       <SpreadDateNum>{dur.split(' ')[0]}</SpreadDateNum>
//                       <SpreadDateLabel>{dur.includes('yr')?'years':'N/A'}</SpreadDateLabel>
//                     </SpreadDate>
//                     <SpreadBody $alt={i%2===1}>
//                       <SpreadTitle>{na(edu.institution)}</SpreadTitle>
//                       <SpreadSub>{na(edu.course)}</SpreadSub>
//                       {score && <SpreadDesc>{score}</SpreadDesc>}
//                     </SpreadBody>
//                   </SpreadCard>
//                 );
//               })}
//             </SpreadList>
//           ) : <Empty>No education details published yet.</Empty>}
//         </EditorialSection>

//         {/* Experience */}
//         <EditorialSection $delay="0.3s">
//           <EditorialHead>
//             <EditorialIssueNum>02</EditorialIssueNum>
//             <EditorialTitle>Experience</EditorialTitle>
//             <EditorialRule />
//           </EditorialHead>
//           {experience.length > 0 ? (
//             <SpreadList>
//               {experience.map((exp, i) => (
//                 <SpreadCard key={exp._id||i} $alt={i%2===1}>
//                   <SpreadDate $alt={i%2===1}>
//                     <SpreadDateNum style={{fontSize:'0.9rem'}}>{exp.duration||'N/A'}</SpreadDateNum>
//                     <SpreadDateLabel>tenure</SpreadDateLabel>
//                   </SpreadDate>
//                   <SpreadBody $alt={i%2===1}>
//                     <SpreadTitle>{na(exp.role)}</SpreadTitle>
//                     <SpreadSub>{na(exp.company)}{exp.type ? ` · ${exp.type}` : ''}</SpreadSub>
//                     {exp.description && <SpreadDesc>{exp.description}</SpreadDesc>}
//                   </SpreadBody>
//                 </SpreadCard>
//               ))}
//             </SpreadList>
//           ) : <Empty>No experience published yet.</Empty>}
//         </EditorialSection>

//         {/* Projects */}
//         <EditorialSection $delay="0.35s">
//           <EditorialHead>
//             <EditorialIssueNum>03</EditorialIssueNum>
//             <EditorialTitle>Projects</EditorialTitle>
//             <EditorialRule />
//           </EditorialHead>
//           {projects.length > 0 ? (
//             <ProjectList>
//               {projects.map((proj, i) => (
//                 <ProjectRow key={proj._id||i}>
//                   <ProjectIdx>{String(i+1).padStart(2,'0')}</ProjectIdx>
//                   <ProjectMain>
//                     <ProjectTitle>{na(proj.title)}</ProjectTitle>
//                     {proj.description && <ProjectDesc>{proj.description}</ProjectDesc>}
//                     {proj.tech?.length > 0 && <TechRow>{proj.tech.map((t,j)=><TechTag key={j}>{t}</TechTag>)}</TechRow>}
//                     {/* Mobile links */}
//                     {(proj.demo||proj.repo) && (
//                       <div style={{display:'flex',gap:'0.5rem',marginTop:'0.75rem',flexWrap:'wrap'}}>
//                         {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLink>}
//                         {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLink>}
//                       </div>
//                     )}
//                   </ProjectMain>
//                   <ProjectActions>
//                     {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLink>}
//                     {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLink>}
//                   </ProjectActions>
//                 </ProjectRow>
//               ))}
//             </ProjectList>
//           ) : <Empty>No projects published yet.</Empty>}
//         </EditorialSection>

//         {/* Skills */}
//         <EditorialSection $delay="0.4s">
//           <EditorialHead>
//             <EditorialIssueNum>04</EditorialIssueNum>
//             <EditorialTitle>Skills</EditorialTitle>
//             <EditorialRule />
//           </EditorialHead>
//           {skillCats.length > 0 ? (
//             <SkillsTable>
//               <thead><tr>
//                 <SkillsTH style={{width:'200px'}}>Category</SkillsTH>
//                 <SkillsTH>Technologies</SkillsTH>
//               </tr></thead>
//               <tbody>
//                 {skillCats.map((cat, idx) => (
//                   <SkillsTR key={cat._id||idx}>
//                     <SkillsTD><SkillCategory>{cat.category}</SkillCategory></SkillsTD>
//                     <SkillsTD><SkillItems>{cat.items.map((item,i)=><SkillItem key={i}>{item}</SkillItem>)}</SkillItems></SkillsTD>
//                   </SkillsTR>
//                 ))}
//               </tbody>
//             </SkillsTable>
//           ) : <Empty>No skills published yet.</Empty>}
//         </EditorialSection>

//         {/* Certifications */}
//         <EditorialSection $delay="0.45s">
//           <EditorialHead>
//             <EditorialIssueNum>05</EditorialIssueNum>
//             <EditorialTitle>Certifications</EditorialTitle>
//             <EditorialRule />
//           </EditorialHead>
//           {certifications.length > 0 ? (
//             <CertGrid>
//               {certifications.map((cert, i) => (
//                 <CertCard key={cert._id||i} data-num={String(i+1).padStart(2,'0')}>
//                   <CertStarline>Credential</CertStarline>
//                   <CertName>{na(cert.name)}</CertName>
//                   <CertIssuer>Issued by {na(cert.issuer)}</CertIssuer>
//                   {cert.link && <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">View credential <ArrowUpRight /></CertLink>}
//                 </CertCard>
//               ))}
//             </CertGrid>
//           ) : <Empty>No certifications published yet.</Empty>}
//         </EditorialSection>

//         {/* Interests */}
//         {interests?.interests?.length > 0 && (
//           <EditorialSection $delay="0.5s">
//             <EditorialHead>
//               <EditorialIssueNum>06</EditorialIssueNum>
//               <EditorialTitle>Interests</EditorialTitle>
//               <EditorialRule />
//             </EditorialHead>
//             <InterestDropcaps>
//               {interests.interests.map((item,i)=><InterestItem key={i}>{item}</InterestItem>)}
//             </InterestDropcaps>
//           </EditorialSection>
//         )}

//       </MainContent>
//     </>
//   );
// };

// export default PublicProfilePage;










// ============================ Templete 7 ========================= //


// ===================== Template 7: Cinematic Full-Screen Panels ===================== //
// Concept: Each major section is a full-screen horizontal "chapter" with bold oversized
// chapter numbers. The hero is a typographic splash — name fills 80% of the screen.
// Navigation is a floating pill on the right edge. Scrolling reveals new chapters.
// Strict two-color palette: near-black + one electric accent (indigo).

// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Globe,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// const SOCIAL_ICON_MAP = {
//   Github: { icon: Github, label: 'GitHub' },
//   Linkedin: { icon: Linkedin, label: 'LinkedIn' },
//   Twitter: { icon: Twitter, label: 'Twitter / X' },
//   Instagram: { icon: Instagram, label: 'Instagram' },
//   Youtube: { icon: Youtube, label: 'YouTube' },
//   Code2: { icon: Code2, label: 'LeetCode' },
//   Trophy: { icon: Trophy, label: 'Codeforces' },
//   Twitch: { icon: Twitch, label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send: { icon: Send, label: 'Telegram' },
//   Rss: { icon: Rss, label: 'Blog' },
//   Globe: { icon: Globe, label: 'Website' },
//   Mail: { icon: Mail, label: 'Email' },
//   Phone: { icon: Phone, label: 'Phone' },
//   AtSign: { icon: AtSign, label: 'Other' },
//   ExternalLink: { icon: ExternalLink, label: 'Link' },
// };

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   :root {
//     --black:   #090909;
//     --near:    #111111;
//     --carbon:  #1a1a1a;
//     --panel:   #202020;
//     --border:  rgba(255,255,255,0.08);
//     --border2: rgba(255,255,255,0.14);
//     --text:    #f0f0f0;
//     --text2:   #888;
//     --text3:   #555;
//     --accent:  #5b4eff;
//     --accent2: #7b6fff;
//     --accent3: rgba(91,78,255,0.12);
//     --accent4: rgba(91,78,255,0.06);
//     --font-d: 'Space Grotesk', system-ui, sans-serif;
//     --font-m: 'Space Mono', monospace;
//   }
//   html { scroll-behavior: smooth; overflow-x: hidden; }
//   body { background: var(--black); font-family: var(--font-d); color: var(--text); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
//   img { display: block; max-width: 100%; }
//   ::selection { background: var(--accent); color: white; }
//   ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: var(--black); } ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 2px; }
// `;

// const fadeUp = keyframes`from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}`;
// const slideRight = keyframes`from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}`;
// const slideIn = keyframes`from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}`;
// const spin = keyframes`to{transform:rotate(360deg)}`;
// const shimmer = keyframes`0%{background-position:-600px 0}100%{background-position:600px 0}`;
// const progressFill = keyframes`from{width:0}to{width:var(--w)}`;
// const blink = keyframes`0%,100%{opacity:1}50%{opacity:0}`;

// /* ── OVERLAY ── */
// const OvBg = styled.div`
//   position:fixed;inset:0;background:rgba(0,0,0,${p=>p.$s?'.88':'0'});
//   backdrop-filter:${p=>p.$s?'blur(12px)':'none'};
//   display:flex;align-items:center;justify-content:center;
//   z-index:${p=>p.$s?'9999':'-1'};padding:1rem;
//   pointer-events:${p=>p.$s?'auto':'none'};transition:all 0.35s;
// `;
// const OvBox = styled.div`
//   background:var(--carbon);border:1px solid var(--border2);
//   border-radius:16px;padding:2.5rem 2.25rem;max-width:420px;width:100%;
//   text-align:center;position:relative;
//   animation:${p=>p.$c?'none':slideIn} 0.4s cubic-bezier(0.22,1,0.36,1) both;
//   box-shadow:0 0 60px rgba(91,78,255,0.15),0 0 0 1px rgba(91,78,255,0.1);
// `;
// const OvClose = styled.button`
//   position:absolute;top:1rem;right:1rem;background:var(--panel);border:1px solid var(--border);
//   width:34px;height:34px;border-radius:8px;cursor:pointer;
//   display:flex;align-items:center;justify-content:center;color:var(--text2);transition:all 0.2s;
//   &:hover{color:var(--accent);border-color:var(--accent);}svg{width:15px;height:15px;}
// `;
// const OvDot = styled.div`
//   width:56px;height:56px;border-radius:50%;margin:0 auto 1.5rem;
//   background:var(--accent3);border:1px solid var(--accent);
//   display:flex;align-items:center;justify-content:center;
//   svg{width:24px;height:24px;color:var(--accent);}
// `;
// const OvTitle = styled.h2`font-family:var(--font-d);font-size:1.625rem;font-weight:700;color:var(--text);margin-bottom:.6rem;line-height:1.15;`;
// const OvDesc = styled.p`font-size:.875rem;color:var(--text2);line-height:1.7;margin-bottom:.75rem;`;
// const OvTimer = styled.p`font-family:var(--font-m);font-size:.68rem;letter-spacing:.1em;color:var(--text3);margin-bottom:1.75rem;`;
// const OvBtns = styled.div`display:flex;gap:.625rem;@media(max-width:400px){flex-direction:column;}`;
// const OvBtn = styled.button`
//   flex:1;padding:.75rem;border-radius:8px;
//   font-family:var(--font-d);font-size:.85rem;font-weight:600;cursor:pointer;transition:all .2s;
//   ${p=>p.$p?`background:var(--accent);color:white;border:1px solid var(--accent);
//     &:hover{background:var(--accent2);}`:`
//     background:transparent;color:var(--text2);border:1px solid var(--border2);
//     &:hover{color:var(--text);border-color:rgba(255,255,255,0.25);}`}
// `;

// /* ── TOP BAR ── */
// const TopBar = styled.div`
//   position:fixed;top:0;left:0;right:0;z-index:200;
//   padding:.875rem 2rem;display:flex;align-items:center;justify-content:space-between;
//   background:rgba(9,9,9,0.85);backdrop-filter:blur(16px);
//   border-bottom:1px solid var(--border);
//   @media(max-width:640px){padding:.75rem 1.25rem;}
// `;
// const TopBtns = styled.div`display:flex;gap:.25rem;`;
// const TopBtn = styled.button`
//   display:inline-flex;align-items:center;gap:.375rem;
//   background:transparent;border:1px solid transparent;padding:.375rem .75rem;
//   border-radius:6px;font-family:var(--font-d);font-size:.72rem;font-weight:500;
//   letter-spacing:.04em;color:var(--text2);cursor:pointer;transition:all .2s;
//   svg{width:12px;height:12px;}
//   &:hover{color:var(--text);border-color:var(--border2);}
// `;
// const Wordmark = styled.div`
//   font-family:var(--font-m);font-size:.7rem;letter-spacing:.14em;
//   text-transform:uppercase;color:var(--text3);
// `;

// /* ── FLOATING CHAPTER NAV ── */
// const ChapterNav = styled.div`
//   position:fixed;right:1.5rem;top:50%;transform:translateY(-50%);
//   z-index:100;display:flex;flex-direction:column;gap:.5rem;
//   @media(max-width:900px){display:none;}
// `;
// const ChapterDot = styled.button`
//   width:${p=>p.$a?'28px':'8px'};height:8px;
//   border-radius:4px;border:none;cursor:pointer;transition:all .35s cubic-bezier(0.34,1.56,0.64,1);
//   background:${p=>p.$a?'var(--accent)':'var(--border2)'};
//   &:hover{background:var(--accent2);width:20px;}
//   title{display:none;}
// `;

// /* ── PAGE SHELL ── */
// const Page = styled.div`min-height:100vh;background:var(--black);`;

// /* ── HERO PANEL ── */
// const HeroPanel = styled.section`
//   min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;
//   padding:7rem 2.5rem 4rem;position:relative;overflow:hidden;
//   @media(max-width:640px){padding:6rem 1.5rem 3rem;}
// `;
// const HeroBgPhoto = styled.img`
//   position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
//   object-position:center top;opacity:.15;filter:grayscale(80%);
// `;
// const HeroBgGrad = styled.div`
//   position:absolute;inset:0;
//   background:linear-gradient(180deg, transparent 0%, rgba(9,9,9,0.6) 50%, var(--black) 100%);
//   z-index:1;
// `;
// const HeroNoBg = styled.div`position:absolute;inset:0;background:var(--carbon);`;
// const HeroCross = styled.div`
//   position:absolute;inset:0;z-index:0;
//   background-image:linear-gradient(var(--border) 1px,transparent 1px),linear-gradient(90deg,var(--border) 1px,transparent 1px);
//   background-size:60px 60px;opacity:.4;
// `;
// const HeroInner = styled.div`
//   position:relative;z-index:2;max-width:1200px;margin:0 auto;width:100%;
// `;
// const HeroChip = styled.div`
//   display:inline-flex;align-items:center;gap:.5rem;
//   font-family:var(--font-m);font-size:.65rem;letter-spacing:.2em;text-transform:uppercase;
//   color:var(--accent);background:var(--accent3);
//   border:1px solid rgba(91,78,255,0.25);
//   padding:.35rem .875rem;border-radius:99px;margin-bottom:1.75rem;
// `;
// const HeroChipDot = styled.span`width:5px;height:5px;border-radius:50%;background:var(--accent);animation:${blink} 2s step-end infinite;`;
// const HeroName = styled.h1`
//   font-family:var(--font-d);
//   font-size:clamp(3.5rem,9vw,9rem);
//   font-weight:700;line-height:.92;
//   letter-spacing:-0.04em;color:var(--text);
//   margin-bottom:.5em;
//   span{color:var(--accent);}
// `;
// const HeroFooter = styled.div`
//   display:grid;grid-template-columns:1fr 1fr;gap:2rem;margin-top:2.5rem;
//   @media(max-width:640px){grid-template-columns:1fr;gap:1.5rem;}
// `;
// const HeroDesc = styled.p`font-size:clamp(.9rem,1.5vw,1.1rem);color:var(--text2);line-height:1.75;font-weight:300;`;
// const HeroMeta = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;`;
// const HeroMetaItem = styled.div`
//   display:flex;align-items:center;gap:.4rem;
//   font-size:.775rem;color:var(--text2);
//   background:var(--panel);border:1px solid var(--border);
//   padding:.375rem .75rem;border-radius:6px;
//   svg{width:12px;height:12px;color:var(--accent);flex-shrink:0;}
// `;
// const HeroSocials = styled.div`display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;margin-top:1rem;`;
// const HeroSocial = styled.a`
//   display:inline-flex;align-items:center;justify-content:center;
//   width:38px;height:38px;border-radius:8px;
//   background:var(--panel);border:1px solid var(--border);
//   color:var(--text2);text-decoration:none;transition:all .2s;
//   svg{width:15px;height:15px;}
//   &:hover{background:var(--accent3);border-color:var(--accent);color:var(--accent);}
// `;
// const HeroResume = styled.a`
//   display:inline-flex;align-items:center;gap:.5rem;
//   font-family:var(--font-d);font-size:.75rem;font-weight:600;letter-spacing:.06em;
//   text-transform:uppercase;padding:.55rem 1.25rem;
//   background:var(--accent);color:white;border:1px solid var(--accent);
//   border-radius:8px;text-decoration:none;transition:all .2s;
//   svg{width:13px;height:13px;}
//   &:hover{background:var(--accent2);}
// `;
// const HeroStats = styled.div`
//   display:flex;gap:2rem;flex-wrap:wrap;align-self:flex-end;justify-content:flex-end;
//   @media(max-width:640px){justify-content:flex-start;}
// `;
// const HeroStatItem = styled.div`text-align:right;@media(max-width:640px){text-align:left;}`;
// const HeroStatNum = styled.div`font-size:3rem;font-weight:700;color:var(--text);line-height:1;`;
// const HeroStatLabel = styled.div`font-family:var(--font-m);font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--text3);margin-top:.25rem;`;

// /* ── CHAPTER PANEL (reusable) ── */
// const ChapterPanel = styled.section`
//   min-height:100vh;display:flex;align-items:center;
//   padding:6rem 2.5rem;position:relative;overflow:hidden;
//   background:${p=>p.$alt?'var(--carbon)':'var(--black)'};
//   @media(max-width:640px){padding:4rem 1.5rem;min-height:auto;}
// `;
// const ChapterWrap = styled.div`max-width:1200px;margin:0 auto;width:100%;`;
// const ChapterNumBg = styled.div`
//   position:absolute;right:-1rem;top:50%;transform:translateY(-50%);
//   font-family:var(--font-d);font-size:clamp(12rem,25vw,22rem);
//   font-weight:700;color:rgba(255,255,255,0.025);
//   line-height:1;user-select:none;pointer-events:none;
//   @media(max-width:640px){font-size:8rem;right:-0.5rem;}
// `;
// const ChapterHead = styled.div`margin-bottom:3.5rem;`;
// const ChapterTag = styled.div`
//   font-family:var(--font-m);font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;
//   color:var(--accent);margin-bottom:.875rem;
//   display:flex;align-items:center;gap:.625rem;
//   &::before{content:'';width:24px;height:1px;background:var(--accent);}
// `;
// const ChapterTitle = styled.h2`
//   font-family:var(--font-d);
//   font-size:clamp(2rem,5vw,4rem);
//   font-weight:700;letter-spacing:-0.03em;color:var(--text);line-height:1;
// `;

// /* ── EDUCATION / EXPERIENCE: stacked large cards ── */
// const LargeCardList = styled.div`display:flex;flex-direction:column;gap:1px;`;
// const LargeCard = styled.div`
//   display:grid;grid-template-columns:200px 1fr;
//   background:var(--near);border:1px solid var(--border);
//   transition:border-color .25s,background .25s;
//   &:hover{border-color:var(--border2);background:var(--panel);}
//   @media(max-width:720px){grid-template-columns:1fr;}
// `;
// const LargeCardSide = styled.div`
//   padding:2.25rem 2rem;
//   border-right:1px solid var(--border);
//   display:flex;flex-direction:column;justify-content:center;
//   background:var(--carbon);
//   @media(max-width:720px){border-right:none;border-bottom:1px solid var(--border);padding:1.5rem;}
// `;
// const LargeCardPeriod = styled.div`
//   font-family:var(--font-m);font-size:.68rem;letter-spacing:.1em;
//   color:var(--accent);margin-bottom:.5rem;
// `;
// const LargeCardType = styled.div`
//   font-size:.72rem;color:var(--text3);letter-spacing:.06em;text-transform:uppercase;
// `;
// const LargeCardBody = styled.div`padding:2.25rem 2rem;@media(max-width:720px){padding:1.5rem;}`;
// const LargeCardTitle = styled.h3`
//   font-size:1.25rem;font-weight:700;color:var(--text);margin-bottom:.3rem;letter-spacing:-.02em;
// `;
// const LargeCardSub = styled.p`font-size:.875rem;color:var(--accent2);font-weight:500;margin-bottom:.75rem;`;
// const LargeCardDesc = styled.p`font-size:.875rem;color:var(--text2);line-height:1.75;`;

// /* ── PROJECTS: asymmetric tiles ── */
// const ProjectsTiles = styled.div`
//   display:grid;
//   grid-template-columns:repeat(12,1fr);
//   gap:1px;
//   @media(max-width:900px){grid-template-columns:1fr 1fr;}
//   @media(max-width:540px){grid-template-columns:1fr;}
// `;
// const ProjectTile = styled.div`
//   background:var(--near);border:1px solid var(--border);
//   padding:2rem;display:flex;flex-direction:column;gap:.875rem;
//   transition:border-color .25s,background .25s;position:relative;overflow:hidden;
//   grid-column:${p=>p.$span};
//   &:hover{border-color:rgba(91,78,255,0.3);background:var(--panel);}
//   @media(max-width:900px){grid-column:span 1!important;}
//   @media(max-width:540px){grid-column:span 1!important;}
// `;
// const ProjectTileNum = styled.div`
//   font-family:var(--font-m);font-size:.6rem;letter-spacing:.14em;
//   color:var(--text3);margin-bottom:.25rem;
// `;
// const ProjectTileTitle = styled.h3`font-size:1.1rem;font-weight:700;color:var(--text);line-height:1.3;letter-spacing:-.02em;`;
// const ProjectTileDesc = styled.p`font-size:.85rem;color:var(--text2);line-height:1.7;flex:1;`;
// const TechRow = styled.div`display:flex;flex-wrap:wrap;gap:.35rem;`;
// const TechTag = styled.span`
//   font-family:var(--font-m);font-size:.6rem;letter-spacing:.08em;text-transform:uppercase;
//   color:var(--accent);background:var(--accent4);border:1px solid rgba(91,78,255,0.2);
//   padding:.2rem .55rem;border-radius:4px;
// `;
// const ProjLinks = styled.div`display:flex;gap:.4rem;`;
// const ProjLink = styled.a`
//   display:inline-flex;align-items:center;gap:.35rem;
//   font-size:.72rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
//   color:var(--text2);background:var(--carbon);border:1px solid var(--border);
//   padding:.4rem .75rem;border-radius:6px;text-decoration:none;transition:all .2s;
//   svg{width:11px;height:11px;}
//   &:hover{color:var(--accent);border-color:var(--accent);}
// `;
// const TILE_SPANS = ['span 5','span 7','span 7','span 5','span 4','span 4','span 4'];

// /* ── SKILLS: category panels ── */
// const SkillsColumns = styled.div`
//   display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1px;
// `;
// const SkillCol = styled.div`
//   background:var(--near);border:1px solid var(--border);
//   padding:1.75rem 2rem;transition:background .2s;
//   &:hover{background:var(--panel);}
// `;
// const SkillColHead = styled.div`
//   font-family:var(--font-m);font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;
//   color:var(--accent);margin-bottom:1.25rem;padding-bottom:.875rem;
//   border-bottom:1px solid var(--border);
// `;
// const SkillList = styled.div`display:flex;flex-direction:column;gap:.375rem;`;
// const SkillRow = styled.div`
//   display:flex;align-items:center;justify-content:space-between;
//   padding:.5rem .625rem;background:var(--carbon);border-radius:5px;
//   transition:background .15s;cursor:default;
//   &:hover{background:var(--accent4);}
// `;
// const SkillName = styled.span`font-size:.825rem;color:var(--text2);`;
// const SkillDot = styled.div`width:5px;height:5px;border-radius:50%;background:var(--accent);opacity:.7;flex-shrink:0;`;

// /* ── CERTIFICATIONS ── */
// const CertGrid = styled.div`display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1px;`;
// const CertCard = styled.div`
//   background:var(--near);border:1px solid var(--border);
//   padding:1.875rem 2rem;position:relative;overflow:hidden;
//   transition:border-color .25s,background .25s;
//   &::before{content:'';position:absolute;top:0;left:0;width:3px;height:100%;background:var(--accent);opacity:0;transition:opacity .25s;}
//   &:hover{border-color:var(--border2);background:var(--panel);&::before{opacity:1;}}
// `;
// const CertName = styled.h3`font-size:1rem;font-weight:600;color:var(--text);margin-bottom:.35rem;line-height:1.35;`;
// const CertIssuer = styled.p`font-size:.8rem;color:var(--accent2);font-weight:500;margin-bottom:.875rem;`;
// const CertLink = styled.a`
//   display:inline-flex;align-items:center;gap:.35rem;
//   font-family:var(--font-m);font-size:.65rem;letter-spacing:.08em;text-transform:uppercase;
//   color:var(--text3);text-decoration:none;transition:color .2s,gap .2s;
//   svg{width:11px;height:11px;}
//   &:hover{color:var(--accent);gap:.55rem;}
// `;

// /* ── INTERESTS ── */
// const InterestFlow = styled.div`display:flex;flex-wrap:wrap;gap:.75rem;`;
// const InterestPill = styled.span`
//   font-size:.9rem;font-weight:500;color:var(--text2);
//   background:var(--panel);border:1px solid var(--border);
//   padding:.55rem 1.25rem;border-radius:99px;cursor:default;
//   transition:all .25s cubic-bezier(0.34,1.56,0.64,1);
//   &:hover{background:var(--accent3);border-color:var(--accent);color:var(--accent);transform:translateY(-2px);}
// `;

// /* ── EMPTY ── */
// const Empty = styled.div`
//   border:1px dashed var(--border);padding:3.5rem 2rem;
//   display:flex;flex-direction:column;align-items:center;gap:.625rem;
//   color:var(--text3);font-size:.85rem;text-align:center;
//   svg{width:2rem;height:2rem;opacity:.2;}
// `;

// /* ── LOADING ── */
// const LoadWrap = styled.div`min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;background:var(--black);`;
// const Spinner = styled.div`width:32px;height:32px;border:1.5px solid var(--border2);border-top-color:var(--accent);border-radius:50%;animation:${spin} .75s linear infinite;`;
// const LoadBar = styled.div`width:100px;height:1px;background:linear-gradient(90deg,var(--near) 0%,var(--accent) 50%,var(--near) 100%);background-size:600px;animation:${shimmer} 1.5s linear infinite;`;
// const LoadLbl = styled.p`font-family:var(--font-m);font-size:.65rem;letter-spacing:.18em;text-transform:uppercase;color:var(--text3);`;

// /* ── ERROR ── */
// const ErrWrap = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:var(--black);`;
// const ErrBox = styled.div`background:var(--carbon);border:1px solid var(--border2);border-radius:16px;padding:3.5rem 3rem;max-width:420px;width:100%;text-align:center;animation:${fadeUp} .5s ease both;`;
// const ErrTitle = styled.h2`font-size:1.5rem;font-weight:700;color:var(--text);margin:1rem 0 .75rem;`;
// const ErrMsg = styled.p`font-size:.875rem;color:var(--text2);line-height:1.7;margin-bottom:2rem;`;
// const ErrBtn = styled.button`display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 2rem;background:var(--accent);color:white;border:none;border-radius:8px;font-family:var(--font-d);font-size:.875rem;font-weight:600;cursor:pointer;transition:all .2s;&:hover{background:var(--accent2);}svg{width:15px;height:15px;}`;

// const CHAPTERS = ['hero','education','experience','projects','skills','certifications','interests'];

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [activeChapter, setActiveChapter] = useState(0);
//   const [showOverlay, setShowOverlay] = useState(() => sessionStorage.getItem('overlayDismissed') === 'true' ? false : !user);
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);
//   const sectionRefs = useRef({});

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft(p => { if (p <= 1) { handleClose(); return 0; } return p - 1; });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleClose = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   useEffect(() => {
//     const obs = new IntersectionObserver((entries) => {
//       entries.forEach(e => {
//         if (e.isIntersecting) {
//           const idx = CHAPTERS.indexOf(e.target.dataset.chapter);
//           if (idx !== -1) setActiveChapter(idx);
//         }
//       });
//     }, { threshold: 0.4 });
//     Object.values(sectionRefs.current).forEach(r => r && obs.observe(r));
//     return () => obs.disconnect();
//   }, [portfolio]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           try { const url = await publicService.getSignedUrl(path); if (url) urlMap[key] = url; } catch {}
//         }));
//         setImageUrls(urlMap);
//       } catch (err) { setError(err.message || 'Profile not found'); }
//       finally { setLoading(false); }
//     };
//     if (username) load();
//   }, [username]);

//   const scrollTo = (id) => {
//     sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   };

//   if (loading) return (<><GlobalStyle /><LoadWrap><Spinner /><LoadBar /><LoadLbl>Loading...</LoadLbl></LoadWrap></>);
//   if (error || !portfolio) return (
//     <><GlobalStyle /><ErrWrap><ErrBox>
//       <AlertCircle size={36} color="var(--accent)" />
//       <ErrTitle>{error ? 'Not Found' : 'No Portfolio'}</ErrTitle>
//       <ErrMsg>{error || "This profile hasn't been set up yet."}</ErrMsg>
//       <ErrBtn onClick={() => navigate('/')}><Home size={15} /> Go Home</ErrBtn>
//     </ErrBox></ErrWrap></>
//   );

//   const { profile = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], interests = {} } = portfolio;
//   const fullName = profile.name || 'Anonymous';
//   const [firstName, ...rest] = fullName.split(' ');
//   const lastName = rest.join(' ') || '';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;
//   const activeSections = ['hero', ...(education.length?['education']:[]), ...(experience.length?['experience']:[]), ...(projects.length?['projects']:[]), ...(skillCats.length?['skills']:[]), ...(certifications.length?['certifications']:[]), ...(interests?.interests?.length?['interests']:[])];

//   return (
//     <>
//       <GlobalStyle />
//       <OvBg $s={showOverlay}>
//         <OvBox $c={isClosing}>
//           <OvClose onClick={handleClose}><X /></OvClose>
//           <OvDot><User /></OvDot>
//           <OvTitle>Build Your Profile</OvTitle>
//           <OvDesc>Create a professional portfolio and share it with the world.</OvDesc>
//           <OvTimer>Auto-closes in {timeLeft}s</OvTimer>
//           <OvBtns>
//             <OvBtn $p onClick={() => navigate('/login')}>Sign In</OvBtn>
//             <OvBtn onClick={() => navigate('/register')}>Register</OvBtn>
//           </OvBtns>
//         </OvBox>
//       </OvBg>

//       <TopBar>
//         <TopBtns>
//           <TopBtn onClick={() => navigate(-1)}><ChevronLeft />Back</TopBtn>
//           <TopBtn onClick={() => navigate('/')}><Home />Home</TopBtn>
//         </TopBtns>
//         <Wordmark>{firstName.toLowerCase()}.portfolio</Wordmark>
//       </TopBar>

//       <ChapterNav>
//         {activeSections.map((s, i) => (
//           <ChapterDot key={s} $a={activeChapter === CHAPTERS.indexOf(s)} onClick={() => scrollTo(s)} title={s} />
//         ))}
//       </ChapterNav>

//       <Page>
//         {/* HERO */}
//         <HeroPanel data-chapter="hero" ref={r => sectionRefs.current['hero'] = r} id="section-hero">
//           {imageUrls.profilePhoto ? <HeroBgPhoto src={imageUrls.profilePhoto} alt={fullName} /> : <HeroNoBg />}
//           {imageUrls.profilePhoto && <HeroBgGrad />}
//           {!imageUrls.profilePhoto && <HeroCross />}
//           <HeroInner>
//             <HeroChip><HeroChipDot />{profile.domain || 'Professional Portfolio'}</HeroChip>
//             <HeroName>{firstName} <span>{lastName}</span></HeroName>
//             <HeroFooter>
//               <div>
//                 {profile.summary && <HeroDesc>{profile.summary}</HeroDesc>}
//                 {(profile.email || profile.phone || profile.location) && (
//                   <HeroMeta style={{marginTop: profile.summary ? '1.25rem' : 0}}>
//                     {profile.email && <HeroMetaItem><Mail />{profile.email}</HeroMetaItem>}
//                     {profile.phone && <HeroMetaItem><Phone />{profile.phone}</HeroMetaItem>}
//                     {profile.location && <HeroMetaItem><MapPin />{profile.location}</HeroMetaItem>}
//                   </HeroMeta>
//                 )}
//                 {(socialLinks.length > 0 || cvLink) && (
//                   <HeroSocials>
//                     {socialLinks.map(item => {
//                       const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                       const Icon = meta.icon;
//                       return <HeroSocial key={item._id||item.id} href={buildSocialHref(item)} target="_blank" rel="noopener noreferrer"><Icon /></HeroSocial>;
//                     })}
//                     {cvLink && <HeroResume href={cvLink} target="_blank" rel="noopener noreferrer"><FileText />Resume</HeroResume>}
//                   </HeroSocials>
//                 )}
//               </div>
//               <HeroStats>
//                 {education.length > 0 && <HeroStatItem><HeroStatNum>{education.length}</HeroStatNum><HeroStatLabel>Education</HeroStatLabel></HeroStatItem>}
//                 {experience.length > 0 && <HeroStatItem><HeroStatNum>{experience.length}</HeroStatNum><HeroStatLabel>Roles</HeroStatLabel></HeroStatItem>}
//                 {projects.length > 0 && <HeroStatItem><HeroStatNum>{projects.length}</HeroStatNum><HeroStatLabel>Projects</HeroStatLabel></HeroStatItem>}
//                 {certifications.length > 0 && <HeroStatItem><HeroStatNum>{certifications.length}</HeroStatNum><HeroStatLabel>Certs</HeroStatLabel></HeroStatItem>}
//               </HeroStats>
//             </HeroFooter>
//           </HeroInner>
//         </HeroPanel>

//         {/* EDUCATION */}
//         {education.length > 0 && (
//           <ChapterPanel data-chapter="education" ref={r => sectionRefs.current['education'] = r} id="section-education" $alt>
//             <ChapterNumBg>01</ChapterNumBg>
//             <ChapterWrap>
//               <ChapterHead>
//                 <ChapterTag>Education</ChapterTag>
//                 <ChapterTitle>Academic Background</ChapterTitle>
//               </ChapterHead>
//               <LargeCardList>
//                 {education.map((edu, i) => {
//                   const dur = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'N/A';
//                   const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : null;
//                   return (
//                     <LargeCard key={edu._id||i}>
//                       <LargeCardSide>
//                         <LargeCardPeriod>{dur}</LargeCardPeriod>
//                         <LargeCardType>Education</LargeCardType>
//                       </LargeCardSide>
//                       <LargeCardBody>
//                         <LargeCardTitle>{na(edu.institution)}</LargeCardTitle>
//                         <LargeCardSub>{na(edu.course)}</LargeCardSub>
//                         {score && <LargeCardDesc>{score}</LargeCardDesc>}
//                       </LargeCardBody>
//                     </LargeCard>
//                   );
//                 })}
//               </LargeCardList>
//             </ChapterWrap>
//           </ChapterPanel>
//         )}

//         {/* EXPERIENCE */}
//         {experience.length > 0 && (
//           <ChapterPanel data-chapter="experience" ref={r => sectionRefs.current['experience'] = r} id="section-experience">
//             <ChapterNumBg>02</ChapterNumBg>
//             <ChapterWrap>
//               <ChapterHead>
//                 <ChapterTag>Experience</ChapterTag>
//                 <ChapterTitle>Work History</ChapterTitle>
//               </ChapterHead>
//               <LargeCardList>
//                 {experience.map((exp, i) => (
//                   <LargeCard key={exp._id||i}>
//                     <LargeCardSide>
//                       <LargeCardPeriod>{exp.duration || 'N/A'}</LargeCardPeriod>
//                       <LargeCardType>{exp.type || 'Full-time'}</LargeCardType>
//                     </LargeCardSide>
//                     <LargeCardBody>
//                       <LargeCardTitle>{na(exp.role)}</LargeCardTitle>
//                       <LargeCardSub>{na(exp.company)}</LargeCardSub>
//                       {exp.description && <LargeCardDesc>{exp.description}</LargeCardDesc>}
//                     </LargeCardBody>
//                   </LargeCard>
//                 ))}
//               </LargeCardList>
//             </ChapterWrap>
//           </ChapterPanel>
//         )}

//         {/* PROJECTS */}
//         {projects.length > 0 && (
//           <ChapterPanel data-chapter="projects" ref={r => sectionRefs.current['projects'] = r} id="section-projects" $alt>
//             <ChapterNumBg>03</ChapterNumBg>
//             <ChapterWrap>
//               <ChapterHead>
//                 <ChapterTag>Projects</ChapterTag>
//                 <ChapterTitle>Selected Work</ChapterTitle>
//               </ChapterHead>
//               <ProjectsTiles>
//                 {projects.map((proj, i) => (
//                   <ProjectTile key={proj._id||i} $span={TILE_SPANS[i % TILE_SPANS.length]}>
//                     <ProjectTileNum>{String(i+1).padStart(2,'0')}</ProjectTileNum>
//                     <ProjectTileTitle>{na(proj.title)}</ProjectTileTitle>
//                     {proj.description && <ProjectTileDesc>{proj.description}</ProjectTileDesc>}
//                     {proj.tech?.length > 0 && <TechRow>{proj.tech.map((t,j) => <TechTag key={j}>{t}</TechTag>)}</TechRow>}
//                     {(proj.demo || proj.repo) && (
//                       <ProjLinks>
//                         {proj.demo && <ProjLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLink>}
//                         {proj.repo && <ProjLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLink>}
//                       </ProjLinks>
//                     )}
//                   </ProjectTile>
//                 ))}
//               </ProjectsTiles>
//             </ChapterWrap>
//           </ChapterPanel>
//         )}

//         {/* SKILLS */}
//         {skillCats.length > 0 && (
//           <ChapterPanel data-chapter="skills" ref={r => sectionRefs.current['skills'] = r} id="section-skills">
//             <ChapterNumBg>04</ChapterNumBg>
//             <ChapterWrap>
//               <ChapterHead>
//                 <ChapterTag>Skills</ChapterTag>
//                 <ChapterTitle>Technical Stack</ChapterTitle>
//               </ChapterHead>
//               <SkillsColumns>
//                 {skillCats.map((cat, idx) => (
//                   <SkillCol key={cat._id||idx}>
//                     <SkillColHead>{cat.category}</SkillColHead>
//                     <SkillList>
//                       {cat.items.map((item, i) => (
//                         <SkillRow key={i}><SkillName>{item}</SkillName><SkillDot /></SkillRow>
//                       ))}
//                     </SkillList>
//                   </SkillCol>
//                 ))}
//               </SkillsColumns>
//             </ChapterWrap>
//           </ChapterPanel>
//         )}

//         {/* CERTIFICATIONS */}
//         {certifications.length > 0 && (
//           <ChapterPanel data-chapter="certifications" ref={r => sectionRefs.current['certifications'] = r} id="section-certifications" $alt>
//             <ChapterNumBg>05</ChapterNumBg>
//             <ChapterWrap>
//               <ChapterHead>
//                 <ChapterTag>Certifications</ChapterTag>
//                 <ChapterTitle>Credentials</ChapterTitle>
//               </ChapterHead>
//               <CertGrid>
//                 {certifications.map((cert, i) => (
//                   <CertCard key={cert._id||i}>
//                     <CertName>{na(cert.name)}</CertName>
//                     <CertIssuer>{na(cert.issuer)}</CertIssuer>
//                     {cert.link && <CertLink href={cert.link} target="_blank" rel="noopener noreferrer">View Credential <ArrowUpRight /></CertLink>}
//                   </CertCard>
//                 ))}
//               </CertGrid>
//             </ChapterWrap>
//           </ChapterPanel>
//         )}

//         {/* INTERESTS */}
//         {interests?.interests?.length > 0 && (
//           <ChapterPanel data-chapter="interests" ref={r => sectionRefs.current['interests'] = r} id="section-interests">
//             <ChapterNumBg>06</ChapterNumBg>
//             <ChapterWrap>
//               <ChapterHead>
//                 <ChapterTag>Interests</ChapterTag>
//                 <ChapterTitle>Beyond Work</ChapterTitle>
//               </ChapterHead>
//               <InterestFlow>
//                 {interests.interests.map((item, i) => <InterestPill key={i}>{item}</InterestPill>)}
//               </InterestFlow>
//             </ChapterWrap>
//           </ChapterPanel>
//         )}
//       </Page>
//     </>
//   );
// };

// export default PublicProfilePage;


// ======================= Templete 8 ======================= //

// ===================== Template 8: Compact Dashboard / Data-Forward ===================== //
// Concept: The entire page feels like a professional analytics dashboard.
// A dense hero header bar (no full-screen splash) shows avatar, name, stats as KPI chips.
// Below: a tight masonry mosaic of data modules — experience as a Gantt-style timeline,
// skills as a dot-matrix / tag cloud, projects as a sortable list with icons,
// certifications as achievement badges. Ultra-professional, information-dense.

// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Globe, TrendingUp,
//   Star, BarChart2, Grid, List,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// const SOCIAL_ICON_MAP = {
//   Github: { icon: Github, label: 'GitHub' },
//   Linkedin: { icon: Linkedin, label: 'LinkedIn' },
//   Twitter: { icon: Twitter, label: 'Twitter / X' },
//   Instagram: { icon: Instagram, label: 'Instagram' },
//   Youtube: { icon: Youtube, label: 'YouTube' },
//   Code2: { icon: Code2, label: 'LeetCode' },
//   Trophy: { icon: Trophy, label: 'Codeforces' },
//   Twitch: { icon: Twitch, label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send: { icon: Send, label: 'Telegram' },
//   Rss: { icon: Rss, label: 'Blog' },
//   Globe: { icon: Globe, label: 'Website' },
//   Mail: { icon: Mail, label: 'Email' },
//   Phone: { icon: Phone, label: 'Phone' },
//   AtSign: { icon: AtSign, label: 'Other' },
//   ExternalLink: { icon: ExternalLink, label: 'Link' },
// };

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   :root {
//     --bg:    #f4f4f4;
//     --bg2:   #ebebeb;
//     --bg3:   #e2e2e2;
//     --white: #ffffff;
//     --ink:   #161616;
//     --ink2:  #393939;
//     --ink3:  #6f6f6f;
//     --ink4:  #a8a8a8;
//     --ink5:  #c6c6c6;
//     --blue:  #0f62fe;
//     --blue2: #0043ce;
//     --blue3: #edf5ff;
//     --blue4: rgba(15,98,254,0.1);
//     --teal:  #007d79;
//     --teal2: #e3fafc;
//     --green: #198038;
//     --green2:#defbe6;
//     --amber: #b28600;
//     --amber2:#fdf6dd;
//     --red:   #da1e28;
//     --red2:  #fff1f1;
//     --border: #e0e0e0;
//     --b2: #c6c6c6;
//     --r: 0px;
//     --font-d: 'IBM Plex Sans', system-ui, sans-serif;
//     --font-m: 'IBM Plex Mono', monospace;
//   }
//   html { scroll-behavior: smooth; }
//   body { background: var(--bg); font-family: var(--font-d); color: var(--ink); -webkit-font-smoothing: antialiased; }
//   img { display: block; max-width: 100%; }
//   ::selection { background: var(--blue); color: white; }
//   ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: var(--bg); } ::-webkit-scrollbar-thumb { background: var(--b2); }
// `;

// const fadeUp = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
// const slideIn = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
// const spin = keyframes`to{transform:rotate(360deg)}`;
// const shimmer = keyframes`0%{background-position:-600px 0}100%{background-position:600px 0}`;
// const barFill = keyframes`from{width:0}to{width:100%}`;

// /* ── OVERLAY ── */
// const OvBg = styled.div`
//   position:fixed;inset:0;background:rgba(0,0,0,${p=>p.$s?'0.5':'0'});
//   display:flex;align-items:center;justify-content:center;
//   z-index:${p=>p.$s?'9999':'-1'};padding:1rem;
//   pointer-events:${p=>p.$s?'auto':'none'};transition:all .3s;
// `;
// const OvBox = styled.div`
//   background:var(--white);border:1px solid var(--b2);
//   padding:2.5rem 2.25rem;max-width:400px;width:100%;
//   text-align:center;position:relative;
//   animation:${p=>p.$c?'none':slideIn} .4s ease both;
//   box-shadow:0 8px 32px rgba(0,0,0,0.12);
// `;
// const OvClose = styled.button`
//   position:absolute;top:.875rem;right:.875rem;background:transparent;border:none;
//   color:var(--ink3);cursor:pointer;display:flex;padding:.25rem;transition:color .2s;
//   &:hover{color:var(--ink);}svg{width:16px;height:16px;}
// `;
// const OvLabel = styled.div`font-family:var(--font-m);font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--blue);margin-bottom:.625rem;`;
// const OvTitle = styled.h2`font-size:1.5rem;font-weight:600;color:var(--ink);margin-bottom:.625rem;line-height:1.2;`;
// const OvDesc = styled.p`font-size:.875rem;color:var(--ink3);line-height:1.7;margin-bottom:.75rem;`;
// const OvTimer = styled.p`font-family:var(--font-m);font-size:.68rem;color:var(--ink4);margin-bottom:1.5rem;`;
// const OvBtns = styled.div`display:flex;gap:.625rem;@media(max-width:400px){flex-direction:column;}`;
// const OvBtn = styled.button`
//   flex:1;padding:.75rem;font-family:var(--font-d);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s;
//   ${p=>p.$p?`background:var(--blue);color:white;border:1px solid var(--blue);&:hover{background:var(--blue2);}`:
//   `background:transparent;color:var(--ink);border:1px solid var(--b2);&:hover{border-color:var(--ink);}` }
// `;

// /* ── DASHBOARD HEADER ── */
// const DashHeader = styled.header`
//   background:var(--ink);
//   border-bottom:1px solid rgba(255,255,255,0.1);
//   position:sticky;top:0;z-index:200;
// `;
// const DashHeaderInner = styled.div`
//   max-width:1440px;margin:0 auto;
//   padding:.75rem 1.5rem;
//   display:flex;align-items:center;gap:1.25rem;flex-wrap:wrap;
//   @media(max-width:640px){padding:.625rem 1rem;gap:.875rem;}
// `;
// const DashHeaderNav = styled.div`display:flex;align-items:center;gap:.25rem;`;
// const DashNavBtn = styled.button`
//   display:inline-flex;align-items:center;gap:.35rem;
//   background:transparent;border:1px solid transparent;padding:.35rem .625rem;
//   font-family:var(--font-d);font-size:.72rem;font-weight:400;
//   color:rgba(255,255,255,0.5);cursor:pointer;transition:all .15s;
//   svg{width:12px;height:12px;}
//   &:hover{color:white;border-color:rgba(255,255,255,0.2);}
// `;
// const HeaderSep = styled.div`width:1px;height:20px;background:rgba(255,255,255,0.1);`;
// const DashAvatar = styled.div`
//   width:36px;height:36px;border-radius:50%;overflow:hidden;flex-shrink:0;
//   background:rgba(15,98,254,0.3);border:1.5px solid rgba(255,255,255,0.15);
//   display:flex;align-items:center;justify-content:center;
//   svg{width:16px;height:16px;color:rgba(255,255,255,0.6);}
// `;
// const DashAvatarImg = styled.img`width:100%;height:100%;object-fit:cover;`;
// const DashName = styled.div`
//   font-size:.875rem;font-weight:500;color:white;letter-spacing:-.01em;white-space:nowrap;
// `;
// const DashRole = styled.div`font-family:var(--font-m);font-size:.6rem;color:rgba(255,255,255,0.4);letter-spacing:.06em;`;
// const KpiRow = styled.div`display:flex;gap:.5rem;flex-wrap:wrap;margin-left:auto;`;
// const KpiChip = styled.div`
//   display:flex;align-items:center;gap:.375rem;
//   font-family:var(--font-m);font-size:.65rem;letter-spacing:.06em;
//   color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.07);
//   border:1px solid rgba(255,255,255,0.1);padding:.3rem .625rem;
//   span{color:white;font-weight:500;}
// `;

// /* ── SUBHEADER ── */
// const SubHeader = styled.div`
//   background:var(--white);border-bottom:1px solid var(--border);
//   padding:.625rem 1.5rem;
//   max-width:1440px;margin:0 auto;width:100%;
//   display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.625rem;
//   @media(max-width:640px){padding:.5rem 1rem;}
// `;
// const SubTitle = styled.h1`font-size:.875rem;font-weight:600;color:var(--ink);letter-spacing:-.01em;`;
// const ContactMeta = styled.div`display:flex;gap:.625rem;flex-wrap:wrap;`;
// const ContactItem = styled.div`
//   display:flex;align-items:center;gap:.35rem;
//   font-size:.75rem;color:var(--ink3);
//   svg{width:12px;height:12px;color:var(--blue);flex-shrink:0;}
// `;
// const HeaderSocials = styled.div`display:flex;gap:.375rem;align-items:center;`;
// const HeaderSocial = styled.a`
//   display:inline-flex;align-items:center;justify-content:center;
//   width:30px;height:30px;background:var(--bg);border:1px solid var(--border);
//   color:var(--ink3);text-decoration:none;transition:all .15s;
//   svg{width:13px;height:13px;}
//   &:hover{background:var(--blue4);color:var(--blue);border-color:rgba(15,98,254,0.3);}
// `;
// const HeaderResume = styled.a`
//   display:inline-flex;align-items:center;gap:.35rem;
//   font-family:var(--font-d);font-size:.72rem;font-weight:500;
//   padding:.375rem .875rem;background:var(--blue);color:white;
//   border:1px solid var(--blue);text-decoration:none;transition:all .15s;
//   svg{width:12px;height:12px;}
//   &:hover{background:var(--blue2);}
// `;

// /* ── DASHBOARD GRID ── */
// const DashGrid = styled.div`
//   max-width:1440px;margin:0 auto;
//   padding:1rem 1.5rem 4rem;
//   display:grid;
//   grid-template-columns:repeat(12,1fr);
//   gap:1rem;
//   @media(max-width:1200px){grid-template-columns:repeat(8,1fr);}
//   @media(max-width:900px){grid-template-columns:repeat(4,1fr);}
//   @media(max-width:640px){grid-template-columns:1fr;padding:1rem;gap:.75rem;}
// `;

// /* ── MODULE (reusable panel) ── */
// const Module = styled.div`
//   background:var(--white);border:1px solid var(--border);
//   display:flex;flex-direction:column;
//   grid-column:${p=>p.$gc||'span 4'};
//   animation:${fadeUp} .5s ease ${p=>p.$d||'0s'} both;
//   opacity:0;animation-fill-mode:forwards;
//   @media(max-width:1200px){grid-column:${p=>p.$gc8||p.$gc||'span 4'}!important;}
//   @media(max-width:900px){grid-column:${p=>p.$gc4||'span 4'}!important;}
//   @media(max-width:640px){grid-column:span 1!important;}
// `;
// const ModuleHeader = styled.div`
//   padding:.875rem 1rem;border-bottom:1px solid var(--border);
//   display:flex;align-items:center;justify-content:space-between;
//   background:var(--bg);
// `;
// const ModuleTitle = styled.h3`
//   display:flex;align-items:center;gap:.5rem;
//   font-size:.72rem;font-weight:600;letter-spacing:.1em;text-transform:uppercase;
//   color:var(--ink2);
//   svg{width:13px;height:13px;color:var(--blue);}
// `;
// const ModuleCount = styled.span`
//   font-family:var(--font-m);font-size:.65rem;color:var(--ink4);
// `;
// const ModuleBody = styled.div`padding:${p=>p.$np?'0':'1rem'};flex:1;`;

// /* ── SUMMARY MODULE ── */
// const SummaryText = styled.p`font-size:.9rem;color:var(--ink2);line-height:1.75;font-style:italic;`;

// /* ── TIMELINE MODULE (Education / Experience) ── */
// const TimelineList = styled.div`display:flex;flex-direction:column;`;
// const TimelineRow = styled.div`
//   display:flex;gap:0;
//   border-bottom:1px solid var(--border);
//   &:last-child{border-bottom:none;}
//   transition:background .15s;
//   &:hover{background:var(--bg);}
// `;
// const TimelineGutter = styled.div`
//   width:4px;flex-shrink:0;
//   background:${p=>p.$c||'var(--blue)'};
// `;
// const TimelineContent = styled.div`padding:.875rem 1rem;flex:1;min-width:0;`;
// const TimelineTitle = styled.div`font-size:.875rem;font-weight:600;color:var(--ink);margin-bottom:.2rem;`;
// const TimelineSub = styled.div`font-size:.775rem;color:var(--blue);font-weight:500;margin-bottom:.25rem;`;
// const TimelineMeta = styled.div`font-family:var(--font-m);font-size:.65rem;color:var(--ink4);letter-spacing:.04em;`;
// const TimelineDesc = styled.div`font-size:.8rem;color:var(--ink3);line-height:1.65;margin-top:.5rem;`;
// const TIMELINE_COLORS = ['var(--blue)','var(--teal)','var(--green)','var(--amber)','#8a3ffc','#d02670'];

// /* ── PROJECTS MODULE ── */
// const ProjectList = styled.div`display:flex;flex-direction:column;`;
// const ProjectItem = styled.div`
//   display:flex;align-items:flex-start;gap:.875rem;
//   padding:.875rem 1rem;border-bottom:1px solid var(--border);
//   transition:background .15s;
//   &:last-child{border-bottom:none;}
//   &:hover{background:var(--bg);}
// `;
// const ProjectItemIdx = styled.div`
//   font-family:var(--font-m);font-size:.65rem;color:var(--ink4);
//   min-width:20px;padding-top:.15rem;flex-shrink:0;
// `;
// const ProjectItemBody = styled.div`flex:1;min-width:0;`;
// const ProjectItemTitle = styled.div`font-size:.875rem;font-weight:600;color:var(--ink);margin-bottom:.2rem;`;
// const ProjectItemDesc = styled.div`font-size:.78rem;color:var(--ink3);line-height:1.6;margin-bottom:.5rem;`;
// const ProjectItemTech = styled.div`display:flex;flex-wrap:wrap;gap:.3rem;`;
// const TechBadge = styled.span`
//   font-family:var(--font-m);font-size:.58rem;letter-spacing:.06em;text-transform:uppercase;
//   color:var(--blue);background:var(--blue3);border:1px solid rgba(15,98,254,0.2);
//   padding:.18rem .45rem;
// `;
// const ProjectItemLinks = styled.div`display:flex;gap:.375rem;margin-top:.5rem;`;
// const ProjLinkBtn = styled.a`
//   display:inline-flex;align-items:center;gap:.3rem;
//   font-size:.68rem;font-weight:500;color:var(--ink2);
//   background:var(--bg);border:1px solid var(--border);
//   padding:.3rem .625rem;text-decoration:none;transition:all .15s;
//   svg{width:10px;height:10px;}
//   &:hover{background:var(--blue4);color:var(--blue);border-color:rgba(15,98,254,0.25);}
// `;

// /* ── SKILLS MODULE: dot matrix tag cloud ── */
// const SkillsWrap = styled.div``;
// const SkillSection = styled.div`margin-bottom:1.125rem;&:last-child{margin-bottom:0;}`;
// const SkillSectionHead = styled.div`
//   font-family:var(--font-m);font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;
//   color:var(--ink4);margin-bottom:.5rem;padding-bottom:.35rem;
//   border-bottom:1px solid var(--border);
// `;
// const SkillTags = styled.div`display:flex;flex-wrap:wrap;gap:.35rem;`;
// const SkillTag = styled.span`
//   font-size:.78rem;color:var(--ink2);background:var(--bg);border:1px solid var(--border);
//   padding:.35rem .7rem;cursor:default;transition:all .15s;
//   &:hover{background:var(--ink);color:white;border-color:var(--ink);}
// `;

// /* ── CERT MODULE: badge list ── */
// const CertList = styled.div`display:flex;flex-direction:column;`;
// const CertItem = styled.div`
//   display:flex;align-items:flex-start;gap:.75rem;
//   padding:.75rem 1rem;border-bottom:1px solid var(--border);
//   transition:background .15s;
//   &:last-child{border-bottom:none;}
//   &:hover{background:var(--bg);}
// `;
// const CertBadge = styled.div`
//   width:32px;height:32px;background:var(--amber2);border:1px solid rgba(178,134,0,0.2);
//   display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:.1rem;
//   svg{width:14px;height:14px;color:var(--amber);}
// `;
// const CertBody = styled.div`flex:1;min-width:0;`;
// const CertNameText = styled.div`font-size:.825rem;font-weight:500;color:var(--ink);margin-bottom:.2rem;line-height:1.35;`;
// const CertIssuerText = styled.div`font-size:.72rem;color:var(--ink3);margin-bottom:.375rem;`;
// const CertLinkBtn = styled.a`
//   display:inline-flex;align-items:center;gap:.3rem;
//   font-size:.65rem;color:var(--blue);text-decoration:none;transition:gap .15s;
//   svg{width:10px;height:10px;}
//   &:hover{gap:.5rem;}
// `;

// /* ── INTERESTS MODULE ── */
// const InterestChips = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;`;
// const InterestChip = styled.span`
//   font-size:.825rem;color:var(--ink2);background:var(--bg2);border:1px solid var(--border);
//   padding:.45rem 1rem;cursor:default;transition:all .2s;
//   &:hover{background:var(--ink);color:white;}
// `;

// /* ── STAT MODULE ── */
// const StatModuleGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);`;
// const StatCell = styled.div`
//   background:var(--white);padding:1.25rem 1rem;text-align:center;
// `;
// const StatCellNum = styled.div`font-size:2.5rem;font-weight:600;color:var(--blue);line-height:1;`;
// const StatCellLabel = styled.div`font-family:var(--font-m);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink4);margin-top:.375rem;`;

// /* ── EMPTY ── */
// const EmptyState = styled.div`
//   padding:2.5rem 1rem;text-align:center;color:var(--ink4);font-size:.8rem;
//   display:flex;flex-direction:column;align-items:center;gap:.5rem;
//   svg{width:1.75rem;height:1.75rem;opacity:.25;}
// `;

// /* ── LOADING / ERROR ── */
// const LoadWrap = styled.div`min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;background:var(--bg);`;
// const Spinner = styled.div`width:28px;height:28px;border:1.5px solid var(--border);border-top-color:var(--blue);border-radius:50%;animation:${spin} .7s linear infinite;`;
// const LoadBar = styled.div`width:100px;height:1px;background:linear-gradient(90deg,var(--bg2) 0%,var(--blue) 50%,var(--bg2) 100%);background-size:600px;animation:${shimmer} 1.5s linear infinite;`;
// const LoadLbl = styled.p`font-family:var(--font-m);font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink4);`;
// const ErrWrap = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:var(--bg);`;
// const ErrBox = styled.div`background:var(--white);border:1px solid var(--b2);padding:3rem 2.5rem;max-width:380px;width:100%;text-align:center;animation:${fadeUp} .5s ease both;`;
// const ErrTitle = styled.h2`font-size:1.25rem;font-weight:600;color:var(--ink);margin:1rem 0 .625rem;`;
// const ErrMsg = styled.p`font-size:.875rem;color:var(--ink3);line-height:1.7;margin-bottom:1.75rem;`;
// const ErrBtn = styled.button`display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.75rem;background:var(--blue);color:white;border:none;font-family:var(--font-d);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s;&:hover{background:var(--blue2);}svg{width:14px;height:14px;}`;

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [showOverlay, setShowOverlay] = useState(() => sessionStorage.getItem('overlayDismissed') === 'true' ? false : !user);
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft(p => { if (p <= 1) { handleClose(); return 0; } return p - 1; });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleClose = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           try { const url = await publicService.getSignedUrl(path); if (url) urlMap[key] = url; } catch {}
//         }));
//         setImageUrls(urlMap);
//       } catch (err) { setError(err.message || 'Profile not found'); }
//       finally { setLoading(false); }
//     };
//     if (username) load();
//   }, [username]);

//   if (loading) return (<><GlobalStyle /><LoadWrap><Spinner /><LoadBar /><LoadLbl>Loading dashboard...</LoadLbl></LoadWrap></>);
//   if (error || !portfolio) return (
//     <><GlobalStyle /><ErrWrap><ErrBox>
//       <AlertCircle size={32} color="var(--blue)" />
//       <ErrTitle>{error ? 'Not Found' : 'No Portfolio'}</ErrTitle>
//       <ErrMsg>{error || "This profile hasn't been set up yet."}</ErrMsg>
//       <ErrBtn onClick={() => navigate('/')}><Home size={14} /> Go Home</ErrBtn>
//     </ErrBox></ErrWrap></>
//   );

//   const { profile = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], interests = {} } = portfolio;
//   const fullName = profile.name || 'Anonymous';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;

//   return (
//     <>
//       <GlobalStyle />

//       <OvBg $s={showOverlay}>
//         <OvBox $c={isClosing}>
//           <OvClose onClick={handleClose}><X /></OvClose>
//           <OvLabel>Portfolio Platform</OvLabel>
//           <OvTitle>Create Your Dashboard</OvTitle>
//           <OvDesc>Build and share your professional portfolio with colleagues and recruiters.</OvDesc>
//           <OvTimer>Closes in {timeLeft}s</OvTimer>
//           <OvBtns>
//             <OvBtn $p onClick={() => navigate('/login')}>Sign In</OvBtn>
//             <OvBtn onClick={() => navigate('/register')}>Register</OvBtn>
//           </OvBtns>
//         </OvBox>
//       </OvBg>

//       {/* Dashboard Header */}
//       <DashHeader>
//         <DashHeaderInner>
//           <DashHeaderNav>
//             <DashNavBtn onClick={() => navigate(-1)}><ChevronLeft />Back</DashNavBtn>
//             <DashNavBtn onClick={() => navigate('/')}><Home />Home</DashNavBtn>
//           </DashHeaderNav>
//           <HeaderSep />
//           <DashAvatar>
//             {imageUrls.profilePhoto ? <DashAvatarImg src={imageUrls.profilePhoto} alt={fullName} /> : <User />}
//           </DashAvatar>
//           <div>
//             <DashName>{fullName}</DashName>
//             <DashRole>{profile.domain || 'Professional Portfolio'}</DashRole>
//           </div>
//           <KpiRow>
//             {education.length > 0 && <KpiChip><BookOpen size={10}/><span>{education.length}</span> edu</KpiChip>}
//             {experience.length > 0 && <KpiChip><Briefcase size={10}/><span>{experience.length}</span> roles</KpiChip>}
//             {projects.length > 0 && <KpiChip><Code2 size={10}/><span>{projects.length}</span> projects</KpiChip>}
//             {certifications.length > 0 && <KpiChip><Award size={10}/><span>{certifications.length}</span> certs</KpiChip>}
//             {skillCats.length > 0 && <KpiChip><Layers size={10}/><span>{skillCats.reduce((a,c)=>a+c.items.length,0)}</span> skills</KpiChip>}
//           </KpiRow>
//         </DashHeaderInner>
//       </DashHeader>

//       {/* Sub-header */}
//       <div style={{background:'var(--white)',borderBottom:'1px solid var(--border)'}}>
//         <SubHeader>
//           <SubTitle>{fullName} — Profile Overview</SubTitle>
//           <ContactMeta>
//             {profile.email && <ContactItem><Mail />{profile.email}</ContactItem>}
//             {profile.phone && <ContactItem><Phone />{profile.phone}</ContactItem>}
//             {profile.location && <ContactItem><MapPin />{profile.location}</ContactItem>}
//           </ContactMeta>
//           {(socialLinks.length > 0 || cvLink) && (
//             <HeaderSocials>
//               {socialLinks.map(item => {
//                 const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                 const Icon = meta.icon;
//                 return <HeaderSocial key={item._id||item.id} href={buildSocialHref(item)} target="_blank" rel="noopener noreferrer"><Icon /></HeaderSocial>;
//               })}
//               {cvLink && <HeaderResume href={cvLink} target="_blank" rel="noopener noreferrer"><FileText />Resume</HeaderResume>}
//             </HeaderSocials>
//           )}
//         </SubHeader>
//       </div>

//       {/* Dashboard Grid */}
//       <DashGrid>

//         {/* Stats overview */}
//         <Module $gc="span 3" $gc8="span 2" $gc4="span 2" $d="0.05s">
//           <ModuleHeader><ModuleTitle>Overview</ModuleTitle></ModuleHeader>
//           <ModuleBody $np>
//             <StatModuleGrid>
//               <StatCell><StatCellNum>{education.length||0}</StatCellNum><StatCellLabel>Education</StatCellLabel></StatCell>
//               <StatCell><StatCellNum>{experience.length||0}</StatCellNum><StatCellLabel>Roles</StatCellLabel></StatCell>
//               <StatCell><StatCellNum>{projects.length||0}</StatCellNum><StatCellLabel>Projects</StatCellLabel></StatCell>
//               <StatCell><StatCellNum>{certifications.length||0}</StatCellNum><StatCellLabel>Certs</StatCellLabel></StatCell>
//             </StatModuleGrid>
//           </ModuleBody>
//         </Module>

//         {/* Summary */}
//         {profile.summary && (
//           <Module $gc="span 9" $gc8="span 6" $gc4="span 2" $d="0.08s">
//             <ModuleHeader><ModuleTitle><TrendingUp />About</ModuleTitle></ModuleHeader>
//             <ModuleBody><SummaryText>{profile.summary}</SummaryText></ModuleBody>
//           </Module>
//         )}

//         {/* Education */}
//         <Module $gc="span 5" $gc8="span 4" $gc4="span 4" $d="0.12s">
//           <ModuleHeader>
//             <ModuleTitle><BookOpen />Education</ModuleTitle>
//             <ModuleCount>{education.length} records</ModuleCount>
//           </ModuleHeader>
//           <ModuleBody $np>
//             {education.length > 0 ? (
//               <TimelineList>
//                 {education.map((edu, i) => {
//                   const dur = edu.duration ? (edu.duration === '1' ? '1 yr' : `${edu.duration} yrs`) : 'N/A';
//                   const score = edu.cgpa ? `CGPA ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : null;
//                   return (
//                     <TimelineRow key={edu._id||i}>
//                       <TimelineGutter $c={TIMELINE_COLORS[i % TIMELINE_COLORS.length]} />
//                       <TimelineContent>
//                         <TimelineTitle>{na(edu.institution)}</TimelineTitle>
//                         <TimelineSub>{na(edu.course)}</TimelineSub>
//                         <TimelineMeta>{dur}{score ? ` · ${score}` : ''}</TimelineMeta>
//                       </TimelineContent>
//                     </TimelineRow>
//                   );
//                 })}
//               </TimelineList>
//             ) : <EmptyState><BookOpen /><span>No education added</span></EmptyState>}
//           </ModuleBody>
//         </Module>

//         {/* Experience */}
//         <Module $gc="span 7" $gc8="span 4" $gc4="span 4" $d="0.15s">
//           <ModuleHeader>
//             <ModuleTitle><Briefcase />Experience</ModuleTitle>
//             <ModuleCount>{experience.length} roles</ModuleCount>
//           </ModuleHeader>
//           <ModuleBody $np>
//             {experience.length > 0 ? (
//               <TimelineList>
//                 {experience.map((exp, i) => (
//                   <TimelineRow key={exp._id||i}>
//                     <TimelineGutter $c={TIMELINE_COLORS[(i+2) % TIMELINE_COLORS.length]} />
//                     <TimelineContent>
//                       <TimelineTitle>{na(exp.role)}</TimelineTitle>
//                       <TimelineSub>{na(exp.company)}{exp.type ? ` · ${exp.type}` : ''}</TimelineSub>
//                       <TimelineMeta>{exp.duration || 'N/A'}</TimelineMeta>
//                       {exp.description && <TimelineDesc>{exp.description}</TimelineDesc>}
//                     </TimelineContent>
//                   </TimelineRow>
//                 ))}
//               </TimelineList>
//             ) : <EmptyState><Briefcase /><span>No experience added</span></EmptyState>}
//           </ModuleBody>
//         </Module>

//         {/* Projects */}
//         <Module $gc="span 7" $gc8="span 5" $gc4="span 4" $d="0.18s">
//           <ModuleHeader>
//             <ModuleTitle><Code2 />Projects</ModuleTitle>
//             <ModuleCount>{projects.length} items</ModuleCount>
//           </ModuleHeader>
//           <ModuleBody $np>
//             {projects.length > 0 ? (
//               <ProjectList>
//                 {projects.map((proj, i) => (
//                   <ProjectItem key={proj._id||i}>
//                     <ProjectItemIdx>{String(i+1).padStart(2,'0')}</ProjectItemIdx>
//                     <ProjectItemBody>
//                       <ProjectItemTitle>{na(proj.title)}</ProjectItemTitle>
//                       {proj.description && <ProjectItemDesc>{proj.description}</ProjectItemDesc>}
//                       {proj.tech?.length > 0 && <ProjectItemTech>{proj.tech.map((t,j)=><TechBadge key={j}>{t}</TechBadge>)}</ProjectItemTech>}
//                       {(proj.demo||proj.repo) && (
//                         <ProjectItemLinks>
//                           {proj.demo && <ProjLinkBtn href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></ProjLinkBtn>}
//                           {proj.repo && <ProjLinkBtn href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></ProjLinkBtn>}
//                         </ProjectItemLinks>
//                       )}
//                     </ProjectItemBody>
//                   </ProjectItem>
//                 ))}
//               </ProjectList>
//             ) : <EmptyState><Code2 /><span>No projects added</span></EmptyState>}
//           </ModuleBody>
//         </Module>

//         {/* Skills */}
//         <Module $gc="span 5" $gc8="span 3" $gc4="span 4" $d="0.2s">
//           <ModuleHeader>
//             <ModuleTitle><Layers />Skills</ModuleTitle>
//             <ModuleCount>{skillCats.reduce((a,c)=>a+c.items.length,0)} skills</ModuleCount>
//           </ModuleHeader>
//           <ModuleBody>
//             {skillCats.length > 0 ? (
//               <SkillsWrap>
//                 {skillCats.map((cat, idx) => (
//                   <SkillSection key={cat._id||idx}>
//                     <SkillSectionHead>{cat.category}</SkillSectionHead>
//                     <SkillTags>{cat.items.map((item,i)=><SkillTag key={i}>{item}</SkillTag>)}</SkillTags>
//                   </SkillSection>
//                 ))}
//               </SkillsWrap>
//             ) : <EmptyState><Layers /><span>No skills added</span></EmptyState>}
//           </ModuleBody>
//         </Module>

//         {/* Certifications */}
//         {certifications.length > 0 && (
//           <Module $gc="span 6" $gc8="span 4" $gc4="span 4" $d="0.22s">
//             <ModuleHeader>
//               <ModuleTitle><Award />Certifications</ModuleTitle>
//               <ModuleCount>{certifications.length} certs</ModuleCount>
//             </ModuleHeader>
//             <ModuleBody $np>
//               <CertList>
//                 {certifications.map((cert, i) => (
//                   <CertItem key={cert._id||i}>
//                     <CertBadge><Award /></CertBadge>
//                     <CertBody>
//                       <CertNameText>{na(cert.name)}</CertNameText>
//                       <CertIssuerText>{na(cert.issuer)}</CertIssuerText>
//                       {cert.link && <CertLinkBtn href={cert.link} target="_blank" rel="noopener noreferrer">View Credential <ArrowUpRight /></CertLinkBtn>}
//                     </CertBody>
//                   </CertItem>
//                 ))}
//               </CertList>
//             </ModuleBody>
//           </Module>
//         )}

//         {/* Interests */}
//         {interests?.interests?.length > 0 && (
//           <Module $gc="span 6" $gc8="span 4" $gc4="span 4" $d="0.24s">
//             <ModuleHeader>
//               <ModuleTitle><Sparkles />Interests</ModuleTitle>
//               <ModuleCount>{interests.interests.length} items</ModuleCount>
//             </ModuleHeader>
//             <ModuleBody>
//               <InterestChips>
//                 {interests.interests.map((item,i)=><InterestChip key={i}>{item}</InterestChip>)}
//               </InterestChips>
//             </ModuleBody>
//           </Module>
//         )}

//       </DashGrid>
//     </>
//   );
// };

// export default PublicProfilePage;




// ============================ Templete 9 ==================== //

// ===================== Template 9: Monochrome Long-form with Fixed Sidebar ===================== //
// Concept: A fixed left sidebar is a vertical progress navigator with section titles.
// The right content area is a clean long-form editorial layout with no photo in the hero —
// pure giant typography, subtle rules, and refined whitespace. A "letterpress" feel.
// Education / Experience uses a two-column dossier card. Projects use a full-width spotlight.
// Skills use a categorized inline list. Everything is refined, calm, and extremely legible.
// Palette: warm white, deep charcoal, one coral accent.

// import { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import styled, { keyframes, createGlobalStyle } from 'styled-components';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   Mail, MapPin, Linkedin, Github, ExternalLink,
//   Code2, Award, Briefcase, BookOpen, User, Home,
//   AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
//   ChevronLeft, X, FileText,
//   Twitter, Instagram, Youtube, Send, Rss, AtSign,
//   Trophy, Twitch, MessageCircle, Globe,
// } from 'lucide-react';
// import { publicService } from '../services/publicService';

// const SOCIAL_ICON_MAP = {
//   Github: { icon: Github, label: 'GitHub' },
//   Linkedin: { icon: Linkedin, label: 'LinkedIn' },
//   Twitter: { icon: Twitter, label: 'Twitter / X' },
//   Instagram: { icon: Instagram, label: 'Instagram' },
//   Youtube: { icon: Youtube, label: 'YouTube' },
//   Code2: { icon: Code2, label: 'LeetCode' },
//   Trophy: { icon: Trophy, label: 'Codeforces' },
//   Twitch: { icon: Twitch, label: 'Twitch' },
//   MessageCircle: { icon: MessageCircle, label: 'WhatsApp' },
//   Send: { icon: Send, label: 'Telegram' },
//   Rss: { icon: Rss, label: 'Blog' },
//   Globe: { icon: Globe, label: 'Website' },
//   Mail: { icon: Mail, label: 'Email' },
//   Phone: { icon: Phone, label: 'Phone' },
//   AtSign: { icon: AtSign, label: 'Other' },
//   ExternalLink: { icon: ExternalLink, label: 'Link' },
// };

// const buildSocialHref = (item) => {
//   const link = item.link || item.username || '';
//   if (!link) return null;
//   if (item.icon === 'Mail' && !link.startsWith('mailto:')) return `mailto:${link}`;
//   return link;
// };
// const na = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

// const GlobalStyle = createGlobalStyle`
//   @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Hanken+Grotesk:wght@300;400;500;600;700&display=swap');
//   *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
//   :root {
//     --parchment: #faf9f7;
//     --paper:     #f5f3ef;
//     --linen:     #ede9e2;
//     --linen2:    #e3ddd5;
//     --border:    #d5cfc5;
//     --border2:   #c8c0b4;
//     --ink:       #1f1c18;
//     --ink2:      #3a3630;
//     --ink3:      #6b6358;
//     --ink4:      #9b9185;
//     --ink5:      #bbb0a4;
//     --coral:     #d4441c;
//     --coral2:    #e8602e;
//     --coral3:    #fdf0ec;
//     --coral4:    rgba(212,68,28,0.1);
//     --font-serif: 'Libre Baskerville', Georgia, serif;
//     --font-sans:  'Hanken Grotesk', system-ui, sans-serif;
//     --sidebar-w: 240px;
//   }
//   html { scroll-behavior: smooth; }
//   body { background: var(--parchment); font-family: var(--font-sans); color: var(--ink); -webkit-font-smoothing: antialiased; }
//   img { display: block; max-width: 100%; }
//   ::selection { background: var(--coral); color: white; }
//   ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: var(--paper); } ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
// `;

// const fadeUp = keyframes`from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}`;
// const slideIn = keyframes`from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}`;
// const spin = keyframes`to{transform:rotate(360deg)}`;
// const shimmer = keyframes`0%{background-position:-600px 0}100%{background-position:600px 0}`;
// const progressIn = keyframes`from{height:0}to{height:100%}`;

// /* ── OVERLAY ── */
// const OvBg = styled.div`
//   position:fixed;inset:0;background:rgba(31,28,24,${p=>p.$s?'.7':'0'});
//   display:flex;align-items:center;justify-content:center;
//   z-index:${p=>p.$s?'9999':'-1'};padding:1rem;
//   pointer-events:${p=>p.$s?'auto':'none'};transition:all .35s;
// `;
// const OvBox = styled.div`
//   background:var(--paper);border:2px solid var(--ink);
//   padding:3rem 2.5rem;max-width:420px;width:100%;
//   text-align:center;position:relative;
//   animation:${p=>p.$c?'none':slideIn} .45s cubic-bezier(0.22,1,0.36,1) both;
//   box-shadow:6px 6px 0 var(--linen2);
// `;
// const OvClose = styled.button`
//   position:absolute;top:.875rem;right:.875rem;background:transparent;border:none;
//   color:var(--ink3);cursor:pointer;display:flex;transition:color .2s;
//   &:hover{color:var(--coral);}svg{width:18px;height:18px;}
// `;
// const OvEye = styled.p`font-family:var(--font-sans);font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:var(--coral);margin-bottom:.75rem;`;
// const OvTitle = styled.h2`font-family:var(--font-serif);font-size:2rem;font-weight:700;color:var(--ink);margin-bottom:.75rem;line-height:1.1;`;
// const OvDesc = styled.p`font-size:.9rem;color:var(--ink3);line-height:1.7;margin-bottom:.75rem;font-style:italic;font-family:var(--font-serif);`;
// const OvTimer = styled.p`font-size:.72rem;color:var(--ink4);margin-bottom:2rem;`;
// const OvBtns = styled.div`display:flex;gap:.75rem;@media(max-width:400px){flex-direction:column;}`;
// const OvBtn = styled.button`
//   flex:1;padding:.875rem;font-family:var(--font-sans);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s;
//   ${p=>p.$p?`background:var(--ink);color:var(--parchment);border:2px solid var(--ink);&:hover{background:var(--coral);border-color:var(--coral);}`:
//   `background:transparent;color:var(--ink);border:2px solid var(--ink);&:hover{background:var(--linen);}` }
// `;

// /* ── SHELL ── */
// const Shell = styled.div`
//   display:flex;min-height:100vh;
//   @media(max-width:960px){flex-direction:column;}
// `;

// /* ── FIXED SIDEBAR ── */
// const Sidebar = styled.aside`
//   width:var(--sidebar-w);flex-shrink:0;
//   position:fixed;top:0;left:0;height:100vh;
//   background:var(--parchment);border-right:1px solid var(--border);
//   display:flex;flex-direction:column;
//   padding:2rem 0;overflow-y:auto;
//   z-index:100;
//   @media(max-width:960px){
//     position:sticky;top:0;height:auto;width:100%;
//     flex-direction:row;align-items:center;flex-wrap:wrap;
//     padding:.75rem 1.25rem;border-right:none;border-bottom:1px solid var(--border);
//     background:rgba(250,249,247,0.92);backdrop-filter:blur(12px);z-index:200;
//   }
// `;
// const SidebarTop = styled.div`
//   padding:0 1.5rem 1.5rem;border-bottom:1px solid var(--border);margin-bottom:1.5rem;
//   @media(max-width:960px){padding:0;border-bottom:none;margin-bottom:0;}
// `;
// const SidebarName = styled.div`
//   font-family:var(--font-serif);font-size:.95rem;font-weight:700;
//   color:var(--ink);line-height:1.2;margin-bottom:.25rem;
//   @media(max-width:960px){display:none;}
// `;
// const SidebarRole = styled.div`
//   font-size:.7rem;color:var(--ink4);letter-spacing:.06em;text-transform:uppercase;
//   @media(max-width:960px){display:none;}
// `;
// const SidebarNavLabel = styled.div`
//   font-size:.58rem;letter-spacing:.2em;text-transform:uppercase;color:var(--ink5);
//   padding:0 1.5rem;margin-bottom:.625rem;
//   @media(max-width:960px){display:none;}
// `;
// const SidebarNav = styled.nav`
//   flex:1;
//   @media(max-width:960px){display:flex;gap:.25rem;flex-wrap:wrap;}
// `;
// const SidebarNavItem = styled.button`
//   display:flex;align-items:center;gap:.625rem;
//   width:100%;padding:.5rem 1.5rem;
//   background:transparent;border:none;cursor:pointer;
//   font-family:var(--font-sans);font-size:.8rem;font-weight:${p=>p.$a?'600':'400'};
//   color:${p=>p.$a?'var(--coral)':'var(--ink3)'};
//   border-left:2px solid ${p=>p.$a?'var(--coral)':'transparent'};
//   text-align:left;transition:all .2s;
//   &:hover{color:var(--ink);background:var(--linen);}
//   svg{width:13px;height:13px;flex-shrink:0;}
//   @media(max-width:960px){
//     width:auto;padding:.35rem .75rem;border-left:none;font-size:.72rem;
//     border-bottom:2px solid ${p=>p.$a?'var(--coral)':'transparent'};
//     &:hover{background:transparent;}
//   }
// `;
// const SidebarBottom = styled.div`
//   padding:1.5rem;border-top:1px solid var(--border);margin-top:auto;
//   @media(max-width:960px){display:none;}
// `;
// const SidebarNavBtn = styled.button`
//   display:inline-flex;align-items:center;gap:.375rem;
//   background:transparent;border:none;padding:.3rem 0;
//   font-size:.75rem;color:var(--ink4);cursor:pointer;transition:color .2s;
//   svg{width:12px;height:12px;}
//   &:hover{color:var(--coral);}
//   display:block;margin-bottom:.25rem;
// `;

// /* ── MAIN CONTENT ── */
// const Main = styled.main`
//   margin-left:var(--sidebar-w);flex:1;
//   @media(max-width:960px){margin-left:0;}
// `;

// /* ── HERO ── */
// const HeroSection = styled.section`
//   padding:6rem 4rem 4rem;
//   border-bottom:1px solid var(--border);
//   animation:${fadeUp} .8s cubic-bezier(0.22,1,0.36,1) both;
//   @media(max-width:1100px){padding:5rem 2.5rem 3rem;}
//   @media(max-width:640px){padding:4rem 1.5rem 2.5rem;}
// `;
// const HeroEye = styled.div`
//   display:flex;align-items:center;gap:.75rem;margin-bottom:2rem;
// `;
// const HeroEyeLine = styled.div`height:1px;width:32px;background:var(--coral);`;
// const HeroEyeText = styled.span`font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:var(--coral);`;
// const HeroTitle = styled.h1`
//   font-family:var(--font-serif);
//   font-size:clamp(3rem,7vw,7rem);
//   font-weight:700;line-height:.95;letter-spacing:-.025em;
//   color:var(--ink);margin-bottom:.375em;
// `;
// const HeroTitleItalic = styled.span`font-style:italic;color:var(--ink3);`;
// const HeroDivider = styled.div`height:2px;width:64px;background:var(--coral);margin:2rem 0;`;
// const HeroGrid = styled.div`
//   display:grid;grid-template-columns:1fr 1fr;gap:3rem;
//   @media(max-width:768px){grid-template-columns:1fr;gap:2rem;}
// `;
// const HeroSummary = styled.p`
//   font-family:var(--font-serif);font-size:1.05rem;font-style:italic;
//   color:var(--ink2);line-height:1.8;letter-spacing:-.01em;
// `;
// const HeroInfo = styled.div``;
// const HeroInfoRow = styled.div`
//   display:flex;align-items:flex-start;gap:.625rem;
//   padding:.625rem 0;border-bottom:1px solid var(--border);
//   &:last-child{border-bottom:none;}
//   font-size:.85rem;color:var(--ink3);
//   svg{width:13px;height:13px;color:var(--coral);flex-shrink:0;margin-top:.15rem;}
// `;
// const HeroSocials = styled.div`display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.25rem;`;
// const HeroSocial = styled.a`
//   display:inline-flex;align-items:center;justify-content:center;
//   width:36px;height:36px;background:var(--parchment);
//   border:1px solid var(--border);color:var(--ink3);text-decoration:none;transition:all .2s;
//   svg{width:14px;height:14px;}
//   &:hover{background:var(--coral);color:white;border-color:var(--coral);}
// `;
// const HeroResume = styled.a`
//   display:inline-flex;align-items:center;gap:.5rem;
//   font-size:.75rem;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
//   padding:.55rem 1.25rem;background:var(--ink);color:var(--parchment);
//   border:2px solid var(--ink);text-decoration:none;transition:all .2s;
//   svg{width:13px;height:13px;}
//   &:hover{background:var(--coral);border-color:var(--coral);}
// `;
// const HeroAvatarFrame = styled.div`
//   width:110px;height:130px;margin-top:1rem;
//   overflow:hidden;border:2px solid var(--border);flex-shrink:0;
// `;
// const HeroAvatarImg = styled.img`width:100%;height:100%;object-fit:cover;`;
// const HeroAvatarPH = styled.div`width:100%;height:100%;background:var(--linen);display:flex;align-items:center;justify-content:center;svg{width:3rem;height:3rem;color:var(--ink5);}`;

// /* ── CONTENT SECTION ── */
// const ContentSection = styled.section`
//   padding:4.5rem 4rem;border-bottom:1px solid var(--border);
//   animation:${fadeUp} .6s ease ${p=>p.$d||'.2s'} both;
//   opacity:0;animation-fill-mode:forwards;
//   &:last-child{border-bottom:none;padding-bottom:8rem;}
//   @media(max-width:1100px){padding:3.5rem 2.5rem;}
//   @media(max-width:640px){padding:3rem 1.5rem;}
// `;
// const SectionHead = styled.div`
//   display:flex;align-items:baseline;gap:1.25rem;margin-bottom:3rem;
// `;
// const SectionNum = styled.span`
//   font-family:var(--font-serif);font-size:.8rem;font-style:italic;color:var(--ink5);
// `;
// const SectionTitle = styled.h2`
//   font-family:var(--font-serif);
//   font-size:clamp(1.75rem,4vw,2.75rem);
//   font-weight:700;font-style:italic;color:var(--ink);letter-spacing:-.025em;line-height:1;
// `;
// const SectionRule = styled.div`flex:1;height:1px;background:var(--border);align-self:center;min-width:24px;`;

// /* ── DOSSIER CARD (Education / Experience) ── */
// const DossierList = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
// const DossierCard = styled.div`
//   display:grid;grid-template-columns:200px 1fr;
//   border:1px solid var(--border);
//   transition:border-color .25s,box-shadow .25s;
//   &:hover{border-color:var(--border2);box-shadow:3px 3px 0 var(--linen2);}
//   @media(max-width:720px){grid-template-columns:1fr;}
// `;
// const DossierMeta = styled.div`
//   background:var(--paper);
//   border-right:1px solid var(--border);
//   padding:1.75rem 1.5rem;
//   display:flex;flex-direction:column;gap:.5rem;
//   @media(max-width:720px){border-right:none;border-bottom:1px solid var(--border);}
// `;
// const DossierPeriodLabel = styled.div`font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ink5);margin-bottom:.1rem;`;
// const DossierPeriod = styled.div`font-family:var(--font-serif);font-size:.95rem;font-style:italic;color:var(--coral);font-weight:700;`;
// const DossierTypePill = styled.div`
//   display:inline-block;
//   font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;
//   color:var(--ink4);background:var(--linen);border:1px solid var(--border);
//   padding:.25rem .6rem;margin-top:.25rem;width:fit-content;
// `;
// const DossierScore = styled.div`font-size:.78rem;color:var(--ink3);margin-top:.25rem;`;
// const DossierBody = styled.div`padding:1.75rem 2rem;@media(max-width:720px){padding:1.5rem;}`;
// const DossierTitle = styled.h3`
//   font-family:var(--font-serif);font-size:1.2rem;font-weight:700;
//   color:var(--ink);margin-bottom:.3rem;line-height:1.25;
// `;
// const DossierSub = styled.p`font-size:.875rem;color:var(--coral);font-weight:500;margin-bottom:.625rem;`;
// const DossierDesc = styled.p`font-size:.875rem;color:var(--ink3);line-height:1.8;font-family:var(--font-serif);font-style:italic;`;

// /* ── PROJECT SPOTLIGHT ── */
// const SpotlightList = styled.div`display:flex;flex-direction:column;gap:0;`;
// const Spotlight = styled.div`
//   padding:2.5rem 0;border-bottom:1px solid var(--border);
//   display:grid;grid-template-columns:80px 1fr 200px;gap:2rem;align-items:start;
//   transition:background .2s;cursor:default;
//   &:last-child{border-bottom:none;}
//   &:hover{background:var(--paper);margin:0 -4rem;padding:2.5rem 4rem;}
//   @media(max-width:900px){grid-template-columns:60px 1fr;gap:1.25rem;&:hover{margin:0;padding:2.5rem 0;}}
//   @media(max-width:640px){grid-template-columns:40px 1fr;}
// `;
// const SpotlightNum = styled.div`
//   font-family:var(--font-serif);font-size:2.5rem;font-weight:700;
//   color:var(--linen2);line-height:1;text-align:right;
//   @media(max-width:640px){font-size:1.75rem;}
// `;
// const SpotlightMain = styled.div``;
// const SpotlightTitle = styled.h3`
//   font-family:var(--font-serif);font-size:1.35rem;font-weight:700;
//   color:var(--ink);margin-bottom:.5rem;line-height:1.2;
// `;
// const SpotlightDesc = styled.p`font-size:.875rem;color:var(--ink3);line-height:1.8;margin-bottom:.875rem;font-family:var(--font-serif);`;
// const TechPills = styled.div`display:flex;flex-wrap:wrap;gap:.375rem;margin-bottom:.875rem;`;
// const TechPill = styled.span`
//   font-size:.7rem;font-weight:500;letter-spacing:.04em;
//   color:var(--ink2);background:var(--linen);border:1px solid var(--border);
//   padding:.28rem .7rem;
// `;
// const SpotlightLinks = styled.div`
//   display:flex;flex-direction:column;gap:.375rem;
//   @media(max-width:900px){flex-direction:row;margin-top:.5rem;}
// `;
// const SpotlightLink = styled.a`
//   display:inline-flex;align-items:center;gap:.4rem;
//   font-size:.75rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;
//   color:var(--ink);border:1px solid var(--border);
//   padding:.5rem .875rem;text-decoration:none;transition:all .2s;
//   svg{width:11px;height:11px;}
//   &:hover{background:var(--ink);color:var(--parchment);border-color:var(--ink);}
// `;

// /* ── SKILLS: inline categorized list ── */
// const SkillsBody = styled.div`display:flex;flex-direction:column;gap:1.5rem;`;
// const SkillGroup = styled.div`
//   display:grid;grid-template-columns:180px 1fr;gap:1.5rem;
//   padding-bottom:1.5rem;border-bottom:1px solid var(--border);
//   &:last-child{border-bottom:none;padding-bottom:0;}
//   @media(max-width:640px){grid-template-columns:1fr;gap:.625rem;}
// `;
// const SkillGroupLabel = styled.div`
//   font-family:var(--font-serif);font-size:.95rem;font-style:italic;font-weight:700;
//   color:var(--ink2);padding-top:.3rem;
// `;
// const SkillItems = styled.div`display:flex;flex-wrap:wrap;gap:.5rem;align-content:flex-start;`;
// const SkillItem = styled.span`
//   font-size:.875rem;color:var(--ink2);background:var(--parchment);
//   border:1px solid var(--border);padding:.4rem .875rem;
//   cursor:default;transition:all .2s;
//   &:hover{background:var(--ink);color:var(--parchment);}
// `;

// /* ── CERT LIST ── */
// const CertRows = styled.div`display:flex;flex-direction:column;gap:0;`;
// const CertRow = styled.div`
//   display:flex;align-items:center;justify-content:space-between;gap:1.5rem;
//   padding:1.25rem 0;border-bottom:1px solid var(--border);
//   &:first-child{padding-top:0;}&:last-child{border-bottom:none;}
//   transition:background .15s;
//   &:hover{background:var(--paper);margin:0 -4rem;padding:1.25rem 4rem;}
//   @media(max-width:900px){&:hover{margin:0;padding:1.25rem 0;}}
//   flex-wrap:wrap;
// `;
// const CertRowLeft = styled.div``;
// const CertRowName = styled.h3`font-family:var(--font-serif);font-size:1.05rem;font-weight:700;color:var(--ink);margin-bottom:.25rem;`;
// const CertRowIssuer = styled.p`font-size:.8rem;color:var(--ink4);`;
// const CertRowLink = styled.a`
//   display:inline-flex;align-items:center;gap:.4rem;
//   font-size:.72rem;font-weight:500;letter-spacing:.06em;text-transform:uppercase;
//   color:var(--ink3);border:1px solid var(--border);
//   padding:.45rem .875rem;text-decoration:none;white-space:nowrap;transition:all .2s;
//   svg{width:11px;height:11px;}
//   &:hover{background:var(--ink);color:var(--parchment);}
// `;

// /* ── INTERESTS ── */
// const InterestList = styled.div`
//   column-count:3;column-gap:2rem;
//   @media(max-width:768px){column-count:2;}
//   @media(max-width:480px){column-count:1;}
// `;
// const InterestItem = styled.div`
//   break-inside:avoid;padding:.625rem 0;border-bottom:1px solid var(--border);
//   font-family:var(--font-serif);font-size:1rem;font-style:italic;color:var(--ink2);
//   cursor:default;transition:color .2s;
//   &::before{content:'— ';color:var(--coral);}
//   &:hover{color:var(--coral);}
// `;

// /* ── EMPTY ── */
// const Empty = styled.div`
//   padding:3rem 0;color:var(--ink5);font-style:italic;
//   font-family:var(--font-serif);font-size:.9rem;
// `;

// /* ── LOADING / ERROR ── */
// const LoadWrap = styled.div`min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1.5rem;background:var(--parchment);`;
// const Spinner = styled.div`width:28px;height:28px;border:1.5px solid var(--border);border-top-color:var(--coral);border-radius:50%;animation:${spin} .8s linear infinite;`;
// const LoadBar = styled.div`width:100px;height:1px;background:linear-gradient(90deg,var(--linen2) 0%,var(--coral) 50%,var(--linen2) 100%);background-size:600px;animation:${shimmer} 1.6s linear infinite;`;
// const LoadLbl = styled.p`font-family:var(--font-serif);font-size:.72rem;font-style:italic;color:var(--ink5);`;
// const ErrWrap = styled.div`min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;background:var(--parchment);`;
// const ErrBox = styled.div`background:var(--paper);border:2px solid var(--ink);padding:4rem 3rem;max-width:420px;width:100%;text-align:center;animation:${fadeUp} .5s ease both;box-shadow:6px 6px 0 var(--linen2);`;
// const ErrTitle = styled.h2`font-family:var(--font-serif);font-size:2rem;font-weight:700;font-style:italic;color:var(--ink);margin:1rem 0 .75rem;`;
// const ErrMsg = styled.p`font-family:var(--font-serif);font-style:italic;font-size:.9rem;color:var(--ink3);line-height:1.7;margin-bottom:2rem;`;
// const ErrBtn = styled.button`display:inline-flex;align-items:center;gap:.5rem;padding:.875rem 2rem;background:var(--ink);color:var(--parchment);border:2px solid var(--ink);font-family:var(--font-sans);font-size:.875rem;font-weight:500;cursor:pointer;transition:all .2s;&:hover{background:var(--coral);border-color:var(--coral);}svg{width:15px;height:15px;}`;

// const SECTION_CONFIG = [
//   { id:'hero', label:'Introduction', icon: User },
//   { id:'education', label:'Education', icon: BookOpen },
//   { id:'experience', label:'Experience', icon: Briefcase },
//   { id:'projects', label:'Projects', icon: Code2 },
//   { id:'skills', label:'Skills', icon: Layers },
//   { id:'certifications', label:'Certifications', icon: Award },
//   { id:'interests', label:'Interests', icon: Sparkles },
// ];

// const PublicProfilePage = () => {
//   const { username } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [imageUrls, setImageUrls] = useState({});
//   const [activeSection, setActiveSection] = useState('hero');
//   const [showOverlay, setShowOverlay] = useState(() => sessionStorage.getItem('overlayDismissed') === 'true' ? false : !user);
//   const [isClosing, setIsClosing] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(10);
//   const sectionRefs = useRef({});

//   useEffect(() => {
//     if (!showOverlay) return;
//     const t = setInterval(() => {
//       setTimeLeft(p => { if (p <= 1) { handleClose(); return 0; } return p - 1; });
//     }, 1000);
//     return () => clearInterval(t);
//   }, [showOverlay]);

//   const handleClose = () => {
//     setIsClosing(true);
//     sessionStorage.setItem('overlayDismissed', 'true');
//     setTimeout(() => setShowOverlay(false), 400);
//   };

//   useEffect(() => {
//     const obs = new IntersectionObserver((entries) => {
//       entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.dataset.sec); });
//     }, { threshold: 0.3, rootMargin: '-60px 0px -40% 0px' });
//     Object.values(sectionRefs.current).forEach(r => r && obs.observe(r));
//     return () => obs.disconnect();
//   }, [portfolio]);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await publicService.getPortfolio(username);
//         setPortfolio(data);
//         const paths = [];
//         if (data.profile?.profilePhoto) paths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
//         const urlMap = {};
//         await Promise.all(paths.map(async ({ key, path }) => {
//           try { const url = await publicService.getSignedUrl(path); if (url) urlMap[key] = url; } catch {}
//         }));
//         setImageUrls(urlMap);
//       } catch (err) { setError(err.message || 'Profile not found'); }
//       finally { setLoading(false); }
//     };
//     if (username) load();
//   }, [username]);

//   const scrollTo = (id) => sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });

//   if (loading) return (<><GlobalStyle /><LoadWrap><Spinner /><LoadBar /><LoadLbl>Loading profile...</LoadLbl></LoadWrap></>);
//   if (error || !portfolio) return (
//     <><GlobalStyle /><ErrWrap><ErrBox>
//       <AlertCircle size={32} color="var(--coral)" />
//       <ErrTitle>{error ? 'Not Found' : 'No Portfolio'}</ErrTitle>
//       <ErrMsg>{error || "This profile hasn't been published yet."}</ErrMsg>
//       <ErrBtn onClick={() => navigate('/')}><Home size={15} /> Return Home</ErrBtn>
//     </ErrBox></ErrWrap></>
//   );

//   const { profile = {}, education = [], experience = [], projects = [], skills = {}, certifications = [], interests = {} } = portfolio;
//   const fullName = profile.name || 'Anonymous';
//   const [firstName, ...rest] = fullName.split(' ');
//   const lastName = rest.join(' ') || '';
//   const skillCats = skills.skills || [];
//   const socialLinks = (profile.social || []).filter(item => !!buildSocialHref(item));
//   const cvLink = profile.cvLink?.trim() || null;

//   const hasSection = (id) => {
//     if (id === 'hero') return true;
//     if (id === 'education') return education.length > 0;
//     if (id === 'experience') return experience.length > 0;
//     if (id === 'projects') return projects.length > 0;
//     if (id === 'skills') return skillCats.length > 0;
//     if (id === 'certifications') return certifications.length > 0;
//     if (id === 'interests') return interests?.interests?.length > 0;
//     return false;
//   };

//   const visibleSections = SECTION_CONFIG.filter(s => hasSection(s.id));
//   let sectionCounter = 0;

//   return (
//     <>
//       <GlobalStyle />

//       <OvBg $s={showOverlay}>
//         <OvBox $c={isClosing}>
//           <OvClose onClick={handleClose}><X /></OvClose>
//           <OvEye>Portfolio Platform</OvEye>
//           <OvTitle>Create Yours</OvTitle>
//           <OvDesc>Build a refined professional presence and share your story with the world.</OvDesc>
//           <OvTimer>Closes in {timeLeft} seconds</OvTimer>
//           <OvBtns>
//             <OvBtn $p onClick={() => navigate('/login')}>Sign In</OvBtn>
//             <OvBtn onClick={() => navigate('/register')}>Register</OvBtn>
//           </OvBtns>
//         </OvBox>
//       </OvBg>

//       <Shell>
//         {/* SIDEBAR */}
//         <Sidebar>
//           <SidebarTop>
//             <SidebarName>{fullName}</SidebarName>
//             <SidebarRole>{profile.domain || 'Portfolio'}</SidebarRole>
//           </SidebarTop>
//           <SidebarNavLabel>Sections</SidebarNavLabel>
//           <SidebarNav>
//             {visibleSections.map(({ id, label, icon: Icon }) => (
//               <SidebarNavItem key={id} $a={activeSection===id} onClick={() => scrollTo(id)}>
//                 <Icon />{label}
//               </SidebarNavItem>
//             ))}
//           </SidebarNav>
//           <SidebarBottom>
//             <SidebarNavBtn onClick={() => navigate(-1)}><ChevronLeft size={12} />Back</SidebarNavBtn>
//             <SidebarNavBtn onClick={() => navigate('/')}><Home size={12} />Home</SidebarNavBtn>
//           </SidebarBottom>
//         </Sidebar>

//         {/* MAIN */}
//         <Main>
//           {/* HERO */}
//           <HeroSection data-sec="hero" ref={r => sectionRefs.current['hero'] = r} id="section-hero">
//             <HeroEye><HeroEyeLine /><HeroEyeText>{profile.domain || 'Professional Portfolio'}</HeroEyeText></HeroEye>
//             <HeroTitle>
//               {firstName}<br />
//               <HeroTitleItalic>{lastName || firstName}</HeroTitleItalic>
//             </HeroTitle>
//             <HeroDivider />
//             <HeroGrid>
//               <div>
//                 {profile.summary && <HeroSummary>"{profile.summary}"</HeroSummary>}
//                 {(socialLinks.length > 0 || cvLink) && (
//                   <HeroSocials style={{marginTop: profile.summary ? '1.5rem' : 0}}>
//                     {socialLinks.map(item => {
//                       const meta = SOCIAL_ICON_MAP[item.icon] || SOCIAL_ICON_MAP.ExternalLink;
//                       const Icon = meta.icon;
//                       return <HeroSocial key={item._id||item.id} href={buildSocialHref(item)} target="_blank" rel="noopener noreferrer"><Icon /></HeroSocial>;
//                     })}
//                     {cvLink && <HeroResume href={cvLink} target="_blank" rel="noopener noreferrer"><FileText />Resume</HeroResume>}
//                   </HeroSocials>
//                 )}
//               </div>
//               <div>
//                 <div style={{display:'flex',gap:'1.5rem',alignItems:'flex-start'}}>
//                   <HeroAvatarFrame>
//                     {imageUrls.profilePhoto ? <HeroAvatarImg src={imageUrls.profilePhoto} alt={fullName} /> : <HeroAvatarPH><User /></HeroAvatarPH>}
//                   </HeroAvatarFrame>
//                   <HeroInfo>
//                     {profile.email && <HeroInfoRow><Mail /><span>{profile.email}</span></HeroInfoRow>}
//                     {profile.phone && <HeroInfoRow><Phone /><span>{profile.phone}</span></HeroInfoRow>}
//                     {profile.location && <HeroInfoRow><MapPin /><span>{profile.location}</span></HeroInfoRow>}
//                   </HeroInfo>
//                 </div>
//               </div>
//             </HeroGrid>
//           </HeroSection>

//           {/* EDUCATION */}
//           {education.length > 0 && (
//             <ContentSection data-sec="education" ref={r => sectionRefs.current['education'] = r} id="section-education" $d="0.15s">
//               <SectionHead>
//                 <SectionNum>0{++sectionCounter}</SectionNum>
//                 <SectionTitle>Education</SectionTitle>
//                 <SectionRule />
//               </SectionHead>
//               <DossierList>
//                 {education.map((edu, i) => {
//                   const dur = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'N/A';
//                   const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : edu.percentage ? `${edu.percentage}%` : null;
//                   return (
//                     <DossierCard key={edu._id||i}>
//                       <DossierMeta>
//                         <DossierPeriodLabel>Duration</DossierPeriodLabel>
//                         <DossierPeriod>{dur}</DossierPeriod>
//                         <DossierTypePill>Academic</DossierTypePill>
//                         {score && <DossierScore>{score}</DossierScore>}
//                       </DossierMeta>
//                       <DossierBody>
//                         <DossierTitle>{na(edu.institution)}</DossierTitle>
//                         <DossierSub>{na(edu.course)}</DossierSub>
//                       </DossierBody>
//                     </DossierCard>
//                   );
//                 })}
//               </DossierList>
//             </ContentSection>
//           )}

//           {/* EXPERIENCE */}
//           {experience.length > 0 && (
//             <ContentSection data-sec="experience" ref={r => sectionRefs.current['experience'] = r} id="section-experience" $d="0.18s">
//               <SectionHead>
//                 <SectionNum>0{++sectionCounter}</SectionNum>
//                 <SectionTitle>Experience</SectionTitle>
//                 <SectionRule />
//               </SectionHead>
//               <DossierList>
//                 {experience.map((exp, i) => (
//                   <DossierCard key={exp._id||i}>
//                     <DossierMeta>
//                       <DossierPeriodLabel>Tenure</DossierPeriodLabel>
//                       <DossierPeriod>{exp.duration || 'N/A'}</DossierPeriod>
//                       {exp.type && <DossierTypePill>{exp.type}</DossierTypePill>}
//                     </DossierMeta>
//                     <DossierBody>
//                       <DossierTitle>{na(exp.role)}</DossierTitle>
//                       <DossierSub>{na(exp.company)}</DossierSub>
//                       {exp.description && <DossierDesc>{exp.description}</DossierDesc>}
//                     </DossierBody>
//                   </DossierCard>
//                 ))}
//               </DossierList>
//             </ContentSection>
//           )}

//           {/* PROJECTS */}
//           {projects.length > 0 && (
//             <ContentSection data-sec="projects" ref={r => sectionRefs.current['projects'] = r} id="section-projects" $d="0.2s">
//               <SectionHead>
//                 <SectionNum>0{++sectionCounter}</SectionNum>
//                 <SectionTitle>Projects</SectionTitle>
//                 <SectionRule />
//               </SectionHead>
//               <SpotlightList>
//                 {projects.map((proj, i) => (
//                   <Spotlight key={proj._id||i}>
//                     <SpotlightNum>{String(i+1).padStart(2,'0')}</SpotlightNum>
//                     <SpotlightMain>
//                       <SpotlightTitle>{na(proj.title)}</SpotlightTitle>
//                       {proj.description && <SpotlightDesc>{proj.description}</SpotlightDesc>}
//                       {proj.tech?.length > 0 && <TechPills>{proj.tech.map((t,j)=><TechPill key={j}>{t}</TechPill>)}</TechPills>}
//                     </SpotlightMain>
//                     {(proj.demo || proj.repo) && (
//                       <SpotlightLinks>
//                         {proj.demo && <SpotlightLink href={proj.demo} target="_blank" rel="noopener noreferrer">Live <ArrowUpRight /></SpotlightLink>}
//                         {proj.repo && <SpotlightLink href={proj.repo} target="_blank" rel="noopener noreferrer">Repo <Github /></SpotlightLink>}
//                       </SpotlightLinks>
//                     )}
//                   </Spotlight>
//                 ))}
//               </SpotlightList>
//             </ContentSection>
//           )}

//           {/* SKILLS */}
//           {skillCats.length > 0 && (
//             <ContentSection data-sec="skills" ref={r => sectionRefs.current['skills'] = r} id="section-skills" $d="0.22s">
//               <SectionHead>
//                 <SectionNum>0{++sectionCounter}</SectionNum>
//                 <SectionTitle>Skills</SectionTitle>
//                 <SectionRule />
//               </SectionHead>
//               <SkillsBody>
//                 {skillCats.map((cat, idx) => (
//                   <SkillGroup key={cat._id||idx}>
//                     <SkillGroupLabel>{cat.category}</SkillGroupLabel>
//                     <SkillItems>{cat.items.map((item,i)=><SkillItem key={i}>{item}</SkillItem>)}</SkillItems>
//                   </SkillGroup>
//                 ))}
//               </SkillsBody>
//             </ContentSection>
//           )}

//           {/* CERTIFICATIONS */}
//           {certifications.length > 0 && (
//             <ContentSection data-sec="certifications" ref={r => sectionRefs.current['certifications'] = r} id="section-certifications" $d="0.24s">
//               <SectionHead>
//                 <SectionNum>0{++sectionCounter}</SectionNum>
//                 <SectionTitle>Certifications</SectionTitle>
//                 <SectionRule />
//               </SectionHead>
//               <CertRows>
//                 {certifications.map((cert, i) => (
//                   <CertRow key={cert._id||i}>
//                     <CertRowLeft>
//                       <CertRowName>{na(cert.name)}</CertRowName>
//                       <CertRowIssuer>Issued by {na(cert.issuer)}</CertRowIssuer>
//                     </CertRowLeft>
//                     {cert.link && <CertRowLink href={cert.link} target="_blank" rel="noopener noreferrer">View Credential <ArrowUpRight /></CertRowLink>}
//                   </CertRow>
//                 ))}
//               </CertRows>
//             </ContentSection>
//           )}

//           {/* INTERESTS */}
//           {interests?.interests?.length > 0 && (
//             <ContentSection data-sec="interests" ref={r => sectionRefs.current['interests'] = r} id="section-interests" $d="0.26s">
//               <SectionHead>
//                 <SectionNum>0{++sectionCounter}</SectionNum>
//                 <SectionTitle>Interests</SectionTitle>
//                 <SectionRule />
//               </SectionHead>
//               <InterestList>
//                 {interests.interests.map((item,i)=><InterestItem key={i}>{item}</InterestItem>)}
//               </InterestList>
//             </ContentSection>
//           )}

//         </Main>
//       </Shell>
//     </>
//   );
// };

// export default PublicProfilePage;



// ====================== Tempelte 10 ===================// 
