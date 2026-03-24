import { useState, useEffect } from 'react'
import styled, { createGlobalStyle, keyframes } from 'styled-components'
import {
  BarChart3, Activity, TrendingUp, Clock, AlertCircle,
  Key, Trash2, RefreshCw, Zap, ArrowUpRight, Target, Layers
} from 'lucide-react'
import toast from 'react-hot-toast'
import { apiService } from '../../services/apiService'

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
`

// ── Animations ────────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
`
const spin = keyframes`
  to { transform: rotate(360deg); }
`
const grow = keyframes`
  from { width: 0%; }
`
const shimmer = keyframes`
  0%   { background-position: -400% 0; }
  100% { background-position:  400% 0; }
`
const countUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`

// ── Layout ─────────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 100%;
  font-family: 'Sora', sans-serif;
  animation: ${fadeUp} 0.4s ease both;
`

// ── Hero Banner ───────────────────────────────────────────────────────────────
const HeroBanner = styled.div`
  position: relative;
  background: linear-gradient(135deg, #0a2558 0%, #0f3b9c 45%, #1a5fc8 100%);
  border-radius: 20px;
  padding: 2.5rem 2.75rem;
  margin-bottom: 2rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    pointer-events: none;
  }
`

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1.5rem;
`

const HeroLeft = styled.div``

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 100px;
  padding: 0.3rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 700;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 0.875rem;
  backdrop-filter: blur(4px);
  svg { width: 0.7rem; height: 0.7rem; }
`

const HeroTitle = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.5rem;
  letter-spacing: -0.03em;
`

const HeroSub = styled.p`
  color: rgba(255,255,255,0.6);
  font-size: 0.875rem;
  margin: 0;
`

const RefreshBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.22);
  color: #fff;
  padding: 0.7rem 1.375rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(6px);

  &:hover:not(:disabled) { background: rgba(255,255,255,0.2); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }

  svg {
    width: 15px; height: 15px;
    animation: ${p => p.$spinning ? spin : 'none'} 0.8s linear infinite;
  }
`

// ── Alert ─────────────────────────────────────────────────────────────────────
const AlertStrip = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: linear-gradient(135deg, #fffbeb, #fef3c720);
  border: 1px solid #fbbf24;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: #92400e;
  font-weight: 500;
  margin-bottom: 1.75rem;
  animation: ${fadeUp} 0.4s ease both;
  svg { flex-shrink: 0; color: #d97706; }
`

// ── Stats Grid ────────────────────────────────────────────────────────────────
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 1.75rem;
`

const StatCard = styled.div`
  background: #fff;
  border: 1.5px solid #e0eaff;
  border-radius: 16px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.25s;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${p => p.$d || '0s'};

  &::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 80px; height: 80px;
    background: radial-gradient(circle at top right, rgba(59,130,246,0.08), transparent 70%);
    pointer-events: none;
  }

  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 8px 28px rgba(37,99,235,0.1);
    transform: translateY(-2px);
  }
`

const StatTop = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
`

const StatIconBox = styled.div`
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${p => p.$color || 'linear-gradient(135deg, #dbeafe, #bfdbfe)'};
  color: ${p => p.$text || '#1d4ed8'};
  svg { width: 1.2rem; height: 1.2rem; }
`

const StatTrend = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${p => p.$up ? '#15803d' : '#dc2626'};
  background: ${p => p.$up ? '#dcfce7' : '#fee2e2'};
  padding: 0.2rem 0.55rem;
  border-radius: 100px;
  svg { width: 0.75rem; height: 0.75rem; }
`

const StatNum = styled.div`
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.04em;
  font-family: 'JetBrains Mono', monospace;
  line-height: 1;
  margin-bottom: 0.375rem;
  animation: ${countUp} 0.5s ease both;
`

const StatLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`

const StatSub = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 0.375rem;
`

// ── Card Shell ────────────────────────────────────────────────────────────────
const Card = styled.div`
  background: #fff;
  border: 1.5px solid #e0eaff;
  border-radius: 18px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: ${p => p.$d || '0s'};
`

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.375rem 1.75rem;
  border-bottom: 1.5px solid #e8f0fe;
  background: linear-gradient(180deg, #fafcff 0%, #fff 100%);
`

const CardTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const CardTitleIcon = styled.div`
  width: 2.25rem; height: 2.25rem;
  border-radius: 10px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  display: flex; align-items: center; justify-content: center;
  color: #1d4ed8;
  svg { width: 1rem; height: 1rem; }
`

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.01em;
`

const CardSubtitle = styled.span`
  font-size: 0.78rem;
  color: #94a3b8;
  margin-left: 0.5rem;
  font-weight: 400;
`

const CardBody = styled.div`
  padding: 1.5rem 1.75rem;
`

// ── Key Rows ──────────────────────────────────────────────────────────────────
const KeyTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

const KeyRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr auto auto auto;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  background: ${p => p.$rank === 0 ? 'linear-gradient(135deg, #f0f6ff, #eff6ff)' : '#f8fafc'};
  border: 1.5px solid ${p => p.$rank === 0 ? '#bfdbfe' : '#e8f0fe'};
  border-radius: 12px;
  transition: all 0.2s;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${p => p.$d || '0s'};

  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 4px 16px rgba(37,99,235,0.08);
    transform: translateX(2px);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
    gap: 0.625rem;
  }
`

const RankBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  font-family: 'JetBrains Mono', monospace;
  background: ${p =>
    p.$rank === 0 ? 'linear-gradient(135deg,#3b82f6,#1e40af)' :
    p.$rank === 1 ? '#e0eaff' : '#f1f5f9'};
  color: ${p =>
    p.$rank === 0 ? '#fff' :
    p.$rank === 1 ? '#1d4ed8' : '#64748b'};
`

const RowKeyName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  font-weight: 700;
  color: #0f172a;
  font-size: 0.9rem;
`

const RowBarWrap = styled.div``

const RowBarLabel = styled.div`
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.3rem;
  display: flex;
  justify-content: space-between;
`

const BarTrack = styled.div`
  height: 8px;
  background: #e0eaff;
  border-radius: 4px;
  overflow: hidden;
`

const BarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: ${p =>
    p.$rank === 0 ? 'linear-gradient(90deg,#3b82f6,#7c3aed)' :
    p.$rank === 1 ? 'linear-gradient(90deg,#60a5fa,#93c5fd)' :
    'linear-gradient(90deg,#93c5fd,#bfdbfe)'};
  width: ${p => p.$pct}%;
  animation: ${grow} 0.8s ease both;
  animation-delay: ${p => p.$d || '0s'};
  transition: width 0.6s ease;
`

const ReqCount = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.04em;
  text-align: right;
`

const LastUsed = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.3rem 0.75rem;
  border-radius: 100px;
  white-space: nowrap;
  background: ${p => p.$used ? '#dcfce7' : '#f1f5f9'};
  color: ${p => p.$used ? '#15803d' : '#94a3b8'};
  border: 1px solid ${p => p.$used ? '#bbf7d0' : '#e2e8f0'};
`

const DelBtn = styled.button`
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 8px;
  border: 1.5px solid #fecaca;
  background: transparent;
  color: #ef4444;
  cursor: pointer;
  transition: all 0.18s;

  &:hover { background: #fee2e2; border-color: #f87171; transform: scale(1.08); }
  svg { width: 14px; height: 14px; }
`

// ── Insights ──────────────────────────────────────────────────────────────────
const InsightGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
`

const InsightCard = styled.div`
  background: linear-gradient(135deg, ${p => p.$from || '#f0f6ff'}, ${p => p.$to || '#eff6ff'});
  border: 1.5px solid ${p => p.$border || '#bfdbfe'};
  border-radius: 14px;
  padding: 1.25rem;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${p => p.$d || '0s'};
`

const InsightTitle = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${p => p.$color || '#1d4ed8'};
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  svg { width: 0.875rem; height: 0.875rem; }
`

const InsightValue = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: -0.04em;
  margin-bottom: 0.25rem;
`

const InsightSub = styled.div`
  font-size: 0.8rem;
  color: #64748b;
`

// ── Empty / Loading ───────────────────────────────────────────────────────────
const LoadWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem;
  color: #64748b;
  font-size: 0.9rem;
`

const Spinner = styled.div`
  width: 1.25rem; height: 1.25rem;
  border: 2.5px solid #dbeafe;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`

const EmptyWrap = styled.div`
  text-align: center;
  padding: 3.5rem 2rem;
  color: #64748b;
`

const EmptyIconWrap = styled.div`
  width: 4rem; height: 4rem;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 1rem;
  color: #1d4ed8;
  svg { width: 1.75rem; height: 1.75rem; }
`

const formatDate = (d) => {
  if (!d) return 'Never'
  const ms  = Date.now() - new Date(d)
  const min = Math.floor(ms / 60000)
  const hr  = Math.floor(ms / 3600000)
  const day = Math.floor(ms / 86400000)
  if (min < 60)  return `${min}m ago`
  if (hr  < 24)  return `${hr}h ago`
  if (day <  7)  return `${day}d ago`
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Page ──────────────────────────────────────────────────────────────────────
const AnalyticsPage = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => { fetchAnalytics() }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data } = await apiService.getUsageStats()
      setStats(data)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
    toast.success('Refreshed!')
  }

  const handleDeleteKey = async (id) => {
    if (!window.confirm('Delete this API key?')) return
    try {
      await apiService.revokeKey(id)
      setStats(prev => ({
        ...prev,
        totalRequests: prev.totalRequests - (prev.requestsByKey.find(k => k._id === id)?.requestCount || 0),
        requestsByKey: prev.requestsByKey.filter(k => k._id !== id),
        activeKeys: prev.requestsByKey.filter(k => k._id !== id && k.lastUsed).length,
        totalKeys: prev.totalKeys - 1,
      }))
      toast.success('Key deleted')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete')
    }
  }

  if (loading) return (
    <PageWrap>
      <GlobalStyle />
      <HeroBanner>
        <HeroContent>
          <HeroLeft>
            <HeroBadge><Activity size={10} /> Live Metrics</HeroBadge>
            <HeroTitle>API Analytics</HeroTitle>
          </HeroLeft>
        </HeroContent>
      </HeroBanner>
      <LoadWrap><Spinner /> Loading analytics…</LoadWrap>
    </PageWrap>
  )

  if (!stats) return (
    <PageWrap>
      <GlobalStyle />
      <EmptyWrap>
        <EmptyIconWrap><BarChart3 /></EmptyIconWrap>
        <p>No analytics data available.</p>
      </EmptyWrap>
    </PageWrap>
  )

  const sorted = [...stats.requestsByKey]
    .map(k => ({ ...k, pct: stats.totalRequests > 0 ? (k.requestCount / stats.totalRequests) * 100 : 0 }))
    .sort((a, b) => b.requestCount - a.requestCount)

  const avgPerKey   = stats.totalKeys > 0 ? Math.floor(stats.totalRequests / stats.totalKeys) : 0
  const mostUsed    = sorted[0] || null
  const unusedKeys  = stats.requestsByKey.filter(k => k.requestCount === 0).length
  const lastActive  = stats.requestsByKey
    .filter(k => k.lastUsed)
    .sort((a, b) => new Date(b.lastUsed) - new Date(a.lastUsed))[0]

  return (
    <>
      <GlobalStyle />
      <PageWrap>

        {/* Hero */}
        <HeroBanner>
          <HeroContent>
            <HeroLeft>
              <HeroBadge><Activity size={10} /> Live Metrics</HeroBadge>
              <HeroTitle>API Analytics</HeroTitle>
              <HeroSub>Track request volume, key activity, and usage patterns in real time.</HeroSub>
            </HeroLeft>
            <RefreshBtn onClick={handleRefresh} disabled={refreshing} $spinning={refreshing}>
              <RefreshCw /> {refreshing ? 'Refreshing…' : 'Refresh'}
            </RefreshBtn>
          </HeroContent>
        </HeroBanner>

        {unusedKeys > 0 && (
          <AlertStrip>
            <AlertCircle size={18} />
            <span><strong>{unusedKeys} unused key{unusedKeys > 1 ? 's' : ''} detected.</strong> Consider revoking inactive credentials for tighter security.</span>
          </AlertStrip>
        )}

        {/* Stat Cards */}
        <StatsGrid>
          <StatCard $d="0.05s">
            <StatTop>
              <StatIconBox $color="linear-gradient(135deg,#dbeafe,#bfdbfe)" $text="#1d4ed8">
                <Activity />
              </StatIconBox>
              <StatTrend $up>{avgPerKey > 0 ? `${avgPerKey} avg/key` : '—'}</StatTrend>
            </StatTop>
            <StatNum>{stats.totalRequests.toLocaleString()}</StatNum>
            <StatLabel>Total Requests</StatLabel>
            <StatSub>All-time across all keys</StatSub>
          </StatCard>

          <StatCard $d="0.1s">
            <StatTop>
              <StatIconBox $color="linear-gradient(135deg,#dcfce7,#bbf7d0)" $text="#15803d">
                <Key />
              </StatIconBox>
              <StatTrend $up={stats.activeKeys === stats.totalKeys}>
                {stats.totalKeys} total
              </StatTrend>
            </StatTop>
            <StatNum>{stats.activeKeys}</StatNum>
            <StatLabel>Active Keys</StatLabel>
            <StatSub>Currently in use</StatSub>
          </StatCard>

          <StatCard $d="0.15s">
            <StatTop>
              <StatIconBox $color="linear-gradient(135deg,#fef3c7,#fde68a)" $text="#d97706">
                <TrendingUp />
              </StatIconBox>
              {mostUsed && <StatTrend $up><ArrowUpRight size={10} />{mostUsed.pct.toFixed(0)}%</StatTrend>}
            </StatTop>
            <StatNum>{mostUsed ? mostUsed.requestCount.toLocaleString() : '—'}</StatNum>
            <StatLabel>Top Key Requests</StatLabel>
            <StatSub>{mostUsed ? `"${mostUsed.name}"` : 'No keys yet'}</StatSub>
          </StatCard>

          <StatCard $d="0.2s">
            <StatTop>
              <StatIconBox $color="linear-gradient(135deg,#fce7f3,#fbcfe8)" $text="#be185d">
                <Clock />
              </StatIconBox>
              <StatTrend $up={unusedKeys === 0}>{unusedKeys === 0 ? '✓ Clean' : `${unusedKeys} idle`}</StatTrend>
            </StatTop>
            <StatNum>{unusedKeys}</StatNum>
            <StatLabel>Unused Keys</StatLabel>
            <StatSub>{unusedKeys > 0 ? 'Review & revoke idle keys' : 'All keys are active'}</StatSub>
          </StatCard>
        </StatsGrid>

        {/* Usage Breakdown */}
        <Card $d="0.25s">
          <CardHeader>
            <CardTitleGroup>
              <CardTitleIcon><Layers /></CardTitleIcon>
              <div>
                <CardTitle>Usage Breakdown <CardSubtitle>{sorted.length} keys</CardSubtitle></CardTitle>
              </div>
            </CardTitleGroup>
          </CardHeader>
          <CardBody>
            {sorted.length === 0 ? (
              <EmptyWrap>
                <EmptyIconWrap><Key /></EmptyIconWrap>
                <p style={{ margin: 0 }}>No API keys yet. Create one to start tracking usage.</p>
              </EmptyWrap>
            ) : (
              <KeyTable>
                {sorted.map((k, i) => (
                  <KeyRow key={k._id} $rank={i} $d={`${i * 0.05}s`}>
                    <RowKeyName>
                      <RankBadge $rank={i}>{i + 1}</RankBadge>
                      {k.name}
                    </RowKeyName>
                    <RowBarWrap>
                      <RowBarLabel>
                        <span>{k.requestCount.toLocaleString()} requests</span>
                        <span>{k.pct.toFixed(1)}%</span>
                      </RowBarLabel>
                      <BarTrack>
                        <BarFill $pct={k.pct} $rank={i} $d={`${0.3 + i * 0.08}s`} />
                      </BarTrack>
                    </RowBarWrap>
                    <ReqCount>{k.requestCount.toLocaleString()}</ReqCount>
                    <LastUsed $used={!!k.lastUsed}>
                      {k.lastUsed ? formatDate(k.lastUsed) : 'Never'}
                    </LastUsed>
                    <DelBtn onClick={() => handleDeleteKey(k._id)} title="Revoke key">
                      <Trash2 />
                    </DelBtn>
                  </KeyRow>
                ))}
              </KeyTable>
            )}
          </CardBody>
        </Card>

        {/* Insights */}
        {sorted.length > 0 && (
          <Card $d="0.3s">
            <CardHeader>
              <CardTitleGroup>
                <CardTitleIcon><Zap /></CardTitleIcon>
                <CardTitle>Key Insights</CardTitle>
              </CardTitleGroup>
            </CardHeader>
            <CardBody>
              <InsightGrid>
                <InsightCard $from="#f0f6ff" $to="#eff6ff" $border="#bfdbfe" $d="0.05s">
                  <InsightTitle $color="#1d4ed8"><Target /> Top Performer</InsightTitle>
                  <InsightValue>{mostUsed?.requestCount.toLocaleString() || '—'}</InsightValue>
                  <InsightSub>{mostUsed?.name} · {mostUsed?.pct.toFixed(1)}% of all traffic</InsightSub>
                </InsightCard>

                <InsightCard $from="#f0fdf4" $to="#dcfce720" $border="#bbf7d0" $d="0.1s">
                  <InsightTitle $color="#15803d"><Key /> Key Health</InsightTitle>
                  <InsightValue>{stats.activeKeys}/{stats.totalKeys}</InsightValue>
                  <InsightSub>keys actively sending requests</InsightSub>
                </InsightCard>

                <InsightCard $from="#fffbeb" $to="#fef3c720" $border="#fde68a" $d="0.15s">
                  <InsightTitle $color="#d97706"><Activity /> Avg Load</InsightTitle>
                  <InsightValue>{avgPerKey.toLocaleString()}</InsightValue>
                  <InsightSub>average requests per key</InsightSub>
                </InsightCard>

                <InsightCard $from="#fdf4ff" $to="#fae8ff20" $border="#e9d5ff" $d="0.2s">
                  <InsightTitle $color="#7c3aed"><Clock /> Last Active</InsightTitle>
                  <InsightValue style={{ fontSize: '1.1rem' }}>
                    {lastActive ? formatDate(lastActive.lastUsed) : 'Never'}
                  </InsightValue>
                  <InsightSub>{lastActive ? `via "${lastActive.name}"` : 'No activity yet'}</InsightSub>
                </InsightCard>
              </InsightGrid>
            </CardBody>
          </Card>
        )}

      </PageWrap>
    </>
  )
}

export default AnalyticsPage