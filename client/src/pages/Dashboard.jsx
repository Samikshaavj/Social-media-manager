import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  Activity, 
  Heart, 
  MessageSquare, 
  Share2,
  Plus,
  Users,
  Send
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useComposer } from '../context/ComposerContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openComposer, refreshTrigger } = useComposer();

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
        setStats(statsRes.data || []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshTrigger]);

  const iconMap = {
    'Total Followers': <Activity className="text-indigo-400" size={20} />,
    'Total Engagement': <Heart className="text-pink-400" size={20} />,
    'Posts Published': <MessageSquare className="text-blue-400" size={20} />,
    'Audience Reach': <Share2 className="text-purple-400" size={20} />
  };

  return (
    <div className="text-gray-300">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5">
            Welcome back, {user?.username || user?.name || 'User'} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Here's what's happening with your social accounts today.
          </p>
        </div>
        <button 
          onClick={() => openComposer()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>Create Post</span>
        </button>
      </div>

      {/* Top Stat Metrics Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div 
              key={i} 
              className="bg-[#111116] border border-[#1f1f2e] hover:border-[#2d2d3f] transition-all rounded-2xl p-5 flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-semibold text-gray-400 mb-1">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-white mb-1">{stat.value}</h3>
                {stat.change && (
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    {stat.change} this month
                  </span>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#181824] border border-[#2d2d3f] flex items-center justify-center shrink-0">
                {iconMap[stat.label] || <Activity className="text-indigo-400" size={20} />}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Recent Posts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Posts Section */}
        <div className="lg:col-span-2 bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white">Recent Posts</h2>
            <button 
              onClick={() => navigate('/posts')}
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-4">
            {loading ? (
              <div className="text-gray-400 text-sm py-8 text-center flex items-center justify-center gap-2">
                <Clock size={16} className="animate-spin text-indigo-400" />
                <span>Loading posts...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-gray-400 text-sm py-10 text-center bg-[#181824]/50 rounded-xl border border-[#2d2d3f] flex flex-col items-center justify-center gap-3">
                <p>No posts found. Create or schedule your first post!</p>
                <button 
                  onClick={() => openComposer()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  Create Post
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post._id} 
                  onClick={() => navigate('/posts')}
                  className="flex items-start gap-4 p-4 rounded-xl border border-[#2d2d3f] bg-[#1a1a24] hover:border-indigo-500/40 hover:bg-[#1e1e2d] transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400 group-hover:scale-105 transition-transform">
                    <CalendarIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm font-semibold text-white truncate max-w-[200px]">
                        {post.publications?.map(p => p.platform).join(', ') || 'Draft'}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} />
                        {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not scheduled'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-1">{post.globalContent}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      post.status === 'PUBLISHED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      post.status === 'SCHEDULED' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                      'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    }`}>
                      {post.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-4 flex flex-col gap-3">
            {/* Connect new platform */}
            <button 
              onClick={() => navigate('/accounts')}
              className="flex items-center justify-between w-full p-3.5 bg-[#1a1a24] hover:bg-[#232332] border border-[#2d2d3f] hover:border-indigo-500/40 rounded-xl text-sm text-gray-200 hover:text-white transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-500/15 text-pink-400 flex items-center justify-center">
                  <Users size={16} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-xs text-white">Connect new platform</p>
                  <p className="text-[11px] text-gray-400">Add Instagram, YouTube, LinkedIn...</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Schedule new post */}
            <button 
              onClick={() => openComposer()}
              className="flex items-center justify-between w-full p-3.5 bg-[#1a1a24] hover:bg-[#232332] border border-[#2d2d3f] hover:border-indigo-500/40 rounded-xl text-sm text-gray-200 hover:text-white transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 text-indigo-400 flex items-center justify-center">
                  <Send size={16} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-xs text-white">Schedule new post</p>
                  <p className="text-[11px] text-gray-400">Queue across multiple platforms</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* View Content Calendar */}
            <button 
              onClick={() => navigate('/calendar')}
              className="flex items-center justify-between w-full p-3.5 bg-[#1a1a24] hover:bg-[#232332] border border-[#2d2d3f] hover:border-indigo-500/40 rounded-xl text-sm text-gray-200 hover:text-white transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/15 text-purple-400 flex items-center justify-center">
                  <CalendarIcon size={16} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-xs text-white">View content calendar</p>
                  <p className="text-[11px] text-gray-400">Plan and track your timeline</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>

            {/* Configure auto-replies */}
            <button 
              onClick={() => navigate('/accounts')}
              className="flex items-center justify-between w-full p-3.5 bg-[#1a1a24] hover:bg-[#232332] border border-[#2d2d3f] hover:border-indigo-500/40 rounded-xl text-sm text-gray-200 hover:text-white transition-all cursor-pointer group shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 flex items-center justify-center">
                  <MessageSquare size={16} />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-xs text-white">Configure auto-replies</p>
                  <p className="text-[11px] text-gray-400">Manage social accounts & rules</p>
                </div>
              </div>
              <ArrowRight size={16} className="text-gray-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
