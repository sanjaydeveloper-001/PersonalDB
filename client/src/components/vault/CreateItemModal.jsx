import { useState } from 'react'
import { itemService } from '../../services/itemService'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import styled, { keyframes, css } from 'styled-components'
import { FileText, Link as LinkIcon, File, Lock, Upload, Eye, EyeOff } from 'lucide-react'

/* ─────────────────────────────────────────────
   Animations
───────────────────────────────────────────── */
const spin = keyframes`to { transform: rotate(360deg); }`

/* ─────────────────────────────────────────────
   Type Tabs
───────────────────────────────────────────── */
const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
`

const TypeTab = styled.button`
  flex: 1;
  padding: 9px 0;
  border-radius: 10px;
  border: 1.5px solid;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-family: inherit;

  ${({ $active, $type }) => {
    const colors = {
      note:  { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.35)',  color: '#2563eb' },
      link:  { bg: 'rgba(16,185,129,0.07)',  border: 'rgba(16,185,129,0.32)',  color: '#059669' },
      file:  { bg: 'rgba(99,102,241,0.07)',  border: 'rgba(99,102,241,0.32)',  color: '#4f46e5' },
    }
    const c = colors[$type] || colors.note
    return $active
      ? css`background:${c.bg}; border-color:${c.border}; color:${c.color};`
      : css`background:#f8fafc; border-color:#e2e8f0; color:#94a3b8;
            &:hover { color: #475569; background: #f1f5f9; border-color: #cbd5e1; }`
  }}

  svg { width: 14px; height: 14px; }
`

/* ─────────────────────────────────────────────
   Field wrapper
───────────────────────────────────────────── */
const FieldWrap = styled.div`
  margin-bottom: 14px;
`

const Label = styled.label`
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  margin-bottom: 7px;
`

const StyledInput = styled.input`
  width: 100%;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  color: #0f172a;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  &::placeholder { color: #cbd5e1; }
`

const StyledTextarea = styled.textarea`
  width: 100%;
  resize: vertical;
  min-height: 110px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 14px;
  color: #0f172a;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.6;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  &::placeholder { color: #cbd5e1; }
`

/* ─────────────────────────────────────────────
   File drop zone
───────────────────────────────────────────── */
const FileDrop = styled.label`
  display: block;
  border: 2px dashed ${({ $hasFile }) => $hasFile ? '#6366f1' : '#cbd5e1'};
  border-radius: 12px;
  padding: 28px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $hasFile }) => $hasFile ? 'rgba(99,102,241,0.04)' : '#f8fafc'};

  &:hover {
    border-color: #6366f1;
    background: rgba(99,102,241,0.04);
  }

  input { display: none; }
`

const FileDropIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 8px;
  color: #94a3b8;
`

const FileDropText = styled.div`
  color: #64748b;
  font-size: 0.875rem;
  span { color: #4f46e5; }
`

const FileDropSub = styled.div`
  color: #94a3b8;
  font-size: 0.75rem;
  margin-top: 4px;
`

const FileInfo = styled.div`
  color: #0f172a;
  font-size: 0.875rem;
  font-weight: 500;
`

const FileInfoSub = styled.div`
  color: #64748b;
  font-size: 0.75rem;
  margin-top: 4px;
`

const FileChangeHint = styled.div`
  color: #6366f1;
  font-size: 0.72rem;
  margin-top: 8px;
`

/* ─────────────────────────────────────────────
   Divider
───────────────────────────────────────────── */
const Divider = styled.div`
  height: 1px;
  background: #e2e8f0;
  margin: 16px 0;
`

/* ─────────────────────────────────────────────
   Protect toggle
───────────────────────────────────────────── */
const ProtectToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ $active }) => $active ? 'rgba(59,130,246,0.05)' : '#f8fafc'};
  border: 1.5px solid ${({ $active }) => $active ? 'rgba(59,130,246,0.35)' : '#e2e8f0'};
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover {
    background: rgba(59,130,246,0.05);
    border-color: rgba(59,130,246,0.3);
  }

  svg { width: 15px; height: 15px; }
`

const ToggleLabel = styled.div`
  flex: 1;
`

const ToggleLabelTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ $active }) => $active ? '#1d4ed8' : '#475569'};
`

const ToggleLabelSub = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-top: 1px;
`

const ToggleSwitch = styled.div`
  width: 36px;
  height: 20px;
  border-radius: 20px;
  background: ${({ $on }) => $on ? '#3b82f6' : '#cbd5e1'};
  position: relative;
  transition: background 0.2s;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: ${({ $on }) => $on ? '19px' : '3px'};
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: white;
    transition: left 0.2s;
    box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
`

/* ─────────────────────────────────────────────
   Password input wrapper (with eye toggle)
───────────────────────────────────────────── */
const PassWrap = styled.div`
  position: relative;
`

const EyeBtn = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover { color: #475569; }
  svg { width: 15px; height: 15px; }
`

/* ─────────────────────────────────────────────
   Action row
───────────────────────────────────────────── */
const ActionRow = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`

const CancelBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-family: inherit;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover { background: #f1f5f9; color: #0f172a; border-color: #cbd5e1; }
`

const SubmitBtn = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.25s;
  box-shadow: 0 3px 12px rgba(59,130,246,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(59,130,246,0.35);
  }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

  svg { width: 14px; height: 14px; }

  .spin-icon {
    animation: ${spin} 0.8s linear infinite;
  }
`

/* ─────────────────────────────────────────────
   Type config
───────────────────────────────────────────── */
const TYPE_CONFIG = {
  note: { icon: <FileText />, label: 'Note' },
  link: { icon: <LinkIcon />, label: 'Link' },
  file: { icon: <File />,     label: 'File' },
}

const formatBytes = (b) =>
  b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const CreateItemModal = ({ isOpen, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    type: 'note', title: '', content: '', file: null, password: '', hasPassword: false,
  })
  const [loading, setLoading]   = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null
    setForm(prev => ({ ...prev, file: f, content: f ? f.name : '' }))
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) setForm(prev => ({ ...prev, file: f, content: f.name }))
  }

  const resetForm = () =>
    setForm({ type: 'note', title: '', content: '', file: null, password: '', hasPassword: false })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        type: form.type,
        title: form.title,
        content: form.type === 'file' ? (form.file ? form.file.name : form.content) : form.content,
        metadata: {},
      }

      if (form.type === 'file') {
        if (!form.file) throw new Error('Please select a file to upload.')
        const fileData = new FormData()
        fileData.append('file', form.file)
        const uploadRes = await itemService.uploadFile(fileData)
        payload.metadata = {
          s3Key: uploadRes.data.key,
          signedUrl: uploadRes.data.url,
          originalName: form.file.name,
          mimeType: form.file.type,
        }
      }

      if (form.hasPassword && form.password) {
        payload.hasPassword = true
        payload.password    = form.password
      }

      const { data } = await itemService.createItem(payload)
      toast.success('Item created')
      onSuccess(data)
      resetForm()
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to create item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Vault Item">
      {/* Type tabs */}
      <TabRow>
        {Object.entries(TYPE_CONFIG).map(([key, { icon, label }]) => (
          <TypeTab
            key={key}
            type="button"
            $type={key}
            $active={form.type === key}
            onClick={() => setForm(prev => ({ ...prev, type: key }))}
          >
            {icon} {label}
          </TypeTab>
        ))}
      </TabRow>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        {form.type !== 'file' && (
          <FieldWrap>
            <Label>Title <span style={{ color: '#cbd5e1', textTransform: 'none', letterSpacing: 0 }}>(optional)</span></Label>
            <StyledInput
              placeholder={`Give this ${form.type} a name…`}
              value={form.title}
              onChange={set('title')}
            />
          </FieldWrap>
        )}

        {/* Note */}
        {form.type === 'note' && (
          <FieldWrap>
            <Label>Content</Label>
            <StyledTextarea
              placeholder="Write your note here…"
              value={form.content}
              onChange={set('content')}
              required
            />
          </FieldWrap>
        )}

        {/* Link */}
        {form.type === 'link' && (
          <>
            <FieldWrap>
              <Label>URL</Label>
              <StyledInput
                type="url"
                placeholder="https://example.com"
                value={form.content}
                onChange={set('content')}
                required
              />
            </FieldWrap>
          </>
        )}

        {/* File */}
        {form.type === 'file' && (
          <FieldWrap>
            <Label>File</Label>
            <FileDrop
              $hasFile={!!form.file}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <input type="file" onChange={handleFileChange} required={!form.file} />
              {form.file ? (
                <>
                  <FileDropIcon>📁</FileDropIcon>
                  <FileInfo>{form.file.name}</FileInfo>
                  <FileInfoSub>{formatBytes(form.file.size)} · {form.file.type || 'unknown type'}</FileInfoSub>
                  <FileChangeHint>Click to change file</FileChangeHint>
                </>
              ) : (
                <>
                  <FileDropIcon><Upload style={{ width: 28, height: 28, color: '#94a3b8' }} /></FileDropIcon>
                  <FileDropText>Drop file here or <span>browse</span></FileDropText>
                  <FileDropSub>Max 10 MB</FileDropSub>
                </>
              )}
            </FileDrop>
          </FieldWrap>
        )}

        <Divider />

        {/* Password protect toggle */}
        <FieldWrap>
          <ProtectToggle $active={form.hasPassword} onClick={() => setForm(p => ({ ...p, hasPassword: !p.hasPassword }))}>
            <Lock style={{ color: form.hasPassword ? '#2563eb' : '#94a3b8' }} />
            <ToggleLabel>
              <ToggleLabelTitle $active={form.hasPassword}>Password protect this item</ToggleLabelTitle>
              <ToggleLabelSub>Require a password to view</ToggleLabelSub>
            </ToggleLabel>
            <ToggleSwitch $on={form.hasPassword} />
          </ProtectToggle>
        </FieldWrap>

        {form.hasPassword && (
          <FieldWrap>
            <Label>Item Password</Label>
            <PassWrap>
              <StyledInput
                style={{ paddingRight: 42 }}
                type={showPass ? 'text' : 'password'}
                placeholder="Set a password for this item"
                value={form.password}
                onChange={set('password')}
                required
              />
              <EyeBtn type="button" onClick={() => setShowPass(s => !s)}>
                {showPass ? <EyeOff /> : <Eye />}
              </EyeBtn>
            </PassWrap>
          </FieldWrap>
        )}

        <ActionRow>
          <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
          <SubmitBtn type="submit" disabled={loading}>
            {loading ? (
              <>
                <Upload className="spin-icon" />
                Uploading…
              </>
            ) : (
              <>
                <FileText />
                Create {TYPE_CONFIG[form.type].label}
              </>
            )}
          </SubmitBtn>
        </ActionRow>
      </form>
    </Modal>
  )
}

export default CreateItemModal