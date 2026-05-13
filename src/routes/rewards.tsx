import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage } from "@/lib/game-data";
import { Gift, Truck, Copy, Trophy } from "lucide-react";

export const Route = createFileRoute("/rewards")({ component: RewardsPage });

function RewardsPage() {
  const [vouchers, setVouchers] = useState<string[]>([]);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { setVouchers(storage.getVouchers()); }, []);

  function copy(code: string) {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-display text-3xl">YOUR <span className="text-gradient-gold">REWARDS</span></h1>
        <p className="text-xs text-muted-foreground">Vouchers, free delivery & tournament prizes</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Tier icon={<Gift className="w-5 h-5" />} title="Daily Voucher" amount="₦3,000" sub="Top 10 daily" />
        <Tier icon={<Trophy className="w-5 h-5" />} title="Grand Prize" amount="₦50,000" sub="Tournament champion" />
      </div>

      <div className="rounded-2xl border border-success/40 bg-success/10 p-4 flex items-center gap-3">
        <Truck className="w-6 h-6 text-success" />
        <div>
          <div className="font-semibold text-sm">Free Delivery on every winning voucher</div>
          <div className="text-xs text-muted-foreground">Auto-applied at checkout — no extra code needed.</div>
        </div>
      </div>

      <section>
        <h2 className="font-display text-xl mb-3">MY <span className="text-gradient-gold">CODES</span></h2>
        {vouchers.length === 0 ? (
          <div className="bg-card border border-dashed border-border rounded-2xl p-6 text-center">
            <p className="text-sm text-muted-foreground">No vouchers yet.</p>
            <Link to="/play" className="inline-block mt-3 bg-gradient-gold text-gold-foreground font-bold px-5 py-2.5 rounded-full text-sm">
              Play to win
            </Link>
          </div>
        ) : (
          <ul className="space-y-2">
            {vouchers.map((code) => (
              <li key={code} className="bg-card border border-gold/40 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-widest text-gold">₦3,000 + Free Delivery</div>
                  <div className="font-display text-lg">{code}</div>
                </div>
                <button
                  onClick={() => copy(code)}
                  className="relative bg-gradient-gold text-gold-foreground rounded-full px-3 py-2 text-xs font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" /> {copied === code ? "Copied" : "Copy"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-[11px] text-muted-foreground text-center">
        Total prize pool: ₦450,000 · 100 winners · 10 daily
      </p>
    </div>
  );
}

function Tier({ icon, title, amount, sub }: { icon: React.ReactNode; title: string; amount: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-4 shadow-card">
      <div className="text-gold">{icon}</div>
      <div className="font-display text-2xl mt-1">{amount}</div>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}
