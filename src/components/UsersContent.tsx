import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';

interface UserProfile {
  id: string;
  username: string;
  role: string;
  created_at: string;
  avatar_url?: string;
}

const UsersContent: React.FC = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Profiles jadvalidan barcha foydalanuvchilarni olamiz
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      setError('Maʼlumotlarni yuklashda xatolik yuz berdi. Jadval mavjudligini tekshiring.');
      console.error('Foydalanuvchilarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user => 
    (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    user.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header section with Search and Refresh */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-[#00f0ff] font-mono text-2xl font-black tracking-[4px] uppercase flex items-center gap-3">
            <div className="w-3 h-8 bg-[#00f0ff]/20 border-l-4 border-[#00f0ff]"></div>
            User_Registry
          </h2>
          <p className="text-white/20 text-[9px] uppercase tracking-[2px] mt-1 font-mono">Access Level: Administrator Protocol</p>
        </div>

        <div className="flex gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none">
            <input 
              type="text" 
              placeholder="SEARCH_ENTITY..."
              className="bg-[#0d101b]/80 border border-[#00f0ff]/20 px-4 py-2.5 rounded-lg text-[10px] font-mono focus:outline-none focus:border-[#00f0ff]/50 transition-all w-full lg:w-80 text-[#00f0ff] placeholder:text-[#00f0ff]/20 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={fetchUsers}
            className="bg-[#00f0ff]/5 border border-[#00f0ff]/30 px-5 py-2.5 rounded-lg text-[#00f0ff] text-[10px] font-bold uppercase tracking-[2px] hover:bg-[#00f0ff]/10 hover:border-[#00f0ff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.1)] active:scale-95"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table section */}
      <div className="bg-[#0d101b]/40 border border-[#00f0ff]/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
        <div className="overflow-x-auto custom-scrollbar max-h-[calc(100vh-280px)] overflow-y-auto">
          <table className="w-full text-left font-mono text-[11px] border-collapse">
            <thead className="sticky top-0 z-10 bg-[#0d101b] border-b border-[#00f0ff]/20 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <tr className="bg-[#00f0ff]/5 text-[#00f0ff]/50 font-bold tracking-[2px] uppercase">
                <th className="px-8 py-5">Entity_UID</th>
                <th className="px-8 py-5">Username</th>
                <th className="px-8 py-5">Auth_Role</th>
                <th className="px-8 py-5">Sync_Date</th>
                <th className="px-8 py-5 text-right">Access_Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#00f0ff]/5">
              {error ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <span className="text-red-500 font-bold uppercase tracking-[2px]">{error}</span>
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center">
                    <span className="text-white/10 italic tracking-[5px] uppercase animate-pulse font-bold">Scanning_Network...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-24 text-center text-white/10 italic tracking-[5px] uppercase font-bold">
                    Zero_Entities_Detected
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-[#00f0ff]/5 group transition-all duration-300">
                    <td className="px-8 py-5 text-white/30 font-mono tracking-tighter group-hover:text-white/60">
                      {user.id.substring(0, 18)}...
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-[#0d101b] border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] font-bold shadow-[inset_0_0_10px_rgba(0,240,255,0.1)] overflow-hidden">
                          {user.avatar_url ? (
                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                          ) : (
                            user.username?.[0]?.toUpperCase() || '?'
                          )}
                        </div>
                        <span className="text-white font-bold tracking-wider group-hover:text-[#00f0ff] transition-colors">{user.username || 'NULL_IDENTITY'}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                        user.role === 'admin' 
                          ? 'bg-[#ff3366]/10 text-[#ff3366] border-[#ff3366]/30 shadow-[0_0_15px_rgba(255,51,102,0.1)]' 
                          : 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-white/30 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <span className="inline-flex items-center gap-2 text-[#00ff66] text-[9px] font-bold uppercase tracking-widest bg-[#00ff66]/5 px-3 py-1 rounded-full border border-[#00ff66]/20">
                        <span className="w-1.5 h-1.5 bg-[#00ff66] rounded-full shadow-[0_0_8px_#00ff66] animate-pulse"></span>
                        Authorized
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Status bar */}
        {!loading && (
          <div className="bg-[#00f0ff]/2 px-8 py-3 border-t border-[#00f0ff]/10 flex justify-between items-center text-[9px] font-mono text-white/20 uppercase tracking-widest">
            <span>Registry_Status: Stable</span>
            <span>Total_Nodes: {filteredUsers.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersContent;