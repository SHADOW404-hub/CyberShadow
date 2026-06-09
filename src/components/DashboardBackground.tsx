import React from 'react';

/**
 * DashboardBackground - Dashboard uchun fon.
 * Bu yerda biroz tinchroq, ammo cyberpunk stilidagi fon effektlari bo'ladi.
 */
const DashboardBackground: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1] bg-cyber-base overflow-hidden">
      {/* Subtle Grid */}
      <div className="absolute top-[-50%] left-0 w-full h-[200%] bg-cyber-grid [transform:rotateX(50deg)] pointer-events-none opacity-30 animate-grid-move" />
      
      {/* Subtler Dynamic Neon Orbs */}
      <div className="absolute rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none w-[40vw] h-[40vw] bg-orb-cyan top-[10%] left-[10%]" />
      <div className="absolute rounded-full blur-[80px] opacity-20 mix-blend-screen pointer-events-none w-[50vw] h-[50vw] bg-orb-purple bottom-[5%] right-[5%]" />
      
      {/* Very Subtle Noise */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay pointer-events-none" />
    </div>
  );
};

export default DashboardBackground;