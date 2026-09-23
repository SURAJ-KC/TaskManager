import { ShieldCheck, CheckCircle2, Zap, Users, Lock } from "lucide-react";

const RightRegi = () => {
  return (
    <div className="w-full md:w-5/12 h-auto md:h-full backdrop-blur-md rounded-3xl md:rounded-r-4xl md:rounded-l-none flex flex-col justify-between p-6 sm:p-8 bg-linear-to-br from-indigo-900/30 via-slate-900/40 to-slate-950/60 border-t md:border-t-0 border-white/10">
      
      {/* Top Section / Header */}
      <div className="flex flex-col gap-4">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <h2 className="text-white font-bold text-xl sm:text-2xl leading-snug">
          Join Task Manager Today
        </h2>

        <p className="text-xs text-slate-400">
          Get started with our all-in-one task organization and workspace contacts platform.
        </p>

        {/* Bullet Points */}
        <ul className="flex flex-col gap-3 mt-2 text-xs sm:text-sm text-slate-300">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Instant access to task boards & workflow tools</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Fast real-time contact sync & management</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>Protected by Google OAuth 2.0 & JWT Security</span>
          </li>
          <li className="flex items-start gap-2.5">
            <Users className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>Collaborate seamlessly with team members</span>
          </li>
        </ul>
      </div>

      {/* Footer Terms Note */}
      <div className="pt-6 border-t border-white/10 mt-6 md:mt-0">
        <p className="text-[11px] text-slate-400 font-mono">
          By registering, you agree to our Terms of Service & Privacy Policy.
        </p>
      </div>

    </div>
  );
};

export default RightRegi;