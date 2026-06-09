import React from 'react';

const Profile: React.FC = () => {
  return (
    <div className="bg-[#0d101b]/95 p-8 rounded-2xl border border-[#00f0ff]/25 backdrop-blur-md shadow-[0_0_50px_rgba(0,240,255,0.15)] animate-scale-in">
      <h1 className="text-[#00f0ff] font-mono font-bold text-2xl mb-6 tracking-[4px] uppercase border-b border-[#00f0ff]/10 pb-4">
        Foydalanuvchi Profili
      </h1>
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-[#00f0ff]/5 pb-2">
          <span className="text-[#64748b] font-mono text-xs uppercase tracking-widest">Holati</span>
          <span className="text-[#00ff66] font-mono text-xs uppercase animate-pulse">Online</span>
        </div>
        <div className="text-white/70 font-mono text-sm leading-relaxed">
          Tizimga muvaffaqiyatli kirdingiz. Bu yerda sizning shaxsiy ma'lumotlaringiz va yutuqlaringiz aks etadi.
        </div>
      </div>
    </div>
  );
};

export default Profile;