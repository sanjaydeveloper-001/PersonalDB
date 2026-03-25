import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Plus, Edit2, Trash2, Eye, EyeOff, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import AdminTemplateModal from '../../components/Admin/AdminTemplateModal'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  svg {
    width: 24px;
    height: 24px;
    color: #3b82f6;
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }

  svg { width: 18px; height: 18px; }
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`

const StatCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    border-color: #3b82f6;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  }
`

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 0.5rem;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`

const Table = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const TableHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #64748b;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    display: none;
  }
`

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 0.875rem;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    padding: 1.5rem;
    background: #f8fafc;
    margin-bottom: 1rem;
    border-radius: 0.625rem;
  }
`

const TemplateName = styled.div`
  font-weight: 600;
  color: #0f172a;
`

const Stat = styled.div`
  color: #64748b;
`

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${({ $public }) => $public ? '#d1fae5' : '#fee2e2'};
  color: ${({ $public }) => $public ? '#065f46' : '#991b1b'};
`

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`

const IconBtn = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: ${({ $danger }) => $danger ? '#fee2e2' : '#eff6ff'};
  color: ${({ $danger }) => $danger ? '#dc2626' : '#3b82f6'};
  border-radius: 0.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  svg { width: 16px; height: 16px; }
`

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #64748b;

  svg {
    animation: spin 1s linear infinite;
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  }
`

const AdminTemplates = () => {
  const [templates, setTemplates] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, template: null })

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/admin/templates`, {
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        setTemplates(data.templates)
        setStats(data.stats)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error fetching templates:', error)
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return

    try {
      const response = await fetch(`${API_URL}/admin/templates/${templateId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        toast.success('Template deleted')
        fetchTemplates()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to delete template')
    }
  }

  const handleTogglePublic = async (template) => {
    try {
      const response = await fetch(`${API_URL}/admin/templates/${template._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublic: !template.isPublic }),
        credentials: 'include',
      })
      const data = await response.json()

      if (data.success) {
        toast.success(`Template is now ${!template.isPublic ? 'public' : 'private'}`)
        fetchTemplates()
      }
    } catch (error) {
      toast.error('Failed to update template')
    }
  }

  if (loading) {
    return (
      <LoadingContainer>
        <Loader />
        Loading templates...
      </LoadingContainer>
    )
  }

  return (
    <Container>
      <Header>
        <Title>📋 Templates Management</Title>
        <Button onClick={() => setModal({ open: true, template: null })}>
          <Plus />
          Create Template
        </Button>
      </Header>

      {stats && (
        <StatsGrid>
          <StatCard>
            <StatValue>{stats.total}</StatValue>
            <StatLabel>Total Templates</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.public}</StatValue>
            <StatLabel>Public Templates</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalUsers}</StatValue>
            <StatLabel>Users Using</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{stats.totalLikes}</StatValue>
            <StatLabel>Total Likes</StatLabel>
          </StatCard>
        </StatsGrid>
      )}

      <Table>
        <TableHeader>
          <div>Name</div>
          <div>Users</div>
          <div>Likes</div>
          <div>Status</div>
          <div>Actions</div>
        </TableHeader>

        {templates.map(template => (
          <TableRow key={template._id}>
            <TemplateName>{template.name}</TemplateName>
            <Stat>{template.usercount}</Stat>
            <Stat>{template.likescount}</Stat>
            <Status $public={template.isPublic}>
              {template.isPublic ? 'Public' : 'Private'}
            </Status>
            <Actions>
              <IconBtn onClick={() => setModal({ open: true, template })}>
                <Edit2 />
              </IconBtn>
              <IconBtn onClick={() => handleTogglePublic(template)}>
                {template.isPublic ? <Eye /> : <EyeOff />}
              </IconBtn>
              <IconBtn $danger onClick={() => handleDelete(template._id)}>
                <Trash2 />
              </IconBtn>
            </Actions>
          </TableRow>
        ))}
      </Table>

      <AdminTemplateModal
        open={modal.open}
        template={modal.template}
        onClose={() => setModal({ open: false, template: null })}
        onSave={fetchTemplates}
      />
    </Container>
  )
}

export default AdminTemplates