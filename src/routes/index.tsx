import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/stadium-hero.jpg";
import { Trophy, Flame, Gift, Users, Clock, Share2 } from "lucide-react";
import { DAILY_LEADERS } from "@/lib/game-data";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="relative rounded-3xl overflow-hidden shadow-card border border-border">
        <img
          src={heroImg}
          alt="World Cup stadium with golden trophy"
          width={1536}
          height={1024}
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/60 to-background" />
        <div className="relative p-6 pt-8 pb-7 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[11px] uppercase tracking-widest font-semibold">
            <Flame className="w-3 h-3" /> Live Campaign
          </span>
          <h1 className="font-display text-4xl mt-3 leading-[1.05]">
            FOOTBALL <span className="text-gradient-gold">TRIVIA</span><br />
            CHALLENGE
          </h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
            Answer daily World Cup questions. Climb the ranks. Win ₦3,000 shopping vouchers — free delivery included.
          </p>
          <Link
            to="/play"
            className="mt-5 inline-flex items-center gap-2 bg-gradient-gold text-gold-foreground font-bold px-7 py-3.5 rounded-full shadow-glow animate-pulse-glow hover:scale-[1.03] active:scale-95 transition-transform"
          >
            ⚽ Play Now
          </Link>
          <p className="text-[11px] text-muted-foreground mt-3">10 winners daily · 100 total winners · ₦450,000 prize pool</p>
        </div>
      </section>

      {/* Stat strip */}
      <div className="grid grid-cols-3 gap-2">
        <Stat icon={<Gift className="w-4 h-4" />} label="Voucher" value="₦3,000" />
        <Stat icon={<Trophy className="w-4 h-4" />} label="Top Prize" value="₦50,000" />
        <Stat icon={<Users className="w-4 h-4" />} label="Players" value="12,4K" />
      </div>

      {/* How it works */}
      <section className="bg-card rounded-2xl p-5 border border-border shadow-card">
        <h2 className="font-display text-xl mb-4">HOW IT <span className="text-gradient-gold">WORKS</span></h2>
        <ol className="space-y-3">
          {[
            { t: "Sign in", d: "Quick login with email or phone." },
            { t: "Answer daily questions", d: "10 trivia questions, 15s each." },
            { t: "Earn time bonuses", d: "Faster answers = more points." },
            { t: "Win vouchers", d: "Top 10 daily players win ₦3K + free delivery." },
          ].map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="w-7 h-7 rounded-full bg-gradient-gold text-gold-foreground grid place-items-center font-bold text-sm shrink-0">{i + 1}</span>
              <div>
                <div className="font-semibold text-sm">{s.t}</div>
                <div className="text-xs text-muted-foreground">{s.d}</div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Leaderboard preview */}
      <section className="bg-card rounded-2xl p-5 border border-border shadow-card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display text-xl">TODAY'S <span className="text-gradient-gold">TOP 5</span></h2>
          <Link to="/leaderboard" className="text-xs text-gold hover:underline">View all →</Link>
        </div>
        <ul className="space-y-2">
          {DAILY_LEADERS.slice(0, 5).map((row) => (
            <li key={row.rank} className="flex items-center justify-between bg-muted/40 rounded-xl px-3 py-2">
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${
                  row.rank === 1 ? "bg-gradient-gold text-gold-foreground" :
                  row.rank === 2 ? "bg-foreground/80 text-background" :
                  row.rank === 3 ? "bg-amber-700/70 text-white" :
                  "bg-muted text-muted-foreground"
                }`}>{row.rank}</span>
                <span className="text-sm font-medium">{row.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-orange-300"><Flame className="w-3 h-3" />{row.streak}</span>
                <span className="font-bold text-gold">{row.score}</span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Share */}
      <section className="rounded-2xl p-5 border border-gold/40 bg-gradient-to-br from-gold/10 to-transparent flex items-center gap-4">
        <Share2 className="w-8 h-8 text-gold shrink-0" />
        <div>
          <div className="font-semibold text-sm">Refer & earn bonus points</div>
          <div className="text-xs text-muted-foreground">Share your score, climb faster.</div>
        </div>
      </section>

      <p className="text-center text-[10px] text-muted-foreground flex items-center justify-center gap-1">
        <Clock className="w-3 h-3" /> New questions every 24 hours
      </p>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-3 text-center shadow-card">
      <div className="text-gold flex justify-center mb-1">{icon}</div>
      <div className="font-display text-base">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
    </div>
  );
}
