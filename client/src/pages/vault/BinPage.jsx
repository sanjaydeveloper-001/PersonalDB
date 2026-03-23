import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { itemService } from '../../services/itemService'
import { useConfirm } from '../../hooks/useConfirm'
import { RotateCcw, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
`

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`

const DangerButton = styled.button`
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`

const ListContainer = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.75rem;
  overflow: hidden;
  transition: all 0.3s ease;
`

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  transition: all 0.2s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
  }
`

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ItemTitle = styled.p`
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  word-break: break-word;
`

const ItemType = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  text-transform: capitalize;
  font-weight: 500;
`

const ActionsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid ${props => props.danger ? '#fecaca' : '#e2e8f0'};
  background: ${props => props.danger ? '#fee2e2' : 'white'};
  color: ${props => props.danger ? '#dc2626' : '#64748b'};
  padding: 0.5rem 0.875rem;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    background: ${props => props.danger ? '#fca5a5' : '#f0f4f8'};
    color: ${props => props.danger ? '#b91c1c' : '#0f172a'};
    border-color: ${props => props.danger ? '#dc2626' : '#3b82f6'};
  }
  
  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    width: 2.25rem;
    justify-content: center;
    gap: 0;
    
    span {
      display: none;
    }
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  color: #64748b;
  font-size: 1rem;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  color: #64748b;
`

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid #e2e8f0;
  border-top-color: #ef4444;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const BinPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { confirm, ConfirmModal } = useConfirm()

  useEffect(() => { fetchTrash() }, [])

  const fetchTrash = async () => {
    try {
      const { data } = await itemService.getTrash()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id) => {
    try {
      await itemService.restoreItem(id)
      setItems(prev => prev.filter(i => i._id !== id))
      toast.success('Item restored')
    } catch {
      toast.error('Failed to restore')
    }
  }

  const handlePermanentDelete = async (id) => {
    const ok = await confirm({ title: 'Permanently delete', message: 'This cannot be undone. Are you sure?' })
    if (!ok) return
    try {
      await itemService.permanentDelete(id)
      setItems(prev => prev.filter(i => i._id !== id))
      toast.success('Permanently deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleEmptyTrash = async () => {
    const ok = await confirm({ title: 'Empty Trash', message: 'Permanently delete all items in trash?' })
    if (!ok) return
    try {
      await itemService.emptyTrash()
      setItems([])
      toast.success('Trash emptied')
    } catch {
      toast.error('Failed to empty trash')
    }
  }

  if (loading) return (
    <LoadingContainer>
      <Spinner /> Loading...
    </LoadingContainer>
  )

  return (
    <PageContainer>
      <Header>
        <Title>🗑 Trash</Title>
        {items.length > 0 && (
          <DangerButton onClick={handleEmptyTrash}>Empty Trash</DangerButton>
        )}
      </Header>

      {items.length === 0 ? (
        <EmptyState>Trash is empty. Deleted items will appear here.</EmptyState>
      ) : (
        <ListContainer>
          {items.map(item => (
            <ListItem key={item._id}>
              <ItemInfo>
                <ItemTitle>{item.title || 'Untitled'}</ItemTitle>
                <ItemType>{item.type}</ItemType>
              </ItemInfo>
              <ActionsContainer>
                <ActionButton onClick={() => handleRestore(item._id)} title="Restore this item">
                  <RotateCcw /> <span>Restore</span>
                </ActionButton>
                <ActionButton danger onClick={() => handlePermanentDelete(item._id)} title="Permanently delete">
                  <Trash2 /> <span>Delete</span>
                </ActionButton>
              </ActionsContainer>
            </ListItem>
          ))}
        </ListContainer>
      )}
      <ConfirmModal />
    </PageContainer>
  )
}

export default BinPage
