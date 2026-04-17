import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styled, { keyframes, css } from 'styled-components'
import { X, Loader, Camera, Upload, AlertCircle, FileText, Image, Code2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import { portfolioService } from '../../services/portfolioService' // adjust path

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`
const slideUp = keyframes`
  from { opacity: 0; transform: translateY(24px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
`
const spin = keyframes`
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  animation: ${fadeIn} 0.2s ease both;
`

const Modal = styled.div`
  background: var(--bg-card, #161b27);
  border: 1px solid rgba(59,130,246,0.15);
  border-radius: 24px;
  padding: 0;
  max-width: 620px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,130,246,0.06);
  animation: ${slideUp} 0.3s ease both;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    border-radius: 24px 24px 0 0;
    background: linear-gradient(90deg, transparent, rgba(59,130,246,0.5), transparent);
  }

  scrollbar-width: thin;
  scrollbar-color: rgba(59,130,246,0.15) transparent;
  &::-webkit-scrollbar { width: 5px; }
  &::-webkit-scrollbar-track { background: transparent; }
  &::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.15); border-radius: 3px; }
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.75rem 1.75rem 0;
  margin-bottom: 1.75rem;
`

const ModalTitle = styled.h2`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary, #e2e8f0);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.6rem;

  svg { color: #3b82f6; width: 20px; height: 20px; }
`

const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid var(--border, rgba(59,130,246,0.1));
  background: rgba(255,255,255,0.04);
  color: var(--text-muted, #64748b);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  svg { width: 18px; height: 18px; }

  &:hover {
    color: var(--text-primary, #e2e8f0);
    border-color: rgba(59,130,246,0.25);
    background: rgba(59,130,246,0.06);
  }
`

const ModalBody = styled.div`
  padding: 0 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

/* ── Section card ── */
const SCard = styled.div`
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--border, rgba(59,130,246,0.08));
  border-radius: 14px;
  overflow: hidden;
`

const SCardHead = styled.div`
  padding: 0.85rem 1.1rem;
  border-bottom: 1px solid var(--border, rgba(59,130,246,0.08));
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(255,255,255,0.015);
`

const SCardIcon = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 7px;
  background: ${({ $bg }) => $bg || 'rgba(59,130,246,0.1)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $c }) => $c || '#3b82f6'};
  svg { width: 13px; height: 13px; }
`

const SCardTitle = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
`

const SCardBody = styled.div`
  padding: 1.1rem;
`

/* ── Photo upload (mirrors ProfilePage) ── */
const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`

const ThumbWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`

const ThumbBox = styled.div`
  width: 96px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(59,130,246,0.08), rgba(30,64,175,0.06));
  border: 2px solid var(--border, rgba(59,130,246,0.1));
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`

const ThumbPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  color: var(--text-muted, #64748b);
  font-size: 0.62rem;
  text-align: center;
`

const UploadHoverLayer = styled.label`
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: rgba(59,130,246,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #3b82f6;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;

  ${ThumbWrap}:hover & { opacity: 1; }
  svg { width: 18px; height: 18px; }
`

const UploadZone = styled.label`
  flex: 1;
  min-height: 70px;
  border: 1.5px dashed rgba(59,130,246,0.2);
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  cursor: pointer;
  color: var(--text-muted, #64748b);
  font-size: 0.78rem;
  font-family: 'DM Sans', sans-serif;
  transition: all 0.22s;

  svg { width: 16px; height: 16px; }

  &:hover {
    border-color: #3b82f6;
    background: rgba(59,130,246,0.04);
    color: #3b82f6;
  }
`

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.72rem;
  color: var(--text-muted, #64748b);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0.25rem 0;

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border, rgba(59,130,246,0.08));
  }
`

/* ── Form fields ── */
const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted, #64748b);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.4rem;
  svg { color: #3b82f6; width: 11px; height: 11px; }
`

const FInput = styled.input`
  width: 100%;
  padding: 0.68rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border, rgba(59,130,246,0.1));
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  color: var(--text-primary, #e2e8f0);
  transition: all 0.22s ease;
  box-sizing: border-box;

  &::placeholder { color: var(--text-muted, #64748b); }
  &:hover { border-color: rgba(59,130,246,0.22); background: rgba(255,255,255,0.05); }
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(59,130,246,0.04);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
`

const FTextarea = styled.textarea`
  width: 100%;
  padding: 0.68rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border, rgba(59,130,246,0.1));
  border-radius: 10px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  color: var(--text-primary, #e2e8f0);
  transition: all 0.22s ease;
  resize: vertical;
  min-height: 130px;
  box-sizing: border-box;

  &::placeholder { color: var(--text-muted, #64748b); }
  &:hover { border-color: rgba(59,130,246,0.22); }
  &:focus {
    outline: none;
    border-color: #3b82f6;
    background: rgba(59,130,246,0.04);
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
`

const ValidationHint = styled.small`
  color: ${({ $valid }) => ($valid ? '#10b981' : '#ef4444')};
  font-size: 0.67rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.3rem;
  font-family: 'DM Sans', sans-serif;
  svg { width: 11px; height: 11px; }
`

/* ── Toggle ── */
const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.1rem;
  background: rgba(255,255,255,0.025);
  border: 1px solid var(--border, rgba(59,130,246,0.08));
  border-radius: 12px;
`

const ToggleLabel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
`

const ToggleName = styled.span`
  font-size: 0.84rem;
  font-weight: 700;
  color: var(--text-primary, #e2e8f0);
  font-family: 'DM Sans', sans-serif;
`

const ToggleDesc = styled.span`
  font-size: 0.72rem;
  color: var(--text-muted, #64748b);
`

const ToggleSwitch = styled.label`
  position: relative;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
  cursor: pointer;

  input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
  }
`

const Slider = styled.span`
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: ${({ $on }) => $on ? '#3b82f6' : 'rgba(255,255,255,0.1)'};
  border: 1px solid ${({ $on }) => $on ? '#3b82f6' : 'rgba(255,255,255,0.1)'};
  transition: all 0.25s ease;

  &::before {
    content: '';
    position: absolute;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: white;
    top: 2px;
    left: ${({ $on }) => $on ? 'calc(100% - 20px)' : '2px'};
    transition: left 0.25s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  }
`

/* ── Footer ── */
const ModalFooter = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--border, rgba(59,130,246,0.08));
  background: rgba(255,255,255,0.01);
`

const CancelBtn = styled.button`
  padding: 0.68rem 1.35rem;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid var(--border, rgba(59,130,246,0.12));
  background: rgba(255,255,255,0.04);
  color: var(--text-muted, #64748b);
  transition: all 0.2s;

  &:hover { background: rgba(255,255,255,0.07); color: var(--text-primary, #e2e8f0); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.68rem 1.6rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.25s ease;

  svg {
    width: 15px;
    height: 15px;
    ${({ $loading }) => $loading && css`animation: ${spin} 1s linear infinite;`}
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(59,130,246,0.35);
  }
  &:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }
`

/* ═══════════════════════════════════════════════════════════════════ */
const AdminTemplateModal = ({ open, template, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    code: '',
    description: '',
    isPublic: true,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [imageMode, setImageMode] = useState('url')
  const [loading, setLoading] = useState(false)
  const [urlError, setUrlError] = useState('')
  const fileRef = useRef()

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (!open) return
    if (template) {
      setFormData({
        name: template.name || '',
        image: template.image || '',
        code: template.code || '',
        description: template.description || '',
        isPublic: template.isPublic ?? true,
      })
      if (template.image) setImagePreview(template.image)
      setImageMode('url')
    } else {
      setFormData({ name: '', image: '', code: '', description: '', isPublic: true })
      setImagePreview('')
      setImageMode('url')
    }
    setImageFile(null)
    setUrlError('')
  }, [template, open])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleImageFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
    setImageMode('file')
    setFormData(prev => ({ ...prev, image: '' }))
  }

  const handleUrlChange = (e) => {
    const val = e.target.value
    setFormData(prev => ({ ...prev, image: val }))
    setUrlError('')
    if (val) {
      setImagePreview(val)
      setImageMode('url')
      setImageFile(null)
    } else {
      setImagePreview('')
    }
  }

  const handleUrlBlur = () => {
    if (formData.image) {
      try { new URL(formData.image) }
      catch { setUrlError('Invalid URL format') }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      toast.error('Name and code are required')
      return
    }
    if (!imageFile && !formData.image) {
      toast.error('Please provide a template preview image')
      return
    }
    if (urlError) {
      toast.error('Please fix validation errors')
      return
    }

    setLoading(true)
    try {
      let imageKey = formData.image

      // Upload file using portfolioService
      if (imageFile) {
        const fd = new FormData()
        fd.append('image', imageFile)
        const { data } = await portfolioService.uploadImage(fd)
        imageKey = data.key // expects the service to return { key: '...' }
      }

      const method = template ? 'PUT' : 'POST'
      const url = template
        ? `${API_URL}/admin/templates/${template._id}`
        : `${API_URL}/admin/templates`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, image: imageKey }),
        credentials: 'include',
      })

      const data = await res.json()
      if (data.success) {
        toast.success(template ? 'Template updated' : 'Template created')
        onClose()
        onSave()
      } else {
        toast.error(data.message)
      }
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  // Use portal to render modal at the body level
  return createPortal(
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Code2 />
            {template ? 'Edit Template' : 'Create Template'}
          </ModalTitle>
          <CloseBtn onClick={onClose}><X /></CloseBtn>
        </ModalHeader>

        <form onSubmit={handleSubmit}>
          <ModalBody>
            {/* Preview Image */}
            <SCard>
              <SCardHead>
                <SCardIcon><Image /></SCardIcon>
                <SCardTitle>Preview Image</SCardTitle>
              </SCardHead>
              <SCardBody>
                <PhotoRow>
                  <ThumbWrap>
                    <ThumbBox>
                      {imagePreview
                        ? <img src={imagePreview} alt="Preview" onError={() => setImagePreview('')} />
                        : (
                          <ThumbPlaceholder>
                            <Image size={20} style={{ color: 'rgba(59,130,246,0.3)' }} />
                            <span>No image</span>
                          </ThumbPlaceholder>
                        )
                      }
                    </ThumbBox>
                    <UploadHoverLayer htmlFor="tmpl-img-file"><Camera /></UploadHoverLayer>
                    <input
                      id="tmpl-img-file"
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleImageFile}
                      ref={fileRef}
                    />
                  </ThumbWrap>
                  <UploadZone htmlFor="tmpl-img-file">
                    <Upload />
                    <span>Click to upload or drag &amp; drop</span>
                    <span style={{ fontSize: '0.68rem', opacity: 0.6 }}>PNG, JPG, GIF up to 10MB</span>
                  </UploadZone>
                </PhotoRow>

                <OrDivider>or paste a URL</OrDivider>

                <div>
                  <FInput
                    type="text"
                    name="imageUrl"
                    value={formData.image}
                    onChange={handleUrlChange}
                    onBlur={handleUrlBlur}
                    placeholder="https://example.com/preview.jpg"
                    disabled={imageMode === 'file' && !!imageFile}
                  />
                  {urlError && (
                    <ValidationHint $valid={false}>
                      <AlertCircle /> {urlError}
                    </ValidationHint>
                  )}
                  {imagePreview && !urlError && imageMode === 'file' && (
                    <ValidationHint $valid={true}>✓ File selected — {imageFile?.name}</ValidationHint>
                  )}
                  {imagePreview && !urlError && imageMode === 'url' && formData.image && (
                    <ValidationHint $valid={true}>✓ URL looks good</ValidationHint>
                  )}
                </div>
              </SCardBody>
            </SCard>

            {/* Basic Info */}
            <SCard>
              <SCardHead>
                <SCardIcon $bg="rgba(245,197,66,0.1)" $c="#FBBF24"><FileText /></SCardIcon>
                <SCardTitle>Template Info</SCardTitle>
              </SCardHead>
              <SCardBody style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <FLabel>Template Name *</FLabel>
                  <FInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Modern Blue"
                    required
                  />
                </div>
                <div>
                  <FLabel>Description</FLabel>
                  <FInput
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Brief description of this template"
                  />
                </div>
              </SCardBody>
            </SCard>

            {/* Code */}
            <SCard>
              <SCardHead>
                <SCardIcon $bg="rgba(167,139,250,0.1)" $c="#A78BFA"><Code2 /></SCardIcon>
                <SCardTitle>HTML / CSS / JS Code *</SCardTitle>
              </SCardHead>
              <SCardBody>
                <FTextarea
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="<html>...</html>"
                  required
                  rows={7}
                />
              </SCardBody>
            </SCard>

            {/* Visibility */}
            <ToggleRow>
              <ToggleLabel>
                <ToggleName>{formData.isPublic ? <Eye size={14} style={{ display: 'inline', marginRight: 4 }} /> : <EyeOff size={14} style={{ display: 'inline', marginRight: 4 }} />}Public Template</ToggleName>
                <ToggleDesc>{formData.isPublic ? 'Visible to all users' : 'Hidden from users'}</ToggleDesc>
              </ToggleLabel>
              <ToggleSwitch>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleChange}
                />
                <Slider $on={formData.isPublic} />
              </ToggleSwitch>
            </ToggleRow>
          </ModalBody>

          <ModalFooter>
            <CancelBtn type="button" onClick={onClose} disabled={loading}>Cancel</CancelBtn>
            <SaveBtn type="submit" disabled={loading} $loading={loading}>
              {loading ? <Loader /> : null}
              {loading ? 'Saving…' : template ? 'Update Template' : 'Create Template'}
            </SaveBtn>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>,
    document.body
  )
}

export default AdminTemplateModal