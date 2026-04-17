// src/pages/portfolio/ProfilePage.jsx
import { useState, useEffect, useRef } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  User,
  Camera,
  Save,
  MapPin,
  Phone,
  Mail,
  Globe,
  Linkedin,
  Github,
  Twitter,
  FileText,
  Briefcase,
  Hash,
  AlertCircle,
  Plus,
  Trash2,
  Link2,
  AtSign,
  Youtube,
  Instagram,
  Twitch,
  Code2,
  Trophy,
  MessageCircle,
  Send,
  Rss,
  ExternalLink,
} from "lucide-react";
import { portfolioService } from "../../services/portfolioService";
import { resumeService } from "../../services/resumeService";
import toast from "react-hot-toast";

/* ── Animations ─────────────────────────────────────────────── */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;
const rowSlideIn = keyframes`
  from { opacity: 0; transform: translateX(-12px); }
  to   { opacity: 1; transform: translateX(0); }
`;
const popIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(-6px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`;
const pulse = keyframes`
  0%,100% { box-shadow: 0 0 0 0 rgba(0,212,255,0.3); }
  50%      { box-shadow: 0 0 0 6px rgba(0,212,255,0); }
`;

/* ══════════════════════════════════════════════════════════════
   ICON MAP — brand color + display label + url prefix
   urlPrefix: shown as read-only chip before the username input.
              '' means user types full URL themselves.
══════════════════════════════════════════════════════════════ */
const ICON_MAP = {
  Github: {
    icon: Github,
    color: "#24292F",
    label: "GitHub",
    urlPrefix: "https://github.com/",
  },
  Linkedin: {
    icon: Linkedin,
    color: "#0A66C2",
    label: "LinkedIn",
    urlPrefix: "https://linkedin.com/in/",
  },
  Twitter: {
    icon: Twitter,
    color: "#000000",
    label: "Twitter / X",
    urlPrefix: "https://x.com/",
  },
  Instagram: {
    icon: Instagram,
    color: "#E1306C",
    label: "Instagram",
    urlPrefix: "https://instagram.com/",
  },
  Youtube: {
    icon: Youtube,
    color: "#FF0000",
    label: "YouTube",
    urlPrefix: "https://youtube.com/@",
  },
  Code2: {
    icon: Code2,
    color: "#FFA116",
    label: "LeetCode",
    urlPrefix: "https://leetcode.com/u/",
  },
  Trophy: {
    icon: Trophy,
    color: "#1F8ACB",
    label: "Codeforces",
    urlPrefix: "https://codeforces.com/profile/",
  },
  Twitch: {
    icon: Twitch,
    color: "#9146FF",
    label: "Twitch",
    urlPrefix: "https://twitch.tv/",
  },
  MessageCircle: {
    icon: MessageCircle,
    color: "#25D366",
    label: "WhatsApp",
    urlPrefix: "",
  },
  Send: {
    icon: Send,
    color: "#2CA5E0",
    label: "Telegram",
    urlPrefix: "https://t.me/",
  },
  Rss: { icon: Rss, color: "#F97316", label: "Blog / RSS", urlPrefix: "" },
  Globe: { icon: Globe, color: "#06B6D4", label: "Website", urlPrefix: "" },
  Mail: { icon: Mail, color: "#3B82F6", label: "Email", urlPrefix: "mailto:" },
  Phone: { icon: Phone, color: "#10B981", label: "Phone", urlPrefix: "" },
  AtSign: { icon: AtSign, color: "#EC4899", label: "Other", urlPrefix: "" },
  ExternalLink: {
    icon: ExternalLink,
    color: "#64748B",
    label: "Link",
    urlPrefix: "",
  },
};

/* ── Shell ───────────────────────────────────────────────────── */
const Page = styled.div`
  animation: ${fadeUp} 0.4s ease both;
  width: 100%;
`;
const PageHead = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  gap: 1rem;
  flex-wrap: wrap;
`;
const HeadLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
`;
const IconBox = styled.div`
  width: 54px;
  height: 54px;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.15),
    rgba(0, 119, 255, 0.12)
  );
  border: 1px solid rgba(0, 212, 255, 0.3);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  font-size: 1.4rem;
  box-shadow: 0 0 22px rgba(0, 212, 255, 0.14);
`;
const PageTitle = styled.h1`
  font-family: "DM Sans", sans-serif;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  line-height: 1;
  margin: 0 0 0.35rem;
`;
const PageSub = styled.p`
  font-size: 0.84rem;
  color: var(--text-muted);
  margin: 0;
`;
const SaveAllBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.72rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.25s ease;
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(0, 212, 255, 0.4);
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

/* ── Section card ────────────────────────────────────────────── */
const SCard = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 20px;
  margin-bottom: 1.5rem;
  overflow: visible;
  animation: ${fadeUp} 0.4s ease both;
  animation-delay: ${({ $i }) => ($i || 0) * 0.1}s;
  position: relative;
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    border-radius: 20px 20px 0 0;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 212, 255, 0.4),
      transparent
    );
  }
`;
const SCardHead = styled.div`
  padding: 1.35rem 1.75rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;
const SCardHeadIcon = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: ${({ $bg }) => $bg || "rgba(0,212,255,0.1)"};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $c }) => $c || "var(--accent)"};
`;
const SCardTitle = styled.h3`
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  flex: 1;
`;
const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.95rem;
  background: rgba(59, 130, 246, 0.12);
  border: 1px solid rgba(59, 130, 246, 0.28);
  border-radius: 8px;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: #60a5fa;
  transition: all 0.2s;
  &:hover {
    background: rgba(59, 130, 246, 0.22);
    border-color: rgba(59, 130, 246, 0.5);
    color: #93c5fd;
    transform: translateY(-1px);
  }
`;
const SCardBody = styled.div`
  padding: 1.75rem;
`;

/* ── Form grid ───────────────────────────────────────────────── */
const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;
const FieldWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.38rem;
  ${({ $full }) => $full && "grid-column: 1 / -1;"}
  position: relative;
`;
const FLabel = styled.label`
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  svg {
    color: var(--accent);
  }
`;
const FInput = styled.input`
  width: 100%;
  padding: 0.72rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.88rem;
  color: var(--text-primary);
  transition: all 0.22s ease;
  box-sizing: border-box;
  &::placeholder {
    color: var(--text-muted);
  }
  &:hover {
    border-color: rgba(0, 212, 255, 0.22);
    background: rgba(255, 255, 255, 0.05);
  }
  &:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(0, 212, 255, 0.04);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;
const FTextarea = styled.textarea`
  width: 100%;
  padding: 0.72rem 1rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 10px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.88rem;
  color: var(--text-primary);
  transition: all 0.22s ease;
  resize: vertical;
  min-height: 100px;
  &::placeholder {
    color: var(--text-muted);
  }
  &:hover {
    border-color: rgba(0, 212, 255, 0.22);
  }
  &:focus {
    outline: none;
    border-color: var(--accent);
    background: rgba(0, 212, 255, 0.04);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

/* ── Photo upload ────────────────────────────────────────────── */
const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1.75rem;
  flex-wrap: wrap;
`;
const AvatarWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;
const AvatarBox = styled.div`
  width: 108px;
  height: 108px;
  border-radius: 22px;
  overflow: hidden;
  background: linear-gradient(
    135deg,
    rgba(0, 212, 255, 0.1),
    rgba(0, 119, 255, 0.1)
  );
  border: 2px solid var(--border);
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
`;
const AvatarPlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-muted);
  font-size: 0.7rem;
  text-align: center;
`;
const UploadHoverLayer = styled.label`
  position: absolute;
  inset: 0;
  border-radius: 20px;
  background: rgba(0, 212, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
  ${AvatarWrap}:hover & {
    opacity: 1;
  }
`;
const UploadZone = styled.label`
  flex: 1;
  min-height: 78px;
  border: 1.5px dashed rgba(0, 212, 255, 0.22);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  cursor: pointer;
  color: var(--text-muted);
  font-size: 0.82rem;
  transition: all 0.22s;
  &:hover {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent);
  }
`;

/* ── CV link hint ────────────────────────────────────────────── */
const CvHint = styled.small`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: 0.35rem;
  font-size: 0.72rem;
  font-family: "DM Sans", sans-serif;
  color: var(--text-muted);
  line-height: 1.4;
  svg {
    flex-shrink: 0;
    color: var(--accent);
  }
  strong {
    color: var(--text-primary);
    font-weight: 600;
  }
`;

/* ── Dynamic Social Row ──────────────────────────────────────── */
const DynRow = styled.div`
  display: grid;
  grid-template-columns: auto 150px 1fr auto;
  gap: 0.75rem;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid var(--border);
  transition:
    border-color 0.2s,
    background 0.2s;
  animation: ${rowSlideIn} 0.22s ease both;
  &:hover {
    border-color: rgba(0, 212, 255, 0.18);
    background: rgba(0, 212, 255, 0.03);
  }
  @media (max-width: 680px) {
    grid-template-columns: auto 1fr auto;
    grid-template-rows: auto auto;
    & > :nth-child(2) {
      grid-column: 2;
    }
    & > :nth-child(3) {
      grid-column: 1 / -1;
    }
  }
`;
const PlatformBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0 0.85rem;
  height: 36px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 8px;
  font-family: "DM Sans", sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: ${({ $color }) => $color || "var(--text-muted)"};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: none;
`;
const LinkFieldWrap = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
  transition:
    border-color 0.18s,
    box-shadow 0.18s;
  &:focus-within {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;
const LinkPrefix = styled.span`
  display: flex;
  align-items: center;
  padding: 0 0.7rem;
  background: rgba(0, 212, 255, 0.06);
  border-right: 1px solid var(--border);
  font-family: "DM Sans", sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  user-select: none;
  line-height: 1;
`;
const UsernameInput = styled.input`
  flex: 1;
  padding: 0.6rem 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  border: none;
  outline: none;
  font-family: "DM Sans", sans-serif;
  font-size: 0.84rem;
  color: var(--text-primary);
  min-width: 0;
  &::placeholder {
    color: var(--text-muted);
  }
`;
const FullUrlInput = styled.input`
  width: 100%;
  padding: 0.6rem 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--border);
  border-radius: 8px;
  outline: none;
  font-family: "DM Sans", sans-serif;
  font-size: 0.84rem;
  color: var(--text-primary);
  box-sizing: border-box;
  transition: border-color 0.18s;
  &::placeholder {
    color: var(--text-muted);
  }
  &:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;
const DeleteBtn = styled.button`
  width: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 8px;
  cursor: pointer;
  color: #f87171;
  flex-shrink: 0;
  transition: all 0.18s;
  &:hover {
    background: rgba(239, 68, 68, 0.18);
    border-color: rgba(239, 68, 68, 0.4);
    color: #ef4444;
    transform: scale(1.05);
  }
`;
const EmptyHint = styled.p`
  text-align: center;
  color: var(--text-muted);
  font-size: 0.82rem;
  padding: 1.5rem 0 0.5rem;
  font-family: "DM Sans", sans-serif;
  opacity: 0.7;
`;
const RowsWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;
const ValidationHint = styled.small`
  color: ${({ $valid }) => ($valid ? "#10b981" : "#ef4444")};
  font-size: 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-top: 0.2rem;
  svg {
    width: 0.8rem;
    height: 0.8rem;
  }
`;

/* ── Custom Icon Picker ──────────────────────────────────────── */
const PickerWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;
const PickerTrigger = styled.button`
  width: 44px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 9px;
  border: 1.5px solid
    ${({ $open }) => ($open ? "var(--accent)" : "var(--border)")};
  background: ${({ $open }) =>
    $open ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.04)"};
  color: ${({ $color }) => $color || "var(--text-muted)"};
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.18s;
  ${({ $open }) =>
    $open &&
    css`
      animation: ${pulse} 1s ease infinite;
    `}
  &:hover {
    border-color: rgba(0, 212, 255, 0.35);
    background: rgba(0, 212, 255, 0.06);
  }
`;
const PickerDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;
  background: var(--bg-card, #1a1f2e);
  border: 1px solid rgba(0, 212, 255, 0.2);
  border-radius: 14px;
  padding: 0.75rem;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(0, 212, 255, 0.08);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.4rem;
  width: 200px;
  animation: ${popIn} 0.18s ease both;
`;
const PickerItem = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.5rem 0.3rem;
  border-radius: 9px;
  border: 1.5px solid
    ${({ $active }) => ($active ? "rgba(0,212,255,0.5)" : "transparent")};
  background: ${({ $active }) =>
    $active ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.03)"};
  color: ${({ $color }) => $color};
  cursor: pointer;
  transition: all 0.15s;
  &:hover {
    background: rgba(255, 255, 255, 0.07);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
  }
`;
const PickerLabel = styled.span`
  font-size: 0.56rem;
  font-weight: 600;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 44px;
  display: block;
  font-family: "DM Sans", sans-serif;
`;
const FootRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 0.5rem;
`;

/* ══════════════════════════════════════════════════════════════
   ICON PICKER COMPONENT
══════════════════════════════════════════════════════════════ */
const IconPicker = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  const meta = ICON_MAP[value] || Object.values(ICON_MAP)[0];
  const SelIcon = meta.icon;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <PickerWrap ref={ref}>
      <PickerTrigger
        type="button"
        $open={open}
        $color={meta.color}
        onClick={() => setOpen((o) => !o)}
        title={meta.label}
      >
        <SelIcon size={17} />
      </PickerTrigger>
      {open && (
        <PickerDropdown>
          {Object.entries(ICON_MAP).map(
            ([key, { icon: Icon, color, label }]) => (
              <PickerItem
                key={key}
                type="button"
                $active={value === key}
                $color={color}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                title={label}
              >
                <Icon size={18} />
                <PickerLabel>{label}</PickerLabel>
              </PickerItem>
            ),
          )}
        </PickerDropdown>
      )}
    </PickerWrap>
  );
};

/* ══════════════════════════════════════════════════════════════
   HELPER — strip url prefix from a stored full link
   so the username input only holds the handle/path part.
══════════════════════════════════════════════════════════════ */
const extractUsername = (iconKey, rawValue) => {
  if (!rawValue) return "";
  const meta = ICON_MAP[iconKey];
  if (meta?.urlPrefix && rawValue.startsWith(meta.urlPrefix)) {
    return rawValue.slice(meta.urlPrefix.length);
  }
  return rawValue;
};

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════ */
const ProfilePage = () => {
  const [form, setForm] = useState({
    name: "",
    age: "",
    domain: "",
    summary: "",
    location: "",
    phone: "",
    email: "",
    cvLink: "",
    profilePhoto: "",
  });
  const [social, setSocial] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const fileRef = useRef();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await portfolioService.getProfile();
      if (data) {
        setForm((p) => ({ ...p, ...data }));
        if (data.social) {
          setSocial(
            data.social.map((s) => {
              const iconKey = s.icon || "Globe";
              const rawValue = s.username ?? s.link ?? "";
              const username = extractUsername(iconKey, rawValue);
              return { ...s, icon: iconKey, username };
            }),
          );
        }
        if (data.profilePhotoUrl) setPhotoPreview(data.profilePhotoUrl);
        else if (data.profilePhoto?.startsWith("http"))
          setPhotoPreview(data.profilePhoto);
      }
    } catch (err) {
      console.error("Failed to load profile:", err);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: null }));
  };

  const validateUrl = (url) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  /* ── Social helpers ── */
  const addSocial = () =>
    setSocial((s) => [
      ...s,
      {
        id: Date.now(),
        icon: "Github",
        name: "GitHub",
        username: "",
        color: "#24292F",
      },
    ]);
  const removeSocial = (i) => setSocial((s) => s.filter((_, idx) => idx !== i));

  const handleIconChange = (idx, iconKey) => {
    const meta = ICON_MAP[iconKey];
    setSocial((s) => {
      const u = [...s];
      u[idx] = {
        ...u[idx],
        icon: iconKey,
        name: meta.label,
        color: meta.color,
        username: "",
      };
      return u;
    });
  };

  const updateUsername = (idx, val) =>
    setSocial((s) => {
      const u = [...s];
      u[idx] = { ...u[idx], username: val };
      return u;
    });

  const buildLink = (item) => {
    const meta = ICON_MAP[item.icon];
    if (!meta) return item.username || "";
    return meta.urlPrefix
      ? meta.urlPrefix + (item.username || "")
      : item.username || "";
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.cvLink && !validateUrl(form.cvLink))
      newErrors.cvLink = "Invalid URL";
    social.forEach((s, i) => {
      const meta = ICON_MAP[s.icon];
      if (!meta?.urlPrefix && s.username && !validateUrl(s.username))
        newErrors[`social_${i}`] = "Invalid URL";
    });
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      toast.error("Please fix validation errors");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...form,
        social: social.map((s) => ({ ...s, link: buildLink(s) })),
      };

      if (photoFile) {
        const fd = new FormData();
        fd.append("image", photoFile);
        const { data } = await portfolioService.uploadImage(fd);
        payload.profilePhoto = data.key;
      }

      await portfolioService.updateProfile(payload);
      await loadProfile();
      toast.success("Profile updated successfully!");
      setErrors({});
    } catch (err) {
      console.error("Save error:", err);
      toast.error(err.response?.data?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Page>
        <PageHead>
          <HeadLeft>
            <IconBox>
              <User size={22} />
            </IconBox>
            <div>
              <PageTitle>Loading…</PageTitle>
              <PageSub>Please wait</PageSub>
            </div>
          </HeadLeft>
        </PageHead>
      </Page>
    );
  }

  return (
    <Page>
      <PageHead>
        <HeadLeft>
          <IconBox>
            <User size={22} />
          </IconBox>
          <div>
            <PageTitle>Profile</PageTitle>
            <PageSub>Your personal information and contact details</PageSub>
          </div>
        </HeadLeft>
        <SaveAllBtn onClick={handleSave} disabled={saving}>
          <Save size={15} /> {saving ? "Saving…" : "Save Profile"}
        </SaveAllBtn>
      </PageHead>

      <form onSubmit={handleSave}>
        {/* ── Photo ── */}
        <SCard $i={0}>
          <SCardHead>
            <SCardHeadIcon $bg="rgba(0,212,255,0.1)" $c="var(--accent)">
              <Camera size={16} />
            </SCardHeadIcon>
            <SCardTitle>Profile Photo</SCardTitle>
          </SCardHead>
          <SCardBody>
            <PhotoRow>
              <AvatarWrap>
                <AvatarBox>
                  {photoPreview ? (
                    <img src={photoPreview} alt="Profile" />
                  ) : (
                    <AvatarPlaceholder>
                      <Camera
                        size={24}
                        style={{ color: "rgba(0,212,255,0.4)" }}
                      />
                      <span>No photo</span>
                    </AvatarPlaceholder>
                  )}
                </AvatarBox>
                <UploadHoverLayer htmlFor="avatar-file">
                  <Camera size={20} />
                </UploadHoverLayer>
                <input
                  id="avatar-file"
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhoto}
                  ref={fileRef}
                />
              </AvatarWrap>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: "0.84rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: "0.25rem",
                  }}
                >
                  Upload Profile Photo
                </div>
                <div
                  style={{
                    fontSize: "0.78rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.75rem",
                  }}
                >
                  PNG, JPG, GIF up to 10MB
                </div>
                <UploadZone htmlFor="avatar-file">
                  <Camera size={17} />
                  <span>Click to upload or drag &amp; drop</span>
                </UploadZone>
              </div>
            </PhotoRow>
          </SCardBody>
        </SCard>

        {/* ── Personal Info ── */}
        <SCard $i={1}>
          <SCardHead>
            <SCardHeadIcon $bg="rgba(245,197,66,0.1)" $c="var(--gold, #FBBF24)">
              <User size={16} />
            </SCardHeadIcon>
            <SCardTitle>Personal Information</SCardTitle>
          </SCardHead>
          <SCardBody>
            <Grid2>
              <FieldWrap>
                <FLabel>
                  <Hash size={12} /> Full Name
                </FLabel>
                <FInput
                  placeholder="e.g. Alex Johnson"
                  value={form.name}
                  onChange={set("name")}
                />
              </FieldWrap>
              <FieldWrap>
                <FLabel>
                  <Hash size={12} /> Age
                </FLabel>
                <FInput
                  type="number"
                  placeholder="e.g. 25"
                  value={form.age}
                  onChange={set("age")}
                />
              </FieldWrap>
              <FieldWrap>
                <FLabel>
                  <Briefcase size={12} /> Domain / Role
                </FLabel>
                <FInput
                  placeholder="e.g. Full Stack Developer"
                  value={form.domain}
                  onChange={set("domain")}
                />
              </FieldWrap>
              <FieldWrap>
                <FLabel>
                  <MapPin size={12} /> Location
                </FLabel>
                <FInput
                  placeholder="e.g. Bangalore, India"
                  value={form.location}
                  onChange={set("location")}
                />
              </FieldWrap>
              <FieldWrap>
                <FLabel>
                  <Phone size={12} /> Phone
                </FLabel>
                <FInput
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={form.phone}
                  onChange={set("phone")}
                />
              </FieldWrap>
              <FieldWrap>
                <FLabel>
                  <Mail size={12} /> Email
                </FLabel>
                <FInput
                  type="email"
                  placeholder="e.g. alex@email.com"
                  value={form.email}
                  onChange={set("email")}
                />
              </FieldWrap>
              <FieldWrap $full>
                <FLabel>Bio / Summary</FLabel>
                <FTextarea
                  rows={4}
                  placeholder="Write a short bio about yourself…"
                  value={form.summary}
                  onChange={set("summary")}
                />
              </FieldWrap>

              {/* ── CV / Resume ── */}
              <FieldWrap $full>
                <FLabel>
                  <FileText size={12} /> CV / Resume
                </FLabel>

                <FInput
                  placeholder="Paste a link (e.g. https://drive.google.com/…)"
                  value={form.cvLink}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, cvLink: e.target.value }));
                    if (errors.cvLink)
                      setErrors((p) => ({ ...p, cvLink: null }));
                  }}
                  onBlur={() => {
                    if (form.cvLink && !validateUrl(form.cvLink))
                      setErrors((p) => ({ ...p, cvLink: "Invalid URL" }));
                  }}
                />

                {errors.cvLink ? (
                  <ValidationHint $valid={false}>
                    <AlertCircle size={12} /> {errors.cvLink}
                  </ValidationHint>
                ) : (
                  <CvHint>
                    <FileText size={11} />
                    You can upload your resume in the{" "}
                    <strong>Vault</strong>, get the public link, and paste it
                    here.
                  </CvHint>
                )}

                {form.cvLink && validateUrl(form.cvLink) && (
                  <ValidationHint $valid={true}>
                    ✓ Current CV link saved
                  </ValidationHint>
                )}
              </FieldWrap>
            </Grid2>
          </SCardBody>
        </SCard>

        {/* ── Social Links ── */}
        <SCard $i={2}>
          <SCardHead>
            <SCardHeadIcon $bg="rgba(167,139,250,0.1)" $c="#A78BFA">
              <Link2 size={16} />
            </SCardHeadIcon>
            <SCardTitle>Social Links</SCardTitle>
            <AddBtn type="button" onClick={addSocial}>
              <Plus size={13} /> Add
            </AddBtn>
          </SCardHead>
          <SCardBody>
            {social.length === 0 ? (
              <EmptyHint>
                No social links yet — click <strong>Add</strong> to get started.
              </EmptyHint>
            ) : (
              <RowsWrap>
                {social.map((item, idx) => {
                  const meta = ICON_MAP[item.icon] || ICON_MAP.Globe;
                  const hasPrefix = !!meta.urlPrefix;

                  return (
                    <DynRow key={item.id}>
                      {/* ① Icon picker */}
                      <IconPicker
                        value={item.icon}
                        onChange={(val) => handleIconChange(idx, val)}
                      />

                      {/* ② Auto-filled platform name (read-only badge) */}
                      <PlatformBadge $color={meta.color}>
                        {item.name || meta.label}
                      </PlatformBadge>

                      {/* ③ Link input */}
                      <div>
                        {hasPrefix ? (
                          <LinkFieldWrap>
                            <LinkPrefix title={meta.urlPrefix}>
                              {meta.urlPrefix}
                            </LinkPrefix>
                            <UsernameInput
                              value={item.username || ""}
                              onChange={(e) =>
                                updateUsername(idx, e.target.value)
                              }
                              placeholder="your_username"
                            />
                          </LinkFieldWrap>
                        ) : (
                          <FullUrlInput
                            value={item.username || ""}
                            onChange={(e) =>
                              updateUsername(idx, e.target.value)
                            }
                            placeholder="https://yoursite.com"
                          />
                        )}
                        {errors[`social_${idx}`] && (
                          <ValidationHint $valid={false}>
                            <AlertCircle size={12} /> {errors[`social_${idx}`]}
                          </ValidationHint>
                        )}
                      </div>

                      {/* ④ Delete */}
                      <DeleteBtn
                        type="button"
                        onClick={() => removeSocial(idx)}
                      >
                        <Trash2 size={14} />
                      </DeleteBtn>
                    </DynRow>
                  );
                })}
              </RowsWrap>
            )}
          </SCardBody>
        </SCard>

        <FootRow>
          <SaveAllBtn
            type="submit"
            disabled={saving}
            style={{ padding: "0.82rem 2rem", fontSize: "0.92rem" }}
          >
            <Save size={16} /> {saving ? "Saving…" : "Save Profile"}
          </SaveAllBtn>
        </FootRow>
      </form>
    </Page>
  );
};

export default ProfilePage;