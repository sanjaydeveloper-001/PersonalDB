// src/pages/portfolio/SkillsPage.jsx
import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Cpu, Plus, Save, Trash2, Sparkles, Tag } from "lucide-react";
import { portfolioService } from "../../services/portfolioService";
import Modal from "../../components/common/Modal";
import toast from "react-hot-toast";

/* ── Animations ─────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const tagPop = keyframes`
  0%   { opacity: 0; transform: scale(0.7) translateY(4px); }
  70%  { transform: scale(1.07); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
`;
const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.28); }
  50%       { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
`;

/* ── Page ────────────────────────────────────────────────────── */
const Page = styled.div`
  animation: ${fadeUp} 0.45s ease both;
`;

/* ── Hero Header ─────────────────────────────────────────────── */
const HeroBar = styled.div`
  position: relative;
  background: linear-gradient(135deg,
    rgba(59,130,246,0.07) 0%,
    rgba(99,102,241,0.05) 50%,
    rgba(30,64,175,0.09) 100%);
  border: 1px solid rgba(59,130,246,0.14);
  border-radius: 24px;
  padding: 1.85rem 2.25rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -70px; right: -50px;
    width: 200px; height: 200px;
    background: radial-gradient(circle, rgba(59,130,246,0.11) 0%, transparent 70%);
    pointer-events: none;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  position: relative;
  z-index: 1;
`;

const IconBox = styled.div`
  width: 56px; height: 56px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  box-shadow: 0 8px 22px rgba(59,130,246,0.35);
  animation: ${glow} 3s ease-in-out infinite;
  flex-shrink: 0;
`;

const PageTitle = styled.h1`
  font-family: 'DM Sans', sans-serif;
  font-size: 1.85rem; font-weight: 800;
  color: var(--text-primary);
  line-height: 1; margin: 0 0 0.3rem;
  letter-spacing: -0.02em;
`;

const PageSub = styled.p`
  font-size: 0.82rem;
  color: var(--text-muted);
  margin: 0;
  display: flex; align-items: center; gap: 0.45rem;
`;

const TotalBadge = styled.span`
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.2rem 0.6rem;
  background: rgba(59,130,246,0.1);
  color: #3b82f6;
  border-radius: 100px;
  font-size: 0.7rem; font-weight: 800;
  border: 1px solid rgba(59,130,246,0.18);
`;

const SaveBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.5rem;
  padding: 0.75rem 1.6rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #fff; border: none; border-radius: 14px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.88rem; cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 14px rgba(59,130,246,0.28);
  position: relative; z-index: 1;

  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(59,130,246,0.42); }
  &:disabled { opacity: 0.45; cursor: not-allowed; }
`;

/* ── Add Category ────────────────────────────────────────────── */
const AddCatSection = styled.div`
  background: white;
  border: 2px dashed rgba(59,130,246,0.22);
  border-radius: 20px;
  padding: 1.4rem 1.75rem;
  margin-bottom: 2rem;
  transition: border-color 0.2s;
  &:focus-within { border-color: rgba(59,130,246,0.45); }
`;

const CatLabel = styled.div`
  font-size: 0.65rem; font-weight: 800;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--text-muted); margin-bottom: 0.75rem;
  display: flex; align-items: center; gap: 0.4rem;
`;

const CatInputRow = styled.div`
  display: flex; gap: 0.6rem;
  @media (max-width: 580px) { flex-direction: column; }
`;

const FInput = styled.input`
  flex: 1; padding: 0.7rem 1rem;
  background: rgba(248,250,252,1);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.86rem; color: var(--text-primary);
  transition: all 0.22s ease;
  &::placeholder { color: var(--text-muted); }
  &:focus {
    outline: none; border-color: #3b82f6;
    background: rgba(59,130,246,0.03);
    box-shadow: 0 0 0 4px rgba(59,130,246,0.08);
  }
`;

const GreenBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.7rem 1.25rem;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff; border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.82rem; cursor: pointer;
  white-space: nowrap; transition: all 0.22s ease;
  box-shadow: 0 4px 12px rgba(16,185,129,0.22);
  &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(16,185,129,0.36); }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

/* ── Grid ────────────────────────────────────────────────────── */
const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(370px, 1fr));
  gap: 1.5rem; margin-bottom: 2rem;
  @media (max-width: 820px) { grid-template-columns: 1fr; }
`;

const BAR_GRADIENTS = [
  'linear-gradient(90deg,#3b82f6,#6366f1)',
  'linear-gradient(90deg,#10b981,#06b6d4)',
  'linear-gradient(90deg,#f59e0b,#ef4444)',
  'linear-gradient(90deg,#8b5cf6,#ec4899)',
  'linear-gradient(90deg,#06b6d4,#3b82f6)',
  'linear-gradient(90deg,#f43f5e,#f59e0b)',
];

const Section = styled.div`
  background: white;
  border: 1px solid var(--border);
  border-radius: 22px;
  padding: 1.75rem;
  position: relative; overflow: hidden;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.08}s;
  transition: box-shadow 0.25s, border-color 0.25s;

  &:hover {
    box-shadow: 0 8px 32px rgba(59,130,246,0.08);
    border-color: rgba(59,130,246,0.16);
  }
  &::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3.5px;
    background: ${({ $bar }) => $bar};
    border-radius: 22px 22px 0 0;
  }
`;

const SecHead = styled.div`
  display: flex; align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem; gap: 0.6rem;
`;

const SecTitleWrap = styled.div`
  display: flex; align-items: center;
  gap: 0.55rem; flex: 1; min-width: 0;
`;

const SecTitle = styled.h3`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.94rem; font-weight: 800;
  color: var(--text-primary); margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;

const CountBadge = styled.span`
  flex-shrink: 0;
  font-size: 0.67rem; font-weight: 800;
  padding: 0.18rem 0.52rem;
  background: rgba(59,130,246,0.09);
  color: #3b82f6; border-radius: 100px;
  border: 1px solid rgba(59,130,246,0.14);
`;

const DeleteCatBtn = styled.button`
  flex-shrink: 0;
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,82,82,0.06);
  border: 1px solid rgba(255,82,82,0.14);
  color: rgba(255,82,82,0.45);
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.18s;
  &:hover {
    background: rgba(255,82,82,0.13); color: #ef4444;
    border-color: rgba(255,82,82,0.32); transform: scale(1.08);
  }
`;

/* ── Skill input inside card ─────────────────────────────────── */
const InputRow = styled.div`
  display: flex; gap: 0.5rem;
  margin-bottom: 1.2rem; align-items: center;
`;

const SkillInput = styled(FInput)`
  font-size: 0.83rem; padding: 0.6rem 0.9rem; border-radius: 10px;
`;

const AddSkillBtn = styled.button`
  display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.6rem 0.95rem;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: #fff; border: none; border-radius: 10px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.77rem; cursor: pointer;
  white-space: nowrap; transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(59,130,246,0.22);
  &:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(59,130,246,0.36); }
`;

/* ── Skill Tags ──────────────────────────────────────────────── */
const TagCloud = styled.div`
  display: flex; flex-wrap: wrap; gap: 0.5rem;
  min-height: 2.5rem;
`;

const SkillTag = styled.div`
  display: inline-flex; align-items: center; gap: 0.38rem;
  padding: 0.36rem 0.45rem 0.36rem 0.75rem;
  background: linear-gradient(135deg,
    rgba(59,130,246,0.07) 0%,
    rgba(99,102,241,0.05) 100%);
  border: 1px solid rgba(59,130,246,0.16);
  border-radius: 100px;
  animation: ${tagPop} 0.3s ease both;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg,
      rgba(59,130,246,0.13) 0%,
      rgba(99,102,241,0.09) 100%);
    border-color: rgba(59,130,246,0.3);
    transform: translateY(-1px);
    box-shadow: 0 3px 10px rgba(59,130,246,0.13);
  }
`;

const TagLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.78rem; font-weight: 600;
  color: #1e40af; letter-spacing: 0.01em;
`;

const TagRemBtn = styled.button`
  width: 16px; height: 16px; border-radius: 50%;
  background: rgba(59,130,246,0.1);
  border: none; color: #3b82f6;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; padding: 0; transition: all 0.18s; flex-shrink: 0;

  &:hover {
    background: rgba(239,68,68,0.14);
    color: #ef4444;
    transform: scale(1.2);
  }
`;

const EmptyState = styled.div`
  display: flex; flex-direction: column;
  align-items: center; gap: 0.45rem;
  padding: 1.25rem 0 0.25rem;
  width: 100%;
`;

const EmptyIcon = styled.div`
  width: 34px; height: 34px; border-radius: 10px;
  background: rgba(59,130,246,0.05);
  border: 1.5px dashed rgba(59,130,246,0.18);
  display: flex; align-items: center; justify-content: center;
  color: rgba(59,130,246,0.3);
`;

const EmptyText = styled.p`
  font-size: 0.76rem; color: var(--text-muted); margin: 0;
`;

/* ── Empty Page State ────────────────────────────────────────── */
const EmptyPage = styled.div`
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 1rem;
  padding: 4rem 2rem;
  text-align: center;
`;

const EmptyPageIcon = styled.div`
  width: 64px; height: 64px; border-radius: 20px;
  background: rgba(59,130,246,0.07);
  border: 2px dashed rgba(59,130,246,0.22);
  display: flex; align-items: center; justify-content: center;
  color: rgba(59,130,246,0.35);
`;

const EmptyPageTitle = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem; font-weight: 700;
  color: var(--text-primary); margin: 0;
`;

const EmptyPageSub = styled.p`
  font-size: 0.82rem; color: var(--text-muted); margin: 0;
`;
const BottomRow = styled.div`
  display: flex; justify-content: flex-end;
  margin-top: 1.25rem; padding-top: 1.5rem;
  border-top: 1px solid var(--border);
`;

/* ── Confirm Modal ───────────────────────────────────────────── */
const ConfirmBody = styled.div`
  display: flex; flex-direction: column;
  align-items: center; text-align: center;
  gap: 1.2rem; padding: 0.25rem 0;
`;

const ConfirmEmoji = styled.div`
  width: 56px; height: 56px; border-radius: 16px;
  background: rgba(239,68,68,0.08);
  border: 1.5px solid rgba(239,68,68,0.18);
  display: flex; align-items: center; justify-content: center;
  font-size: 1.6rem;
`;

const ConfirmMsg = styled.p`
  font-size: 0.87rem; color: var(--text-muted);
  margin: 0; line-height: 1.65; max-width: 290px;
`;

const Bold = styled.span`
  font-weight: 700; color: var(--text-primary);
`;

const ConfirmBtns = styled.div`
  display: flex; gap: 0.75rem; width: 100%;
`;

const CancelBtn = styled.button`
  flex: 1; padding: 0.72rem;
  background: rgba(59,130,246,0.05);
  border: 1.5px solid rgba(59,130,246,0.14);
  border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.85rem;
  color: var(--text-muted); cursor: pointer; transition: all 0.2s;
  &:hover { background: rgba(59,130,246,0.09); color: #3b82f6; border-color: rgba(59,130,246,0.28); }
`;

const DangerBtn = styled.button`
  flex: 1; padding: 0.72rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none; border-radius: 12px;
  font-family: 'DM Sans', sans-serif;
  font-weight: 700; font-size: 0.85rem;
  color: #fff; cursor: pointer; transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(239,68,68,0.22);
  &:hover { transform: translateY(-1px); box-shadow: 0 8px 20px rgba(239,68,68,0.36); }
`;

/* ═══════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════ */
const SkillsPage = () => {
  const [skills,        setSkills]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [newCat,        setNewCat]        = useState('');
  const [newSkillInput, setNewSkillInput] = useState({});

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: null,       // 'skill' | 'category'
    catName: null,
    skillIdx: null,
    label: '',
  });

  /* ── Load ── */
  useEffect(() => {
    portfolioService.getSkills()
      .then(({ data }) => {
        // Backend now always returns { skills: [...] }
        // Use whatever the DB has — even if it's an empty array
        setSkills(data?.skills ?? []);
      })
      .catch(() => toast.error('Failed to load skills'))
      .finally(() => setLoading(false));
  }, []);

  const totalSkills = skills.reduce((acc, s) => acc + (s.items?.length || 0), 0);

  /* ── Category ── */
  const addCategory = () => {
    const name = newCat.trim();
    if (!name) return;
    if (skills.some(s => s.category === name)) { toast.error('Category already exists'); return; }
    setSkills(prev => [...prev, { category: name, items: [] }]);
    setNewCat('');
  };

  const confirmDeleteCategory = (catName) => {
    setConfirmModal({ open: true, type: 'category', catName, skillIdx: null, label: catName });
  };

  /* ── Skills ── */
  const addSkill = (catName) => {
    const input = newSkillInput[catName]?.trim();
    if (!input) return;
    setSkills(prev =>
      prev.map(s => s.category === catName ? { ...s, items: [...s.items, input] } : s)
    );
    setNewSkillInput(prev => ({ ...prev, [catName]: '' }));
  };

  const confirmDeleteSkill = (catName, idx) => {
    // No confirmation for individual skills — delete instantly
    setSkills(prev =>
      prev.map(s =>
        s.category === catName
          ? { ...s, items: s.items.filter((_, i) => i !== idx) }
          : s
      )
    );
  };

  /* ── Confirmed delete ── */
  const handleConfirmDelete = () => {
    const { type, catName, skillIdx } = confirmModal;
    if (type === 'category') {
      setSkills(prev => prev.filter(s => s.category !== catName));
      setNewSkillInput(prev => { const n = { ...prev }; delete n[catName]; return n; });
      toast.success(`"${catName}" removed`);
    } else {
      setSkills(prev =>
        prev.map(s =>
          s.category === catName
            ? { ...s, items: s.items.filter((_, i) => i !== skillIdx) }
            : s
        )
      );
    }
    closeConfirm();
  };

  const closeConfirm = () =>
    setConfirmModal({ open: false, type: null, catName: null, skillIdx: null, label: '' });

  const onKey = (fn) => (e) => { if (e.key === 'Enter') { e.preventDefault(); fn(); } };

  /* ── Save ── */
  const save = async () => {
    try {
      setSaving(true);
      await portfolioService.updateSkills({ skills });
      toast.success('Skills saved!');
    } catch { toast.error('Save failed'); }
    finally { setSaving(false); }
  };

  /* ── Render ── */
  return (
    <Page>

      {/* Hero */}
      <HeroBar>
        <HeroLeft>
          <IconBox><Cpu size={24} /></IconBox>
          <div>
            <PageTitle>Skills</PageTitle>
            <PageSub>
              Organize your expertise by category
              <TotalBadge><Sparkles size={10} />{totalSkills} skills</TotalBadge>
            </PageSub>
          </div>
        </HeroLeft>
        <SaveBtn onClick={save} disabled={saving}>
          <Save size={15} />
          {saving ? 'Saving…' : 'Save Skills'}
        </SaveBtn>
      </HeroBar>

      {/* Add Category */}
      <AddCatSection>
        <CatLabel><Tag size={10} />Add New Category</CatLabel>
        <CatInputRow>
          <FInput
            placeholder="e.g. Languages"
            value={newCat}
            onChange={e => setNewCat(e.target.value)}
            onKeyDown={onKey(addCategory)}
          />
          <GreenBtn onClick={addCategory} disabled={!newCat.trim()}>
            <Plus size={14} /> Add Category
          </GreenBtn>
        </CatInputRow>
      </AddCatSection>

      {/* Category Grid — or empty state */}
      {loading ? null : skills.length === 0 ? (
        <EmptyPage>
          <EmptyPageIcon><Cpu size={28} /></EmptyPageIcon>
          <EmptyPageTitle>No skill categories yet</EmptyPageTitle>
          <EmptyPageSub>Add your first category above to get started</EmptyPageSub>
        </EmptyPage>
      ) : (
        <Grid>
        {skills.map(({ category, items }, i) => (
          <Section key={category} $i={i} $bar={BAR_GRADIENTS[i % BAR_GRADIENTS.length]}>

            <SecHead>
              <SecTitleWrap>
                <SecTitle title={category}>{category}</SecTitle>
                <CountBadge>{items.length}</CountBadge>
              </SecTitleWrap>
              <DeleteCatBtn onClick={() => confirmDeleteCategory(category)} title="Delete category">
                <Trash2 size={13} />
              </DeleteCatBtn>
            </SecHead>

            <InputRow>
              <SkillInput
                placeholder="e.g. Tamil, English…"
                value={newSkillInput[category] || ''}
                onChange={e => setNewSkillInput(prev => ({ ...prev, [category]: e.target.value }))}
                onKeyDown={onKey(() => addSkill(category))}
              />
              <AddSkillBtn onClick={() => addSkill(category)}>
                <Plus size={13} /> Add
              </AddSkillBtn>
            </InputRow>

            <TagCloud>
              {items.length > 0
                ? items.map((skill, idx) => (
                    <SkillTag key={`${skill}-${idx}`}>
                      <TagLabel>{skill}</TagLabel>
                      <TagRemBtn
                        onClick={() => confirmDeleteSkill(category, idx)}
                        title={`Remove "${skill}"`}
                        aria-label={`Remove ${skill}`}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
                        </svg>
                      </TagRemBtn>
                    </SkillTag>
                  ))
                : (
                  <EmptyState>
                    <EmptyIcon><Tag size={14} /></EmptyIcon>
                    <EmptyText>No skills yet — add one above</EmptyText>
                  </EmptyState>
                )
              }
            </TagCloud>

          </Section>
        ))}
        </Grid>
      )}

      <BottomRow>
        <SaveBtn onClick={save} disabled={saving} style={{ padding:'0.82rem 2.25rem', fontSize:'0.92rem' }}>
          <Save size={16} /> {saving ? 'Saving…' : 'Save All Skills'}
        </SaveBtn>
      </BottomRow>

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={confirmModal.open}
        onClose={closeConfirm}
        title={confirmModal.type === 'category' ? 'Delete Category' : 'Remove Skill'}
        size="sm"
      >
        <ConfirmBody>
          <ConfirmEmoji>
            {confirmModal.type === 'category' ? '🗂️' : '🏷️'}
          </ConfirmEmoji>

          <ConfirmMsg>
            {confirmModal.type === 'category' ? (
              <>
                Delete the <Bold>"{confirmModal.label}"</Bold> category and{' '}
                all its skills? This action cannot be undone.
              </>
            ) : (
              <>
                Remove <Bold>"{confirmModal.label}"</Bold> from{' '}
                <Bold>{confirmModal.catName}</Bold>?
              </>
            )}
          </ConfirmMsg>

          <ConfirmBtns>
            <CancelBtn onClick={closeConfirm}>Cancel</CancelBtn>
            <DangerBtn onClick={handleConfirmDelete}>
              {confirmModal.type === 'category' ? 'Delete' : 'Remove'}
            </DangerBtn>
          </ConfirmBtns>
        </ConfirmBody>
      </Modal>

    </Page>
  );
};

export default SkillsPage;