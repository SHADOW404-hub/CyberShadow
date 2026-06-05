import React from 'react';

/**
 * CyberBackground - Saytning global foni. 
 * Barcha vizual effektlar (Grid, Orblar, Noise) shu yerda jamlangan.
 */
const CyberBackground: React.FC = () => {
  return (
    <div style={styles.container}>
      {/* 3D Perspektivali Grid */}
      <div style={styles.gridOverlay} />
      
      {/* Dinamik Neon Orblar */}
      <div style={{ ...styles.orb, ...styles.orb1 }} />
      <div style={{ ...styles.orb, ...styles.orb2 }} />
      <div style={{ ...styles.orb, ...styles.orb3 }} />
      
      {/* Vizual shovqin (Cinematic Noise) */}
      <div style={styles.noise} />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
    backgroundColor: '#010204',
    backgroundImage: 'radial-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px)',
    backgroundSize: '30px 30px',
    overflow: 'hidden',
  },
  gridOverlay: {
    position: 'absolute',
    top: '-50%',
    left: 0,
    width: '100%',
    height: '200%',
    backgroundImage: `
      radial-gradient(rgba(0, 240, 255, 0.08) 1px, transparent 1px),
      linear-gradient(rgba(0, 240, 255, 0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 240, 255, 0.02) 1px, transparent 1px)
    `,
    backgroundSize: '30px 30px, 60px 60px, 60px 60px',
    transform: 'rotateX(50deg)',
    pointerEvents: 'none',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(120px)',
    opacity: 0.4,
    mixBlendMode: 'screen',
    pointerEvents: 'none',
  },
  orb1: {
    width: '60vw',
    height: '60vw',
    background: 'radial-gradient(circle, #00f0ff 0%, transparent 70%)',
    top: '-10%',
    left: '-10%',
  },
  orb2: {
    width: '70vw',
    height: '70vw',
    background: 'radial-gradient(circle, #9d4edd 0%, transparent 70%)',
    bottom: '-15%',
    right: '-10%',
  },
  orb3: {
    width: '300px',
    height: '350px',
    background: 'radial-gradient(circle, #ff007f 0%, transparent 70%)',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0.15,
  },
  noise: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.03,
    mixBlendMode: 'overlay',
    pointerEvents: 'none',
  }
};

export default CyberBackground;
