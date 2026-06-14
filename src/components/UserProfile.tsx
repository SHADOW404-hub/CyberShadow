import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../services/supabase';

const UserProfile: React.FC = () => {
  const { profile, refreshProfile } = useAuth();
  const { notify } = useNotification();
  const [username, setUsername] = useState(profile?.username || '');
  const [country, setCountry] = useState(profile?.country || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          country,
          avatar_url: avatarUrl || null,
        })
        .eq('id', profile.id);

      if (error) throw error;

      await refreshProfile();
      notify('PROFILE UPDATED SUCCESSFULLY', 'success');
    } catch (err: any) {
      notify(err.message || 'FAILED TO UPDATE PROFILE', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-scale-in">
      <div className="border-b border-[#00f0ff]/15 pb-6">
        <h1 className="text-white font-mono font-black text-2xl tracking-[4px] uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
          User Profile
        </h1>
        <p className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest mt-1">
          Customize profile metadata and security credentials
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar and Quick Stats */}
        <div className="lg:col-span-1 bg-[#0d101b]/60 border border-[#00f0ff]/15 p-6 rounded-xl flex flex-col items-center justify-between text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#00f0ff]/20 to-transparent" />
          
          <div className="flex flex-col items-center w-full">
            {/* Avatar container */}
            <div className="relative w-28 h-28 rounded-full border-2 border-[#00f0ff]/30 overflow-hidden bg-black/40 flex items-center justify-center mb-6">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#00f0ff] font-mono font-bold text-3xl drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                  {(profile?.username || 'U').charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            <h3 className="text-white font-mono font-bold text-lg uppercase tracking-wider mb-1">
              {profile?.username || 'GHOST_OPERATOR'}
            </h3>
            <span className="text-[#64748b] font-mono text-[10px] uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded border border-white/5">
              Role: {profile?.role || 'user'}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-[#00f0ff]/10">
            <div className="flex flex-col items-center p-3 bg-black/30 border border-[#333] rounded-lg">
              <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-widest">Score</span>
              <span className="text-[#00f0ff] font-mono text-sm font-black mt-1">1,450</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-black/30 border border-[#333] rounded-lg">
              <span className="text-[#64748b] font-mono text-[9px] uppercase tracking-widest">Rank</span>
              <span className="text-[#00ff66] font-mono text-sm font-black mt-1">#42</span>
            </div>
          </div>
        </div>

        {/* Right Side: Account Settings Form */}
        <div className="lg:col-span-2 bg-[#0d101b]/80 border border-[#00f0ff]/15 p-8 rounded-xl relative">
          <div className="absolute top-0 right-0 w-2 h-2 bg-[#00f0ff] opacity-40" />

          <h2 className="text-white font-mono font-bold text-sm tracking-widest uppercase mb-6 border-b border-[#00f0ff]/10 pb-3">
            Account Settings
          </h2>

          <form onSubmit={handleUpdate} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Username Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[#64748b] text-[10px] font-mono uppercase tracking-wider">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required // Bu qatorni o'zgartirmaymiz, chunki u funksionallikni ta'minlaydi
                  placeholder="Your username"
                  className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-xs"
                />
              </div>

              {/* Country Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[#64748b] text-[10px] font-mono uppercase tracking-wider">Region / Country</label>
                <input
                  type="text" // Bu qatorni o'zgartirmaymiz
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="e.g. Uzbekistan, Cyber-Space"
                  className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-xs"
                />
              </div>
            </div>

            {/* Avatar URL Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[#64748b] text-[10px] font-mono uppercase tracking-wider">Avatar Image URL</label>
              <input
                type="url" // Bu qatorni o'zgartirmaymiz
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.jpg"
                className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors font-mono text-xs"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3 bg-[#00f0ff]/10 border border-[#00f0ff] text-[#00f0ff] hover:bg-[#00f0ff]/20 font-mono text-[10px] uppercase tracking-widest rounded-lg cursor-pointer transition-all duration-300 disabled:opacity-50"
              > 
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
