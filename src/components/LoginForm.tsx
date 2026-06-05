import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const LoginForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { signIn } = useAuth();
  const { notify } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !pass) {
      notify('IDENT_REQUIRED: Credentials missing', 'error');
      return;
    }

    setIsBusy(true);
    const { error } = await signIn(id, pass);
    
    if (error) {
      notify(error, 'error');
      setIsBusy(false);
    } else {
      notify('ACCESS_GRANTED: Welcome to the grid', 'success');
      // Yo'naltirish AuthContext dagi onAuthStateChange orqali avtomatik bo'ladi
    }
  };

  return (
    <div className="bg-[#0d101b]/90 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      <div className="flex justify-center mb-5">
        <i className="ph-bold ph-shield-checkered text-[64px] text-[#00f0ff] drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]"></i>
      </div>
      <h2 className="text-white tracking-[4px] mb-5 text-center text-xl font-bold font-mono">SECURE_LOGIN</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">AGENT_IDENTIFIER</label>
          <input 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors"
            placeholder="Username or Email"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">ENCRYPTED_KEY</label>
          <input 
            type="password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors"
            placeholder="••••••"
          />
        </div>
        <button type="submit" disabled={isBusy} className="bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] text-black py-3.5 px-4 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 font-mono">
          {isBusy ? 'VERIFYING...' : 'INITIATE_AUTH'}
        </button>
        <p className="text-[#64748b] text-xs text-center mt-3.5">
          New identity? <span onClick={onSwitch} className="text-[#9d4edd] cursor-pointer font-bold hover:underline">Register agent</span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
