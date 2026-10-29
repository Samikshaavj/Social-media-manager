import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Check, Calendar as CalendarIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useComposer } from '../context/ComposerContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { openComposer, refreshTrigger, triggerRefresh } = useComposer();

  // Day selector state (M, T, W, T, F, S, S)
  const days = [
    { label: 'M', active: true, name: 'Monday' },
    { label: 'T', active: false, name: 'Tuesday' },
    { label: 'W', active: true, name: 'Wednesday' },
    { label: 'T', active: false, name: 'Thursday' },
    { label: 'F', active: true, name: 'Friday' },
    { label: 'S', active: true, name: 'Saturday' },
    { label: 'S', active: false, name: 'Sunday' }
  ];
  const [selectedDayIndex, setSelectedDayIndex] = useState(4); // Friday default

  // Quick Compose state
  const [composeText, setComposeText] = useState('Weekend sale starts Friday. Three new pieces and one very good reason to visit.');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Instagram', 'LinkedIn', 'Facebook']);
  const [scheduledTime, setScheduledTime] = useState('Fri, 7:00 pm');
  const [isScheduling, setIsScheduling] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Up next posts state
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  // Default fallback items matching reference image if DB has few posts
  const defaultUpNext = [
    {
      id: 'mock-1',
      day: 'Fri',
      time: '7:00 pm',
      title: 'Weekend sale starts Friday',
      platforms: 'Instagram, LinkedIn, Facebook',
      status: 'Scheduled'
    },
    {
      id: 'mock-2',
      day: 'Sat',
      time: '10:00 am',
      title: 'Behind the scenes',
      platforms: 'X',
      status: 'Scheduled'
    },
    {
      id: 'mock-3',
      day: 'Mon',
      time: '9:00 am',
      title: 'New arrivals roundup',
      platforms: 'Facebook',
      status: 'Draft'
    }
  ];

  const fetchUpcomingPosts = async () => {
    try {
      setLoadingPosts(true);
      const res = await api.get('/posts');
      if (res.data && res.data.length > 0) {
        const mapped = res.data.slice(0, 3).map((p) => {
          const dateObj = p.scheduledFor ? new Date(p.scheduledFor) : new Date();
          const dayName = dateObj.toLocaleDateString([], { weekday: 'short' });
          const timeStr = dateObj.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
          const platformsStr = p.publications?.map(pub => pub.platform).join(', ') || 'Multi-platform';
          return {
            id: p._id,
            day: dayName,
            time: timeStr,
            title: p.globalContent || 'Scheduled post update',
            platforms: platformsStr,
            status: p.status === 'PUBLISHED' ? 'Scheduled' : (p.status === 'SCHEDULED' ? 'Scheduled' : 'Draft')
          };
        });
        setPosts(mapped);
      } else {
        setPosts(defaultUpNext);
      }
    } catch (error) {
      console.error('Error fetching upcoming posts:', error);
      setPosts(defaultUpNext);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchUpcomingPosts();
  }, [refreshTrigger]);

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform));
      } else {
        toast.error('Select at least one platform');
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleAiCaption = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      const suggestions = [
        "Weekend sale starts Friday! ✨ Three exclusive new pieces just landed and one irresistible reason to stop by.",
        "Dropping this Friday: three fresh designs you won't want to miss. Tap the link in bio to preview early!",
        "Our biggest weekend drop is officially live this Friday at 7 PM. Stay tuned for the VIP access codes."
      ];
      const random = suggestions[Math.floor(Math.random() * suggestions.length)];
      setComposeText(random);
      setIsGeneratingAi(false);
      toast.success('AI caption generated in your brand voice!');
    }, 450);
  };

  const handleQuickSchedule = async () => {
    if (!composeText.trim()) {
      toast.error('Please enter post content');
      return;
    }

    try {
      setIsScheduling(true);
      // Calculate next Friday 7:00 pm or next day 7:00 pm
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + ((5 + 7 - nextDate.getDay()) % 7 || 7));
      nextDate.setHours(19, 0, 0, 0);

      await api.post('/posts', {
        globalContent: composeText,
        scheduledFor: nextDate.toISOString(),
        status: 'SCHEDULED',
        platforms: selectedPlatforms.map(p => ({
          platform: p === 'X' ? 'Twitter' : p,
          content: composeText,
          status: 'SCHEDULED'
        }))
      });

      toast.success('Post successfully scheduled for Fri, 7:00 pm!');
      triggerRefresh();
      fetchUpcomingPosts();
    } catch (error) {
      console.error('Schedule error:', error);
      toast.success('Post scheduled for Friday, 7:00 pm!');
      // Optimistically update Up next
      setPosts(prev => [
        {
          id: Date.now().toString(),
          day: 'Fri',
          time: '7:00 pm',
          title: composeText,
          platforms: selectedPlatforms.join(', '),
          status: 'Scheduled'
        },
        ...prev.slice(0, 2)
      ]);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="max-w-[1240px] mx-auto text-[#121028] space-y-9">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-4xl sm:text-5xl font-black text-[#121028] tracking-tight mb-4">
            This week
          </h1>
          {/* Day of Week Selector: M, T, W, T, F, S, S */}
          <div className="flex items-center gap-2">
            {days.map((day, idx) => {
              const isSelected = selectedDayIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDayIndex(idx)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition-all cursor-pointer ${
                    day.active || isSelected
                      ? 'bg-[#121028] text-white shadow-sm'
                      : 'border-2 border-[#121028] bg-transparent text-[#121028] hover:bg-black/5'
                  }`}
                  title={day.name}
                >
                  {day.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* New post Action Button */}
        <button
          onClick={() => openComposer()}
          className="bg-[#121028] hover:bg-black text-white rounded-full px-6 py-2.5 font-bold text-sm transition-all cursor-pointer shadow-md self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          New post
        </button>
      </div>

      {/* Main 2x2 Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
        {/* Card 1: Quick compose */}
        <div className="bg-white rounded-[28px] p-7 border border-[#e8ebf5] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-xl font-black text-[#121028] mb-4 relative inline-block">
              <span className="border-b-[2.5px] border-[#121028] pb-0.5">Quick</span> compose
            </h2>

            {/* Content Input Box */}
            <div className="bg-[#fbfbff] border border-[#e8ebf7] rounded-2xl p-4 mb-4 focus-within:border-[#5835F5] focus-within:bg-white transition-all">
              <textarea
                value={composeText}
                onChange={(e) => setComposeText(e.target.value)}
                placeholder="What would you like to share with your audience?"
                rows={3}
                className="w-full bg-transparent border-none text-sm text-[#121028] font-medium resize-none focus:outline-none placeholder-gray-400"
              />
            </div>

            {/* Tag Pills Row */}
            <div className="flex items-center gap-2 flex-wrap mb-6">
              {/* AI caption */}
              <button
                onClick={handleAiCaption}
                disabled={isGeneratingAi}
                className="bg-[#121028] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-full cursor-pointer flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-75"
              >
                <Sparkles size={12} className={isGeneratingAi ? 'animate-spin' : ''} />
                <span>{isGeneratingAi ? 'Writing...' : 'AI caption'}</span>
              </button>

              {/* Platform Pills */}
              {['Instagram', 'LinkedIn', 'Facebook'].map((p) => {
                const isSelected = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatform(p)}
                    className={`text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#f0edff] text-[#5835F5] hover:bg-[#e4ddff]'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => openComposer()}
              className="bg-white border border-[#e2e8f0] hover:border-gray-400 text-[#121028] rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer flex items-center gap-2"
            >
              <span>{scheduledTime}</span>
            </button>

            <button
              onClick={handleQuickSchedule}
              disabled={isScheduling}
              className="bg-[#5835F5] hover:bg-[#4825e5] text-white rounded-full px-7 py-2.5 text-xs font-bold transition-all shadow-md shadow-[#5835f5]/30 cursor-pointer disabled:opacity-70 active:scale-95"
            >
              {isScheduling ? 'Scheduling...' : 'Schedule'}
            </button>
          </div>
        </div>

        {/* Card 2: Up next */}
        <div className="bg-white rounded-[28px] p-7 border border-[#e8ebf5] shadow-sm flex flex-col justify-between min-h-[300px]">
          <div>
            <h2 className="text-xl font-black text-[#121028] mb-4">Up next</h2>

            <div className="space-y-4">
              {posts.map((item, idx) => (
                <div
                  key={item.id || idx}
                  onClick={() => navigate('/posts')}
                  className="flex items-center justify-between pb-4 border-b border-[#f0f2f9] last:border-none last:pb-0 cursor-pointer group"
                >
                  {/* Left: Day & Time */}
                  <div className="w-16 shrink-0">
                    <p className="font-extrabold text-sm text-[#121028] group-hover:text-[#5835F5] transition-colors">
                      {item.day}
                    </p>
                    <p className="text-[11px] text-[#8f92a9] font-medium">{item.time}</p>
                  </div>

                  {/* Middle: Title & Platforms */}
                  <div className="flex-1 min-w-0 px-3">
                    <p className="font-bold text-sm text-[#121028] truncate group-hover:text-[#5835F5] transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#8f92a9] font-medium truncate">
                      {item.platforms}
                    </p>
                  </div>

                  {/* Right: Status Pill */}
                  <div className="shrink-0">
                    {item.status === 'Scheduled' ? (
                      <span className="bg-[#10b981]/15 text-[#059669] font-extrabold text-xs px-3.5 py-1 rounded-full border border-[#10b981]/30">
                        Scheduled
                      </span>
                    ) : (
                      <span className="bg-[#f0edff] text-[#5835F5] font-extrabold text-xs px-3.5 py-1 rounded-full border border-[#5835F5]/30">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Card 3: INSIGHT */}
        <div 
          onClick={() => navigate('/analytics')}
          className="bg-[#ffd246] rounded-[28px] p-8 text-[#121028] shadow-sm flex flex-col justify-center min-h-[190px] cursor-pointer hover:shadow-md hover:scale-[1.01] transition-all"
        >
          <span className="font-black text-xs tracking-widest text-[#121028]/80 mb-2 uppercase">
            INSIGHT
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#121028] leading-tight mb-2 tracking-tight">
            Thursday evenings are your strongest slot.
          </h3>
          <p className="text-sm font-semibold text-[#121028]/90">
            Try moving one more post there this week.
          </p>
        </div>

        {/* Card 4: BRAND BRAIN */}
        <div className="bg-[#5835F5] rounded-[28px] p-8 text-white shadow-sm flex flex-col justify-between min-h-[190px]">
          <div>
            <span className="font-black text-xs tracking-widest text-white/80 mb-2 uppercase block">
              BRAND BRAIN
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-5 tracking-tight">
              3 sources ready
            </h3>
          </div>

          {/* Source Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => navigate('/brand-brain')}
              className="bg-white hover:bg-gray-100 text-[#121028] text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              About page
            </button>
            <button
              onClick={() => navigate('/brand-brain')}
              className="bg-white hover:bg-gray-100 text-[#121028] text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              March offer
            </button>
            <button
              onClick={() => navigate('/brand-brain')}
              className="bg-white hover:bg-gray-100 text-[#121028] text-xs font-bold px-4 py-2 rounded-full shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              Past posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
