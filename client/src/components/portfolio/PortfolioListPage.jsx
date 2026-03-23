// src/components/portfolio/PortfolioListPage.jsx
import { useState, useEffect } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { Plus, Pencil, Trash2, X, Save, ExternalLink, Github } from 'lucide-react'
import { portfolioService } from '../../services/portfolioService'
import toast from 'react-hot-toast'

/* ── Keyframes ──────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(22px); }
  to   { opacity: 1; transform: translateY(0); }
`
const shimmer = keyframes`
  0%   { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
`
const slideDown = keyframes`
  from { opacity: 0; max-height: 0; }
  to   { opacity: 1; max-height: 1200px; }
`
const dotPulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.4); }
  50%      { box-shadow: 0 0 0 5px rgba(0,212,255,0); }
`

/* ── Page ────────────────────────────────────────────────────── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
`

const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`

const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`

const IconBox = styled.div`
  width: 54px; height: 54px;
  background: linear-gradient(135deg, rgba(59,130,246,0.15), rgba(30,64,175,0.1));
  border: 1px solid ${({ $c }) => $c ? `${$c}44` : 'rgba(59,130,246,0.3)'};
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: ${({ $c }) => $c || '#3b82f6'};
  font-size: 1.35rem;
  box-shadow: 0 0 22px ${({ $c }) => $c ? `${$c}22` : 'rgba(59,130,246,0.14)'};
  flex-shrink: 0;
`

const TitleWrap = styled.div``
const PageTitle = styled.h1`
  font-family: 'Syne', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: var(--text-primary);
  line-height: 1; margin: 0 0 0.35rem;
`
const PageSub = styled.p`
  font-size: 0.84rem; color: var(--text-muted); margin: 0;
`

const AddBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.7rem 1.4rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #ffffff; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.88rem; cursor: pointer;
  transition: all 0.25s ease;
  &:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,212,255,0.4); }
`

/* ── Form Panel ──────────────────────────────────────────────── */
const FormOuter = styled.div`
  margin-bottom: 2rem;
  overflow: hidden;
  animation: ${slideDown} 0.3s cubic-bezier(0.4,0,0.2,1);
`

const FormPanel = styled.div`
  background: var(--bg-card);
  border: 1px solid rgba(0,212,255,0.3);
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--accent), #0077FF, var(--accent));
    background-size: 200%;
    animation: ${shimmer} 3s linear infinite;
  }
`

const FormHead = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.35rem 1.75rem;
  border-bottom: 1px solid var(--border);
`

const FormTitle = styled.h3`
  font-family: 'Syne', sans-serif;
  font-size: 0.92rem; font-weight: 700;
  color: var(--text-primary); margin: 0;
  display: flex; align-items: center; gap: 0.65rem;
`

const TitleDot = styled.span`
  width: 8px; height: 8px;
  border-radius: 50%; background: var(--accent);
  animation: ${dotPulse} 2s infinite;
  display: inline-block; flex-shrink: 0;
`

const CloseBtn = styled.button`
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255,82,82,0.07);
  border: 1px solid rgba(255,82,82,0.18);
  color: rgba(255,82,82,0.55);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.18s;
  &:hover { background: rgba(255,82,82,0.2); color: var(--error); border-color: rgba(255,82,82,0.4); }
`

const FormBody = styled.div`
  padding: 1.75rem;
`

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(245px, 1fr));
  gap: 1.2rem;
`

const FieldWrap = styled.div`
  display: flex; flex-direction: column; gap: 0.38rem;
  ${({ $full }) => $full && css`grid-column: 1 / -1;`}
`

const FLabel = styled.label`
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--text-muted);
`

const baseInput = css`
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

const FInput = styled.input`${baseInput}`
const FTextarea = styled.textarea`
  ${baseInput}
  resize: vertical; min-height: 88px;
`
const FSelect = styled.select`
  ${baseInput}
  cursor: pointer; appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238899AA' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 0.85rem center;
  padding-right: 2.4rem;
  option { background: var(--bg-card); color: var(--text-primary); }
`

const FilePreview = styled.div`
  margin-top: 0.5rem; border-radius: 12px; overflow: hidden;
  border: 2px dashed var(--border); 
  background: linear-gradient(135deg, rgba(59,130,246,0.04) 0%, rgba(59,130,246,0.02) 100%);
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3b82f6;
    background: linear-gradient(135deg, rgba(59,130,246,0.08) 0%, rgba(59,130,246,0.04) 100%);
  }
  
  img { 
    width: 100%; 
    height: 100%; 
    object-fit: cover; 
    display: block;
    max-height: 200px;
  }
  
  div {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.8rem;
  }
`

const HiddenFileInput = styled.input`
  display: none;
`

const FormFoot = styled.div`
  display: flex; justify-content: flex-end; gap: 0.7rem;
  padding: 1.2rem 1.75rem;
  border-top: 1px solid var(--border);
`

const GhostB = styled.button`
  padding: 0.6rem 1.2rem;
  background: transparent; border: 1px solid var(--border);
  border-radius: 10px; color: var(--text-secondary);
  font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 0.84rem;
  cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(255,255,255,0.05); color: var(--text-primary); }
`

const SaveB = styled.button`
  display: inline-flex; align-items: center; gap: 0.42rem;
  padding: 0.6rem 1.35rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #ffffff; border: none; border-radius: 10px;
  font-family: 'DM Sans', sans-serif; font-weight: 700; font-size: 0.84rem;
  cursor: pointer; transition: all 0.22s;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(0,212,255,0.4); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

/* ── Grid & Cards ────────────────────────────────────────────── */
const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
  gap: 1.2rem;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`

const Card = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.25s ease;
  animation: ${fadeUp} 0.42s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.06}s;
  position: relative;
  cursor: default;

  &::after {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent), transparent);
    opacity: 0; transition: opacity 0.25s;
  }
  &:hover { border-color: rgba(59,130,246,0.28);
    transform: translateY(-4px);
    box-shadow: 0 18px 50px rgba(0,0,0,0.45), 0 0 32px rgba(59,130,246,0.07);
    &::after { opacity: 1; }
  }
`

const CardImg = styled.div`
  height: 140px; overflow: hidden;
  img { width: 100%; height: 100%; object-fit: cover; display: block; }
`

const CardBody = styled.div`
  padding: 1.4rem;
`

const CardRow = styled.div`
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 0.7rem;
  margin-bottom: 0.75rem;
`

const CardMain = styled.div``
const CTitle = styled.div`
  font-family: 'Syne', sans-serif;
  font-size: 0.97rem; font-weight: 700;
  color: var(--text-primary); line-height: 1.3;
`
const CSub = styled.div`
  font-size: 0.78rem; color: var(--accent); font-weight: 500; margin-top: 0.18rem;
`

const BtnGroup = styled.div`
  display: flex; gap: 0.38rem; flex-shrink: 0;
`
const Btn = styled.button`
  width: 28px; height: 28px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.18s;
  border: 1px solid transparent;
  background: ${({ $d }) => $d ? 'rgba(255,82,82,0.07)' : 'rgba(59,130,246,0.07)'};
  color: ${({ $d }) => $d ? 'rgba(255,82,82,0.55)' : 'rgba(59,130,246,0.65)'};
  &:hover {
    background: ${({ $d }) => $d ? 'rgba(255,82,82,0.2)' : 'rgba(59,130,246,0.18)'};
    color: ${({ $d }) => $d ? 'var(--error)' : 'var(--accent)'};
    border-color: ${({ $d }) => $d ? 'rgba(255,82,82,0.35)' : 'rgba(59,130,246,0.3)'};
    transform: scale(1.08);
  }
`

const Tags = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.38rem; margin-bottom: 0.65rem;
`

const Tag = styled.span`
  font-size: 0.68rem; font-weight: 600;
  padding: 0.2rem 0.55rem;
  background: ${({ $bg }) => $bg || 'rgba(245,197,66,0.1)'};
  color: ${({ $c }) => $c || 'var(--gold)'};
  border: 1px solid ${({ $b }) => $b || 'rgba(245,197,66,0.22)'};
  border-radius: 100px;
`

const LinkTag = styled.a`
  font-size: 0.68rem; font-weight: 600;
  padding: 0.2rem 0.55rem;
  background: rgba(0,212,255,0.07);
  color: var(--accent);
  border: 1px solid rgba(59,130,246,0.2);
  border-radius: 100px;
  display: inline-flex; align-items: center; gap: 0.22rem;
  text-decoration: none; cursor: pointer;
  transition: background 0.18s;
  &:hover { background: rgba(59,130,246,0.16); }
`

const CardDesc = styled.p`
  font-size: 0.81rem; color: var(--text-muted);
  line-height: 1.65; margin: 0;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
`

/* ── Empty ───────────────────────────────────────────────────── */
const EmptyBox = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 5rem 2rem; gap: 1rem; text-align: center;
  background: var(--bg-card);
  border: 1.5px dashed rgba(0,212,255,0.18);
  border-radius: 20px;
  animation: ${fadeUp} 0.4s ease;
`
const EIcon = styled.div`
  width: 58px; height: 58px; border-radius: 16px;
  background: rgba(0,212,255,0.07);
  border: 1px dashed rgba(0,212,255,0.28);
  display: flex; align-items: center; justify-content: center;
  color: rgba(0,212,255,0.42); font-size: 1.5rem;
`
const ETitle = styled.h3`
  font-family: 'Syne', sans-serif; font-size: 0.98rem;
  color: var(--text-secondary); margin: 0;
`
const EText = styled.p`
  font-size: 0.8rem; color: var(--text-muted); margin: 0; max-width: 270px;
`

/* ── Skeleton ────────────────────────────────────────────────── */
const SkeletonBar = styled.div`
  height: ${({ $h }) => $h || '16px'};
  width: ${({ $w }) => $w || '100%'};
  margin: ${({ $m }) => $m || '0'};
  border-radius: 6px;
  background: linear-gradient(90deg,
    rgba(255,255,255,0.03) 0%,
    rgba(255,255,255,0.07) 50%,
    rgba(255,255,255,0.03) 100%
  );
  background-size: 600px;
  animation: ${shimmer} 1.4s ease infinite;
`

/* ── Helpers ─────────────────────────────────────────────────── */
const getTitle = (item, fields) => {
  const f = fields.find(f => ['title','name','institution','company','certification'].includes(f.name))
  return item[f?.name] || item[fields[0]?.name] || 'Untitled'
}
const getSub = (item, fields) => {
  const f = fields.find(f => ['course','role','issuer','type','level'].includes(f.name))
  return item[f?.name] || ''
}
const getMeta = (item, fields) => {
  const f = fields.find(f => ['duration','year','date'].includes(f.name))
  return item[f?.name] || ''
}
const getDesc = (item, fields) => {
  const f = fields.find(f => f.rows || f.name === 'description')
  return item[f?.name] || ''
}

/* ══════════════════════════════════════════════════════════════ */
const PortfolioListPage = ({
  title, subtitle, service, fields, icon, color: accentHex,
}) => {
  const [items, setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [show, setShow]     = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm]     = useState({})
  const [saving, setSaving] = useState(false)
  const [filePrev, setFilePrev] = useState({})
  const [fileUp, setFileUp]     = useState({})

  const blank = () => fields.reduce((a, f) => ({ ...a, [f.name]: '' }), {})

  const reload = async () => {
    try {
      setLoading(true)
      const { data } = await service.getAll()
      setItems(Array.isArray(data) ? data : [])
    } catch { toast.error(`Failed to load ${title}`) }
    finally { setLoading(false) }
  }
  useEffect(() => { reload() }, [])

  const openCreate = () => {
    setEditing(null); setForm(blank()); setFilePrev({}); setFileUp({}); setShow(true)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }
  const openEdit = (item) => {
    setEditing(item)
    setForm(fields.reduce((a,f) => ({ ...a, [f.name]: item[f.name] ?? item[`${f.name}Url`] ?? '' }), {}))
    setFilePrev(Object.fromEntries(
      fields.filter(f=>f.type==='file')
        .map(f=>[f.name, item[`${f.name}Url`]||item[f.name]||''])
        .filter(([,v])=>v)
    ))
    setFileUp({}); setShow(true)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  const handleFile = name => e => {
    const file = e.target.files?.[0]; if (!file) return
    setFileUp(p=>({...p,[name]:file}))
    setFilePrev(p=>({...p,[name]:URL.createObjectURL(file)}))
    setForm(p=>({...p,[name]:file.name}))
  }

  const handleSubmit = async e => {
    e.preventDefault(); setSaving(true)
    try {
      const payload = { ...form }
      for (const f of fields.filter(f=>f.type==='file')) {
        if (fileUp[f.name]) {
          const fd = new FormData(); fd.append('image', fileUp[f.name])
          const { data } = await portfolioService.uploadImage(fd)
          payload[f.name] = data.key
        }
      }
      if (fields.some(f=>f.name==='tech') && typeof payload.tech==='string') {
        payload.tech = payload.tech.split(',').map(t=>t.trim()).filter(Boolean)
      }
      if (editing) {
        const { data } = await service.update(editing._id||editing.id, payload)
        setItems(p=>p.map(i=>(i._id||i.id)===(data._id||data.id)?data:i))
        toast.success('Updated!')
      } else {
        const { data } = await service.create(payload)
        setItems(p=>[data,...p])
        toast.success('Created!')
      }
      setShow(false)
    } catch(err) { toast.error(err.response?.data?.message || 'Save failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async item => {
    if (!window.confirm(`Delete this ${title.replace(/s$/i,'')}?`)) return
    try {
      await service.delete(item._id||item.id)
      setItems(p=>p.filter(i=>(i._id||i.id)!==(item._id||item.id)))
      toast.success('Deleted')
    } catch { toast.error('Delete failed') }
  }

  return (
    <Page>
      <PageHead>
        <HeadLeft>
          <IconBox $c={accentHex}>{icon}</IconBox>
          <TitleWrap>
            <PageTitle>{title}</PageTitle>
            <PageSub>{subtitle || `Manage your ${title.toLowerCase()}`}</PageSub>
          </TitleWrap>
        </HeadLeft>
        <AddBtn onClick={openCreate}>
          <Plus size={15} /> Add {title.replace(/s$/i,'')}
        </AddBtn>
      </PageHead>

      {/* Form */}
      {show && (
        <FormOuter>
          <FormPanel>
            <FormHead>
              <FormTitle>
                <TitleDot />
                {editing ? `Edit ${title.replace(/s$/i,'')}` : `New ${title.replace(/s$/i,'')}`}
              </FormTitle>
              <CloseBtn onClick={()=>setShow(false)}><X size={13}/></CloseBtn>
            </FormHead>
            <form onSubmit={handleSubmit}>
              <FormBody>
                <FormGrid>
                  {fields.map(f => {
                    const val = form[f.name] || ''
                    const full = !!(f.rows || f.fullWidth)
                    return (
                      <FieldWrap key={f.name} $full={full}>
                        <FLabel>{f.label}{!f.required && ' (optional)'}</FLabel>
                        {f.type==='file' ? (
                          <>
                            <HiddenFileInput 
                              id={`file-${f.name}`}
                              type="file" 
                              accept="image/*" 
                              onChange={handleFile(f.name)} 
                            />
                            <FilePreview as="label" htmlFor={`file-${f.name}`} style={{cursor: 'pointer'}}>
                              {filePrev[f.name] ? (
                                <img src={filePrev[f.name]} alt="preview"/>
                              ) : (
                                <div>
                                  <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📸</div>
                                  <div>Click to upload image</div>
                                  <div style={{fontSize: '0.7rem', marginTop: '0.3rem'}}>or drag & drop</div>
                                </div>
                              )}
                            </FilePreview>
                          </>
                        ) : f.rows ? (
                          <FTextarea
                            rows={f.rows}
                            placeholder={f.placeholder || `e.g. ${f.label}`}
                            value={val}
                            onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}
                            required={f.required}
                          />
                        ) : f.type==='select' ? (
                          <FSelect
                            value={val}
                            onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}
                            required={f.required}
                          >
                            <option value="">Select…</option>
                            {f.options?.map(o=><option key={o} value={o}>{o}</option>)}
                          </FSelect>
                        ) : (
                          <FInput
                            type={f.type||'text'}
                            placeholder={f.placeholder||`e.g. ${f.label}`}
                            value={val}
                            onChange={e=>setForm(p=>({...p,[f.name]:e.target.value}))}
                            required={f.required}
                          />
                        )}
                      </FieldWrap>
                    )
                  })}
                </FormGrid>
              </FormBody>
              <FormFoot>
                <GhostB type="button" onClick={()=>setShow(false)}>Cancel</GhostB>
                <SaveB type="submit" disabled={saving}>
                  <Save size={13}/>
                  {saving ? 'Saving…' : editing ? 'Update' : 'Add'}
                </SaveB>
              </FormFoot>
            </form>
          </FormPanel>
        </FormOuter>
      )}

      {/* List */}
      {loading ? (
        <CardGrid>
          {[0,1,2].map(i=>(
            <Card key={i} $i={i}>
              <CardBody>
                <SkeletonBar $h="20px" $w="60%" $m="0 0 0.6rem"/>
                <SkeletonBar $h="13px" $w="40%" $m="0 0 1rem"/>
                <SkeletonBar $h="12px" $m="0 0 0.4rem"/>
                <SkeletonBar $h="12px" $w="75%"/>
              </CardBody>
            </Card>
          ))}
        </CardGrid>
      ) : items.length === 0 ? (
        <EmptyBox>
          <EIcon>{icon}</EIcon>
          <ETitle>No {title.toLowerCase()} yet</ETitle>
          <EText>Add your first {title.replace(/s$/i,'').toLowerCase()} to get started.</EText>
        </EmptyBox>
      ) : (
        <CardGrid>
          {items.map((item, i) => {
            const imgField = fields.find(f=>f.type==='file')
            const imgSrc   = imgField ? (item[`${imgField.name}Url`]||item[imgField.name]) : null
            const desc  = getDesc(item, fields)
            const meta  = getMeta(item, fields)
            const sub   = getSub(item, fields)
            const techs = Array.isArray(item.tech) ? item.tech : []
            return (
              <Card key={item._id||item.id||i} $i={i}>
                {imgSrc && (
                  <CardImg>
                    <img src={imgSrc} alt="" />
                  </CardImg>
                )}
                <CardBody>
                  <CardRow>
                    <CardMain>
                      <CTitle>{getTitle(item, fields)}</CTitle>
                      {sub && <CSub>{sub}</CSub>}
                    </CardMain>
                    <BtnGroup>
                      <Btn onClick={()=>openEdit(item)} title="Edit"><Pencil size={11}/></Btn>
                      <Btn $d onClick={()=>handleDelete(item)} title="Delete"><Trash2 size={11}/></Btn>
                    </BtnGroup>
                  </CardRow>

                  <Tags>
                    {meta && <Tag>{meta}</Tag>}
                    {item.type && <Tag $bg="rgba(167,139,250,0.1)" $c="#A78BFA" $b="rgba(167,139,250,0.22)">{item.type}</Tag>}
                    {item.cgpa && <Tag>CGPA {item.cgpa}</Tag>}
                    {item.percentage && <Tag>{item.percentage}</Tag>}
                    {techs.slice(0,3).map(t=>(
                      <Tag key={t} $bg="rgba(52,211,153,0.08)" $c="#34D399" $b="rgba(52,211,153,0.2)">{t}</Tag>
                    ))}
                    {techs.length > 3 && <Tag $bg="rgba(52,211,153,0.05)" $c="rgba(52,211,153,0.6)" $b="transparent">+{techs.length-3}</Tag>}
                    {item.demo && (
                      <LinkTag href={item.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={9}/> Demo
                      </LinkTag>
                    )}
                    {item.repo && (
                      <LinkTag href={item.repo} target="_blank" rel="noopener noreferrer">
                        <Github size={9}/> Repo
                      </LinkTag>
                    )}
                    {item.url && (
                      <LinkTag href={item.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink size={9}/> View
                      </LinkTag>
                    )}
                  </Tags>

                  {desc && <CardDesc>{desc}</CardDesc>}
                </CardBody>
              </Card>
            )
          })}
        </CardGrid>
      )}
    </Page>
  )
}

export default PortfolioListPage
