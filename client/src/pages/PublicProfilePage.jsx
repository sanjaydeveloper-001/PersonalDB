import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import {
  Mail, MapPin, Globe, Linkedin, Github, ExternalLink,
  Code2, Award, Briefcase, BookOpen, User, Home,
  AlertCircle, Layers, ArrowUpRight, Sparkles, Phone,
  Calendar, Image as ImageIcon, ChevronLeft, X
} from 'lucide-react';
import { publicService } from '../services/publicService';

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

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideOut = keyframes`
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(20px); }
`;

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
  width: 600px; height: 600px;
  top: -180px; right: -180px;
  background: radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 70%);
  @media(max-width:640px){ width:300px; height:300px; top:-100px; right:-100px; }
`;

const OrbB = styled(Orb)`
  width: 500px; height: 500px;
  bottom: 20vh; left: -200px;
  background: radial-gradient(circle, rgba(29,78,216,0.12) 0%, transparent 70%);
  @media(max-width:640px){ width:250px; height:250px; left:-120px; }
`;

const OrbC = styled(Orb)`
  width: 300px; height: 300px;
  top: 50vh; right: 10vw;
  background: radial-gradient(circle, rgba(147,197,253,0.15) 0%, transparent 70%);
  @media(max-width:640px){ display:none; }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem 6rem;
  @media(max-width:640px){ padding: 0 1rem 4rem; }
`;

/* ─────────────── LOGIN OVERLAY (NON-BLOCKING) ─────────────── */
const OverlayContainer = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, ${p => p.$show ? '0.5' : '0'});
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${p => p.$show ? '9999' : '-1'};
  padding: 1rem;
  animation: ${p => p.$show ? fadeIn : 'none'} 0.3s ease;
  backdrop-filter: ${p => p.$show ? 'blur(4px)' : 'none'};
  pointer-events: ${p => p.$show ? 'auto' : 'none'};
  transition: all 0.3s ease;
`;

const OverlayContent = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2.5rem 2rem;
  max-width: 450px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
  position: relative;
  animation: ${p => p.$isClosing ? slideOut : slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1);

  @media (max-width: 640px) {
    padding: 2rem 1.5rem;
    border-radius: 12px;
  }

  @media (max-width: 480px) {
    padding: 1.75rem 1.25rem;
    max-width: 90%;
  }
`;

const CloseOverlayBtn = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #f1f5f9;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  transition: all 0.2s ease;

  &:hover {
    background: #e2e8f0;
    color: #1e40af;
    transform: rotate(90deg);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const OverlayIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
  animation: ${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;

  svg {
    width: 40px;
    height: 40px;
    color: white;
  }

  @media (max-width: 480px) {
    width: 70px;
    height: 70px;
    svg { width: 35px; height: 35px; }
  }
`;

const OverlayTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.75rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both;

  @media (max-width: 640px) {
    font-size: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
  }
`;

const OverlayDesc = styled.p`
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;

  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
`;

const TimerText = styled.p`
  color: #1e40af;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  animation: ${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.25s both;
`;

const OverlayButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: ${slideUp} 0.4s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;

  @media (max-width: 540px) {
    flex-direction: column;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const OverlayBtn = styled.button`
  padding: 0.85rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', system-ui, sans-serif;

  ${props => props.$primary ? `
    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
    }

    &:active {
      transform: translateY(0);
    }
  ` : `
    background: #f1f5f9;
    color: #1e40af;
    border: 2px solid #dbeafe;

    &:hover {
      background: #eff6ff;
      border-color: #3b82f6;
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  `}

  @media (max-width: 540px) {
    width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

/* ─────────────── TOP NAV ─────────────── */
const TopNav = styled.div`
  position: relative;
  z-index: 10;
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem 1.5rem 0;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  @media(max-width:640px){ padding: 1rem 1rem 0; gap: 0.875rem; }
`;

const NavBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--blue-vivid);
  background: transparent;
  border: none;
  padding: 0.25rem 0;
  cursor: pointer;
  text-decoration: none;
  transition: color 0.2s ease, gap 0.2s ease;
  white-space: nowrap;
  svg { width: 0.9rem; height: 0.9rem; flex-shrink: 0; }
  &:hover {
    color: var(--blue-deep);
    gap: 0.6rem;
  }
  @media(max-width:400px){ font-size: 0.8rem; }
`;

const NavDivider = styled.span`
  width: 1px;
  height: 1.25rem;
  background: var(--blue-border);
  flex-shrink: 0;
`;

/* ─────────────── HERO ─────────────── */
const HeroSection = styled.div`
  padding: 2.5rem 0 0;
  margin-bottom: 2.5rem;
  @media(max-width:640px){ padding: 1.75rem 0 0; margin-bottom: 2rem; }
`;

const HeroGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 2.5rem;
  align-items: end;
  @media(max-width:900px){ grid-template-columns: 1fr; gap: 2rem; }
`;

const HeroLeft = styled.div`
  animation: ${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) both;
  min-width: 0;
`;

const EyebrowRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
`;

const Eyebrow = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--blue-mid);
  background: var(--blue-ghost);
  border: 1px solid var(--blue-border);
  padding: 0.35rem 1rem;
  border-radius: 99px;
`;

const EyebrowDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--gold);
  animation: ${glowPulse} 2s ease infinite;
  flex-shrink: 0;
`;

const HeroName = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.05;
  color: var(--ink);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
  word-break: break-word;
  em {
    font-style: italic;
    background: linear-gradient(135deg, var(--blue-vivid) 0%, #0ea5e9 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const HeroDomain = styled.p`
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: var(--ink-muted);
  font-weight: 400;
  margin-bottom: 1.75rem;
  @media(max-width:480px){ margin-bottom: 1.25rem; }
`;

const HeroMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-bottom: 1.75rem;
  @media(max-width:480px){ gap: 0.5rem; margin-bottom: 1.25rem; }
`;

const MetaPill = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.825rem;
  color: var(--ink-soft);
  background: var(--surface);
  border: 1px solid var(--blue-border);
  padding: 0.45rem 0.875rem;
  border-radius: 99px;
  box-shadow: 0 2px 8px rgba(15,45,107,0.06);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  svg { width: 0.8rem; height: 0.8rem; color: var(--blue-mid); flex-shrink: 0; }
  @media(max-width:480px){ font-size: 0.775rem; }
`;

const HeroSocials = styled.div`
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
`;

const SocialIcon = styled.a`
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 2.4rem; height: 2.4rem;
  background: var(--surface);
  border: 1.5px solid var(--blue-border);
  border-radius: 50%;
  color: var(--blue-vivid);
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 2px 8px rgba(15,45,107,0.06);
  &:hover {
    background: var(--blue-vivid);
    color: white;
    border-color: var(--blue-vivid);
    transform: translateY(-4px) scale(1.1);
    box-shadow: 0 8px 24px rgba(29,78,216,0.35);
  }
  svg { width: 0.95rem; height: 0.95rem; }
`;

/* ─────────────── HERO RIGHT ─────────────── */
const HeroRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.25rem;
  animation: ${fadeUp} 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both;

  @media(max-width:900px){
    flex-direction: row;
    align-items: flex-start;
    gap: 1.5rem;
  }
  @media(max-width:540px){
    flex-direction: column;
    align-items: flex-start;
    gap: 1.25rem;
  }
`;

/* ─────────────── AVATAR ─────────────── */
const AvatarFrame = styled.div`
  position: relative;
  width: 220px; height: 260px;
  flex-shrink: 0;
  @media(max-width:900px){ width: 180px; height: 210px; }
  @media(max-width:540px){ width: 130px; height: 155px; }
  @media(max-width:380px){ width: 110px; height: 130px; }
`;

const AvatarBg = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(145deg, var(--blue-vivid), #0ea5e9);
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  opacity: 0.18;
`;

const AvatarRing = styled.div`
  position: absolute;
  inset: -8px;
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  border: 2px dashed rgba(59,130,246,0.3);
  animation: ${spin} 20s linear infinite;
`;

const AvatarImg = styled.img`
  position: absolute;
  inset: 12px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  object-fit: cover;
  border-radius: 35% 55% 50% 45% / 45% 40% 55% 50%;
  box-shadow: var(--shadow-card);
`;

const AvatarPlaceholder = styled.div`
  position: absolute;
  inset: 12px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  background: linear-gradient(145deg, var(--blue-ghost), #dbeafe);
  border-radius: 35% 55% 50% 45% / 45% 40% 55% 50%;
  display: flex; align-items: center; justify-content: center;
  svg { width: 3.5rem; height: 3.5rem; color: var(--blue-mid); opacity: 0.5; }
  @media(max-width:540px){ svg { width: 2.5rem; height: 2.5rem; } }
`;

const StatsBadge = styled.div`
  background: var(--surface);
  border: 1px solid var(--blue-border);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  box-shadow: var(--shadow-card);
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;

  @media(max-width:900px){
    flex-direction: column;
    gap: 0.75rem;
    padding: 1rem;
    align-self: center;
  }
  @media(max-width:540px){
    flex-direction: row;
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  text-align: center;
  @media(max-width:900px){ text-align: left; display: flex; align-items: center; gap: 0.5rem; }
  span:first-child {
    display: block;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--blue-vivid);
    font-family: var(--font-display);
    @media(max-width:900px){ font-size: 1.2rem; }
  }
  span:last-child {
    font-size: 0.7rem;
    color: var(--ink-faint);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    font-weight: 600;
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
  border-radius: var(--radius-xl);
  padding: 2.25rem 2.5rem;
  margin-bottom: 2.75rem;
  position: relative;
  overflow: hidden;
  animation: ${fadeUp} 0.6s cubic-bezier(0.22,1,0.36,1) 0.2s both;
  opacity: 0;
  animation-fill-mode: forwards;
  &::before {
    content: '"';
    position: absolute;
    top: -1rem; left: 1.5rem;
    font-family: var(--font-display);
    font-size: 10rem;
    color: rgba(255,255,255,0.07);
    line-height: 1;
    pointer-events: none;
  }
  @media(max-width:640px){
    padding: 1.5rem 1.25rem;
    border-radius: var(--radius-lg);
    &::before { font-size: 7rem; top: -0.5rem; }
  }
`;

const SummaryText = styled.p`
  font-size: clamp(0.95rem, 2vw, 1.15rem);
  color: rgba(255,255,255,0.92);
  line-height: 1.8;
  font-style: italic;
  font-family: var(--font-display);
  position: relative;
  z-index: 1;
  max-width: 800px;
`;

/* ─────────────── SECTION ─────────────── */
const SectionWrap = styled.div`
  margin-bottom: 2.75rem;
  animation: ${fadeUp} 0.65s cubic-bezier(0.22,1,0.36,1) ${p => p.delay || '0s'} both;
  opacity: 0;
  animation-fill-mode: forwards;
  @media(max-width:640px){ margin-bottom: 2.25rem; }
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
  @media(max-width:640px){ margin-bottom: 1.25rem; }
`;

const LabelLine = styled.div`
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, var(--blue-border), transparent);
`;

const LabelText = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 1.6rem);
  font-weight: 700;
  color: var(--ink);
  white-space: nowrap;
  letter-spacing: -0.01em;
`;

const LabelIcon = styled.div`
  width: 2.5rem; height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(29,78,216,0.3);
  flex-shrink: 0;
  svg { width: 1.05rem; height: 1.05rem; color: white; }
  @media(max-width:480px){ width: 2.25rem; height: 2.25rem; }
`;

/* ─────────────── TIMELINE ─────────────── */
const Timeline = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimelineItem = styled.div`
  display: grid;
  grid-template-columns: 160px 40px 1fr;
  min-width: 0;
  @media(max-width:720px){ grid-template-columns: 0px 28px 1fr; }
  @media(max-width:480px){ grid-template-columns: 0px 22px 1fr; }
`;

const TimelineDate = styled.div`
  padding: 0 1.25rem 2.25rem 0;
  text-align: right;
  @media(max-width:720px){ display:none; }
`;

const DateLabel = styled.span`
  display: inline-block;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--blue-vivid);
  background: var(--blue-ghost);
  border: 1px solid var(--blue-border);
  padding: 0.3rem 0.7rem;
  border-radius: 99px;
  letter-spacing: 0.04em;
`;

const TimelineSpine = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  overflow: visible;
`;

const SpineDot = styled.div`
  width: 12px; height: 12px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  border: 2px solid var(--surface);
  box-shadow: 0 0 0 2px var(--blue-border), 0 4px 12px rgba(29,78,216,0.3);
  flex-shrink: 0;
  margin-top: 1.5rem;
  z-index: 1;
  @media(max-width:480px){ width: 9px; height: 9px; margin-top: 1.25rem; }
`;

const SpineLine = styled.div`
  flex: 1;
  width: 2px;
  background: linear-gradient(to bottom, var(--blue-light), rgba(147,197,253,0.1));
  margin-top: 4px;
`;

const TimelineBody = styled.div`
  padding: 0 0 2.25rem 1.25rem;
  min-width: 0;
  @media(max-width:720px){ padding: 0 0 1.75rem 0.875rem; }
  @media(max-width:480px){ padding: 0 0 1.5rem 0.625rem; }
`;

const TimelineCard = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem;
  border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card);
  transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  position: relative;
  overflow: hidden;
  min-width: 0;
  word-break: break-word;
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--blue-vivid), #0ea5e9);
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover {
    transform: translateY(-4px) translateX(2px);
    box-shadow: var(--shadow-hover);
    border-color: var(--blue-light);
    &::before { opacity: 1; }
  }
  @media(max-width:480px){ padding: 1.125rem 1rem; }
`;

const CardTitle = styled.h3`
  font-size: clamp(0.925rem, 2vw, 1.05rem);
  font-weight: 700;
  color: var(--ink);
  margin-bottom: 0.2rem;
  letter-spacing: -0.01em;
  overflow-wrap: break-word;
`;

const CardSub = styled.p`
  font-size: 0.85rem;
  color: var(--blue-vivid);
  font-weight: 600;
  margin-bottom: 0.6rem;
  overflow-wrap: break-word;
`;

const CardDateMobile = styled.span`
  display: none;
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--ink-faint);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.65rem;
  @media(max-width:720px){ display:block; }
`;

const CardDesc = styled.p`
  font-size: 0.875rem;
  color: var(--ink-soft);
  line-height: 1.75;
  overflow-wrap: break-word;
`;

/* ─────────────── PROJECTS ─────────────── */
const ProjectGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
  @media(max-width:600px){ grid-template-columns: 1fr; gap: 1rem; }
`;

const ProjectCard = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 1.75rem;
  border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
  transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
  position: relative;
  overflow: hidden;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(29,78,216,0.03) 0%, transparent 60%);
    pointer-events: none;
  }
  &:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-hover);
    border-color: var(--blue-light);
  }
  @media(max-width:480px){ padding: 1.375rem; }
`;

const ProjectNum = styled.div`
  font-family: var(--font-display);
  font-size: 3.25rem;
  font-weight: 900;
  color: var(--blue-ghost);
  line-height: 1;
  position: absolute;
  top: 0.875rem; right: 1.1rem;
  pointer-events: none;
  user-select: none;
  @media(max-width:480px){ font-size: 2.75rem; }
`;

const ProjectTitle = styled.h3`
  font-size: clamp(0.975rem, 2vw, 1.1rem);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.01em;
  line-height: 1.3;
  padding-right: 2rem;
`;

const ProjectDesc = styled.p`
  font-size: 0.875rem;
  color: var(--ink-soft);
  line-height: 1.7;
  flex: 1;
`;

const TagRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tech = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--blue-vivid);
  background: var(--blue-ghost);
  border: 1px solid var(--blue-border);
  padding: 0.22rem 0.6rem;
  border-radius: 0.35rem;
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ProjLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.45rem 0.875rem;
  border-radius: 0.6rem;
  text-decoration: none;
  transition: all 0.25s;
  border: 1.5px solid var(--blue-border);
  color: var(--blue-vivid);
  background: var(--blue-ghost);
  &:hover {
    background: var(--blue-vivid);
    color: white;
    border-color: var(--blue-vivid);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(29,78,216,0.3);
  }
  svg { width: 0.7rem; height: 0.7rem; }
`;

/* ─────────────── SKILLS ─────────────── */
const SkillsLayout = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.1rem;
  @media(max-width:820px){ grid-template-columns: repeat(2, 1fr); }
  @media(max-width:520px){ grid-template-columns: 1fr; gap: 0.875rem; }
`;

const SkillPanel = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card);
`;

const SkillPanelTitle = styled.h4`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--blue-mid);
  margin-bottom: 1.1rem;
  padding-bottom: 0.7rem;
  border-bottom: 1px solid var(--blue-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  &::before {
    content: '';
    width: 7px; height: 7px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
    flex-shrink: 0;
  }
`;

const SkillItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const SkillItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.8rem;
  background: var(--bg);
  border-radius: 0.5rem;
  border: 1px solid transparent;
  transition: all 0.2s;
  cursor: default;
  &:hover {
    background: var(--blue-ghost);
    border-color: var(--blue-border);
  }
  span {
    font-size: 0.85rem;
    font-weight: 500;
    color: var(--ink-soft);
  }
`;

const SkillDot = styled.div`
  width: 6px; height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  flex-shrink: 0;
`;

/* ─────────────── CERTS ─────────────── */
const CertGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.1rem;
  @media(max-width:600px){ grid-template-columns: 1fr; gap: 0.875rem; }
`;

const CertCard = styled.div`
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 1.375rem 1.5rem;
  border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-card);
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  position: relative;
  overflow: hidden;
  &::before {
    content: '✦';
    position: absolute;
    top: 0.875rem; right: 0.875rem;
    color: var(--gold);
    font-size: 1rem;
  }
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-hover);
    border-color: rgba(245,158,11,0.3);
  }
`;

const CertName = styled.h3`
  font-size: 0.975rem;
  font-weight: 700;
  color: var(--ink);
  line-height: 1.35;
  padding-right: 1.5rem;
`;

const CertIssuer = styled.p`
  font-size: 0.825rem;
  font-weight: 600;
  color: var(--blue-vivid);
`;

const CertLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--blue-vivid);
  text-decoration: none;
  margin-top: 0.25rem;
  transition: gap 0.2s;
  &:hover { gap: 0.6rem; }
  svg { width: 0.72rem; height: 0.72rem; }
`;

/* ─────────────── INTERESTS ─────────────── */
const InterestFlow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
`;

const InterestPill = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--blue-vivid);
  background: var(--surface);
  border: 2px solid var(--blue-border);
  padding: 0.55rem 1.25rem;
  border-radius: 99px;
  box-shadow: 0 2px 8px rgba(29,78,216,0.07);
  transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
  cursor: default;
  &:hover {
    background: var(--blue-vivid);
    color: white;
    border-color: var(--blue-vivid);
    transform: translateY(-3px) scale(1.04);
    box-shadow: 0 8px 24px rgba(29,78,216,0.25);
  }
  @media(max-width:480px){ font-size: 0.825rem; padding: 0.45rem 1rem; }
`;

/* ─────────────── EMPTY ─────────────── */
const Empty = styled.div`
  background: var(--surface);
  border: 1.5px dashed var(--blue-border);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
  color: var(--ink-faint);
  font-size: 0.875rem;
  text-align: center;
  svg { width: 2.25rem; height: 2.25rem; opacity: 0.3; }
`;

/* ─────────────── LOADING ─────────────── */
const LoadPage = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  background: var(--bg);
  font-family: var(--font-body);
`;

const Spinner = styled.div`
  width: 3.25rem; height: 3.25rem;
  border: 3px solid var(--blue-border);
  border-top-color: var(--blue-vivid);
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

const LoadText = styled.p`
  font-size: 0.85rem;
  color: var(--ink-faint);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const ShimmerBar = styled.div`
  width: 200px; height: 4px;
  border-radius: 99px;
  background: linear-gradient(90deg, var(--blue-ghost) 0%, var(--blue-border) 40%, var(--blue-ghost) 80%);
  background-size: 800px;
  animation: ${shimmerMove} 1.6s infinite linear;
`;

/* ─────────────── ERROR ─────────────── */
const ErrorWrap = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--bg);
  font-family: var(--font-body);
`;

const ErrorBox = styled.div`
  background: var(--surface);
  border-radius: var(--radius-xl);
  padding: 3rem 2.5rem;
  max-width: 460px;
  width: 100%;
  text-align: center;
  border: 1px solid var(--blue-border);
  box-shadow: var(--shadow-hover);
  animation: ${fadeUp} 0.5s ease both;
  @media(max-width:480px){ padding: 2.5rem 1.75rem; border-radius: var(--radius-lg); }
`;

const ErrorIcon = styled.div`
  width: 4.5rem; height: 4.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--blue-ghost), var(--blue-border));
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1.5rem;
  svg { color: var(--blue-vivid); width: 2rem; height: 2rem; }
`;

const ErrorTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--ink);
  margin-bottom: 0.75rem;
`;

const ErrorMsg = styled.p`
  color: var(--ink-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
  font-size: 0.925rem;
`;

const HomeBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, var(--blue-vivid), #0ea5e9);
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 0.875rem;
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(29,78,216,0.3);
  transition: all 0.25s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(29,78,216,0.4);
  }
`;

/* ─────────────── HELPERS ─────────────── */
const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : null;
const na  = (v) => (v && String(v).trim() !== '') ? v : 'N/A';

/* ═════════════════════════════════════════════════ */
const PublicProfilePage = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageUrls, setImageUrls] = useState({});
  
  // ✅ FIXED: Check sessionStorage first, then check if user exists
  const [showOverlay, setShowOverlay] = useState(() => {
    const dismissed = sessionStorage.getItem('overlayDismissed');
    // If dismissed in session, don't show overlay
    if (dismissed === 'true') return false;
    // Otherwise, show overlay only if user is NOT logged in
    return !user;
  });
  
  const [isClosing, setIsClosing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);

  // ✅ Auto-close overlay after 10 seconds or on manual close
  useEffect(() => {
    if (!showOverlay) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleCloseOverlay();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOverlay]);

  // ✅ Handle close and store in sessionStorage
  const handleCloseOverlay = () => {
    setIsClosing(true);
    // Store in sessionStorage so it doesn't show again in this session
    sessionStorage.setItem('overlayDismissed', 'true');
    setTimeout(() => setShowOverlay(false), 400);
  };

  const fetchImageUrl = async (path) => {
    if (!path) return null;
    try {
      const url = await publicService.getSignedUrl(path);
      return url;
    } catch (err) {
      console.error('Failed to fetch signed URL:', path, err);
      return null;
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await publicService.getPortfolio(username);
        setPortfolio(data);

        const imagePaths = [];
        if (data.profile?.profilePhoto) imagePaths.push({ key: 'profilePhoto', path: data.profile.profilePhoto });
        if (data.projects) {
          data.projects.forEach((proj, idx) => {
            if (proj.image) imagePaths.push({ key: `project_${idx}`, path: proj.image, projectId: proj._id });
          });
        }
        if (data.certifications) {
          data.certifications.forEach((cert, idx) => {
            if (cert.image) imagePaths.push({ key: `cert_${idx}`, path: cert.image, certId: cert._id });
          });
        }

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
        <LoadPage>
          <Spinner />
          <ShimmerBar />
          <LoadText>Loading portfolio</LoadText>
        </LoadPage>
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
            <ErrorMsg>{error || "This user hasn't set up their portfolio yet. Check back soon."}</ErrorMsg>
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

  return (
    <>
      <GlobalStyle />
      
      {/* NON-BLOCKING OVERLAY - Shows for 10 seconds or until closed */}
      <OverlayContainer $show={showOverlay}>
        <OverlayContent $isClosing={isClosing}>
          <CloseOverlayBtn onClick={handleCloseOverlay}>
            <X />
          </CloseOverlayBtn>
          <OverlayIcon>
            <User />
          </OverlayIcon>
          <OverlayTitle>Create Your Public Profile</OverlayTitle>
          <OverlayDesc>
            Share your professional portfolio with the world. Login or create an account to build your public profile today!
          </OverlayDesc>
          <TimerText>Closes in {timeLeft}s</TimerText>
          <OverlayButtons>
            <OverlayBtn 
              $primary 
              onClick={() => navigate('/login')}
            >
              Sign In
            </OverlayBtn>
            <OverlayBtn 
              onClick={() => navigate('/register')}
            >
              Create Account
            </OverlayBtn>
          </OverlayButtons>
        </OverlayContent>
      </OverlayContainer>

      <Page>
        <OrbA dur="9s" delay="0s" />
        <OrbB dur="11s" delay="2s" />
        <OrbC dur="7s" delay="1s" />

        {/* ═══ TOP NAV ═══ */}
        <TopNav>
          <NavBtn onClick={() => navigate(-1)}>
            <ChevronLeft />
            Back
          </NavBtn>
          <NavDivider />
          <NavBtn onClick={() => navigate('/')}>
            <Home />
            Home
          </NavBtn>
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
                  {profile.domain || 'Professional'} &nbsp;·&nbsp; {profile.location || 'Location not set'}
                </HeroDomain>

                <HeroMeta>
                  {profile.email && <MetaPill><Mail /> {profile.email}</MetaPill>}
                  {profile.phone && <MetaPill><Phone /> {profile.phone}</MetaPill>}
                  {profile.location && <MetaPill><MapPin /> {profile.location}</MetaPill>}
                  {!profile.email && !profile.phone && !profile.location && (
                    <MetaPill><User />No contact info added</MetaPill>
                  )}
                </HeroMeta>

                <HeroSocials>
                  {profile.website && <SocialIcon href={profile.website} target="_blank" rel="noopener noreferrer" title="Website"><Globe /></SocialIcon>}
                  {profile.linkedin && <SocialIcon href={profile.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn"><Linkedin /></SocialIcon>}
                  {profile.github && <SocialIcon href={profile.github} target="_blank" rel="noopener noreferrer" title="GitHub"><Github /></SocialIcon>}
                  {profile.email && <SocialIcon href={`mailto:${profile.email}`} title="Email"><Mail /></SocialIcon>}
                </HeroSocials>
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
          <SummaryStrip>
            <SummaryText>
              {profile.summary
                ? `"${profile.summary}"`
                : `"This professional hasn't added their summary yet — but their work speaks for itself. Explore the portfolio below."`}
            </SummaryText>
          </SummaryStrip>

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
                  const durationLabel = edu.duration ? (edu.duration === '1' ? '1 Year' : `${edu.duration} Years`) : 'Duration N/A';
                  const score = edu.cgpa ? `CGPA: ${edu.cgpa}` : (edu.percentage ? `Percentage: ${edu.percentage}%` : null);
                  return (
                    <TimelineItem key={edu._id || i}>
                      <TimelineDate>
                        <DateLabel>{durationLabel}</DateLabel>
                      </TimelineDate>
                      <TimelineSpine>
                        <SpineDot />
                        {i < education.length - 1 && <SpineLine />}
                      </TimelineSpine>
                      <TimelineBody>
                        <TimelineCard>
                          <CardDateMobile>{durationLabel}</CardDateMobile>
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
                {experience.map((exp, i) => {
                  const durationLabel = exp.duration ? exp.duration : 'Duration N/A';
                  return (
                    <TimelineItem key={exp._id || i}>
                      <TimelineDate>
                        <DateLabel>{durationLabel}</DateLabel>
                      </TimelineDate>
                      <TimelineSpine>
                        <SpineDot />
                        {i < experience.length - 1 && <SpineLine />}
                      </TimelineSpine>
                      <TimelineBody>
                        <TimelineCard>
                          <CardDateMobile>{durationLabel}</CardDateMobile>
                          <CardTitle>{na(exp.role)}</CardTitle>
                          <CardSub>{na(exp.company)} {exp.type ? `· ${exp.type}` : ''}</CardSub>
                          {exp.description && <CardDesc>{exp.description}</CardDesc>}
                        </TimelineCard>
                      </TimelineBody>
                    </TimelineItem>
                  );
                })}
              </Timeline>
            ) : (
              <Empty><Briefcase /><span>No experience details added yet</span></Empty>
            )}
          </SectionWrap>


          {/* ═══ Projects ═══ */}
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
                      <TagRow>
                        {proj.tech.map((t, j) => <Tech key={j}>{t}</Tech>)}
                      </TagRow>
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

          {/* ═══ INTERESTS ═══ */}
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