import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, type Profile } from "@/lib/game-data";
import { Flame, Trophy, Gift, LogOut, Award, Share2, Settings } from "lucide-react";


export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const nav = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [vouchers, setVouchers] = useState(0);

  useEffect(() => {
    setProfile(storage.getProfile());
    setScore(storage.getTotalScore());
    setStreak(storage.getStreak());
    setVouchers(storage.getVouchers().length);
  }, []);

  if (!profile) {
    return (
      <div className="bg-card border border-border rounded-3xl p-6 text-center mt-6">
        <h2 className="font-display text-2xl">No profile yet</h2>
        <p className="text-sm text-muted-foreground mt-1">Sign in to start tracking your score.</p>
        <Link to="/play" className="inline-block mt-4 bg-gradient-gold text-gold-foreground font-bold px-6 py-3 rounded-full">
          Sign in & Play
        </Link>
      </div>
    );
  }

  const badges = [
    { ok: score > 0, label: "First Match", icon: "⚽" },
    { ok: streak >= 3, label: "On Fire", icon: "🔥" },
    { ok: vouchers >= 1, label: "Voucher Winner", icon: "🎟️" },
    { ok: score >= 5000, label: "Top Striker", icon: "🥇" },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-card border border-border rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-gold/20 to-transparent" />
        <div className="relative w-20 h-20 mx-auto rounded-full bg-gradient-gold grid place-items-center font-display text-3xl text-gold-foreground shadow-glow">
          {profile.name.slice(0, 1).toUpperCase()}
        </div>
        <h2 className="font-display text-2xl mt-3">{profile.name}</h2>
        <p className="text-xs text-muted-foreground">{profile.email}</p>

        <div className="grid grid-cols-3 gap-2 mt-5">
          <Stat icon={<Trophy className="w-4 h-4" />} label="Score" value={score.toLocaleString()} />
          <Stat icon={<Flame className="w-4 h-4" />} label="Streak" value={`${streak}d`} />
          <Stat icon={<Gift className="w-4 h-4" />} label="Vouchers" value={String(vouchers)} />
        </div>
      </div>

      <section className="bg-card border border-border rounded-2xl p-5">
        <h3 className="font-display text-lg mb-3 flex items-center gap-2"><Award className="w-4 h-4 text-gold" /> BADGES</h3>
        <div className="grid grid-cols-4 gap-2">
          {badges.map((b) => (
            <div key={b.label} className={`rounded-xl p-3 text-center border ${b.ok ? "border-gold/50 bg-gold/10" : "border-border bg-muted/30 opacity-50"}`}>
              <div className="text-2xl">{b.icon}</div>
              <div className="text-[10px] mt-1 leading-tight">{b.label}</div>
            </div>
          ))}
        </div>
      </section>

      <button className="w-full bg-card border border-border rounded-2xl p-4 flex items-center gap-3 active:scale-[0.99]">
        <Share2 className="w-5 h-5 text-gold" />
        <div className="text-left flex-1">
          <div className="font-semibold text-sm">Share & earn bonus points</div>
          <div className="text-xs text-muted-foreground">+50 pts per friend who joins</div>
        </div>
      </button>

      <button
        onClick={() => { storage.clearProfile(); nav({ to: "/" }); }}
        className="w-full text-destructive flex items-center justify-center gap-2 py-3 rounded-2xl border border-destructive/30 bg-destructive/5 text-sm font-semibold"
      >
        <LogOut className="w-4 h-4" /> Sign out
      </button>

      <Link
        to="/admin"
        className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-muted-foreground text-sm font-semibold hover:bg-muted transition"
      >
        <Settings className="w-4 h-4" /> Admin Dashboard
      </Link>
    </div>

  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-muted/40 rounded-xl py-3">
      <div className="text-gold flex justify-center">{icon}</div>
      <div className="font-display text-lg mt-0.5">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
