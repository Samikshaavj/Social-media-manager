import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, CheckCircle2, AlertCircle, FileText, Share2, Image as ImageIcon } from 'lucide-react';
import { useComposer } from '../context/ComposerContext';
import api from '../api/axios';

const Posts = () => {
  const { openComposer, refreshTrigger } = useComposer();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'SCHEDULED') return post.status === 'SCHEDULED';
    if (activeTab === 'POSTED') return post.status === 'PUBLISHED';
    if (activeTab === 'DRAFTS') return post.status === 'DRAFT';
    return true;
  });

  const getStatusBadge = (status, scheduledFor) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            <Calendar size={12} />
            {scheduledFor ? `Scheduled: ${new Date(scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}` : 'Scheduled'}
          </span>
        );
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={12} />
            Published
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/30">
            <FileText size={12} />
            Draft
          </span>
        );
      case 'PUBLISHING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Clock size={12} className="animate-spin" />
            Publishing...
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/30">
            <AlertCircle size={12} />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/15 text-gray-400 border border-gray-500/30">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="text-gray-300">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Posts</h1>
          <p className="text-gray-400">Manage, schedule, and track all your social media content.</p>
        </div>
        <button 
          onClick={openComposer}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>Create Post</span>
        </button>
      </div>

      <div className="flex gap-2 mb-6 bg-[#111116] w-fit p-1 rounded-xl border border-[#1f1f2e]">
        <button 
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'ALL' ? 'bg-[#2d2d3f] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          All Posts ({posts.length})
        </button>
        <button 
          onClick={() => setActiveTab('SCHEDULED')}
          className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'SCHEDULED' ? 'bg-[#2d2d3f] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Scheduled ({posts.filter(p => p.status === 'SCHEDULED').length})
        </button>
        <button 
          onClick={() => setActiveTab('POSTED')}
          className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'POSTED' ? 'bg-[#2d2d3f] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Posted ({posts.filter(p => p.status === 'PUBLISHED').length})
        </button>
        <button 
          onClick={() => setActiveTab('DRAFTS')}
          className={`px-4 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors cursor-pointer ${
            activeTab === 'DRAFTS' ? 'bg-[#2d2d3f] text-white shadow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Drafts ({posts.filter(p => p.status === 'DRAFT').length})
        </button>
      </div>

      {loading ? (
        <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl h-80 flex items-center justify-center">
          <div className="flex items-center gap-3 text-gray-400 text-sm">
            <Clock size={20} className="animate-spin text-indigo-400" />
            <span>Loading posts...</span>
          </div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-[#111116] border border-[#1f1f2e] border-dashed rounded-2xl h-80 flex flex-col items-center justify-center p-8">
          <div className="w-14 h-14 rounded-full bg-[#1a1a24] flex items-center justify-center mb-4">
            <Calendar size={22} className="text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-white mb-1.5">No posts found</h2>
          <p className="text-gray-500 text-center max-w-sm text-xs sm:text-sm mb-5">
            {activeTab === 'SCHEDULED' 
              ? "You don't have any scheduled posts. Use the Schedule button in the composer to queue posts."
              : activeTab === 'DRAFTS'
              ? "You don't have any saved drafts."
              : activeTab === 'POSTED'
              ? "You haven't published any posts yet."
              : "You haven't created any posts yet. Click Create Post to get started."}
          </p>
          <button 
            onClick={openComposer}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2 text-xs sm:text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Create Post</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredPosts.map((post) => (
            <div 
              key={post._id} 
              className="bg-[#111116] border border-[#1f1f2e] hover:border-[#2d2d3f] transition-all rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4 flex-1 min-w-0">
                {post.globalMedia && post.globalMedia.length > 0 ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#181824] border border-[#2d2d3f] shrink-0">
                    <img 
                      src={post.globalMedia[0].url} 
                      alt="Media attachment" 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-[#181824] border border-[#2d2d3f] flex items-center justify-center shrink-0 text-gray-500">
                    <Share2 size={20} />
                  </div>
                )}

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {getStatusBadge(post.status, post.scheduledFor)}
                    {post.publications?.map((pub) => (
                      <span 
                        key={pub._id || pub.platform} 
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-[#1e1e2d] text-gray-300 border border-[#2a2a3e]"
                      >
                        {pub.platform}
                      </span>
                    ))}
                  </div>

                  <p className="text-white text-sm line-clamp-2 break-words">
                    {post.globalContent}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>Created {new Date(post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    {post.timezone && <span>• {post.timezone}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
