import { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Heart, Check, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

/* ─── Animations ─── */
const pop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.3); }
  100% { transform: scale(1); }
`

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
`

/* ─── Card wrapper — rectangle layout ─── */
const CardWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 0.875rem;
  overflow: hidden;
  border: 2px solid ${({ $default: d }) => d ? '#3b82f6' : '#e2e8f0'};
  background: #ffffff;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s, transform 0.18s;
  animation: ${fadeIn} 0.35s ease forwards;

  &:hover {
    border-color: ${({ $default: d }) => d ? '#3b82f6' : '#cbd5e1'};
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  ${({ $default: d }) => d && css`
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15), 0 4px 20px rgba(59, 130, 246, 0.1);
  `}
`

/* ─── Top: image preview area ─── */
const PreviewArea = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  background: #f1f5f9;
  flex-shrink: 0;
`

const PreviewImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
  ${CardWrap}:hover & { transform: scale(1.03); }
`

const PreviewPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #94a3b8;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.04em;

  svg {
    width: 32px;
    height: 32px;
    opacity: 0.4;
  }
`

const DefaultTag = styled.span`
  position: absolute;
  top: 0.6rem;
  left: 0.6rem;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  background: #3b82f6;
  color: white;
  padding: 2px 8px;
  border-radius: 20px;
  pointer-events: none;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
  z-index: 10;
`

/* ─── Bottom: info + actions bar ─── */
const InfoBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  padding: 0.65rem 0.875rem;
  background: #ffffff;
  border-top: 1px solid #f1f5f9;
`

const TemplateName = styled.p`
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  letter-spacing: 0.01em;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-shrink: 0;
`

const DefaultBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 0.4rem;
  border: 2px solid ${({ $active }) => $active ? '#3b82f6' : '#cbd5e1'};
  background: ${({ $active }) => $active ? '#3b82f6' : 'transparent'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s;
  position: relative;

  &:hover {
    border-color: #3b82f6;
    background: ${({ $active }) => $active ? '#2563eb' : 'rgba(59,130,246,0.08)'};
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 13px;
    height: 13px;
    color: ${({ $active }) => $active ? 'white' : '#94a3b8'};
    transition: color 0.15s;
  }
`

const LikeBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: ${({ $liked }) => $liked ? 'rgba(239,68,68,0.1)' : '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s;
  position: relative;

  &:hover {
    background: ${({ $liked }) => $liked ? 'rgba(239,68,68,0.2)' : '#e2e8f0'};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  svg {
    width: 13px;
    height: 13px;
    color: ${({ $liked }) => $liked ? '#ef4444' : '#94a3b8'};
    fill: ${({ $liked }) => $liked ? '#ef4444' : 'none'};
    transition: color 0.15s, fill 0.15s;
    ${({ $liked }) => $liked && css`animation: ${pop} 0.3s ease;`}
  }
`

const LikeCount = styled.span`
  font-size: 0.7rem;
  color: #94a3b8;
  margin-left: 0.2rem;
  font-weight: 600;
`

/**
 * TemplateCard — rectangular layout
 * Props:
 *   template         — { _id, name, image, usercount, likescount }
 *   isDefault        — boolean
 *   onSetDefault     — (id) => void
 *   onLike           — (id) => void
 *   onUnlike         — (id) => void
 */
const TemplateCard = ({ 
  template, 
  isDefault = false, 
  onSetDefault, 
  onLike,
  onUnlike,
  isLiked = false,
  loading = false 
}) => {
  const [liking, setLiking] = useState(false)
  const [defaulting, setDefaulting] = useState(false)

  const handleLike = async (e) => {
    e.stopPropagation()
    setLiking(true)
    try {
      if (isLiked) {
        await onUnlike?.(template._id)
      } else {
        await onLike?.(template._id)
      }
    } finally {
      setLiking(false)
    }
  }

  const handleDefault = async (e) => {
    e.stopPropagation()
    setDefaulting(true)
    try {
      await onSetDefault?.(template._id)
    } finally {
      setDefaulting(false)
    }
  }

  return (
    <CardWrap $default={isDefault} title={template.name}>

      {/* ── Top: image area ── */}
      <PreviewArea>
        {template.image
          ? (
            <PreviewImg 
              src={template.image} 
              alt={template.name}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
          )
          : (
            <PreviewPlaceholder>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
              {template.name}
            </PreviewPlaceholder>
          )
        }

        {isDefault && <DefaultTag>Default</DefaultTag>}
      </PreviewArea>

      {/* ── Bottom: info bar ── */}
      <InfoBar>
        <TemplateName>{template.name}</TemplateName>
        <Actions>
          <DefaultBtn
            $active={isDefault}
            onClick={handleDefault}
            disabled={defaulting || loading}
            title={isDefault ? 'Currently default' : 'Set as default'}
          >
            {defaulting ? <Loader size={13} /> : <Check />}
          </DefaultBtn>
          <LikeBtn 
            $liked={isLiked} 
            onClick={handleLike}
            disabled={liking || loading}
            title={isLiked ? 'Unlike' : 'Like'}
          >
            {liking ? <Loader size={13} /> : <Heart />}
          </LikeBtn>
          <LikeCount>{template.likescount}</LikeCount>
        </Actions>
      </InfoBar>

    </CardWrap>
  )
}

export default TemplateCard