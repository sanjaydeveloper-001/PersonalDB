import styled from 'styled-components'
import { BarChart3, TrendingUp, Activity, Clock } from 'lucide-react'

// ── Styled ──────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 860px;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.5rem;
`

const IconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.625rem;

  svg { width: 1.25rem; height: 1.25rem; }
`

const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const PageDesc = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 2rem 0;
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 12px;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const StatLabel = styled.p`
  font-size: 0.78rem;
  font-weight: 500;
  color: #94a3b8;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const StatValue = styled.p`
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  line-height: 1;
`

const StatChange = styled.span`
  font-size: 0.78rem;
  color: ${props => props.$up ? '#15803d' : '#dc2626'};
  font-weight: 500;
`

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #eff6ff;
  color: #3b82f6;
  margin-bottom: 0.25rem;
  svg { width: 18px; height: 18px; }
`

const SectionTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
`

const ChartCard = styled.div`
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.25rem;
`

const BarGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
`

const BarLabel = styled.span`
  font-size: 0.8rem;
  color: #64748b;
  width: 32px;
  flex-shrink: 0;
  text-align: right;
`

const BarTrack = styled.div`
  flex: 1;
  height: 10px;
  background: #f1f5f9;
  border-radius: 5px;
  overflow: hidden;
`

const BarFill = styled.div`
  height: 100%;
  width: ${props => props.$pct}%;
  background: linear-gradient(90deg, #3b82f6, #1e40af);
  border-radius: 5px;
  transition: width 0.6s ease;
`

const BarCount = styled.span`
  font-size: 0.78rem;
  color: #94a3b8;
  width: 40px;
  flex-shrink: 0;
`

const EndpointTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const EndpointRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.625rem 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child { border-bottom: none; }
`

const MethodPill = styled.span`
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.18rem 0.45rem;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  background: ${({ $m }) =>
    $m === 'GET'    ? '#dcfce7' :
    $m === 'POST'   ? '#dbeafe' :
    $m === 'PUT'    ? '#fef9c3' :
    $m === 'DELETE' ? '#fee2e2' : '#f1f5f9'};
  color: ${({ $m }) =>
    $m === 'GET'    ? '#15803d' :
    $m === 'POST'   ? '#1e40af' :
    $m === 'PUT'    ? '#92400e' :
    $m === 'DELETE' ? '#b91c1c' : '#475569'};
  flex-shrink: 0;
`

const EndpointPath = styled.code`
  flex: 1;
  font-size: 0.8rem;
  color: #334155;
  font-family: 'Courier New', monospace;
`

const EndpointCalls = styled.span`
  font-size: 0.8rem;
  color: #94a3b8;
  flex-shrink: 0;
`

const LatencyBadge = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: ${props => props.$ms < 100 ? '#15803d' : props.$ms < 300 ? '#92400e' : '#b91c1c'};
  flex-shrink: 0;
  width: 60px;
  text-align: right;
`

// ── Mock data ────────────────────────────────────────────────────────────────
const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const weekCalls = [142, 89, 203, 176, 310, 98, 54]
const maxCalls = Math.max(...weekCalls)

const topEndpoints = [
  { method: 'GET',    path: '/vault/items',          calls: 1204, ms: 48 },
  { method: 'POST',   path: '/vault/auth/login',     calls: 873,  ms: 92 },
  { method: 'PUT',    path: '/vault/items/:id',      calls: 541,  ms: 135 },
  { method: 'GET',    path: '/portfolio/profile',    calls: 398,  ms: 61 },
  { method: 'DELETE', path: '/vault/items/:id',      calls: 112,  ms: 78 },
]

// ── Page ────────────────────────────────────────────────────────────────────
const AnalyticsPage = () => (
  <PageWrap>
    <PageHeader>
      <IconBox><BarChart3 /></IconBox>
      <PageTitle>Analytics</PageTitle>
    </PageHeader>
    <PageDesc>Monitor API usage, request volume, and endpoint performance.</PageDesc>

    <StatsGrid>
      <StatCard>
        <StatIcon><Activity /></StatIcon>
        <StatLabel>Total requests</StatLabel>
        <StatValue>3,072</StatValue>
        <StatChange $up>↑ 12% this week</StatChange>
      </StatCard>
      <StatCard>
        <StatIcon><TrendingUp /></StatIcon>
        <StatLabel>Success rate</StatLabel>
        <StatValue>98.4%</StatValue>
        <StatChange $up>↑ 0.3% vs last week</StatChange>
      </StatCard>
      <StatCard>
        <StatIcon><Clock /></StatIcon>
        <StatLabel>Avg latency</StatLabel>
        <StatValue>81ms</StatValue>
        <StatChange>↓ 4ms vs last week</StatChange>
      </StatCard>
      <StatCard>
        <StatIcon><BarChart3 /></StatIcon>
        <StatLabel>Error rate</StatLabel>
        <StatValue>1.6%</StatValue>
        <StatChange>↑ 0.1%</StatChange>
      </StatCard>
    </StatsGrid>

    <ChartCard>
      <SectionTitle>Requests — last 7 days</SectionTitle>
      <BarGroup>
        {weekDays.map((day, i) => (
          <BarRow key={day}>
            <BarLabel>{day}</BarLabel>
            <BarTrack>
              <BarFill $pct={(weekCalls[i] / maxCalls) * 100} />
            </BarTrack>
            <BarCount>{weekCalls[i]}</BarCount>
          </BarRow>
        ))}
      </BarGroup>
    </ChartCard>

    <ChartCard>
      <SectionTitle>Top endpoints</SectionTitle>
      <EndpointTable>
        {topEndpoints.map((e, i) => (
          <EndpointRow key={i}>
            <MethodPill $m={e.method}>{e.method}</MethodPill>
            <EndpointPath>{e.path}</EndpointPath>
            <EndpointCalls>{e.calls.toLocaleString()} calls</EndpointCalls>
            <LatencyBadge $ms={e.ms}>{e.ms}ms</LatencyBadge>
          </EndpointRow>
        ))}
      </EndpointTable>
    </ChartCard>
  </PageWrap>
)

export default AnalyticsPage