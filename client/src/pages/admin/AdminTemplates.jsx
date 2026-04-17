import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader, FileStack, LayoutGrid, List } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminTemplateModal from '../../components/Admin/AdminTemplateModal'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

/* ── Shell ── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  width: 100%;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`

const IconBox = styled.div`
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,119,255,0.12));
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent, #00d4ff);
  box-shadow: 0 0 22px rgba(0,212,255,0.14);
`

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary, #e2e8f0);
  line-height: 1;
  margin: 0 0 0.35rem;
`

const PageSub = styled.p`
  font-size: 0.84rem;
  color: var(--text-muted, #64748b);
  margin: 0;
`

const HeadRight = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const CreateBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.25s ease;
  svg { width: 16px; height: 16px; }
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(59,130,246,0.35);
  }
`

const ViewToggle = styled.div`
  display: flex;
  background: var(--bg-card, #161b27);
  border: 1px solid var(--border, rgba(0,212,255,0.1));
  border-radius: 10px;
  overflow: hidden;
`

const ViewBtn = styled.button`
  padding: 0.55rem 0.75rem;
  border: none;
  background: ${({ $active }) => $active ? 'rgba(0,212,255,0.12)' : 'transparent'};
  color: ${({ $active }) => $active ? '#00d4ff' : 'var(--text-muted, #64748b)'};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  svg { width: 16px; height: 16px; }
  &:hover { color: #00d4ff; }
`

/* ── Stats ── */
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid var(--border, rgba(0,212,255,0.1));
  border-radius: 18px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.08}s;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent);
  }

  &:hover {
    border-color: rgba(0,212,255,0.25);
    box-shadow: 0 8px 32px rgba(0,212,255,0.08);
    transform: translateY(-2px);
  }
`

const StatValue = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--accent, #00d4ff);
  margin-bottom: 0.35rem;
  line-height: 1;
`

const StatLabel = styled.div`
  font-size: 0.78rem;
  color: var(--text-muted, #64748b);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`

/* ── Table ── */
const SCard = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid var(--border, rgba(0,212,255,0.1));
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  animation: ${fadeUp} 0.4s ease both;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent);
  }
`

const TableHead = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 0.9fr 0.7fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255,255,255,0.02);
  border-bottom: 1px solid var(--border, rgba(0,212,255,0.1));
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted, #64748b);

  @media (max-width: 768px) { display: none; }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 0.9fr 0.7fr;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  align-items: center;
  font-size: 0.875rem;
  transition: background 0.2s;

  &:last-child { border-bottom: none; }
  &:hover { background: rgba(0,212,255,0.03); }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    border-bottom: 1px solid var(--border, rgba(0,212,255,0.1));
  }
`

const TemplateName = styled.div`
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  font-family: 'DM Sans', sans-serif;
`

const StatCell = styled.div`
  color: var(--text-muted, #64748b);
  font-size: 0.84rem;
`

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.75rem;
  border-radius: 8px;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  background: ${({ $public }) => $public ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.1)'};
  color: ${({ $public }) => $public ? '#10b981' : '#ef4444'};
  border: 1px solid ${({ $public }) => $public ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.15)'};
`

const Actions = styled.div`
  display: flex;
  gap: 0.45rem;
`

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ $danger }) => $danger ? 'rgba(239,68,68,0.2)' : 'rgba(0,212,255,0.15)'};
  background: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.08)' : 'rgba(0,212,255,0.06)'};
  color: ${({ $danger }) => $danger ? '#f87171' : '#00d4ff'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  svg { width: 14px; height: 14px; }

  &:hover {
    background: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.18)' : 'rgba(0,212,255,0.14)'};
    border-color: ${({ $danger }) => $danger ? 'rgba(239,68,68,0.35)' : 'rgba(0,212,255,0.3)'};
    transform: translateY(-1px);
  }

  &:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
`

/* ── Grid view ── */
const GridView = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  padding: 1.5rem;
`

const GridCard = styled.div`
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--border, rgba(0,212,255,0.1));
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s ease;
  animation: ${fadeUp} 0.35s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.06}s;

  &:hover {
    border-color: rgba(0,212,255,0.25);
    box-shadow: 0 12px 40px rgba(0,212,255,0.08);
    transform: translateY(-3px);
  }
`

const GridThumb = styled.div`
  height: 140px;
  overflow: hidden;
  background: rgba(0,0,0,0.3);
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.3s;
  }

  ${GridCard}:hover & img { transform: scale(1.04); }
`

const GridThumbPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0,212,255,0.2);
  font-size: 2.5rem;
`

const GridBody = styled.div`
  padding: 1rem 1.1rem;
`

const GridName = styled.div`
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--text-primary, #e2e8f0);
  margin-bottom: 0.5rem;
`

const GridMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`

const GridStats = styled.div`
  font-size: 0.75rem;
  color: var(--text-muted, #64748b);
  display: flex;
  gap: 0.75rem;
`

const GridActions = styled.div`
  display: flex;
  gap: 0.4rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border, rgba(0,212,255,0.08));
`

/* ── Loading / Empty ── */
const LoadingWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 4rem;
  color: var(--text-muted, #64748b);
  font-size: 0.9rem;

  svg { animation: ${spin} 1s linear infinite; color: #00d4ff; }
`

const EmptyWrap = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted, #64748b);
  font-size: 0.88rem;
`

/* ═══════════════════════════════════════════════════════ */
const AdminTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, template: null })
  const [view, setView] = useState('grid')

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => { fetchTemplates() }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API_URL}/admin/templates`, { credentials: 'include' })
      const data = await res.json()
      if (data.success) { setTemplates(data.templates); setStats(data.stats) }
      else toast.error(data.message)
    } catch { toast.error('Failed to load templates') }
    finally { setLoading(false) }
  }

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return
    try {
      const res = await fetch(`${API_URL}/admin/templates/${templateId}`, { method: 'DELETE', credentials: 'include' })
      const data = await res.json()
      if (data.success) { toast.success('Template deleted'); fetchTemplates() }
      else toast.error(data.message)
    } catch { toast.error('Failed to delete template') }
  }

  const handleTogglePublic = async (template) => {
    try {
      const res = await fetch(`${API_URL}/admin/templates/${template._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !template.isPublic }),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success) { toast.success(`Template is now ${!template.isPublic ? 'public' : 'private'}`); fetchTemplates() }
    } catch { toast.error('Failed to update template') }
  }

  if (loading) return (
    <LoadingWrap><Loader size={20} /> Loading templates…</LoadingWrap>
  )

  return (
    <Page>
      <PageHead>
        <HeadLeft>
          <IconBox><FileStack size={22} /></IconBox>
          <div>
            <PageTitle>Templates</PageTitle>
            <PageSub>Manage and publish resume templates</PageSub>
          </div>
        </HeadLeft>
        <HeadRight>
          <ViewToggle>
            <ViewBtn $active={view === 'grid'} onClick={() => setView('grid')}><LayoutGrid /></ViewBtn>
            <ViewBtn $active={view === 'table'} onClick={() => setView('table')}><List /></ViewBtn>
          </ViewToggle>
          <CreateBtn onClick={() => setModal({ open: true, template: null })}>
            <Plus /> Create Template
          </CreateBtn>
        </HeadRight>
      </PageHead>

      {stats && (
        <StatsGrid>
          {[
            { label: 'Total', value: stats.total },
            { label: 'Public', value: stats.public },
            { label: 'Users', value: stats.totalUsers },
            { label: 'Total Likes', value: stats.totalLikes },
          ].map((s, i) => (
            <StatCard key={s.label} $i={i}>
              <StatValue>{s.value}</StatValue>
              <StatLabel>{s.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      )}

      <SCard>
        {view === 'table' ? (
          <>
            <TableHead>
              <div>Name</div>
              <div>Users</div>
              <div>Likes</div>
              <div>Status</div>
              <div>Actions</div>
            </TableHead>
            {templates.length === 0
              ? <EmptyWrap>No templates found. Create your first one!</EmptyWrap>
              : templates.map(t => (
                <TableRow key={t._id}>
                  <TemplateName>{t.name}</TemplateName>
                  <StatCell>{t.usercount}</StatCell>
                  <StatCell>{t.likescount}</StatCell>
                  <StatusBadge $public={t.isPublic}>{t.isPublic ? 'Public' : 'Private'}</StatusBadge>
                  <Actions>
                    <IconBtn onClick={() => setModal({ open: true, template: t })} title="Edit"><Edit2 /></IconBtn>
                    <IconBtn onClick={() => handleTogglePublic(t)} title={t.isPublic ? 'Make private' : 'Make public'}>
                      {t.isPublic ? <Eye /> : <EyeOff />}
                    </IconBtn>
                    <IconBtn $danger onClick={() => handleDelete(t._id)} title="Delete"><Trash2 /></IconBtn>
                  </Actions>
                </TableRow>
              ))
            }
          </>
        ) : (
          <GridView>
            {templates.length === 0
              ? <EmptyWrap style={{ gridColumn: '1/-1' }}>No templates found. Create your first one!</EmptyWrap>
              : templates.map((t, i) => (
                <GridCard key={t._id} $i={i}>
                  <GridThumb>
                    {t.image
                      ? <img src={t.image} alt={t.name} />
                      : <GridThumbPlaceholder>📋</GridThumbPlaceholder>
                    }
                  </GridThumb>
                  <GridBody>
                    <GridName>{t.name}</GridName>
                    <GridMeta>
                      <GridStats>
                        <span>👤 {t.usercount}</span>
                        <span>❤️ {t.likescount}</span>
                      </GridStats>
                      <StatusBadge $public={t.isPublic}>{t.isPublic ? 'Public' : 'Private'}</StatusBadge>
                    </GridMeta>
                    <GridActions>
                      <IconBtn onClick={() => setModal({ open: true, template: t })} title="Edit"><Edit2 /></IconBtn>
                      <IconBtn onClick={() => handleTogglePublic(t)} title={t.isPublic ? 'Make private' : 'Make public'}>
                        {t.isPublic ? <Eye /> : <EyeOff />}
                      </IconBtn>
                      <IconBtn $danger onClick={() => handleDelete(t._id)} title="Delete"><Trash2 /></IconBtn>
                    </GridActions>
                  </GridBody>
                </GridCard>
              ))
            }
          </GridView>
        )}
      </SCard>

      <AdminTemplateModal
        open={modal.open}
        template={modal.template}
        onClose={() => setModal({ open: false, template: null })}
        onSave={fetchTemplates}
      />
    </Page>
  )
}

export default AdminTemplates