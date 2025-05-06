import { Zap } from "lucide-react";

export default function CtaButton() {
  return (
      <a href="/register">
        <button className="relative inline-flex h-12 active:scale-95 transition-transform overflow-hidden rounded-full p-[1px] focus:outline-none group border border-white/30">
          {/* Borda animada */}
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] opacity-80 brightness-125 saturate-150 bg-[conic-gradient(from_90deg_at_50%_50%,#e0f2ff_0%,#60a5fa_40%,#3b82f6_70%,#e0f2ff_100%)] z-0" />
          <span className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
            <span className="absolute top-0 left-0 w-full h-1/2 bg-white/80 blur-[12px] rounded-t-full" />
          </span>
          <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 px-10 text-base font-semibold text-white backdrop-blur-3xl gap-2 transition-opacity duration-300 group-hover:opacity-90 relative z-20">
            Começar Agora
            <Zap size={18} />
          </span>
        </button>
      </a>
  );
}
