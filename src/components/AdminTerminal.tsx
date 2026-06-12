import React, { useState } from 'react';

const AdminTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'users'>('challenges');

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
        
        <nav className="flex-1 p-6 flex flex-col gap-3">
          <button
            onClick={() => setActiveTab('challenges')}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'challenges' 
                ? 'text-[#00f0ff] bg-[#00f0ff]/5 border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeTab === 'challenges' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]" />
            )}
            <svg className={`w-5 h-5 transition-colors ${activeTab === 'challenges' ? 'text-[#00f0ff]' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[3px]">Challenges</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 group relative overflow-hidden ${
              activeTab === 'users' 
                ? 'text-[#00f0ff] bg-[#00f0ff]/5 border border-[#00f0ff]/30 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
                : 'text-white/30 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {activeTab === 'users' && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f0ff] shadow-[0_0_15px_#00f0ff]" />
            )}
            <svg className={`w-5 h-5 transition-colors ${activeTab === 'users' ? 'text-[#00f0ff]' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="text-[11px] font-bold uppercase tracking-[3px]">Users</span>
          </button>
        </nav>

        <div className="p-6 border-t border-[#00f0ff]/10">
          <a href="/" className="flex items-center gap-3 px-5 py-3 text-white/40 text-[10px] uppercase tracking-widest hover:text-[#ff3366] transition-colors group">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 8.959 8.959 0 01-9 9 8.959 8.959 0 01-9-9z" />
            </svg>
            Exit to Site
          </a>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#0d101b] relative custom-scrollbar">
        {/* Background Gradients for depth */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f0ff]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#9d4edd]/5 blur-[120px] rounded-full -ml-64 -mb-64 pointer-events-none" />

        <div className="p-10 relative z-10">
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-black tracking-[8px] text-white uppercase mb-3 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {activeTab === 'challenges' ? 'System_Challenges' : 'User_Database'}
              </h1>
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-12 bg-[#00f0ff]"></div>
                <span className="text-[10px] text-[#00f0ff] font-bold tracking-[4px] uppercase opacity-70">
                  Access_Level: Administrator
                </span>
              </div>
            </div>
            <div className="px-5 py-2 border border-[#00f0ff]/20 bg-[#00f0ff]/5 rounded-lg text-[#00f0ff] text-[10px] font-bold tracking-[2px] uppercase shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]">
              v1.0.4-stable
            </div>
          </header>

          <section className="bg-[#0d101b]/40 border border-[#00f0ff]/10 rounded-2xl p-8 backdrop-blur-md min-h-[600px] shadow-[inset_0_0_30px_rgba(0,240,255,0.02)]">
            {activeTab === 'challenges' ? (
              <div className="text-white/40 text-xs tracking-widest uppercase animate-pulse">Initializing Challenge Management Interface...</div>
            ) : (
              <div className="text-white/40 text-xs tracking-widest uppercase animate-pulse">Querying User Records from Database...</div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminTerminal;