import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { supabase } from '../services/supabase';

const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'error' | 'info' }>({
    text: 'READY',
    type: 'info'
  });
  const { signUp } = useAuth();
  const { notify } = useNotification();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password, confirm } = formData;

    if (!username || !email || !password) {
      const msg = 'Please fill in all required fields';
      setStatus({ text: msg, type: 'error' });
      notify(msg, 'error');
      return;
    }

    if (password !== confirm) {
      const msg = 'Passwords do not match';
      setStatus({ text: msg, type: 'error' });
      notify(msg, 'error');
      return;
    }

    setIsBusy(true);
    setStatus({ text: 'VERIFYING USERNAME...', type: 'info' });

    let usernameTaken = false;
    try {
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
      if (existingUser) {
        usernameTaken = true;
      }
    } catch (err) {
      console.warn('Username availability check failed:', err);
    }

    if (usernameTaken) {
      const msg = 'This username is already taken';
      setStatus({ text: msg, type: 'error' });
      notify(msg, 'error');
      setIsBusy(false);
      return;
    }

    setStatus({ text: 'CREATING ACCOUNT...', type: 'info' });
    const { error } = await signUp(email, password, username);

    if (error) {
      setStatus({ text: error, type: 'error' });
      notify(error, 'error');
      setIsBusy(false);
    } else {
      const msg = 'Account created! Please check your email to confirm.';
      setStatus({ text: msg, type: 'success' });
      notify(msg, 'success');
      setTimeout(() => {
        setIsBusy(false);
        onSwitch();
      }, 1500);
    }
  };

  return (
    <div className="bg-[#0d101b]/90 py-7 px-10 rounded-2xl border border-[#9d4edd]/20 w-full backdrop-blur-md">
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 bg-[#9d4edd]/5 border border-[#9d4edd]/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(157,78,221,0.15)]">
          <img
            src="/favicon.svg"
            alt="CyberShadow Logo"
            className="w-12 h-12 drop-shadow-[0_0_10px_rgba(157,78,221,0.7)]"
          />
        </div>
      </div>

      <h2 className="text-white tracking-[3px] mb-5 text-center text-xl font-bold font-mono">Create Account</h2>

      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
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

        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">Username</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors font-mono"
            placeholder="Choose a username"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors font-mono"
            placeholder="name@example.com"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">Password</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors font-mono"
            placeholder="••••••••"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">Confirm Password</label>
          <input
            type="password"
            value={formData.confirm}
            onChange={(e) => setFormData({ ...formData, confirm: e.target.value })}
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors font-mono"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isBusy}
          className="bg-gradient-to-r from-[#9d4edd] to-[#ff007f] text-white py-3.5 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 mt-2.5 font-mono tracking-[1px]"
        >
          {isBusy ? 'Creating account...' : 'Create Account'}
        </button>

        <p className="text-[#64748b] text-xs text-center mt-2">
          Already have an account?{' '}
          <span onClick={onSwitch} className="text-[#00f0ff] cursor-pointer font-bold hover:underline">
            Log in
          </span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
