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
import OAuthSuccess from './pages/auth/OAuthSuccess'
import Verify2FADisable from './pages/Verify2FADisable'
import NotFoundPage from './pages/NotFoundPage'
import DocsPage from './pages/DocsPage'
import ContactPage from './pages/ContactPage'

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
import DeveloperDocsPage from './pages/developer/DocsPage'
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
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminUnusedUsers from './pages/admin/AdminUnusedUsers.jsx'
import PublicProfilePage from './pages/PublicProfilePage.jsx'


function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <GlobalStyles />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<DocsPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/security-questions" element={<SecurityQuestions />} />
            <Route path="/auth/success" element={<OAuthSuccess />} />
            <Route path="/verify-2fa-disable" element={<Verify2FADisable />} />

            {/* Public Portfolio via path */}
            <Route path="/u/:portdomain" element={<PublicProfilePage />} />

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
              <Route path="developer/docs"      element={<DeveloperDocsPage />} />
              <Route path="developer/keys"      element={<KeysPage />} />
              <Route path="developer/analytics" element={<AnalyticsPage />} />

              {/* Standalone */}
              <Route path="account"      element={<AccountPage />} />
              <Route path="contact"      element={<ContactPage />} />
              <Route path="settings"     element={<SettingsPage />} />
              <Route path="portsettings" element={<PortfolioSettingsPage />} />

              {/* Admin Routes */}
              <Route path="admin/*" element={<AdminLayout />}>
                <Route path="templates" element={<AdminTemplates />} />
                <Route path="users"     element={<AdminUsers />} />
                <Route path="reviews"   element={<AdminReviews />} />
                <Route path="unused"    element={<AdminUnusedUsers />} />
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