import styled from 'styled-components'
import { useAuth } from '../contexts/AuthContext'
import {
  User, Calendar, Key, Clock, Hash, Shield, Activity,
  ExternalLink, Copy, Globe
} from 'lucide-react'
import toast from 'react-hot-toast'

// ── Styled ──────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const ProfileHero = styled.div`
  background: white;
  border: 1px solid rgba(59,130,246,0.1);
  border-radius: 16px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.75rem;

  @media (max-width: 600px) { flex-direction: column; align-items: flex-start; gap: 1.25rem; }
`

const AvatarLarge = styled.div`
  width: 80px; height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  display: flex; align-items: center; justify-content: center;
  color: white;
  font-size: 2rem; font-weight: 700;
  font-family: 'Courier New', monospace;
  flex-shrink: 0;
`

const ProfileMeta = styled.div`
  flex: 1;
`

const ProfileName = styled.h1`
  font-size: 1.5rem; font-weight: 700; color: #0f172a; margin: 0 0 0.25rem 0;
`

const ProfileSubtitle = styled.p`
  font-size: 0.875rem; color: #94a3b8; margin: 0 0 0.75rem 0;
`

const BadgeRow = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.5rem;
`

const Badge = styled.span`
  display: inline-flex; align-items: center; gap: 0.35rem;
  font-size: 0.75rem; font-weight: 500;
  padding: 0.25rem 0.6rem; border-radius: 6px;
  background: ${props => props.$bg || '#eff6ff'};
  color: ${props => props.$color || '#1e40af'};
  svg { width: 12px; height: 12px; }
`

const SectionCard = styled.div`
  background: white;
  border: 1px solid rgba(59,130,246,0.1);
  border-radius: 14px;
  overflow: hidden;
`

const CardHeader = styled.div`
  display: flex; align-items: center; gap: 0.625rem;
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;

  svg { width: 17px; height: 17px; color: #3b82f6; }
`

const CardHeaderTitle = styled.h2`
  font-size: 0.9rem; font-weight: 600; color: #0f172a; margin: 0;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0;
`

const InfoItem = styled.div`
  padding: 1.1rem 1.5rem;
  border-bottom: 1px solid #f8fafc;
  border-right: 1px solid #f8fafc;

  &:nth-child(even) { border-right: none; }
`

const InfoLabel = styled.p`
  font-size: 0.72rem; font-weight: 600; text-transform: uppercase;
  letter-spacing: 0.06em; color: #94a3b8; margin: 0 0 0.3rem 0;
`

const InfoValue = styled.p`
  font-size: 0.9rem; font-weight: 500; color: #0f172a; margin: 0;
  font-family: ${props => props.$mono ? "'Courier New', monospace" : 'inherit'};
`

const InfoValueMuted = styled(InfoValue)`
  color: #94a3b8; font-style: italic;
`

const ApiKeyList = styled.div`
  display: flex; flex-direction: column;
`

const ApiKeyRow = styled.div`
  display: flex; align-items: center; gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f8fafc;
  &:last-child { border-bottom: none; }

  @media (max-width: 600px) { flex-wrap: wrap; }
`

const KeyName = styled.span`
  font-size: 0.875rem; font-weight: 500; color: #0f172a; flex: 1; min-width: 0;
`

const KeyStats = styled.div`
  display: flex; align-items: center; gap: 1rem; flex-shrink: 0;
`

const KeyStat = styled.span`
  font-size: 0.78rem; color: #64748b;
  display: flex; align-items: center; gap: 0.3rem;
  svg { width: 12px; height: 12px; }
`

const KeyDate = styled.span`
  font-size: 0.75rem; color: #94a3b8; flex-shrink: 0;
`

const EmptyKeys = styled.div`
  padding: 2rem; text-align: center; color: #94a3b8; font-size: 0.875rem;
  svg { width: 2rem; height: 2rem; margin: 0 auto 0.75rem; display: block; color: #cbd5e1; }
`

const PublicLinkRow = styled.div`
  display: flex; align-items: center; gap: 0.75rem;
  padding: 1.1rem 1.5rem;
`

const PublicUrl = styled.code`
  flex: 1; font-size: 0.825rem; color: #334155;
  font-family: 'Courier New', monospace;
  background: #f8fafc; border: 1px solid #e2e8f0;
  border-radius: 6px; padding: 0.4rem 0.75rem;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`

const IconBtn = styled.button`
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border: 1px solid #e2e8f0;
  background: white; border-radius: 7px; cursor: pointer; color: #64748b;
  transition: all 0.15s; flex-shrink: 0;
  &:hover { background: #eff6ff; color: #1e40af; border-color: #bfdbfe; }
  svg { width: 14px; height: 14px; }
`

// ── Helpers ─────────────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  })
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
  return `${Math.floor(months / 12)} year${Math.floor(months / 12) > 1 ? 's' : ''} ago`
}

// ── Page ────────────────────────────────────────────────────────────────────
const AccountPage = () => {
  const { user } = useAuth()

  const publicUrl = `${window.location.origin}/u/${user?.username}`

  const copyPublicUrl = () => {
    navigator.clipboard.writeText(publicUrl)
    toast.success('Public profile URL copied!')
  }

  const totalRequests = user?.apiKeys?.reduce((sum, k) => sum + (k.requestCount || 0), 0) ?? 0

  return (
    <PageWrap>
      {/* Profile hero */}
      <ProfileHero>
        <AvatarLarge>{user?.username?.[0]?.toUpperCase()}</AvatarLarge>
        <ProfileMeta>
          <ProfileName>{user?.username}</ProfileName>
          <ProfileSubtitle>PersonalDB member</ProfileSubtitle>
          <BadgeRow>
            <Badge $bg="#dcfce7" $color="#15803d">
              <Shield /> Active account
            </Badge>
            <Badge $bg="#eff6ff" $color="#1e40af">
              <Key /> {user?.apiKeys?.length ?? 0} API key{user?.apiKeys?.length !== 1 ? 's' : ''}
            </Badge>
            {user?.createdAt && (
              <Badge $bg="#f1f5f9" $color="#475569">
                <Calendar /> Joined {timeAgo(user.createdAt)}
              </Badge>
            )}
          </BadgeRow>
        </ProfileMeta>
      </ProfileHero>

      {/* Account details */}
      <SectionCard>
        <CardHeader>
          <User />
          <CardHeaderTitle>Account details</CardHeaderTitle>
        </CardHeader>
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Username</InfoLabel>
            <InfoValue $mono>{user?.username ?? '—'}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>User ID</InfoLabel>
            <InfoValue $mono style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              {user?._id ?? '—'}
            </InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Account created</InfoLabel>
            <InfoValue>{formatDate(user?.createdAt)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Last updated</InfoLabel>
            <InfoValue>{formatDate(user?.updatedAt)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Birth year</InfoLabel>
            {user?.birthYear
              ? <InfoValue>{user.birthYear}</InfoValue>
              : <InfoValueMuted>Not set</InfoValueMuted>
            }
          </InfoItem>
          <InfoItem>
            <InfoLabel>Security questions</InfoLabel>
            <InfoValue>
              {user?.placeAnswerHash && user?.friendAnswerHash
                ? '✓ Configured'
                : <span style={{ color: '#f59e0b' }}>⚠ Incomplete</span>
              }
            </InfoValue>
          </InfoItem>
        </InfoGrid>
      </SectionCard>

      {/* Public profile link */}
      <SectionCard>
        <CardHeader>
          <Globe />
          <CardHeaderTitle>Public portfolio link</CardHeaderTitle>
        </CardHeader>
        <PublicLinkRow>
          <PublicUrl>{publicUrl}</PublicUrl>
          <IconBtn onClick={copyPublicUrl} title="Copy URL"><Copy /></IconBtn>
          <IconBtn as="a" href={publicUrl} target="_blank" rel="noopener noreferrer" title="Open">
            <ExternalLink />
          </IconBtn>
        </PublicLinkRow>
      </SectionCard>

      {/* API key summary */}
      <SectionCard>
        <CardHeader>
          <Key />
          <CardHeaderTitle>API keys — overview</CardHeaderTitle>
        </CardHeader>

        {!user?.apiKeys?.length ? (
          <EmptyKeys>
            <Key />
            No API keys yet. Generate one in the Developer section.
          </EmptyKeys>
        ) : (
          <>
            <ApiKeyList>
              {user.apiKeys.map((k) => (
                <ApiKeyRow key={k._id ?? k.name}>
                  <KeyName>{k.name}</KeyName>
                  <KeyStats>
                    <KeyStat>
                      <Activity /> {(k.requestCount ?? 0).toLocaleString()} requests
                    </KeyStat>
                    {k.lastUsed && (
                      <KeyStat>
                        <Clock /> Last used {timeAgo(k.lastUsed)}
                      </KeyStat>
                    )}
                  </KeyStats>
                  <KeyDate>Created {formatDate(k.createdAt)}</KeyDate>
                </ApiKeyRow>
              ))}
            </ApiKeyList>

            {/* Summary row */}
            <div style={{
              padding: '0.875rem 1.5rem',
              borderTop: '1px solid #f1f5f9',
              display: 'flex', gap: '2rem',
              background: '#fafbff'
            }}>
              <div>
                <InfoLabel>Total keys</InfoLabel>
                <InfoValue style={{ fontSize: '1.1rem' }}>{user.apiKeys.length}</InfoValue>
              </div>
              <div>
                <InfoLabel>Total requests</InfoLabel>
                <InfoValue style={{ fontSize: '1.1rem' }}>{totalRequests.toLocaleString()}</InfoValue>
              </div>
            </div>
          </>
        )}
      </SectionCard>
    </PageWrap>
  )
}

export default AccountPage