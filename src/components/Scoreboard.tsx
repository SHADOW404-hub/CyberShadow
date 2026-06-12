import React from 'react';

interface ScoreboardEntry {
  rank: number;
  username: string;
  score: number;
  challengesSolved: number;
  lastSolve: string;
  avatar_url?: string;
}

const SCOREBOARD_DATA: ScoreboardEntry[] = [
  { rank: 1, username: 'net_stalker', score: 3250, challengesSolved: 12, lastSolve: '2 mins ago' },
  { rank: 2, username: 'zero_cool', score: 2900, challengesSolved: 10, lastSolve: '12 mins ago' },
  { rank: 3, username: 'acid_burn', score: 2850, challengesSolved: 11, lastSolve: '5 mins ago' },
  { rank: 4, username: 'crash_override', score: 2400, challengesSolved: 9, lastSolve: '1 hr ago' },
  { rank: 5, username: 'lord_nikon', score: 2150, challengesSolved: 8, lastSolve: '34 mins ago' },
  { rank: 6, username: 'cerebral_overload', score: 1800, challengesSolved: 7, lastSolve: '2 hrs ago' },
  { rank: 7, username: 'phantom_phreak', score: 1550, challengesSolved: 6, lastSolve: '4 hrs ago' },
  { rank: 8, username: 'cereal_killer', score: 1300, challengesSolved: 5, lastSolve: '1 day ago' },
];

const Scoreboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full animate-scale-in">
      <div className="border-b border-[#00f0ff]/15 pb-6">
        <h1 className="text-white font-mono font-black text-2xl tracking-[4px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
          GLOBAL STANDINGS
        </h1>
        <p className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest mt-1">
          Realtime node performance & hacker leaderboard
        </p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
        {/* Rank 2 */}
        <div className="order-2 md:order-1 bg-[#0d101b]/60 border border-[#00f0ff]/15 p-6 rounded-xl text-center flex flex-col items-center relative overflow-hidden group hover:border-[#00f0ff]/40 transition-all">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
          <div className="text-[#64748b] font-mono text-[10px] tracking-widest uppercase mb-2">Rank 2</div>
          <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 flex items-center justify-center font-mono font-bold text-white bg-black/40 mb-3 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            ZC
          </div>
          <div className="text-white font-mono font-bold text-sm tracking-wide">{SCOREBOARD_DATA[1].username}</div>
          <div className="text-[#00f0ff] font-mono text-xs font-black mt-1">{SCOREBOARD_DATA[1].score} PTS</div>
        </div>

        {/* Rank 1 */}
        <div className="order-1 md:order-2 bg-[#0d101b]/90 border border-[#00ff66]/30 p-8 rounded-2xl text-center flex flex-col items-center relative overflow-hidden shadow-[0_0_30px_rgba(0,255,102,0.08)] group hover:border-[#00ff66]/60 transition-all md:scale-105">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#00ff66] to-[#00f0ff]" />
          <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00ff66]" />
          <div className="text-[#00ff66] font-mono text-[10px] tracking-[4px] uppercase mb-2 font-black">CHAMPION</div>
          <div className="w-16 h-16 rounded-full border-2 border-[#00ff66]/40 flex items-center justify-center font-mono font-bold text-white bg-black/50 mb-3 shadow-[0_0_20px_rgba(0,255,102,0.2)]">
            NS
          </div>
          <div className="text-white font-mono font-bold text-base tracking-wide">{SCOREBOARD_DATA[0].username}</div>
          <div className="text-[#00ff66] font-mono text-sm font-black mt-1 drop-shadow-[0_0_8px_rgba(0,255,102,0.5)]">
            {SCOREBOARD_DATA[0].score} PTS
          </div>
        </div>

        {/* Rank 3 */}
        <div className="order-3 bg-[#0d101b]/60 border border-[#00f0ff]/15 p-6 rounded-xl text-center flex flex-col items-center relative overflow-hidden group hover:border-[#00f0ff]/40 transition-all">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
          <div className="text-[#64748b] font-mono text-[10px] tracking-widest uppercase mb-2">Rank 3</div>
          <div className="w-12 h-12 rounded-full border border-[#00f0ff]/30 flex items-center justify-center font-mono font-bold text-white bg-black/40 mb-3 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            AB
          </div>
          <div className="text-white font-mono font-bold text-sm tracking-wide">{SCOREBOARD_DATA[2].username}</div>
          <div className="text-[#00f0ff] font-mono text-xs font-black mt-1">{SCOREBOARD_DATA[2].score} PTS</div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-[#0d101b]/80 border border-[#00f0ff]/15 rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#00f0ff]/10 bg-black/40">
                <th className="p-4 font-mono text-[10px] uppercase text-[#64748b] tracking-wider text-center w-16">Rank</th>
                <th className="p-4 font-mono text-[10px] uppercase text-[#64748b] tracking-wider">Operator</th>
                <th className="p-4 font-mono text-[10px] uppercase text-[#64748b] tracking-wider text-right">Solved</th>
                <th className="p-4 font-mono text-[10px] uppercase text-[#64748b] tracking-wider text-right">Score</th>
                <th className="p-4 font-mono text-[10px] uppercase text-[#64748b] tracking-wider text-right">Last Action</th>
              </tr>
            </thead>
            <tbody>
              {SCOREBOARD_DATA.map(entry => (
                <tr
                  key={entry.rank}
                  className="border-b border-[#00f0ff]/5 hover:bg-[#00f0ff]/5 transition-colors group"
                >
                  <td className="p-4 font-mono text-xs text-center font-bold text-white/70">
                    <span className={`inline-block w-6 py-0.5 rounded ${
                      entry.rank === 1 ? 'bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/20' :
                      entry.rank === 2 ? 'bg-[#00f0ff]/10 text-[#00f0ff]' :
                      entry.rank === 3 ? 'bg-[#00f0ff]/10 text-[#00f0ff]' :
                      'text-[#64748b]'
                    }`}>
                      #{entry.rank}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs font-bold text-white group-hover:text-[#00f0ff] transition-colors uppercase tracking-wider">
                    {entry.username}
                  </td>
                  <td className="p-4 font-mono text-xs text-white/80 text-right">
                    {entry.challengesSolved} / 12
                  </td>
                  <td className="p-4 font-mono text-xs font-black text-[#00f0ff] text-right drop-shadow-[0_0_3px_rgba(0,240,255,0.3)]">
                    {entry.score}
                  </td>
                  <td className="p-4 font-mono text-[10px] text-[#64748b] text-right uppercase tracking-wider">
                    {entry.lastSolve}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
