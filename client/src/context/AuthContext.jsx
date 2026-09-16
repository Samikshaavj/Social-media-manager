import { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkUser = async () => {
      const token = localStorage.getItem('social_vibe_token');
      if (token) {
        try {
          const { data } = await api.get('/auth/me');
          setUser(data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Token invalid or expired", error);
          localStorage.removeItem('social_vibe_token');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (identifier, password) => {
    try {
      const { data } = await api.post('/auth/login', { identifier, password });
      localStorage.setItem('social_vibe_token', data.token);
      setUser(data);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      console.error('Login failed', error);
      toast.error(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const signup = async (name, username, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { name, username, email, password });
      localStorage.setItem('social_vibe_token', data.token);
      setUser(data);
      setIsAuthenticated(true);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Signup failed');
      return { success: false, error: error.response?.data?.message || 'Signup failed' };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const { data } = await api.put('/auth/profile', profileData);
      setUser(data);
      toast.success('Profile updated successfully!');
      return { success: true };
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Profile update failed');
      return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('social_vibe_token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, signup, logout, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
