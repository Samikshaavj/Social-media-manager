import { useState } from 'react';
import { useComposer } from '../context/ComposerContext';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { X, Image as ImageIcon, Video, MessageCircle, Briefcase, Bookmark, Calendar, Send } from 'lucide-react';

const platformsList = [
  { id: 'Instagram', icon: <ImageIcon size={20} />, color: 'hover:text-pink-500 hover:border-pink-500 hover:bg-pink-500/10' },
  { id: 'YouTube', icon: <Video size={20} />, color: 'hover:text-red-500 hover:border-red-500 hover:bg-red-500/10' },
  { id: 'Facebook', icon: <MessageCircle size={20} />, color: 'hover:text-blue-500 hover:border-blue-500 hover:bg-blue-500/10' },
  { id: 'LinkedIn', icon: <Briefcase size={20} />, color: 'hover:text-blue-400 hover:border-blue-400 hover:bg-blue-400/10' },
  { id: 'Pinterest', icon: <Bookmark size={20} />, color: 'hover:text-red-600 hover:border-red-600 hover:bg-red-600/10' },
];

const ComposerModal = () => {
  const { isComposerOpen, closeComposer } = useComposer();
  const [content, setContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isComposerOpen) return null;

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
      // Backend should run on localhost:5000 and serve static files
      const fullUrl = `http://localhost:5000${data.url}`;
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
    try {
      setIsSubmitting(true);
      await api.post('/posts', {
        globalContent: content,
        platforms: selectedPlatforms,
        mediaAssets: mediaFiles.map(m => m.id)
      });
      closeComposer();
      setContent('');
      setSelectedPlatforms([]);
      setMediaFiles([]);
      toast.success('Post published successfully!');
    } catch (error) {
      console.error('Failed to publish post:', error);
      toast.error('Failed to publish post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#111116] border border-[#1f1f2e] w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1f1f2e]">
          <h2 className="text-xl font-bold text-white">Create New Post</h2>
          <button onClick={closeComposer} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 flex flex-col gap-6">
          
          {/* Platform Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Select Platforms</label>
            <div className="flex gap-3">
              {platformsList.map(platform => {
                const isSelected = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
                      isSelected 
                        ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                        : `bg-[#1a1a24] border-[#2d2d3f] text-gray-400 ${platform.color}`
                    }`}
                  >
                    {platform.icon}
                    <span className="text-sm font-medium">{platform.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Editor */}
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-3">Post Content</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-40 bg-[#1a1a24] border border-[#2d2d3f] rounded-xl p-4 text-gray-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
              placeholder="What do you want to share with your audience?"
            />
          </div>

          {/* Media Upload Area */}
          <div>
            {mediaFiles.length > 0 && (
              <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                {mediaFiles.map((media, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-[#2d2d3f] flex-shrink-0 group">
                    {media.type === 'VIDEO' ? (
                      <video src={media.url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={media.url} alt="upload" className="w-full h-full object-cover" />
                    )}
                    <button 
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="border-2 border-dashed border-[#2d2d3f] rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer bg-[#1a1a24]/50 relative">
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploading} />
              {isUploading ? (
                <div className="text-sm font-medium animate-pulse">Uploading...</div>
              ) : (
                <>
                  <ImageIcon size={32} className="mb-2" />
                  <p className="text-sm font-medium">Drag & drop media here, or click to browse</p>
                  <p className="text-xs mt-1 opacity-60">Supports JPG, PNG, MP4</p>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#1f1f2e] bg-[#0B0B0F] flex items-center justify-between">
          <button className="text-gray-400 hover:text-white transition-colors px-4 py-2 text-sm font-medium">
            Save as Draft
          </button>
          
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#2d2d3f] bg-[#1a1a24] hover:bg-[#2d2d3f] text-white text-sm font-medium transition-colors">
              <Calendar size={16} />
              Schedule
            </button>
            <button 
              onClick={handlePublish}
              disabled={!content || selectedPlatforms.length === 0 || isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {isSubmitting ? 'Publishing...' : 'Publish Now'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ComposerModal;
