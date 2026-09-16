import { useState, useEffect } from 'react';
import { Image as ImageIcon, Video, MessageCircle, Briefcase, Bookmark, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';

const Accounts = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModalPlatform, setActiveModalPlatform] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const { data } = await api.get('/oauth/accounts');
        setConnectedPlatforms(data.map(acc => acc.platform.toLowerCase()));
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const handleConnect = (platformName) => {
    if (platformName === 'instagram' || platformName === 'facebook' || platformName === 'linkedin') {
      setActiveModalPlatform(platformName);
    } else {
      proceedWithConnect(platformName);
    }
  };

  const handleDisconnect = async (platformName) => {
    try {
      await api.delete(`/oauth/disconnect/${platformName}`);
      setConnectedPlatforms(prev => prev.filter(p => p !== platformName));
    } catch (error) {
      console.error('Failed to disconnect:', error);
      alert('Failed to disconnect account');
    }
  };

  const proceedWithConnect = (platformName) => {
    const token = localStorage.getItem('social_vibe_token');
    window.location.href = `http://localhost:5000/api/oauth/connect/${platformName}?token=${token}`;
  };

  const platforms = [
    { name: 'Instagram', id: 'instagram', icon: <ImageIcon size={24} className="text-pink-500" /> },
    { name: 'YouTube', id: 'youtube', icon: <Video size={24} className="text-red-500" /> },
    { name: 'Facebook', id: 'facebook', icon: <MessageCircle size={24} className="text-blue-500" /> },
    { name: 'LinkedIn', id: 'linkedin', icon: <Briefcase size={24} className="text-blue-400" /> },
    { name: 'Pinterest', id: 'pinterest', icon: <Bookmark size={24} className="text-red-600" /> },
  ];

  return (
    <div className="text-gray-300 max-w-5xl relative">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Connected Accounts</h1>
        <p className="text-gray-400">Manage your social media integrations to automatically cross-post and reply.</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const isConnected = connectedPlatforms.includes(platform.id);
          return (
            <div key={platform.name} className="bg-[#111116] border border-[#1f1f2e] rounded-xl p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-[#1a1a24] flex items-center justify-center mb-4 border border-[#2d2d3f]">
                {platform.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{platform.name}</h3>
              <p className="text-sm text-gray-400 mb-6">
                {isConnected ? <span className="text-green-400 flex items-center gap-1 justify-center"><CheckCircle2 size={14}/> Connected</span> : 'Not connected'}
              </p>
              <button 
                onClick={() => isConnected ? handleDisconnect(platform.id) : handleConnect(platform.id)}
                disabled={loading}
                className={`w-full py-2.5 rounded-xl font-medium transition-colors ${
                  isConnected 
                    ? 'bg-[#1a1a24] text-red-400 border border-red-500/30 hover:bg-red-500/10' 
                    : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20'
                }`}
              >
                {isConnected ? 'Disconnect' : `Connect ${platform.name}`}
              </button>
            </div>
          );
        })}
      </div>

      {activeModalPlatform && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111116] border border-[#2d2d3f] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              {activeModalPlatform === 'instagram' ? (
                <><ImageIcon className="text-pink-500" size={24} /> Connect Instagram</>
              ) : activeModalPlatform === 'facebook' ? (
                <><MessageCircle className="text-blue-500" size={24} /> Connect Facebook</>
              ) : (
                <><Briefcase className="text-blue-400" size={24} /> Connect LinkedIn</>
              )}
            </h2>
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
              <p className="text-yellow-200/90 text-sm leading-relaxed">
                <strong>Important Requirement:</strong> 
                {activeModalPlatform === 'instagram' 
                  ? " To post and view analytics, the Instagram API requires that you connect a Professional Account (Business or Creator) that is linked to a Facebook Page."
                  : activeModalPlatform === 'facebook'
                  ? " Facebook's API rules state that third-party apps can only post to Facebook Pages, not personal Facebook profiles. Please ensure you select a Facebook Page to connect."
                  : " LinkedIn requires you to grant authorization to post to your personal profile. You will be redirected to LinkedIn to approve these permissions."
                }
              </p>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              {activeModalPlatform === 'instagram'
                ? "You will be redirected to Facebook to authorize the connection. Please ensure you log into the Facebook account that manages your Instagram's linked Page."
                : activeModalPlatform === 'facebook'
                ? "You will be redirected to Facebook to authorize the connection. Please grant the requested permissions for the Page you want to manage."
                : "You will be redirected to LinkedIn to authorize the connection."
              }
            </p>
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setActiveModalPlatform(null)}
                className="px-5 py-2 rounded-xl font-medium text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const platform = activeModalPlatform;
                  setActiveModalPlatform(null);
                  proceedWithConnect(platform);
                }}
                className={`px-5 py-2 rounded-xl font-medium shadow-lg transition-all text-white ${
                  activeModalPlatform === 'instagram' 
                    ? 'bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500'
                    : activeModalPlatform === 'facebook'
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-blue-500 hover:bg-blue-600' // LinkedIn styling
                }`}
              >
                Proceed to {activeModalPlatform === 'instagram' || activeModalPlatform === 'facebook' ? 'Facebook' : 'LinkedIn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
