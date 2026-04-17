// src/pages/portfolio/InterestsPage.jsx
import { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { Heart, Plus, X, Save } from 'lucide-react'
import { portfolioService } from '../../services/portfolioService'
import toast from 'react-hot-toast'

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`
const tagPop = keyframes`
  from { opacity: 0; transform: scale(0.75) rotate(-4deg); }
  to   { opacity: 1; transform: scale(1) rotate(0deg); }
`

const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  max-width: 100%;
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
  background: linear-gradient(135deg, rgba(236,72,153,0.15), rgba(190,24,93,0.1));
  border: 1px solid rgba(236,72,153,0.3);
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  color: #EC4899; font-size: 1.4rem;
  box-shadow: 0 0 22px rgba(236,72,153,0.14);
`

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 2rem; font-weight: 800;
  color: var(--text-primary); line-height: 1;
  margin: 0 0 0.35rem;
`

const PageSub = styled.p`
  font-size: 0.84rem; color: var(--text-muted); margin: 0;
`

const SaveBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.72rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.88rem; cursor: pointer;
  transition: all 0.25s ease;
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(236,72,153,0.4); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`

/* ── Input card ──────────────────────────────────────────────── */
const InputCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.75rem;
  margin-bottom: 1.5rem;
  position: relative; overflow: hidden;

  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, #EC4899, #BE185D);
  }
`

const InputRow = styled.div`
  display: flex; gap: 0.6rem;
  @media (max-width: 580px) { flex-direction: column; }
`

const FInput = styled.input`
  flex: 1;
  padding: 0.72rem 1rem;
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.88rem; color: var(--text-primary);
  transition: all 0.22s ease;
  &::placeholder { color: var(--text-muted); }
  &:focus {
    outline: none;
    border-color: #EC4899;
    background: rgba(236,72,153,0.04);
    box-shadow: 0 0 0 3px rgba(236,72,153,0.12);
  }
`

const AddBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.4rem;
  padding: 0.72rem 1.2rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white; border: none; border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.84rem; cursor: pointer;
  white-space: nowrap;
  transition: all 0.22s;
  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(236,72,153,0.38); }
`

/* ── Interests canvas ────────────────────────────────────────── */
const Canvas = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 1.75rem;
  min-height: 180px;
`

const CanvasHead = styled.div`
  font-size: 0.68rem; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 1.25rem;
`

const ChipGrid = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.6rem;
`

/* Colour palette for chips */
const PALETTES = [
  { bg:'rgba(0,212,255,0.08)',  c:'var(--accent)',   b:'rgba(0,212,255,0.22)' },
  { bg:'rgba(245,197,66,0.08)', c:'var(--gold)',     b:'rgba(245,197,66,0.22)' },
  { bg:'rgba(167,139,250,0.09)',c:'#A78BFA',          b:'rgba(167,139,250,0.25)' },
  { bg:'rgba(52,211,153,0.08)', c:'#34D399',          b:'rgba(52,211,153,0.22)' },
  { bg:'rgba(236,72,153,0.08)', c:'#EC4899',          b:'rgba(236,72,153,0.22)' },
  { bg:'rgba(249,115,22,0.08)', c:'#F97316',          b:'rgba(249,115,22,0.22)' },
  { bg:'rgba(0,230,118,0.08)',  c:'var(--success)',  b:'rgba(0,230,118,0.22)' },
  { bg:'rgba(96,165,250,0.08)', c:'#60A5FA',          b:'rgba(96,165,250,0.22)' },
]

const Chip = styled.div`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.4rem 0.9rem;
  background: ${({ $p }) => PALETTES[$p % PALETTES.length].bg};
  color: ${({ $p }) => PALETTES[$p % PALETTES.length].c};
  border: 1px solid ${({ $p }) => PALETTES[$p % PALETTES.length].b};
  border-radius: 100px;
  font-size: 0.84rem; font-weight: 500;
  animation: ${tagPop} 0.25s ease;
  transition: transform 0.18s;
  &:hover { transform: scale(1.05); }
`

const ChipX = styled.button`
  background: none; border: none;
  color: inherit; cursor: pointer; padding: 0;
  display: flex; align-items: center; justify-content: center;
  opacity: 0.55; transition: opacity 0.15s;
  &:hover { opacity: 1; }
`

const EmptyHint = styled.p`
  font-size: 0.84rem; color: var(--text-muted);
  text-align: center; margin: 1.5rem 0; width: 100%;
`

const BottomRow = styled.div`
  display: flex; justify-content: flex-end;
  margin-top: 1.5rem;
`

/* ══════════════════════════════════════════════════════════════ */
const InterestsPage = () => {
  const [interests, setInterests] = useState([])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)

  useEffect(() => {
    portfolioService.getInterests()
      .then(({ data }) => setInterests(Array.isArray(data) ? data : data?.interests || []))
      .catch(() => toast.error('Failed to load interests'))
      .finally(() => setLoading(false))
  }, [])

  const add = () => {
    const t = input.trim()
    if (!t) return
    if (interests.includes(t)) { toast.error('Already added'); return }
    setInterests(p => [...p, t])
    setInput('')
  }

  const remove = i => setInterests(p => p.filter((_,idx)=>idx!==i))

  const save = async () => {
    try {
      setSaving(true)
      await portfolioService.updateInterests({ interests })
      toast.success('Interests saved!')
    } catch { toast.error('Save failed') }
    finally { setSaving(false) }
  }

  return (
    <Page>
      <PageHead>
        <HeadLeft>
          <IconBox><Heart size={22}/></IconBox>
          <div>
            <PageTitle>Interests</PageTitle>
            <PageSub>Your hobbies and personal interests</PageSub>
          </div>
        </HeadLeft>
        <SaveBtn onClick={save} disabled={saving}>
          <Save size={15}/> {saving ? 'Saving…' : 'Save'}
        </SaveBtn>
      </PageHead>

      <InputCard>
        <div style={{ fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--text-muted)', marginBottom:'0.85rem' }}>
          Add Interest
        </div>
        <InputRow>
          <FInput
            placeholder="e.g. Photography, Hiking, Reading…"
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==='Enter'){ e.preventDefault(); add() } }}
          />
          <AddBtn onClick={add} disabled={!input.trim()}>
            <Plus size={14}/> Add
          </AddBtn>
        </InputRow>
      </InputCard>

      <Canvas>
        <CanvasHead>Your Interests — {interests.length} total</CanvasHead>
        <ChipGrid>
          {interests.length === 0 ? (
            <EmptyHint>No interests added yet. Start typing above!</EmptyHint>
          ) : (
            interests.map((item, i) => (
              <Chip key={i} $p={i}>
                {item}
                <ChipX onClick={()=>remove(i)}><X size={11}/></ChipX>
              </Chip>
            ))
          )}
        </ChipGrid>
      </Canvas>

      <BottomRow>
        <SaveBtn onClick={save} disabled={saving}>
          <Save size={15}/> {saving ? 'Saving…' : 'Save Interests'}
        </SaveBtn>
      </BottomRow>
    </Page>
  )
}

export default InterestsPage
