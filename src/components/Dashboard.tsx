import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState({
    score: 0,
    rank: '-',
    solvedCount: 0,
    totalChallenges: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!profile) return;
      try {
        // Fetch profiles to calculate rank
        const { data: dataProfiles } = await supabase.from('profiles').select('id, username, score, challenges_solved');
        // Fetch challenges count
        const { data: dataChallenges } = await supabase.from('challenges').select('id');
        
        const mappedProfiles = (dataProfiles || []).map((prof: any) => {
          const userScore = typeof prof.score === 'number' 
            ? prof.score 
            : Math.max(100, Math.abs(prof.username.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0) * 3) % 3500);
          
          const solved = typeof prof.challenges_solved === 'number'
            ? prof.challenges_solved
            : Math.min(12, Math.floor(userScore / 300));

          return {
            id: prof.id,
            score: userScore,
            solved
          };
        });

        // Sort descending
        mappedProfiles.sort((a, b) => b.score - a.score);

        // Find current user index
        const userIndex = mappedProfiles.findIndex(p => p.id === profile.id);
        const rank = userIndex !== -1 ? `#${userIndex + 1}` : '-';
        const score = userIndex !== -1 ? mappedProfiles[userIndex].score : (profile.score || 0);
        const solvedCount = userIndex !== -1 ? mappedProfiles[userIndex].solved : (profile.challenges_solved || 0);
        const totalChallenges = dataChallenges?.length || 0;

        setStats({
          score,
          rank,
          solvedCount,
          totalChallenges
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchUserStats();
  }, [profile]);

  return (
    <div className="flex flex-col gap-8 w-full animate-scale-in">
      {/* Header section with profile welcome */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#00f0ff]/15 pb-6">
        <div>
          <h1 className="text-white font-mono font-black text-2xl tracking-[4px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#00f0ff]/80 drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            SYSTEM TERMINAL
          </h1>
          <p className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest mt-1">
            Welcome back, Operator <strong className="text-[#00f0ff]">{profile?.username || 'GHOST_OPERATOR'}</strong>
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00ff66] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00ff66]"></span>
          </span>
          <span className="text-[10px] font-mono text-[#00ff66] tracking-[2px] uppercase">SECURE LINK ESTABLISHED</span>
        </div>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#0d101b]/60 border border-[#00f0ff]/15 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
          <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-widest">Network Score</span>
          <span className="text-white font-mono text-2xl font-black mt-2 drop-shadow-[0_0_8px_rgba(0,240,255,0.3)]">
            {loadingStats ? '...' : `${stats.score.toLocaleString()} PTS`}
          </span>
        </div>
        <div className="bg-[#0d101b]/60 border border-[#00f0ff]/15 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
          <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-widest">Global Rank</span>
          <span className="text-[#00f0ff] font-mono text-2xl font-black mt-2">
            {loadingStats ? '...' : stats.rank}
          </span>
        </div>
        <div className="bg-[#0d101b]/60 border border-[#00f0ff]/15 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
          <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-widest">Decryption Progress</span>
          <span className="text-white font-mono text-2xl font-black mt-2">
            {loadingStats ? '...' : `${stats.solvedCount} / ${stats.totalChallenges}`}
          </span>
        </div>
        <div className="bg-[#0d101b]/60 border border-[#00f0ff]/15 p-5 rounded-xl flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
          <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-widest">Active nodes</span>
          <span className="text-[#00ff66] font-mono text-2xl font-black mt-2">128 / 128</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: System logs and operations */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-[#0d101b]/80 border border-[#00f0ff]/15 p-6 rounded-xl relative">
            <h2 className="text-white font-mono font-bold text-sm tracking-widest uppercase mb-4 border-b border-[#00f0ff]/10 pb-3 flex justify-between items-center">
              <span>ACTIVE ANNOUNCEMENTS</span>
              <span className="text-[#00f0ff] text-[9px] lowercase tracking-normal">version 2.4.0-build</span>
            </h2>
            <div className="flex flex-col gap-4 text-xs font-mono text-white/80">
              <div className="border-l-2 border-[#00f0ff] pl-3 py-1">
                <div className="flex justify-between text-[#00f0ff] font-bold text-[10px] mb-1">
                  <span>[!] INCOMING MISSION TARGETS</span>
                  <span>2026-06-12</span>
                </div>
                <p className="text-[#94a3b8] leading-relaxed">
                  Multiple new reverse engineering challenges have been deployed to the Challenges panel. Breach validation parameters and report immediately.
                </p>
              </div>
              <div className="border-l-2 border-[#ff3366] pl-3 py-1">
                <div className="flex justify-between text-[#ff3366] font-bold text-[10px] mb-1">
                  <span>[!] SECURITY UPGRADE IN PROGRESS</span>
                  <span>2026-06-11</span>
                </div>
                <p className="text-[#94a3b8] leading-relaxed">
                  Supabase database syncing optimizations are complete. Report any network connectivity drops to the network administrator.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Access panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/challenges"
              className="bg-black/40 border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/5 p-5 rounded-xl text-center flex flex-col items-center justify-center transition-all group"
            >
              <span className="text-[#00f0ff] font-mono font-bold text-xs uppercase tracking-widest mb-1 group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.7)]">Challenges</span>
              <span className="text-[#64748b] font-mono text-[9px]">Launch Operations</span>
            </Link>
            <Link
              to="/scoreboard"
              className="bg-black/40 border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/5 p-5 rounded-xl text-center flex flex-col items-center justify-center transition-all group"
            >
              <span className="text-[#00f0ff] font-mono font-bold text-xs uppercase tracking-widest mb-1 group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.7)]">Scoreboard</span>
              <span className="text-[#64748b] font-mono text-[9px]">Check Standings</span>
            </Link>
            <Link
              to="/learn"
              className="bg-black/40 border border-[#00f0ff]/20 hover:border-[#00f0ff]/60 hover:bg-[#00f0ff]/5 p-5 rounded-xl text-center flex flex-col items-center justify-center transition-all group"
            >
              <span className="text-[#00f0ff] font-mono font-bold text-xs uppercase tracking-widest mb-1 group-hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.7)]">Academy</span>
              <span className="text-[#64748b] font-mono text-[9px]">Training Zone</span>
            </Link>
          </div>
        </div>

        {/* Right Side: Security terminal logs */}
        <div className="lg:col-span-1 bg-[#0d101b]/60 border border-[#00f0ff]/15 p-6 rounded-xl flex flex-col">
          <h2 className="text-white font-mono font-bold text-sm tracking-widest uppercase mb-4 border-b border-[#00f0ff]/10 pb-3">
            SYSTEM LOGS
          </h2>
          <div className="flex-1 font-mono text-[9px] text-[#64748b] flex flex-col gap-2.5 overflow-hidden leading-relaxed">
            <p><span className="text-[#00ff66]">[OK]</span> Connection established to proxy-1</p>
            <p><span className="text-[#00ff66]">[OK]</span> Decrypted session token</p>
            <p><span className="text-[#00f0ff]">[INFO]</span> Fetching profile data...</p>
            <p><span className="text-[#00ff66]">[OK]</span> Profile synced successfully</p>
            <p><span className="text-[#ff3366]">[WARN]</span> Port scanner detected on sub-route 8</p>
            <p><span className="text-[#00ff66]">[OK]</span> Intrusion countermeasures enabled</p>
            <p className="animate-pulse"><span className="text-[#00f0ff]">&gt;</span> Listening for flag submission...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
