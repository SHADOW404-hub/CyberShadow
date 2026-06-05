import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();

  return (
    <div className="w-full max-w-[900px] p-5">
      <header className="flex justify-between items-center mb-10 border-b border-[#00f0ff]/20 pb-5">
        <div className="flex flex-col">
          <span className="text-[#00ff66] text-[10px] font-bold tracking-[2px]">ONLINE</span>
          <h1 className="text-white m-0 text-2xl tracking-[4px] font-mono font-bold">AGENT_{profile?.username?.toUpperCase()}</h1>
        </div>
        <button onClick={() => signOut()} className="bg-transparent border border-[#ff3366] text-[#ff3366] py-2 px-4 rounded cursor-pointer font-mono hover:bg-[#ff3366]/10 transition-colors">DISCONNECT</button>
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-10">
        <div className="bg-[#0f121d]/80 p-5 rounded-lg border-l-4 border-[#00f0ff]">
          <label className="text-[#64748b] text-[10px] block mb-1.5 font-mono">CLEARANCE_LEVEL</label>
          <div className="text-[#00f0ff] text-lg font-bold font-mono">{profile?.role === 'admin' ? 'ELITE_OVERSEER' : 'RECRUIT'}</div>
        </div>
        <div className="bg-[#0f121d]/80 p-5 rounded-lg border-l-4 border-[#00f0ff]">
          <label className="text-[#64748b] text-[10px] block mb-1.5 font-mono">NODE_ORIGIN</label>
          <div className="text-[#00f0ff] text-lg font-bold font-mono">{profile?.country || 'UNKNOWN_SECTOR'}</div>
        </div>
      </div>

      <div className="bg-black p-5 rounded-lg border border-[#333] font-mono">
        <div className="text-[#9d4edd] mb-2.5 text-xs border-b border-[#222] pb-1.5">SYSTEM_LOGS</div>
        <div className="text-[#888] text-sm mb-1">{'>'} Initializing secure environment... OK</div>
        <div className="text-[#888] text-sm mb-1">{'>'} Loading encrypted data... OK</div>
        <div className="text-[#888] text-sm mb-1">{'>'} Welcome to CyberShadow, Agent.</div>
      </div>
    </div>
  );
};

export default Dashboard;
