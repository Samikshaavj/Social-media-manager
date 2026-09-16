import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Mail, Save } from 'lucide-react';

const Settings = () => {
  const { user, logout, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updateProfile(formData);
    setLoading(false);
  };

  return (
    <div className="text-gray-300 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account preferences and application settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-2.5 rounded-xl bg-[#1a1a24] text-white border border-[#2d2d3f] font-medium flex items-center gap-3">
            <User size={18} /> Profile
          </button>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-6">Profile Information</h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                <input 
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl px-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">@</span>
                  <input 
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl pl-9 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input 
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl pl-10 pr-4 py-2.5 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2.5 font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
            <h2 className="text-lg font-bold text-red-400 mb-2">Danger Zone</h2>
            <p className="text-sm text-gray-400 mb-4">Log out of your account on this device.</p>
            <button 
              onClick={logout}
              className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl px-6 py-2.5 font-medium transition-colors flex items-center gap-2"
            >
              <LogOut size={18} />
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
