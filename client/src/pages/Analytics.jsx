const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalyticsData();
  }, [timeRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analytics?range=${timeRange}`);
      setStats(response.data.stats);
      setChartData(response.data.chartData);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-gray-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-gray-400">View performance metrics across all connected platforms.</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#111116] border border-[#1f1f2e] text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-[#111116] border border-[#1f1f2e] border-dashed rounded-xl h-64 flex items-center justify-center">
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-[#111116] border border-[#1f1f2e] p-5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Total Engagement</span>
                <Activity className="w-5 h-5 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats?.totalEngagement || '0'}</div>
            </div>
            <div className="bg-[#111116] border border-[#1f1f2e] p-5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Likes</span>
                <Heart className="w-5 h-5 text-rose-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats?.likes || '0'}</div>
            </div>
            <div className="bg-[#111116] border border-[#1f1f2e] p-5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Comments</span>
                <MessageSquare className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats?.comments || '0'}</div>
            </div>
            <div className="bg-[#111116] border border-[#1f1f2e] p-5 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Shares</span>
                <Share2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">{stats?.shares || '0'}</div>
            </div>
          </div>

          <div className="bg-[#111116] border border-[#1f1f2e] p-6 rounded-xl">
            <h2 className="text-lg font-semibold text-white mb-6">Performance Overview</h2>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1f1f2e" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#111116', borderColor: '#1f1f2e', color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#6366f1" fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
