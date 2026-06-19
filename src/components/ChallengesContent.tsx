import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { useNotification } from '../context/NotificationContext';

interface Challenge {
  id: string;
  name: string;
  points: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  description: string;
  flag: string;
  solves_count?: number;
}

const CATEGORIES = ['Web', 'Pwn', 'Crypto', 'Reverse', 'Forensics'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Insane'];

const ChallengesContent: React.FC = () => {
  const { notify } = useNotification();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [points, setPoints] = useState(100);
  const [category, setCategory] = useState('Web');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Insane'>('Easy');
  const [description, setDescription] = useState('');
  const [flag, setFlag] = useState('');

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('points', { ascending: true });
      if (error) throw error;
      setChallenges(data || []);
    } catch (err: any) {
      notify(err.message || 'Failed to load challenges', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const openCreateModal = () => {
    setEditingChallenge(null);
    setName('');
    setPoints(100);
    setCategory('Web');
    setDifficulty('Easy');
    setDescription('');
    setFlag('');
    setShowModal(true);
  };

  const openEditModal = (c: Challenge) => {
    setEditingChallenge(c);
    setName(c.name);
    setPoints(c.points);
    setCategory(c.category);
    setDifficulty(c.difficulty);
    setDescription(c.description);
    setFlag(c.flag);
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !flag) {
      notify('Please fill out all fields', 'error');
      return;
    }

    try {
      if (editingChallenge) {
        // Update
        const { error } = await supabase
          .from('challenges')
          .update({
            name,
            points: Number(points),
            category,
            difficulty,
            description,
            flag
          })
          .eq('id', editingChallenge.id);

        if (error) throw error;
        notify('CHALLENGE UPDATED', 'success');
      } else {
        // Create
        const { error } = await supabase
          .from('challenges')
          .insert([{
            name,
            points: Number(points),
            category,
            difficulty,
            description,
            flag,
            solves_count: 0
          }]);

        if (error) throw error;
        notify('CHALLENGE CREATED', 'success');
      }
      setShowModal(false);
      fetchChallenges();
    } catch (err: any) {
      notify(err.message || 'Failed to save challenge', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this challenge?')) return;
    try {
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);
      if (error) throw error;
      notify('CHALLENGE DELETED', 'success');
      fetchChallenges();
    } catch (err: any) {
      notify(err.message || 'Failed to delete challenge', 'error');
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-[#ff3366] font-mono text-2xl font-black tracking-[4px] uppercase flex items-center gap-3">
            <div className="w-3 h-8 bg-[#ff3366]/20 border-l-4 border-[#ff3366]" />
            Challenge_Registry
          </h2>
          <p className="text-white/20 text-[9px] uppercase tracking-[2px] mt-1 font-mono">
            Control Protocol: Cyber Mission Deployment
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[#ff3366]/10 border border-[#ff3366] px-5 py-2.5 rounded-lg text-[#ff3366] text-[10px] font-bold uppercase tracking-[2px] hover:bg-[#ff3366]/20 transition-all shadow-[0_0_15px_rgba(255,51,102,0.15)] active:scale-95 cursor-pointer"
        >
          New Challenge
        </button>
      </div>

      {/* Grid List */}
      <div className="bg-[#0d101b]/40 border border-[#ff3366]/15 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0d101b] border-b border-[#ff3366]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <tr className="bg-[#ff3366]/5 text-[#ff3366]/50 font-bold tracking-[2px] uppercase">
                <th className="px-8 py-5">Challenge Name</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Difficulty</th>
                <th className="px-8 py-5">Points</th>
                <th className="px-8 py-5">Flag</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ff3366]/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center">
                    <span className="text-white/10 italic tracking-[5px] uppercase animate-pulse font-bold">
                      Loading registry data...
                    </span>
                  </td>
                </tr>
              ) : challenges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-24 text-center text-white/10 italic tracking-[5px] uppercase font-bold">
                    No challenges registered
                  </td>
                </tr>
              ) : (
                challenges.map((c) => (
                  <tr key={c.id} className="hover:bg-[#ff3366]/5 group transition-all duration-300">
                    <td className="px-8 py-5">
                      <span className="text-white font-bold tracking-wider group-hover:text-[#ff3366] transition-colors">
                        {c.name}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-white/60">{c.category}</td>
                    <td className="px-8 py-5">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${
                        c.difficulty === 'Easy' ? 'bg-[#00ff66]/10 text-[#00ff66] border-[#00ff66]/20' :
                        c.difficulty === 'Medium' ? 'bg-[#ffcc00]/10 text-[#ffcc00] border-[#ffcc00]/20' :
                        c.difficulty === 'Hard' ? 'bg-[#ff6600]/10 text-[#ff6600] border-[#ff6600]/20' :
                        'bg-[#ff3366]/10 text-[#ff3366] border-[#ff3366]/20'
                      }`}>
                        {c.difficulty}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-bold text-[#00f0ff]">{c.points} PTS</td>
                    <td className="px-8 py-5 text-white/30 font-mono text-[10px] max-w-[150px] truncate">
                      {c.flag}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => openEditModal(c)}
                          className="px-3 py-1 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 rounded text-[9px] uppercase tracking-wider transition-all cursor-pointer font-bold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c.id)}
                          className="px-3 py-1 bg-[#ff3366]/10 hover:bg-[#ff3366]/20 text-[#ff3366] border border-[#ff3366]/30 rounded text-[9px] uppercase tracking-wider transition-all cursor-pointer font-bold"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CRUD Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-[#0d101b]/80 backdrop-blur-md"
          />
          <div className="relative bg-[#0d101b] border border-[#ff3366]/30 p-8 rounded-2xl max-w-lg w-full shadow-[0_0_40px_rgba(255,51,102,0.15)] animate-scale-in">
            {/* Cyberpunk decoration */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#ff3366]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#ff3366]" />

            <h3 className="text-white font-mono font-bold text-lg tracking-wide uppercase mb-6 border-b border-[#ff3366]/10 pb-3">
              {editingChallenge ? 'Modify Target Node' : 'Initialize Target Node'}
            </h3>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="SQL Injection: Matrix Link"
                    className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Points</label>
                  <input
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    placeholder="100"
                    className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs cursor-pointer"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-[#0d101b]">{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs cursor-pointer"
                  >
                    {DIFFICULTIES.map(diff => (
                      <option key={diff} value={diff} className="bg-[#0d101b]">{diff}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Flag Pattern</label>
                  <input
                    type="text"
                    value={flag}
                    onChange={(e) => setFlag(e.target.value)}
                    placeholder="flag{secret_hex}"
                    className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Challenge briefing details..."
                  rows={4}
                  className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs resize-none"
                  required
                />
              </div>

              <div className="flex gap-4 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border border-[#333] text-[#64748b] hover:text-white rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2.5 bg-[#ff3366]/10 border border-[#ff3366] text-[#ff3366] hover:bg-[#ff3366]/20 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_15px_rgba(255,51,102,0.3)] font-bold"
                >
                  Save Entity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengesContent;