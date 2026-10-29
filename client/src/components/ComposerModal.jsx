import { useState, useEffect } from 'react';
import { useComposer } from '../context/ComposerContext';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { X, Image as ImageIcon, Video, MessageCircle, Briefcase, Bookmark, Calendar, Send, Sparkles } from 'lucide-react';

const platformsList = [
  { id: 'Instagram', icon: <ImageIcon size={20} />, color: 'hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/10' },
  { id: 'YouTube', icon: <Video size={20} />, color: 'hover:text-red-500 hover:border-red-500 hover:bg-red-500/10' },
  { id: 'Facebook', icon: <MessageCircle size={20} />, color: 'hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10' },
  { id: 'LinkedIn', icon: <Briefcase size={20} />, color: 'hover:text-blue-400 hover:border-blue-400 hover:bg-blue-400/10' },
  { id: 'Pinterest', icon: <Bookmark size={20} />, color: 'hover:text-red-600 hover:border-red-600 hover:bg-red-600/10' },
];

const ComposerModal = () => {
  const { isComposerOpen, closeComposer, notifyPostCreated } = useComposer();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  const getDefaultScheduleTime = (hoursFromNow = 2) => {
    const d = new Date();
    d.setHours(d.getHours() + hoursFromNow);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  const getTomorrowTime = (hour = 9) => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(hour, 0, 0, 0);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    if (!isComposerOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeComposer();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isComposerOpen, closeComposer]);

  if (!isComposerOpen) return null;

  const handleAIWrite = async () => {
    if (!content.trim()) {
      toast.error('Please write a few words first to guide the AI.');
      return;
    }
    
    try {
      setIsGeneratingAI(true);
      const { data } = await api.post('/ai/generate-caption', { prompt: content });
      setContent(data.caption);
      toast.success('AI caption generated!');
    } catch (error) {
      console.error('Failed to generate caption:', error);
      toast.error('Failed to generate caption with AI.');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('media', file);

    try {
      setIsUploading(true);
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      // Relative URL works on both dev (via Vite proxy) and Render production
      const fullUrl = data.url;
      setMediaFiles(prev => [...prev, { id: data._id, url: fullUrl, type: data.type }]);
      toast.success('Media uploaded successfully!');
    } catch (error) {
      console.error('File upload failed', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeMedia = (index) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!content.trim()) {
      toast.error('Please enter content for your post.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/posts', {
        globalContent: content,
        platforms: selectedPlatforms,
        mediaAssets: mediaFiles.map(m => m.id),
        scheduledFor: null,
      });
      closeComposer();
      setContent('');
      setSelectedPlatforms([]);
      setMediaFiles([]);
      setScheduledDate('');
      setIsScheduling(false);
      notifyPostCreated?.();
      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Failed to publish post:', error);
      toast.error(error.response?.data?.message || 'Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedulePost = async () => {
    if (!content.trim()) {
      toast.error('Please enter content for your post.');
      return;
    }
    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform.');
      return;
    }
    if (!scheduledDate) {
      toast.error('Please choose a date and time to schedule your post.');
      return;
    }
    if (new Date(scheduledDate) <= new Date()) {
      toast.error('Scheduled time must be in the future.');
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post('/posts', {
        globalContent: content,
        platforms: selectedPlatforms,
        mediaAssets: mediaFiles.map(m => m.id),
        scheduledFor: new Date(scheduledDate).toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: 'SCHEDULED',
      });
      closeComposer();
      setContent('');
      setSelectedPlatforms([]);
      setMediaFiles([]);
      setScheduledDate('');
      setIsScheduling(false);
      notifyPostCreated?.();
      toast.success(`Post scheduled for ${new Date(scheduledDate).toLocaleString()}!`);
    } catch (error) {
      console.error('Failed to schedule post:', error);
      toast.error(error.response?.data?.message || 'Failed to schedule post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!content.trim()) {
      toast.error('Please enter some content to save as draft.');
      return;
    }
    try {
      setIsSubmitting(true);
      await api.post('/posts', {
        globalContent: content,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : ['Instagram'],
        mediaAssets: mediaFiles.map(m => m.id),
        status: 'DRAFT',
      });
      closeComposer();
      setContent('');
      setSelectedPlatforms([]);
      setMediaFiles([]);
      setScheduledDate('');
      setIsScheduling(false);
      notifyPostCreated?.();
      toast.success('Post saved as draft!');
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast.error(error.response?.data?.message || 'Failed to save draft.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="composer-overlay fixed inset-0 z-50 flex flex-col items-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto"
      style={{ overflowY: 'auto' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeComposer();
      }}
    >
      <div 
        className="composer-card bg-[#111116] border border-[#1f1f2e] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col my-auto overflow-hidden"
        style={{
          maxHeight: 'calc(100vh - 2rem)',
          minHeight: 0,
        }}
      >
        
        {/* Header - Fixed at Top */}
        <div className="composer-header flex items-center justify-between p-4 border-b border-[#1f1f2e] shrink-0">
          <h2 className="text-lg font-bold text-white">Create New Post</h2>
          <button 
            type="button"
            onClick={closeComposer} 
            className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#1a1a24] cursor-pointer"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area - Scrollable */}
        <div 
          className="composer-body p-4 sm:p-5 flex flex-col gap-4 overflow-y-auto flex-1 min-h-0"
          style={{ overflowY: 'auto', minHeight: 0 }}
        >
          
          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Select Platforms</label>
            <div className="flex gap-2.5 flex-wrap">
              {platformsList.map(platform => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    type="button"
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-sm font-medium transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                        : `bg-[#1a1a24] border-[#2d2d3f] text-gray-400 ${platform.color}`
                    }`}
                  >
                    {platform.icon}
                    <span>{platform.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Editor */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Post Content</label>
              <button 
                type="button"
                onClick={handleAIWrite}
                disabled={isGeneratingAI || !content.trim()}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 hover:from-purple-500/30 hover:to-indigo-500/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <Sparkles size={13} />
                {isGeneratingAI ? 'Generating...' : 'AI Write'}
              </button>
            </div>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              className="w-full bg-[#1a1a24] border border-[#2d2d3f] rounded-xl p-3.5 text-sm text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y min-h-[80px]"
              placeholder="What do you want to share with your audience? Write a short prompt and click 'AI Write' to generate a full caption."
            />
          </div>

          {/* Media Upload Area */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Media Assets</label>
            
            {mediaFiles.length > 0 && (
              <div className="flex gap-3 mb-3 overflow-x-auto pb-1">
                {mediaFiles.map((media, idx) => (
                  <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#2d2d3f] shrink-0 group">
                    {media.type === 'VIDEO' ? (
                      <video src={media.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={media.url} alt="upload" className="w-full h-full object-cover" />
                    )}
                    <button 
                      type="button"
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 bg-black/75 hover:bg-black p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Remove"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="border border-dashed border-[#2d2d3f] rounded-xl p-3.5 flex items-center justify-center gap-3 text-gray-400 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer bg-[#1a1a24]/40 relative">
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploading} />
              {isUploading ? (
                <div className="text-xs font-medium animate-pulse text-indigo-400">Uploading media...</div>
              ) : (
                <>
                  <ImageIcon size={20} className="text-indigo-400" />
                  <span className="text-xs font-medium">
                    {mediaFiles.length > 0 ? 'Click to add more media' : 'Click or drop image/video to upload'}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ({selectedPlatforms.includes('YouTube') ? 'MP4 only' : 'JPG, PNG, MP4'})
                  </span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Schedule Picker Bar - Docked right above footer for instant visibility */}
        {isScheduling && (
          <div className="composer-schedule-panel bg-[#14141e] border-t border-indigo-500/40 p-3.5 sm:px-6 flex flex-col gap-2.5 shrink-0 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                <Calendar size={14} />
                <span>Schedule Post Publication</span>
              </div>
              <button 
                type="button" 
                onClick={() => setIsScheduling(false)} 
                className="text-gray-400 hover:text-white text-xs cursor-pointer flex items-center gap-1"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <input 
                type="datetime-local" 
                value={scheduledDate}
                min={getMinDateTime()}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-[#0e0e14] border border-indigo-500/40 focus:border-indigo-400 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
              />
              <div className="flex gap-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => setScheduledDate(getDefaultScheduleTime(2))}
                  className="px-2.5 py-1 bg-[#232332] hover:bg-indigo-600/30 text-gray-300 hover:text-white border border-[#2d2d3f] rounded-lg text-xs transition-colors cursor-pointer"
                >
                  +2 hours
                </button>
                <button
                  type="button"
                  onClick={() => setScheduledDate(getTomorrowTime(9))}
                  className="px-2.5 py-1 bg-[#232332] hover:bg-indigo-600/30 text-gray-300 hover:text-white border border-[#2d2d3f] rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Tomorrow 9:00 AM
                </button>
                <button
                  type="button"
                  onClick={() => setScheduledDate(getTomorrowTime(18))}
                  className="px-2.5 py-1 bg-[#232332] hover:bg-indigo-600/30 text-gray-300 hover:text-white border border-[#2d2d3f] rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Tomorrow 6:00 PM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Actions - Fixed at Bottom */}
        <div className="composer-footer p-4 border-t border-[#1f1f2e] bg-[#0B0B0F] flex items-center justify-between shrink-0">
          <button 
            type="button" 
            onClick={handleSaveDraft}
            disabled={!content.trim() || isSubmitting}
            className="text-gray-400 hover:text-white transition-colors px-3 py-2 text-xs font-medium cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save as Draft
          </button>
          
          <div className="flex gap-2.5">
            <button 
              type="button" 
              onClick={() => {
                if (!isScheduling) {
                  setIsScheduling(true);
                  if (!scheduledDate) setScheduledDate(getDefaultScheduleTime(2));
                } else {
                  handleSchedulePost();
                }
              }}
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isScheduling 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-500 shadow-md shadow-indigo-500/30' 
                  : 'border-[#2d2d3f] bg-[#1a1a24] hover:bg-[#2d2d3f] text-white'
              }`}
            >
              <Calendar size={14} />
              {isSubmitting && isScheduling ? 'Scheduling...' : isScheduling ? 'Confirm Schedule' : 'Schedule'}
            </button>
            <button 
              type="button"
              onClick={handlePublish}
              disabled={!content || selectedPlatforms.length === 0 || isSubmitting}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xs font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-indigo-500/20"
            >
              <Send size={14} />
              {isSubmitting && !isScheduling ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComposerModal;
