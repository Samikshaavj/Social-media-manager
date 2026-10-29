import { NavLink, useNavigate } from 'react-router-dom';
import { useComposer } from '../context/ComposerContext';
import { useAuth } from '../context/AuthContext';
import { LogOut, ExternalLink } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { openComposer } = useComposer();
  const { logout, user } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Compose', action: () => openComposer() },
    { name: 'Calendar', path: '/calendar' },
    { name: 'Brand Brain', path: '/brand-brain' },
    { name: 'Campaigns', path: '/posts' },
    { name: 'Insights', path: '/analytics' },
    { name: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 h-screen bg-[#0f0e21] border-r border-[#1a1932] flex flex-col fixed left-0 top-0 text-gray-300 z-40 select-none">
      {/* Brand Logo with 3 Yellow Bars */}
      <div className="p-7 flex items-center gap-3">
        <div className="flex items-end gap-1 h-6">
          <div className="w-1.5 h-3.5 bg-[#f59e0b] rounded-full"></div>
          <div className="w-1.5 h-5 bg-[#fbbf24] rounded-full"></div>
          <div className="w-1.5 h-6 bg-[#f59e0b] rounded-full"></div>
        </div>
        <span className="text-2xl font-bold text-white tracking-tight">SocialVibe</span>
      </div>

      {/* Main Navigation List */}
      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          if (item.action) {
            return (
              <button
                key={item.name}
                onClick={item.action}
                className="w-full text-left px-5 py-3.5 rounded-2xl text-[#8f92a9] hover:text-white hover:bg-white/5 font-semibold text-[15px] transition-all cursor-pointer flex items-center justify-between"
              >
                <span>{item.name}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center justify-between px-5 py-3.5 rounded-2xl text-[15px] transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#5835F5] text-white font-semibold shadow-md shadow-[#5835f5]/30'
                    : 'text-[#8f92a9] hover:text-white hover:bg-white/5 font-medium'
                }`
              }
            >
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Footer info & Logout */}
      <div className="p-4 border-t border-[#1a1932] flex items-center justify-between">
        <div 
          onClick={() => navigate('/accounts')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Manage connected accounts"
        >
          <div className="w-8 h-8 rounded-full bg-[#5835F5] text-white flex items-center justify-center font-bold text-xs">
            {user?.name?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
          <div className="text-xs">
            <p className="font-semibold text-gray-200 group-hover:text-white transition-colors truncate max-w-[110px]">
              {user?.username || user?.name || 'My Account'}
            </p>
            <p className="text-[10px] text-[#8f92a9]">Accounts</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="text-[#8f92a9] hover:text-red-400 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
          title="Logout"
        >
          <LogOut size={16} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
