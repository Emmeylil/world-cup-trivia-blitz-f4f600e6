import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Trophy, Gift, User, Play } from "lucide-react";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/play", label: "Play", icon: Play },
  { to: "/leaderboard", label: "Ranks", icon: Trophy },
  { to: "/rewards", label: "Rewards", icon: Gift },
  { to: "/profile", label: "Profile", icon: User },
] as const;

export function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/70 border-b border-border/60">
        <div className="max-w-xl mx-auto flex items-center justify-between px-4 h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-gradient-gold grid place-items-center text-gold-foreground font-display text-lg shadow-glow">⚽</span>
            <span className="font-display text-lg tracking-wide">
              FOOTBALL <span className="text-gradient-gold">TRIVIA</span>
            </span>
          </Link>
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">World Cup</span>
        </div>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 pb-28 pt-4">
        <Outlet />
      </main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-card/90 backdrop-blur-xl border border-border rounded-full shadow-card px-2 py-1.5 flex gap-1">
        {NAV.map((n) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          const Icon = n.icon;
          return (
            <Link
              key={n.to}
              to={n.to}
              className={`flex flex-col items-center justify-center w-14 h-12 rounded-full transition-all ${
                active ? "bg-gradient-gold text-gold-foreground shadow-glow" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px] mt-0.5 font-medium">{n.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
