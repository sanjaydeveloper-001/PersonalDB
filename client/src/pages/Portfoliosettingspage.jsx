import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Layout, Settings2 } from 'lucide-react'
import TemplateCard from '../components/TemplateCard'
import toast from 'react-hot-toast'

/* ─── Animations ─── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ──── PAGE LAYOUT ──── */
const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  animation: ${fadeUp} 0.4s ease forwards;
  max-width: 100%;
`

const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const PageTitle = styled.h1`
  font-size: 1.35rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;

  svg {
    width: 20px;
    height: 20px;
    color: #3b82f6;
  }
`

const PageDesc = styled.p`
  font-size: 0.825rem;
  color: #94a3b8;
  margin: 0;
`

/* ──── TEMPLATES GRID SECTION ──── */
const GridWrap = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 1.5rem;
`

const GridHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`

const GridTitle = styled.h2`
  font-size: 1rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg { width: 18px; height: 18px; color: #3b82f6; }
`

const GridSubtitle = styled.p`
  font-size: 0.78rem;
  color: #94a3b8;
  margin: 0.2rem 0 0;
`

const GridCount = styled.span`
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #3b82f6;
  padding: 2px 10px;
  border-radius: 20px;
`

const TemplatesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(2, 1fr);
  }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  min-height: 400px;
`

const LoadingText = styled.p`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1rem;
  color: #64748b;
  margin: 0;

  svg {
    animation: spin 1s linear infinite;
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #94a3b8;

  p {
    font-size: 1rem;
    margin: 0;
  }
`

const Spinner = styled.div`
  width: 18px;
  height: 18px;
  border: 2px solid rgba(59, 130, 246, 0.2);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

/* ════════════════════════════════════════
   PORTFOLIO SETTINGS PAGE
═══════════════════════��════════════════ */
const PortfolioSettingsPage = () => {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [defaultTemplate, setDefaultTemplate] = useState(null)
  const [likedTemplates, setLikedTemplates] = useState({})
  const [saving, setSaving] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  /* ── Fetch all templates ── */
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/templates/all`)
        const data = await response.json()

        if (data.success) {
          setTemplates(data.templates || [])
        } else {
          toast.error(data.message || 'Failed to load templates')
        }
      } catch (error) {
        console.error('Error fetching templates:', error)
        toast.error('Failed to load templates')
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  /* ── Fetch user's default template ── */
  useEffect(() => {
    const fetchUserTemplate = async () => {
      try {
        const response = await fetch(`${API_URL}/templates/preference`, {
          credentials: 'include',
        })
        const data = await response.json()

        if (data.success && data.templateId) {
          setDefaultTemplate(data.templateId)
        }
      } catch (error) {
        console.error('Error fetching user template:', error)
      }
    }

    fetchUserTemplate()
  }, [])

  /* ── Set default template ── */
  const handleSetDefault = async (templateId) => {
    try {
      setSaving(true)
      const response = await fetch(`${API_URL}/templates/set`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setDefaultTemplate(templateId)
        const templateName = templates.find(t => t._id === templateId)?.name
        toast.success(`"${templateName}" set as default template`)
      } else {
        toast.error(data.message || 'Failed to set template')
      }
    } catch (error) {
      console.error('Error setting template:', error)
      toast.error('Failed to set template')
    } finally {
      setSaving(false)
    }
  }

  /* ── Like template ── */
  const handleLike = async (templateId) => {
    try {
      const response = await fetch(`${API_URL}/templates/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateId }),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setLikedTemplates(prev => ({
          ...prev,
          [templateId]: true,
        }))

        // Update template likescount
        setTemplates(prev =>
          prev.map(t =>
            t._id === templateId ? { ...t, likescount: t.likescount + 1 } : t
          )
        )

        toast.success('❤️ You liked this template')
      } else {
        toast.error(data.message || 'Failed to like template')
      }
    } catch (error) {
      console.error('Error liking template:', error)
      toast.error('Failed to like template')
    }
  }

  /* ── Unlike template (toggle) ── */
  const handleUnlike = async (templateId) => {
    try {
      // Decrease likescount locally
      setLikedTemplates(prev => ({
        ...prev,
        [templateId]: false,
      }))

      setTemplates(prev =>
        prev.map(t =>
          t._id === templateId && t.likescount > 0
            ? { ...t, likescount: t.likescount - 1 }
            : t
        )
      )

      toast.success('Removed like')
    } catch (error) {
      console.error('Error unliking template:', error)
      toast.error('Failed to unlike template')
    }
  }

  return (
    <Root>
      {/* ── Page header ── */}
      <PageHeader>
        <PageTitle>
          <Settings2 />
          Portfolio Settings
        </PageTitle>
        <PageDesc>Choose and manage your portfolio template</PageDesc>
      </PageHeader>

      {/* ════════════════
          TEMPLATES GRID
      ════════════════ */}
      <GridWrap>
        <GridHeader>
          <div>
            <GridTitle>
              <Layout />
              Portfolio Templates
            </GridTitle>
            <GridSubtitle>Pick a default template for your public portfolio</GridSubtitle>
          </div>
          {!loading && <GridCount>{templates.length} templates</GridCount>}
        </GridHeader>

        {loading ? (
          <LoadingContainer>
            <LoadingText>
              <Spinner />
              Loading templates...
            </LoadingText>
          </LoadingContainer>
        ) : templates.length === 0 ? (
          <EmptyState>
            <p>No templates available at the moment</p>
          </EmptyState>
        ) : (
          <TemplatesGrid>
            {templates.map(template => (
              <TemplateCard
                key={template._id}
                template={template}
                isDefault={defaultTemplate === template._id}
                onSetDefault={handleSetDefault}
                onLike={handleLike}
                onUnlike={handleUnlike}
                isLiked={likedTemplates[template._id] || false}
                loading={saving}
              />
            ))}
          </TemplatesGrid>
        )}
      </GridWrap>
    </Root>
  )
}

export default PortfolioSettingsPage