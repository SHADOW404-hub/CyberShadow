import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const RegisterForm: React.FC<{ onSwitch: () => void }> = ({ onSwitch }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [isBusy, setIsBusy] = useState(false);
  const { signUp } = useAuth();
  const { notify } = useNotification();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { username, email, password, confirm } = formData;

    if (!username || !email || !password) {
      notify('VALIDATION_ERROR: Missing required fields', 'error');
      return;
    }

    if (password !== confirm) {
      notify('SECURITY_MISMATCH: Passwords do not match', 'error');
      return;
    }

    setIsBusy(true);
    const { error } = await signUp(email, password, username);

    if (error) {
      notify(error, 'error');
      setIsBusy(false);
    } else {
      notify('REGISTRY_SUCCESS: Identity established', 'success');
      setTimeout(() => {
        setIsBusy(false);
        onSwitch();
      }, 1500);
    }
  };

  return (
    <div className="bg-[#0d101b]/90 py-7 px-10 rounded-2xl border border-[#9d4edd]/20 w-full backdrop-blur-md">
      <div className="flex justify-center mb-5">
        <i className="ph-bold ph-shield-checkered text-[64px] text-[#9d4edd] drop-shadow-[0_0_15px_rgba(157,78,221,0.6)]"></i>
      </div>
      <h2 className="text-white tracking-[4px] mb-5 text-center text-xl font-bold font-mono">CREATE_IDENTITY</h2>
      <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">AGENT_NAME</label>
          <input 
            type="text" 
            value={formData.username} 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors"
            placeholder="Username"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">COMM_LINK</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors"
            placeholder="Email address"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">ENCRYPT_KEY</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors"
            placeholder="••••••"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[#64748b] text-[11px] font-mono">VERIFY_KEY</label>
          <input 
            type="password" 
            value={formData.confirm} 
            onChange={(e) => setFormData({...formData, confirm: e.target.value})} 
            className="bg-black border border-[#333] p-2.5 text-[#9d4edd] rounded-lg focus:outline-none focus:border-[#9d4edd] transition-colors"
            placeholder="••••••"
          />
        </div>
        <button type="submit" disabled={isBusy} className="bg-gradient-to-r from-[#9d4edd] to-[#ff007f] text-white py-3.5 px-4 font-bold rounded-lg cursor-pointer transition-all duration-300 hover:opacity-90 disabled:opacity-50 mt-2.5 font-mono">
          {isBusy ? 'ESTABLISHING...' : 'REGISTER_AGENT'}
        </button>
        <p className="text-[#64748b] text-xs text-center mt-3.5">
          Already established? <span onClick={onSwitch} className="text-[#00f0ff] cursor-pointer font-bold hover:underline">Login here</span>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;
