import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes } from 'styled-components'
import { FileText, Link as LinkIcon, File, Lock, Download, Copy, Check, ZoomIn, ZoomOut, RotateCcw, X, ArrowLeft } from 'lucide-react'

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
const formatBytes = (b) => {
  if (!b) return ''
  if (b < 1024) return `${b} B`
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`
  return `${(b / 1048576).toFixed(1)} MB`
}
const isImage = (m) => m && m.startsWith('image/')
const isPdf   = (m) => m === 'application/pdf'
const isVideo = (m) => m && m.startsWith('video/')
const isAudio = (m) => m && m.startsWith('audio/')
const isText  = (m) => m && (m.startsWith('text/') || m === 'application/json')

/* ─────────────────────────────────────────────
   Animations
───────────────────────────────────────────── */
const fadeIn  = keyframes`from { opacity:0 } to { opacity:1 }`
const slideUp = keyframes`
  from { opacity:0; transform: scale(0.94) translateY(16px) }
  to   { opacity:1; transform: scale(1)    translateY(0) }
`

/* ─────────────────────────────────────────────
   Backdrop
───────────────────────────────────────────── */
const Backdrop = styled.div`
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(15,23,42,0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 24px; box-sizing: border-box;
  font-family: inherit;
  animation: ${fadeIn} 0.18s ease forwards;
`

/* ─────────────────────────────────────────────
   NOTE / LINK card
───────────────────────────────────────────── */
const NoteCard = styled.div`
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 22px;
  width: 100%; max-width: 520px;
  box-shadow: 0 28px 70px rgba(15,23,42,0.16), 0 0 0 1px rgba(59,130,246,0.06);
  overflow: hidden;
  animation: ${slideUp} 0.22s cubic-bezier(0.34,1.1,0.64,1) forwards;
`

/* ─────────────────────────────────────────────
   FILE card (full-height)
───────────────────────────────────────────── */
const FileCard = styled.div`
  background: white;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  width: 100%; max-width: 860px;
  height: calc(100dvh - 48px);
  display: flex; flex-direction: column;
  overflow: hidden;
  box-shadow: 0 40px 100px rgba(15,23,42,0.18), 0 0 0 1px rgba(99,102,241,0.06);
  animation: ${slideUp} 0.24s cubic-bezier(0.34,1.1,0.64,1) forwards;
`

/* ─── Shared header ─── */
const Header = styled.div`
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  background: #f8fafc;
  border-bottom: 1.5px solid #e2e8f0;
  flex-shrink: 0;
`

const TypeIconWrap = styled.div`
  width: 34px; height: 34px; border-radius: 10px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  background: ${({ $type }) =>
    $type === 'note' ? 'rgba(59,130,246,0.08)'  :
    $type === 'link' ? 'rgba(16,185,129,0.08)'  :
                       'rgba(99,102,241,0.08)'};
  color: ${({ $type }) =>
    $type === 'note' ? '#2563eb' :
    $type === 'link' ? '#059669' :
                       '#4f46e5'};
  svg { width: 15px; height: 15px; }
`

const HeaderInfo = styled.div`flex: 1; min-width: 0;`

const Title = styled.div`
  font-weight: 600; font-size: 0.97rem; color: #0f172a;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`
const Meta = styled.div`color: #94a3b8; font-size: 0.7rem; margin-top: 2px;`

const Chip = styled.span`
  font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase;
  padding: 3px 9px; border-radius: 20px; font-weight: 600; flex-shrink: 0;
  background: ${({ $type }) =>
    $type === 'note' ? 'rgba(59,130,246,0.08)'  :
    $type === 'link' ? 'rgba(16,185,129,0.08)'  :
                       'rgba(99,102,241,0.08)'};
  color: ${({ $type }) =>
    $type === 'note' ? '#2563eb' :
    $type === 'link' ? '#059669' :
                       '#4f46e5'};
`

const LockBadge = styled.span`
  display: inline-flex; align-items: center; gap: 4px;
  background: rgba(16,185,129,0.07); border: 1.5px solid rgba(16,185,129,0.2);
  color: #059669; border-radius: 20px; padding: 3px 9px;
  font-size: 0.66rem; font-weight: 600; flex-shrink: 0;
  svg { width: 9px; height: 9px; }
`

const IconBtn = styled.button`
  width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
  border: 1.5px solid #e2e8f0; background: white; color: #94a3b8; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s;
  svg { width: 13px; height: 13px; }
  &:hover { background: #f1f5f9; color: #0f172a; }
  &.danger:hover { background: #fee2e2; border-color: #fca5a5; color: #dc2626; }
`

const TextBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 8px; cursor: pointer;
  font-family: inherit; font-size: 0.78rem; font-weight: 500;
  transition: all 0.2s; border: 1.5px solid;
  text-decoration: none;

  &.ghost {
    background: white; border-color: #e2e8f0; color: #64748b;
    &:hover { background: #f1f5f9; color: #0f172a; }
  }
  &.indigo {
    background: rgba(99,102,241,0.07); border-color: rgba(99,102,241,0.25); color: #4f46e5;
    &:hover { background: rgba(99,102,241,0.12); transform: translateY(-1px); }
  }
  svg { width: 12px; height: 12px; }
`

/* ─── NOTE body ─── */
const NoteBody = styled.div`padding: 20px;`

const NoteContent = styled.div`
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px; padding: 16px;
  color: #334155; font-size: 0.875rem; line-height: 1.8;
  white-space: pre-wrap; word-break: break-word;
  max-height: 320px; overflow-y: auto;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
`

const NoteActions = styled.div`
  display: flex; justify-content: flex-end; margin-top: 14px;
`

const CopyBtn = styled.button`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 8px; cursor: pointer;
  font-family: inherit; font-size: 0.78rem; transition: all 0.18s;
  background: ${({ $copied }) => $copied ? 'rgba(16,185,129,0.07)' : 'white'};
  border: 1.5px solid ${({ $copied }) => $copied ? 'rgba(16,185,129,0.25)' : '#e2e8f0'};
  color: ${({ $copied }) => $copied ? '#059669' : '#64748b'};
  &:hover { background: #f1f5f9; color: #0f172a; }
  svg { width: 12px; height: 12px; }
`

/* ─── LINK body ─── */
const LinkCard = styled.div`
  margin: 16px 20px 20px;
  background: rgba(16,185,129,0.04);
  border: 1.5px solid rgba(16,185,129,0.18);
  border-radius: 12px; padding: 16px;
`

const LinkUrlRow = styled.div`
  display: flex; align-items: flex-start; gap: 9px;
  color: #059669; font-size: 0.85rem; word-break: break-all; line-height: 1.5;
  svg { flex-shrink: 0; margin-top: 2px; width: 14px; height: 14px; }
`

const LinkDesc = styled.div`
  color: #64748b; font-size: 0.8rem; margin-top: 10px; line-height: 1.5;
  border-top: 1.5px solid rgba(16,185,129,0.12); padding-top: 10px;
`

const LinkActions = styled.div`
  display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap;
`

const LinkBtn = styled.a`
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px; border-radius: 9px; text-decoration: none; cursor: pointer;
  font-family: inherit; font-size: 0.82rem; font-weight: 500;
  transition: all 0.2s; border: 1.5px solid;

  &.green {
    background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.28); color: #059669;
    &:hover { background: rgba(16,185,129,0.14); transform: translateY(-1px); }
  }
  &.ghost {
    background: white; border-color: #e2e8f0; color: #64748b;
    &:hover { background: #f1f5f9; color: #0f172a; }
  }
  svg { width: 12px; height: 12px; }
`

/* ─── FILE viewer ─── */
const FileViewerBody = styled.div`
  flex: 1; overflow: hidden; position: relative;
  display: flex; flex-direction: column;
  background: #f8fafc;
`

const ImgWrap = styled.div`
  flex: 1; overflow: auto; display: flex; align-items: center; justify-content: center;
  padding: 20px;
  img { max-width: 100%; max-height: 100%; object-fit: contain; transition: transform 0.2s; }
`

const ZoomBar = styled.div`
  display: flex; align-items: center; gap: 8px;
  padding: 10px 16px; background: white; border-top: 1.5px solid #e2e8f0; flex-shrink: 0;
`

const ZoomBtn = styled.button`
  width: 28px; height: 28px; border-radius: 7px;
  border: 1.5px solid #e2e8f0; background: white; color: #64748b; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s;
  svg { width: 11px; height: 11px; }
  &:hover { background: #f1f5f9; color: #0f172a; }
`

const ZoomLabel = styled.span`
  font-size: 0.78rem; font-weight: 600; color: #475569; min-width: 44px; text-align: center;
`

const PdfFrame = styled.iframe`
  flex: 1; width: 100%; border: none; background: white;
`

const StyledVideo = styled.video`
  max-width: 100%; max-height: 100%; margin: auto; display: block; padding: 20px;
`

const AudioWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex: 1; gap: 16px; padding: 32px;
`
const AudioIcon = styled.div`font-size: 3rem;`
const AudioName = styled.div`color: #0f172a; font-size: 0.9rem; font-weight: 500;`
const StyledAudio = styled.audio`width: 100%; max-width: 400px;`

const TextBody = styled.pre`
  flex: 1; padding: 20px; margin: 0; overflow: auto;
  font-size: 0.82rem; font-family: 'JetBrains Mono', monospace;
  color: #334155; line-height: 1.7; background: #f8fafc;
  white-space: pre-wrap; word-break: break-word;
`

const NoPreview = styled.div`
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  flex: 1; gap: 12px; padding: 40px;
`
const NoPreviewIcon  = styled.div`font-size: 3rem;`
const NoPreviewTitle = styled.div`color: #0f172a; font-size: 1rem; font-weight: 600;`
const NoPreviewSub   = styled.div`color: #94a3b8; font-size: 0.82rem;`

/* ─── Lock body scroll ─── */
const useLockBodyScroll = () => {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])
}

/* ─────────────────────────────────────────────
   NOTE / LINK Overlay
───────────────────────────────────────────── */
const NoteOrLinkOverlay = ({ item, onClose }) => {
  const [copied, setCopied] = useState(false)
  useLockBodyScroll()

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const copyContent = () => {
    navigator.clipboard.writeText(item.content || '').then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const date = item.createdAt
    ? new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  return createPortal(
    <Backdrop onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <NoteCard>
        {/* Header */}
        <Header>
          <TypeIconWrap $type={item.type}>
            {item.type === 'note' ? <FileText /> : <LinkIcon />}
          </TypeIconWrap>
          <HeaderInfo>
            <Title>{item.title || 'Untitled'}</Title>
            <Meta>{date}</Meta>
          </HeaderInfo>
          <Chip $type={item.type}>{item.type}</Chip>
          {item.hasPassword && (
            <LockBadge><Lock /> Unlocked</LockBadge>
          )}
          <IconBtn className="danger" onClick={onClose}><X /></IconBtn>
        </Header>

        {/* Body */}
        {item.type === 'note' && (
          <NoteBody>
            <NoteContent>{item.content}</NoteContent>
            <NoteActions>
              <CopyBtn $copied={copied} onClick={copyContent}>
                {copied ? <><Check /> Copied</> : <><Copy /> Copy</>}
              </CopyBtn>
            </NoteActions>
          </NoteBody>
        )}

        {item.type === 'link' && (
          <LinkCard>
            <LinkUrlRow>
              <LinkIcon />
              {item.content}
            </LinkUrlRow>
            {item.metadata?.description && (
              <LinkDesc>{item.metadata.description}</LinkDesc>
            )}
            <LinkActions>
              <LinkBtn className="green" href={item.content} target="_blank" rel="noopener noreferrer">
                <LinkIcon /> Open Link
              </LinkBtn>
              <LinkBtn
                as="button"
                className="ghost"
                onClick={copyContent}
              >
                {copied ? <><Check /> Copied</> : <><Copy /> Copy URL</>}
              </LinkBtn>
            </LinkActions>
          </LinkCard>
        )}
      </NoteCard>
    </Backdrop>,
    document.body
  )
}

/* ─────────────────────────────────────────────
   FILE Viewer
───────────────────────────────────────────── */
const FileViewer = ({ item, onClose }) => {
  const [zoom, setZoom] = useState(1)
  const [textContent, setTextContent] = useState(null)
  useLockBodyScroll()

  const url      = item.metadata?.signedUrl || item.content || ''
  const mime     = item.metadata?.mimeType || ''
  const filename = item.metadata?.originalName || item.title || 'File'
  const size     = formatBytes(item.metadata?.size)

  useEffect(() => {
    if (isText(mime) && url) {
      fetch(url)
        .then(r => r.text())
        .then(setTextContent)
        .catch(() => setTextContent('Could not load file content.'))
    }
  }, [url, mime])

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const fileTypeIcon =
    isImage(mime) ? '🖼️' :
    isPdf(mime)   ? '📄' :
    isVideo(mime) ? '🎬' :
    isAudio(mime) ? '🎵' :
    isText(mime)  ? '📃' :
    mime.includes('zip') || mime.includes('rar') ? '🗜️' : '📁'

  return createPortal(
    <Backdrop onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <FileCard>
        {/* Header */}
        <Header>
          <TextBtn as="button" className="ghost" onClick={onClose}>
            <ArrowLeft /> Back
          </TextBtn>

          <TypeIconWrap $type="file">{fileTypeIcon}</TypeIconWrap>

          <HeaderInfo>
            <Title>{filename}</Title>
            <Meta>{size}{size && mime ? ' · ' : ''}{mime}</Meta>
          </HeaderInfo>

          {item.hasPassword && (
            <LockBadge><Lock /> Unlocked</LockBadge>
          )}

          {url && (
            <TextBtn as="a" className="indigo" href={url} download={filename} target="_blank" rel="noopener noreferrer">
              <Download /> Download
            </TextBtn>
          )}

          <IconBtn className="danger" onClick={onClose}><X /></IconBtn>
        </Header>

        {/* Content */}
        <FileViewerBody>
          {isImage(mime) && url && (
            <>
              <ImgWrap>
                <img src={url} alt={filename} style={{ transform: `scale(${zoom})` }} />
              </ImgWrap>
              <ZoomBar>
                <ZoomBtn onClick={() => setZoom(z => Math.max(0.2, +(z - 0.25).toFixed(2)))}>
                  <ZoomOut />
                </ZoomBtn>
                <ZoomLabel>{Math.round(zoom * 100)}%</ZoomLabel>
                <ZoomBtn onClick={() => setZoom(z => Math.min(5, +(z + 0.25).toFixed(2)))}>
                  <ZoomIn />
                </ZoomBtn>
                <ZoomBtn onClick={() => setZoom(1)}><RotateCcw /></ZoomBtn>
              </ZoomBar>
            </>
          )}

          {isPdf(mime) && url && (
            <PdfFrame src={`${url}#toolbar=1&navpanes=0`} title={filename} />
          )}

          {isVideo(mime) && url && (
            <StyledVideo controls src={url}>
              Your browser does not support video playback.
            </StyledVideo>
          )}

          {isAudio(mime) && url && (
            <AudioWrap>
              <AudioIcon>🎵</AudioIcon>
              <AudioName>{filename}</AudioName>
              <StyledAudio controls src={url} />
            </AudioWrap>
          )}

          {isText(mime) && (
            <TextBody>
              {textContent === null ? 'Loading…' : textContent}
            </TextBody>
          )}

          {!isImage(mime) && !isPdf(mime) && !isVideo(mime) && !isAudio(mime) && !isText(mime) && (
            <NoPreview>
              <NoPreviewIcon>{fileTypeIcon}</NoPreviewIcon>
              <NoPreviewTitle>Preview not available</NoPreviewTitle>
              <NoPreviewSub>{mime || 'Unknown file type'}</NoPreviewSub>
              {url && (
                <TextBtn
                  as="a"
                  className="indigo"
                  href={url}
                  download={filename}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download /> Download to view
                </TextBtn>
              )}
            </NoPreview>
          )}
        </FileViewerBody>
      </FileCard>
    </Backdrop>,
    document.body
  )
}

/* ─────────────────────────────────────────────
   Main export
───────────────────────────────────────────── */
const ItemDetailModal = ({ item, onClose }) => {
  if (!item) return null
  if (item.type === 'file') return <FileViewer item={item} onClose={onClose} />
  return <NoteOrLinkOverlay item={item} onClose={onClose} />
}

export default ItemDetailModal