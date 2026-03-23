import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { itemService } from '../../services/itemService'
import ItemCard from '../../components/vault/ItemCard'
import CreateItemModal from '../../components/vault/CreateItemModal'
import { Plus, Lock } from 'lucide-react'

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

const TitleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  flex-shrink: 0;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`

const CreateButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }
  
  svg {
    width: 1rem;
    height: 1rem;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  background: white;
  border: 2px dashed #e2e8f0;
  border-radius: 0.75rem;
  color: #64748b;
  font-size: 1rem;
`

const EmptyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  background: linear-gradient(135deg, #e0e7ff 0%, #f0f4fF 100%);
  border-radius: 0.75rem;
  margin: 0 auto 1rem;
  color: #3b82f6;
  font-size: 2rem;
  
  svg {
    width: 2rem;
    height: 2rem;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  min-height: 400px;
  color: #64748b;
  font-size: 1rem;
`

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-right: 0.5rem;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`

const ItemsPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    try {
      const { data } = await itemService.getItems()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <LoadingContainer>
      <Spinner /> Loading items...
    </LoadingContainer>
  )

  return (
    <PageContainer>
      <Header>
        <Title>
          <TitleIcon><Lock /></TitleIcon>
          Vault Items
        </Title>
        <CreateButton onClick={() => setShowCreate(true)}>
          <Plus /> New Item
        </CreateButton>
      </Header>

      {items.length === 0 ? (
        <EmptyState>
          <EmptyIcon><Lock /></EmptyIcon>
          <p>No items in your vault yet. Create your first one!</p>
        </EmptyState>
      ) : (
        <Grid>
          {items.map(item => (
            <ItemCard
              key={item._id}
              item={item}
              onDelete={(id) => setItems(prev => prev.filter(i => i._id !== id))}
              onUpdate={(updated) => setItems(prev => prev.map(i => i._id === updated._id ? updated : i))}
            />
          ))}
        </Grid>
      )}

      <CreateItemModal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        onSuccess={(newItem) => { setItems(prev => [newItem, ...prev]); setShowCreate(false) }}
      />
    </PageContainer>
  )
}

export default ItemsPage
