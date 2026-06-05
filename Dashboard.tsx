import React from 'react';
import { useAuth } from './AuthContext';

const Dashboard: React.FC = () => {
  const { profile, signOut } = useAuth();

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.branding}>
          <span style={styles.status}>ONLINE</span>
          <h1 style={styles.title}>AGENT_{profile?.username?.toUpperCase()}</h1>
        </div>
        <button onClick={() => signOut()} style={styles.logoutBtn}>DISCONNECT</button>
      </header>

      <div style={styles.grid}>
        <div style={styles.statCard}>
          <label style={styles.label}>CLEARANCE_LEVEL</label>
          <div style={styles.value}>{profile?.role === 'admin' ? 'ELITE_OVERSEER' : 'RECRUIT'}</div>
        </div>
        <div style={styles.statCard}>
          <label style={styles.label}>NODE_ORIGIN</label>
          <div style={styles.value}>{profile?.country || 'UNKNOWN_SECTOR'}</div>
        </div>
      </div>

      <div style={styles.console}>
        <div style={styles.consoleHeader}>SYSTEM_LOGS</div>
        <div style={styles.logLine}>{'>'} Initializing secure environment... OK</div>
        <div style={styles.logLine}>{'>'} Loading encrypted data... OK</div>
        <div style={styles.logLine}>{'>'} Welcome to CyberShadow, Agent.</div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { width: '100%', maxWidth: '900px', padding: '20px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', borderBottom: '1px solid rgba(0, 240, 255, 0.2)', paddingBottom: '20px' },
  branding: { display: 'flex', flexDirection: 'column' },
  status: { color: '#00ff66', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px' },
  title: { color: '#fff', margin: 0, fontSize: '24px', letterSpacing: '4px' },
  logoutBtn: { background: 'transparent', border: '1px solid #ff3366', color: '#ff3366', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'monospace' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' },
  statCard: { background: 'rgba(15, 18, 29, 0.8)', padding: '20px', borderRadius: '8px', borderLeft: '4px solid #00f0ff' },
  label: { color: '#64748b', fontSize: '10px', display: 'block', marginBottom: '5px' },
  value: { color: '#00f0ff', fontSize: '18px', fontWeight: 'bold' },
  console: { background: '#000', padding: '20px', borderRadius: '8px', border: '1px solid #333', fontFamily: 'monospace' },
  consoleHeader: { color: '#9d4edd', marginBottom: '10px', fontSize: '12px', borderBottom: '1px solid #222', paddingBottom: '5px' },
  logLine: { color: '#888', fontSize: '14px', marginBottom: '4px' }
};

export default Dashboard;