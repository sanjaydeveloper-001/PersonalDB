import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Loader, AlertCircle } from 'lucide-react';

// ---------- Styled Components ----------
const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  color: #64748b;
  gap: 0.75rem;
  svg {
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
`;

const ErrorBox = styled.div`
  background: white;
  border: 2px solid #fee2e2;
  border-radius: 0.875rem;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  text-align: center;
`;

const ErrorTitle = styled.h2`
  color: #dc2626;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  svg { width: 24px; height: 24px; }
`;

const ErrorMessage = styled.p`
  color: #64748b;
  margin-bottom: 1.5rem;
`;

const BackButton = styled.button`
  padding: 0.65rem 1.25rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.2s;
  &:hover { background: #1d4ed8; }
`;

const IframeContainer = styled.iframe`
  width: 100%;
  height: 100vh;
  border: none;
`;

// ---------- Helper ----------
function replacePortfolioData(html, userData) {
  const searchStr = 'const portfolioData = {';
  const startIdx = html.indexOf(searchStr);
  if (startIdx === -1) return html;

  let braceCount = 0;
  let i = startIdx + searchStr.length;
  while (i < html.length) {
    const ch = html[i];
    if (ch === '{') braceCount++;
    else if (ch === '}') {
      if (braceCount === 0) {
        let endIdx = i + 1;
        while (html[endIdx] === ';' || html[endIdx] === '\n' || html[endIdx] === ' ') endIdx++;
        const block = html.substring(startIdx, endIdx);
        return html.replace(block, `const portfolioData = ${JSON.stringify(userData)};`);
      } else {
        braceCount--;
      }
    }
    i++;
  }
  return html;
}

// ---------- Component ----------
// Route: /u/:portdomain
// Always looks up by portdomain field — no subdomain logic, no username fallback
const PublicProfilePage = () => {
  const { portdomain } = useParams()

  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [finalHtml, setFinalHtml] = useState(null)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
  const BASE_URL = API_URL.replace('/api', '')

  useEffect(() => {
    if (!portdomain) return

    const fetchAndMerge = async () => {
      try {
        setLoading(true)
        setError(null)

        // ── 1. Fetch portfolio data by portdomain ─────────────────────────────
        const userRes = await fetch(`${API_URL}/port/${portdomain}`)
        if (!userRes.ok) throw new Error('User not found')
        const userData = await userRes.json()

        // Fix relative image URLs
        if (userData.profile?.profilePhoto) {
          userData.profile.profilePhoto = userData.profile.profilePhoto.startsWith('http')
            ? userData.profile.profilePhoto
            : `${BASE_URL}/${userData.profile.profilePhoto}`
        }
        if (userData.profile?.cvLink) {
          userData.profile.cvLink = userData.profile.cvLink.startsWith('http')
            ? userData.profile.cvLink
            : `${BASE_URL}/${userData.profile.cvLink}`
        }
        if (userData.projects) {
          userData.projects = userData.projects.map(proj => ({
            ...proj,
            image: proj.image
              ? (proj.image.startsWith('http') ? proj.image : `${BASE_URL}/${proj.image}`)
              : null,
          }))
        }
        if (userData.certifications) {
          userData.certifications = userData.certifications.map(cert => ({
            ...cert,
            image: cert.image
              ? (cert.image.startsWith('http') ? cert.image : `${BASE_URL}/${cert.image}`)
              : null,
          }))
        }

        // ── 2. Fetch template HTML by portdomain ──────────────────────────────
        const templateRes = await fetch(`${API_URL}/templates/user/${portdomain}`)
        if (!templateRes.ok) throw new Error('Template not found')
        const templateData = await templateRes.json()
        if (!templateData.success) throw new Error('Invalid template response')

        // ── 3. Inject real data & render ──────────────────────────────────────
        setFinalHtml(replacePortfolioData(templateData.template.code, userData))

      } catch (err) {
        console.error('[PublicProfilePage]', err)
        setError(err.message || 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    fetchAndMerge()
  }, [portdomain])

  if (loading) {
    return (
      <Container>
        <LoadingContainer>
          <Loader />
          <span>Loading profile...</span>
        </LoadingContainer>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <ErrorContainer>
          <ErrorBox>
            <ErrorTitle><AlertCircle />{error}</ErrorTitle>
            <ErrorMessage>
              The profile you're looking for doesn't exist or is not available.
            </ErrorMessage>
            <BackButton onClick={() => window.history.back()}>Back to Home</BackButton>
          </ErrorBox>
        </ErrorContainer>
      </Container>
    )
  }

  return (
    <IframeContainer
      srcDoc={finalHtml}
      title={`${portdomain}'s portfolio`}
    />
  )
}

export default PublicProfilePage