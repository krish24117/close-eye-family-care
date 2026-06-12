import { useEffect, useState } from "react";
import appIcon from "@/assets/app-icon.png.asset.json";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), 700);
    const hideTimer = setTimeout(() => setVisible(false), 1300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#1a3a2a] transition-opacity duration-500 ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{ backgroundImage: "radial-gradient(circle at 50% 40%, #245040 0%, #1a3a2a 60%, #0f2519 100%)" }}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-3xl bg-[#a3e635]/20 blur-2xl animate-pulse" />
        <img
          src={appIcon.url}
          alt=""
          width={96}
          height={96}
          className="relative h-24 w-24 rounded-3xl shadow-2xl animate-[splash-in_700ms_ease-out]"
        />
      </div>
      <p className="mt-6 font-serif text-2xl tracking-tight text-[#f5f3ee] animate-[splash-fade_900ms_ease-out]">
        Close Eye
      </p>
      <p className="mt-2 text-xs uppercase tracking-[0.3em] text-[#f5f3ee]/60 animate-[splash-fade_1200ms_ease-out]">
        When you can't be there
      </p>
      <style>{`
        @keyframes splash-in {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes splash-fade {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
