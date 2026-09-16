import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, ArrowRight, Activity, Heart, MessageSquare, Share2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, statsRes] = await Promise.all([
          api.get('/posts'),
          api.get('/analytics/stats')
        ]);
        setPosts(postsRes.data.slice(0, 3));
        setStats(statsRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const iconMap = {
    'Total Followers': <Activity className="text-indigo-400" />,
    'Total Engagement': <Heart className="text-pink-400" />,
    'Posts Published': <MessageSquare className="text-blue-400" />,
    'Audience Reach': <Share2 className="text-purple-400" />
  };

  return (
    <div className="text-gray-300">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.username || user?.name || 'User'}</h1>
        <p className="text-gray-400">Here's what's happening with your social accounts today.</p>
      </div>


      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Posts</h2>
            <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">View All</button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-400 text-sm py-4 text-center">Loading posts...</div>
            ) : posts.length === 0 ? (
              <div className="text-gray-400 text-sm py-4 text-center bg-[#1a1a24] rounded-xl border border-[#2d2d3f]">No posts found. Create one!</div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="flex items-start gap-4 p-4 rounded-xl border border-[#2d2d3f] bg-[#1a1a24] hover:border-[#3f3f5a] transition-colors cursor-pointer group">
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                    <CalendarIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white truncate max-w-[200px]">
                        {post.publications?.map(p => p.platform).join(', ') || 'Draft'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString() : 'Not scheduled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-1">{post.globalContent}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      post.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 
                      post.status === 'SCHEDULED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                      'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-1">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="bg-[#111116] border border-[#1f1f2e] rounded-xl p-4 flex flex-col gap-3">
            <button className="flex items-center justify-between w-full p-3 bg-[#1a1a24] hover:bg-[#252536] rounded-lg text-sm text-gray-300 transition-colors">
              Connect new platform <ArrowRight size={16} className="text-gray-500" />
            </button>
            <button className="flex items-center justify-between w-full p-3 bg-[#1a1a24] hover:bg-[#252536] rounded-lg text-sm text-gray-300 transition-colors">
              Configure auto-replies <ArrowRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
