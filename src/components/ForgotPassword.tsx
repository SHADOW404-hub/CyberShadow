import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ForgotPassword: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [status, setStatus] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);
  const { sendResetEmail } = useAuth();
  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      const msg = 'Please enter your email address';
      setStatus({ text: msg, type: 'error' });
      notify(msg, 'error');
      return;
    }

    setIsBusy(true);
    setStatus(null);
    const { error } = await sendResetEmail(email);

    if (error) {
      setStatus({ text: error, type: 'error' });
      notify(error, 'error');
      setIsBusy(false);
    } else {
      const msg = 'Reset link sent! Please check your email';
      setStatus({ text: msg, type: 'success' });
      notify(msg, 'success');
      setTimeout(() => {
        setIsBusy(false);
        onSwitch();
      }, 2000);
    }
  };

  return (
    <div className="bg-[#0d101b]/95 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      <div className="flex justify-center mb-5">
        <div className="w-20 h-20 bg-[#00f0ff]/5 border border-[#00f0ff]/20 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.15)]">
          <img
            src="/favicon.svg"
            alt="CyberShadow Logo"
            className="w-12 h-12 drop-shadow-[0_0_10px_rgba(0,240,255,0.7)]"
          />
        </div>
      </div>
      <h2 className="text-white tracking-[2px] mb-2 text-center text-xl font-bold font-mono">Reset Password</h2>
      <p className="text-[#64748b] text-xs text-center mb-6">Enter your email to receive a password reset link.</p>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#64748b] text-xs font-mono">Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            className="bg-black border border-[#333] p-3 text-[#00f0ff] rounded-lg focus:outline-none focus:border-[#00f0ff] font-mono transition-colors"
            placeholder="name@example.com"
          />
        </div>

        <button type="submit" disabled={isBusy} className="bg-gradient-to-r from-[#00f0ff] to-[#9d4edd] text-black py-3.5 px-4 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 tracking-[1px] font-mono">
          {isBusy ? 'Sending Link...' : 'Send Reset Link'}
        </button>
        
        {/* Status Box */}
        {status && (
          <div className={`relative p-4 rounded-lg border flex items-center gap-3 text-xs font-mono tracking-[0.5px] overflow-hidden transition-all duration-500 animate-[fadeIn_0.3s_ease-out] ${
            status.type === 'error'
              ? 'bg-[#ff3366]/10 border-[#ff3366]/30 text-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.15)]'
              : status.type === 'success'
              ? 'bg-[#00ff66]/10 border-[#00ff66]/30 text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.15)]'
              : 'bg-[#00f0ff]/10 border-[#00f0ff]/30 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.15)]'
          }`}>
            {/* Left neon bar animation */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 animate-pulse ${
              status.type === 'error' ? 'bg-[#ff3366]' : status.type === 'success' ? 'bg-[#00ff66]' : 'bg-[#00f0ff]'
            }`} />
            
            <div className="flex-shrink-0 opacity-80">
              {status.type === 'error' ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
            </div>

            <div className="flex-1">
              <span className="font-bold uppercase block text-[9px] opacity-60 mb-0.5 tracking-[1px]">Terminal Output</span>
              {status.text}
            </div>
          </div>
        )}

        <p className="text-[#64748b] text-xs text-center mt-2">
          Remember your password? <span onClick={onSwitch} className="text-[#00f0ff] cursor-pointer font-bold hover:underline">Back to login</span>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
