import { Link } from 'react-router-dom'
import styled, { keyframes, css } from 'styled-components'
import { useAuth } from '../../contexts/AuthContext'
import SearchBar from '../../components/common/SearchBar'
import {
  Lock, Briefcase, Terminal, User,
  Globe, Key, FolderKanban, GraduationCap,
  BarChart3, FileCode2, Zap, Shield,
  ArrowUpRight, Database, Activity, CheckCircle2
} from 'lucide-react'

/* ─── Animations ─────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`
const orbitSpin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`
const orbitSpinReverse = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(-360deg); }
`
const blink = keyframes`
  0%,100% { opacity: 1; } 50% { opacity: 0.3; }
`
const scanLine = keyframes`
  0%   { top: -2px; opacity: 0.7; }
  100% { top: 102%; opacity: 0; }
`

const appear = (delay = 0) => css`
  opacity: 0;
  animation: ${fadeUp} 0.52s cubic-bezier(0.22,1,0.36,1) ${delay}ms forwards;
`

/* ─── Layout ──────────────────────────────────────────────── */
const Page = styled.div`
  min-height: 100%;
  background: #f0f5ff;
  padding: 2rem 2.25rem 3rem;
  font-family: 'Outfit', system-ui, sans-serif;
  @media (max-width: 768px) { padding: 1.25rem 1rem 2.5rem; }
`
const Wrap = styled.div`
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`

/* ─── TOP ROW ─────────────────────────────────────────────── */
const TopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  ${appear(0)}
  @media (max-width: 768px) { flex-direction: column; align-items: flex-start; }
`
const Greeting = styled.div``
const GreetingEyebrow = styled.p`
  font-size: 0.72rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: #93c5fd; margin: 0 0 0.3rem;
`
const GreetingTitle = styled.h1`
  font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 800; color: #0f172a;
  margin: 0; letter-spacing: -0.025em; line-height: 1.1;
  span {
    background: linear-gradient(100deg, #1d4ed8, #3b82f6);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
`
const SearchWrap = styled.div`
  width: 100%; max-width: 360px;
  @media (max-width: 768px) { max-width: 100%; }
`

/* ─── COMMAND ROW ─────────────────────────────────────────── */
const CommandRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 310px;
  gap: 1.25rem;
  ${appear(80)}
  @media (max-width: 960px) { grid-template-columns: 1fr; }
`

/* Orbit hero */
const OrbitCard = styled.div`
  position: relative; overflow: hidden; border-radius: 20px;
  background: linear-gradient(130deg,#0c1f5e 0%,#1a3a8f 40%,#1d4ed8 75%,#3b82f6 100%);
  padding: 2.25rem 2.5rem; display: flex; align-items: center;
  gap: 2rem; min-height: 195px;
`
const GridBg = styled.div`
  position: absolute; inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.033) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.033) 1px, transparent 1px);
  background-size: 28px 28px;
`
const Scanline = styled.div`
  position: absolute; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(96,165,250,0.35), transparent);
  animation: ${scanLine} 3.5s linear infinite;
`
const OrbitText = styled.div`position: relative; z-index: 2; flex: 1;`
const OrbitBadge = styled.div`
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15);
  border-radius: 99px; padding: 0.25rem 0.75rem;
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.07em;
  text-transform: uppercase; color: rgba(255,255,255,0.8); margin-bottom: 0.9rem;
  span { width:6px;height:6px;border-radius:50%;background:#4ade80;
    animation: ${blink} 1.8s ease-in-out infinite; }
`
const OrbitHeadline = styled.h2`
  font-size: 1.55rem; font-weight: 800; color:#fff;
  margin: 0 0 0.5rem; letter-spacing: -0.02em; line-height: 1.2;
`
const OrbitSub = styled.p`
  font-size: 0.85rem; color: rgba(255,255,255,0.62);
  margin: 0; line-height: 1.65; max-width: 340px;
`

/* Orbit rings visual */
const OrbitVisual = styled.div`
  position: relative; width: 130px; height: 130px;
  flex-shrink: 0; z-index: 2;
  @media (max-width: 640px) { display: none; }
`
const Ring = styled.div`
  position: absolute; border-radius: 50%;
  border: 1px solid rgba(255,255,255,${({$op})=>$op||0.12});
  animation: ${({$rev})=>$rev ? orbitSpinReverse : orbitSpin}
    ${({$dur})=>$dur||'8s'} linear infinite;
`
const Dot = styled.div`
  position: absolute;
  width:${({$s})=>$s||7}px; height:${({$s})=>$s||7}px;
  border-radius:50%; background:${({$c})=>$c||'#60a5fa'};
  box-shadow: 0 0 8px ${({$c})=>$c||'#60a5fa'};
  top:${({$t})=>$t}; left:${({$l})=>$l};
`
const OrbitCenter = styled.div`
  position:absolute;inset:0;display:flex;align-items:center;
  justify-content:center; svg{width:28px;height:28px;color:rgba(255,255,255,0.88);}
`

/* Status panel */
const StatusPanel = styled.div`
  border-radius: 20px; background: #fff;
  border: 1.5px solid rgba(59,130,246,0.1);
  padding: 1.4rem; display: flex; flex-direction: column; gap: 0.85rem;
  box-shadow: 0 2px 12px rgba(15,45,107,0.05);
`
const PanelLabel = styled.p`
  font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: #94a3b8; margin: 0;
`
const StatusItem = styled(Link)`
  display: flex; align-items: center; gap: 0.7rem;
  padding: 0.62rem 0.8rem; border-radius: 10px;
  background: ${({$active})=>$active ? '#f0f9ff' : '#fafafa'};
  border: 1px solid ${({$active})=>$active ? 'rgba(59,130,246,0.15)' : '#f1f5f9'};
  text-decoration: none; transition: all 0.15s;
  &:hover { border-color: rgba(59,130,246,0.3); background: #eff6ff; }
`
const SDot = styled.div`
  width:8px;height:8px;border-radius:50%;flex-shrink:0;
  background:${({$c})=>$c}; box-shadow: 0 0 6px ${({$c})=>$c};
`
const SInfo = styled.div`flex:1;min-width:0;`
const SName = styled.p`font-size:0.82rem;font-weight:600;color:#1e293b;margin:0;`
const SDesc = styled.p`font-size:0.71rem;color:#94a3b8;margin:0;`
const SArrow = styled(ArrowUpRight)`
  width:14px;height:14px;color:#cbd5e1;flex-shrink:0;transition:color 0.15s;
  ${StatusItem}:hover & { color:#3b82f6; }
`

/* ─── STATS ROW ───────────────────────────────────────────── */
const StatsRow = styled.div`
  display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem;
  ${appear(145)}
  @media (max-width: 900px) { grid-template-columns: repeat(2,1fr); }
`
const StatCard = styled.div`
  background: #fff; border: 1.5px solid rgba(59,130,246,0.09);
  border-radius: 16px; padding: 1.2rem 1.35rem;
  display: flex; flex-direction: column; gap: 0.55rem;
  box-shadow: 0 2px 8px rgba(15,45,107,0.04);
  transition: transform 0.2s, box-shadow 0.2s;
  &:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(59,130,246,0.09); }
`
const StatTop = styled.div`display:flex;align-items:center;justify-content:space-between;`
const StatIcon = styled.div`
  width:36px;height:36px;border-radius:10px;background:${({$bg})=>$bg};
  display:flex;align-items:center;justify-content:center;
  svg{width:17px;height:17px;color:${({$c})=>$c};}
`
const StatBadge = styled.span`
  font-size:0.68rem;font-weight:700;padding:0.15rem 0.5rem;border-radius:99px;
  background:${({$up})=>$up?'#f0fdf4':'#f8fafc'};
  color:${({$up})=>$up?'#16a34a':'#94a3b8'};
`
const StatVal = styled.p`font-size:1.7rem;font-weight:800;color:#0f172a;margin:0;letter-spacing:-0.03em;line-height:1;`
const StatLab = styled.p`font-size:0.74rem;color:#94a3b8;margin:0;font-weight:500;`

/* ─── BOTTOM ──────────────────────────────────────────────── */
const BottomGrid = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;
  ${appear(205)}
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

/* Activity */
const Panel = styled.div`
  background:#fff;border:1.5px solid rgba(59,130,246,0.09);
  border-radius:18px;padding:1.5rem;
  box-shadow:0 2px 10px rgba(15,45,107,0.04);
`
const PHead = styled.div`
  display:flex;align-items:center;justify-content:space-between;margin-bottom:1.1rem;
`
const PTitle = styled.h3`
  font-size:0.875rem;font-weight:700;color:#0f172a;margin:0;
  display:flex;align-items:center;gap:0.45rem;
  svg{width:15px;height:15px;color:#3b82f6;}
`
const PViewAll = styled(Link)`
  font-size:0.74rem;font-weight:600;color:#3b82f6;text-decoration:none;
  display:flex;align-items:center;gap:0.2rem;transition:gap 0.15s;
  &:hover{gap:0.4rem;} svg{width:12px;height:12px;}
`
const AList = styled.div`display:flex;flex-direction:column;`
const ARow = styled.div`
  display:flex;align-items:center;gap:0.75rem;padding:0.62rem 0;
  border-bottom:1px solid #f8fafc;&:last-child{border-bottom:none;}
`
const AIcon = styled.div`
  width:32px;height:32px;border-radius:9px;background:${({$bg})=>$bg};
  display:flex;align-items:center;justify-content:center;flex-shrink:0;
  svg{width:14px;height:14px;color:${({$c})=>$c};}
`
const AInfo = styled.div`flex:1;min-width:0;`
const ATit = styled.p`font-size:0.82rem;font-weight:500;color:#334155;margin:0;`
const ATime = styled.p`font-size:0.7rem;color:#b0bec5;margin:0;`
const ABadge = styled.span`
  font-size:0.67rem;font-weight:600;padding:0.18rem 0.55rem;border-radius:6px;
  background:${({$bg})=>$bg};color:${({$c})=>$c};flex-shrink:0;
`

/* Quick jump */
const QGrid = styled.div`display:grid;grid-template-columns:1fr 1fr;gap:0.6rem;`
const QLink = styled(Link)`
  display:flex;align-items:center;gap:0.65rem;padding:0.75rem 0.9rem;
  border-radius:11px;text-decoration:none;background:#f8fafc;
  border:1.5px solid transparent;color:#334155;
  font-size:0.82rem;font-weight:500;transition:all 0.16s;
  svg{width:15px;height:15px;color:${({$c})=>$c};flex-shrink:0;}
  &:hover{
    background:${({$hov})=>$hov};border-color:${({$bor})=>$bor};
    color:#1e293b;transform:scale(1.025);
  }
`

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

  return (
    <Page>
      <Wrap>

        {/* Top */}
        <TopRow>
          <Greeting>
            <GreetingEyebrow>PersonalDB · Dashboard</GreetingEyebrow>
            <GreetingTitle>{timeGreet()}, <span>{user?.username}</span> 👋</GreetingTitle>
          </Greeting>
          <SearchWrap>
            <SearchBar onSelectUser={(u) => console.log(u)} />
          </SearchWrap>
        </TopRow>

        {/* Command row */}
        <CommandRow>
          <OrbitCard>
            <GridBg /><Scanline />
            <OrbitText>
              <OrbitBadge><span />All systems active</OrbitBadge>
              <OrbitHeadline>Your personal<br />data universe</OrbitHeadline>
              <OrbitSub>
                Everything you store, build, and ship — secured,
                organised, and accessible from one place.
              </OrbitSub>
            </OrbitText>
            <OrbitVisual>
              <Ring style={{inset:0}}      $op={0.14} $dur="12s" />
              <Ring style={{inset:16}}     $op={0.2}  $dur="8s"  $rev />
              <Ring style={{inset:32}}     $op={0.28} $dur="5s" />
              <Dot $s={7} $c="#60a5fa" $t="-3px"            $l="calc(50% - 3px)" />
              <Dot $s={6} $c="#4ade80" $t="50%"             $l="calc(100% - 9px)" />
              <Dot $s={5} $c="#f472b6" $t="calc(100% - 5px)"$l="20px" />
              <Dot $s={8} $c="#fbbf24" $t="28px"            $l="4px" />
              <OrbitCenter><Database /></OrbitCenter>
            </OrbitVisual>
          </OrbitCard>

          <StatusPanel>
            <PanelLabel>Module Status</PanelLabel>
            {[
              { to:'/dashboard/vault/items',       icon:Lock,     name:'Vault',     desc:'Encrypted storage',   c:'#3b82f6' },
              { to:'/dashboard/portfolio/profile', icon:Briefcase,name:'Portfolio', desc:'Public profile live', c:'#16a34a' },
              { to:'/dashboard/developer/keys',    icon:Terminal,  name:'Developer', desc:'API ready',           c:'#7c3aed' },
            ].map(({to,icon:Icon,name,desc,c})=>(
              <StatusItem key={to} to={to} $active>
                <SDot $c={c}/><SInfo><SName>{name}</SName><SDesc>{desc}</SDesc></SInfo><SArrow/>
              </StatusItem>
            ))}
          </StatusPanel>
        </CommandRow>

        {/* Stats */}
        <StatsRow>
          {[
            { icon:Lock,        bg:'#eff6ff',  c:'#3b82f6', val:'—',  lab:'Vault Items',    badge:'Active', up:true },
            { icon:Globe,       bg:'#f0fdf4',  c:'#16a34a', val:'1',   lab:'Public Profile', badge:'Live',   up:true },
            { icon:Key,         bg:'#faf5ff',  c:'#7c3aed', val:'—',  lab:'API Keys',        badge:'Manage', up:false},
            { icon:BarChart3,   bg:'#fff7ed',  c:'#ea580c', val:'—',  lab:'API Calls',       badge:'Track',  up:false},
          ].map(({icon:Icon,bg,c,val,lab,badge,up},i)=>(
            <StatCard key={i}>
              <StatTop>
                <StatIcon $bg={bg} $c={c}><Icon /></StatIcon>
                <StatBadge $up={up}>{badge}</StatBadge>
              </StatTop>
              <StatVal>{val}</StatVal>
              <StatLab>{lab}</StatLab>
            </StatCard>
          ))}
        </StatsRow>

        {/* Bottom */}
        <BottomGrid>
          <Panel>
            <PHead>
              <PTitle><Activity />Recent Activity</PTitle>
              <PViewAll to="/dashboard/vault/items">View all <ArrowUpRight /></PViewAll>
            </PHead>
            <AList>
              {[
                { icon:Shield,       bg:'#eff6ff', c:'#3b82f6', t:'Vault initialized',             time:'Today', bb:'#eff6ff', bc:'#2563eb', badge:'Vault'     },
                { icon:User,         bg:'#f0fdf4', c:'#16a34a', t:'Portfolio profile created',      time:'Today', bb:'#f0fdf4', bc:'#16a34a', badge:'Portfolio' },
                { icon:Terminal,     bg:'#faf5ff', c:'#7c3aed', t:'Developer module unlocked',      time:'Today', bb:'#faf5ff', bc:'#7c3aed', badge:'Dev'       },
                { icon:CheckCircle2, bg:'#f0fdf4', c:'#16a34a', t:'Account setup complete',         time:'Today', bb:'#fff7ed', bc:'#ea580c', badge:'Account'   },
                { icon:Zap,          bg:'#fefce8', c:'#ca8a04', t:'Ready — build your portfolio',   time:'Now',   bb:'#fefce8', bc:'#ca8a04', badge:'Tip'       },
              ].map(({icon:Icon,bg,c,t,time,bb,bc,badge},i)=>(
                <ARow key={i}>
                  <AIcon $bg={bg} $c={c}><Icon /></AIcon>
                  <AInfo><ATit>{t}</ATit><ATime>{time}</ATime></AInfo>
                  <ABadge $bg={bb} $c={bc}>{badge}</ABadge>
                </ARow>
              ))}
            </AList>
          </Panel>

          <Panel>
            <PHead><PTitle><Zap />Quick Jump</PTitle></PHead>
            <QGrid>
              <QLink to="/dashboard/vault/items"         $c="#2563eb" $hov="#eff6ff" $bor="rgba(37,99,235,0.2)"><Lock />Vault Items</QLink>
              <QLink to="/dashboard/portfolio/profile"   $c="#16a34a" $hov="#f0fdf4" $bor="rgba(22,163,74,0.2)"><User />My Profile</QLink>
              <QLink to="/dashboard/portfolio/projects"  $c="#16a34a" $hov="#f0fdf4" $bor="rgba(22,163,74,0.2)"><FolderKanban />Projects</QLink>
              <QLink to="/dashboard/portfolio/education" $c="#0891b2" $hov="#ecfeff" $bor="rgba(8,145,178,0.2)"><GraduationCap />Education</QLink>
              <QLink to="/dashboard/developer/keys"      $c="#7c3aed" $hov="#faf5ff" $bor="rgba(124,58,237,0.2)"><Key />API Keys</QLink>
              <QLink to="/dashboard/developer/docs"      $c="#7c3aed" $hov="#faf5ff" $bor="rgba(124,58,237,0.2)"><FileCode2 />API Docs</QLink>
              <QLink to="/dashboard/developer/analytics" $c="#0891b2" $hov="#ecfeff" $bor="rgba(8,145,178,0.2)"><BarChart3 />Analytics</QLink>
              <QLink to="/dashboard/vault/public"        $c="#2563eb" $hov="#eff6ff" $bor="rgba(37,99,235,0.2)"><Globe />Public Files</QLink>
            </QGrid>
          </Panel>
        </BottomGrid>

      </Wrap>
    </Page>
  )
}

export default Dashboard