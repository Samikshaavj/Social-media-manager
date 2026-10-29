import { useState } from 'react';
import { Sparkles, Brain, Plus, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const BrandBrain = () => {
  const [sources, setSources] = useState([
    {
      id: 1,
      name: 'About page',
      type: 'Website Link',
      url: 'https://yoursite.com/about',
      status: 'Ready',
      description: 'Brand mission, founding story, core values, and target persona.'
    },
    {
      id: 2,
      name: 'March offer',
      type: 'Campaign Document',
      url: 'Spring launch & seasonal discount terms',
      status: 'Ready',
      description: 'Key discount percentages, promotional highlights, and urgency triggers.'
    },
    {
      id: 3,
      name: 'Past posts',
      type: 'Trained Content',
      url: '50+ high-converting social updates',
      status: 'Ready',
      description: 'Top performing captions, emojis, hashtags, and call-to-actions.'
    }
  ]);

  const [tone, setTone] = useState('Conversational, punchy, confident, and customer-first');
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceDesc, setNewSourceDesc] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddSource = (e) => {
    e.preventDefault();
    if (!newSourceName.trim()) return;

    const newSource = {
      id: Date.now(),
      name: newSourceName,
      type: 'Custom Source',
      url: 'Manual entry',
      status: 'Ready',
      description: newSourceDesc || 'Custom brand guidelines and messaging notes.'
    };

    setSources([...sources, newSource]);
    setNewSourceName('');
    setNewSourceDesc('');
    setIsAdding(false);
    toast.success('Source added to Brand Brain!');
  };

  const handleDelete = (id) => {
    setSources(sources.filter(s => s.id !== id));
    toast.success('Source removed');
  };

  return (
    <div className="max-w-[1240px] mx-auto text-[#121028] dark:text-gray-100 space-y-8 transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#5835F5] text-white flex items-center justify-center shadow-md shadow-[#5835f5]/30">
              <Brain size={22} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-[#121028] dark:text-white tracking-tight">
              Brand Brain
            </h1>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
            Train AI to write captions that sound identically like you by feeding it your brand notes, docs, and best posts.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#5835F5] hover:bg-[#4726e0] text-white rounded-full px-6 py-2.5 font-bold text-sm transition-all cursor-pointer shadow-md shadow-[#5835f5]/25 flex items-center gap-2 self-start sm:self-auto hover:scale-105 active:scale-95"
        >
          <Plus size={16} />
          <span>Add Source</span>
        </button>
      </div>

      {/* Brand Tone Card */}
      <div className="bg-white dark:bg-[#131226] rounded-[28px] p-7 border border-[#e8ebf5] dark:border-[#22203e] shadow-sm transition-colors">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={18} className="text-[#5835F5]" />
          <h2 className="text-lg font-black text-[#121028] dark:text-white">Brand Voice & Personality</h2>
        </div>
        <p className="text-xs text-gray-400 mb-3 font-medium">
          Describe the style, rhythm, and vocabulary your AI captions should adopt across all platforms.
        </p>
        <textarea
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          rows={2}
          className="w-full bg-[#fbfbff] dark:bg-[#1a1833] border border-[#e8ebf7] dark:border-[#2a284c] rounded-2xl p-4 text-sm text-[#121028] dark:text-gray-100 font-semibold focus:outline-none focus:border-[#5835F5] transition-all"
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={() => toast.success('Brand voice tone updated!')}
            className="bg-[#121028] hover:bg-black dark:bg-[#5835F5] dark:hover:bg-[#4726e0] text-white text-xs font-bold px-5 py-2 rounded-full cursor-pointer transition-all shadow-sm"
          >
            Save Voice Profile
          </button>
        </div>
      </div>

      {/* Add Source Modal/Form if open */}
      {isAdding && (
        <form onSubmit={handleAddSource} className="bg-[#f0edff] dark:bg-[#1b1935] border border-[#5835F5]/30 rounded-[28px] p-6 space-y-4">
          <h3 className="font-extrabold text-base text-[#121028] dark:text-white">Add New Knowledge Source</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Source Name (e.g., Summer Collection Notes)"
              value={newSourceName}
              onChange={(e) => setNewSourceName(e.target.value)}
              className="bg-white dark:bg-[#131226] border border-[#e2e8f0] dark:border-[#2a284c] rounded-xl px-4 py-2.5 text-sm text-[#121028] dark:text-gray-100 focus:outline-none focus:border-[#5835F5]"
              required
            />
            <input
              type="text"
              placeholder="Brief Description or Key Facts"
              value={newSourceDesc}
              onChange={(e) => setNewSourceDesc(e.target.value)}
              className="bg-white dark:bg-[#131226] border border-[#e2e8f0] dark:border-[#2a284c] rounded-xl px-4 py-2.5 text-sm text-[#121028] dark:text-gray-100 focus:outline-none focus:border-[#5835F5]"
            />
          </div>
          <div className="flex items-center gap-3 justify-end">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#5835F5] hover:bg-[#4726e0] text-white px-5 py-2 rounded-full text-xs font-bold cursor-pointer transition-all"
            >
              Save Source
            </button>
          </div>
        </form>
      )}

      {/* Sources Grid */}
      <div>
        <h2 className="text-xl font-black text-[#121028] dark:text-white mb-5">
          Trained Sources ({sources.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sources.map((source) => (
            <div
              key={source.id}
              className="bg-white dark:bg-[#131226] rounded-[28px] p-6 border border-[#e8ebf5] dark:border-[#22203e] shadow-sm flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#f0edff] dark:bg-[#5835F5]/20 text-[#5835F5] flex items-center justify-center font-bold">
                    <FileText size={20} />
                  </div>
                  <span className="bg-[#10b981]/15 text-[#059669] dark:text-[#34d399] text-[11px] font-extrabold px-3 py-1 rounded-full border border-[#10b981]/25 flex items-center gap-1">
                    <CheckCircle2 size={12} />
                    {source.status}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#121028] dark:text-white mb-1 group-hover:text-[#5835F5] transition-colors">
                  {source.name}
                </h3>
                <p className="text-xs text-[#8f92a9] font-medium mb-3">{source.type}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                  {source.description}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-[#f0f2f9] dark:border-[#201e38] flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium truncate max-w-[170px]">
                  {source.url}
                </span>
                <button
                  onClick={() => handleDelete(source.id)}
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg transition-colors cursor-pointer"
                  title="Remove Source"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandBrain;
