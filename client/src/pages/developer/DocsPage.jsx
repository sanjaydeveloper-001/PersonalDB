import styled, { createGlobalStyle, keyframes } from 'styled-components'
import { Code2, Copy, ChevronDown, Zap, AlertTriangle, CheckCircle, Info, Globe } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

// ── Animations ───────────────────────────────────────────────────────────────
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
`

const shimmer = keyframes`
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
`

// ── Global ───────────────────────────────────────────────────────────────────
const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
`

// ── Layout ───────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 100%;
  font-family: 'Sora', sans-serif;
  animation: ${fadeUp} 0.5s ease both;
`

// ── Hero Header ───────────────────────────────────────────────────────────────
const Hero = styled.div`
  background: linear-gradient(135deg, #0f3b7f 0%, #1a5fc8 50%, #2e7bea 100%);
  border-radius: 20px;
  padding: 2.5rem 2.75rem;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 260px; height: 260px;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -80px; left: 40%;
    width: 340px; height: 340px;
    border-radius: 50%;
    background: rgba(255,255,255,0.04);
    pointer-events: none;
  }
`

const HeroTop = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
`

const HeroIcon = styled.div`
  width: 2.75rem; height: 2.75rem;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.25);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  backdrop-filter: blur(4px);
  svg { width: 1.4rem; height: 1.4rem; }
`

const HeroTitle = styled.h1`
  font-size: 1.85rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.02em;
`

const HeroDesc = styled.p`
  color: rgba(255,255,255,0.72);
  font-size: 0.95rem;
  margin: 0 0 1.5rem 0;
  line-height: 1.6;
  max-width: 560px;
`

const BaseUrlPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 10px;
  padding: 0.55rem 1.1rem;
  backdrop-filter: blur(8px);

  span:first-child {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 0.88rem;
    font-weight: 500;
    background: none;
    color: #ffffff;

    letter-spacing: 0.01em;
  }
`

// ── Sections ──────────────────────────────────────────────────────────────────
const SectionBlock = styled.div`
  margin-bottom: 3rem;
  animation: ${fadeUp} 0.5s ease both;
  animation-delay: 0.1s;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.875rem;
  border-bottom: 1.5px solid #dbeafe;
`

const SectionIcon = styled.div`
  width: 2rem; height: 2rem;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #1d4ed8;
  svg { width: 1rem; height: 1rem; }
`

const SectionTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
  letter-spacing: -0.01em;
`

const SectionDesc = styled.p`
  color: #4b6280;
  font-size: 0.9rem;
  line-height: 1.65;
  margin: -0.75rem 0 1.5rem 0;
`

// ── Endpoint Card ─────────────────────────────────────────────────────────────
const EndpointCard = styled.div`
  background: #fff;
  border: 1.5px solid #e0eaff;
  border-radius: 12px;
  margin-bottom: 1rem;
  overflow: hidden;
  transition: box-shadow 0.2s, border-color 0.2s;

  &:hover {
    border-color: #93c5fd;
    box-shadow: 0 6px 24px rgba(37, 99, 235, 0.09);
  }
`

const EndpointHead = styled.div`
  padding: 1.1rem 1.375rem;
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
`

const EndpointMeta = styled.div`
  flex: 1;
`

const EndpointRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.375rem;
`

const MethodBadge = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.28rem 0.6rem;
  border-radius: 6px;
  letter-spacing: 0.05em;
  background: ${({ $method }) =>
    $method === 'GET'    ? '#e0f2fe' :
    $method === 'POST'   ? '#dbeafe' :
    $method === 'PUT'    ? '#fef9c3' :
    $method === 'DELETE' ? '#fee2e2' : '#f1f5f9'};
  color: ${({ $method }) =>
    $method === 'GET'    ? '#0369a1' :
    $method === 'POST'   ? '#1d4ed8' :
    $method === 'PUT'    ? '#a16207' :
    $method === 'DELETE' ? '#b91c1c' : '#475569'};
  border: 1px solid ${({ $method }) =>
    $method === 'GET'    ? '#bae6fd' :
    $method === 'POST'   ? '#bfdbfe' :
    $method === 'PUT'    ? '#fde68a' :
    $method === 'DELETE' ? '#fecaca' : '#e2e8f0'};
`

const PathCode = styled.code`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.875rem;
  color: #1d4ed8;
  background: #f0f6ff;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
`

const EndpointTitle = styled.h4`
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 0.25rem 0;
`

const EndpointDesc = styled.p`
  font-size: 0.875rem;
  color: #6080a0;
  margin: 0;
  line-height: 1.5;
`

const ExpandBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  background: transparent;
  border: none;
  color: #2563eb;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.15s;

  &:hover { color: #1d4ed8; }

  svg {
    width: 0.9rem; height: 0.9rem;
    transition: transform 0.2s;
    transform: ${p => p.$open ? 'rotate(180deg)' : 'rotate(0)'};
  }
`

const ExpandContent = styled.div`
  display: ${p => p.$open ? 'block' : 'none'};
  padding: 0 1.375rem 1.25rem;
  border-top: 1px solid #e8f0fe;
  margin-top: 0;

  h5 {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #4b6280;
    margin: 1rem 0 0.5rem;
  }

  ul {
    margin: 0;
    padding-left: 1.25rem;
    color: #4b6280;
    font-size: 0.875rem;
    line-height: 1.9;
  }
`

// ── Code Block ────────────────────────────────────────────────────────────────
const CodeWrap = styled.div`
  position: relative;
  margin: 0.75rem 0;
`

const Pre = styled.pre`
  background: #0c1b3a;
  color: #cde4ff;
  padding: 1.1rem 1.25rem;
  padding-right: 4rem;
  border-radius: 10px;
  overflow-x: auto;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.8rem;
  line-height: 1.65;
  margin: 0;
  border: 1px solid rgba(255,255,255,0.06);

  .kw  { color: #7dd3fc; }
  .str { color: #86efac; }
  .num { color: #fbbf24; }
  .cm  { color: #64748b; }
`

const CopyBtn = styled.button`
  position: absolute;
  top: 0.6rem; right: 0.6rem;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.12);
  color: #94a3b8;
  padding: 0.3rem 0.6rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.72rem;
  display: flex; align-items: center; gap: 0.3rem;
  font-family: 'Sora', sans-serif;
  transition: all 0.15s;

  &:hover {
    background: rgba(255,255,255,0.13);
    color: #e2e8f0;
  }
`

// ── Alert / Info ──────────────────────────────────────────────────────────────
const Alert = styled.div`
  display: flex;
  gap: 0.875rem;
  background: ${p =>
    p.$type === 'warning' ? '#fffbeb' :
    p.$type === 'success'  ? '#f0fdf4' :
    p.$type === 'error'    ? '#fef2f2' : '#eff6ff'};
  border: 1px solid ${p =>
    p.$type === 'warning' ? '#fde68a' :
    p.$type === 'success'  ? '#bbf7d0' :
    p.$type === 'error'    ? '#fecaca' : '#bfdbfe'};
  border-radius: 10px;
  padding: 0.875rem 1rem;
  margin: 0.875rem 0;
  font-size: 0.875rem;
  line-height: 1.65;
  color: ${p =>
    p.$type === 'warning' ? '#92400e' :
    p.$type === 'success'  ? '#14532d' :
    p.$type === 'error'    ? '#991b1b' : '#1e3a8a'};

  svg { flex-shrink: 0; margin-top: 1px; width: 1rem; height: 1rem; opacity: 0.8; }

  strong { font-weight: 700; }
`

// ── Usage Box ─────────────────────────────────────────────────────────────────
const UsageBox = styled.div`
  background: #f0f6ff;
  border: 1px solid #c7dcff;
  border-radius: 10px;
  padding: 1rem 1.125rem;
  margin: 0.75rem 0;
`

const UsageLabel = styled.div`
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: #2563eb;
  margin-bottom: 0.625rem;
`

// ── Response Block ────────────────────────────────────────────────────────────
const ResponseBlock = styled.div`
  background: #f8fbff;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  padding: 1rem 1.125rem;
  margin: 0.75rem 0;
`

const ResponseLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 0.5rem;
  display: flex; align-items: center; gap: 0.375rem;
`

// ── Error Grid ────────────────────────────────────────────────────────────────
const ErrorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.875rem;
`

const ErrorCard = styled.div`
  background: #fff;
  border: 1.5px solid #e0eaff;
  border-radius: 10px;
  padding: 1rem 1.125rem;
  transition: box-shadow 0.2s;

  &:hover { box-shadow: 0 4px 16px rgba(37,99,235,0.08); }
`

const ErrorCode = styled.div`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: ${p =>
    p.$code >= 500 ? '#b91c1c' :
    p.$code >= 400 ? '#c2410c' : '#15803d'};
  background: ${p =>
    p.$code >= 500 ? '#fef2f2' :
    p.$code >= 400 ? '#fff7ed' : '#f0fdf4'};
  border: 1px solid ${p =>
    p.$code >= 500 ? '#fecaca' :
    p.$code >= 400 ? '#fed7aa' : '#bbf7d0'};
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  margin-bottom: 0.5rem;
`

const ErrorMsg = styled.div`
  font-size: 0.82rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.25rem;
`

const ErrorSnippet = styled.pre`
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  white-space: pre-wrap;
`

// ── Rate Limit Table ──────────────────────────────────────────────────────────
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
`

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1rem;
  background: #eff6ff;
  color: #1d4ed8;
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid #dbeafe;

  &:first-child { border-radius: 8px 0 0 8px; }
  &:last-child  { border-radius: 0 8px 8px 0; }
`

const Td = styled.td`
  padding: 0.75rem 1rem;
  border: 1px solid #e8f0fe;
  color: #334155;
  background: ${p => p.$alt ? '#fafcff' : '#fff'};
`

const Pill = styled.span`
  display: inline-block;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 0.72rem;
  font-weight: 700;
  font-family: 'JetBrains Mono', monospace;
  padding: 0.2rem 0.55rem;
  border-radius: 100px;
`

// ── Helper Components ─────────────────────────────────────────────────────────
const CopyCode = ({ code }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast.success('Copied!')
  }
  return (
    <CopyBtn onClick={handleCopy}>
      <Copy size={12} /> Copy
    </CopyBtn>
  )
}

const CodeBlock = ({ children, copyText }) => (
  <CodeWrap>
    <Pre>{children}</Pre>
    <CopyCode code={copyText || children} />
  </CodeWrap>
)

const Endpoint = ({ method, path, title, description, details }) => {
  const [open, setOpen] = useState(false)
  return (
    <EndpointCard>
      <EndpointHead>
        <EndpointMeta>
          <EndpointRow>
            <MethodBadge $method={method}>{method}</MethodBadge>
            <PathCode>{path}</PathCode>
          </EndpointRow>
          {title && <EndpointTitle>{title}</EndpointTitle>}
          <EndpointDesc>{description}</EndpointDesc>
          {details && (
            <ExpandBtn $open={open} onClick={() => setOpen(!open)}>
              <ChevronDown /> {open ? 'Hide Details' : 'Show Details'}
            </ExpandBtn>
          )}
        </EndpointMeta>
      </EndpointHead>
      {details && (
        <ExpandContent $open={open}>{details}</ExpandContent>
      )}
    </EndpointCard>
  )
}

const Section = ({ icon, title, description, children }) => (
  <SectionBlock>
    <SectionHeader>
      <SectionIcon>{icon}</SectionIcon>
      <SectionTitle>{title}</SectionTitle>
    </SectionHeader>
    {description && <SectionDesc>{description}</SectionDesc>}
    {children}
  </SectionBlock>
)

// ── Page ──────────────────────────────────────────────────────────────────────
const DocsPage = () => {
  const baseUrl = import.meta.env.VITE_API_URL || 'https://localhost:5000/api'

  return (
    <>
      <GlobalStyle />
      <PageWrap>

        {/* ── Hero ── */}
        <Hero>
          <HeroTop>
            <HeroIcon><Code2 /></HeroIcon>
            <HeroTitle>API Documentation</HeroTitle>
          </HeroTop>
          <HeroDesc>
            Complete reference for PersonalDB API endpoints, authentication, and integration examples.
          </HeroDesc>
          <BaseUrlPill>
            <span>Base URL :</span>
            <code>{baseUrl}</code>
          </BaseUrlPill>
        </Hero>

        {/* ── Portfolio API ── */}
        <Section
          icon={<Globe size={16} />}
          title="Portfolio API"
          description="Retrieve complete or section-specific portfolio data via API key. Ideal for embedding your portfolio in external sites or apps."
        >
          <Alert $type="info">
            <Info size={16} />
            <div>
              <strong>API Key Required</strong> — All portfolio endpoints authenticate via Bearer token: <code style={{ fontFamily: 'JetBrains Mono', background: '#dbeafe', padding: '0.1rem 0.35rem', borderRadius: 4 }}>Authorization: Bearer sk_your_key</code>
            </div>
          </Alert>

          <Endpoint
            method="GET"
            path="/getport"
            title="Get Complete Portfolio"
            description="Fetch all portfolio data — profile, education, experience, projects, skills, certifications, and interests — in a single request."
            details={
              <>
                <h5>Response Structure</h5>
                <ResponseBlock>
                  <ResponseLabel><CheckCircle size={13} /> 200 OK</ResponseLabel>
                  <CodeBlock copyText={`{ "user": {...}, "profile": {...}, "education": [...], "experience": [...], "projects": [...], "skills": {...}, "certifications": [...], "interests": {...} }`}>
{`{
  "user":           { "_id": "65a3b489eaf0f80f20dac035", "username": "johndoe" },
  "profile":        { "name": "John Doe", "domain": "Full Stack Developer",
                      "email": "john@example.com", "location": "San Francisco, CA",
                      "profilePhotoUrl": "https://s3-signed-url..." },
  "education":      [{ "school": "Stanford University", "degree": "BS",
                       "fieldOfStudy": "Computer Science",
                       "startDate": "2018-09-01", "endDate": "2022-05-31" }],
  "experience":     [{ "company": "Google", "role": "Senior Developer",
                       "duration": "2022 - Present", "description": "..." }],
  "projects":       [{ "title": "PersonalDB", "tech": ["React","Node.js","MongoDB"],
                       "demo": "https://...", "repo": "https://github.com/..." }],
  "skills":         { "skills": [{ "category": "Languages",
                                   "items": ["JavaScript","Python","Java"] }] },
  "certifications": [{ "name": "AWS Certified Solutions Architect",
                       "issuer": "Amazon Web Services" }],
  "interests":      { "interests": ["Web Development","AI/ML","DevOps"] }
}`}
                  </CodeBlock>
                </ResponseBlock>

                <h5>JavaScript</h5>
                <UsageBox>
                  <UsageLabel>Fetch Example</UsageLabel>
                  <CodeBlock>
{`const res = await fetch('${baseUrl}/getport', {
  headers: { 'Authorization': 'Bearer sk_your_api_key_here' }
})
const { profile, projects, skills } = await res.json()
console.log(profile.name, projects.length)`}
                  </CodeBlock>
                </UsageBox>

                <h5>cURL</h5>
                <UsageBox>
                  <UsageLabel>Terminal</UsageLabel>
                  <CodeBlock>
{`curl -X GET ${baseUrl}/getport \\
  -H "Authorization: Bearer sk_your_api_key_here"`}
                  </CodeBlock>
                </UsageBox>

                <h5>Python</h5>
                <UsageBox>
                  <UsageLabel>requests</UsageLabel>
                  <CodeBlock>
{`import requests

resp = requests.get(
    '${baseUrl}/getport',
    headers={'Authorization': 'Bearer sk_your_api_key_here'}
)
data = resp.json()
print(f"Portfolio: {data['user']['username']} — {len(data['projects'])} projects")`}
                  </CodeBlock>
                </UsageBox>
              </>
            }
          />

          <Endpoint
            method="GET"
            path="/getport/:section"
            title="Get Portfolio Section"
            description="Fetch a single section of the portfolio rather than the full payload."
            details={
              <>
                <h5>Available Sections</h5>
                <ul>
                  {['profile','education','experience','projects','skills','certifications','interests'].map(s => (
                    <li key={s}><code style={{ fontFamily: 'JetBrains Mono', background: '#eff6ff', padding: '0.15rem 0.4rem', borderRadius: 4, color: '#1d4ed8' }}>{s}</code></li>
                  ))}
                </ul>

                <h5>Examples</h5>
                <UsageBox>
                  <UsageLabel>Get Projects Only</UsageLabel>
                  <CodeBlock>
{`const res = await fetch('${baseUrl}/getport/projects', {
  headers: { 'Authorization': 'Bearer sk_...' }
})
const { data: projects } = await res.json()`}
                  </CodeBlock>
                </UsageBox>

                <UsageBox>
                  <UsageLabel>Get Skills via cURL</UsageLabel>
                  <CodeBlock>
{`curl -X GET ${baseUrl}/getport/skills \\
  -H "Authorization: Bearer sk_your_api_key_here"`}
                  </CodeBlock>
                </UsageBox>
              </>
            }
          />
        </Section>

        {/* ── Rate Limiting ── */}
        <Section
          icon={<Zap size={16} />}
          title="Rate Limiting"
          description="Requests are throttled per endpoint category to ensure fair usage across all users."
        >
          <Table>
            <thead>
              <tr>
                <Th>Endpoint Type</Th>
                <Th>Limit</Th>
                <Th>Window</Th>
                <Th>Scope</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td>Public endpoints</Td>
                <Td><Pill>100 req</Pill></Td>
                <Td>15 minutes</Td>
                <Td>Per IP</Td>
              </tr>
              <tr>
                <Td $alt>Authenticated endpoints</Td>
                <Td $alt><Pill>1000 req</Pill></Td>
                <Td $alt>1 hour</Td>
                <Td $alt>Per user</Td>
              </tr>
              <tr>
                <Td>Portfolio endpoints</Td>
                <Td><Pill>500 req</Pill></Td>
                <Td>1 hour</Td>
                <Td>Per API key</Td>
              </tr>
            </tbody>
          </Table>

          <Alert $type="warning" style={{ marginTop: '1rem' }}>
            <AlertTriangle size={16} />
            <div>When a rate limit is exceeded the API responds with <strong>429 Too Many Requests</strong>. Implement exponential back-off in your client.</div>
          </Alert>
        </Section>

        {/* ── Error Handling ── */}
        <Section
          icon={<AlertTriangle size={16} />}
          title="Error Handling"
          description="All errors follow a consistent JSON envelope. Use the HTTP status code to determine the error category."
        >
          <ErrorGrid>
            {[
              { code: 400, label: 'Bad Request',     msg: 'Key name is required' },
              { code: 401, label: 'Unauthorized',    msg: 'Invalid API key' },
              { code: 403, label: 'Forbidden',       msg: 'Maximum 10 API keys allowed' },
              { code: 404, label: 'Not Found',       msg: 'User not found' },
              { code: 429, label: 'Too Many Requests', msg: 'Rate limit exceeded' },
              { code: 500, label: 'Server Error',    msg: 'Internal server error' },
            ].map(({ code, label, msg }) => (
              <ErrorCard key={code}>
                <ErrorCode $code={code}>{code} {label}</ErrorCode>
                <ErrorMsg>{msg}</ErrorMsg>
                <ErrorSnippet>{`{ "message": "${msg}" }`}</ErrorSnippet>
              </ErrorCard>
            ))}
          </ErrorGrid>
        </Section>

        {/* ── Support ── */}
        <Section
          icon={<Info size={16} />}
          title="Support"
        >
          <Alert $type="info">
            <Info size={16} />
            <div>
              Need help? Visit the <strong>Developer → API Keys</strong> page to generate keys, monitor usage, and revoke credentials. For additional support, open a GitHub issue or contact the maintainer.
            </div>
          </Alert>
        </Section>

      </PageWrap>
    </>
  )
}

export default DocsPage