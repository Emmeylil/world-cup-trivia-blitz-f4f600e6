import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { firebaseService } from "@/lib/firebase-service";
import { TRIVIA, type Question } from "@/lib/game-data";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Database, 
  Trophy, 
  Settings,
  ChevronRight,
  Loader2,
  CheckCircle2
} from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

function AdminPage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [tab, setTab] = useState<'questions' | 'leaderboard'>('questions');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const q = await firebaseService.fetchQuestions();
    setQuestions(q);
    const l = await firebaseService.getLeaderboard(50);
    setLeaderboard(l);
    setLoading(false);
  }

  async function handleMigrate() {
    setLoading(true);
    try {
      for (const q of TRIVIA) {
        await firebaseService.saveQuestion(q);
      }
      setMessage({ type: 'success', text: 'Migration complete! All questions are now in Firestore.' });
      loadData();
    } catch (e) {
      setMessage({ type: 'error', text: 'Migration failed.' });
    }
    setLoading(false);
  }

  async function handleSave() {
    if (!editForm) return;
    setLoading(true);
    try {
      await firebaseService.saveQuestion(editForm);
      setMessage({ type: 'success', text: 'Question saved successfully.' });
      setEditingId(null);
      setEditForm(null);
      loadData();
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to save question.' });
    }
    setLoading(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this question?')) return;
    setLoading(true);
    try {
      await firebaseService.deleteQuestion(id);
      setMessage({ type: 'success', text: 'Question deleted.' });
      loadData();
    } catch (e) {
      setMessage({ type: 'error', text: 'Failed to delete question.' });
    }
    setLoading(false);
  }

  const startEdit = (q: any) => {
    setEditingId(q.firestoreId);
    setEditForm({ ...q });
  };

  const startNew = () => {
    setEditingId('new');
    setEditForm({
      id: questions.length + 1,
      question: '',
      options: ['', '', '', ''],
      answer: 0,
      fact: ''
    });
  };

  if (loading && questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p>Loading Admin Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl">ADMIN <span className="text-gradient-gold">PANEL</span></h1>
        <div className="flex gap-2">
           <button 
            onClick={() => setTab('questions')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tab === 'questions' ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted'}`}
          >
            Questions
          </button>
          <button 
            onClick={() => setTab('leaderboard')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${tab === 'leaderboard' ? 'bg-gradient-gold text-gold-foreground' : 'bg-muted'}`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 animate-pop-in ${message.type === 'success' ? 'bg-success/10 border border-success/30 text-success' : 'bg-destructive/10 border border-destructive/30 text-destructive'}`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span className="text-sm font-medium">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {tab === 'questions' ? (
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-display flex items-center gap-2"><Settings className="w-5 h-5 text-gold" /> Question Bank</h2>
                <p className="text-xs text-muted-foreground mt-1">{questions.length} questions live in Firestore</p>
              </div>
              <div className="flex gap-2">
                {questions.length === 0 && (
                  <button 
                    onClick={handleMigrate}
                    className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-4 py-2 rounded-xl text-sm font-semibold transition"
                  >
                    <Database className="w-4 h-4" /> Import Hardcoded
                  </button>
                )}
                <button 
                  onClick={startNew}
                  className="flex items-center gap-2 bg-gradient-gold text-gold-foreground px-4 py-2 rounded-xl text-sm font-bold shadow-glow transition active:scale-95"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((q) => (
                <div key={q.firestoreId} className="group bg-muted/30 border border-border/50 rounded-2xl p-4 transition hover:border-gold/30">
                  {editingId === q.firestoreId ? (
                    <QuestionForm 
                      form={editForm} 
                      onChange={setEditForm} 
                      onSave={handleSave} 
                      onCancel={() => { setEditingId(null); setEditForm(null); }} 
                    />
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-gold/20 text-gold px-2 py-0.5 rounded uppercase tracking-widest">ID: {q.id}</span>
                          <h3 className="font-semibold text-sm">{q.question}</h3>
                        </div>
                        <p className="text-xs text-muted-foreground">Answer: <span className="text-success font-medium">{q.options[q.answer]}</span></p>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                        <button onClick={() => startEdit(q)} className="p-2 hover:bg-gold/10 rounded-lg text-gold transition"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(q.firestoreId)} className="p-2 hover:bg-destructive/10 rounded-lg text-destructive transition"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {editingId === 'new' && (
                <div className="bg-gold/5 border border-gold/30 rounded-2xl p-4 animate-pop-in">
                  <QuestionForm 
                    form={editForm} 
                    onChange={setEditForm} 
                    onSave={handleSave} 
                    onCancel={() => { setEditingId(null); setEditForm(null); }} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-card">
          <h2 className="text-xl font-display flex items-center gap-2 mb-6"><Trophy className="w-5 h-5 text-gold" /> Full Leaderboard</h2>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Rank</th>
                  <th className="px-4 py-3 font-semibold">Player</th>
                  <th className="px-4 py-3 font-semibold">Score</th>
                  <th className="px-4 py-3 font-semibold">Streak</th>
                  <th className="px-4 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leaderboard.map((row, i) => (
                  <tr key={row.id} className="hover:bg-muted/20 transition">
                    <td className="px-4 py-3 font-bold text-muted-foreground">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold">{row.name}</div>
                      <div className="text-[10px] text-muted-foreground">{row.email}</div>
                    </td>
                    <td className="px-4 py-3 font-bold text-gold">{row.score.toLocaleString()}</td>
                    <td className="px-4 py-3">{row.streak || 0}</td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {row.timestamp?.toDate ? row.timestamp.toDate().toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionForm({ form, onChange, onSave, onCancel }: any) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1 block sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Question Text</span>
          <input 
            value={form.question} 
            onChange={e => onChange({ ...form, question: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-gold/50 outline-none"
            placeholder="Enter the question..."
          />
        </label>
        
        {form.options.map((opt: string, i: number) => (
          <label key={i} className="space-y-1 block">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Option {String.fromCharCode(65 + i)}</span>
            <div className="flex gap-2">
              <input 
                value={opt} 
                onChange={e => {
                  const newOpts = [...form.options];
                  newOpts[i] = e.target.value;
                  onChange({ ...form, options: newOpts });
                }}
                className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none"
              />
              <button 
                onClick={() => onChange({ ...form, answer: i })}
                className={`w-8 h-8 rounded-lg grid place-items-center transition ${form.answer === i ? 'bg-success text-white' : 'bg-muted text-muted-foreground'}`}
              >
                {form.answer === i ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </button>
            </div>
          </label>
        ))}

        <label className="space-y-1 block sm:col-span-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Did you know? (Fact)</span>
          <textarea 
            value={form.fact || ''} 
            onChange={e => onChange({ ...form, fact: e.target.value })}
            className="w-full bg-background border border-border rounded-xl px-4 py-2 text-sm outline-none h-20 resize-none"
            placeholder="Add a fun fact..."
          />
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button onClick={onCancel} className="px-4 py-2 rounded-xl text-sm font-semibold hover:bg-muted transition flex items-center gap-2"><X className="w-4 h-4" /> Cancel</button>
        <button onClick={onSave} className="bg-gradient-gold text-gold-foreground px-6 py-2 rounded-xl text-sm font-bold shadow-glow transition active:scale-95 flex items-center gap-2"><Save className="w-4 h-4" /> Save Question</button>
      </div>
    </div>
  );
}
