import { Search, Plus, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useComposer } from '../context/ComposerContext';

const TopBar = () => {
  const { user, logout } = useAuth();
  const { openComposer } = useComposer();

  return (
    <header className="h-20 flex items-center justify-between px-8 bg-[#0B0B0F]">
      <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text" 
          placeholder="Search posts, platforms..." 
          className="w-full bg-[#111116] border border-[#1f1f2e] rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-indigo-500 transition-colors"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button onClick={openComposer} className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-full px-5 py-2 flex items-center gap-2 text-sm font-medium transition-colors cursor-pointer">
          <Plus size={16} />
          New Post
        </button>
        <div className="w-9 h-9 rounded-full bg-[#2d2d3f] border border-[#3f3f5a] flex items-center justify-center text-sm font-bold text-gray-300">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <button onClick={logout} className="text-gray-500 hover:text-red-400 transition-colors ml-2" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
