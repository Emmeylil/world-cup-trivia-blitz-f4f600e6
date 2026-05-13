import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { TRIVIA, QUESTION_TIME, POINTS_BASE, POINTS_TIME_BONUS, storage, generateVoucher } from "@/lib/game-data";
import { Confetti } from "@/components/Confetti";
import { Check, X, Clock, Sparkles, Trophy } from "lucide-react";

export const Route = createFileRoute("/play")({ component: PlayPage });

type Phase = "auth" | "intro" | "question" | "feedback" | "result";

function PlayPage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("intro");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");

  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [voucher, setVoucher] = useState<string | null>(null);
  const won = score >= 600; // simulated threshold

  useEffect(() => {
    const profile = storage.getProfile();
    if (!profile) setPhase("auth");
  }, []);

  const q = TRIVIA[qIdx];

  // Timer
  useEffect(() => {
    if (phase !== "question") return;
    setTimeLeft(QUESTION_TIME);
    tickRef.current && clearInterval(tickRef.current);
    tickRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(tickRef.current!);
          handlePick(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { tickRef.current && clearInterval(tickRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, qIdx]);

  function startGame() {
    setQIdx(0); setScore(0); setCorrectCount(0); setPicked(null);
    setPhase("question");
  }

  function handlePick(idx: number) {
    if (picked !== null) return;
    tickRef.current && clearInterval(tickRef.current);
    setPicked(idx);
    if (idx === q.answer) {
      const gained = POINTS_BASE + timeLeft * POINTS_TIME_BONUS;
      setScore((s) => s + gained);
      setCorrectCount((c) => c + 1);
      try { beep(880, 0.08); } catch {}
    } else {
      try { beep(180, 0.15); } catch {}
    }
    setPhase("feedback");
    setTimeout(next, 1200);
  }

  function next() {
    if (qIdx + 1 >= TRIVIA.length) {
      // finalize
      storage.addScore(score);
      const today = new Date().toDateString();
      const lastPlay = storage.getLastPlay();
      storage.setStreak(lastPlay === today ? storage.getStreak() : storage.getStreak() + 1);
      storage.setLastPlay(today);
      if (won) {
        const code = generateVoucher();
        storage.addVoucher(code);
        setVoucher(code);
      }
      setPhase("result");
      return;
    }
    setPicked(null);
    setQIdx((i) => i + 1);
    setPhase("question");
  }

  function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    storage.setProfile({ name: name.trim(), email: contact.trim(), joined: new Date().toISOString() });
    setPhase("intro");
  }

  // ---------- AUTH ----------
  if (phase === "auth") {
    return (
      <div className="max-w-sm mx-auto mt-4 bg-card border border-border rounded-3xl p-6 shadow-card animate-pop-in">
        <h2 className="font-display text-2xl text-center">JOIN THE <span className="text-gradient-gold">CHALLENGE</span></h2>
        <p className="text-center text-xs text-muted-foreground mt-1">Quick sign-in to track your score & vouchers.</p>
        <form onSubmit={submitAuth} className="mt-5 space-y-3">
          <Field label="Display name" value={name} onChange={setName} placeholder="e.g. Tunde A." />
          <Field label="Email or phone" value={contact} onChange={setContact} placeholder="you@example.com" />
          <button className="w-full bg-gradient-gold text-gold-foreground font-bold py-3 rounded-full shadow-glow active:scale-95 transition">
            Continue
          </button>
        </form>
      </div>
    );
  }

  // ---------- INTRO ----------
  if (phase === "intro") {
    return (
      <div className="max-w-sm mx-auto mt-4 bg-card border border-border rounded-3xl p-6 shadow-card text-center animate-pop-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-gold grid place-items-center text-4xl shadow-glow">⚽</div>
        <h2 className="font-display text-2xl mt-4">READY, <span className="text-gradient-gold">CHAMPION?</span></h2>
        <ul className="text-sm text-muted-foreground mt-3 space-y-1">
          <li>{TRIVIA.length} questions · {QUESTION_TIME}s each</li>
          <li>+{POINTS_BASE} per correct · +{POINTS_TIME_BONUS} per second left</li>
          <li>Reach 600+ to win today's voucher</li>
        </ul>
        <button
          onClick={startGame}
          className="mt-5 w-full bg-gradient-gold text-gold-foreground font-bold py-3.5 rounded-full shadow-glow active:scale-95 transition"
        >
          Kick Off
        </button>
      </div>
    );
  }

  // ---------- RESULT ----------
  if (phase === "result") {
    return (
      <div className="max-w-sm mx-auto mt-4 bg-card border border-border rounded-3xl p-6 shadow-card text-center animate-pop-in relative">
        {won && <Confetti />}
        <Trophy className={`w-14 h-14 mx-auto ${won ? "text-gold" : "text-muted-foreground"}`} />
        <h2 className="font-display text-3xl mt-3">
          {won ? <>FULL <span className="text-gradient-gold">TIME WIN!</span></> : "MATCH OVER"}
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="text-[10px] uppercase text-muted-foreground">Score</div>
            <div className="font-display text-2xl text-gold">{score}</div>
          </div>
          <div className="bg-muted/40 rounded-xl p-3">
            <div className="text-[10px] uppercase text-muted-foreground">Correct</div>
            <div className="font-display text-2xl">{correctCount}/{TRIVIA.length}</div>
          </div>
        </div>

        {won && voucher && (
          <div className="mt-5 rounded-2xl border border-gold/50 bg-gradient-to-br from-gold/15 to-transparent p-4">
            <div className="text-[10px] uppercase tracking-widest text-gold">Your voucher</div>
            <div className="font-display text-xl mt-1">{voucher}</div>
            <div className="text-xs text-muted-foreground mt-1">₦3,000 + Free Delivery</div>
          </div>
        )}

        <div className="mt-5 grid grid-cols-2 gap-2">
          <button onClick={() => navigate({ to: "/leaderboard" })} className="bg-card border border-border rounded-full py-3 font-semibold text-sm">
            Leaderboard
          </button>
          <button onClick={() => navigate({ to: "/rewards" })} className="bg-gradient-gold text-gold-foreground rounded-full py-3 font-bold text-sm">
            View Rewards
          </button>
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">Come back tomorrow for new questions!</p>
      </div>
    );
  }

  // ---------- QUESTION / FEEDBACK ----------
  const pct = (timeLeft / QUESTION_TIME) * 100;
  return (
    <div className="space-y-4 animate-pop-in">
      {/* HUD */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Question <b className="text-foreground">{qIdx + 1}</b>/{TRIVIA.length}</span>
        <span className="flex items-center gap-1 text-gold font-bold"><Sparkles className="w-3 h-3" />{score} pts</span>
      </div>

      {/* Timer */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Time left</span>
          <span className="font-bold text-foreground">{timeLeft}s</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-gradient-gold transition-all duration-1000 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Question card */}
      <div className="bg-card border border-border rounded-3xl p-5 shadow-card">
        <div className="text-[10px] uppercase tracking-widest text-gold mb-2">World Cup Trivia</div>
        <h3 className="font-display text-xl leading-snug">{q.question}</h3>

        <div className="mt-4 grid gap-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answer;
            const isPicked = picked === i;
            const reveal = phase === "feedback";
            const cls = !reveal
              ? "bg-muted/40 hover:bg-muted active:scale-[0.98] border-border"
              : isCorrect
                ? "bg-success/20 border-success text-foreground"
                : isPicked
                  ? "bg-destructive/20 border-destructive text-foreground"
                  : "bg-muted/20 border-border opacity-60";
            return (
              <button
                key={i}
                disabled={picked !== null}
                onClick={() => handlePick(i)}
                className={`w-full text-left px-4 py-3.5 rounded-2xl border-2 font-medium text-sm transition flex items-center justify-between ${cls}`}
              >
                <span className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-background/40 grid place-items-center text-xs font-bold">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </span>
                {reveal && isCorrect && <Check className="w-5 h-5 text-success" />}
                {reveal && isPicked && !isCorrect && <X className="w-5 h-5 text-destructive" />}
              </button>
            );
          })}
        </div>

        {phase === "feedback" && q.fact && (
          <p className="mt-4 text-xs text-muted-foreground bg-muted/40 rounded-xl p-3">
            <b className="text-gold">Did you know?</b> {q.fact}
          </p>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1 w-full bg-input/60 border border-border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
  );
}

// Tiny WebAudio beep
let _ctx: AudioContext | null = null;
function beep(freq: number, dur: number) {
  if (typeof window === "undefined") return;
  _ctx ||= new (window.AudioContext || (window as any).webkitAudioContext)();
  const o = _ctx.createOscillator();
  const g = _ctx.createGain();
  o.frequency.value = freq;
  o.type = "sine";
  o.connect(g); g.connect(_ctx.destination);
  g.gain.setValueAtTime(0.15, _ctx.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, _ctx.currentTime + dur);
  o.start(); o.stop(_ctx.currentTime + dur);
}
