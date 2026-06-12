import React from 'react';

interface Module {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  lessonsCount: number;
}

const MODULES: Module[] = [
  {
    id: 'mod-1',
    title: 'Introduction to SQL Injection',
    category: 'Web Hacking',
    difficulty: 'Beginner',
    duration: '45 mins',
    description: 'Learn the fundamentals of relational databases, dynamic queries, and how user input can alter query logic.',
    lessonsCount: 5
  },
  {
    id: 'mod-2',
    title: 'Buffer Overflow Foundations',
    category: 'Pwn / Exploitation',
    difficulty: 'Intermediate',
    duration: '2 hours',
    description: 'Understand the x86 stack layout, registers, stack frames, and instructions for memory corruption exploits.',
    lessonsCount: 8
  },
  {
    id: 'mod-3',
    title: 'Modern Cryptography Fundamentals',
    category: 'Cryptography',
    difficulty: 'Beginner',
    duration: '1.5 hours',
    description: 'Explore symmetric vs asymmetric encryption, XOR, hash functions, and common algorithmic weaknesses.',
    lessonsCount: 6
  },
  {
    id: 'mod-4',
    title: 'Reverse Engineering with Ghidra',
    category: 'Reverse Engineering',
    difficulty: 'Advanced',
    duration: '3 hours',
    description: 'Learn to disassemble and decompile compiled C/C++ binaries, navigate assembly instructions, and analyze flow.',
    lessonsCount: 10
  }
];

const Learn: React.FC = () => {
  return (
    <div className="flex flex-col gap-8 w-full animate-scale-in">
      <div className="border-b border-[#00f0ff]/15 pb-6">
        <h1 className="text-white font-mono font-black text-2xl tracking-[4px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
          ACADEMY TERMINAL
        </h1>
        <p className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest mt-1">
          Cyber security research papers, tutorials, and training modules
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MODULES.map(mod => (
          <div
            key={mod.id}
            className="bg-[#0d101b]/60 border border-[#00f0ff]/15 hover:border-[#00f0ff]/40 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between group transition-all duration-300"
          >
            {/* Top edge neon line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-[#00f0ff]/10 group-hover:bg-[#00f0ff]/30 transition-colors" />

            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-[#00f0ff] font-mono text-[9px] uppercase tracking-wider bg-[#00f0ff]/5 border border-[#00f0ff]/10 px-2 py-0.5 rounded">
                  {mod.category}
                </span>
                <span className={`font-mono text-[9px] uppercase tracking-wider ${
                  mod.difficulty === 'Beginner' ? 'text-[#00ff66]' :
                  mod.difficulty === 'Intermediate' ? 'text-[#ffcc00]' :
                  'text-[#ff3366]'
                }`}>
                  {mod.difficulty}
                </span>
              </div>

              <h3 className="text-white font-mono font-bold text-base mb-3 group-hover:text-[#00f0ff] transition-colors uppercase tracking-wide">
                {mod.title}
              </h3>

              <p className="text-[#94a3b8] font-mono text-xs leading-relaxed mb-6">
                {mod.description}
              </p>
            </div>

            <div className="flex justify-between items-center border-t border-[#00f0ff]/5 pt-4 text-[10px] font-mono text-[#64748b]">
              <span>Lessons: <strong className="text-white/80">{mod.lessonsCount}</strong></span>
              <span>Est. time: <strong className="text-white/80">{mod.duration}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Learn;
