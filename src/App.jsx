import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthPage from './components/auth/AuthPage'
import ProtectedRoute from './components/ProtectedRoute'
import PageLayout from './components/layout/PageLayout'
import { AuthProvider, useAuth } from './context/AuthContext'
import CommunicationAssistant from './pages/CommunicationAssistant'
import DashboardPage from './pages/DashboardPage'
import HearingAssistant from './pages/HearingAssistant'
import HomePage from './pages/HomePage'
import VisionAssistant from './pages/VisionAssistant'
import './styles/accessai.css'

function RootRedirect() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-status" aria-live="polite">
        Preparing your experience…
      </div>
    )
  }

  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PageLayout>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<AuthPage initialMode="login" />} />
            <Route path="/signup" element={<AuthPage initialMode="signup" />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/home" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="/vision" element={<VisionAssistant />} />
            <Route path="/hearing" element={<HearingAssistant />} />
            <Route path="/communication" element={<CommunicationAssistant />} />
          </Routes>
        </PageLayout>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
