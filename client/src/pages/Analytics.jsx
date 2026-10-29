import { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  Activity, 
  Heart, 
  MessageSquare, 
  Share2, 
  RefreshCw, 
  TrendingUp, 
  Eye, 
  Flame, 
  Users, 
  ArrowUpRight,
  Filter,
  BarChart3,
  Layers
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

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
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [topPosts, setTopPosts] = useState([]);

  const [timeRange, setTimeRange] = useState('7d');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');
  const [selectedMetric, setSelectedMetric] = useState('reach'); // 'reach' | 'engagement' | 'followers'

  const fetchOverview = async () => {
    try {
      const [statsRes, topPostsRes] = await Promise.all([
        api.get('/analytics/stats'),
        api.get('/analytics/top-posts?limit=10')
      ]);
      setStats(statsRes.data || []);
      setTopPosts(topPostsRes.data || []);
    } catch (error) {
      console.error('Failed to fetch analytics overview:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCharts = async (range, platform) => {
    try {
      setChartLoading(true);
      const res = await api.get(`/analytics/charts?range=${range}&platform=${platform}`);
      setChartData(res.data || []);
    } catch (error) {
      console.error('Failed to fetch chart series:', error);
    } finally {
      setChartLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  useEffect(() => {
    fetchCharts(timeRange, selectedPlatform);
  }, [timeRange, selectedPlatform]);

  const handleSync = async () => {
    if (syncing) return;
    try {
      setSyncing(true);
      const toastId = toast.loading('Syncing analytics across platforms...');
      const res = await api.post('/analytics/sync');
      toast.success(res.data?.message || 'Analytics synced successfully!', { id: toastId });
      await Promise.all([
        fetchOverview(),
        fetchCharts(timeRange, selectedPlatform)
      ]);
    } catch (error) {
      console.error('Failed to sync analytics:', error);
      toast.error('Failed to sync platform metrics.');
    } finally {
      setSyncing(false);
    }
  };

  const metricColors = {
    reach: { stroke: '#6366f1', fill: '#6366f1' },
    engagement: { stroke: '#ec4899', fill: '#ec4899' },
    followers: { stroke: '#10b981', fill: '#10b981' }
  };

  const iconMap = {
    'Total Followers': <Users className="text-indigo-400" size={20} />,
    'Total Engagement': <Heart className="text-pink-400" size={20} />,
    'Posts Published': <MessageSquare className="text-blue-400" size={20} />,
    'Audience Reach': <Share2 className="text-purple-400" size={20} />
  };

  return (
    <div className="text-gray-300 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5 flex items-center gap-2.5">
            <BarChart3 className="text-indigo-400" size={28} />
            Analytics & Performance
          </h1>
          <p className="text-gray-400 text-sm">
            Deep-dive metrics, audience reach trends, and multi-channel engagement insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSync}
            disabled={syncing}
            className={`border border-[#2d2d3f] bg-[#111116] hover:bg-[#1a1a24] hover:border-indigo-500/50 text-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
              syncing ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            <RefreshCw size={16} className={`text-indigo-400 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Syncing...' : 'Sync Live Metrics'}</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
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
                    {stat.change} vs prev month
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

      {/* Main Trends & Time Series Chart */}
      <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Growth & Engagement Timeline</h2>
            <p className="text-xs text-gray-400">
              Aggregated daily performance records per platform.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Metric Switcher */}
            <div className="flex bg-[#181824] p-1 rounded-xl border border-[#2d2d3f] text-xs">
              <button
                onClick={() => setSelectedMetric('reach')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedMetric === 'reach'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Reach
              </button>
              <button
                onClick={() => setSelectedMetric('engagement')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedMetric === 'engagement'
                    ? 'bg-pink-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Engagement
              </button>
              <button
                onClick={() => setSelectedMetric('followers')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedMetric === 'followers'
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
              <option value="ALL">All Platforms</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Pinterest">Pinterest</option>
            </select>

            {/* Time Range */}
            <div className="flex bg-[#181824] p-1 rounded-xl border border-[#2d2d3f] text-xs">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === '7d'
                    ? 'bg-[#28283c] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  timeRange === '30d'
                    ? 'bg-[#28283c] text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>
        </div>

        {/* Chart View */}
        <div className="h-80 w-full pt-2">
          {chartLoading ? (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm gap-2">
              <RefreshCw size={16} className="animate-spin text-indigo-400" />
              <span>Fetching timeline data...</span>
            </div>
          ) : chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 text-sm gap-2 border border-dashed border-[#1f1f2e] rounded-xl">
              <p>No snapshot data recorded for this channel. Click "Sync Live Metrics" to synchronize.</p>
              <button
                onClick={handleSync}
                className="bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 rounded-lg text-xs"
              >
                Sync Now
              </button>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="analyticsMetricGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={metricColors[selectedMetric].fill} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={metricColors[selectedMetric].fill} stopOpacity={0}/>
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
                <Tooltip content={<CustomTooltip metric={selectedMetric} />} />
                <Area 
                  type="monotone" 
                  dataKey={selectedMetric} 
                  stroke={metricColors[selectedMetric].stroke} 
                  strokeWidth={2.5}
                  fillOpacity={1} 
                  fill="url(#analyticsMetricGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Top Posts Ranking Section */}
      <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="text-rose-400" size={20} />
            <h2 className="text-lg font-bold text-white">Top Performing Content</h2>
          </div>
          <span className="text-xs text-gray-400">Ranked by Engagement Rate & Views</span>
        </div>

        {topPosts.length === 0 ? (
          <div className="text-gray-400 text-sm py-8 text-center bg-[#181824]/50 rounded-xl border border-[#2d2d3f]">
            No published posts with performance metrics yet. Publish to see metrics!
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
    </div>
  );
};

export default Analytics;
