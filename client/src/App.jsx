import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/common/ProtectedRoute'
import MainLayout from './components/layout/MainLayout'
import GlobalStyles from './styles/globalstyles'

import Home from './pages/Home'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import SecurityQuestions from './pages/auth/SecurityQuestions'
import NotFoundPage from './pages/NotFoundPage'

// Dashboard
import Dashboard from './pages/dashboard/Dashboard'

// Vault
import ItemsPage from './pages/vault/ItemsPage'
import BinPage from './pages/vault/BinPage'
import PublicFilesPage from './pages/vault/PublicFilesPage'

// Portfolio
import ProfilePage from './pages/portfolio/ProfilePage'
import EducationPage from './pages/portfolio/EducationPage'
import ExperiencePage from './pages/portfolio/ExperiencePage'
import ProjectsPage from './pages/portfolio/ProjectsPage'
import SkillsPage from './pages/portfolio/SkillsPage'
import CertificationsPage from './pages/portfolio/CertificationsPage'
import InterestsPage from './pages/portfolio/InterestsPage'

// Developer
import DocsPage from './pages/developer/DocsPage'
import KeysPage from './pages/developer/KeysPage'
import AnalyticsPage from './pages/developer/AnalyticsPage'

// Standalone
import AccountPage from './pages/AccountPage.jsx'
import SettingsPage from './pages/SettingsPage'
import PortfolioSettingsPage from './pages/Portfoliosettingspage.jsx'

// Admin
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminTemplates from './pages/admin/AdminTemplates.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import PublicProfilePage from './pages/PublicProfilePage.jsx'

/* ══════════════════════════════════════════════════════
   SUBDOMAIN DETECTION
   
   Extracts the subdomain prefix from the current hostname.
   
   Examples:
     sanjay.josan.tech      → "sanjay"
     sanjay.localhost       → "sanjay"    (dev)
     sanjay.localhost:5173  → "sanjay"    (Vite dev)
     josan.tech             → null        (root domain, no subdomain)
     localhost:5173         → null        (plain localhost, no subdomain)
     www.josan.tech         → null        (treat www as root)
══════════════════════════════════════════════════════ */
function getSubdomain() {
  // hostname strips the port, e.g. "sanjay.localhost:5173" → "sanjay.localhost"
  const hostname = window.location.hostname  // e.g. "sanjay.josan.tech"
  const parts = hostname.split('.')

  // Need at least 2 parts to have a subdomain
  // e.g. ["sanjay", "josan", "tech"] = length 3  → subdomain exists
  //      ["josan", "tech"]            = length 2  → root domain
  //      ["localhost"]                = length 1  → plain localhost
  //      ["sanjay", "localhost"]      = length 2  → dev subdomain
  if (parts.length < 2) return null

  const sub = parts[0]

  // Ignore www as a subdomain
  if (sub === 'personaldb') return null

  // For production (josan.tech), only treat it as a subdomain if there are 3+ parts
  // For localhost dev (sanjay.localhost), 2 parts is fine
  const isLocalhost = parts[parts.length - 1] === 'localhost'
  if (!isLocalhost && parts.length < 3) return null

  return sub  // e.g. "sanjay"
}

/* ══════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════ */
function App() {
  const subdomain = getSubdomain()

  // ── If a subdomain is detected, render ONLY the public portfolio ──
  // The entire router is bypassed. The page uses the subdomain value
  // to fetch the right user's portfolio from the backend.
  if (subdomain) {
    return (
      <ThemeProvider>
        <GlobalStyles />
        <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        {/* Pass the subdomain so PublicProfilePage can fetch by portdomain */}
        <PublicProfilePage portdomain={subdomain} />
      </ThemeProvider>
    )
  }

  // ── Normal app (no subdomain) ──
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GlobalStyles />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/security-questions" element={<SecurityQuestions />} />

            {/* Public Profile fallback via path (for non-subdomain access) */}
            <Route path="/u/:username" element={<PublicProfilePage />} />

            {/* Protected — all inside MainLayout */}
            <Route path="/dashboard/*" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />

              {/* Vault */}
              <Route path="vault/items"  element={<ItemsPage />} />
              <Route path="vault/bin"    element={<BinPage />} />
              <Route path="vault/public" element={<PublicFilesPage />} />

              {/* Portfolio */}
              <Route path="portfolio/profile"        element={<ProfilePage />} />
              <Route path="portfolio/education"      element={<EducationPage />} />
              <Route path="portfolio/experience"     element={<ExperiencePage />} />
              <Route path="portfolio/projects"       element={<ProjectsPage />} />
              <Route path="portfolio/skills"         element={<SkillsPage />} />
              <Route path="portfolio/certifications" element={<CertificationsPage />} />
              <Route path="portfolio/interests"      element={<InterestsPage />} />

              {/* Developer */}
              <Route path="developer/docs"      element={<DocsPage />} />
              <Route path="developer/keys"      element={<KeysPage />} />
              <Route path="developer/analytics" element={<AnalyticsPage />} />

              {/* Standalone */}
              <Route path="account"      element={<AccountPage />} />
              <Route path="settings"     element={<SettingsPage />} />
              <Route path="portsettings" element={<PortfolioSettingsPage />} />

              {/* Admin Routes */}
              <Route path="admin/*" element={<AdminLayout />}>
                <Route path="templates" element={<AdminTemplates />} />
                <Route path="users"     element={<AdminUsers />} />
                <Route index element={<Navigate to="templates" replace />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*"    element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App