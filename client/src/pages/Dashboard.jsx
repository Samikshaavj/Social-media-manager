import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ArrowRight, 
  Plus, 
  Users, 
  Send, 
  MessageSquare
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useComposer } from '../context/ComposerContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openComposer, refreshTrigger } = useComposer();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/posts');
        setPosts(res.data?.slice(0, 5) || []);
      } catch (error) {
        console.error('Error fetching dashboard posts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [refreshTrigger]);

  return (
    <div className="max-w-[1240px] mx-auto text-[#121028] dark:text-gray-100 space-y-8 transition-colors">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#121028] dark:text-white tracking-tight mb-1.5">
            Welcome back, {user?.username || user?.name || 'User'} 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Here's what's happening with your social accounts and scheduled posts today.
          </p>
        </div>

        {/* Create Post Button (SocialVibe Royal Purple Pill) */}
        <button 
          onClick={() => openComposer()}
          className="bg-[#5835F5] hover:bg-[#4726e0] text-white rounded-full px-6 py-2.5 text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#5835f5]/25 hover:scale-105 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>Create Post</span>
        </button>
      </div>

      {/* Main Grid: Recent Posts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
        {/* Recent Posts Section */}
        <div className="lg:col-span-2 bg-white dark:bg-[#131226] border border-[#e8ebf5] dark:border-[#22203e] rounded-[28px] p-7 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-black text-[#121028] dark:text-white">Recent Posts</h2>
            <button 
              onClick={() => navigate('/posts')}
              className="text-[#5835F5] hover:text-[#4726e0] dark:text-[#9d89ff] text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="space-y-3.5">
            {loading ? (
              <div className="text-gray-400 text-sm py-12 text-center flex items-center justify-center gap-2">
                <Clock size={16} className="animate-spin text-[#5835F5]" />
                <span className="font-medium">Loading posts...</span>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-gray-500 dark:text-gray-400 text-sm py-12 text-center bg-[#fbfbff] dark:bg-[#1a1833] rounded-2xl border border-[#e8ebf7] dark:border-[#2a284c] flex flex-col items-center justify-center gap-3">
                <p className="font-medium">No posts found. Create or schedule your first post!</p>
                <button 
                  onClick={() => openComposer()}
                  className="bg-[#5835F5] hover:bg-[#4726e0] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all cursor-pointer shadow-sm"
                >
                  Create Post
                </button>
              </div>
            ) : (
              posts.map((post) => (
                <div 
                  key={post._id} 
                  onClick={() => navigate('/posts')}
                  className="flex items-start gap-4 p-4 rounded-2xl border border-[#f0f2f9] dark:border-[#201e38] bg-[#fbfbff] dark:bg-[#1a1833] hover:border-[#5835F5]/40 hover:bg-white dark:hover:bg-[#1f1d3d] transition-all cursor-pointer group shadow-sm"
                >
                  <div className="w-10 h-10 rounded-2xl bg-[#f0edff] dark:bg-[#5835F5]/20 flex items-center justify-center shrink-0 text-[#5835F5] dark:text-[#9d89ff] group-hover:scale-105 transition-transform">
                    <CalendarIcon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-black text-[#121028] dark:text-white truncate max-w-[200px]">
                        {post.publications?.map(p => p.platform).join(', ') || 'Draft'}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      <span className="text-[11px] text-[#8f92a9] font-medium flex items-center gap-1">
                        <Clock size={11} />
                        {post.scheduledFor ? new Date(post.scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Not scheduled'}
                      </span>
                    </div>
                    <p className="text-sm text-[#121028] dark:text-gray-200 font-medium line-clamp-1">{post.globalContent}</p>
                  </div>
                  <div className="shrink-0 self-center">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${
                      post.status === 'PUBLISHED' ? 'bg-[#10b981]/15 text-[#059669] dark:text-[#34d399] border-[#10b981]/25' : 
                      post.status === 'SCHEDULED' ? 'bg-[#f0edff] dark:bg-[#5835F5]/25 text-[#5835F5] dark:text-[#9d89ff] border-[#5835F5]/25' : 
                      'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-white/10'
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
          <div className="bg-white dark:bg-[#131226] border border-[#e8ebf5] dark:border-[#22203e] rounded-[28px] p-6 shadow-sm flex flex-col gap-3 transition-colors">
            <h2 className="text-xl font-black text-[#121028] dark:text-white mb-2">Quick Actions</h2>

            {/* Connect new platform */}
            <button 
              onClick={() => navigate('/accounts')}
              className="flex items-center justify-between w-full p-3.5 bg-[#fbfbff] dark:bg-[#1a1833] hover:bg-[#f5f3ff] dark:hover:bg-[#222044] border border-[#f0f2f9] dark:border-[#201e38] hover:border-[#5835F5]/40 rounded-2xl text-sm transition-all cursor-pointer group shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ff4b72]/15 text-[#ff4b72] flex items-center justify-center shrink-0">
                  <Users size={16} />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#121028] dark:text-white">Connect new platform</p>
                  <p className="text-[11px] text-[#8f92a9] font-medium">Add Instagram, YouTube, LinkedIn...</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-[#8f92a9] group-hover:text-[#5835F5] group-hover:translate-x-1 transition-all" />
            </button>

            {/* Schedule new post */}
            <button 
              onClick={() => openComposer()}
              className="flex items-center justify-between w-full p-3.5 bg-[#fbfbff] dark:bg-[#1a1833] hover:bg-[#f5f3ff] dark:hover:bg-[#222044] border border-[#f0f2f9] dark:border-[#201e38] hover:border-[#5835F5]/40 rounded-2xl text-sm transition-all cursor-pointer group shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5835F5]/15 text-[#5835F5] flex items-center justify-center shrink-0">
                  <Send size={16} />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#121028] dark:text-white">Schedule new post</p>
                  <p className="text-[11px] text-[#8f92a9] font-medium">Queue across multiple platforms</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-[#8f92a9] group-hover:text-[#5835F5] group-hover:translate-x-1 transition-all" />
            </button>

            {/* View Content Calendar */}
            <button 
              onClick={() => navigate('/calendar')}
              className="flex items-center justify-between w-full p-3.5 bg-[#fbfbff] dark:bg-[#1a1833] hover:bg-[#f5f3ff] dark:hover:bg-[#222044] border border-[#f0f2f9] dark:border-[#201e38] hover:border-[#5835F5]/40 rounded-2xl text-sm transition-all cursor-pointer group shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#ffd246]/20 text-[#d97706] dark:text-[#ffd246] flex items-center justify-center shrink-0">
                  <CalendarIcon size={16} />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#121028] dark:text-white">View content calendar</p>
                  <p className="text-[11px] text-[#8f92a9] font-medium">Plan and track your timeline</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-[#8f92a9] group-hover:text-[#5835F5] group-hover:translate-x-1 transition-all" />
            </button>

            {/* Configure auto-replies */}
            <button 
              onClick={() => navigate('/accounts')}
              className="flex items-center justify-between w-full p-3.5 bg-[#fbfbff] dark:bg-[#1a1833] hover:bg-[#f5f3ff] dark:hover:bg-[#222044] border border-[#f0f2f9] dark:border-[#201e38] hover:border-[#5835F5]/40 rounded-2xl text-sm transition-all cursor-pointer group shadow-sm text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 text-blue-500 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="font-bold text-xs text-[#121028] dark:text-white">Configure auto-replies</p>
                  <p className="text-[11px] text-[#8f92a9] font-medium">Manage social accounts & rules</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-[#8f92a9] group-hover:text-[#5835F5] group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
