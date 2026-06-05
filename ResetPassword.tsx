import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

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
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>IDENTITY_RECOVERY</h2>
        <div style={styles.time}>{systemTime}</div>
      </div>

      <form onSubmit={handleReset} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>NEW_ENCRYPT_KEY</label>
          <div style={styles.inputWrapper}>
            <input 
              type={showPass ? "text" : "password"} 
              value={pass} 
              onChange={(e) => setPass(e.target.value)} 
              style={styles.input}
              placeholder="••••••"
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)} 
              style={styles.toggleBtn}
            >
              {showPass ? 'HIDE' : 'SHOW'}
            </button>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>CONFIRM_KEY</label>
          <input 
            type="password" 
            value={confirm} 
            onChange={(e) => setConfirm(e.target.value)} 
            style={styles.input}
            placeholder="••••••"
          />
        </div>

        <button type="submit" disabled={isBusy} style={styles.button}>
          {isBusy ? 'UPDATING_NODE...' : 'SECURE_ACCOUNT'}
        </button>
      </form>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  card: { background: 'rgba(13, 16, 27, 0.95)', padding: '40px', borderRadius: '16px', border: '1px solid #00f0ff33', width: '100%', backdropFilter: 'blur(10px)' },
  header: { textAlign: 'center', marginBottom: '30px' },
  title: { color: '#fff', letterSpacing: '4px', margin: '0 0 10px 0' },
  time: { color: '#00f0ff', fontSize: '10px', fontFamily: 'monospace', opacity: 0.7 },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { color: '#64748b', fontSize: '11px', fontFamily: 'monospace' },
  inputWrapper: { position: 'relative', display: 'flex' },
  input: { flex: 1, background: '#000', border: '1px solid #333', padding: '12px', color: '#00f0ff', borderRadius: '8px', fontFamily: 'monospace' },
  toggleBtn: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', fontSize: '10px', cursor: 'pointer' },
  button: { 
    background: 'linear-gradient(90deg, #00f0ff, #9d4edd)', color: '#000', padding: '14px', 
    fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', letterSpacing: '2px'
  }
};
export default ResetPassword;