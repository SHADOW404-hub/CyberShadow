import React from 'react';

/**
 * CyberBackground - Saytning global foni. 
 * Barcha vizual effektlar (Grid, Orblar, Noise) shu yerda jamlangan.
 */
const CyberBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-cyber-base overflow-hidden">
      {/* 3D Perspektivali Grid */}
      <div className="absolute top-[-50%] left-0 w-full h-[200%] bg-cyber-grid [transform:rotateX(50deg)] pointer-events-none animate-grid-move" />
      
      {/* Dinamik Neon Orblar */}
      <div className="absolute rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none w-[60vw] h-[60vw] bg-orb-cyan top-[-10%] left-[-10%]" />
      <div className="absolute rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none w-[70vw] h-[70vw] bg-orb-purple bottom-[-15%] right-[-10%]" />
      <div className="absolute rounded-full blur-[120px] opacity-[0.15] mix-blend-screen pointer-events-none w-[300px] h-[350px] bg-orb-pink top-[40%] left-[50%] -translate-x-1/2 -translate-y-1/2" />
      
      {/* Vizual shovqin (Cinematic Noise) */}
      <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default CyberBackground;
