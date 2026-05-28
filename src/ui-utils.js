/* UI yordamchi funksiyalari */

export function showSuccessOverlay(title, subtitle, isLogin = false) {
    const overlay = document.createElement('div');
    Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0',
        width: '100vw', height: '100vh',
        backgroundColor: 'rgba(8,9,12,0.95)',
        zIndex: '1000', display: 'flex',
        flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', opacity: '0',
        transition: 'opacity 0.6s ease'
    });

    const ring = document.createElement('div');
    Object.assign(ring.style, {
        width: '120px', height: '120px',
        borderRadius: '50%', border: '4px solid #00f0ff',
        boxShadow: '0 0 30px #00f0ff, inset 0 0 30px #00f0ff',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '48px',
        color: '#00f0ff', marginBottom: '24px'
    });
    ring.innerHTML = '<i class="ph-bold ph-keyhole"></i>';
    ring.animate(
        [{ transform: 'scale(0.9)', opacity: 0.8 }, { transform: 'scale(1.1)', opacity: 1 }, { transform: 'scale(0.9)', opacity: 0.8 }],
        { duration: 1500, iterations: Infinity }
    );

    const h2 = document.createElement('h2');
    Object.assign(h2.style, {
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '24px', letterSpacing: '6px',
        color: '#ffffff', marginBottom: '8px'
    });
    h2.textContent = title;

    const p = document.createElement('p');
    Object.assign(p.style, {
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '12px', color: '#00f0ff', letterSpacing: '2px'
    });
    p.textContent = subtitle;

    overlay.append(ring, h2, p);
    document.body.appendChild(overlay);
    setTimeout(() => (overlay.style.opacity = '1'), 50);
    
    if (!isLogin) {
        setTimeout(() => location.reload(), 2800);
    }
}