import { useState } from 'react'
import { itemService } from '../../services/itemService'
import Modal from '../common/Modal'
import Input from '../common/Input'
import Button from '../common/Button'
import toast from 'react-hot-toast'
import styled, { keyframes, css } from 'styled-components'
import { FileText, Link as LinkIcon, File, Lock, Upload, Eye, EyeOff, Save } from 'lucide-react'

const spin = keyframes`to { transform: rotate(360deg); }`

/* ─── Shared styled primitives ─── */
const FieldWrap = styled.div`margin-bottom: 14px;`

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  margin-bottom: 7px;
`

const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${({ $type }) =>
    $type === 'note' ? '#3b82f6' :
    $type === 'link' ? '#10b981' :
    $type === 'file' ? '#6366f1' : '#94a3b8'};
  flex-shrink: 0;
`

const StyledInput = styled.input`
  width: 100%;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  color: #0f172a;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: all 0.22s;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  &::placeholder { color: #cbd5e1; }
`

const StyledTextarea = styled.textarea`
  width: 100%;
  resize: vertical;
  min-height: 130px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  color: #0f172a;
  font-size: 0.875rem;
  font-family: inherit;
  line-height: 1.7;
  outline: none;
  transition: all 0.22s;
  box-sizing: border-box;

  &:focus {
    border-color: #3b82f6;
    background: white;
    box-shadow: 0 0 0 3px rgba(59,130,246,0.1);
  }
  &::placeholder { color: #cbd5e1; }
`

/* ─── Current file panel ─── */
const CurrentFile = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(99,102,241,0.05);
  border: 1.5px solid rgba(99,102,241,0.2);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 10px;
`

const CurrentFileIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(99,102,241,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 1.1rem;
`

const CurrentFileMeta = styled.div`
  flex: 1;
  min-width: 0;
`

const CurrentFileName = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const CurrentFileSub = styled.div`
  font-size: 0.72rem;
  color: #64748b;
  margin-top: 2px;
`

const CurrentBadge = styled.span`
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: rgba(99,102,241,0.1);
  color: #4f46e5;
  border-radius: 20px;
  padding: 3px 9px;
  flex-shrink: 0;
`

/* ─── File drop ─── */
const FileDrop = styled.label`
  display: block;
  border: 2px dashed ${({ $hasFile }) => $hasFile ? '#6366f1' : '#cbd5e1'};
  border-radius: 12px;
  padding: 24px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  background: ${({ $hasFile }) => $hasFile ? 'rgba(99,102,241,0.04)' : '#f8fafc'};

  &:hover { border-color: #6366f1; background: rgba(99,102,241,0.04); }
  input { display: none; }
`

const FileDropIcon  = styled.div`font-size: 1.8rem; margin-bottom: 6px;`
const FileDropText  = styled.div`color: #64748b; font-size: 0.875rem; span { color: #4f46e5; }`
const FileDropSub   = styled.div`color: #94a3b8; font-size: 0.75rem; margin-top: 4px;`

/* ─── Divider ─── */
const Divider = styled.div`height: 1px; background: #e2e8f0; margin: 16px 0;`

/* ─── Password protect toggle ─── */
const ProtectToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ $active }) => $active ? 'rgba(59,130,246,0.05)' : '#f8fafc'};
  border: 1.5px solid ${({ $active }) => $active ? 'rgba(59,130,246,0.3)' : '#e2e8f0'};
  border-radius: 10px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;

  &:hover { background: rgba(59,130,246,0.05); border-color: rgba(59,130,246,0.25); }
  svg { width: 16px; height: 16px; }
`

const ToggleLabel = styled.div`flex: 1;`
const ToggleLabelTitle = styled.div`
  font-size: 0.875rem; font-weight: 500;
  color: ${({ $active }) => $active ? '#1d4ed8' : '#475569'};
`
const ToggleLabelSub = styled.div`font-size: 0.75rem; color: #94a3b8; margin-top: 1px;`

const ToggleSwitch = styled.div`
  width: 36px; height: 20px; border-radius: 20px;
  background: ${({ $on }) => $on ? '#3b82f6' : '#cbd5e1'};
  position: relative; transition: background 0.2s; flex-shrink: 0;
  &::after {
    content: ''; position: absolute; top: 3px;
    left: ${({ $on }) => $on ? '19px' : '3px'};
    width: 14px; height: 14px; border-radius: 50%; background: white;
    transition: left 0.2s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  }
`

/* ─── Password keep/change tabs ─── */
const PassTabs = styled.div`
  display: flex; gap: 6px; margin: 10px 0;
`
const PassTab = styled.button`
  flex: 1; padding: 7px; border-radius: 8px;
  border: 1.5px solid ${({ $active }) => $active ? 'rgba(59,130,246,0.4)' : '#e2e8f0'};
  background: ${({ $active }) => $active ? 'rgba(59,130,246,0.07)' : 'white'};
  color: ${({ $active }) => $active ? '#1d4ed8' : '#64748b'};
  font-family: inherit; font-size: 0.78rem; cursor: pointer; transition: all 0.18s;
  &:hover { border-color: rgba(59,130,246,0.3); color: #1d4ed8; }
`

/* ─── Password input wrapper ─── */
const PassWrap = styled.div`position: relative;`
const EyeBtn = styled.button`
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: #94a3b8; cursor: pointer; padding: 0;
  display: flex; align-items: center; transition: color 0.2s;
  &:hover { color: #475569; }
  svg { width: 15px; height: 15px; }
`

/* ─── Password strength ─── */
const StrengthHint = styled.div`
  display: flex; align-items: center; gap: 6px;
  margin-top: 7px; font-size: 0.72rem;
  color: ${({ $len }) => $len === 0 ? '#94a3b8' : $len < 4 ? '#ef4444' : '#10b981'};
  svg { width: 11px; height: 11px; }
`

/* ─── Action row ─── */
const ActionRow = styled.div`display: flex; gap: 10px; margin-top: 4px;`

const CancelBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px;
  border: 1.5px solid #e2e8f0; background: white; color: #64748b;
  font-family: inherit; font-size: 0.875rem; cursor: pointer; transition: all 0.2s;
  &:hover { background: #f1f5f9; color: #0f172a; }
`

const SubmitBtn = styled.button`
  flex: 1; padding: 10px; border-radius: 10px; border: none;
  background: ${({ $type }) =>
    $type === 'note' ? 'linear-gradient(135deg,#3b82f6,#1d4ed8)' :
    $type === 'link' ? 'linear-gradient(135deg,#10b981,#059669)' :
                       'linear-gradient(135deg,#6366f1,#4f46e5)'};
  color: white; font-family: inherit; font-size: 0.875rem; font-weight: 500;
  cursor: pointer; transition: all 0.25s;
  box-shadow: 0 3px 12px ${({ $type }) =>
    $type === 'note' ? 'rgba(59,130,246,0.3)' :
    $type === 'link' ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.25)'};
  display: flex; align-items: center; justify-content: center; gap: 6px;

  &:hover:not(:disabled) { transform: translateY(-1px); filter: brightness(1.06); }
  &:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  svg { width: 14px; height: 14px; }
  .spin-icon { animation: ${spin} 0.8s linear infinite; }
`

const formatBytes = (b) =>
  !b ? '' : b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`

const TYPES = ['note', 'link', 'file']

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
const EditItemModal = ({ item, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    type:        item.type        || 'note',
    title:       item.title       || '',
    content:     item.content     || '',
    file:        null,
    hasPassword: !!item.hasPassword,
    password:    '',
  })
  const [keepPassword, setKeepPassword] = useState(true)
  const [loading,   setLoading]   = useState(false)
  const [dragOver,  setDragOver]  = useState(false)
  const [showPass,  setShowPass]  = useState(false)

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }))

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] || null
    setForm(prev => ({ ...prev, file: f, content: f ? f.name : prev.content }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        type:        form.type,
        title:       form.title,
        content:     form.type === 'file' ? (form.file ? form.file.name : form.content) : form.content,
        hasPassword: form.hasPassword,
      }

      if (form.type === 'file' && form.file) {
        const fileData = new FormData()
        fileData.append('file', form.file)
        const uploadRes = await itemService.uploadFile(fileData)
        payload.metadata = {
          ...item.metadata,
          s3Key:        uploadRes.data.key,
          signedUrl:    uploadRes.data.url,
          originalName: form.file.name,
          mimeType:     form.file.type,
        }
      } else if (item.metadata) {
        payload.metadata = item.metadata
      }

      if (form.hasPassword && form.password && !keepPassword) {
        payload.password = form.password
      }

      const { data } = await itemService.updateItem(item._id, payload)
      toast.success('Item updated')
      onUpdated(data)
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed to update item')
    } finally {
      setLoading(false)
    }
  }

  const typeColor = form.type === 'note' ? '#3b82f6' : form.type === 'link' ? '#10b981' : '#6366f1'

  return (
    <Modal isOpen onClose={onClose} title="Edit Item">
      <form onSubmit={handleSubmit}>

        {/* Title */}
        <FieldWrap>
          <Label><Dot $type={form.type} /> Title</Label>
          <StyledInput
            placeholder="Item title…"
            value={form.title}
            onChange={set('title')}
            required
          />
        </FieldWrap>

        {/* Note content */}
        {form.type === 'note' && (
          <FieldWrap>
            <Label><Dot $type="note" /> Content</Label>
            <StyledTextarea
              placeholder="Write your note…"
              value={form.content}
              onChange={set('content')}
            />
          </FieldWrap>
        )}

        {/* Link URL */}
        {form.type === 'link' && (
          <FieldWrap>
            <Label><Dot $type="link" /> URL</Label>
            <StyledInput
              type="url"
              placeholder="https://example.com"
              value={form.content}
              onChange={set('content')}
              required
            />
          </FieldWrap>
        )}

        {/* File */}
        {form.type === 'file' && (
          <FieldWrap>
            <Label><Dot $type="file" /> File</Label>

            {item.metadata?.originalName && !form.file && (
              <CurrentFile>
                <CurrentFileIcon>📎</CurrentFileIcon>
                <CurrentFileMeta>
                  <CurrentFileName>{item.metadata.originalName}</CurrentFileName>
                  <CurrentFileSub>
                    {formatBytes(item.metadata.size)}
                    {item.metadata.mimeType ? ` · ${item.metadata.mimeType}` : ''}
                  </CurrentFileSub>
                </CurrentFileMeta>
                <CurrentBadge>Current</CurrentBadge>
              </CurrentFile>
            )}

            <FileDrop
              $hasFile={!!form.file}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setForm(p => ({ ...p, file: f })) }}
            >
              <input type="file" onChange={handleFileChange} />
              {form.file ? (
                <>
                  <FileDropIcon>📁</FileDropIcon>
                  <FileDropText style={{ color: '#1e293b', fontWeight: 500 }}>{form.file.name}</FileDropText>
                  <FileDropSub>{formatBytes(form.file.size)} · {form.file.type || 'unknown'}</FileDropSub>
                  <div style={{ color: '#6366f1', fontSize: '0.72rem', marginTop: 8 }}>Click to choose a different file</div>
                </>
              ) : (
                <>
                  <FileDropIcon><Upload style={{ width: 24, height: 24, color: '#94a3b8' }} /></FileDropIcon>
                  <FileDropText>Drop a new file or <span>browse</span> to replace</FileDropText>
                  <FileDropSub>Max 10 MB · Leave empty to keep current file</FileDropSub>
                </>
              )}
            </FileDrop>
          </FieldWrap>
        )}

        <Divider />

        {/* Password protection */}
        <FieldWrap>
          <ProtectToggle $active={form.hasPassword} onClick={() => setForm(p => ({ ...p, hasPassword: !p.hasPassword }))}>
            <Lock style={{ color: form.hasPassword ? '#2563eb' : '#94a3b8' }} />
            <ToggleLabel>
              <ToggleLabelTitle $active={form.hasPassword}>Password protection</ToggleLabelTitle>
              <ToggleLabelSub>Require a password to view this item</ToggleLabelSub>
            </ToggleLabel>
            <ToggleSwitch $on={form.hasPassword} />
          </ProtectToggle>

          {form.hasPassword && (
            <>
              {/* Keep / Change tabs — only when item already had a password */}
              {item.hasPassword && (
                <PassTabs>
                  <PassTab
                    type="button"
                    $active={keepPassword}
                    onClick={() => { setKeepPassword(true); setForm(p => ({ ...p, password: '' })) }}
                  >
                    🔒 Keep existing password
                  </PassTab>
                  <PassTab
                    type="button"
                    $active={!keepPassword}
                    onClick={() => setKeepPassword(false)}
                  >
                    🔄 Set new password
                  </PassTab>
                </PassTabs>
              )}

              {(!item.hasPassword || !keepPassword) && (
                <>
                  <PassWrap style={{ marginTop: item.hasPassword ? 0 : 10 }}>
                    <StyledInput
                      style={{ paddingRight: 44 }}
                      type={showPass ? 'text' : 'password'}
                      placeholder={item.hasPassword ? 'Enter new password…' : 'Create a password (min. 4 chars)…'}
                      value={form.password}
                      onChange={set('password')}
                      autoComplete="new-password"
                      autoFocus={!item.hasPassword}
                    />
                    <EyeBtn type="button" onClick={() => setShowPass(s => !s)}>
                      {showPass ? <EyeOff /> : <Eye />}
                    </EyeBtn>
                  </PassWrap>

                  <StrengthHint $len={form.password.length}>
                    {form.password.length >= 4
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    }
                    {form.password.length === 0
                      ? 'Minimum 4 characters required'
                      : form.password.length < 4
                      ? `${4 - form.password.length} more character${4 - form.password.length !== 1 ? 's' : ''} needed`
                      : 'Password looks good'}
                  </StrengthHint>
                </>
              )}
            </>
          )}
        </FieldWrap>

        <ActionRow>
          <CancelBtn type="button" onClick={onClose}>Cancel</CancelBtn>
          <SubmitBtn type="submit" $type={form.type} disabled={loading}>
            {loading ? (
              <>
                <Upload className="spin-icon" />
                Uploading…
              </>
            ) : (
              <>
                <Save />
                Save {form.type.charAt(0).toUpperCase() + form.type.slice(1)}
              </>
            )}
          </SubmitBtn>
        </ActionRow>
      </form>
    </Modal>
  )
}

export default EditItemModal