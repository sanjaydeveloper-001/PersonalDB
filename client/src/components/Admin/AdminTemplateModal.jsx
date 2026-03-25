import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { X, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background: white;
  border-radius: 0.875rem;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #94a3b8;
  padding: 0;

  &:hover {
    color: #0f172a;
  }

  svg { width: 24px; height: 24px; }
`

const FormGroup = styled.div`
  margin-bottom: 1.25rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.375rem;
`

const Input = styled.input`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  box-sizing: border-box;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #0f172a;
  background: white;
  font-family: 'Courier New', monospace;
  box-sizing: border-box;
  resize: vertical;
  min-height: 150px;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem;
  background: #f8fafc;
  border-radius: 0.5rem;
`

const Toggle = styled.input`
  width: 40px;
  height: 22px;
  cursor: pointer;
`

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  justify-content: flex-end;
`

const Button = styled.button`
  padding: 0.65rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const PrimaryBtn = styled(Button)`
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }
`

const SecondaryBtn = styled(Button)`
  background: white;
  color: #374151;
  border: 1px solid #e2e8f0;

  &:hover:not(:disabled) {
    background: #f8fafc;
  }
`

const AdminTemplateModal = ({ open, template, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    code: '',
    description: '',
    isPublic: true,
  })
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

  useEffect(() => {
    if (template) {
      setFormData({
        name: template.name,
        image: template.image,
        code: template.code,
        description: template.description,
        isPublic: template.isPublic,
      })
    } else {
      setFormData({
        name: '',
        image: '',
        code: '',
        description: '',
        isPublic: true,
      })
    }
  }, [template, open])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.image || !formData.code) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const method = template ? 'PUT' : 'POST'
      const url = template
        ? `${API_URL}/admin/templates/${template._id}`
        : `${API_URL}/admin/templates`

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        toast.success(template ? 'Template updated' : 'Template created')
        onClose()
        onSave()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save template')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>{template ? 'Edit Template' : 'Create Template'}</Title>
          <CloseBtn onClick={onClose}>
            <X />
          </CloseBtn>
        </Header>

        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label>Template Name *</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Modern Blue"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Preview Image URL *</Label>
            <Input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label>Description</Label>
            <Input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the template"
            />
          </FormGroup>

          <FormGroup>
            <Label>HTML/CSS/JS Code *</Label>
            <Textarea
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="<html>...</html>"
              required
            />
          </FormGroup>

          <FormGroup>
            <ToggleRow>
              <Label style={{ margin: 0 }}>Public Template</Label>
              <Toggle
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleChange}
              />
            </ToggleRow>
          </FormGroup>

          <ButtonRow>
            <SecondaryBtn type="button" onClick={onClose} disabled={loading}>
              Cancel
            </SecondaryBtn>
            <PrimaryBtn type="submit" disabled={loading}>
              {loading ? <Loader /> : null}
              {loading ? 'Saving...' : template ? 'Update' : 'Create'}
            </PrimaryBtn>
          </ButtonRow>
        </form>
      </Modal>
    </Overlay>
  )
}

export default AdminTemplateModal