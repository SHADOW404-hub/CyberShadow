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
    <div style={styles.card}>
      <div style={styles.iconWrapper}>
        <i className="ph-bold ph-shield-checkered" style={styles.icon}></i>
      </div>
      <h2 style={styles.title}>SECURE_LOGIN</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>AGENT_IDENTIFIER</label>
          <input 
            type="text" 
            value={id} 
            onChange={(e) => setId(e.target.value)} 
            style={styles.input}
            placeholder="Username or Email"
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>ENCRYPTED_KEY</label>
          <input 
            type="password" 
            value={pass} 
            onChange={(e) => setPass(e.target.value)} 
            style={styles.input}
            placeholder="••••••"
          />
        </div>
        <button type="submit" disabled={isBusy} style={styles.button}>
          {isBusy ? 'VERIFYING...' : 'INITIATE_AUTH'}
        </button>
        <p style={styles.footerText}>
          New identity? <span onClick={onSwitch} style={styles.link}>Register agent</span>
        </p>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'rgba(13, 16, 27, 0.9)',
    padding: '40px',
    borderRadius: '16px',
    border: '1px solid rgba(0, 240, 255, 0.2)',
    width: '100%',
    backdropFilter: 'blur(10px)'
  },
  title: { color: '#fff', letterSpacing: '4px', marginBottom: '20px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#64748b', fontSize: '12px', fontFamily: 'monospace' },
  input: { background: '#000', border: '1px solid #333', padding: '12px', color: '#00f0ff', borderRadius: '8px' },
  button: { background: 'linear-gradient(90deg, #00f0ff, #9d4edd)', color: '#000', padding: '14px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  iconWrapper: { display: 'flex', justifyContent: 'center', marginBottom: '20px' },
  icon: { fontSize: '64px', color: '#00f0ff', filter: 'drop-shadow(0 0 15px rgba(0, 240, 255, 0.6))' },
  footerText: { color: '#64748b', fontSize: '12px', textAlign: 'center', marginTop: '15px' },
  link: { color: '#9d4edd', cursor: 'pointer', fontWeight: 'bold' }
};

export default LoginForm;
