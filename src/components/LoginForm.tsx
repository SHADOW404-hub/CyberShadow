import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const LoginForm: React.FC<{ onSwitch: () => void; onForgotPassword: () => void }> = ({ onSwitch, onForgotPassword }) => {
  const [id, setId] = useState('');
  const [pass, setPass] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { signIn } = useAuth();
  const { notify } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !pass) {
      notify('Please enter your username and password', 'error');
      return;
    }

    setIsBusy(true);
    const { error } = await signIn(id, pass);

    if (error) {
      notify(error, 'error');
      setIsBusy(false);
    } else {
      notify('Welcome back! Login successful', 'success');
    }
  };

  return (
    <div className="bg-[#0d101b]/90 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      {/* Logo */}
      <div className="flex justify-center mb-5">
        <img
          src="/favicon.svg"
          alt="CyberShadow Logo"
          className="w-16 h-16 drop-shadow-[0_0_18px_rgba(0,240,255,0.7)]"
        />
      </div>

      <h2 className="text-white tracking-[3px] mb-6 text-center text-xl font-bold font-mono">Sign In</h2>

      <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-[#9d4edd] text-xs font-mono hover:underline cursor-pointer bg-transparent border-none p-0"
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
          {isBusy ? 'Signing in...' : 'Sign In'}
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
