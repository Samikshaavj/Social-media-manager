import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await signup(name, username, email, password);
    if (res.success) {
      navigate('/');
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="bg-[#111116] border border-[#1f1f2e] p-8 rounded-2xl shadow-xl">
      <h2 className="text-xl font-bold text-white mb-6 text-center">Create a new account</h2>
      
      {error && <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
          <input 
            type="text" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="janedoe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-1">Email address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
            placeholder="you@example.com"
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
        
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl py-3 font-medium transition-colors mt-2"
        >
          Create Account
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account? <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
      </p>
    </div>
  );
};

export default Signup;
