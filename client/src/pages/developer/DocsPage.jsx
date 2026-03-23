import styled from 'styled-components'
import { Code2 } from 'lucide-react'

// ── Styled ──────────────────────────────────────────────────────────────────
const PageWrap = styled.div`
  max-width: 860px;
`

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 0.5rem;
`

const IconBox = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
  color: white;
  border-radius: 0.625rem;

  svg { width: 1.25rem; height: 1.25rem; }
`

const PageTitle = styled.h1`
  font-size: 1.625rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0;
`

const PageDesc = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  margin: 0 0 2rem 0;
`

const BaseUrl = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  font-size: 0.85rem;
  color: #334155;

  code {
    font-family: 'Courier New', monospace;
    color: #1e40af;
    font-weight: 600;
  }
`

const SectionBlock = styled.section`
  margin-bottom: 2.5rem;
`

const SectionTitle = styled.h2`
  font-size: 1.05rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`

const EndpointCard = styled.div`
  background: white;
  border: 1px solid rgba(59, 130, 246, 0.12);
  border-radius: 10px;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
`

const EndpointTop = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.35rem;
`

const MethodBadge = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 5px;
  background: ${({ $m }) =>
    $m === 'GET'    ? '#dcfce7' :
    $m === 'POST'   ? '#dbeafe' :
    $m === 'PUT'    ? '#fef9c3' :
    $m === 'DELETE' ? '#fee2e2' : '#f1f5f9'};
  color: ${({ $m }) =>
    $m === 'GET'    ? '#15803d' :
    $m === 'POST'   ? '#1e40af' :
    $m === 'PUT'    ? '#92400e' :
    $m === 'DELETE' ? '#b91c1c' : '#475569'};
`

const EndpointPath = styled.span`
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
  color: #374151;
`

const EndpointDesc = styled.p`
  font-size: 0.83rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
`

const CodeLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 600;
  color: #94a3b8;
  margin: 0.5rem 0 0.25rem 0;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`

const Pre = styled.pre`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 7px;
  padding: 0.75rem 1rem;
  font-size: 0.78rem;
  overflow-x: auto;
  color: #334155;
  margin: 0;
  font-family: 'Courier New', monospace;
`

// ── Sub-components ──────────────────────────────────────────────────────────
const Endpoint = ({ method, path, description, request, response }) => (
  <EndpointCard>
    <EndpointTop>
      <MethodBadge $m={method}>{method}</MethodBadge>
      <EndpointPath>{path}</EndpointPath>
    </EndpointTop>
    <EndpointDesc>{description}</EndpointDesc>
    {request && (
      <>
        <CodeLabel>Request body</CodeLabel>
        <Pre>{request}</Pre>
      </>
    )}
    {response && (
      <>
        <CodeLabel>Response</CodeLabel>
        <Pre>{response}</Pre>
      </>
    )}
  </EndpointCard>
)

const Section = ({ title, children }) => (
  <SectionBlock>
    <SectionTitle>{title}</SectionTitle>
    {children}
  </SectionBlock>
)

// ── Page ────────────────────────────────────────────────────────────────────
const DocsPage = () => (
  <PageWrap>
    <PageHeader>
      <IconBox><Code2 /></IconBox>
      <PageTitle>API Documentation</PageTitle>
    </PageHeader>
    <PageDesc>Explore all available endpoints for your PersonalDB instance.</PageDesc>

    <BaseUrl>
      Base URL: <code>{import.meta.env.VITE_API_URL}</code>
    </BaseUrl>

    <Section title="Authentication">
      <Endpoint method="POST" path="/vault/auth/register" description="Create a new account"
        request={`{ "username": "johndoe", "password": "secret", "birthYear": 1990, "placeAnswer": "New York", "friendAnswer": "Alice" }`}
        response={`{ "_id": "...", "username": "johndoe" }`}
      />
      <Endpoint method="POST" path="/vault/auth/login" description="Login with username and password"
        request={`{ "username": "johndoe", "password": "secret" }`}
        response={`{ "_id": "...", "username": "johndoe" }`}
      />
      <Endpoint method="POST" path="/vault/auth/logout" description="Logout current session" />
      <Endpoint method="GET"  path="/vault/auth/me"     description="Get current authenticated user" />
      <Endpoint method="POST" path="/vault/auth/verify-security" description="Verify security answers for password reset"
        request={`{ "username": "johndoe", "birthYear": 1990, "placeAnswer": "New York", "friendAnswer": "Alice" }`}
      />
      <Endpoint method="POST" path="/vault/auth/reset-password" description="Reset password after security verification"
        request={`{ "username": "johndoe", "newPassword": "newSecret" }`}
      />
    </Section>

    <Section title="Vault Items">
      <Endpoint method="GET"    path="/vault/items"              description="Get all items for the authenticated user" />
      <Endpoint method="POST"   path="/vault/items"              description="Create a new item"
        request={`{ "type": "note", "title": "Meeting notes", "content": "...", "hasPassword": false }`}
      />
      <Endpoint method="GET"    path="/vault/items/:id"          description="Get a single item by ID" />
      <Endpoint method="PUT"    path="/vault/items/:id"          description="Update an item"
        request={`{ "title": "Updated title", "content": "..." }`}
      />
      <Endpoint method="DELETE" path="/vault/items/:id"          description="Move item to trash" />
      <Endpoint method="POST"   path="/vault/items/:id/verify"   description="Verify item password"
        request={`{ "password": "itemPassword" }`}
      />
      <Endpoint method="GET"    path="/vault/items/trash"        description="Get all trashed items" />
      <Endpoint method="PUT"    path="/vault/items/:id/restore"  description="Restore item from trash" />
      <Endpoint method="DELETE" path="/vault/items/:id/permanent" description="Permanently delete an item" />
      <Endpoint method="DELETE" path="/vault/items/trash/empty"  description="Empty all trash" />
    </Section>

    <Section title="Public Files (Resume)">
      <Endpoint method="GET"    path="/vault/resume"         description="Get all public files" />
      <Endpoint method="POST"   path="/vault/resume/upload"  description="Upload a file (multipart/form-data)" />
      <Endpoint method="DELETE" path="/vault/resume/:id"     description="Delete a public file" />
    </Section>

    <Section title="Portfolio – Profile">
      <Endpoint method="GET" path="/portfolio/profile" description="Get portfolio profile" />
      <Endpoint method="PUT" path="/portfolio/profile"  description="Update portfolio profile"
        request={`{ "name": "John Doe", "title": "Developer", "bio": "...", "email": "...", "github": "..." }`}
      />
    </Section>

    <Section title="Portfolio – Education / Experience / Projects / Certifications">
      {['education', 'experience', 'projects', 'certifications'].map(s => (
        <div key={s} style={{ marginBottom: '0.5rem' }}>
          <Endpoint method="GET"    path={`/portfolio/${s}`}     description={`Get all ${s}`} />
          <Endpoint method="POST"   path={`/portfolio/${s}`}     description={`Create a ${s.slice(0, -1)} entry`} />
          <Endpoint method="PUT"    path={`/portfolio/${s}/:id`} description={`Update a ${s.slice(0, -1)} entry`} />
          <Endpoint method="DELETE" path={`/portfolio/${s}/:id`} description={`Delete a ${s.slice(0, -1)} entry`} />
        </div>
      ))}
    </Section>

    <Section title="Portfolio – Skills & Interests">
      <Endpoint method="GET" path="/portfolio/skills"     description="Get skills object" />
      <Endpoint method="PUT" path="/portfolio/skills"     description="Update skills"
        request={`{ "Languages": ["JavaScript", "Python"], "Frameworks": ["React"] }`}
      />
      <Endpoint method="GET" path="/portfolio/interests"  description="Get interests array" />
      <Endpoint method="PUT" path="/portfolio/interests"  description="Update interests"
        request={`["Reading", "Hiking", "Gaming"]`}
      />
    </Section>
  </PageWrap>
)

export default DocsPage