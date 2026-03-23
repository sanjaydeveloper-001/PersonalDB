import { useState } from 'react'
import styled from 'styled-components'
import { FileText, Link as LinkIcon, File, MoreVertical, Edit, Trash2, Lock } from 'lucide-react'
import { itemService } from '../../services/itemService'
import { useConfirm } from '../../hooks/useConfirm'
import toast from 'react-hot-toast'
import PasswordPrompt from './PasswordPrompt'
import EditItemModal from './EditItemModal'
import ItemDetailModal from './ItemDetailModal'

/* ─────────────────────────────────────────────
   Card shell
───────────────────────────────────────────── */
const Card = styled.div`
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px;
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;

  /* Left accent bar */
  &::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 3px;
    border-radius: 3px 0 0 3px;
    background: ${({ $type }) =>
      $type === 'note' ? '#3b82f6' :
      $type === 'link' ? '#10b981' :
                         '#6366f1'};
  }

  &:hover {
    transform: translateY(-2px);
    border-color: ${({ $type }) =>
      $type === 'note' ? 'rgba(59,130,246,0.4)'  :
      $type === 'link' ? 'rgba(16,185,129,0.35)' :
                         'rgba(99,102,241,0.4)'};
    box-shadow: ${({ $type }) =>
      $type === 'note' ? '0 8px 28px rgba(59,130,246,0.1)'  :
      $type === 'link' ? '0 8px 28px rgba(16,185,129,0.08)' :
                         '0 8px 28px rgba(99,102,241,0.1)'};
  }
`

/* ─── Top row ─── */
const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`

const TypeIconWrap = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ $type }) =>
    $type === 'note' ? 'rgba(59,130,246,0.08)'  :
    $type === 'link' ? 'rgba(16,185,129,0.08)'  :
                       'rgba(99,102,241,0.08)'};
  color: ${({ $type }) =>
    $type === 'note' ? '#2563eb' :
    $type === 'link' ? '#059669' :
                       '#4f46e5'};
  svg { width: 16px; height: 16px; }
`

const CardInfo = styled.div`flex: 1; min-width: 0;`

const CardTitle = styled.h3`
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 3px;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CardDate = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  font-weight: 500;
`

/* ─── Action buttons (edit/delete) ─── */
const ActionsWrap = styled.div`
  display: flex;
  gap: 5px;
  flex-shrink: 0;
`

const ActionBtn = styled.button`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 1.5px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: all 0.18s;
  svg { width: 13px; height: 13px; }

  &.edit:hover  { background: rgba(59,130,246,0.07); border-color: rgba(59,130,246,0.3); color: #2563eb; }
  &.del:hover   { background: rgba(239,68,68,0.07);  border-color: rgba(239,68,68,0.3);  color: #dc2626; }
`

/* ─── Preview snippet ─── */
const PreviewText = styled.div`
  font-size: 0.78rem;
  color: #64748b;
  margin-top: 10px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  border-top: 1px solid #f1f5f9;
  padding-top: 10px;
  word-break: break-word;
`

const LinkPreviewText = styled(PreviewText)`
  color: #059669;
`

/* ─── Chips row ─── */
const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
`

const TypeChip = styled.span`
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 2px 9px;
  border-radius: 20px;
  font-weight: 600;
  background: ${({ $type }) =>
    $type === 'note' ? 'rgba(59,130,246,0.08)'  :
    $type === 'link' ? 'rgba(16,185,129,0.08)'  :
                       'rgba(99,102,241,0.08)'};
  color: ${({ $type }) =>
    $type === 'note' ? '#2563eb' :
    $type === 'link' ? '#059669' :
                       '#4f46e5'};
`

const LockChip = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(248,250,252,1);
  border: 1.5px solid #e2e8f0;
  color: #64748b;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 0.68rem;
  font-weight: 500;
  svg { width: 9px; height: 9px; }
`

/* ─── Confirm overlay ─── */
const ConfirmOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255,255,255,0.97);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  z-index: 10;
`

const ConfirmTitle = styled.div`
  color: #dc2626;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
`

const ConfirmSub = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
  text-align: center;
`

const ConfirmBtns = styled.div`display: flex; gap: 8px;`

const ConfirmCancel = styled.button`
  padding: 7px 16px; border-radius: 8px;
  border: 1.5px solid #e2e8f0; background: white; color: #64748b;
  font-family: inherit; font-size: 0.8rem; cursor: pointer; transition: all 0.18s;
  &:hover { background: #f1f5f9; }
`

const ConfirmDelete = styled.button`
  padding: 7px 16px; border-radius: 8px;
  background: rgba(239,68,68,0.08); color: #dc2626;
  font-family: inherit; font-size: 0.8rem; cursor: pointer; transition: all 0.18s;
  border: 1.5px solid rgba(239,68,68,0.25);
  &:hover { background: rgba(239,68,68,0.14); }
`

/* ─── View hint ─── */
const ViewHint = styled.div`
  position: absolute; bottom: 0; left: 0; right: 0;
  background: linear-gradient(to top, rgba(241,245,249,0.9), transparent);
  text-align: center; padding: 16px 12px 10px;
  font-size: 0.72rem; color: #94a3b8;
  opacity: 0; transition: opacity 0.2s; pointer-events: none;
  border-radius: 0 0 14px 14px;
  ${Card}:hover & { opacity: 1; }
`

/* ─── Type icons ─── */
const TYPE_ICON = {
  note: <FileText />,
  link: <LinkIcon />,
  file: <File />,
}

/* ─────────────────────────────────────────────
   pendingAction: what to do after password success
     "view"   → open ItemDetailModal
     "edit"   → open EditItemModal
     "delete" → show confirm overlay
───────────────────────────────────────────── */
const ItemCard = ({ item, onDelete, onUpdate }) => {
  const [pendingAction,   setPendingAction]   = useState(null)
  const [showPassPrompt,  setShowPassPrompt]  = useState(false)
  const [showDetail,      setShowDetail]      = useState(false)
  const [showEdit,        setShowEdit]        = useState(false)
  const [showConfirm,     setShowConfirm]     = useState(false)
  const [unlockedItem,    setUnlockedItem]    = useState(null)

  /* ── Require password gate ── */
  const requirePassword = (action) => {
    setPendingAction(action)
    setShowPassPrompt(true)
  }

  /* ── Card body click → view ── */
  const handleCardClick = () => {
    if (item.hasPassword) requirePassword('view')
    else { setUnlockedItem(item); setShowDetail(true) }
  }

  /* ── Edit button ── */
  const handleEditClick = (e) => {
    e.stopPropagation()
    if (item.hasPassword) requirePassword('edit')
    else { setUnlockedItem(item); setShowEdit(true) }
  }

  /* ── Delete button ── */
  const handleDeleteClick = (e) => {
    e.stopPropagation()
    if (item.hasPassword) requirePassword('delete')
    else setShowConfirm(true)
  }

  /* ── Password verified → dispatch to correct action ── */
  const handlePasswordSuccess = (data) => {
    const unlocked = { ...item, ...data }
    setUnlockedItem(unlocked)
    setShowPassPrompt(false)

    if (pendingAction === 'view')   setShowDetail(true)
    if (pendingAction === 'edit')   setShowEdit(true)
    if (pendingAction === 'delete') setShowConfirm(true)

    setPendingAction(null)
  }

  const confirmDelete = async () => {
    try {
      await itemService.deleteItem(item._id)
      toast.success('Moved to trash')
      onDelete?.(item._id)
    } catch {
      toast.error('Failed to delete')
    }
  }

  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : ''

  return (
    <>
      <Card $type={item.type} onClick={handleCardClick}>

        {/* Confirm overlay */}
        {showConfirm && (
          <ConfirmOverlay onClick={(e) => e.stopPropagation()}>
            <Trash2 style={{ width: 22, height: 22, color: '#dc2626' }} />
            <div>
              <ConfirmTitle>Move to Trash?</ConfirmTitle>
              <ConfirmSub>You can restore it from the Bin later.</ConfirmSub>
            </div>
            <ConfirmBtns>
              <ConfirmCancel onClick={() => setShowConfirm(false)}>Cancel</ConfirmCancel>
              <ConfirmDelete onClick={confirmDelete}>Move to Trash</ConfirmDelete>
            </ConfirmBtns>
          </ConfirmOverlay>
        )}

        {/* Top row */}
        <TopRow>
          <TypeIconWrap $type={item.type}>
            {TYPE_ICON[item.type] || <File />}
          </TypeIconWrap>
          <CardInfo>
            <CardTitle>{item.title || 'Untitled'}</CardTitle>
            <CardDate>{date}</CardDate>
          </CardInfo>
          <ActionsWrap onClick={(e) => e.stopPropagation()}>
            <ActionBtn className="edit" title="Edit" onClick={handleEditClick}>
              <Edit />
            </ActionBtn>
            <ActionBtn className="del" title="Delete" onClick={handleDeleteClick}>
              <Trash2 />
            </ActionBtn>
          </ActionsWrap>
        </TopRow>

        {/* Preview snippet */}
        {item.type === 'note' && item.content && !item.hasPassword && (
          <PreviewText>{item.content}</PreviewText>
        )}
        {item.type === 'link' && item.content && !item.hasPassword && (
          <LinkPreviewText>{item.content}</LinkPreviewText>
        )}
        {item.type === 'file' && item.metadata?.originalName && !item.hasPassword && (
          <PreviewText style={{ color: '#4f46e5' }}>
            📎 {item.metadata.originalName}
            {item.metadata.size
              ? ` · ${item.metadata.size < 1048576
                  ? `${(item.metadata.size / 1024).toFixed(1)} KB`
                  : `${(item.metadata.size / 1048576).toFixed(1)} MB`}`
              : ''}
          </PreviewText>
        )}
        {item.hasPassword && (
          <PreviewText style={{ color: '#94a3b8', fontStyle: 'italic' }}>
            🔒 Password protected — click to unlock
          </PreviewText>
        )}

        {/* Chips */}
        <ChipsRow>
          <TypeChip $type={item.type}>{item.type}</TypeChip>
          {item.hasPassword && (
            <LockChip>
              <Lock /> Locked
            </LockChip>
          )}
        </ChipsRow>

        <ViewHint>Click to view</ViewHint>
      </Card>

      {/* Password prompt — action-aware */}
      {showPassPrompt && (
        <PasswordPrompt
          itemId={item._id}
          action={pendingAction}
          onSuccess={handlePasswordSuccess}
          onClose={() => { setShowPassPrompt(false); setPendingAction(null) }}
        />
      )}

      {showDetail && (
        <ItemDetailModal
          item={unlockedItem}
          onClose={() => { setShowDetail(false); setUnlockedItem(null) }}
        />
      )}

      {showEdit && (
        <EditItemModal
          item={unlockedItem || item}
          onClose={() => { setShowEdit(false); setUnlockedItem(null) }}
          onUpdated={(updated) => { onUpdate?.(updated); setShowEdit(false); setUnlockedItem(null) }}
        />
      )}
    </>
  )
}

export default ItemCard