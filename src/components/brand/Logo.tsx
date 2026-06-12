import { Link } from "@tanstack/react-router";

type Props = {
  tone?: "light" | "dark";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
};

export function SparkleMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {/* Big 4-point sparkle */}
      <path
        d="M28 6 C28 16 30 22 40 24 C30 26 28 32 28 42 C28 32 26 26 16 24 C26 22 28 16 28 6 Z"
        fill="currentColor"
      />
      {/* Small plus sparkle, top-right */}
      <path
        d="M48 12 V20 M44 16 H52"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Tiny dot, bottom-left */}
      <circle cx="16" cy="40" r="2" fill="currentColor" />
    </svg>
  );
}

export function Logo({ tone = "dark", showTagline = false, size = "md" }: Props) {
  const textColor = tone === "light" ? "text-brand-foreground" : "text-primary";
  const taglineColor = tone === "light" ? "text-brand-accent" : "text-brand";
  const sizes = {
    sm: { mark: "h-5 w-5", text: "text-lg" },
    md: { mark: "h-7 w-7", text: "text-2xl" },
    lg: { mark: "h-12 w-12", text: "text-5xl" },
  }[size];

  return (
    <Link to="/" className="inline-flex items-center gap-2.5 group">
      <SparkleMark className={`${sizes.mark} ${textColor} transition-transform group-hover:rotate-12`} />
      <div className="flex flex-col leading-none">
        <span className={`font-serif ${sizes.text} tracking-tight ${textColor}`}>close eye</span>
        {showTagline && (
          <span className={`text-[10px] tracking-[0.2em] uppercase mt-1 ${taglineColor}`}>
            Your trusted presence in India
          </span>
        )}
      </div>
    </Link>
  );
}
