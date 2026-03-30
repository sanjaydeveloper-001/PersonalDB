import { Link } from 'react-router-dom'
import styled, { keyframes, css, createGlobalStyle } from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import SearchBar from '../../components/common/SearchBar'
import {
  Lock, Briefcase, Terminal, User,
  Globe, Key, FolderKanban, GraduationCap,
  BarChart3, FileCode2, Zap, Shield,
  ArrowUpRight, Database, Activity, CheckCircle2,
  TrendingUp, Layers, Cpu, Bell
} from 'lucide-react'

/* ─── Global search z-fix ─────────────────────────────────── */
const GlobalFix = createGlobalStyle`
  /* Ensure search dropdown always floats above everything */
  [class*="SearchBar"], [class*="search"], [class*="Search"] {
    position: relative;
    z-index: 9999 !important;
  }
  [class*="dropdown"], [class*="Dropdown"], [class*="results"], [class*="Results"],
  [class*="suggestions"], [class*="Suggestions"] {
    z-index: 99999 !important;
    position: absolute !important;
  }
`

/* ─── Animations ─────────────────────────────────────────── */
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50%       { transform: scale(1.35); opacity: 0.6; }
`
const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
`
const floatY = keyframes`
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-6px); }
`
const rotateSlow = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
const scanH = keyframes`
  0%   { transform: translateY(-100%); opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.3; }
  100% { transform: translateY(800%); opacity: 0; }
`
const barGrow = keyframes`
  from { transform: scaleY(0); }
  to   { transform: scaleY(1); }
`

const anim = (d = 0) => css`
  opacity: 0;
  animation: ${slideIn} 0.6s cubic-bezier(0.16,1,0.3,1) ${d}ms forwards;
`

/* ─── Layout ─────────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background: transparent;
  padding: 0;
  font-family: 'DM Sans', system-ui, sans-serif;
  color: #0d1117;
`

const Wrap = styled.div`
  width: 100%;
  max-width: 100%;
  padding: 2rem 2.5rem 3.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  @media (max-width: 768px) { padding: 1.25rem 1rem 2.5rem; }
`

/* ─── HEADER ─────────────────────────────────────────────── */
const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1rem 0 0.5rem;
  position: relative;
  z-index: 100;
  ${anim(0)}
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; }
`
const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`
const LogoBadge = styled.div`
  width: 42px; height: 42px; border-radius: 12px;
  background: linear-gradient(135deg, #1e40af, #3b82f6);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(59,130,246,0.35);
  svg { width: 20px; height: 20px; color: #fff; }
`
const HeaderTitle = styled.div``
const AppName = styled.p`
  font-size: 0.65rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.12em; color: #3b82f6; margin: 0;
`
const UserGreet = styled.h1`
  font-size: clamp(1.1rem, 2.5vw, 1.4rem); font-weight: 700;
  color: #0d1117; margin: 0; letter-spacing: -0.02em;
  span { color: #1d4ed8; }
`
const HeaderRight = styled.div`
  display: flex; align-items: center; gap: 0.85rem;
  flex-shrink: 0;
`
const SearchWrap = styled.div`
  position: relative;
  z-index: 9999;
  width: 300px;
  /* Force all children search dropdowns to be visible above everything */
  & > * { position: relative; z-index: 9999; }
  & [class*="dropdown"], & [class*="results"], & [class*="list"],
  & ul, & [role="listbox"], & [role="list"] {
    position: absolute !important;
    z-index: 99999 !important;
    top: 100% !important;
    left: 0 !important;
    right: 0 !important;
  }
  @media (max-width: 768px) { width: 100%; }
`
const IconBtn = styled.button`
  width: 38px; height: 38px; border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #fff; display: flex; align-items: center;
  justify-content: center; cursor: pointer; transition: all 0.15s;
  svg { width: 16px; height: 16px; color: #64748b; }
  &:hover { border-color: #3b82f6; background: #eff6ff;
    svg { color: #3b82f6; } }
`
const NotifDot = styled.span`
  position: absolute; top: 8px; right: 8px;
  width: 6px; height: 6px; border-radius: 50%;
  background: #ef4444;
  animation: ${pulse} 2s ease-in-out infinite;
`

/* ─── HERO BAND ──────────────────────────────────────────── */
const HeroBand = styled.div`
  position: relative; overflow: hidden;
  border-radius: 20px;
  background: linear-gradient(118deg, #0b1b5e 0%, #0f2d8a 35%, #1a4fba 68%, #2563eb 100%);
  padding: 2rem 2.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
  align-items: center;
  ${anim(60)}
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`
const HeroGrid = styled.div`
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
  background-size: 32px 32px;
`
const ScanBar = styled.div`
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent 0%, rgba(99,179,255,0.5) 50%, transparent 100%);
  animation: ${scanH} 4s linear infinite;
  pointer-events: none;
`
const HeroCorner = styled.div`
  position: absolute; top: 0; right: 0;
  width: 260px; height: 100%;
  background: radial-gradient(ellipse at 80% 50%, rgba(96,165,250,0.12) 0%, transparent 70%);
`
const HeroLeft = styled.div`position: relative; z-index: 2;`
const HeroPill = styled.div`
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 99px; padding: 0.3rem 0.9rem;
  font-size: 0.7rem; font-weight: 600; color: rgba(255,255,255,0.85);
  letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 1rem;
`
const PulseDot = styled.span`
  width: 7px; height: 7px; border-radius: 50%; background: #4ade80;
  animation: ${pulse} 1.8s ease-in-out infinite;
`
const HeroH = styled.h2`
  font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 800;
  color: #fff; margin: 0 0 0.6rem; letter-spacing: -0.03em; line-height: 1.2;
`
const HeroSub = styled.p`
  font-size: 0.875rem; color: rgba(255,255,255,0.6);
  margin: 0; line-height: 1.7; max-width: 420px;
`
const HeroMeta = styled.div`
  display: flex; align-items: center; gap: 1.25rem; margin-top: 1.25rem;
`
const MetaBit = styled.div`
  display: flex; align-items: center; gap: 0.4rem;
  font-size: 0.78rem; color: rgba(255,255,255,0.65);
  svg { width: 13px; height: 13px; color: #60a5fa; }
  strong { color: rgba(255,255,255,0.9); font-weight: 600; }
`
const HeroRight = styled.div`
  position: relative; z-index: 2;
  display: flex; gap: 0.85rem;
  @media (max-width: 768px) { display: none; }
`
const MiniBar = styled.div`
  display: flex; flex-direction: column; justify-content: flex-end;
  gap: 4px; height: 90px;
`
const Bar = styled.div`
  width: 8px; border-radius: 4px 4px 0 0;
  background: ${({$color}) => $color || 'rgba(255,255,255,0.25)'};
  height: ${({$h}) => $h}px;
  transform-origin: bottom;
  animation: ${barGrow} 0.8s cubic-bezier(0.16,1,0.3,1) ${({$delay}) => $delay || 0}ms both;
`
const MiniLabel = styled.p`
  font-size: 0.6rem; color: rgba(255,255,255,0.4); margin: 4px 0 0;
  text-align: center; letter-spacing: 0.05em; text-transform: uppercase;
`

/* ─── STATS STRIP ────────────────────────────────────────── */
const StatsStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  ${anim(120)}
  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
`
const Stat = styled.div`
  background: #fff;
  border: 1.5px solid #e8eef6;
  border-radius: 16px;
  padding: 1.25rem 1.4rem;
  display: flex; flex-direction: column; gap: 0.7rem;
  position: relative; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(59,130,246,0.1);
    border-color: rgba(59,130,246,0.25);
  }
  &::after {
    content: '';
    position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: ${({$accent}) => $accent || '#3b82f6'};
    border-radius: 0 0 16px 16px;
    opacity: 0; transition: opacity 0.2s;
  }
  &:hover::after { opacity: 1; }
`
const StatHead = styled.div`display: flex; align-items: flex-start; justify-content: space-between;`
const StatIconBox = styled.div`
  width: 40px; height: 40px; border-radius: 11px;
  background: ${({$bg}) => $bg};
  display: flex; align-items: center; justify-content: center;
  svg { width: 18px; height: 18px; color: ${({$c}) => $c}; }
`
const StatChip = styled.span`
  font-size: 0.65rem; font-weight: 700; border-radius: 6px;
  padding: 0.18rem 0.55rem;
  background: ${({$live}) => $live ? '#f0fdf4' : '#f8fafc'};
  color: ${({$live}) => $live ? '#15803d' : '#94a3b8'};
  border: 1px solid ${({$live}) => $live ? 'rgba(21,128,61,0.15)' : '#f1f5f9'};
`
const StatNumber = styled.p`
  font-size: 1.85rem; font-weight: 800; color: #0d1117;
  margin: 0; letter-spacing: -0.04em; line-height: 1;
`
const StatName = styled.p`font-size: 0.75rem; color: #94a3b8; margin: 0; font-weight: 500;`

/* ─── MAIN GRID ──────────────────────────────────────────── */
const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: 1.25rem;
  ${anim(180)}
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

/* ─── MODULE STATUS ─────────────────────────────────────── */
const Card = styled.div`
  background: #fff;
  border: 1.5px solid #e8eef6;
  border-radius: 18px;
  padding: 1.5rem;
`
const CardHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1.25rem;
`
const CardTitle = styled.h3`
  font-size: 0.875rem; font-weight: 700; color: #0d1117; margin: 0;
  display: flex; align-items: center; gap: 0.5rem;
  svg { width: 15px; height: 15px; color: #3b82f6; }
`
const ViewLink = styled(Link)`
  font-size: 0.73rem; font-weight: 600; color: #3b82f6;
  text-decoration: none; display: flex; align-items: center; gap: 0.2rem;
  transition: gap 0.15s;
  svg { width: 12px; height: 12px; }
  &:hover { gap: 0.4rem; }
`

/* Activity list */
const AList = styled.div`display: flex; flex-direction: column;`
const ARow = styled.div`
  display: flex; align-items: center; gap: 0.8rem;
  padding: 0.7rem 0;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }
`
const AIcon = styled.div`
  width: 34px; height: 34px; border-radius: 10px;
  background: ${({$bg}) => $bg};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  svg { width: 14px; height: 14px; color: ${({$c}) => $c}; }
`
const AInfo = styled.div`flex: 1; min-width: 0;`
const AText = styled.p`font-size: 0.82rem; font-weight: 500; color: #334155; margin: 0;`
const ATime = styled.p`font-size: 0.69rem; color: #b0bec5; margin: 0; margin-top: 1px;`
const ABadge = styled.span`
  font-size: 0.64rem; font-weight: 700; padding: 0.18rem 0.52rem;
  border-radius: 7px; flex-shrink: 0;
  background: ${({$bg}) => $bg}; color: ${({$c}) => $c};
`

/* ─── RIGHT COL ─────────────────────────────────────────── */
const RightCol = styled.div`display: flex; flex-direction: column; gap: 1.25rem;`

/* Module tiles */
const ModuleGrid = styled.div`display: flex; flex-direction: column; gap: 0.6rem;`
const ModuleTile = styled(Link)`
  display: flex; align-items: center; gap: 0.85rem;
  padding: 0.95rem 1.1rem; border-radius: 13px;
  border: 1.5px solid ${({$bor}) => $bor};
  background: ${({$bg}) => $bg};
  text-decoration: none; transition: all 0.17s;
  &:hover { transform: translateX(4px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
`
const ModuleIcon = styled.div`
  width: 38px; height: 38px; border-radius: 10px;
  background: ${({$bg}) => $bg};
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  svg { width: 17px; height: 17px; color: ${({$c}) => $c}; }
`
const ModInfo = styled.div`flex: 1; min-width: 0;`
const ModName = styled.p`font-size: 0.85rem; font-weight: 700; color: #0d1117; margin: 0;`
const ModDesc = styled.p`font-size: 0.72rem; color: #94a3b8; margin: 0;`
const ModStatus = styled.div`
  display: flex; align-items: center; gap: 0.35rem;
  font-size: 0.69rem; font-weight: 600; color: ${({$c}) => $c};
`
const StatusDot = styled.span`
  width: 6px; height: 6px; border-radius: 50%; background: currentColor;
  animation: ${pulse} 2s ease-in-out infinite;
`

/* Quick Jump grid */
const QGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 0.55rem;
`
const QItem = styled(Link)`
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.7rem 0.85rem; border-radius: 11px;
  text-decoration: none;
  background: #f8fafc;
  border: 1.5px solid #f1f5f9;
  font-size: 0.8rem; font-weight: 500; color: #334155;
  transition: all 0.15s;
  svg { width: 14px; height: 14px; color: ${({$c}) => $c}; flex-shrink: 0; }
  &:hover {
    background: ${({$hov}) => $hov};
    border-color: ${({$bor}) => $bor};
    color: #0d1117;
    transform: scale(1.02);
  }
`

/* ─── BOTTOM STRIP ──────────────────────────────────────── */
const BottomStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  ${anim(240)}
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`
const TipCard = styled.div`
  background: ${({$bg}) => $bg || '#fff'};
  border: 1.5px solid ${({$bor}) => $bor || '#e8eef6'};
  border-radius: 16px; padding: 1.25rem;
  display: flex; gap: 0.85rem; align-items: flex-start;
`
const TipIcon = styled.div`
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: ${({$bg}) => $bg};
  display: flex; align-items: center; justify-content: center;
  svg { width: 17px; height: 17px; color: ${({$c}) => $c}; }
`
const TipText = styled.div``
const TipTitle = styled.p`font-size: 0.82rem; font-weight: 700; color: #0d1117; margin: 0 0 0.2rem;`
const TipDesc = styled.p`font-size: 0.74rem; color: #64748b; margin: 0; line-height: 1.55;`

/* ─── Helpers ─────────────────────────────────────────────── */
const timeGreet = () => {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

/* ─── Component ───────────────────────────────────────────── */
const Dashboard = () => {
  const { user } = useAuth()

  const bars = [
    { h: 28, color: 'rgba(255,255,255,0.2)', delay: 200 },
    { h: 48, color: 'rgba(255,255,255,0.3)', delay: 280 },
    { h: 38, color: 'rgba(255,255,255,0.2)', delay: 360 },
    { h: 62, color: 'rgba(96,165,250,0.7)',  delay: 440 },
    { h: 45, color: 'rgba(255,255,255,0.25)',delay: 520 },
    { h: 70, color: 'rgba(96,165,250,0.9)',  delay: 600 },
    { h: 55, color: 'rgba(255,255,255,0.3)', delay: 680 },
    { h: 80, color: '#60a5fa',               delay: 760 },
  ]

  return (
    <Page>
      <GlobalFix />
      <Wrap>

        {/* ── Header ── */}
        <Header>
          <HeaderLeft>
            <LogoBadge><Database /></LogoBadge>
            <HeaderTitle>
              <AppName>PersonalDB · Dashboard</AppName>
              <UserGreet>{timeGreet()}, <span>{user?.username}</span> 👋</UserGreet>
            </HeaderTitle>
          </HeaderLeft>
          <HeaderRight>
            <SearchWrap>
              <SearchBar onSelectUser={(u) => console.log(u)} />
            </SearchWrap>
            <div style={{ position: 'relative' }}>
              <IconBtn><Bell /><NotifDot /></IconBtn>
            </div>
          </HeaderRight>
        </Header>

        {/* ── Hero Band ── */}
        <HeroBand>
          <HeroGrid />
          <ScanBar />
          <HeroCorner />
          <HeroLeft>
            <HeroPill><PulseDot />All systems operational</HeroPill>
            <HeroH>Your personal<br />data universe</HeroH>
            <HeroSub>
              Everything you store, build, and ship — encrypted, organised,
              and accessible in one intelligent workspace.
            </HeroSub>
            <HeroMeta>
              <MetaBit><Shield size={13}/><strong>256-bit</strong> encryption</MetaBit>
              <MetaBit><Cpu size={13}/><strong>3</strong> modules active</MetaBit>
              <MetaBit><TrendingUp size={13}/><strong>100%</strong> uptime</MetaBit>
            </HeroMeta>
          </HeroLeft>
          <HeroRight>
            <div>
              <MiniBar>
                {bars.map((b, i) => (
                  <Bar key={i} $h={b.h} $color={b.color} $delay={b.delay} />
                ))}
              </MiniBar>
              <MiniLabel>Activity</MiniLabel>
            </div>
          </HeroRight>
        </HeroBand>

        {/* ── Stats ── */}
        <StatsStrip>
          {[
            { icon: Lock,     bg: '#eff6ff', c: '#2563eb', accent: '#3b82f6', val: '—',   lab: 'Vault Items',     chip: 'Active', live: true  },
            { icon: Globe,    bg: '#f0fdf4', c: '#16a34a', accent: '#22c55e', val: '1',   lab: 'Public Profile',  chip: 'Live',   live: true  },
            { icon: Key,      bg: '#faf5ff', c: '#7c3aed', accent: '#8b5cf6', val: '—',   lab: 'API Keys',        chip: 'Manage', live: false },
            { icon: BarChart3,bg: '#fff7ed', c: '#ea580c', accent: '#f97316', val: '—',   lab: 'API Calls',       chip: 'Track',  live: false },
          ].map(({ icon: Icon, bg, c, accent, val, lab, chip, live }, i) => (
            <Stat key={i} $accent={accent}>
              <StatHead>
                <StatIconBox $bg={bg} $c={c}><Icon /></StatIconBox>
                <StatChip $live={live}>{chip}</StatChip>
              </StatHead>
              <StatNumber>{val}</StatNumber>
              <StatName>{lab}</StatName>
            </Stat>
          ))}
        </StatsStrip>

        {/* ── Main Grid ── */}
        <MainGrid>
          {/* Activity */}
          <Card>
            <CardHead>
              <CardTitle><Activity />Recent Activity</CardTitle>
              <ViewLink to="/dashboard/vault/items">View all <ArrowUpRight /></ViewLink>
            </CardHead>
            <AList>
              {[
                { icon: Shield,       bg: '#eff6ff', c: '#2563eb', text: 'Vault initialized',            time: 'Today', bb: '#eff6ff', bc: '#2563eb', badge: 'Vault'     },
                { icon: User,         bg: '#f0fdf4', c: '#16a34a', text: 'Portfolio profile created',    time: 'Today', bb: '#f0fdf4', bc: '#16a34a', badge: 'Portfolio' },
                { icon: Terminal,     bg: '#faf5ff', c: '#7c3aed', text: 'Developer module unlocked',    time: 'Today', bb: '#faf5ff', bc: '#7c3aed', badge: 'Dev'       },
                { icon: CheckCircle2, bg: '#f0fdf4', c: '#16a34a', text: 'Account setup complete',       time: 'Today', bb: '#fff7ed', bc: '#ea580c', badge: 'Account'   },
                { icon: Zap,          bg: '#fefce8', c: '#ca8a04', text: 'Ready — build your portfolio', time: 'Now',   bb: '#fefce8', bc: '#ca8a04', badge: 'Tip'       },
              ].map(({ icon: Icon, bg, c, text, time, bb, bc, badge }, i) => (
                <ARow key={i}>
                  <AIcon $bg={bg} $c={c}><Icon /></AIcon>
                  <AInfo>
                    <AText>{text}</AText>
                    <ATime>{time}</ATime>
                  </AInfo>
                  <ABadge $bg={bb} $c={bc}>{badge}</ABadge>
                </ARow>
              ))}
            </AList>
          </Card>

          {/* Right col */}
          <RightCol>
            {/* Modules */}
            <Card>
              <CardHead>
                <CardTitle><Layers />Module Status</CardTitle>
              </CardHead>
              <ModuleGrid>
                {[
                  { to: '/dashboard/vault/items',       icon: Lock,     name: 'Vault',     desc: 'Encrypted credential storage', bg: '#eff6ff', c: '#2563eb', tileBg: '#fafcff', tileBor: '#dbeafe', statusC: '#16a34a', status: 'Active' },
                  { to: '/dashboard/portfolio/profile', icon: Briefcase,name: 'Portfolio', desc: 'Public profile is live',       bg: '#f0fdf4', c: '#16a34a', tileBg: '#fafffe', tileBor: '#bbf7d0', statusC: '#16a34a', status: 'Live'   },
                  { to: '/dashboard/developer/keys',    icon: Terminal,  name: 'Developer', desc: 'API & key management',        bg: '#faf5ff', c: '#7c3aed', tileBg: '#fdf8ff', tileBor: '#e9d5ff', statusC: '#7c3aed', status: 'Ready'  },
                ].map(({ to, icon: Icon, name, desc, bg, c, tileBg, tileBor, statusC, status }) => (
                  <ModuleTile key={to} to={to} $bg={tileBg} $bor={tileBor}>
                    <ModuleIcon $bg={bg} $c={c}><Icon /></ModuleIcon>
                    <ModInfo>
                      <ModName>{name}</ModName>
                      <ModDesc>{desc}</ModDesc>
                    </ModInfo>
                    <ModStatus $c={statusC}><StatusDot />{status}</ModStatus>
                  </ModuleTile>
                ))}
              </ModuleGrid>
            </Card>

            {/* Quick Jump */}
            <Card>
              <CardHead>
                <CardTitle><Zap />Quick Jump</CardTitle>
              </CardHead>
              <QGrid>
                {[
                  { to: '/dashboard/vault/items',         icon: Lock,         label: 'Vault Items',  c: '#2563eb', hov: '#eff6ff', bor: 'rgba(37,99,235,0.2)'  },
                  { to: '/dashboard/portfolio/profile',   icon: User,         label: 'My Profile',   c: '#16a34a', hov: '#f0fdf4', bor: 'rgba(22,163,74,0.2)'  },
                  { to: '/dashboard/portfolio/projects',  icon: FolderKanban, label: 'Projects',     c: '#16a34a', hov: '#f0fdf4', bor: 'rgba(22,163,74,0.2)'  },
                  { to: '/dashboard/portfolio/education', icon: GraduationCap,label: 'Education',    c: '#0891b2', hov: '#ecfeff', bor: 'rgba(8,145,178,0.2)'  },
                  { to: '/dashboard/developer/keys',      icon: Key,          label: 'API Keys',     c: '#7c3aed', hov: '#faf5ff', bor: 'rgba(124,58,237,0.2)' },
                  { to: '/dashboard/developer/docs',      icon: FileCode2,    label: 'API Docs',     c: '#7c3aed', hov: '#faf5ff', bor: 'rgba(124,58,237,0.2)' },
                  { to: '/dashboard/developer/analytics', icon: BarChart3,    label: 'Analytics',    c: '#0891b2', hov: '#ecfeff', bor: 'rgba(8,145,178,0.2)'  },
                  { to: '/dashboard/vault/public',        icon: Globe,        label: 'Public Files', c: '#2563eb', hov: '#eff6ff', bor: 'rgba(37,99,235,0.2)'  },
                ].map(({ to, icon: Icon, label, c, hov, bor }) => (
                  <QItem key={to} to={to} $c={c} $hov={hov} $bor={bor}>
                    <Icon />{label}
                  </QItem>
                ))}
              </QGrid>
            </Card>
          </RightCol>
        </MainGrid>

        {/* ── Bottom Tips ── */}
        <BottomStrip>
          {[
            {
              icon: Shield, iconBg: '#eff6ff', iconC: '#2563eb',
              bg: '#fff', bor: '#e8eef6',
              title: 'Secure your vault',
              desc: 'Add credentials, secrets and notes to your encrypted vault. Access them anywhere, anytime.'
            },
            {
              icon: Globe, iconBg: '#f0fdf4', iconC: '#16a34a',
              bg: '#fafffe', bor: '#bbf7d0',
              title: 'Go live with your portfolio',
              desc: 'Your profile page is live. Add projects, education and skills to showcase your work.'
            },
            {
              icon: Key, iconBg: '#faf5ff', iconC: '#7c3aed',
              bg: '#fdf8ff', bor: '#e9d5ff',
              title: 'Generate your first API key',
              desc: 'Programmatically access your data. Create a key in the Developer module to get started.'
            },
          ].map(({ icon: Icon, iconBg, iconC, bg, bor, title, desc }, i) => (
            <TipCard key={i} $bg={bg} $bor={bor}>
              <TipIcon $bg={iconBg} $c={iconC}><Icon /></TipIcon>
              <TipText>
                <TipTitle>{title}</TipTitle>
                <TipDesc>{desc}</TipDesc>
              </TipText>
            </TipCard>
          ))}
        </BottomStrip>

      </Wrap>
    </Page>
  )
}

export default Dashboard