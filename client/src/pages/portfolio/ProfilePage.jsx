// src/pages/portfolio/ProfilePage.jsx
import { useState, useEffect, useRef } from 'react'
import styled, { keyframes } from 'styled-components'
import {
  User, Camera, Save, MapPin, Phone, Mail, Globe,
  Linkedin, Github, Twitter, FileText, Briefcase, Hash
} from 'lucide-react'
import { portfolioService } from '../../services/portfolioService'
import toast from 'react-hot-toast'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`

/* ── Shell ───────────────────────────────────────────────────── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  width: 100%;
`

const PageHead = styled.div`
  display: flex; align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem; gap: 1rem; flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex; align-items: center; gap: 1.25rem;
`

const IconBox = styled.div`
  width: 54px; height: 54px;
  background: linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,119,255,0.12));
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); font-size: 1.4rem;
  box-shadow: 0 0 22px rgba(0,212,255,0.14);
`

const PageTitle = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: var(--text-primary); line-height: 1;
  margin: 0 0 0.35rem;
`

const PageSub = styled.p`
  font-size: 0.84rem; color: var(--text-muted); margin: 0;
`

const SaveAllBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.72rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #ffffff; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.88rem; cursor: pointer;
  transition: all 0.25s ease;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,212,255,0.4); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

/* ── Section card ────────────────────────────────────────────── */
const SCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => ($i||0)*0.1}s;
  position: relative;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent);
  }
`

const SCardHead = styled.div`
  padding: 1.35rem 1.75rem;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 0.7rem;
`

const SCardHeadIcon = styled.div`
  width: 30px; height: 30px; border-radius: 8px;
  background: ${({ $bg }) => $bg || 'rgba(0,212,255,0.1)'};
  display: flex; align-items: center; justify-content: center;
  color: ${({ $c }) => $c || 'var(--accent)'};
`

const SCardTitle = styled.h3`
  font-family: 'Syne', sans-serif;
  font-size: 0.9rem; font-weight: 700;
  color: var(--text-primary); margin: 0;
`

const SCardBody = styled.div`
  padding: 1.75rem;
`

/* ── Form grid ───────────────────────────────────────────────── */
const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`

const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 0.38rem;
  ${({ $full }) => $full && 'grid-column: 1 / -1;'}
`

const FLabel = styled.label`
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted);
  display: flex; align-items: center; gap: 0.4rem;
  svg { color: var(--accent); }
`

const FInput = styled.input`
  width: 100%;
  padding: 0.72rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem; color: var(--text-primary);
  transition: all 0.22s ease;
  &::placeholder { color: var(--text-muted); }
  &:hover { border-color: rgba(0,212,255,0.22); background: rgba(255,255,255,0.05); }
  &:focus {
    outline: none; border-color: var(--accent);
    background: rgba(0,212,255,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
  }
`

const FTextarea = styled.textarea`
  width: 100%;
  padding: 0.72rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem; color: var(--text-primary);
  transition: all 0.22s ease;
  resize: vertical; min-height: 100px;
  &::placeholder { color: var(--text-muted); }
  &:hover { border-color: rgba(0,212,255,0.22); }
  &:focus {
    outline: none; border-color: var(--accent);
    background: rgba(0,212,255,0.04);
    box-shadow: 0 0 0 3px rgba(0,212,255,0.1);
  }
`

/* ── Photo upload ────────────────────────────────────────────── */
const PhotoRow = styled.div`
  display: flex; align-items: center; gap: 1.75rem; flex-wrap: wrap;
`

const AvatarWrap = styled.div`
  position: relative; flex-shrink: 0;
`

const AvatarBox = styled.div`
  width: 108px; height: 108px;
  border-radius: 22px; overflow: hidden;
  background: linear-gradient(135deg, rgba(0,212,255,0.1), rgba(0,119,255,0.1));
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  position: relative;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`

const AvatarPlaceholder = styled.div`
  display: flex; flex-direction: column;
  align-items: center; gap: 0.4rem;
  color: var(--text-muted); font-size: 0.7rem; text-align: center;
`

const UploadHoverLayer = styled.label`
  position: absolute; inset: 0;
  border-radius: 20px;
  background: rgba(0,212,255,0.2);
  display: flex; align-items: center; justify-content: center;
  color: var(--accent); cursor: pointer;
  opacity: 0; transition: opacity 0.2s;
  ${AvatarWrap}:hover & { opacity: 1; }
`

const UploadZone = styled.label`
  flex: 1; min-height: 78px;
  border: 1.5px dashed rgba(0,212,255,0.22);
  border-radius: 12px;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 0.35rem; cursor: pointer;
  color: var(--text-muted); font-size: 0.82rem;
  transition: all 0.22s;
  &:hover { border-color: var(--accent); background: var(--accent-dim); color: var(--accent); }
`

/* ── Social input with icon ──────────────────────────────────── */
const SocialInputWrap = styled.div`
  position: relative;
`

const SocialIcon = styled.div`
  position: absolute; left: 0.85rem; top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted); display: flex;
  pointer-events: none;
`

const SocialInput = styled(FInput)`
  padding-left: 2.5rem;
`

/* ── Footer row ──────────────────────────────────────────────── */
const FootRow = styled.div`
  display: flex; justify-content: flex-end;
  padding-top: 0.5rem;
`

/* ══════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const [form, setForm] = useState({
    name:'', age:'', domain:'', summary:'',
    location:'', phone:'', email:'', cvLink:'',
    profilePhoto:'', linkedin:'', github:'', twitter:'', website:'',
  })
  const [photoFile, setPhotoFile]     = useState(null)
  const [photoPreview, setPhotoPreview] = useState('')
  const [loading, setLoading]         = useState(true)
  const [saving, setSaving]           = useState(false)
  const fileRef = useRef()

  useEffect(() => {
    portfolioService.getProfile()
      .then(({ data }) => {
        if (data) {
          setForm(p => ({ ...p, ...data }))
          if (data.profilePhotoUrl) setPhotoPreview(data.profilePhotoUrl)
          else if (data.profilePhoto?.startsWith('http')) setPhotoPreview(data.profilePhoto)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = key => e => setForm(p => ({ ...p, [key]: e.target.value }))

  const handlePhoto = e => {
    const file = e.target.files?.[0]; if (!file) return
    setPhotoFile(file); setPhotoPreview(URL.createObjectURL(file))
  }

  const handleSave = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form }
      if (photoFile) {
        const fd = new FormData(); fd.append('image', photoFile)
        const { data } = await portfolioService.uploadImage(fd)
        payload.profilePhoto = data.key
      }
      await portfolioService.updateProfile(payload)
      toast.success('Profile saved!')
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  return (
    <Page>
      <PageHead>
        <HeadLeft>
          <IconBox><User size={22}/></IconBox>
          <div>
            <PageTitle>Profile</PageTitle>
            <PageSub>Your personal information and contact details</PageSub>
          </div>
        </HeadLeft>
        <SaveAllBtn onClick={handleSave} disabled={saving}>
          <Save size={15}/> {saving ? 'Saving…' : 'Save Profile'}
        </SaveAllBtn>
      </PageHead>

      <form onSubmit={handleSave}>
        {/* ── Photo ── */}
        <SCard $i={0}>
          <SCardHead>
            <SCardHeadIcon $bg="rgba(0,212,255,0.1)" $c="var(--accent)">
              <Camera size={16}/>
            </SCardHeadIcon>
            <SCardTitle>Profile Photo</SCardTitle>
          </SCardHead>
          <SCardBody>
            <PhotoRow>
              <AvatarWrap>
                <AvatarBox>
                  {photoPreview
                    ? <img src={photoPreview} alt="Profile"/>
                    : (
                      <AvatarPlaceholder>
                        <Camera size={24} style={{ color:'rgba(0,212,255,0.4)' }}/>
                        <span>No photo</span>
                      </AvatarPlaceholder>
                    )
                  }
                </AvatarBox>
                <UploadHoverLayer htmlFor="avatar-file">
                  <Camera size={20}/>
                </UploadHoverLayer>
                <input id="avatar-file" type="file" accept="image/*" hidden onChange={handlePhoto} ref={fileRef}/>
              </AvatarWrap>

              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.84rem', fontWeight:600, color:'var(--text-primary)', marginBottom:'0.25rem' }}>
                  Upload Profile Photo
                </div>
                <div style={{ fontSize:'0.78rem', color:'var(--text-muted)', marginBottom:'0.75rem' }}>
                  PNG, JPG, GIF up to 10MB
                </div>
                <UploadZone htmlFor="avatar-file">
                  <Camera size={17}/>
                  <span>Click to upload or drag & drop</span>
                </UploadZone>
              </div>
            </PhotoRow>
          </SCardBody>
        </SCard>

        {/* ── Personal Info ── */}
        <SCard $i={1}>
          <SCardHead>
            <SCardHeadIcon $bg="rgba(245,197,66,0.1)" $c="var(--gold)">
              <User size={16}/>
            </SCardHeadIcon>
            <SCardTitle>Personal Information</SCardTitle>
          </SCardHead>
          <SCardBody>
            <Grid2>
              <FieldWrap>
                <FLabel><Hash size={12}/> Full Name</FLabel>
                <FInput placeholder="e.g. Alex Johnson" value={form.name} onChange={set('name')}/>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Hash size={12}/> Age</FLabel>
                <FInput type="number" placeholder="e.g. 25" value={form.age} onChange={set('age')}/>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Briefcase size={12}/> Domain / Role</FLabel>
                <FInput placeholder="e.g. Full Stack Developer" value={form.domain} onChange={set('domain')}/>
              </FieldWrap>
              <FieldWrap>
                <FLabel><MapPin size={12}/> Location</FLabel>
                <FInput placeholder="e.g. Bangalore, India" value={form.location} onChange={set('location')}/>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Phone size={12}/> Phone</FLabel>
                <FInput type="tel" placeholder="e.g. +91 9876543210" value={form.phone} onChange={set('phone')}/>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Mail size={12}/> Email</FLabel>
                <FInput type="email" placeholder="e.g. alex@email.com" value={form.email} onChange={set('email')}/>
              </FieldWrap>
              <FieldWrap $full>
                <FLabel>Bio / Summary</FLabel>
                <FTextarea
                  rows={4}
                  placeholder="Write a short bio about yourself…"
                  value={form.summary}
                  onChange={set('summary')}
                />
              </FieldWrap>
            </Grid2>
          </SCardBody>
        </SCard>

        {/* ── Social & Links ── */}
        <SCard $i={2}>
          <SCardHead>
            <SCardHeadIcon $bg="rgba(167,139,250,0.1)" $c="#A78BFA">
              <Globe size={16}/>
            </SCardHeadIcon>
            <SCardTitle>Social & Links</SCardTitle>
          </SCardHead>
          <SCardBody>
            <Grid2>
              <FieldWrap>
                <FLabel><Linkedin size={12}/> LinkedIn</FLabel>
                <SocialInputWrap>
                  <SocialIcon><Linkedin size={15}/></SocialIcon>
                  <SocialInput placeholder="https://linkedin.com/in/…" value={form.linkedin} onChange={set('linkedin')}/>
                </SocialInputWrap>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Github size={12}/> GitHub</FLabel>
                <SocialInputWrap>
                  <SocialIcon><Github size={15}/></SocialIcon>
                  <SocialInput placeholder="https://github.com/…" value={form.github} onChange={set('github')}/>
                </SocialInputWrap>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Twitter size={12}/> Twitter / X</FLabel>
                <SocialInputWrap>
                  <SocialIcon><Twitter size={15}/></SocialIcon>
                  <SocialInput placeholder="https://twitter.com/…" value={form.twitter} onChange={set('twitter')}/>
                </SocialInputWrap>
              </FieldWrap>
              <FieldWrap>
                <FLabel><Globe size={12}/> Website</FLabel>
                <SocialInputWrap>
                  <SocialIcon><Globe size={15}/></SocialIcon>
                  <SocialInput placeholder="https://yoursite.com" value={form.website} onChange={set('website')}/>
                </SocialInputWrap>
              </FieldWrap>
              <FieldWrap $full>
                <FLabel><FileText size={12}/> CV / Resume URL</FLabel>
                <FInput placeholder="https://drive.google.com/…" value={form.cvLink} onChange={set('cvLink')}/>
              </FieldWrap>
            </Grid2>
          </SCardBody>
        </SCard>

        <FootRow>
          <SaveAllBtn type="submit" disabled={saving} style={{ padding:'0.82rem 2rem', fontSize:'0.92rem' }}>
            <Save size={16}/> {saving ? 'Saving…' : 'Save Profile'}
          </SaveAllBtn>
        </FootRow>
      </form>
    </Page>
  )
}

export default ProfilePage
