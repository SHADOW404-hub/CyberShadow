import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../services/supabase';

const LoginForm: React.FC<{ onSwitch: () => void; onForgotPassword: () => void }> = ({ onSwitch, onForgotPassword }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({
    text: 'READY',
    type: 'info'
  });
  const { signIn } = useAuth();
  const { notify } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !pass) {
      const msg = 'PLEASE ENTER YOUR USERNAME AND PASSWORD';
      setStatus({ text: msg, type: 'error' });
      notify(msg, 'error');
      return;
    }

    setIsBusy(true);
    setStatus({ text: 'CHECKING CREDENTIALS...', type: 'info' });

    let userExists = false;
    try {
      if (id.includes('@')) {
        const { data } = await supabase.from('profiles').select('email').eq('email', id).maybeSingle();
        if (data) userExists = true;
      } else {
        const { data } = await supabase.from('profiles').select('email').eq('username', id).maybeSingle();
        if (data) userExists = true;
      }
    } catch (err) {
      userExists = true;
    }

    if (!userExists) {
      setStatus({ text: 'USER NOT FOUND', type: 'error' });
      notify('User not found', 'error');
      setIsBusy(false);
      return;
    }

    const { error } = await signIn(id, pass);

    if (error) {
      setStatus({ text: 'INCORRECT PASSWORD', type: 'error' });
      notify('Incorrect password', 'error');
      setIsBusy(false);
    } else {
      setStatus({ text: 'WELCOME', type: 'success' });
      notify('Welcome', 'success');
    }
  };

  return (
    <div className="bg-[#0d101b]/90 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <img
            src="/favicon.svg"
            alt="CyberShadow Logo"
            className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
          />
        </div>
      </div>

      <h2 className="text-white tracking-[3px] mb-6 text-center text-xl font-bold font-mono">Log In</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
        <div className="relative mb-1">
          {/* Cyberpunk Decorative Corners */}
          <div className={`absolute -top-1 -left-1 w-2 h-2 border-t border-l transition-colors duration-500 ${
            status.type === 'error' ? 'border-[#ff3366]' : status.type === 'success' ? 'border-[#00ff66]' : 'border-[#00f0ff]'
          }`} />
          <div className={`absolute -bottom-1 -right-1 w-2 h-2 border-b border-r transition-colors duration-500 ${
            status.type === 'error' ? 'border-[#ff3366]' : status.type === 'success' ? 'border-[#00ff66]' : 'border-[#00f0ff]'
          }`} />

          {/* Status Box */}
          <div className={`p-3 rounded-lg border text-[10px] font-mono text-center tracking-[2px] transition-all duration-500 transform ${
            status.type === 'error'
              ? 'bg-[#ff3366]/10 border-[#ff3366]/40 text-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.2)]'
              : status.type === 'success'
              ? 'bg-[#00ff66]/10 border-[#00ff66]/40 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.2)]'
              : 'bg-[#00f0ff]/10 border-[#00f0ff]/40 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
          } ${isBusy ? 'animate-pulse scale-[1.02]' : 'scale-100'}`}>
            <div className="flex items-center justify-center gap-3 uppercase italic">
              {!isBusy && <div className={`w-1.5 h-1.5 rounded-full animate-ping ${
                status.type === 'error' ? 'bg-[#ff3366]' : status.type === 'success' ? 'bg-[#00ff66]' : 'bg-[#00f0ff]'
              }`} />}
              <span className="font-bold">{status.text}</span>
              {isBusy && (
                <span className="w-1.5 h-3 bg-current animate-bounce opacity-80" />
              )}
            </div>
          </div>
        </div>

        {/* Username / Email */}
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">Username or Email</label>
          <input
            type="text"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors font-mono"
            placeholder="Enter your username or email"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">Password</label>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] transition-colors font-mono"
            placeholder="••••••••"
          />
          <div className="flex justify-center mt-1.5">
            <button
              type="button"
              onClick={onForgotPassword}
              className="forgot-password-link text-sm font-mono cursor-pointer bg-transparent border-none p-0 font-semibold"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] text-black py-3.5 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 font-mono tracking-[1px]"
        >
          {isBusy ? 'Logging in...' : 'Log In'}
        </button>

        <p className="text-[#64748b] text-xs text-center">
          Don't have an account?{' '}
          <span onClick={onSwitch} className="text-[#9d4edd] cursor-pointer font-bold hover:underline">
            Create account
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
