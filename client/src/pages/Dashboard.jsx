import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
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
  Send,
  RefreshCw,
  TrendingUp,
  Eye,
  Flame,
  BarChart2,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useComposer } from '../context/ComposerContext';

const platformColors = {
  Instagram: { text: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
  Facebook: { text: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
  YouTube: { text: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
  LinkedIn: { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
  Pinterest: { text: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' },
  Default: { text: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' }
};

const CustomTooltip = ({ active, payload, label, metric }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#181824] border border-[#2d2d3f] p-3 rounded-xl shadow-2xl text-xs space-y-1.5 min-w-[150px]">
        <p className="font-semibold text-gray-300 border-b border-[#2d2d3f] pb-1">{label}</p>
        <div className="flex items-center justify-between gap-4">
          <span className="text-gray-400 capitalize">{metric}:</span>
          <span className="font-bold text-white text-sm">
            {Number(payload[0].value || 0).toLocaleString()}
          </span>
        </div>
        {metric === 'engagement' && (
          <div className="pt-1 border-t border-[#2d2d3f]/60 space-y-0.5 text-[11px] text-gray-400">
            <div className="flex justify-between">
              <span>Likes:</span>
              <span className="text-gray-200">{Number(data.likes || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Comments:</span>
              <span className="text-gray-200">{Number(data.comments || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Shares:</span>
              <span className="text-gray-200">{Number(data.shares || 0).toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openComposer, refreshTrigger } = useComposer();

  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  // Chart Controls
  const [chartRange, setChartRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [chartMetric, setChartMetric] = useState('reach'); // 'reach' | 'engagement' | 'followers'

  const fetchData = async () => {
    try {
      const [postsRes, statsRes, topPostsRes] = await Promise.all([
        api.get('/posts'),
        api.get('/analytics/stats'),
        api.get('/analytics/top-posts?limit=5')
      ]);
      setPosts(postsRes.data?.slice(0, 3) || []);
      setStats(statsRes.data || []);
      setTopPosts(topPostsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChartData = async (range, platform) => {
    try {
      setChartLoading(true);
      const res = await api.get(`/analytics/charts?range=${range}&platform=${platform}`);
      setChartData(res.data || []);
    } catch (error) {
      console.error('Error fetching chart data:', error);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    fetchChartData(chartRange, selectedPlatform);
  }, [chartRange, selectedPlatform]);

  const handleSyncAnalytics = async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      const toastId = toast.loading('Syncing real-time analytics across all channels...');
      const res = await api.post('/analytics/sync');
      toast.success(res.data?.message || 'Live analytics synced successfully!', { id: toastId });
      // Refresh all views
      await Promise.all([
        fetchData(),
        fetchChartData(chartRange, selectedPlatform)
      ]);
    } catch (error) {
      console.error('Failed to sync analytics:', error);
      toast.error(error.response?.data?.message || 'Failed to sync platform analytics.');
    } finally {
      setSyncing(false);
    }
  };

  const iconMap = {
    'Total Followers': <Activity className="text-indigo-400" size={20} />,
    'Total Engagement': <Heart className="text-pink-400" size={20} />,
    'Posts Published': <MessageSquare className="text-blue-400" size={20} />,
    'Audience Reach': <Share2 className="text-purple-400" size={20} />
  };

  const metricColors = {
    reach: { stroke: '#6366f1', fill: '#6366f1' },
    engagement: { stroke: '#ec4899', fill: '#ec4899' },
    followers: { stroke: '#10b981', fill: '#10b981' }
  };

  // Quick summary calculation for current chart
  const totalMetricSum = chartData.reduce((acc, curr) => acc + (Number(curr[chartMetric]) || 0), 0);
  const avgMetric = chartData.length > 0 ? Math.round(totalMetricSum / chartData.length) : 0;
  const maxDay = chartData.reduce((max, curr) => 
    (Number(curr[chartMetric]) || 0) > (Number(max[chartMetric]) || 0) ? curr : max, 
    chartData[0] || {}
  );

  return (
    <div className="text-gray-300 space-y-8">
      {/* Welcome & Sync Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5 flex items-center gap-2">
            Welcome back, {user?.username || user?.name || 'User'} 👋
          </h1>
          <p className="text-gray-400 text-sm">
            Live multi-channel performance, engagement rates, and recent publications.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSyncAnalytics}
            disabled={syncing}
            className={`border border-[#2d2d3f] bg-[#111116] hover:bg-[#1a1a24] hover:border-indigo-500/50 text-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
              syncing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            title="Pull latest live engagement, reach, and follower metrics"
          >
            <RefreshCw size={16} className={`text-indigo-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Live Data'}</span>
          </button>
          
          <button 
            onClick={() => openComposer()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 shadow-lg shadow-indigo-600/20"
          >
            <Plus size={18} />
            <span>Create Post</span>
          </button>
        </div>
      </div>

      {/* Top Stat Metrics Cards */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Interactive Performance & Trends Section */}
      <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={20} className="text-indigo-400" />
              <h2 className="text-lg font-bold text-white">Performance Analytics & Trends</h2>
            </div>
            <p className="text-xs text-gray-400">
              Track growth, views, and interactions across connected social accounts.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Metric Switcher */}
            <div className="flex bg-[#181824] p-1 rounded-xl border border-[#2d2d3f] text-xs">
              <button
                onClick={() => setChartMetric('reach')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  chartMetric === 'reach'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reach
              </button>
              <button
                onClick={() => setChartMetric('engagement')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  chartMetric === 'engagement'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Engagement
              </button>
              <button
                onClick={() => setChartMetric('followers')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  chartMetric === 'followers'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Followers
              </button>
            </div>

            {/* Platform Filter */}
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className="bg-[#181824] border border-[#2d2d3f] text-gray-200 text-xs rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="ALL">All Channels</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Pinterest">Pinterest</option>
            </select>

            {/* Time Range Toggle */}
            <div className="flex bg-[#181824] p-1 rounded-xl border border-[#2d2d3f] text-xs">
              <button
                onClick={() => setChartRange('7d')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  chartRange === '7d'
                    ? 'bg-[#28283c] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartRange('30d')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  chartRange === '30d'
                    ? 'bg-[#28283c] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="h-72 w-full pt-2">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm gap-2">
              <RefreshCw size={16} className="animate-spin text-indigo-400" />
              <span>Loading trend metrics...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2 border border-dashed border-[#1f1f2e] rounded-xl">
              <p>No snapshot data found for this channel. Click "Sync Live Data" to generate.</p>
              <button
                onClick={handleSyncAnalytics}
                className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs"
              >
                Sync Now
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartMetricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricColors[chartMetric].fill} stopOpacity={0.35}/>
                    <stop offset="95%" stopColor={metricColors[chartMetric].fill} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#6b7280" 
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickLine={false}
                  axisLine={{ stroke: '#2d2d3f' }}
                />
                <YAxis 
                  stroke="#6b7280" 
                  tick={{ fill: '#9ca3af', fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}
                />
                <Tooltip content={<CustomTooltip metric={chartMetric} />} />
                <Area 
                  type="monotone" 
                  dataKey={chartMetric} 
                  stroke={metricColors[chartMetric].stroke} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#chartMetricGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Quick Analytics Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-[#1f1f2e] text-xs">
          <div className="bg-[#181824]/60 p-3 rounded-xl border border-[#2d2d3f]/60">
            <span className="text-gray-400 block mb-0.5">Total in Period:</span>
            <span className="text-white font-bold text-sm">
              {totalMetricSum.toLocaleString()} {chartMetric}
            </span>
          </div>
          <div className="bg-[#181824]/60 p-3 rounded-xl border border-[#2d2d3f]/60">
            <span className="text-gray-400 block mb-0.5">Daily Average:</span>
            <span className="text-white font-bold text-sm">
              {avgMetric.toLocaleString()} / day
            </span>
          </div>
          <div className="bg-[#181824]/60 p-3 rounded-xl border border-[#2d2d3f]/60">
            <span className="text-gray-400 block mb-0.5">Peak Day:</span>
            <span className="text-white font-bold text-sm">
              {maxDay?.date ? `${maxDay.date} (${(maxDay[chartMetric] || 0).toLocaleString()})` : 'N/A'}
            </span>
          </div>
        </div>
      </div>

      {/* Top Performing Posts Ranking */}
      <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="text-rose-400" size={20} />
            <h2 className="text-lg font-bold text-white">Top Performing Content</h2>
          </div>
          <button 
            onClick={() => navigate('/posts')}
            className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors cursor-pointer flex items-center gap-1"
          >
            <span>Manage All Posts</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {topPosts.length === 0 ? (
          <div className="text-gray-400 text-sm py-8 text-center bg-[#181824]/50 rounded-xl border border-[#2d2d3f] flex flex-col items-center justify-center gap-2">
            <Sparkles size={24} className="text-indigo-400 opacity-60" />
            <p>Publish posts across your platforms to automatically track live engagement rankings!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topPosts.map((item, index) => {
              const pStyle = platformColors[item.platform] || platformColors.Default;
              return (
                <div 
                  key={item._id || index}
                  className="p-4 rounded-xl border border-[#2d2d3f] bg-[#181824]/60 hover:bg-[#1e1e2d] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#28283c] border border-[#3d3d52] flex items-center justify-center text-xs font-extrabold text-indigo-400 shrink-0">
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${pStyle.bg} ${pStyle.text} ${pStyle.border}`}>
                          {item.platform}
                        </span>
                        <span className="text-xs text-gray-400">
                          {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-200 line-clamp-1 font-medium">
                        {item.contentSnippet || 'Social Media Update'}
                      </p>
                    </div>
                  </div>

                  {/* Metrics Badges */}
                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto flex-wrap">
                    <div className="flex items-center gap-1 text-xs text-gray-300 bg-[#12121a] px-2.5 py-1 rounded-lg border border-[#2d2d3f]" title="Views">
                      <Eye size={13} className="text-indigo-400" />
                      <span>{Number(item.metrics?.views || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-300 bg-[#12121a] px-2.5 py-1 rounded-lg border border-[#2d2d3f]" title="Likes">
                      <Heart size={13} className="text-pink-400" />
                      <span>{Number(item.metrics?.likes || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-300 bg-[#12121a] px-2.5 py-1 rounded-lg border border-[#2d2d3f]" title="Comments">
                      <MessageSquare size={13} className="text-blue-400" />
                      <span>{Number(item.metrics?.comments || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-300 bg-[#12121a] px-2.5 py-1 rounded-lg border border-[#2d2d3f]" title="Shares">
                      <Share2 size={13} className="text-emerald-400" />
                      <span>{Number(item.metrics?.shares || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20" title="Engagement Rate">
                      {item.metrics?.engagementRate || 0}% ER
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
