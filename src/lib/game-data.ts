export type Question = {
  id: number;
  question: string;
  options: string[];
  answer: number; // index
  fact?: string;
};

export const TRIVIA: Question[] = [
  { id: 1, question: "Which country has won the most FIFA World Cups?", options: ["Germany", "Brazil", "Italy", "Argentina"], answer: 1, fact: "Brazil has won 5 World Cups." },
  { id: 2, question: "Who scored the famous 'Hand of God' goal?", options: ["Pelé", "Maradona", "Zidane", "Ronaldo"], answer: 1 },
  { id: 3, question: "Where was the 2022 World Cup hosted?", options: ["Russia", "Qatar", "UAE", "Saudi Arabia"], answer: 1 },
  { id: 4, question: "Who won the Golden Boot at the 2022 World Cup?", options: ["Messi", "Mbappé", "Giroud", "Álvarez"], answer: 1 },
  { id: 5, question: "Which player has the most World Cup goals ever?", options: ["Klose", "Ronaldo (BRA)", "Müller", "Pelé"], answer: 0, fact: "Miroslav Klose with 16 goals." },
  { id: 6, question: "Which African nation reached the 2022 semi-finals?", options: ["Senegal", "Nigeria", "Morocco", "Cameroon"], answer: 2 },
  { id: 7, question: "How long is a standard football match?", options: ["80 min", "90 min", "100 min", "120 min"], answer: 1 },
  { id: 8, question: "Which club has won the most UEFA Champions League titles?", options: ["Barcelona", "Bayern", "Real Madrid", "Liverpool"], answer: 2 },
  { id: 9, question: "Who is known as 'CR7'?", options: ["Cristiano Ronaldo", "Carlos Roberto", "Cafu", "Ronaldinho"], answer: 0 },
  { id: 10, question: "When was the first World Cup held?", options: ["1928", "1930", "1934", "1942"], answer: 1, fact: "The first World Cup was in Uruguay, 1930." },
];

export type LeaderRow = { rank: number; name: string; score: number; streak: number; you?: boolean };

export const DAILY_LEADERS: LeaderRow[] = [
  { rank: 1, name: "Adaeze O.", score: 980, streak: 7 },
  { rank: 2, name: "Tunde A.", score: 940, streak: 5 },
  { rank: 3, name: "Chinedu K.", score: 910, streak: 4 },
  { rank: 4, name: "Fatima B.", score: 870, streak: 3 },
  { rank: 5, name: "Ifeanyi M.", score: 820, streak: 2 },
  { rank: 6, name: "Halima Y.", score: 790, streak: 6 },
  { rank: 7, name: "Sola A.", score: 760, streak: 1 },
  { rank: 8, name: "Bola T.", score: 720, streak: 2 },
  { rank: 9, name: "Kemi L.", score: 690, streak: 1 },
  { rank: 10, name: "Emeka N.", score: 660, streak: 1 },
];

export const TOURNAMENT_LEADERS: LeaderRow[] = [
  { rank: 1, name: "Adaeze O.", score: 14820, streak: 21 },
  { rank: 2, name: "Tunde A.", score: 13950, streak: 18 },
  { rank: 3, name: "Halima Y.", score: 13110, streak: 17 },
  { rank: 4, name: "Chinedu K.", score: 12480, streak: 12 },
  { rank: 5, name: "Fatima B.", score: 11790, streak: 14 },
  { rank: 6, name: "Sola A.", score: 10920, streak: 9 },
  { rank: 7, name: "Bola T.", score: 10110, streak: 6 },
  { rank: 8, name: "Kemi L.", score: 9650, streak: 8 },
];

export const QUESTION_TIME = 15; // seconds
export const POINTS_BASE = 100;
export const POINTS_TIME_BONUS = 10; // per second remaining

export type Profile = {
  name: string;
  email: string;
  joined: string;
};

const PROFILE_KEY = "ftc:profile";
const SCORE_KEY = "ftc:totalScore";
const STREAK_KEY = "ftc:streak";
const VOUCHERS_KEY = "ftc:vouchers";
const LAST_PLAY_KEY = "ftc:lastPlay";

export const storage = {
  getProfile(): Profile | null {
    if (typeof localStorage === "undefined") return null;
    const raw = localStorage.getItem(PROFILE_KEY);
    return raw ? JSON.parse(raw) : null;
  },
  setProfile(p: Profile) { localStorage.setItem(PROFILE_KEY, JSON.stringify(p)); },
  clearProfile() { localStorage.removeItem(PROFILE_KEY); },
  getTotalScore(): number { return Number(localStorage.getItem(SCORE_KEY) ?? 0); },
  addScore(n: number) { localStorage.setItem(SCORE_KEY, String(this.getTotalScore() + n)); },
  getStreak(): number { return Number(localStorage.getItem(STREAK_KEY) ?? 0); },
  setStreak(n: number) { localStorage.setItem(STREAK_KEY, String(n)); },
  getVouchers(): string[] {
    if (typeof localStorage === "undefined") return [];
    return JSON.parse(localStorage.getItem(VOUCHERS_KEY) ?? "[]");
  },
  addVoucher(code: string) {
    const v = this.getVouchers();
    v.unshift(code);
    localStorage.setItem(VOUCHERS_KEY, JSON.stringify(v));
  },
  getLastPlay(): string | null { return localStorage.getItem(LAST_PLAY_KEY); },
  setLastPlay(date: string) { localStorage.setItem(LAST_PLAY_KEY, date); },
};

export function generateVoucher(): string {
  const r = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `WC-${r}-FREE`;
}
