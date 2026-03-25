import { useState, useEffect, useRef } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { resumeService } from '../../services/resumeService'
import { useConfirm } from '../../hooks/useConfirm'
import {
  Upload, Trash2, ExternalLink, FileText, Image,
  File, RefreshCw, Copy, Check, Link, Plus,
} from 'lucide-react'
import toast from 'react-hot-toast'

/* ─── Build a full public URL from a token ─────────────────────
   Pulls the base from the env var, strips any trailing slash,
   then appends /public/<token> — so no matter how the env var
   is written you always get a clean URL.
──────────────────────────────────────────────────────────────── */
const BASE_URL = (import.meta.env.VITE_PUBLIC_API_URL || window.location.origin).replace(/\/$/, '')

const buildPublicUrl = (token) => `${BASE_URL}/${token}`

/* ─── Animations ─── */
const spin = keyframes`to { transform: rotate(360deg); }`
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ─── Page ─── */
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`

/* ─── Header ─── */
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
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  border-radius: 0.625rem;
  flex-shrink: 0;
  svg { width: 1.2rem; height: 1.2rem; }
`

const Subtitle = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0 3rem;
`

/* ─── Slot usage bar ─── */
const UsageBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  padding: 8px 14px;
  align-self: flex-start;
  animation: ${fadeUp} 0.45s 0.1s ease both;
`

const UsageSeg = styled.div`
  width: 28px;
  height: 6px;
  border-radius: 3px;
  transition: all 0.35s;
  ${({ $filled }) => $filled
    ? css`background: #06b6d4; box-shadow: 0 0 6px rgba(6,182,212,0.4);`
    : css`background: #e2e8f0;`
  }
`

const UsageLabel = styled.span`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-left: 4px;
  font-weight: 500;
`

/* ─── Grid ─── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
  animation: ${fadeUp} 0.45s 0.15s ease both;

  @media (max-width: 900px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

/* ─── Card ─── */
const Card = styled.div`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 220px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.25s, box-shadow 0.25s;

  &:hover {
    border-color: #bae6fd;
    box-shadow: 0 8px 28px rgba(6, 182, 212, 0.08);
  }

  &::before {
    content: '';
    position: absolute;
    top: -50px; right: -50px;
    width: 140px; height: 140px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%);
    pointer-events: none;
  }
`

/* ─── Add Slot Card ─── */
const AddSlotCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border: 2px dashed #cbd5e1;
  transition: all 0.3s ease;
  min-height: 280px;

  &:hover {
    border-color: #06b6d4;
    background: linear-gradient(135deg, #e3f2fd 0%, #f0f9ff 100%);
    transform: scale(1.02);
    box-shadow: 0 8px 28px rgba(6, 182, 212, 0.12);
  }
`

const AddSlotIcon = styled.div`
  font-size: 3rem;
  color: #06b6d4;
  margin-bottom: 0.75rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background: rgba(6, 182, 212, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;

  ${AddSlotCard}:hover & {
    background: rgba(6, 182, 212, 0.2);
    transform: scale(1.1);
  }

  svg { width: 2rem; height: 2rem; }
`

const AddSlotText = styled.div`
  color: #475569;
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
`

const AddSlotHint = styled.div`
  color: #94a3b8;
  font-weight: 400;
  font-size: 0.75rem;
  text-align: center;
  margin-top: 0.5rem;
`

/* ─── Slot badge ─── */
const SlotBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #94a3b8;
`

const SlotDot = styled.span`
  width: 6px; height: 6px;
  border-radius: 50%;
  transition: all 0.3s;
  ${({ $filled }) => $filled
    ? css`background: #06b6d4; box-shadow: 0 0 6px rgba(6,182,212,0.5);`
    : css`background: #e2e8f0;`
  }
`

const ActivePill = styled.span`
  font-size: 0.62rem;
  color: #0891b2;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 20px;
  padding: 1px 8px;
  margin-left: 2px;
`

/* ─── Empty slot ─── */
const EmptySlot = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 2rem 1rem;
  border: 1.5px dashed #cbd5e1;
  border-radius: 0.75rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: #06b6d4;
    background: #f0f9ff;
  }
`

const EmptyIcon = styled.div`
  width: 48px; height: 48px;
  border-radius: 0.875rem;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  color: #94a3b8;
  transition: all 0.2s;

  ${EmptySlot}:hover & {
    background: #e0f2fe;
    border-color: #bae6fd;
    color: #0891b2;
  }

  svg { width: 1.125rem; height: 1.125rem; }
`

const EmptyLabel = styled.p`
  color: #475569;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
`

const EmptyHint = styled.p`
  color: #94a3b8;
  font-size: 0.72rem;
  margin: 0;
`

/* ─── File info block ─── */
const FileInfoBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 0.625rem;
  padding: 12px;
`

const FileIconWrap = styled.div`
  width: 40px; height: 40px;
  border-radius: 0.625rem;
  flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;

  ${({ $type }) => $type === 'pdf' && css`
    background: #fef2f2; border: 1px solid #fecaca; color: #ef4444;
  `}
  ${({ $type }) => $type === 'img' && css`
    background: #ecfdf5; border: 1px solid #a7f3d0; color: #10b981;
  `}
  ${({ $type }) => $type === 'doc' && css`
    background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6;
  `}

  svg { width: 1rem; height: 1rem; }
`

const FileDetails = styled.div`
  flex: 1;
  min-width: 0;
`

const FileName = styled.p`
  color: #0f172a;
  font-size: 0.85rem;
  font-weight: 600;
  margin: 0 0 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FileMeta = styled.p`
  color: #94a3b8;
  font-size: 0.72rem;
  margin: 0;
`

const TypeTag = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 20px;
  margin-left: auto;
  flex-shrink: 0;

  ${({ $type }) => $type === 'pdf' && css`
    background: #fef2f2; border: 1px solid #fecaca; color: #ef4444;
  `}
  ${({ $type }) => $type === 'img' && css`
    background: #ecfdf5; border: 1px solid #a7f3d0; color: #10b981;
  `}
  ${({ $type }) => $type === 'doc' && css`
    background: #eff6ff; border: 1px solid #bfdbfe; color: #3b82f6;
  `}
`

/* ─── Link box ─── */
const LinkBox = styled.div`
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.625rem;
  padding: 10px 12px;
`

const LinkLabel = styled.div`
  font-size: 0.67rem;
  color: #0891b2;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 5px;
  svg { width: 10px; height: 10px; }
`

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LinkUrl = styled.span`
  flex: 1;
  font-size: 0.72rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CopyBtn = styled.button`
  flex-shrink: 0;
  width: 28px; height: 28px;
  border-radius: 6px;
  background: ${({ $copied }) => $copied ? '#dcfce7' : '#e0f2fe'};
  border: 1px solid ${({ $copied }) => $copied ? '#86efac' : '#bae6fd'};
  color: ${({ $copied }) => $copied ? '#16a34a' : '#0891b2'};
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
  svg { width: 12px; height: 12px; }

  &:hover { background: ${({ $copied }) => $copied ? '#bbf7d0' : '#bae6fd'}; }
`

/* ─── Action buttons ─── */
const ActionRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Btn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 0.625rem;
  font-size: 0.825rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s;
  width: 100%;
  border: 1px solid transparent;

  &:disabled { opacity: 0.45; cursor: not-allowed; }
  svg { width: 13px; height: 13px; }

  ${({ $variant }) => $variant === 'replace' && css`
    background: #eff6ff;
    border-color: #bfdbfe;
    color: #3b82f6;
    &:hover:not(:disabled) { background: #dbeafe; border-color: #93c5fd; transform: translateY(-1px); }
  `}
  ${({ $variant }) => $variant === 'delete' && css`
    background: #fef2f2;
    border-color: #fecaca;
    color: #ef4444;
    &:hover:not(:disabled) { background: #fee2e2; border-color: #fca5a5; transform: translateY(-1px); }
  `}
  ${({ $variant }) => $variant === 'open' && css`
    background: #f0f9ff;
    border-color: #bae6fd;
    color: #0891b2;
    &:hover:not(:disabled) { background: #e0f2fe; border-color: #7dd3fc; transform: translateY(-1px); }
  `}
`

/* ─── Uploading bar ─── */
const UploadingBar = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 0.625rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  font-size: 0.8rem;
  color: #0891b2;
`

const SpinIcon = styled(RefreshCw)`
  width: 13px !important;
  height: 13px !important;
  animation: ${spin} 0.8s linear infinite;
`

/* ─── Footer note ─── */
const FooterNote = styled.div`
  padding: 14px 18px;
  border-radius: 0.75rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #64748b;
  font-size: 0.78rem;
  animation: ${fadeUp} 0.45s 0.2s ease both;
`

const HiddenInput = styled.input`display: none;`

/* ─── Loading ─── */
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 3rem 1rem;
  color: #64748b;
  gap: 0.5rem;
  align-items: center;
`

const Spinner = styled.div`
  width: 1.25rem; height: 1.25rem;
  border: 3px solid #e2e8f0;
  border-top-color: #06b6d4;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`

/* ─── Helpers ─── */
const fileIconInfo = (file) => {
  if (!file) return { Icon: File, type: 'doc', tag: 'FILE' }
  const mime = (file.mimeType || '').toLowerCase()
  const name = (file.originalName || '').toLowerCase()
  if (mime.includes('pdf') || name.endsWith('.pdf'))
    return { Icon: FileText, type: 'pdf', tag: 'PDF' }
  if (mime.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/.test(name))
    return { Icon: Image, type: 'img', tag: 'IMAGE' }
  return { Icon: File, type: 'doc', tag: (name.split('.').pop() || 'FILE').toUpperCase() }
}

const formatSize = (bytes) => {
  if (!bytes) return ''
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

/* ═══════════════════════════════════════════
   SlotCard — isolated card per slot
═══════════════════════════════════════════ */
const SlotCard = ({ position, resume, onUpload, onDelete, uploading }) => {
  const [copied, setCopied] = useState(false)
  const inputEmptyRef   = useRef()
  const inputReplaceRef = useRef()

  const hasFile = !!resume?.file?.originalName
  const { Icon, type, tag } = fileIconInfo(resume?.file)

  // ── Single source of truth for the public URL ──
  const publicUrl = resume?.publicToken ? buildPublicUrl(resume.publicToken) : null

  const handleCopy = () => {
    if (!publicUrl) return
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    toast.success('Link copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Card>
      {/* Slot badge */}
      <SlotBadge>
        <SlotDot $filled={hasFile} />
        Slot {position}
        {hasFile && <ActivePill>Active</ActivePill>}
      </SlotBadge>

      {/* ── Uploading ── */}
      {uploading ? (
        <UploadingBar>
          <SpinIcon /> Uploading…
        </UploadingBar>

      /* ── Empty ── */
      ) : !hasFile ? (
        <>
          <EmptySlot onClick={() => inputEmptyRef.current?.click()}>
            <EmptyIcon><Upload /></EmptyIcon>
            <EmptyLabel>Upload File</EmptyLabel>
            <EmptyHint>PDF, image, doc, ZIP and more</EmptyHint>
          </EmptySlot>
          <HiddenInput
            ref={inputEmptyRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg,.xls,.xlsx,.ppt,.pptx,.zip"
            onChange={e => { if (e.target.files[0]) onUpload(position, e.target.files[0]) }}
          />
        </>

      /* ── Filled ── */
      ) : (
        <>
          {/* File info */}
          <FileInfoBlock>
            <FileIconWrap $type={type}><Icon /></FileIconWrap>
            <FileDetails>
              <FileName>{resume.file.originalName}</FileName>
              <FileMeta>{formatSize(resume.file.size)}</FileMeta>
            </FileDetails>
            <TypeTag $type={type}>{tag}</TypeTag>
          </FileInfoBlock>

          {/* Public link — same URL used for both display and copy */}
          {publicUrl && (
            <LinkBox>
              <LinkLabel><Link /> Public Link</LinkLabel>
              <LinkRow>
                <LinkUrl>{publicUrl}</LinkUrl>
                <CopyBtn $copied={copied} onClick={handleCopy} title="Copy link">
                  {copied ? <Check /> : <Copy />}
                </CopyBtn>
              </LinkRow>
            </LinkBox>
          )}

          {/* Actions */}
          <ActionRow>
            {resume.file?.url && (
              <a href={resume.file.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <Btn $variant="open" as="div">
                  <ExternalLink /> Open File
                </Btn>
              </a>
            )}
            <Btn $variant="replace" onClick={() => inputReplaceRef.current?.click()}>
              <Upload /> Replace File
            </Btn>
            <HiddenInput
              ref={inputReplaceRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.webp,.svg,.xls,.xlsx,.ppt,.pptx,.zip"
              onChange={e => { if (e.target.files[0]) onUpload(position, e.target.files[0]) }}
            />
            <Btn $variant="delete" onClick={() => onDelete(position)}>
              <Trash2 /> Remove File
            </Btn>
          </ActionRow>
        </>
      )}
    </Card>
  )
}

/* ═══════════════════════════════════════════
   Page
═══════════════════════════════════════════ */
const PublicFilesPage = () => {
  const [resumes, setResumes]     = useState([])
  const [uploading, setUploading] = useState({})
  const [loading, setLoading]     = useState(true)
  const [addingSlot, setAddingSlot] = useState(false)
  const { confirm, ConfirmModal } = useConfirm()

  useEffect(() => { fetchResumes() }, [])

  const fetchResumes = async () => {
    try {
      const { data } = await resumeService.getPublicFiles()
      setResumes(data)
    } catch {
      toast.error('Failed to load files')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (position, file) => {
    setUploading(p => ({ ...p, [position]: true }))
    try {
      const formData = new FormData()
      formData.append('position', position)
      formData.append('resume', file)
      await resumeService.uploadResume(formData)
      toast.success('File uploaded!')
      fetchResumes()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed')
    } finally {
      setUploading(p => ({ ...p, [position]: false }))
    }
  }

  const handleDelete = async (position) => {
    const resume = resumes.find(r => r.position === position)
    if (!resume) return

    const ok = await confirm({
      title: 'Remove file',
      message: 'Remove this file? The slot will become empty again.',
    })
    if (!ok) return
    try {
      await resumeService.deleteResume(resume._id)
      toast.success('File removed')
      fetchResumes()
    } catch {
      toast.error('Delete failed')
    }
  }

  const handleAddSlot = async () => {
    setAddingSlot(true)
    try {
      await resumeService.addEmptySlot()
      toast.success('New slot added! Upload a file to use it.')
      fetchResumes()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add slot')
    } finally {
      setAddingSlot(false)
    }
  }

  const maxPosition  = Math.max(...resumes.map(r => r.position), 0)
  const filledCount  = resumes.filter(r => r.file?.originalName).length
  const slotNumbers  = [1, 2, 3, ...Array.from({ length: Math.max(maxPosition - 3, 0) }, (_, i) => i + 4)]

  if (loading) return (
    <LoadingContainer>
      <Spinner /> Loading…
    </LoadingContainer>
  )

  return (
    <PageContainer>
      {/* ── Header ── */}
      <Header>
        <TitleGroup>
          <Title>
            <TitleIcon><FileText /></TitleIcon>
            Public Files
          </Title>
          <Subtitle>Upload any file to get a shareable public link. Start with 3 default slots</Subtitle>
        </TitleGroup>

        <UsageBar>
          {slotNumbers.map(n => (
            <UsageSeg
              key={n}
              $filled={!!resumes.find(r => r.position === n)?.file?.originalName}
            />
          ))}
          <UsageLabel>{filledCount}/{Math.max(maxPosition, 3)} slots used</UsageLabel>
        </UsageBar>
      </Header>

      {/* ── Slot cards ── */}
      <Grid>
        {slotNumbers.map(position => (
          <SlotCard
            key={position}
            position={position}
            resume={resumes.find(r => r.position === position) || { position, file: null, publicToken: null }}
            onUpload={handleUpload}
            onDelete={handleDelete}
            uploading={!!uploading[position]}
          />
        ))}

        {maxPosition < 20 && (
          <AddSlotCard
            onClick={handleAddSlot}
            style={{ opacity: addingSlot ? 0.6 : 1, pointerEvents: addingSlot ? 'none' : 'auto' }}
          >
            <AddSlotIcon>{addingSlot ? <SpinIcon /> : <Plus />}</AddSlotIcon>
            <AddSlotText>{addingSlot ? 'Creating slot...' : 'Add New Slot'}</AddSlotText>
            <AddSlotHint>Click to add more space for files</AddSlotHint>
          </AddSlotCard>
        )}
      </Grid>

      {/* ── Footer note ── */}
      <FooterNote>
        💡 <strong>3 default slots included!</strong> Upload any file to get a shareable public link. Need more space? Click "<strong>Add New Slot</strong>" to expand. Each slot holds one file with its own link.
      </FooterNote>

      <ConfirmModal />
    </PageContainer>
  )
}

export default PublicFilesPage