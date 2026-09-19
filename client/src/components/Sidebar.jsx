import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Send, 
  CalendarDays, 
  BarChart3, 
  Users, 
  Settings,
  Plus,
  MessageSquare
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Calendar', path: '/calendar', icon: <CalendarDays size={20} /> },
    { name: 'Accounts', path: '/accounts', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> },
  ];

  return (
    <aside className="w-64 h-screen bg-[#111116] border-r border-[#1f1f2e] flex flex-col fixed left-0 top-0 text-gray-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <div className="w-4 h-4 text-white">✨</div>
        </div>
        <span className="text-xl font-bold text-white tracking-wide">Social-Vibe</span>
      </div>

      <div className="px-4 mb-6">
        <button className="w-full bg-[#1a1a24] hover:bg-[#252536] text-indigo-400 border border-[#2d2d3f] rounded-xl py-2.5 flex items-center justify-center gap-2 font-medium transition-colors">
          <MessageSquare size={18} />
          Auto Reply
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-[#1a1a24] text-white border border-[#2d2d3f]' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a24]/50'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      {/* Intentionally omitted Plan: Pro section based on user request */}
    </aside>
  );
};

export default Sidebar;
