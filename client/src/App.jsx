import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ComposerProvider } from './context/ComposerContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Posts from './pages/Posts';
import Calendar from './pages/Calendar';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import Landing from './pages/Landing';
import ComposerModal from './components/ComposerModal';
import './App.css';

// When a user visits the root URL:
// - If not logged in, they see the SocialVibe Landing Page (with Sign in / Sign up options).
// - If already logged in, they are immediately taken to their /dashboard.
const HomeRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Landing />;
};

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <ComposerProvider>
            <Toaster 
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#1a1a24',
                  color: '#fff',
                  border: '1px solid #2d2d3f',
                }
              }}
            />
            <ComposerModal />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomeRoute />} />
              <Route path="/landing" element={<Landing />} />
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Route>

              {/* Protected Dashboard Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/posts" element={<Posts />} />
                  <Route path="/calendar" element={<Calendar />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ComposerProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
