import { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { itemService } from '../../services/itemService'
import { RotateCcw, Trash2, FileText, Link, FolderOpen, Lock } from 'lucide-react'
import toast from 'react-hot-toast'

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.97); }
  to   { opacity: 1; transform: scale(1); }
`

/* ── Card ── */
const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: #fca5a5;
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.07);
  }
`

/* ── Deleted ribbon ── */
const Ribbon = styled.div`
  position: absolute;
  top: 12px; right: -22px;
  background: #fef2f2;
  color: #ef4444;
  font-size: 0.58rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 3px 28px;
  transform: rotate(35deg);
  border-top: 1px solid #fecaca;
  border-bottom: 1px solid #fecaca;
`

/* ── Top row ── */
const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const TypeIcon = styled.div`
  width: 38px; height: 38px;
  border-radius: 0.625rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  svg { width: 1rem; height: 1rem; }

  ${({ $type }) => $type === 'note' && css`
    background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6;
  `}
  ${({ $type }) => $type === 'link' && css`
    background: #ecfdf5; border: 1px solid #a7f3d0; color: #10b981;
  `}
  ${({ $type }) => $type === 'file' && css`
    background: #fdf4ff; border: 1px solid #e9d5ff; color: #a855f7;
  `}
`

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
`

const ItemTitle = styled.p`
  font-weight: 600;
  color: #94a3b8;
  font-size: 0.925rem;
  margin: 0 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: line-through;
  text-decoration-color: #cbd5e1;
`

const Badges = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  flex-wrap: wrap;
`

const TypeChip = styled.span`
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 20px;

  ${({ $type }) => $type === 'note' && css`background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe;`}
  ${({ $type }) => $type === 'link' && css`background: #ecfdf5; color: #10b981; border: 1px solid #a7f3d0;`}
  ${({ $type }) => $type === 'file' && css`background: #fdf4ff; color: #a855f7; border: 1px solid #e9d5ff;`}
`

const LockedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  border-radius: 20px;
  padding: 2px 7px;
  font-size: 0.6rem;
  font-weight: 600;
  svg { width: 8px; height: 8px; }
`

/* ── Preview ── */
const Preview = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 10px 12px;
  color: #94a3b8;
  font-size: 0.78rem;
  line-height: 1.6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
`

/* ── Meta ── */
const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #94a3b8;
  font-size: 0.7rem;
  svg { width: 11px; height: 11px; }
`

const Divider = styled.div`
  height: 1px;
  background: #f1f5f9;
`

/* ── Actions ── */
const ActionsRow = styled.div`
  display: flex;
  gap: 8px;
`

const Btn = styled.button`
  flex: 1;
  padding: 8px 10px;
  border-radius: 0.5rem;
  font-size: 0.775rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid transparent;
  svg { width: 12px; height: 12px; }

  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none !important; }

  ${({ $variant }) => $variant === 'restore' && css`
    background: #f0fdf4; border-color: #bbf7d0; color: #16a34a;
    &:hover:not(:disabled) { background: #dcfce7; border-color: #86efac; transform: translateY(-1px); }
  `}
  ${({ $variant }) => $variant === 'delete' && css`
    background: #fef2f2; border-color: #fecaca; color: #ef4444;
    &:hover:not(:disabled) { background: #fee2e2; border-color: #fca5a5; transform: translateY(-1px); }
  `}
  ${({ $variant }) => $variant === 'cancel' && css`
    background: #f8fafc; border-color: #e2e8f0; color: #64748b;
    &:hover:not(:disabled) { background: #f1f5f9; border-color: #cbd5e1; }
  `}
`

/* ── Confirm overlay ── */
const ConfirmBox = styled.div`
  background: #fff5f5;
  border: 1px solid #fecaca;
  border-radius: 0.625rem;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: ${fadeIn} 0.15s ease;
`

const ConfirmText = styled.p`
  color: #64748b;
  font-size: 0.78rem;
  line-height: 1.5;
  text-align: center;
  margin: 0;
  strong { color: #ef4444; }
`

/* ── Type icon map ── */
const typeIconMap = {
  note: <FileText />,
  link: <Link />,
  file: <FolderOpen />,
}

const DeletedItemCard = ({ item, onUpdate }) => {
  const [restoring,  setRestoring]  = useState(false)
  const [deleting,   setDeleting]   = useState(false)
  const [confirming, setConfirming] = useState(false)

  const deletedDate = item.deletedAt || item.updatedAt
    ? new Date(item.deletedAt || item.updatedAt).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    : 'Unknown date'

  const preview = item.type === 'note' ? item.content
    : item.type === 'link' ? item.content
    : item.metadata?.originalName || null

  const handleRestore = async () => {
    setRestoring(true)
    try {
      await itemService.restoreItem(item._id)
      toast.success('Item restored')
      onUpdate()
    } catch {
      toast.error('Restore failed')
    } finally {
      setRestoring(false)
    }
  }

  const handlePermanentDelete = async () => {
    setDeleting(true)
    try {
      await itemService.permanentDelete(item._id)
      toast.success('Permanently deleted')
      onUpdate()
    } catch {
      toast.error('Deletion failed')
    } finally {
      setDeleting(false)
      setConfirming(false)
    }
  }

  return (
    <Card>
      <Ribbon>Deleted</Ribbon>

      {/* Top row */}
      <TopRow>
        <TypeIcon $type={item.type}>
          {typeIconMap[item.type] || <FolderOpen />}
        </TypeIcon>
        <ItemInfo>
          <ItemTitle>{item.title || 'Untitled'}</ItemTitle>
          <Badges>
            <TypeChip $type={item.type}>{item.type}</TypeChip>
            {item.hasPassword && (
              <LockedBadge><Lock /> Locked</LockedBadge>
            )}
          </Badges>
        </ItemInfo>
      </TopRow>

      {/* Preview */}
      {preview && <Preview>{preview}</Preview>}

      {/* Meta */}
      <Meta>
        <Trash2 />
        Deleted {deletedDate}
      </Meta>

      <Divider />

      {/* Actions */}
      {confirming ? (
        <ConfirmBox>
          <ConfirmText>
            <strong>Permanently delete?</strong><br />This cannot be undone.
          </ConfirmText>
          <ActionsRow>
            <Btn $variant="cancel" onClick={() => setConfirming(false)} disabled={deleting}>
              Cancel
            </Btn>
            <Btn $variant="delete" onClick={handlePermanentDelete} disabled={deleting}>
              <Trash2 /> {deleting ? 'Deleting…' : 'Yes, delete'}
            </Btn>
          </ActionsRow>
        </ConfirmBox>
      ) : (
        <ActionsRow>
          <Btn $variant="restore" onClick={handleRestore} disabled={restoring || deleting}>
            <RotateCcw /> {restoring ? 'Restoring…' : 'Restore'}
          </Btn>
          <Btn $variant="delete" onClick={() => setConfirming(true)} disabled={restoring || deleting}>
            <Trash2 /> Delete Forever
          </Btn>
        </ActionsRow>
      )}
    </Card>
  )
}

export default DeletedItemCard