import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(identifier, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="bg-[#111116] border border-[#1f1f2e] p-8 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 text-center">Sign in to your account</h2>
      
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email or Username</label>
          <input 
            type="text" 
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="you@example.com or janedoe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
          <input 
            type="password" 
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="••••••••"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
            <input type="checkbox" className="rounded bg-[#1a1a24] border-[#2d2d3f] text-indigo-500 focus:ring-indigo-500" />
            Remember me
          </label>
          <a href="#" className="text-indigo-400 hover:text-indigo-300">Forgot password?</a>
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium transition-colors mt-2"
        >
          Sign In
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account? <Link to="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign up</Link>
      </p>
    </div>
  );
};

export default Login;
