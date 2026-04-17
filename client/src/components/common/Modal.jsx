// src/components/common/Modal.jsx
import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'

const sizes = { sm: '448px', md: '512px', lg: '672px', xl: '896px' }

const Overlay = styled(motion.div)`
  position: fixed;        /* ← was 'absolute' — must be fixed to cover full viewport */
  inset: 0;
  background: rgba(15, 23, 42, 0.35);
  backdrop-filter: blur(4px);
  z-index: 50;
`

const ModalWrap = styled.div`
  position: fixed;        /* ← fixed so it stays centered over the full page */
  inset: 0;
  z-index: 51;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  pointer-events: none;   /* let clicks pass through to overlay for close-on-backdrop */
`

const ModalContent = styled(motion.div)`
  pointer-events: all;    /* re-enable clicks inside the modal card */
  width: 100%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 24px 64px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(59,130,246,0.08);
  border: 1px solid rgba(59, 130, 246, 0.12);
  max-width: ${({ $size }) => sizes[$size] || sizes.md};
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.35rem 1.75rem;
  border-bottom: 1px solid rgba(59, 130, 246, 0.1);
`

const ModalTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  color: var(--text-primary);
  margin: 0;
`

const CloseBtn = styled.button`
  padding: 0.35rem;
  border-radius: 8px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  color: var(--text-muted);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
  }
`

const ModalBody = styled.div`
  padding: 1.75rem;
  color: var(--text-primary);
`

const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  useEffect(() => {
    const handleEscape = (e) => { if (e.key === 'Escape') onClose() }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Full-page backdrop */}
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Centered modal card */}
          <ModalWrap>
            <ModalContent
              $size={size}
              initial={{ opacity: 0, scale: 0.93, y: 12 }}
              animate={{ opacity: 1, scale: 1,    y: 0  }}
              exit={{    opacity: 0, scale: 0.93, y: 12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {title && (
                <ModalHeader>
                  <ModalTitle>{title}</ModalTitle>
                  <CloseBtn onClick={onClose}>
                    <X size={18} />
                  </CloseBtn>
                </ModalHeader>
              )}
              <ModalBody>{children}</ModalBody>
            </ModalContent>
          </ModalWrap>
        </>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Modal