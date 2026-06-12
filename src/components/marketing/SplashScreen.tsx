import { useEffect, useState } from "react";
import { SparkleMark } from "@/components/brand/Logo";

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
      <div className="inline-flex items-center gap-3 animate-[splash-in_700ms_ease-out] text-[#f5f3ee]">
        <SparkleMark className="h-12 w-12" />
        <span className="font-serif text-5xl tracking-tight">close eye</span>
      </div>
      <p className="mt-4 text-[11px] uppercase tracking-[0.3em] text-[#f5f3ee]/70 animate-[splash-fade_1200ms_ease-out]">
        Your trusted presence in India
      </p>
      <style>{`
        @keyframes splash-in {
          0% { transform: scale(0.9); opacity: 0; }
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
