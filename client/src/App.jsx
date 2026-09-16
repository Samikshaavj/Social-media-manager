import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ComposerProvider } from './context/ComposerContext';
import ProtectedRoute from './components/ProtectedRoute';
import AuthLayout from './layouts/AuthLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Posts from './pages/Posts';
import Calendar from './pages/Calendar';
import Accounts from './pages/Accounts';
import Settings from './pages/Settings';
import ComposerModal from './components/ComposerModal';
import './App.css';

function App() {
  return (
    <Router>
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
          {/* Public Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="posts" element={<Posts />} />
              <Route path="calendar" element={<Calendar />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
        </Routes>
        </ComposerProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
