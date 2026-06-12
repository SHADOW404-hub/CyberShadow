import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../services/supabase';

interface ChallengeItem {
  id: string;
  name: string;
  points: number;
  category: string;
  difficulty: string;
  flag: string;
  description: string;
}

const INITIAL_CHALLENGES: ChallengeItem[] = [
  {
    id: 'ch-1',
    name: 'SQL Injection: Ghost Echo',
    points: 100,
    category: 'Web',
    difficulty: 'Easy',
    flag: 'flag{sql_ghost_echo}',
    description: 'Find the hidden admin credentials inside the ghost database. Standard login bypass wont be enough.'
  },
  {
    id: 'ch-2',
    name: 'Buffer Overflow: Memory Leaks',
    points: 250,
    category: 'Pwn',
    difficulty: 'Medium',
    flag: 'flag{stack_overflow_success}',
    description: 'Overwrite the return address on the stack to redirect execution flow to the secret function.'
  }
];

const AdminTerminal: React.FC = () => {
  const { notify } = useNotification();
  const [challenges, setChallenges] = useState<ChallengeItem[]>(INITIAL_CHALLENGES);
  
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Web');
  const [points, setPoints] = useState(100);
  const [difficulty, setDifficulty] = useState('Easy');
  const [flag, setFlag] = useState('');
  const [description, setDescription] = useState('');

  const [logs, setLogs] = useState<string[]>([
    '[SYSTEM] Admin terminal session initialized.',
    '[DATABASE] Connection parameters validated.',
    '[AUDIT] Querying challenge node counts...'
  ]);

  const fetchChallenges = async () => {
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*');
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        const mapped = data.map((c: any) => ({
          id: c.id,
          name: c.name,
          points: c.points,
          category: c.category,
          difficulty: c.difficulty,
          flag: c.flag || '',
          description: c.description || ''
        }));
        setChallenges(mapped);
      }
    } catch (err) {
      console.error('Failed to load challenges from Supabase:', err);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleAddChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !flag || !description) {
      notify('ALL FIELDS MUST BE SPECIFIED', 'error');
      return;
    }

    try {
      const { error } = await supabase
        .from('challenges')
        .insert([
          {
            name,
            category,
            difficulty,
            points,
            flag,
            description,
            solves_count: 0
          }
        ])
        .select();

      if (error) throw error;

      setLogs(prev => [
        ...prev,
        `[CREATE] Created challenge "${name}" (+${points} PTS) in database`
      ]);
      notify('CHALLENGE DEPLOYED SUCCESSFULLY TO DATABASE', 'success');

      // Refresh list
      await fetchChallenges();

      // Reset Form
      setName('');
      setFlag('');
      setDescription('');
    } catch (err: any) {
      notify(err.message || 'FAILED TO DEPLOY CHALLENGE', 'error');
    }
  };

  const handleDeleteChallenge = async (id: string, challengeName: string) => {
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setLogs(prev => [
        ...prev,
        `[DELETE] Removed challenge "${challengeName}" from database`
      ]);
      notify('CHALLENGE REMOVED FROM ACTIVE MATRIX', 'info');

      // Refresh list
      await fetchChallenges();
    } catch (err: any) {
      notify(err.message || 'FAILED TO REMOVE CHALLENGE', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-scale-in">
      <div className="border-b border-[#ff3366]/30 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-white font-mono font-black text-2xl tracking-[4px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-[#ff3366] drop-shadow-[0_0_10px_rgba(255,51,102,0.3)]">
            ADMIN MATRIX CONTROL
          </h1>
          <p className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest mt-1">
            System administration & node verification interface
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#ff3366]/5 border border-[#ff3366]/20 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff3366] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff3366]"></span>
          </span>
          <span className="text-[10px] font-mono text-[#ff3366] tracking-[2px] uppercase">ROOT PRIVILEGES ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Challenge Creator (Form) */}
        <div className="lg:col-span-1 bg-[#0d101b]/80 border border-[#ff3366]/20 p-6 rounded-xl relative flex flex-col justify-between">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff3366]" />
          
          <div>
            <h2 className="text-white font-mono font-bold text-sm tracking-widest uppercase mb-6 border-b border-[#ff3366]/10 pb-3">
              Deploy Challenge
            </h2>

            <form onSubmit={handleAddChallenge} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[#64748b] text-[9px] font-mono uppercase">Challenge Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. CSRF Attack Vector"
                  className="bg-black border border-[#333] p-2 text-[#ff3366] rounded focus:outline-none focus:border-[#ff3366] font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] font-mono uppercase">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-black border border-[#333] p-2 text-[#ff3366] rounded focus:outline-none focus:border-[#ff3366] font-mono text-xs"
                  >
                    <option value="Web">Web</option>
                    <option value="Pwn">Pwn</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Reverse">Reverse</option>
                    <option value="Forensics">Forensics</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] font-mono uppercase">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="bg-black border border-[#333] p-2 text-[#ff3366] rounded focus:outline-none focus:border-[#ff3366] font-mono text-xs"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                    <option value="Insane">Insane</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] font-mono uppercase">Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="bg-black border border-[#333] p-2 text-[#ff3366] rounded focus:outline-none focus:border-[#ff3366] font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] font-mono uppercase">Target Flag</label>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="flag{...}"
                    className="bg-black border border-[#333] p-2 text-[#ff3366] rounded focus:outline-none focus:border-[#ff3366] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#64748b] text-[9px] font-mono uppercase">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Challenge details..."
                  className="bg-black border border-[#333] p-2 text-[#ff3366] rounded focus:outline-none focus:border-[#ff3366] font-mono text-xs resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[#ff3366]/10 border border-[#ff3366] text-[#ff3366] hover:bg-[#ff3366]/20 font-mono text-[10px] uppercase tracking-widest rounded transition-all cursor-pointer"
              >
                DEPLOY NODE
              </button>
            </form>
          </div>
        </div>

        {/* Challenge List & Log Console */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active List */}
          <div className="bg-[#0d101b]/80 border border-[#ff3366]/20 p-6 rounded-xl relative">
            <h2 className="text-white font-mono font-bold text-sm tracking-widest uppercase mb-4 border-b border-[#ff3366]/10 pb-3">
              Active Custom Nodes
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-[#ff3366]/10 bg-black/40 text-[#64748b] text-[10px]">
                    <th className="p-3">Challenge Name</th>
                    <th className="p-3 text-center">Category</th>
                    <th className="p-3 text-right">Points</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {challenges.map(c => (
                    <tr key={c.id} className="border-b border-[#ff3366]/5 hover:bg-[#ff3366]/5 transition-colors">
                      <td className="p-3 text-white font-bold">{c.name}</td>
                      <td className="p-3 text-center text-[#ff3366]">{c.category}</td>
                      <td className="p-3 text-right text-[#00f0ff]">{c.points}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => handleDeleteChallenge(c.id, c.name)}
                          className="px-2 py-1 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded text-[9px] uppercase tracking-wide cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {challenges.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-[#64748b]">
                        No active custom challenges detected.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-black/80 border border-[#ff3366]/20 p-5 rounded-xl flex flex-col">
            <h2 className="text-[#ff3366] font-mono font-bold text-xs tracking-widest uppercase mb-3">
              AUDIT LOG CONSOLE
            </h2>
            <div className="h-28 overflow-y-auto font-mono text-[9px] text-[#64748b] flex flex-col gap-1.5 bg-black/60 p-3 rounded border border-white/5">
              {logs.map((log, idx) => (
                <p key={idx}>{log}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTerminal;
