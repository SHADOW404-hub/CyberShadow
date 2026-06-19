import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../services/supabase';

interface Challenge {
  id: string;
  name: string;
  points: number;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Insane';
  description: string;
  solved: boolean;
  solvesCount: number;
  flag?: string;
  link?: string | null;
  file_url?: string | null;
}

const INITIAL_CHALLENGES: Challenge[] = [
  {
    id: 'ch-1',
    name: 'SQL Injection: Ghost Echo',
    points: 100,
    category: 'Web',
    difficulty: 'Easy',
    description: 'Find the hidden admin credentials inside the ghost database. Standard login bypass wont be enough.',
    solved: true,
    solvesCount: 142,
    flag: 'flag{sql_ghost_echo}'
  },
  {
    id: 'ch-2',
    name: 'Buffer Overflow: Memory Leaks',
    points: 250,
    category: 'Pwn',
    difficulty: 'Medium',
    description: 'Overwrite the return address on the stack to redirect execution flow to the secret function.',
    solved: false,
    solvesCount: 54,
    flag: 'flag{stack_overflow_success}'
  },
  {
    id: 'ch-3',
    name: 'XOR Matrix Decoder',
    points: 150,
    category: 'Crypto',
    difficulty: 'Easy',
    description: 'A custom XOR encryption mechanism was used to scramble the flags. The key length is 4 bytes.',
    solved: false,
    solvesCount: 98,
    flag: 'flag{xor_matrix_dec}'
  },
  {
    id: 'ch-4',
    name: 'Firmware Analyst: Router-v4',
    points: 400,
    category: 'Reverse',
    difficulty: 'Hard',
    description: 'Reverse engineer the router firmware binary to discover the hidden backdoor credentials.',
    solved: false,
    solvesCount: 12,
    flag: 'flag{router_firmware_breach}'
  },
  {
    id: 'ch-5',
    name: 'Exfiltration: DNS Tunneling',
    points: 300,
    category: 'Forensics',
    difficulty: 'Medium',
    description: 'Analyze the packet capture file (PCAP) to extract the file being exfiltrated via DNS queries.',
    solved: false,
    solvesCount: 38,
    flag: 'flag{dns_exfiltration_detect}'
  },
  {
    id: 'ch-6',
    name: 'Advanced API Bypass',
    points: 500,
    category: 'Web',
    difficulty: 'Insane',
    description: 'An API endpoint is protected by multiple rate limiters and signature validation checks. Exploit the logic flaw.',
    solved: false,
    solvesCount: 3,
    flag: 'flag{api_bypass_insanity}'
  }
];

const Challenges: React.FC = () => {
  const { notify } = useNotification();
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [flagInput, setFlagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const { data, error } = await supabase
          .from('challenges')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mapped: Challenge[] = data.map((c: any) => ({
            id: c.id,
            name: c.name,
            points: c.points,
            category: c.category,
            difficulty: c.difficulty,
            description: c.description || '',
            solved: false,
            solvesCount: c.solves_count || 0,
            flag: c.flag,
            link: c.link || null,
            file_url: c.file_url || null
          }));
          setChallenges(mapped);
        }
      } catch (err) {
        console.error('Failed to load challenges from Supabase, using defaults:', err);
      }
    };
    fetchChallenges();
  }, []);

  const categories = ['All', 'Web', 'Code', 'Pwn', 'Crypto', 'Reverse', 'Forensics'];

  const filteredChallenges = selectedCategory === 'All'
    ? challenges
    : challenges.filter(c => c.category === selectedCategory);

  const handleFlagSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flagInput.trim() || !selectedChallenge) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const isCorrect = selectedChallenge.flag 
        ? flagInput.trim() === selectedChallenge.flag
        : (flagInput.toLowerCase().includes('flag{') || flagInput.includes('csh{'));

      if (isCorrect) {
        notify('SUCCESS: FLAG ACCEPTED!', 'success');
        setChallenges(prev => prev.map(c => 
          c.id === selectedChallenge.id 
            ? { ...c, solved: true, solvesCount: c.solvesCount + 1 } 
            : c
        ));

        // Update solves count in Supabase asynchronously
        supabase.from('challenges')
          .update({ solves_count: selectedChallenge.solvesCount + 1 })
          .eq('id', selectedChallenge.id)
          .then();

        setSelectedChallenge(null);
      } else {
        notify('ERROR: INVALID FLAG SEQUENCE', 'error');
      }
      setIsSubmitting(false);
      setFlagInput('');
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-scale-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#00f0ff]/15 pb-6">
        <div>
          <h1 className="text-white font-mono font-black text-2xl tracking-[4px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
            Mission Dashboard
          </h1>
          <p className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest mt-1">
            Breach security parameters and submit target flags
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-mono text-[9px] uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-black/40 border-[#333] text-white/50 hover:text-white hover:border-[#00f0ff]/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChallenges.map(challenge => (
          <div
            key={challenge.id}
            onClick={() => setSelectedChallenge(challenge)}
            className={`relative group bg-[#0d101b]/80 border ${
              challenge.solved 
                ? 'border-[#00ff66]/30 shadow-[0_0_20px_rgba(0,255,102,0.05)]' 
                : 'border-[#00f0ff]/20 hover:border-[#00f0ff]/60 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]'
            } rounded-xl p-5 cursor-pointer transition-all duration-500 overflow-hidden`}
          >
            {/* Corner Decorative Dots */}
            <div className={`absolute top-0 right-0 w-1.5 h-1.5 ${challenge.solved ? 'bg-[#00ff66]' : 'bg-[#00f0ff]'} opacity-50`} />
            
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono uppercase tracking-wider ${
                challenge.difficulty === 'Easy' ? 'bg-[#00ff66]/10 text-[#00ff66]' :
                challenge.difficulty === 'Medium' ? 'bg-[#ffcc00]/10 text-[#ffcc00]' :
                challenge.difficulty === 'Hard' ? 'bg-[#ff6600]/10 text-[#ff6600]' :
                'bg-[#ff3366]/10 text-[#ff3366]'
              }`}>
                {challenge.difficulty}
              </span>
              <span className="text-[#00f0ff] font-mono text-xs font-bold drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                +{challenge.points} PTS
              </span>
            </div>

            <h3 className="text-white font-mono font-bold text-sm mb-2 group-hover:text-[#00f0ff] transition-colors uppercase tracking-wide">
              {challenge.name}
            </h3>

            <div className="flex justify-between items-center mt-6 text-[10px] font-mono text-[#64748b]">
              <span>Category: <strong className="text-white/80">{challenge.category}</strong></span>
              <span>Solves: <strong className="text-white/80">{challenge.solvesCount}</strong></span>
            </div>

            {challenge.solved && (
              <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#00ff66]/10 border border-[#00ff66]/40 px-2 py-0.5 rounded text-[8px] text-[#00ff66] font-mono uppercase tracking-widest">
                <span className="w-1 h-1 rounded-full bg-[#00ff66]"></span>
                COMPLETED
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Flag Submission Modal */}
      {selectedChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedChallenge(null)}
            className="absolute inset-0 bg-[#0d101b]/80 backdrop-blur-md"
          />
          
          <div className="relative bg-[#0d101b] border border-[#00f0ff]/30 p-8 rounded-2xl max-w-md w-full shadow-[0_0_40px_rgba(0,240,255,0.15)] animate-scale-in">
            {/* Cyberpunk details */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#00f0ff]" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#00f0ff]" />

            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-wider">{selectedChallenge.category} // {selectedChallenge.difficulty}</span>
                <h3 className="text-white font-mono font-bold text-lg tracking-wide uppercase mt-1">
                  {selectedChallenge.name}
                </h3>
              </div>
              <span className="text-[#00f0ff] font-mono text-sm font-bold">
                {selectedChallenge.points} PTS
              </span>
            </div>

            {selectedChallenge.description && (
              <p className="text-[#94a3b8] font-mono text-[11px] leading-relaxed mb-4 bg-black/30 border border-[#333] p-4 rounded-lg">
                {selectedChallenge.description}
              </p>
            )}

            {(selectedChallenge.link || selectedChallenge.file_url) && (
              <div className="flex flex-col gap-2 mb-6">
                <span className="text-[#64748b] text-[9px] uppercase tracking-wider font-mono">Target Resources</span>
                <div className="flex gap-3">
                  {selectedChallenge.link && (
                    <a
                      href={selectedChallenge.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#00f0ff]/10 hover:bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/30 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center font-mono"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Access Service
                    </a>
                  )}
                  {selectedChallenge.file_url && (
                    <a
                      href={selectedChallenge.file_url}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-[#00ff66]/10 hover:bg-[#00ff66]/20 text-[#00ff66] border border-[#00ff66]/30 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer text-center font-mono"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Files
                    </a>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleFlagSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-[#64748b] text-[10px] font-mono uppercase tracking-wider">Submit Flag</label>
                <input
                  type="text"
                  value={flagInput}
                  onChange={(e) => setFlagInput(e.target.value)}
                  placeholder="flag{...} or csh{...}"
                  className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-xs"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setSelectedChallenge(null)}
                  className="flex-1 px-4 py-2.5 border border-[#333] text-[#64748b] hover:text-white rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || selectedChallenge.solved}
                  className="flex-1 px-4 py-2.5 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/20 rounded-lg font-mono text-[10px] uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Verifying...' : selectedChallenge.solved ? 'Solved' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Challenges;
