import { useEffect, useState } from "react";
import { SparkleMark } from "@/components/brand/Logo";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 1600);
    const hideTimer = setTimeout(() => setVisible(false), 2200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0f2519] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Ambient gradient orbs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 45%, #2a6048 0%, #1a3a2a 45%, #0f2519 80%)",
        }}
      />
      <div className="splash-orb splash-orb-1" />
      <div className="splash-orb splash-orb-2" />

      {/* Subtle grid */}
      <div className="absolute inset-0 splash-grid opacity-[0.07]" />

      {/* Content */}
      <div className="relative flex flex-col items-center text-center px-6">
        <div className="relative">
          {/* Glow ring */}
          <div className="splash-ring" />
          <div className="relative inline-flex items-center justify-center h-20 w-20 rounded-2xl bg-gradient-to-br from-[#3a7d5f] to-[#1f4a36] shadow-[0_20px_60px_-15px_rgba(120,220,160,0.45)] splash-mark">
            <SparkleMark className="h-10 w-10 text-[#e9ffd6]" />
          </div>
        </div>

        <div className="mt-7 overflow-hidden">
          <h1 className="font-serif text-5xl sm:text-6xl tracking-tight text-[#f5f3ee] splash-title">
            close eye
          </h1>
        </div>

        <div className="mt-3 h-px w-16 bg-gradient-to-r from-transparent via-[#b6e89c] to-transparent splash-line" />

        <p className="mt-4 text-[11px] uppercase tracking-[0.35em] text-[#f5f3ee]/65 splash-tag">
          Your trusted presence in India
        </p>

        {/* Loading bar */}
        <div className="mt-10 h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
          <div className="splash-bar h-full w-1/3 rounded-full bg-gradient-to-r from-[#7fd99f] to-[#b6e89c]" />
        </div>
      </div>

      <style>{`
        @keyframes splash-mark-in {
          0% { transform: scale(0.6) rotate(-12deg); opacity: 0; filter: blur(8px); }
          60% { transform: scale(1.05) rotate(2deg); opacity: 1; filter: blur(0); }
          100% { transform: scale(1) rotate(0); opacity: 1; }
        }
        @keyframes splash-title-up {
          0% { transform: translateY(110%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes splash-fade-up {
          0% { transform: translateY(8px); opacity: 0; }
          100% { transform: translateY(0); opacity: 0.65; }
        }
        @keyframes splash-line-grow {
          0% { transform: scaleX(0); opacity: 0; }
          100% { transform: scaleX(1); opacity: 1; }
        }
        @keyframes splash-bar-slide {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(380%); }
        }
        @keyframes splash-ring-pulse {
          0%, 100% { transform: scale(1); opacity: 0.35; }
          50% { transform: scale(1.25); opacity: 0; }
        }
        @keyframes splash-orb-float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
        }
        .splash-mark { animation: splash-mark-in 900ms cubic-bezier(.2,.8,.2,1) both; }
        .splash-title { display: inline-block; animation: splash-title-up 800ms cubic-bezier(.2,.8,.2,1) 250ms both; }
        .splash-line { transform-origin: center; animation: splash-line-grow 600ms ease-out 700ms both; }
        .splash-tag { animation: splash-fade-up 700ms ease-out 850ms both; }
        .splash-bar { animation: splash-bar-slide 1400ms cubic-bezier(.6,.05,.3,1) 400ms infinite; }
        .splash-ring {
          position: absolute; inset: -10px; border-radius: 1.25rem;
          border: 1px solid rgba(182, 232, 156, 0.5);
          animation: splash-ring-pulse 2s ease-out infinite;
        }
        .splash-orb {
          position: absolute; border-radius: 9999px; filter: blur(60px); opacity: 0.35;
          animation: splash-orb-float 6s ease-in-out infinite;
        }
        .splash-orb-1 { width: 320px; height: 320px; background: #4ea87a; top: 15%; left: 10%; }
        .splash-orb-2 { width: 280px; height: 280px; background: #b6e89c; bottom: 10%; right: 8%; animation-delay: 1.5s; }
        .splash-grid {
          background-image:
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: radial-gradient(circle at center, black 30%, transparent 75%);
        }
      `}</style>
    </div>
  );
}
