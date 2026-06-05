import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const ForgotPassword: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [email, setEmail] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const { sendResetEmail } = useAuth();
  const { notify } = useNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      notify('Please enter your email address', 'error');
      return;
    }

    setIsBusy(true);
    const { error } = await sendResetEmail(email);

    if (error) {
      notify(error, 'error');
      setIsBusy(false);
    } else {
      notify('Reset link sent! Please check your email', 'success');
      setTimeout(() => {
        setIsBusy(false);
        onSwitch();
      }, 2000);
    }
  };

  return (
    <div className="bg-[#0d101b]/95 p-10 rounded-2xl border border-[#00f0ff]/20 w-full backdrop-blur-md">
      <div className="flex justify-center mb-5">
        <img src="/favicon.svg" alt="CyberShadow Logo" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(0,240,255,0.6)]" />
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
        
        <p className="text-[#64748b] text-xs text-center mt-2">
          Remember your password? <span onClick={onSwitch} className="text-[#00f0ff] cursor-pointer font-bold hover:underline">Back to login</span>
        </p>
      </form>
    </div>
  );
};

export default ForgotPassword;
