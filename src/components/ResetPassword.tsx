import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ResetPassword: React.FC = () => {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [systemTime, setSystemTime] = useState('');
  
  const { updatePassword } = useAuth();
  const { notify } = useNotification();

  // Soatni yangilab turish (vibe uchun)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(`TIME: ${now.toISOString().replace('T', ' ').split('.')[0]}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pass.length < 6 || !/\d/.test(pass)) {
      notify('POLICY: Min 6 chars with at least one digit required', 'error');
      return;
    }

    if (pass !== confirm) {
      notify('SECURITY: Passwords do not match', 'error');
      return;
    }

    setIsBusy(true);
    const { error } = await updatePassword(pass);

    if (error) {
      notify(error, 'error');
      setIsBusy(false);
    } else {
      notify('SECURED: Password updated. Redirecting...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  return (
    <div className="bg-[#0d101b]/95 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      <div className="text-center mb-7.5">
        <h2 className="text-white tracking-[4px] m-0 mb-2.5 text-xl font-bold font-mono">IDENTITY_RECOVERY</h2>
        <div className="text-[#00f0ff] text-[10px] font-mono opacity-70">{systemTime}</div>
      </div>

      <form onSubmit={handleReset} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-[11px] font-mono">NEW_ENCRYPT_KEY</label>
          <div className="relative flex">
            <input 
              type={showPass ? "text" : "password"} 
              value={pass} 
              onChange={(e) => setPass(e.target.value)} 
              className="flex-1 bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
              placeholder="••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)} 
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#64748b] text-[10px] cursor-pointer hover:text-white font-mono"
            >
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-[11px] font-mono">CONFIRM_KEY</label>
          <input 
            type="password" 
            value={confirm} 
            onChange={(e) => setConfirm(e.target.value)} 
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
            placeholder="••••••"
          />
        </div>

        <button type="submit" disabled={isBusy} className="bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] text-black py-3.5 px-4 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 tracking-[2px] font-mono">
          {isBusy ? 'UPDATING_NODE...' : 'SECURE_ACCOUNT'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
