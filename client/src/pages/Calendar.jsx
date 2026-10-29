import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  X, 
  Share2,
  Image as ImageIcon,
  Video,
  MessageCircle,
  Briefcase,
  Bookmark
} from 'lucide-react';
import { useComposer } from '../context/ComposerContext';
import api from '../api/axios';

const DAYS_OF_WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

const PLATFORM_COLORS = {
  Instagram: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
  YouTube: 'text-red-400 bg-red-500/10 border-red-500/30',
  Facebook: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  LinkedIn: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
  Pinterest: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
};

const Calendar = () => {
  const { openComposer, refreshTrigger } = useComposer();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, SCHEDULED, PUBLISHED, DRAFT
  const [selectedPost, setSelectedPost] = useState(null);

  // Fetch posts from backend
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (error) {
      console.error('Failed to fetch posts for calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [refreshTrigger]);

  // Calendar month navigation
  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Date comparison helpers
  const isSameCalendarDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  const isToday = (date) => {
    return isSameCalendarDay(date, new Date());
  };

  // Build Month Grid
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Previous month trailing days
  const prevDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    prevDays.push({
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isCurrentMonth: false,
    });
  }

  // Current month active days
  const currentMonthDays = [];
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    currentMonthDays.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month leading days (to fill 35 or 42 grid slots)
  const totalSlotsSoFar = prevDays.length + currentMonthDays.length;
  const totalSlots = totalSlotsSoFar > 35 ? 42 : 35;
  const nextDaysCount = totalSlots - totalSlotsSoFar;

  const nextDays = [];
  for (let i = 1; i <= nextDaysCount; i++) {
    nextDays.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const calendarGrid = [...prevDays, ...currentMonthDays, ...nextDays];

  // Filter posts based on active filter
  const filteredPosts = posts.filter(post => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'SCHEDULED') return post.status === 'SCHEDULED';
    if (filterStatus === 'PUBLISHED') return post.status === 'PUBLISHED';
    if (filterStatus === 'DRAFT') return post.status === 'DRAFT';
    return true;
  });

  // Get posts for a specific calendar cell date
  const getPostsForDay = (cellDate) => {
    return filteredPosts.filter(post => {
      if (post.scheduledFor) {
        return isSameCalendarDay(new Date(post.scheduledFor), cellDate);
      }
      if (post.createdAt) {
        return isSameCalendarDay(new Date(post.createdAt), cellDate);
      }
      return false;
    });
  };

  // Quick schedule action on day click
  const handleScheduleForDate = (cellDate) => {
    const d = new Date(cellDate);
    const now = new Date();
    if (isSameCalendarDay(d, now)) {
      d.setHours(now.getHours() + 2, 0, 0, 0);
    } else {
      d.setHours(9, 0, 0, 0);
    }
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    const formatted = d.toISOString().slice(0, 16);
    openComposer(formatted);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            <Clock size={10} /> Scheduled
          </span>
        );
      case 'PUBLISHED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <CheckCircle2 size={10} /> Published
          </span>
        );
      case 'DRAFT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/40">
            <FileText size={10} /> Draft
          </span>
        );
      case 'PUBLISHING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
            <Clock size={10} className="animate-spin" /> Publishing
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-500/20 text-gray-300 border border-gray-500/40">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="text-gray-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1.5 flex items-center gap-3">
            <span>Content Calendar</span>
            {loading && <Clock size={18} className="animate-spin text-indigo-400" />}
          </h1>
          <p className="text-gray-400 text-sm">
            View, schedule, and plan all your upcoming social media publications.
          </p>
        </div>

        <button 
          onClick={() => openComposer()}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-lg shadow-indigo-600/20"
        >
          <Plus size={18} />
          <span>Schedule Post</span>
        </button>
      </div>

      {/* Control Bar: Month Switcher & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 bg-[#111116] border border-[#1f1f2e] p-3 rounded-2xl">
        {/* Month Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-[#181824] p-1 rounded-xl border border-[#2d2d3f]">
            <button 
              onClick={prevMonth}
              aria-label="Previous Month"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#252536] text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-base font-bold text-white w-44 text-center select-none">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={nextMonth}
              aria-label="Next Month"
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#252536] text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#181824] hover:bg-[#252536] border border-[#2d2d3f] text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Today
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1 bg-[#181824] p-1 rounded-xl border border-[#2d2d3f] overflow-x-auto">
          {[
            { id: 'ALL', label: `All (${posts.length})` },
            { id: 'SCHEDULED', label: `Scheduled (${posts.filter(p => p.status === 'SCHEDULED').length})` },
            { id: 'PUBLISHED', label: `Published (${posts.filter(p => p.status === 'PUBLISHED').length})` },
            { id: 'DRAFT', label: `Drafts (${posts.filter(p => p.status === 'DRAFT').length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-[#111116] border border-[#1f1f2e] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 border-b border-[#1f1f2e] bg-[#0d0d12]">
          {DAYS_OF_WEEK.map((day) => (
            <div 
              key={day} 
              className="py-3 text-center text-xs font-bold text-gray-400 tracking-wider select-none"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days Cells Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-[#1f1f2e]">
          {calendarGrid.map((cell, idx) => {
            const dayPosts = getPostsForDay(cell.date);
            const today = isToday(cell.date);
            const isCurrent = cell.isCurrentMonth;

            return (
              <div 
                key={idx}
                className={`min-h-[115px] sm:min-h-[130px] p-2 flex flex-col transition-colors relative group select-none ${
                  isCurrent ? 'bg-[#111116]' : 'bg-[#0d0d12]/60'
                } hover:bg-[#161622]`}
              >
                {/* Date Header inside cell */}
                <div className="flex items-center justify-between mb-1.5">
                  <span 
                    className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      today 
                        ? 'bg-indigo-600 text-white font-extrabold shadow-md shadow-indigo-600/50' 
                        : isCurrent 
                        ? 'text-gray-200' 
                        : 'text-gray-600'
                    }`}
                  >
                    {cell.date.getDate()}
                  </span>

                  {/* Quick Schedule '+' Button on Hover */}
                  <button
                    type="button"
                    onClick={() => handleScheduleForDate(cell.date)}
                    title={`Schedule post for ${cell.date.toLocaleDateString()}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity w-5 h-5 rounded-md bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white flex items-center justify-center cursor-pointer text-xs"
                  >
                    <Plus size={12} />
                  </button>
                </div>

                {/* Posts List for this day */}
                <div className="space-y-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                  {dayPosts.slice(0, 3).map((post) => {
                    const postTime = post.scheduledFor 
                      ? new Date(post.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                    const isScheduled = post.status === 'SCHEDULED';
                    const isPublished = post.status === 'PUBLISHED';

                    return (
                      <div
                        key={post._id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPost(post);
                        }}
                        className={`text-left text-[11px] px-2 py-1 rounded-lg border transition-all cursor-pointer truncate flex items-center gap-1.5 ${
                          isScheduled
                            ? 'bg-indigo-950/40 hover:bg-indigo-900/60 border-indigo-500/40 text-indigo-200 shadow-sm'
                            : isPublished
                            ? 'bg-emerald-950/40 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-200 shadow-sm'
                            : 'bg-[#1e1e2d] hover:bg-[#252538] border-[#2f2f45] text-gray-300'
                        }`}
                        title={post.globalContent}
                      >
                        {/* Time or icon */}
                        <span className="font-semibold text-[10px] opacity-75 shrink-0">
                          {postTime}
                        </span>

                        {/* Platform indicators */}
                        {post.publications && post.publications.length > 0 && (
                          <span className="text-[10px] font-bold px-1 rounded bg-black/40 shrink-0">
                            {post.publications[0].platform[0]}
                          </span>
                        )}

                        {/* Snippet */}
                        <span className="truncate flex-1">
                          {post.globalContent}
                        </span>
                      </div>
                    );
                  })}

                  {dayPosts.length > 3 && (
                    <div 
                      onClick={() => handleScheduleForDate(cell.date)}
                      className="text-[10px] text-center text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer pt-0.5"
                    >
                      +{dayPosts.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Details Modal */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="bg-[#111116] border border-[#2d2d3f] w-full max-w-lg rounded-2xl shadow-2xl p-6 flex flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1f1f2e] pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-indigo-400" />
                <h3 className="font-bold text-white text-base">Post Details</h3>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedPost(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#1a1a24] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Status & Timing */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-[#181824] p-3 rounded-xl border border-[#252536]">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Status:</span>
                {getStatusBadge(selectedPost.status)}
              </div>
              <div className="text-xs text-gray-300 flex items-center gap-1.5">
                <Clock size={13} className="text-gray-400" />
                <span>
                  {selectedPost.scheduledFor 
                    ? `Scheduled for: ${new Date(selectedPost.scheduledFor).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`
                    : `Created: ${new Date(selectedPost.createdAt).toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
                </span>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Platforms:</span>
              <div className="flex flex-wrap gap-2">
                {selectedPost.publications?.map((pub) => (
                  <span 
                    key={pub._id || pub.platform}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${PLATFORM_COLORS[pub.platform] || 'text-gray-300 bg-gray-800/40 border-gray-700'}`}
                  >
                    {pub.platform}
                  </span>
                ))}
              </div>
            </div>

            {/* Media preview if any */}
            {selectedPost.globalMedia && selectedPost.globalMedia.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-gray-400 block mb-1.5">Attached Media:</span>
                <div className="w-full max-h-48 rounded-xl overflow-hidden bg-[#181824] border border-[#2d2d3f] flex items-center justify-center">
                  <img 
                    src={selectedPost.globalMedia[0].url} 
                    alt="Media preview" 
                    className="max-h-48 object-contain w-auto"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
              </div>
            )}

            {/* Caption Content */}
            <div>
              <span className="text-xs font-semibold text-gray-400 block mb-1.5">Caption:</span>
              <div className="bg-[#181824] border border-[#252536] rounded-xl p-3.5 text-sm text-gray-200 whitespace-pre-wrap max-h-48 overflow-y-auto">
                {selectedPost.globalContent}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 bg-[#1a1a24] hover:bg-[#252536] text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-[#2d2d3f]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;
