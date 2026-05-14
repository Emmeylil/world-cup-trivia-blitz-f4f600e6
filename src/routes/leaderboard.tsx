import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { storage, type LeaderRow } from "@/lib/game-data";
import { firebaseService } from "@/lib/firebase-service";
import { Flame, Trophy, Crown, Loader2 } from "lucide-react";

export const Route = createFileRoute("/leaderboard")({ component: LeaderboardPage });

function LeaderboardPage() {
  const [tab, setTab] = useState<"daily" | "overall">("daily");
  const [loading, setLoading] = useState(true);
  const [firebaseLeaders, setFirebaseLeaders] = useState<LeaderRow[]>([]);
  
  const profile = typeof window !== "undefined" ? storage.getProfile() : null;
  const myScore = typeof window !== "undefined" ? storage.getTotalScore() : 0;

  useEffect(() => {
    async function fetchLeaders() {
      setLoading(true);
      const data = await firebaseService.getLeaderboard(20);
      const mappedData: LeaderRow[] = data.map((item, index) => ({
        rank: index + 1,
        name: item.name,
        score: item.score,
        streak: item.streak || 0,
        you: profile?.email === item.email
      }));
      setFirebaseLeaders(mappedData);
      setLoading(false);
    }
    fetchLeaders();
  }, [profile?.email]);

  const data = firebaseLeaders;
  const podium = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h1 className="font-display text-3xl">LEADER<span className="text-gradient-gold">BOARD</span></h1>
        <p className="text-xs text-muted-foreground">The hottest players in the tournament</p>
      </div>

      <div className="bg-card border border-border rounded-full p-1 grid grid-cols-2 text-sm">
        {(["daily", "overall"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`py-2 rounded-full font-semibold transition ${
              tab === t ? "bg-gradient-gold text-gold-foreground shadow-glow" : "text-muted-foreground"
            }`}
          >
            {t === "daily" ? "Today" : "Tournament"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin mb-2" />
          <p className="text-sm">Fetching champions...</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-3xl">
          <Trophy className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No scores yet. Be the first!</p>
        </div>
      ) : (
        <>
          {/* Podium */}
          <div className="grid grid-cols-3 gap-2 items-end">
            <PodiumCard row={podium[1]} place={2} h="h-24" />
            <PodiumCard row={podium[0]} place={1} h="h-32" highlight />
            <PodiumCard row={podium[2]} place={3} h="h-20" />
          </div>

          <ul className="space-y-2">
            {rest.map((row) => (
              <li key={row.rank} className={`flex items-center justify-between border rounded-2xl px-3 py-3 ${row.you ? 'bg-gold/10 border-gold/40' : 'bg-card border-border'}`}>
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full grid place-items-center text-xs font-bold ${row.you ? 'bg-gold text-gold-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {row.rank}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{row.name} {row.you && "(You)"}</div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1"><Flame className="w-3 h-3 text-orange-400" />{row.streak}-day streak</div>
                  </div>
                </div>
                <div className="font-bold text-gold">{row.score.toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </>
      )}

      {profile && (
        <div className="bg-gradient-to-r from-gold/15 to-transparent border border-gold/40 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-gold">Your stats</div>
            <div className="font-display text-lg">{profile.name}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Total Local Score</div>
            <div className="font-bold text-gold text-xl">{myScore.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function PodiumCard({ row, place, h, highlight }: { row?: LeaderRow; place: number; h: string; highlight?: boolean }) {
  if (!row) return <div />;
  const colors: Record<number, string> = {
    1: "bg-gradient-gold text-gold-foreground",
    2: "bg-foreground/80 text-background",
    3: "bg-amber-700 text-white",
  };
  return (
    <div className="flex flex-col items-center">
      {highlight && <Crown className="w-5 h-5 text-gold mb-1" />}
      <div className="text-xs font-semibold truncate max-w-full">{row.name}</div>
      <div className="text-[11px] text-muted-foreground">{row.score.toLocaleString()}</div>
      <div className={`mt-2 ${h} w-full rounded-t-xl border border-border ${colors[place]} grid place-items-center font-display text-2xl`}>
        {place}
      </div>
    </div>
  );
}

