import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { TrendingUp, Heart, Smile, Calendar, Music, Sparkles, Activity, BookOpen, Moon, Play, CheckCircle2, RefreshCcw, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { ResponsiveContainer, XAxis, Tooltip, BarChart, Bar } from 'recharts';
const dashboardHeaderImage = new URL('../../assets/e1299fdd0ff99a6c327fbb27c1d21487c3c0e4dd.png', import.meta.url).href;

export function DashboardPage() {
  const navigate = useNavigate();
  const { moodEntries } = useMood();
  const { user } = useUser();
  const userName = user.name || 'Friend';

  const handleQuickAction = (title: string) => {
    switch (title) {
      case 'Log My Mood':
        navigate('/mood');
        break;
      case 'Start Breathing':
        navigate('/breathing');
        break;
      case 'Play Audio':
        navigate('/audio');
        break;
      case 'Face Scan':
        navigate('/face-scan');
        break;
      case 'Community':
        navigate('/community');
        break;
      default:
        break;
    }
  };

  const recentEntries = moodEntries.slice(-7);
  const chartData = recentEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stress: entry.stressLevel,
  }));

  const averageStress = moodEntries.length > 0
    ? (moodEntries.reduce((sum, entry) => sum + entry.stressLevel, 0) / moodEntries.length).toFixed(1)
    : 0;

  const quickActions = [
    { title: 'Log My Mood', subtitle: 'Track your feelings', emoji: '😊', color: 'from-purple-200 to-purple-300' },
    { title: 'Start Breathing', subtitle: 'Calm your mind', emoji: '🌀', color: 'from-cyan-200 to-cyan-300' },
    { title: 'Play Audio', subtitle: 'Relax & focus', emoji: '🎵', color: 'from-pink-200 to-pink-300' },
    { title: 'Face Scan', subtitle: 'Check your mood', emoji: '📷', color: 'from-emerald-200 to-emerald-300' },
    { title: 'Community', subtitle: 'Connect & support', emoji: '👥', color: 'from-slate-200 to-slate-300' },
  ];

  const todayPlan = [
    { label: 'Morning Breathing', time: '7:30 AM', done: true },
    { label: 'Focus Audio', time: '1:00 PM', done: true },
    { label: 'Evening Walk', time: '6:00 PM', done: false },
    { label: 'Night Meditation', time: '9:30 PM', done: false },
  ];

  const habitTracker = [
    { label: 'Drink Water', progress: 90, color: 'from-emerald-400 to-emerald-500' },
    { label: 'Meditation', progress: 75, color: 'from-sky-400 to-cyan-500' },
    { label: 'Sleep before 11PM', progress: 60, color: 'from-violet-400 to-indigo-500' },
    { label: 'Screen Break', progress: 45, color: 'from-orange-400 to-amber-500' },
    { label: 'Exercise', progress: 80, color: 'from-fuchsia-400 to-pink-500' },
  ];

  const audioRecommendations = [
    {
      label: 'Rain Sounds for Deep Relaxation',
      duration: '25 min',
      image: 'https://images.unsplash.com/photo-1664976694406-3e9f37768a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwc3Rvcm0lMjBjbG91ZHN8ZW58MXx8fHwxNzY2Mzc2MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    },
    { label: 'Calm Piano', duration: '24 min' },
    { label: 'Forest Walk', duration: '18 min' },
    { label: 'Ocean Waves', duration: '30 min' },
  ];

  const sleepTrendData = [
    { day: 'Mon', value: 6.8 },
    { day: 'Tue', value: 7.2 },
    { day: 'Wed', value: 7.0 },
    { day: 'Thu', value: 7.5 },
    { day: 'Fri', value: 7.1 },
    { day: 'Sat', value: 7.8 },
    { day: 'Sun', value: 7.2 },
  ];

  const achievementsData = [
    { title: '7 Day Streak', emoji: '🔥', bg: 'from-orange-100 to-amber-200' },
    { title: 'Calm Mind', emoji: '🧘', bg: 'from-violet-100 to-purple-200' },
    { title: 'Stress Fighter', emoji: '🛡', bg: 'from-cyan-100 to-sky-200' },
    { title: 'Early Bird', emoji: '⏰', bg: 'from-indigo-100 to-blue-200' },
  ];

  const miniStats = [
    { title: 'Mood Recovery', value: '40%', subtitle: 'Faster recovery than yesterday', emoji: '✨', bg: 'bg-emerald-100 text-emerald-700' },
    { title: 'Focus Energy', value: '68%', subtitle: 'Good focus', emoji: '⚡', bg: 'bg-violet-100 text-violet-700' },
    { title: 'Community Activity', value: '132', subtitle: 'People meditated today', emoji: '👥', bg: 'bg-sky-100 text-sky-700' },
    { title: 'Daily Quote', value: '“Keep going!”', subtitle: 'Small wins matter', emoji: '💜', bg: 'bg-pink-100 text-pink-700' },
  ];

  interface Challenge {
    id: string;
    title: string;
    description: string;
    category: string;
    icon: string;
    color: string;
    gradient: string;
  }

  interface GratitudeNote {
    id: string;
    text: string;
    date: string;
  }

  const challengeQuotes = [
    'Small steps create lasting calm.',
    'Today’s choice is your wellness boost.',
    'You’re building a kinder daily rhythm.',
    'A gentle moment for yourself matters.',
    'Celebrate every small self-care win.',
  ];

  const challengeCategories = ['Relaxation', 'Digital Detox', 'Healthy Habits', 'Self-Love', 'Social Wellness', 'Mindfulness'];

  const challenges: Challenge[] = [
    {
      id: 'walk-outside',
      title: 'Take a 10-minute walk outside',
      description: 'Move your body and breathe in fresh air for a mood-boosting reset.',
      category: 'Relaxation',
      icon: '🚶‍♀️',
      color: 'text-emerald-700',
      gradient: 'from-emerald-100 to-emerald-200',
    },
    {
      id: 'water-then-phone',
      title: 'Drink water before checking your phone',
      description: 'Hydrate first and start the day with a calmer, clearer mindset.',
      category: 'Healthy Habits',
      icon: '💧',
      color: 'text-cyan-700',
      gradient: 'from-cyan-100 to-cyan-200',
    },
    {
      id: 'social-media-break',
      title: 'Stay away from social media for 30 minutes',
      description: 'Give your mind a break and reconnect with the present moment.',
      category: 'Digital Detox',
      icon: '📵',
      color: 'text-violet-700',
      gradient: 'from-violet-100 to-violet-200',
    },
    {
      id: 'positive-thoughts',
      title: 'Write 3 positive thoughts about yourself',
      description: 'Reflect on your strengths and let self-kindness take root.',
      category: 'Self-Love',
      icon: '📝',
      color: 'text-pink-700',
      gradient: 'from-pink-100 to-pink-200',
    },
    {
      id: 'calming-music',
      title: 'Listen to calming music for 5 minutes',
      description: 'Set a gentle soundtrack for peace and let your tension soften.',
      category: 'Mindfulness',
      icon: '🎧',
      color: 'text-slate-700',
      gradient: 'from-slate-100 to-slate-200',
    },
    {
      id: 'share-a-smile',
      title: 'Send a kind message to someone today',
      description: 'Connect with another person and spread warmth through a small note.',
      category: 'Social Wellness',
      icon: '💌',
      color: 'text-rose-700',
      gradient: 'from-rose-100 to-rose-200',
    },
  ];

  const gratitudePrompts = [
    'Today, I’m grateful for…',
    'Something that made me smile today was…',
    'A person I appreciate today is…',
    'I feel grateful for this little moment of peace…',
    'I’m thankful for the comfort in my day because…',
  ];

  const todayKey = new Date().toISOString().slice(0, 10);

  const hashString = (value: string) => {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash << 5) - hash + value.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  };

  const getDailyIndex = () => hashString(todayKey) % challenges.length;

  const [activeChallengeIndex, setActiveChallengeIndex] = useState<number>(getDailyIndex());
  const [challengeCompletedDates, setChallengeCompletedDates] = useState<string[]>([]);
  const [challengeQuote, setChallengeQuote] = useState<string>('Complete your first challenge today.');
  const [showConfetti, setShowConfetti] = useState(false);

  const [gratitudeInput, setGratitudeInput] = useState('');
  const [gratitudeNotes, setGratitudeNotes] = useState<GratitudeNote[]>([]);
  const [viewAllGratitudes, setViewAllGratitudes] = useState(false);
  const [editingGratitudeId, setEditingGratitudeId] = useState<string | null>(null);

  useEffect(() => {
    const storedChallenges = localStorage.getItem('moodmart_challenge_history');
    if (storedChallenges) {
      try {
        const parsed = JSON.parse(storedChallenges);
        if (Array.isArray(parsed.completedDates)) {
          setChallengeCompletedDates(parsed.completedDates);
        }
        if (typeof parsed.lastQuote === 'string') {
          setChallengeQuote(parsed.lastQuote);
        }
      } catch {
        // ignore invalid storage
      }
    }

    const storedGratitudes = localStorage.getItem('moodmart_gratitude_notes');
    if (storedGratitudes) {
      try {
        const parsed = JSON.parse(storedGratitudes);
        if (Array.isArray(parsed)) {
          setGratitudeNotes(parsed);
        }
      } catch {
        // ignore invalid storage
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('moodmart_challenge_history', JSON.stringify({ completedDates: challengeCompletedDates, lastQuote: challengeQuote }));
  }, [challengeCompletedDates, challengeQuote]);

  useEffect(() => {
    localStorage.setItem('moodmart_gratitude_notes', JSON.stringify(gratitudeNotes));
  }, [gratitudeNotes]);

  const activeChallenge = challenges[activeChallengeIndex];

  const challengeCompletedSet = new Set(challengeCompletedDates);
  const isChallengeCompletedToday = challengeCompletedSet.has(todayKey);

  const computeStreak = () => {
    let count = 0;
    const today = new Date();
    for (let offset = 0; offset < 7; offset += 1) {
      const date = new Date(today);
      date.setDate(date.getDate() - offset);
      const dateKey = date.toISOString().slice(0, 10);
      if (challengeCompletedSet.has(dateKey)) {
        count += 1;
      } else {
        break;
      }
    }
    return count;
  };

  const streakCount = computeStreak();
  const weeklyProgress = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dateKey = date.toISOString().slice(0, 10);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      completed: challengeCompletedSet.has(dateKey),
    };
  });

  const handleRefreshChallenge = () => {
    let nextIndex = activeChallengeIndex;
    while (nextIndex === activeChallengeIndex) {
      nextIndex = Math.floor(Math.random() * challenges.length);
    }
    setActiveChallengeIndex(nextIndex);
  };

  const handleCompleteChallenge = () => {
    if (isChallengeCompletedToday) {
      return;
    }
    const quote = challengeQuotes[Math.floor(Math.random() * challengeQuotes.length)];
    setChallengeQuote(quote);
    setChallengeCompletedDates((prev) => [...new Set([...prev, todayKey])]);
    setShowConfetti(true);
    window.setTimeout(() => setShowConfetti(false), 2200);
  };

  const dailyPromptIndex = hashString(todayKey) % gratitudePrompts.length;
  const dailyPrompt = gratitudePrompts[dailyPromptIndex];

  const handleSaveGratitude = () => {
    if (!gratitudeInput.trim()) {
      return;
    }

    const note = {
      id: editingGratitudeId || Date.now().toString(),
      text: gratitudeInput.trim(),
      date: new Date().toLocaleString('en-US', { hour12: true }),
    };

    if (editingGratitudeId) {
      setGratitudeNotes((notes) => notes.map((item) => (item.id === editingGratitudeId ? note : item)));
      setEditingGratitudeId(null);
    } else {
      setGratitudeNotes((notes) => [note, ...notes]);
    }

    setGratitudeInput('');
  };

  const handleEditGratitude = (id: string) => {
    const note = gratitudeNotes.find((item) => item.id === id);
    if (note) {
      setGratitudeInput(note.text);
      setEditingGratitudeId(id);
    }
  };

  const handleDeleteGratitude = (id: string) => {
    setGratitudeNotes((notes) => notes.filter((item) => item.id !== id));
    if (editingGratitudeId === id) {
      setEditingGratitudeId(null);
      setGratitudeInput('');
    }
  };

  const gratitudeCount = gratitudeNotes.length;
  const showGratitudeNotes = viewAllGratitudes && gratitudeCount > 0;
  const visibleGratitudeNotes = showGratitudeNotes ? gratitudeNotes : [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img
            src={dashboardHeaderImage}
            alt="Dashboard - Overview of your wellness journey"
            className="w-full h-60 sm:h-80 object-cover animate-fade-in"
          />
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-5 left-10 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-5 right-10 w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Hero Section */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 text-white shadow-[0_40px_120px_rgba(56,189,248,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_24%)]" />
            <div className="absolute -left-10 top-10 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl" />
            <div className="absolute right-10 top-10 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />
            <div className="relative z-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] items-center p-8 lg:p-12">
              <div className="space-y-6">
                <p className="text-sm uppercase tracking-[0.32em] text-cyan-100/80">Welcome back, {userName}! 👋</p>
                <h1 className="text-4xl font-semibold sm:text-5xl">You’re doing great! Small steps every day lead to a happier, healthier you.</h1>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-4 text-sm">
                    <p className="font-semibold text-white">🔥 7 Day Streak</p>
                  </div>
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-4 text-sm">
                    <p className="font-semibold text-white">🌿 5 Sessions This Week</p>
                  </div>
                  <div className="rounded-[24px] border border-white/20 bg-white/10 p-4 text-sm">
                    <p className="font-semibold text-white">📈 68% Wellness Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {quickActions.map((action) => (
              <Card
                key={action.title}
                role="button"
                tabIndex={0}
                onClick={() => handleQuickAction(action.title)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleQuickAction(action.title);
                  }
                }}
                className="overflow-hidden rounded-[28px] border border-white/70 bg-white/80 p-4 shadow-[0_20px_60px_rgba(124,58,237,0.08)] transition hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(124,58,237,0.12)] cursor-pointer"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br ${action.color} text-white shadow-sm`}>
                  <span className="text-xl">{action.emoji}</span>
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-900">{action.title}</p>
                <p className="mt-2 text-xs text-slate-500">{action.subtitle}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <Card className="relative overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#f4f5ff] via-[#fcf7ff] to-[#effcf7] p-6 shadow-[0_28px_90px_rgba(124,58,237,0.15)]">
              {showConfetti && (
                <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      className="absolute h-2 w-2 rounded-full opacity-90 animate-challenge-confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 50}%`,
                        animationDelay: `${Math.random() * 0.6}s`,
                        backgroundColor: ['#A78BFA', '#F9A8D4', '#6EE7B7', '#93C5FD'][index % 4],
                      }}
                    />
                  ))}
                </div>
              )}

              <div className="relative z-20 space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Random Self-Care Challenge</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">Daily wellness mission</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={handleRefreshChallenge}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Refresh Challenge
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteChallenge}
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${isChallengeCompletedToday ? 'bg-emerald-200 text-emerald-900' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isChallengeCompletedToday ? 'Completed' : 'Mark as Completed'}
                    </button>
                  </div>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${activeChallenge.gradient} text-3xl`}>
                        <span>{activeChallenge.icon}</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">{activeChallenge.category}</p>
                        <h4 className="mt-2 text-xl font-semibold text-slate-950">{activeChallenge.title}</h4>
                      </div>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">{activeChallenge.category}</div>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-slate-600">{activeChallenge.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {challengeCategories.map((category) => (
                    <span key={category} className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden rounded-[32px] border border-white/70 bg-gradient-to-br from-[#fff5fb] via-[#f8fcff] to-[#f3f8ff] p-6 shadow-[0_28px_90px_rgba(124,58,237,0.12)]">
              <div className="space-y-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Gratitude Prompt</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">Today, I’m grateful for…</h3>
                  </div>
                  <div className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700 shadow-sm">
                    {dailyPrompt}
                  </div>
                </div>

                <textarea
                  value={gratitudeInput}
                  onChange={(event) => setGratitudeInput(event.target.value)}
                  rows={5}
                  placeholder={dailyPrompt}
                  className="w-full rounded-[28px] border border-slate-200 bg-white/90 px-5 py-4 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                />

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleSaveGratitude}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:from-violet-700 hover:to-fuchsia-700"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {editingGratitudeId ? 'Update Gratitude' : 'Save Gratitude'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewAllGratitudes((state) => !state)}
                    className={`inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold ${gratitudeCount > 0 ? 'text-slate-700 hover:border-slate-300' : 'cursor-not-allowed text-slate-400'}`}
                    disabled={gratitudeCount === 0}
                  >
                    {viewAllGratitudes ? 'Show Less' : `View Notes (${gratitudeCount})`}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>

                {showGratitudeNotes && (
                  <>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                      Showing {gratitudeCount} saved note{gratitudeCount === 1 ? '' : 's'}
                    </p>
                    <div className="space-y-3 overflow-hidden rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm">
                      {visibleGratitudeNotes.length === 0 ? (
                        <p className="text-sm text-slate-500">Your saved gratitude notes will appear here.</p>
                      ) : (
                        visibleGratitudeNotes.map((note) => (
                          <div key={note.id} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="text-sm text-slate-900">{note.text}</p>
                                <p className="mt-2 text-xs text-slate-500">{note.date}</p>
                              </div>
                              <div className="flex items-center gap-2 text-slate-500">
                                <button type="button" onClick={() => handleEditGratitude(note.id)} className="rounded-full p-2 transition hover:bg-slate-100">
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button type="button" onClick={() => handleDeleteGratitude(note.id)} className="rounded-full p-2 text-rose-500 transition hover:bg-rose-50">
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Audio Recommendation</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Rain Sounds for Deep Relaxation</h3>
                </div>
                <Music className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-6 relative overflow-hidden rounded-[28px] bg-slate-900 text-white">
                <img src={audioRecommendations[0].image} alt="Rain sounds" className="h-40 w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">Rain Sounds for Deep Relaxation</p>
                    <p className="text-xs text-slate-200">25 min</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/audio?track=7')}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-white shadow-lg"
                    aria-label="Play rain sounds"
                  >
                    <Play className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="mt-5 grid gap-3">
                {audioRecommendations.slice(1).map((track) => (
                  <div key={track.label} className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
                    <span>{track.label}</span>
                    <span>{track.duration}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-indigo-200 bg-gradient-to-br from-indigo-50 via-sky-50 to-violet-50 p-6 shadow-[0_28px_90px_rgba(99,102,241,0.18)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-indigo-600">Guided Breathing</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Calm Breathing</h3>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-sky-100 text-sky-700 shadow-sm">
                  <span className="text-xl">🌀</span>
                </div>
              </div>
              <div className="mt-6 rounded-[28px] border border-indigo-100 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-900">2 min • Box Breathing</p>
                <p className="mt-2 text-sm text-slate-600">Breathe in, hold, breathe out</p>
              </div>
              <button
                type="button"
                onClick={() => navigate('/breathing')}
                className="mt-6 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-indigo-700"
              >
                Start Breathing
              </button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}
