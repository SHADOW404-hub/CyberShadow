import React from 'react';
import { Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import StatsContent from './StatsContent';
import ChallengesContent from './/ChallengesContent';
import UsersContent from './UsersContent';

const AdminTerminal: React.FC = () => {
  const { pathname } = useLocation();
  
  const navLinks = [
    { to: '/admin/stats', label: 'Stats', key: 'stats', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { to: '/admin/challenges', label: 'Challenges', key: 'challenges', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { to: '/admin/users', label: 'Users', key: 'users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' }
  ];

  const currentTab = navLinks.find(link => pathname.includes(link.to))?.key || 'stats';

  return (
    <div className="flex h-screen w-full bg-[#0d101b] text-white font-mono overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 border-r border-[#00f0ff]/20 bg-[#0d101b]/95 backdrop-blur-xl flex flex-col z-20">
        <div className="p-8 border-b border-[#00f0ff]/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0d101b] border border-[#00f0ff]/40 rounded flex items-center justify-center shadow-[0_0_10px_rgba(0,240,255,0.2)]">
              <img src="/favicon.svg" alt="Logo" className="w-5 h-5 drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" />
            </div>
            <span className="text-white font-black tracking-[4px] text-sm uppercase">Admin Panel</span>
          </div>
        </div>
        
        <nav className="flex-1 p-6 flex flex-col gap-3 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              to={link.to}
              className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                currentTab === link.key 
                  ? 'text-[#00f0ff] bg-[#00f0ff]/5 border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                  : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {currentTab === link.key && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]" />
              )}
              <svg className={`w-5 h-5 transition-colors ${currentTab === link.key ? 'text-[#00f0ff]' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[3px]">{link.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-[#00f0ff]/10">
          <Link to="/" className="flex items-center gap-3 px-5 py-3 text-white/40 text-[10px] uppercase tracking-widest hover:text-[#ff3366] transition-colors group">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-9 9 8.959 8.959 0 01-9-9z" />
            </svg>
            Exit to Site
          </Link>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0d101b] p-8">
        <Routes>
          <Route path="stats" element={<StatsContent />} />
          <Route path="challenges" element={<ChallengesContent />} />
          <Route path="users" element={<UsersContent />} />
          <Route path="/" element={<Navigate to="stats" replace />} />
          <Route path="*" element={<Navigate to="stats" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminTerminal;