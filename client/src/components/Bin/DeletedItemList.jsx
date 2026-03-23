import styled from 'styled-components'
import DeletedItemCard from './DeletedItemCard'

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
  padding: 20px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
`

const EmptyEmoji = styled.div`font-size: 2.8rem; margin-bottom: 14px;`
const EmptyText  = styled.p`font-size: 0.9rem; font-weight: 500; margin: 0 0 5px; color: #64748b;`
const EmptySub   = styled.p`font-size: 0.8rem; margin: 0; color: #94a3b8;`

const DeletedItemList = ({ items, onUpdate }) => {
  if (items.length === 0) return (
    <EmptyState>
      <EmptyEmoji>🗑️</EmptyEmoji>
      <EmptyText>Trash is empty</EmptyText>
      <EmptySub>Deleted items will appear here.</EmptySub>
    </EmptyState>
  )

  return (
    <Grid>
      {items.map(item => (
        <DeletedItemCard key={item._id} item={item} onUpdate={onUpdate} />
      ))}
    </Grid>
  )
}

export default DeletedItemList