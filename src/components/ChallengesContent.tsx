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
  link?: string | null;
  file_url?: string | null;
}

const CATEGORIES = ['Web', 'Code', 'Crypto', 'Pwn', 'Reverse', 'Forensics'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard', 'Insane'];

// SVG Icons for Category Watermarks and Badges
const WebIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-.91-8-2.465m0 0A9 9 0 0112 3" />
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
  </svg>
);

const CryptoIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
  </svg>
);

const PwnIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
  </svg>
);

const ReverseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m10.5-5.25v1.5M3 12h1.5m10.5-7.5V3m0 9h1.5m-15 0h1.5m7.5 9v-1.5M3 15.75h1.5m10.5-5.25v1.5M16.5 12h1.5m-3.75 3.75V21M12 21v-1.5M15.75 21v-1.5M8.25 21v-1.5m-4.5-9h1.5m7.5-6h3a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-9A2.25 2.25 0 015.25 18.75V5.25A2.25 2.25 0 017.5 3h3" />
  </svg>
);

const ForensicsIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

const getCategoryIcon = (cat: string, className?: string) => {
  switch (cat) {
    case 'Web': return <WebIcon className={className} />;
    case 'Code': return <CodeIcon className={className} />;
    case 'Crypto': return <CryptoIcon className={className} />;
    case 'Pwn': return <PwnIcon className={className} />;
    case 'Reverse': return <ReverseIcon className={className} />;
    case 'Forensics': return <ForensicsIcon className={className} />;
    default: return <CodeIcon className={className} />;
  }
};

const difficultyConfig = {
  Easy: {
    color: '#00ff66',
    border: 'border-[#00ff66]/30',
    shadow: 'shadow-[0_0_30px_rgba(0,255,102,0.25)]',
    text: 'text-[#00ff66]',
    bg: 'bg-gradient-to-br from-[#00ff66]/15 via-[#0d101b] to-[#00ff66]/5',
  },
  Medium: {
    color: '#ffcc00',
    border: 'border-[#ffcc00]/30',
    shadow: 'shadow-[0_0_30px_rgba(255,204,0,0.25)]',
    text: 'text-[#ffcc00]',
    bg: 'bg-gradient-to-br from-[#ffcc00]/15 via-[#0d101b] to-[#ffcc00]/5',
  },
  Hard: {
    color: '#ff3366',
    border: 'border-[#ff3366]/30',
    shadow: 'shadow-[0_0_30px_rgba(255,51,102,0.25)]',
    text: 'text-[#ff3366]',
    bg: 'bg-gradient-to-br from-[#ff3366]/15 via-[#0d101b] to-[#ff3366]/5',
  },
  Insane: {
    color: '#9d4edd',
    border: 'border-[#9d4edd]/30',
    shadow: 'shadow-[0_0_30px_rgba(157,78,221,0.25)]',
    text: 'text-[#9d4edd]',
    bg: 'bg-gradient-to-br from-[#9d4edd]/15 via-[#0d101b] to-[#9d4edd]/5',
  },
};

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
  const [link, setLink] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);

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
    setLink('');
    setFile(null);
    setCurrentFileUrl(null);
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
    setLink(c.link || '');
    setFile(null);
    setCurrentFileUrl(c.file_url || null);
    setShowModal(true);
  };

  const convertFileToBase64 = (f: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(f);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !flag) {
      notify('Please fill out all required fields', 'error');
      return;
    }

    try {
      let finalFileUrl = currentFileUrl;
      if (file) {
        finalFileUrl = await convertFileToBase64(file);
      }

      // Check if real config is enabled for storage upload
      const isRealConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
      if (file && isRealConfigured) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `challenges/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('challenge-files')
            .upload(filePath, file);
            
          if (uploadError) {
            console.warn('Real Supabase Storage upload failed, using Base64 in db:', uploadError);
          } else {
            const { data: { publicUrl } } = supabase.storage
              .from('challenge-files')
              .getPublicUrl(filePath);
            finalFileUrl = publicUrl;
          }
        } catch (storageErr) {
          console.warn('Supabase storage upload error:', storageErr);
        }
      }

      const payload = {
        name,
        points: Number(points),
        category,
        difficulty,
        description,
        flag,
        link: link || null,
        file_url: finalFileUrl
      };

      if (editingChallenge) {
        // Update
        const { error } = await supabase
          .from('challenges')
          .update(payload)
          .eq('id', editingChallenge.id);

        if (error) throw error;
        notify('CHALLENGE UPDATED', 'success');
      } else {
        // Create
        const { error } = await supabase
          .from('challenges')
          .insert([{
            ...payload,
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

  const currentConfig = difficultyConfig[difficulty];

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div
            onClick={() => setShowModal(false)}
            className="absolute inset-0 bg-[#0d101b]/80 backdrop-blur-md"
          />
          <div className="relative bg-[#0d101b] border border-[#ff3366]/30 p-8 rounded-2xl max-w-xl w-full shadow-[0_0_40px_rgba(255,51,102,0.15)] animate-scale-in my-8">
            {/* Cyberpunk decoration */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#ff3366]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#ff3366]" />

            <h3 className="text-white font-mono font-bold text-lg tracking-wide uppercase mb-4 border-b border-[#ff3366]/10 pb-3 flex justify-between items-center">
              <span>{editingChallenge ? 'Modify Target Node' : 'Initialize Target Node'}</span>
              <button 
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white text-xs font-mono tracking-widest transition-colors cursor-pointer"
              >
                [CLOSE]
              </button>
            </h3>

            {/* Dynamic Access Key Card Preview */}
            <div className="w-full flex justify-center mb-6">
              <div className={`w-full max-w-[340px] aspect-[1.586] rounded-xl p-5 relative overflow-hidden transition-all duration-500 shadow-2xl border ${currentConfig.border} ${currentConfig.bg} ${currentConfig.shadow}`}>
                
                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:8px_8px] pointer-events-none" />
                
                {/* Glow Orb */}
                <div 
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[50px] opacity-10 pointer-events-none transition-all duration-500"
                  style={{
                    background: `radial-gradient(circle, ${currentConfig.color} 0%, transparent 70%)`
                  }}
                />

                {/* Watermark Logo */}
                <div className="absolute -right-6 -bottom-6 w-36 h-36 opacity-[0.05] text-white pointer-events-none transform rotate-12 transition-all duration-500">
                  {getCategoryIcon(category, "w-full h-full")}
                </div>

                {/* Top Section */}
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span className="text-[7px] font-bold text-white/20 tracking-[2px] uppercase">SHADOW NET</span>
                  </div>

                  <div className="px-2 py-0.5 rounded border border-white/5 bg-white/5 flex items-center gap-1">
                    <div className="w-2.5 h-2.5 text-white/40">
                      {getCategoryIcon(category, "w-full h-full")}
                    </div>
                    <span className="text-[7px] font-black text-white/50 tracking-wider uppercase">{category}</span>
                  </div>
                </div>

                {/* Metal Smart Chip */}
                <div className="mt-4 relative z-10 w-7 h-5 rounded bg-gradient-to-br from-amber-400/40 via-amber-200/20 to-amber-500/40 border border-amber-300/30 overflow-hidden flex flex-col justify-between p-0.5">
                  <div className="h-[0.5px] bg-amber-200/20 w-full" />
                  <div className="flex justify-between h-1.5">
                    <div className="w-[0.5px] bg-amber-200/20 h-full" />
                    <div className="w-[0.5px] bg-amber-200/20 h-full" />
                    <div className="w-[0.5px] bg-amber-200/20 h-full" />
                  </div>
                  <div className="h-[0.5px] bg-amber-200/20 w-full" />
                </div>

                {/* Center Node Name */}
                <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 text-center z-10">
                  <h4 
                    className={`text-xs font-black tracking-[2px] uppercase truncate transition-all duration-300 ${currentConfig.text}`}
                    style={{
                      textShadow: `0 0 8px ${currentConfig.color}33`
                    }}
                  >
                    {name || "TARGET_NODE_UNNAMED"}
                  </h4>
                  <span className="text-[6px] text-white/25 tracking-[1px] uppercase mt-0.5 block">Access Identifier</span>
                </div>

                {/* Bottom Row */}
                <div className="absolute bottom-4 inset-x-5 flex justify-between items-end relative z-10">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[5px] text-white/20 tracking-[1px] uppercase">threat_level</span>
                    <span className={`text-[8px] font-black tracking-widest uppercase ${currentConfig.text}`}>
                      {difficulty}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-0.5">
                    <span className="text-[5px] text-white/20 tracking-[1px] uppercase">node_value</span>
                    <span className="text-[9px] font-mono font-bold text-white tracking-widest">
                      {points ? `${points} PTS` : "0 PTS"}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Challenge Name</label>
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
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Category / Type</label>
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

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Link (Optional)</label>
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    placeholder="https://challenge.example.com"
                    className="bg-black border border-[#333] p-2.5 text-[#ff3366] rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Resource File (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                    className="bg-black border border-[#333] p-2 text-white/50 rounded-lg focus:outline-none focus:border-[#ff3366] transition-colors font-mono text-[10px] file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-[9px] file:font-mono file:bg-[#ff3366]/10 file:text-[#ff3366] file:hover:bg-[#ff3366]/20 file:cursor-pointer"
                  />
                  {currentFileUrl && !file && (
                    <span className="text-[#64748b] text-[8px] truncate block mt-1">
                      Current attachment exists: {currentFileUrl.startsWith('data:') ? 'Base64 Encoded Resource' : currentFileUrl}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[#64748b] text-[9px] uppercase tracking-wider">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Challenge briefing details..."
                  rows={3}
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