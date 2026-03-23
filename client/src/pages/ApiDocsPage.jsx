import { Link } from 'react-router-dom'

const methodColor = { GET: 'text-green-600', POST: 'text-blue-600', PUT: 'text-yellow-600', DELETE: 'text-red-600' }

const Endpoint = ({ method, path, description, request, response }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
    <div className="flex items-center gap-3 mb-2">
      <span className={`font-mono font-bold ${methodColor[method]}`}>{method}</span>
      <span className="font-mono text-gray-700 dark:text-gray-300">{path}</span>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
    {request && (
      <>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Request body:</p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">{request}</pre>
      </>
    )}
    {response && (
      <>
        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2 mb-1">Response:</p>
        <pre className="bg-gray-100 dark:bg-gray-900 p-2 rounded text-xs overflow-x-auto">{response}</pre>
      </>
    )}
  </div>
)

const Section = ({ title, children }) => (
  <section className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h2>
    <div className="space-y-4">{children}</div>
  </section>
)

const ApiDocsPage = () => (
  <div className="max-w-4xl mx-auto py-8 px-4">
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">API Documentation</h1>
      <Link to="/login" className="text-sm text-primary-600 hover:text-primary-500">← Back to app</Link>
    </div>
    <p className="text-gray-600 dark:text-gray-400 mb-8">
      Base URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">{import.meta.env.VITE_API_URL}</code>
    </p>

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
      <Endpoint method="GET" path="/vault/auth/me" description="Get current authenticated user" />
      <Endpoint method="POST" path="/vault/auth/verify-security" description="Verify security answers for password reset"
        request={`{ "username": "johndoe", "birthYear": 1990, "placeAnswer": "New York", "friendAnswer": "Alice" }`}
      />
      <Endpoint method="POST" path="/vault/auth/reset-password" description="Reset password after security verification"
        request={`{ "username": "johndoe", "newPassword": "newSecret" }`}
      />
    </Section>

    <Section title="Vault Items">
      <Endpoint method="GET" path="/vault/items" description="Get all items for the authenticated user" />
      <Endpoint method="POST" path="/vault/items" description="Create a new item"
        request={`{ "type": "note", "title": "Meeting notes", "content": "...", "hasPassword": false }`}
      />
      <Endpoint method="GET" path="/vault/items/:id" description="Get a single item by ID" />
      <Endpoint method="PUT" path="/vault/items/:id" description="Update an item" request={`{ "title": "Updated title", "content": "..." }`} />
      <Endpoint method="DELETE" path="/vault/items/:id" description="Move item to trash" />
      <Endpoint method="POST" path="/vault/items/:id/verify" description="Verify item password" request={`{ "password": "itemPassword" }`} />
      <Endpoint method="GET" path="/vault/items/trash" description="Get all trashed items" />
      <Endpoint method="PUT" path="/vault/items/:id/restore" description="Restore item from trash" />
      <Endpoint method="DELETE" path="/vault/items/:id/permanent" description="Permanently delete an item" />
      <Endpoint method="DELETE" path="/vault/items/trash/empty" description="Empty all trash" />
    </Section>

    <Section title="Public Files (Resume)">
      <Endpoint method="GET" path="/vault/resume" description="Get all public files" />
      <Endpoint method="POST" path="/vault/resume/upload" description="Upload a file (multipart/form-data)" />
      <Endpoint method="DELETE" path="/vault/resume/:id" description="Delete a public file" />
    </Section>

    <Section title="Portfolio – Profile">
      <Endpoint method="GET" path="/portfolio/profile" description="Get portfolio profile" />
      <Endpoint method="PUT" path="/portfolio/profile" description="Update portfolio profile"
        request={`{ "name": "John Doe", "title": "Developer", "bio": "...", "email": "...", "github": "..." }`}
      />
    </Section>

    <Section title="Portfolio – Education / Experience / Projects / Certifications">
      {['education', 'experience', 'projects', 'certifications'].map(section => (
        <div key={section} className="space-y-2">
          <Endpoint method="GET" path={`/portfolio/${section}`} description={`Get all ${section}`} />
          <Endpoint method="POST" path={`/portfolio/${section}`} description={`Create a ${section.slice(0, -1)} entry`} />
          <Endpoint method="PUT" path={`/portfolio/${section}/:id`} description={`Update a ${section.slice(0, -1)} entry`} />
          <Endpoint method="DELETE" path={`/portfolio/${section}/:id`} description={`Delete a ${section.slice(0, -1)} entry`} />
        </div>
      ))}
    </Section>

    <Section title="Portfolio – Skills & Interests">
      <Endpoint method="GET" path="/portfolio/skills" description="Get skills object" />
      <Endpoint method="PUT" path="/portfolio/skills" description="Update skills" request={`{ "Languages": ["JavaScript", "Python"], "Frameworks": ["React"] }`} />
      <Endpoint method="GET" path="/portfolio/interests" description="Get interests array" />
      <Endpoint method="PUT" path="/portfolio/interests" description="Update interests" request={`["Reading", "Hiking", "Gaming"]`} />
    </Section>
  </div>
)

export default ApiDocsPage
