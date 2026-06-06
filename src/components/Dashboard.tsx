import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { profile, } = useAuth();

  return (
    <div className="w-full max-w-[900px]">

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
