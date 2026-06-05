import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="w-full max-w-[900px] p-5">
      <header className="flex justify-between items-center mb-10 border-b border-[#00f0ff]/20 pb-5">
        <div className="flex items-center gap-3">
          <img
            src="/favicon.svg"
            alt="CyberShadow Logo"
            className="w-9 h-9 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          />
          <div className="flex flex-col">
            <span className="text-[#00ff66] text-[10px] font-bold tracking-[2px] font-mono">ONLINE</span>
            <h1 className="text-white m-0 text-xl tracking-[3px] font-mono font-bold leading-tight">
              {profile?.username?.toUpperCase()}
            </h1>
          </div>
        </div>
        <button
          onClick={() => signOut()}
          className="bg-transparent border border-[#ff3366] text-[#ff3366] py-2 px-4 rounded cursor-pointer font-mono text-sm hover:bg-[#ff3366]/10 transition-colors"
        >
          Log Out
        </button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-10">
        <div className="bg-[#0f121d]/80 p-5 rounded-lg border-l-4 border-[#00f0ff]">
          <label className="text-[#64748b] text-[10px] block mb-1.5 font-mono uppercase tracking-widest">Role</label>
          <div className="text-[#00f0ff] text-lg font-bold font-mono">
            {profile?.role === 'admin' ? 'Admin' : 'Member'}
          </div>
        </div>
        <div className="bg-[#0f121d]/80 p-5 rounded-lg border-l-4 border-[#00f0ff]">
          <label className="text-[#64748b] text-[10px] block mb-1.5 font-mono uppercase tracking-widest">Country</label>
          <div className="text-[#00f0ff] text-lg font-bold font-mono">
            {profile?.country || 'Unknown'}
          </div>
        </div>
        <div className="bg-[#0f121d]/80 p-5 rounded-lg border-l-4 border-[#9d4edd]">
          <label className="text-[#64748b] text-[10px] block mb-1.5 font-mono uppercase tracking-widest">Email</label>
          <div className="text-[#9d4edd] text-sm font-bold font-mono truncate">
            {profile?.email || '—'}
          </div>
        </div>
      </div>

      <div className="bg-black p-5 rounded-lg border border-[#333] font-mono">
        <div className="text-[#9d4edd] mb-2.5 text-xs border-b border-[#222] pb-1.5 uppercase tracking-widest">
          System Log
        </div>
        <div className="text-[#888] text-sm mb-1">{'>'} Connection established... OK</div>
        <div className="text-[#888] text-sm mb-1">{'>'} Loading profile data... OK</div>
        <div className="text-[#00f0ff] text-sm mb-1">{'>'} Welcome to CyberShadow, {profile?.username}.</div>
      </div>
    </div>
  );
};

export default Dashboard;
