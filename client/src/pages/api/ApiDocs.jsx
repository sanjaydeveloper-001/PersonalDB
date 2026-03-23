import styled from 'styled-components';
import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  border-radius: 0.75rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const EndpointBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: ${props => {
    switch(props.method) {
      case 'GET': return '#dbeafe';
      case 'POST': return '#dcfce7';
      case 'DELETE': return '#fee2e2';
      default: return '#f3e8ff';
    }
  }};
  color: ${props => {
    switch(props.method) {
      case 'GET': return '#0369a1';
      case 'POST': return '#16a34a';
      case 'DELETE': return '#dc2626';
      default: return '#7e22ce';
    }
  }};
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 700;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  letter-spacing: 0.05em;
`;

const EndpointPath = styled.span`
  display: inline-block;
  background: #f8fafc;
  color: #0f172a;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  margin-left: 0.5rem;
  word-break: break-all;
`;

const Description = styled.p`
  color: #475569;
  line-height: 1.6;
  margin: 1rem 0;
  font-size: 0.95rem;
`;

const CodeBlock = styled.pre`
  background: #1e293b;
  color: #e2e8f0;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  position: relative;
  margin: 1rem 0;

  code {
    color: inherit;
  }
`;

const CopyButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: #334155;
  color: #e2e8f0;
  border: none;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  transition: all 0.3s;

  &:hover {
    background: #475569;
  }

  svg {
    width: 0.875rem;
    height: 0.875rem;
  }
`;

const ParamTable = styled.table`
  width: 100%;
  bordin-collapse: collapse;
  margin: 1rem 0;
  font-size: 0.9rem;

  th, td {
    padding: 0.75rem;
    text-align: left;
    border-bottom: 1px solid #e2e8f0;
  }

  th {
    background: #f8fafc;
    color: #0f172a;
    font-weight: 700;
    font-size: 0.875rem;
  }

  td {
    color: #475569;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;

const ResponseExample = styled.div`
  background: #f8fafc;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
`;

const ResponseLabel = styled.p`
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.5rem 0;
  font-size: 0.875rem;
`;

const NoteBox = styled.div`
  background: #f0f9ff;
  border-left: 4px solid #0891b2;
  padding: 1rem;
  border-radius: 0.375rem;
  margin: 1rem 0;
  color: #0c4a6e;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Endpoint = ({ method, path, title, description, params, example, response, notes }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Section>
      <div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
            <EndpointBadge method={method}>{method}</EndpointBadge>
            <EndpointPath>{path}</EndpointPath>
          </div>
          <SectionTitle style={{ marginTop: '0.75rem' }}>{title}</SectionTitle>
        </div>
        <Description>{description}</Description>

        {params && params.length > 0 && (
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: '700', marginTop: '1rem', marginBottom: '0.5rem' }}>Parameters</h4>
            <ParamTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {params.map((param, idx) => (
                  <tr key={idx}>
                    <td><code>{param.name}</code></td>
                    <td><code>{param.type}</code></td>
                    <td>{param.description}</td>
                  </tr>
                ))}
              </tbody>
            </ParamTable>
          </div>
        )}

        {example && (
          <div>
            <h4 style={{ color: '#0f172a', fontWeight: '700', marginTop: '1rem', marginBottom: '0.5rem' }}>Example</h4>
            <CodeBlock>
              <CopyButton onClick={() => copyToClipboard(example)}>
                <Copy /> Copy
              </CopyButton>
              <code>{example}</code>
            </CodeBlock>
          </div>
        )}

        {response && (
          <ResponseExample>
            <ResponseLabel>Response (200 OK)</ResponseLabel>
            <CodeBlock style={{ margin: '0.5rem 0 0 0' }}>
              <code>{JSON.stringify(response, null, 2)}</code>
            </CodeBlock>
          </ResponseExample>
        )}

        {notes && (
          <NoteBox>
            <strong>ℹ️ Note:</strong> {notes}
          </NoteBox>
        )}
      </div>
    </Section>
  );
};

const ApiDocs = () => {
  const domain = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000' 
    : window.location.origin;

  return (
    <Container>
      <NoteBox>
        <strong>📚 Public API Documentation</strong><br />
        These endpoints are publicly accessible and do not require authentication.
        Authenticated endpoints require an API key (see the "API Keys" tab to generate one).
      </NoteBox>

      <Endpoint
        method="GET"
        path="/api/port/:username"
        title="Get Public Portfolio"
        description="Fetch a user's complete public portfolio profile including education, experience, projects, skills, certifications, and interests."
        params={[
          { name: 'username', type: 'string', description: 'The username of the portfolio owner' }
        ]}
        example={`// JavaScript / Fetch API
const response = await fetch('${domain}/api/port/johndoe');
const portfolio = await response.json();
console.log(portfolio);

// cURL
curl ${domain}/api/port/johndoe

# Python
import requests
response = requests.get('${domain}/api/port/johndoe')
portfolio = response.json()`}
        response={{
          profile: {
            firstName: "John",
            lastName: "Doe",
            domain: "Full Stack Developer",
            location: "San Francisco, CA",
            email: "john@example.com"
          },
          education: [
            {
              school: "Stanford University",
              degree: "BS",
              fieldOfStudy: "Computer Science",
              startDate: "2018-09-01T00:00:00Z",
              endDate: "2022-05-31T00:00:00Z"
            }
          ],
          experience: [],
          projects: [],
          skills: { languages: ["JavaScript", "Python"], frameworks: ["React", "Node.js"] },
          certifications: [],
          interests: {}
        }}
        notes="This endpoint returns empty arrays/objects for missing sections. No authentication required."
      />

      <Endpoint
        method="GET"
        path="/api/util/signed-url?key=:s3-key"
        title="Get Signed URL for Image"
        description="Generate a temporary signed URL for accessing images stored in AWS S3. Useful for displaying profile photos and project images in your applications."
        params={[
          { name: 'key', type: 'string', description: 'The S3 object key (returned in portfolio data as photo, image fields)' }
        ]}
        example={`// JavaScript / Fetch API
const response = await fetch('${domain}/api/util/signed-url?key=profiles%2F123abc%2Fphoto.jpg');
const data = await response.json();
console.log(data.url); // Use this URL in an <img> tag

// cURL
curl '${domain}/api/util/signed-url?key=profiles%2F123abc%2Fphoto.jpg'`}
        response={{
          url: "https://your-s3-bucket.s3.amazonaws.com/profiles/123abc/photo.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=..."
        }}
        notes="Signed URLs expire after 1 hour. Rate limited to 30 requests per minute per IP address."
      />

      <Section>
        <h3 style={{ color: '#0f172a', fontWeight: '700', marginTop: 0 }}>🔐 Protected Endpoints</h3>
        <Description>
          The following endpoints require authentication using an API key. Include your API key in the <code>Authorization</code> header:
        </Description>
        <CodeBlock>
          <code>Authorization: Bearer YOUR_API_KEY</code>
        </CodeBlock>
        <Description style={{ marginTop: '1rem' }}>
          Use the "API Keys" tab to generate your first API key. Each key is rate-limited and tracked separately.
        </Description>
      </Section>
    </Container>
  );
};

export default ApiDocs;
