import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

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
      // Muvaffaqiyatli ro'yxatdan o'tgach, login sahifasiga o'tkazish yoki avtomatik kirish
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.iconWrapper}>
        <i className="ph-bold ph-shield-checkered" style={styles.icon}></i>
      </div>
      <h2 style={styles.title}>CREATE_IDENTITY</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>AGENT_NAME</label>
          <input 
            type="text" 
            value={formData.username} 
            onChange={(e) => setFormData({...formData, username: e.target.value})} 
            style={styles.input}
            placeholder="Username"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>COMM_LINK</label>
          <input 
            type="email" 
            value={formData.email} 
            onChange={(e) => setFormData({...formData, email: e.target.value})} 
            style={styles.input}
            placeholder="Email address"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>ENCRYPT_KEY</label>
          <input 
            type="password" 
            value={formData.password} 
            onChange={(e) => setFormData({...formData, password: e.target.value})} 
            style={styles.input}
            placeholder="••••••"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>VERIFY_KEY</label>
          <input 
            type="password" 
            value={formData.confirm} 
            onChange={(e) => setFormData({...formData, confirm: e.target.value})} 
            style={styles.input}
            placeholder="••••••"
          />
        </div>
        <button type="submit" disabled={isBusy} style={styles.button}>
          {isBusy ? 'ESTABLISHING...' : 'REGISTER_AGENT'}
        </button>
        <p style={styles.footerText}>
          Already established? <span onClick={onSwitch} style={styles.link}>Login here</span>
        </p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'rgba(13, 16, 27, 0.9)',
    padding: '30px 40px',
    borderRadius: '16px',
    border: '1px solid rgba(157, 78, 221, 0.2)',
    width: '100%',
    backdropFilter: 'blur(10px)'
  },
  title: { color: '#fff', letterSpacing: '4px', marginBottom: '20px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#64748b', fontSize: '11px', fontFamily: 'monospace' },
  input: { background: '#000', border: '1px solid #333', padding: '10px', color: '#9d4edd', borderRadius: '8px' },
  button: { background: 'linear-gradient(90deg, #9d4edd, #ff007f)', color: '#fff', padding: '14px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '10px' },
  iconWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  icon: { fontSize: '64px', color: '#9d4edd', filter: 'drop-shadow(0 0 15px rgba(157, 78, 221, 0.6))' },
  footerText: { color: '#64748b', fontSize: '12px', textAlign: 'center', marginTop: '15px' },
  link: { color: '#00f0ff', cursor: 'pointer', fontWeight: 'bold' }
};

export default RegisterForm;