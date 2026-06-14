import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '../services/supabase';

interface StatsData {
  totalUsers: number;
  adminCount: number;
  userCount: number;
  totalChallenges: number;
  totalSolves: number;
  totalPoints: number;
  byDifficulty: Record<string, number>;
  byCategory: Record<string, number>;
  recentChallenges: { name: string; points: number; difficulty: string; category: string; created_at: string }[];
  countryCounts: Record<string, number>;
}

function useCountUp(target: number, duration = 1500, started = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started || target === 0) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target, started]);
  return count;
}

const DIFF_COLORS: Record<string, string> = {
  Easy:   'text-[#00ff66] border-[#00ff66]/30 bg-[#00ff66]/10',
  Medium: 'text-[#f59e0b] border-[#f59e0b]/30 bg-[#f59e0b]/10',
  Hard:   'text-[#ff3366] border-[#ff3366]/30 bg-[#ff3366]/10',
};

const CAT_COLORS = ['#00f0ff','#9d4edd','#00ff66','#f59e0b','#ff3366','#06b6d4'];

const StatsContent: React.FC = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [animStarted, setAnimStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!loading && stats) {
      setTimeout(() => setAnimStarted(true), 100);
    }
  }, [loading, stats]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [{ data: profiles }, { data: challenges }, { data: solves }] = await Promise.all([
        supabase.from('profiles').select('role, country'),
        supabase.from('challenges').select('name, points, difficulty, category, created_at'),
        supabase.from('solves').select('id'),
      ]);

      const byDifficulty: Record<string, number> = {};
      const byCategory: Record<string, number> = {};
      const countryCounts: Record<string, number> = {};
      let totalPoints = 0;

      (challenges || []).forEach(c => {
        byDifficulty[c.difficulty] = (byDifficulty[c.difficulty] || 0) + 1;
        byCategory[c.category] = (byCategory[c.category] || 0) + 1;
        totalPoints += c.points || 0;
      });

      (profiles || []).forEach(p => {
        if (p.country) countryCounts[p.country] = (countryCounts[p.country] || 0) + 1;
      });

      setStats({
        totalUsers: (profiles || []).length,
        adminCount: (profiles || []).filter(p => p.role === 'admin').length,
        userCount: (profiles || []).filter(p => p.role !== 'admin').length,
        totalChallenges: (challenges || []).length,
        totalSolves: (solves || []).length,
        totalPoints,
        byDifficulty,
        byCategory,
        recentChallenges: (challenges || []).slice(-5).reverse(),
        countryCounts,
      });
    } catch (e) {
      console.error('Stats fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  const totalUsers      = useCountUp(stats?.totalUsers || 0, 1200, animStarted);
  const totalChallenges = useCountUp(stats?.totalChallenges || 0, 1400, animStarted);
  const totalSolves     = useCountUp(stats?.totalSolves || 0, 1600, animStarted);
  const totalPoints     = useCountUp(stats?.totalPoints || 0, 1800, animStarted);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-[#00f0ff]/5 border border-[#00f0ff]/10 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 bg-[#00f0ff]/5 border border-[#00f0ff]/10 rounded-2xl" />
          <div className="h-64 bg-[#00f0ff]/5 border border-[#00f0ff]/10 rounded-2xl" />
        </div>
      </div>
    );
  }

  const categoryEntries = Object.entries(stats?.byCategory || {});
  const difficultyEntries = Object.entries(stats?.byDifficulty || {});
  const maxCat = Math.max(...categoryEntries.map(([,v]) => v), 1);

  return (
    <div ref={containerRef} className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[#00f0ff] font-mono text-2xl font-black tracking-[4px] uppercase flex items-center gap-3">
            <div className="w-3 h-8 bg-[#00f0ff]/20 border-l-4 border-[#00f0ff]" />
            System_Stats
          </h2>
          <p className="text-white/20 text-[9px] uppercase tracking-[2px] mt-1 font-mono">Real-time Network Intelligence</p>
        </div>
        <button
          onClick={fetchStats}
          className="bg-[#00f0ff]/5 border border-[#00f0ff]/30 px-5 py-2.5 rounded-lg text-[#00f0ff] text-[10px] font-bold uppercase tracking-[2px] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] active:scale-95"
        >
          Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total_Users', value: totalUsers, icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', color: '#00f0ff', glow: 'rgba(0,240,255,0.15)' },
          { label: 'Challenges', value: totalChallenges, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', color: '#9d4edd', glow: 'rgba(157,78,221,0.15)' },
          { label: 'Total_Solves', value: totalSolves, icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: '#00ff66', glow: 'rgba(0,255,102,0.15)' },
          { label: 'Total_Points', value: totalPoints, icon: 'M13 10V3L4 14h7v7l9-11h-7z', color: '#f59e0b', glow: 'rgba(245,158,11,0.15)' },
        ].map(({ label, value, icon, color, glow }) => (
          <div
            key={label}
            className="relative bg-[#0d101b]/60 border border-white/5 rounded-2xl p-6 overflow-hidden group hover:border-white/10 transition-all duration-500"
            style={{ boxShadow: `0 0 30px ${glow}` }}
          >
            {/* Glow bg */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(ellipse at 50% 0%, ${glow} 0%, transparent 70%)` }} />
            {/* Corner accent */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-2xl" style={{ borderColor: color + '40' }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-2xl" style={{ borderColor: color + '40' }} />

            <svg className="w-5 h-5 mb-3 opacity-60" style={{ color }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
            </svg>
            <div className="text-3xl font-black font-mono mb-1 tabular-nums" style={{ color }}>
              {value.toLocaleString()}
            </div>
            <div className="text-[9px] font-mono uppercase tracking-[2px] text-white/30">{label}</div>

            {/* Scan line animation */}
            <div className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-700" style={{ background: `linear-gradient(to right, transparent, ${color}, transparent)` }} />
          </div>
        ))}
      </div>

      {/* User breakdown + Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* User Role Breakdown */}
        <div className="bg-[#0d101b]/60 border border-[#00f0ff]/10 rounded-2xl p-6">
          <h3 className="text-[#00f0ff] font-mono text-[11px] font-bold uppercase tracking-[3px] mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full animate-pulse" />
            User_Breakdown
          </h3>
          <div className="flex flex-col gap-4">
            {[
              { label: 'Admins', value: stats?.adminCount || 0, total: stats?.totalUsers || 1, color: '#ff3366' },
              { label: 'Users', value: stats?.userCount || 0, total: stats?.totalUsers || 1, color: '#00f0ff' },
            ].map(({ label, value, total, color }) => {
              const pct = Math.round((value / total) * 100) || 0;
              return (
                <div key={label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/60 font-mono text-[10px] uppercase tracking-widest">{label}</span>
                    <span className="font-mono text-[11px] font-bold" style={{ color }}>{value} <span className="text-white/20">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 ease-out"
                      style={{ width: animStarted ? `${pct}%` : '0%', background: `linear-gradient(to right, ${color}80, ${color})`, boxShadow: `0 0 10px ${color}80` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Countries */}
          {Object.keys(stats?.countryCounts || {}).length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-white/30 font-mono text-[9px] uppercase tracking-[2px] mb-3">By_Country</p>
              {Object.entries(stats?.countryCounts || {}).map(([country, count]) => (
                <div key={country} className="flex justify-between items-center py-1.5">
                  <span className="text-white/50 font-mono text-[10px]">{country}</span>
                  <span className="text-[#00f0ff] font-mono text-[10px] font-bold">{count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Category Breakdown */}
        <div className="bg-[#0d101b]/60 border border-[#9d4edd]/10 rounded-2xl p-6 col-span-1 lg:col-span-2">
          <h3 className="text-[#9d4edd] font-mono text-[11px] font-bold uppercase tracking-[3px] mb-5 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#9d4edd] rounded-full animate-pulse" />
            Challenge_Categories
          </h3>
          {categoryEntries.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-white/10 font-mono text-[11px] uppercase tracking-widest">No_Data</div>
          ) : (
            <div className="flex flex-col gap-3">
              {categoryEntries.map(([cat, count], i) => {
                const color = CAT_COLORS[i % CAT_COLORS.length];
                const pct = Math.round((count / maxCat) * 100);
                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color }}>{cat}</span>
                      <span className="font-mono text-[10px] text-white/40">{count} challenge{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000 ease-out"
                        style={{
                          width: animStarted ? `${pct}%` : '0%',
                          background: `linear-gradient(to right, ${color}60, ${color})`,
                          boxShadow: `0 0 12px ${color}60`,
                          transitionDelay: `${i * 100}ms`
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Difficulty pills */}
          {difficultyEntries.length > 0 && (
            <div className="mt-6 pt-5 border-t border-white/5">
              <p className="text-white/30 font-mono text-[9px] uppercase tracking-[2px] mb-3">By_Difficulty</p>
              <div className="flex flex-wrap gap-2">
                {difficultyEntries.map(([diff, count]) => (
                  <span key={diff} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border font-mono ${DIFF_COLORS[diff] || 'text-white/40 border-white/10 bg-white/5'}`}>
                    {diff} · {count}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Challenges */}
      <div className="bg-[#0d101b]/60 border border-[#00ff66]/10 rounded-2xl p-6">
        <h3 className="text-[#00ff66] font-mono text-[11px] font-bold uppercase tracking-[3px] mb-5 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full animate-pulse" />
          Recent_Challenges
        </h3>
        {(stats?.recentChallenges || []).length === 0 ? (
          <div className="text-center py-10 text-white/10 font-mono text-[11px] uppercase tracking-widest">No_Challenges_Yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-[11px]">
              <thead>
                <tr className="text-white/20 uppercase tracking-[2px] text-[9px] border-b border-white/5">
                  <th className="text-left pb-3">Name</th>
                  <th className="text-left pb-3">Category</th>
                  <th className="text-left pb-3">Difficulty</th>
                  <th className="text-right pb-3">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {(stats?.recentChallenges || []).map((c, i) => (
                  <tr key={i} className="group hover:bg-white/2 transition-colors">
                    <td className="py-3.5 text-white font-bold group-hover:text-[#00ff66] transition-colors">{c.name}</td>
                    <td className="py-3.5 text-white/40">{c.category}</td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border ${DIFF_COLORS[c.difficulty] || 'text-white/30 border-white/10'}`}>
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-black text-[#f59e0b]">{c.points} <span className="text-white/20 font-normal text-[9px]">pts</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsContent;