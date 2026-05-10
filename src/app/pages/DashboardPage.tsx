import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { TrendingUp, Heart, Smile, Calendar, Music, Sparkles, Activity, BookOpen, Moon, Play, CheckCircle2 } from 'lucide-react';
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
      case 'Write Journal':
        navigate('/mood');
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
    { title: 'Write Journal', subtitle: 'Express yourself', emoji: '✍️', color: 'from-violet-200 to-violet-300' },
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

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="p-6 bg-[#0F6B58] text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10 text-white">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Mood Entries</p>
                    <p className="text-2xl font-semibold">{moodEntries.length}</p>
                  </div>
                </div>
                <div className="text-sm text-white/90 mt-1">+7 this week</div>
              </div>
            </Card>
            <Card className="p-6 bg-[#0F6B58] text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10 text-white">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Avg Stress</p>
                    <p className="text-2xl font-semibold">{averageStress}/10</p>
                  </div>
                </div>
                <div className="text-sm text-white/90 mt-1">Improving ↓</div>
              </div>
            </Card>
            <Card className="p-6 bg-[#0F6B58] text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10 text-white">
                    <Heart className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Streak</p>
                    <p className="text-2xl font-semibold">7 days</p>
                  </div>
                </div>
                <div className="text-sm text-white/90 mt-1">Keep going!</div>
              </div>
            </Card>
            <Card className="p-6 bg-[#0F6B58] text-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-white/10 text-white">
                    <Smile className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm">Mood Score</p>
                    <p className="text-2xl font-semibold">68%</p>
                  </div>
                </div>
                <div className="text-sm text-white/90 mt-1">Strong pace</div>
              </div>
            </Card>
          </div>

          {/* New Wellness Sections */}
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Today's Plan</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Your personalized plan for today</h3>
                </div>
                <Calendar className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-4">
                {todayPlan.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50 p-4">
                    <div>
                      <p className="text-base font-semibold text-slate-950">{item.label}</p>
                      <p className="text-xs text-slate-500">{item.time}</p>
                    </div>
                    <span className={`inline-flex h-8 items-center justify-center rounded-full px-3 text-xs font-semibold ${item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                      {item.done ? '✔' : '○'}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-right">
                <button type="button" onClick={() => navigate('/mood')} className="text-sm font-semibold text-violet-600 hover:text-violet-700">View Full Plan →</button>
              </div>
            </Card>

            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Guided Breathing</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Calm Breathing</h3>
                </div>
                <Play className="h-6 w-6 text-violet-600" />
              </div>
              <div className="mt-8 flex items-center justify-between rounded-[28px] border border-violet-200 bg-violet-50 p-5 shadow-sm">
                <div>
                  <p className="text-sm text-slate-500">2 min • Box Breathing</p>
                  <p className="mt-3 text-lg font-semibold text-slate-950">Breathe in, hold, breathe out</p>
                </div>
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-[0_15px_40px_rgba(124,58,237,0.18)]" />
              </div>
              <Button onClick={() => navigate('/breathing')} className="mt-6 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700">▶ Start Breathing</Button>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Habit Tracker</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Healthy habits</h3>
                </div>
                <Activity className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-5">
                {habitTracker.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>{item.label}</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="mt-3 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${item.color}`} style={{ width: `${item.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Journal Preview</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Today&apos;s reflection</h3>
                </div>
                <BookOpen className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-600">“Today was more productive than I expected. The breathing session in the morning really helped me stay calm.”</p>
                <p className="mt-4 text-xs text-slate-500">4:35 PM</p>
              </div>
              <Button onClick={() => navigate('/mood')} className="mt-6 w-full rounded-full bg-violet-600 text-white hover:bg-violet-700">Continue Writing</Button>
            </Card>

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
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Sleep Wellness</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Rest quality</h3>
                </div>
                <Moon className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 space-y-5">
                <div className="rounded-[28px] bg-slate-50 p-4">
                  <div className="flex items-center justify-between text-sm font-semibold text-slate-900">
                    <span>Sleep duration</span>
                    <span>7h 20m</span>
                  </div>
                  <div className="mt-3 h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500" />
                  </div>
                </div>
                <div className="rounded-[28px] bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Good Sleep Quality</p>
                </div>
                <div className="rounded-[28px] border border-slate-200 bg-white p-4">
                  <div className="h-28">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sleepTrendData}>
                        <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#68738D' }} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{ fill: 'rgba(148,163,184,0.1)' }} />
                        <Bar dataKey="value" radius={[12,12,0,0]} fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Achievements</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Milestones</h3>
                </div>
                <Sparkles className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 grid gap-4">
                {achievementsData.map((item) => (
                  <div key={item.title} className={`rounded-[28px] border border-slate-200 p-4 bg-gradient-to-r ${item.bg}`}>
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/70 text-slate-950 shadow-sm">{item.emoji}</div>
                      <div>
                        <p className="text-base font-semibold text-slate-950">{item.title}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Wellness Stats</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">Momentum</h3>
                </div>
                <CheckCircle2 className="h-6 w-6 text-slate-600" />
              </div>
              <div className="mt-8 grid gap-4">
                {miniStats.map((item) => (
                  <div key={item.title} className={`rounded-3xl border border-slate-200 p-4 ${item.bg}`}>
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                        <p className="mt-2 text-xs text-slate-600">{item.subtitle}</p>
                      </div>
                      <div className="inline-flex h-10 w-10 items-center justify-center rounded-3xl bg-white/90 text-slate-900 shadow-sm">{item.emoji}</div>
                    </div>
                    <p className="mt-4 text-2xl font-semibold text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}