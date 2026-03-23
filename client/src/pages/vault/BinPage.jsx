import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { itemService } from '../../services/itemService'
import { useConfirm } from '../../hooks/useConfirm'
import DeletedItemList from '../../components/Bin/DeletedItemList'
import { Trash2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const spin = keyframes`to { transform: rotate(360deg); }`
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`

/* ── Header ── */
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  animation: ${fadeUp} 0.45s ease forwards;
`

const TitleGroup = styled.div``

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  @media (max-width: 768px) { font-size: 1.5rem; }
`

const TitleIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border-radius: 0.625rem;
  flex-shrink: 0;
  svg { width: 1.2rem; height: 1.2rem; }
`

const CountBadge = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 20px;
  padding: 2px 10px;
`

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0 3rem;
`

const DangerButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  align-self: flex-start;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
  }

  &:disabled { opacity: 0.6; cursor: not-allowed; }
  svg { width: 1rem; height: 1rem; }
`

/* ── Warning bar ── */
const WarningBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.75rem;
  padding: 14px 18px;
  color: #dc2626;
  font-size: 0.875rem;
  animation: ${fadeUp} 0.45s 0.1s ease both;
  svg { width: 1.1rem; height: 1.1rem; flex-shrink: 0; }
`

/* ── Bin card wrapper ── */
const BinCard = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.875rem;
  overflow: hidden;
  animation: ${fadeUp} 0.45s 0.2s ease both;
`

const BinCardHeader = styled.div`
  background: #fef2f2;
  border-bottom: 1px solid #fecaca;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #94a3b8;

  span:first-child {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #64748b;
    font-weight: 500;
    svg { width: 13px; height: 13px; }
  }
`

/* ── Empty / loading ── */
const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
`

const EmptyEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: 12px;
`

const EmptyText = styled.p`
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0 0 6px;
  color: #64748b;
`

const EmptyHint = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  margin: 0;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  padding: 3rem 1rem;
  color: #64748b;
`

const Spinner = styled.div`
  width: 1.25rem;
  height: 1.25rem;
  border: 3px solid #e2e8f0;
  border-top-color: #ef4444;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

/* ── Footer note ── */
const FooterNote = styled.div`
  padding: 14px 18px;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.78rem;
  animation: ${fadeUp} 0.45s 0.25s ease both;
`

/* ═══════════════════════════════════════════
   Page
═══════════════════════════════════════════ */
const BinPage = () => {
  const [items, setItems]   = useState([])
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

  const handleEmptyTrash = async () => {
    const ok = await confirm({
      title: 'Empty Trash',
      message: 'Permanently delete all items in trash? This cannot be undone.',
    })
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
      <Spinner /> Loading trash…
    </LoadingContainer>
  )

  return (
    <PageContainer>
      {/* ── Header ── */}
      <Header>
        <TitleGroup>
          <Title>
            <TitleIcon><Trash2 /></TitleIcon>
            Trash
            {items.length > 0 && (
              <CountBadge>{items.length} item{items.length !== 1 ? 's' : ''}</CountBadge>
            )}
          </Title>
          <Subtitle>Items here are soft-deleted. Restore or permanently remove them.</Subtitle>
        </TitleGroup>

        {items.length > 0 && (
          <DangerButton onClick={handleEmptyTrash}>
            <Trash2 /> Empty Trash
          </DangerButton>
        )}
      </Header>

      {/* ── Warning bar ── */}
      <WarningBar>
        <AlertTriangle />
        Items in Trash are not counted toward your vault. Permanently deleted items cannot be recovered.
      </WarningBar>

      {/* ── Content card ── */}
      <BinCard>
        <BinCardHeader>
          <span>
            <Trash2 /> Deleted Items
          </span>
          <span>Restore or permanently delete items below</span>
        </BinCardHeader>

        {items.length === 0 ? (
          <EmptyState>
            <EmptyEmoji>🗑️</EmptyEmoji>
            <EmptyText>Trash is empty</EmptyText>
            <EmptyHint>Deleted vault items will appear here</EmptyHint>
          </EmptyState>
        ) : (
          <DeletedItemList items={items} onUpdate={fetchTrash} />
        )}
      </BinCard>

      {/* ── Footer note ── */}
      <FooterNote>
        💡 Restored items go back to your vault. Permanently deleted items and their files are removed and cannot be recovered.
      </FooterNote>

      <ConfirmModal />
    </PageContainer>
  )
}

export default BinPage