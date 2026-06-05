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

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toISOString().replace('T', ' ').split('.')[0] + ' UTC');
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (pass.length < 6 || !/\d/.test(pass)) {
      notify('Password must be at least 6 characters and include a number', 'error');
      return;
    }

    if (pass !== confirm) {
      notify('Passwords do not match', 'error');
      return;
    }

    setIsBusy(true);
    const { error } = await updatePassword(pass);

    if (error) {
      notify(error, 'error');
      setIsBusy(false);
    } else {
      notify('Password updated! Redirecting to login...', 'success');
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    }
  };

  return (
    <div className="bg-[#0d101b]/95 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <img
          src="/favicon.svg"
          alt="CyberShadow Logo"
          className="w-16 h-16 drop-shadow-[0_0_18px_rgba(0,240,255,0.7)]"
        />
      </div>

      <div className="text-center mb-7">
        <h2 className="text-white tracking-[2px] mb-2 text-xl font-bold font-mono">Reset Password</h2>
        <div className="text-[#00f0ff] text-[10px] font-mono opacity-60">{systemTime}</div>
      </div>

      <form onSubmit={handleReset} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">New Password</label>
          <div className="relative flex">
            <input
              type={showPass ? 'text' : 'password'}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="flex-1 bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
              placeholder="Min. 6 characters with a number"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[#64748b] text-[10px] cursor-pointer hover:text-white font-mono"
            >
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">Confirm New Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] text-black py-3.5 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 tracking-[1px] font-mono"
        >
          {isBusy ? 'Updating...' : 'Save New Password'}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
