import React, { useEffect, useRef } from 'react';

const StatsContent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    // Yer shari nuqtalari generatori (Oddiy kontinent mantiqi)
    // Haqiqiy xaritaga o'xshatish uchun matematik shovqin ishlatamiz
    const points: { x: number; y: number; z: number }[] = [];
    const dotCount = 2500; // Nuqtalar zichligini oshiramiz

    for (let i = 0; i < dotCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / dotCount);
      const theta = Math.sqrt(dotCount * Math.PI) * phi;

      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);

      // Murakkabroq kontinent simulyatsiyasi (Procedural Landmass)
      const lon = Math.atan2(y, x);
      const lat = Math.asin(z);
      
      const land = Math.sin(lon * 2.2) * Math.cos(lat * 1.5) + 
                   Math.sin(lon * 4.5 + 1.2) * Math.cos(lat * 2.8) * 0.5 +
                   Math.sin(lon * 8) * Math.sin(lat * 6) * 0.2;

      if (land > 0.05) { // Threshold: Faqat quruqlik nuqtalarini qo'shamiz
        points.push({ x, y, z });
      }
    }

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth < 192 ? parent.clientWidth : 192;
        canvas.height = canvas.width;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rotation += 0.004; // Aylanish tezligi

      const radius = canvas.width * 0.38;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      points.forEach((p) => {
        // Y o'qi atrofida aylantirish
        const rotX = p.x * Math.cos(rotation) - p.z * Math.sin(rotation);
        const rotZ = p.x * Math.sin(rotation) + p.z * Math.cos(rotation);

        // Faqat old tomondagi nuqtalarni chizish yoki orqadagilarni xira qilish
        if (rotZ > -0.5) {
          const perspective = 1.5 / (1.5 - rotZ);
          const screenX = centerX + rotX * radius * perspective;
          const screenY = centerY + p.y * radius * perspective;
          
          const opacity = Math.max(0.1, (rotZ + 0.8) / 1.8);
          const size = Math.max(0.4, perspective * 0.8);

          ctx.beginPath();
          ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.fill();
          
          // Neon effekt uchun "glow"
          if (rotZ > 0.5) {
            ctx.shadowBlur = 5;
            ctx.shadowColor = '#00f0ff';
          } else {
            ctx.shadowBlur = 0;
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      {/* O'ng tepa burchakdagi Kvadrat Box */}
      <div className="absolute top-0 right-0 w-48 h-48 border border-[#00f0ff]/20 bg-[#0d101b]/40 backdrop-blur-xl rounded-sm overflow-hidden group shadow-[0_0_20px_rgba(0,240,255,0.05)]">
        {/* Box dekoratsiyasi */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f0ff]/40" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f0ff]/40" />
        
        {/* Sarlavha paneli */}
        <div className="absolute top-0 left-0 w-full px-2 py-1 flex justify-between items-center border-b border-[#00f0ff]/10 bg-[#00f0ff]/5">
          <span className="text-[8px] text-[#00f0ff] font-bold tracking-[2px] uppercase opacity-60">Global_Net_Scan</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-[#00f0ff] rounded-full animate-pulse" />
            <div className="w-1 h-1 bg-[#00f0ff]/30 rounded-full" />
          </div>
        </div>

        {/* Yer shari Canvas */}
        <canvas 
          ref={canvasRef} 
          width={192} 
          height={192} 
          className="w-full h-full mt-2 cursor-pointer"
        />

        {/* Footer info */}
        <div className="absolute bottom-1 left-0 w-full px-2">
          <div className="text-[7px] text-[#00f0ff]/40 font-mono tracking-tighter">LAT: 41.2995 | LONG: 69.2401</div>
        </div>
      </div>

      {/* Asosiy kontent bo'sh joyi (bu yerga keyinchalik statistikalar qo'shiladi) */}
      <div className="flex items-center justify-center h-full">
         <div className="text-white/5 text-[100px] font-black tracking-tighter select-none pointer-events-none uppercase">
            Statistics
         </div>
      </div>
    </div>
  );
};

export default StatsContent;