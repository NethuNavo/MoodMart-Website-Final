import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMood } from '../context/MoodContext';
import { useNotification } from '../context/NotificationContext';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { LineChart, Line, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, CheckCircle2, Bot, Sparkles, Flame, ArrowUpRight, Moon, AlertTriangle, HeartPulse, Leaf } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
const headerBg = new URL('../../assets/a29c988cecf7518aefa1051e53ffc3b671037802.png', import.meta.url).href;
const moodTrackerImage = new URL('../../assets/dee9378edbd4ba6c11d239aea2f3bed41d87b621.png', import.meta.url).href;

type MoodType = 'happy' | 'calm' | 'relaxed' | 'content' | 'energetic' | 'motivated' | 'grateful' | 
                'okay' | 'normal' | 'focused' | 'bored' | 
                'stressed' | 'anxious' | 'overwhelmed' | 'sad' | 'frustrated' | 'angry' | 'lonely' | 
                'sleepy' | 'tired' | 'exhausted' | 'rested' | 'insomnia' | 
                'depressed' | 'confused' | 'mentally-drained' | 'overthinking';

export function MoodTrackerPage() {
  const { isRegistered } = useUser();
  const navigate = useNavigate();

  // Redirect if not registered
  useEffect(() => {
    if (!isRegistered) {
      toast.error('Please log in to access the Mood Tracker');
      navigate('/auth');
    }
  }, [isRegistered, navigate]);

  const { moodEntries, addMoodEntry } = useMood();
  const { showMoodBasedNotification } = useNotification();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMood, setSelectedMood] = useState<MoodType>('calm');
  const [intensity, setIntensity] = useState([3]);
  const [moodNote, setMoodNote] = useState('');

  // Comprehensive categorized mood options
  const moodCategories = {
    positive: [
      { value: 'happy' as const, emoji: '😊', label: 'Happy' },
      { value: 'calm' as const, emoji: '😌', label: 'Calm' },
      { value: 'relaxed' as const, emoji: '😎', label: 'Relaxed' },
      { value: 'content' as const, emoji: '☺️', label: 'Content' },
      { value: 'energetic' as const, emoji: '⚡', label: 'Energetic' },
      { value: 'motivated' as const, emoji: '💪', label: 'Motivated' },
      { value: 'grateful' as const, emoji: '🙏', label: 'Grateful' },
    ],
    neutral: [
      { value: 'okay' as const, emoji: '😐', label: 'Okay' },
      { value: 'normal' as const, emoji: '😶', label: 'Normal' },
      { value: 'focused' as const, emoji: '🎯', label: 'Focused' },
      { value: 'bored' as const, emoji: '😑', label: 'Bored' },
    ],
    negative: [
      { value: 'stressed' as const, emoji: '😟', label: 'Stressed' },
      { value: 'anxious' as const, emoji: '😰', label: 'Anxious' },
      { value: 'overwhelmed' as const, emoji: '😵', label: 'Overwhelmed' },
      { value: 'sad' as const, emoji: '😢', label: 'Sad' },
      { value: 'frustrated' as const, emoji: '😤', label: 'Frustrated' },
      { value: 'angry' as const, emoji: '😠', label: 'Angry' },
      { value: 'lonely' as const, emoji: '😔', label: 'Lonely' },
    ],
    sleep: [
      { value: 'sleepy' as const, emoji: '😪', label: 'Sleepy' },
      { value: 'tired' as const, emoji: '😴', label: 'Tired' },
      { value: 'exhausted' as const, emoji: '😩', label: 'Exhausted' },
      { value: 'rested' as const, emoji: '🛌', label: 'Rested' },
      { value: 'insomnia' as const, emoji: '🌙', label: 'Insomnia' },
    ],
    mental: [
      { value: 'depressed' as const, emoji: '😞', label: 'Depressed' },
      { value: 'confused' as const, emoji: '😕', label: 'Confused' },
      { value: 'mentally-drained' as const, emoji: '🤯', label: 'Mentally Drained' },
      { value: 'overthinking' as const, emoji: '🤔', label: 'Overthinking' },
    ],
  };

  // Generate Weekly Mood Trend Data from user entries
  const weeklyTrendData = useMemo(() => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = days[date.getDay()];
      
      // Find entries for this date
      const dayEntries = moodEntries.filter(entry => entry.date === dateStr);
      
      // Calculate average mood score for the day (intensity * 10)
      const avgScore = dayEntries.length > 0
        ? Math.round(dayEntries.reduce((sum, entry) => sum + (entry.intensity || 3), 0) / dayEntries.length * 10)
        : 0;

      last7Days.push({
        day: dayName,
        value: avgScore,
      });
    }

    return last7Days;
  }, [moodEntries]);

  // Generate Emotion Distribution Data from user entries
  const emotionDistributionData = useMemo(() => {
    const moodCounts: Record<string, number> = {};

    // Initialize all moods
    Object.values(moodCategories).flat().forEach(mood => {
      moodCounts[mood.label] = 0;
    });

    moodEntries.forEach(entry => {
      const moodOption = Object.values(moodCategories)
        .flat()
        .find(m => m.value === entry.mood);
      
      if (moodOption && moodCounts[moodOption.label] !== undefined) {
        moodCounts[moodOption.label]++;
      }
    });

    const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);

    return Object.entries(moodCounts)
      .map(([emotion, count]) => ({
        emotion,
        frequency: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .filter(item => item.frequency > 0)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 10); // Show top 10 moods
  }, [moodEntries, moodCategories]);

  // Generate Mood Breakdown Data (Negative vs Positive)
  const moodBreakdownData = useMemo(() => {
    let negativeCount = 0;
    let positiveCount = 0;

    const negativeMoods = ['stressed', 'anxious', 'overwhelmed', 'sad', 'frustrated', 'angry', 'lonely', 'depressed', 'confused', 'mentally-drained', 'overthinking', 'exhausted', 'insomnia'];
    const positiveMoods = ['happy', 'calm', 'relaxed', 'content', 'energetic', 'motivated', 'grateful', 'rested'];

    moodEntries.forEach(entry => {
      if (negativeMoods.includes(entry.mood)) {
        negativeCount++;
      } else if (positiveMoods.includes(entry.mood)) {
        positiveCount++;
      }
    });

    const total = negativeCount + positiveCount;
    
    if (total === 0) {
      return [
        { name: 'Negative', value: 50, color: '#9B8BC6' },
        { name: 'Positive', value: 50, color: '#88D8B0' },
      ];
    }

    return [
      { name: 'Negative', value: Math.round((negativeCount / total) * 100), color: '#9B8BC6' },
      { name: 'Positive', value: Math.round((positiveCount / total) * 100), color: '#88D8B0' },
    ];
  }, [moodEntries]);

  const todayMoodTrendData = useMemo(
    () => [
      { period: 'Morning', value: 80 },
      { period: 'Afternoon', value: 30 },
      { period: 'Night', value: 65 },
    ],
    []
  );

  const weeklyMoodTrendData = useMemo(
    () => [
      { day: 'Sun', value: 70 },
      { day: 'Mon', value: 55 },
      { day: 'Tue', value: 65 },
      { day: 'Wed', value: 40 },
      { day: 'Thu', value: 75 },
      { day: 'Fri', value: 60 },
      { day: 'Sat', value: 65 },
    ],
    []
  );

  const moodDistributionData = useMemo(
    () => [
      { name: 'Positive', value: 52, fill: '#88D8B0' },
      { name: 'Neutral', value: 24, fill: '#C4B5FD' },
      { name: 'Negative', value: 24, fill: '#F9A8D4' },
    ],
    []
  );

  const dailyMoodAverage = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = moodEntries.filter(entry => entry.date === today);
    if (!todayEntries.length) return 63;
    return Math.round(
      todayEntries.reduce((sum, entry) => sum + (entry.intensity || 3) * 20, 0) / todayEntries.length
    );
  }, [moodEntries]);

  const moodStability = useMemo(() => {
    const positiveValue = moodBreakdownData.find(item => item.name === 'Positive')?.value ?? 55;
    return Math.round(Math.min(92, Math.max(64, 56 + positiveValue * 0.25)));
  }, [moodBreakdownData]);

  const stressTime = 'Afternoon';
  const moodChange = 35;

  const handleSaveMood = () => {
    addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      intensity: intensity[0],
      stressLevel: intensity[0],
      notes: moodNote,
    });
    
    // Reset form
    setSelectedMood('calm');
    setIntensity([3]);
    setMoodNote('');
    setIsModalOpen(false);
    toast.success('Mood logged successfully!');
    
    // Show motivational notification after mood logging
    setTimeout(() => {
      showMoodBasedNotification(selectedMood, intensity[0]);
    }, 1000);
  };

  const handleViewInsights = () => {
    toast.success('Mood insights are ready — review the summary cards on this page for your current mood patterns.');
  };

  const handleStartBreathing = () => {
    navigate('/breathing');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img 
            src={moodTrackerImage} 
            alt="Mood Tracker - Track your daily mood & view trends" 
            className="w-full h-60 sm:h-80 object-cover animate-fade-in"
          />
        </div>
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-[#B4D4D3] via-white to-[#C5B8D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-[0_22px_80px_rgba(124,58,237,0.24)] transition hover:-translate-y-1"
            >
              <Plus className="mr-2 h-5 w-5" />
              Log My Mood
            </Button>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.65fr_0.95fr] mb-8">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-yellow-50 via-white to-amber-100 shadow-[0_28px_80px_rgba(251,191,36,0.18)] backdrop-blur-xl"
                >
                  <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-yellow-300/30 blur-3xl" />
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-200/90 text-amber-700 shadow-[0_15px_40px_rgba(249,115,22,0.18)] text-xl">
                        😊
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-700 shadow-sm">
                        <CheckCircle2 className="h-4 w-4 text-amber-600" />
                        Completed
                      </span>
                    </div>
                    <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">Morning Mood</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">Happy</h3>
                    <p className="mt-3 text-sm text-slate-600">How are you starting your day?</p>
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>Intensity</span>
                        <span>8/10</span>
                      </div>
                      <Slider
                        value={[8]}
                        onValueChange={() => {}}
                        min={1}
                        max={10}
                        step={1}
                        className="mt-3"
                      />
                    </div>
                    <div className="mt-6 rounded-3xl border border-white/60 bg-white/70 p-4 text-sm text-slate-700 shadow-[0_15px_35px_rgba(245,158,11,0.08)]">
                      Woke up fresh and motivated for the day!
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">8:30 AM</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-pink-50 via-white to-violet-100 shadow-[0_28px_80px_rgba(219,39,119,0.16)] backdrop-blur-xl"
                >
                  <div className="absolute -right-12 top-6 h-32 w-32 rounded-full bg-fuchsia-300/30 blur-3xl" />
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-fuchsia-200/90 text-fuchsia-700 shadow-[0_15px_40px_rgba(219,39,119,0.18)] text-xl">
                        😟
                      </div>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-700 shadow-sm">Focus</span>
                    </div>
                    <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">Afternoon Mood</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">Stressed</h3>
                    <p className="mt-3 text-sm text-slate-600">How has your day been so far?</p>
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>Intensity</span>
                        <span>3/10</span>
                      </div>
                      <Slider
                        value={[3]}
                        onValueChange={() => {}}
                        min={1}
                        max={10}
                        step={1}
                        className="mt-3"
                      />
                    </div>
                    <div className="mt-6 rounded-3xl border border-white/60 bg-white/70 p-4 text-sm text-slate-700 shadow-[0_15px_35px_rgba(168,85,247,0.08)]">
                      Too much workload and back-to-back meetings.
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">2:15 PM</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  whileHover={{ y: -6 }}
                  className="relative overflow-hidden rounded-[28px] border border-white/70 bg-gradient-to-br from-indigo-50 via-white to-slate-100 shadow-[0_28px_80px_rgba(99,102,241,0.16)] backdrop-blur-xl"
                >
                  <div className="absolute -right-10 top-10 h-32 w-32 rounded-full bg-blue-200/25 blur-3xl" />
                  <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-200/90 text-indigo-700 shadow-[0_15px_40px_rgba(59,130,246,0.18)] text-xl">
                        😌
                      </div>
                      <span className="rounded-full bg-white/70 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-700 shadow-sm">Night</span>
                    </div>
                    <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">Night Mood</p>
                    <h3 className="mt-3 text-2xl font-semibold text-slate-950">Calm</h3>
                    <p className="mt-3 text-sm text-slate-600">How do you feel before sleep?</p>
                    <div className="mt-6">
                      <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                        <span>Intensity</span>
                        <span>7/10</span>
                      </div>
                      <Slider
                        value={[7]}
                        onValueChange={() => {}}
                        min={1}
                        max={10}
                        step={1}
                        className="mt-3"
                      />
                    </div>
                    <div className="mt-6 rounded-3xl border border-white/60 bg-white/70 p-4 text-sm text-slate-700 shadow-[0_15px_35px_rgba(59,130,246,0.08)]">
                      Watched a movie and did some breathing exercises.
                    </div>
                    <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">10:30 PM</p>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_28px_80px_rgba(124,58,237,0.12)] backdrop-blur-xl"
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-200/30 blur-3xl" />
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.28em] text-violet-600">Daily Mood Average</p>
                      <p className="mt-2 text-3xl font-semibold text-slate-950">{dailyMoodAverage}%</p>
                    </div>
                    <div className="relative inline-flex h-28 w-28 items-center justify-center rounded-full bg-white/80 shadow-[0_15px_40px_rgba(124,58,237,0.12)]" style={{ backgroundImage: `conic-gradient(rgba(136,216,176,0.95) ${dailyMoodAverage * 3.6}deg, rgba(229,231,235,0.4) 0deg)` }}>
                      <span className="text-xl font-semibold text-emerald-700">{dailyMoodAverage}%</span>
                    </div>
                  </div>
                  <div className="mt-6 grid gap-4">
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Mood Change</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">+{moodChange} Improved</p>
                    </div>
                    <div className="rounded-3xl border border-slate-200 bg-white/80 p-4 shadow-sm">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Stability</p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">{moodStability}% Stable</p>
                    </div>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_28px_80px_rgba(124,58,237,0.12)] backdrop-blur-xl"
            >
              <div className="absolute right-6 top-6 h-24 w-24 rounded-full bg-purple-200/25 blur-3xl" />
              <div className="relative z-10 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-violet-600">Mood Trend Today</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">Morning → Afternoon → Night</h3>
                  </div>
                  <Sparkles className="h-6 w-6 text-violet-500" />
                </div>
                <div className="mt-6 h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={todayMoodTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(124,58,237,0.12)" />
                      <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#7C3AED' }} />
                      <YAxis tick={{ fontSize: 12, fill: '#7C3AED' }} domain={[0, 100]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#C084FC', r: 5 }} activeDot={{ r: 7 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_28px_80px_rgba(124,58,237,0.12)] backdrop-blur-xl"
            >
              <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-emerald-200/25 blur-3xl" />
              <div className="relative z-10 p-6">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Mood Stability</p>
                <h3 className="mt-2 text-2xl font-semibold text-slate-950">Steady Mindset</h3>
                <div className="mt-8 flex items-center gap-6">
                  <div className="relative inline-flex h-32 w-32 items-center justify-center rounded-full bg-white/90 shadow-[0_15px_40px_rgba(72,187,120,0.16)]" style={{ backgroundImage: `conic-gradient(rgba(136,216,176,0.95) ${moodStability * 3.6}deg, rgba(226,232,240,0.55) 0deg)` }}>
                    <div className="absolute inset-4 rounded-full bg-white/90" />
                    <span className="relative text-3xl font-semibold text-emerald-700">{moodStability}%</span>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Your mood has been stable with steady recovery today.</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                      <Flame className="h-4 w-4" />
                      <span>Balanced breathing flow</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_28px_80px_rgba(124,58,237,0.12)] backdrop-blur-xl"
            >
              <div className="absolute right-6 bottom-6 h-24 w-24 rounded-full bg-fuchsia-200/25 blur-3xl" />
              <div className="relative z-10 p-6">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 shadow-[0_15px_30px_rgba(124,58,237,0.16)]">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Most Stressful Time</p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-950">Afternoon</h3>
                  </div>
                </div>
                <div className="mt-6 rounded-[28px] border border-slate-200 bg-white/80 p-4 shadow-sm">
                  <p className="text-sm text-slate-600">3 / 10 stress meter</p>
                  <div className="mt-4 h-3 rounded-full bg-slate-200 overflow-hidden">
                    <div className="h-full w-32 bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr_0.95fr] mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/70 shadow-[0_30px_80px_rgba(124,58,237,0.14)] backdrop-blur-3xl transition-transform duration-300"
            >
              <div className="absolute -left-8 top-8 h-28 w-28 rounded-full bg-emerald-200/25 blur-3xl" />
              <div className="absolute right-8 bottom-10 h-28 w-28 rounded-full bg-fuchsia-200/20 blur-3xl" />
              <div className="relative z-10 p-6 lg:p-8">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Mood Distribution</p>
                    <h2 className="mt-3 text-3xl font-semibold text-slate-950">Mood Distribution</h2>
                  </div>
                  <span className="rounded-full border border-slate-200 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-slate-700 shadow-sm">
                    This Week
                  </span>
                </div>

                <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_0.65fr] items-center">
                  <div className="relative h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={moodDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={64}
                          outerRadius={96}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {moodDistributionData.map((entry, index) => (
                            <Cell key={`slice-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-xl font-semibold text-slate-950">21 Entries</p>
                      <p className="mt-1 text-sm text-slate-500">This Week</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {moodDistributionData.map(item => (
                      <div key={item.name} className="flex items-center gap-4 rounded-3xl border border-slate-200/70 bg-white/80 p-4 shadow-sm">
                        <span className="flex h-4.5 w-4.5 rounded-full" style={{ backgroundColor: item.fill }} />
                        <div>
                          <p className="text-base font-semibold text-slate-950">{item.name}</p>
                          <p className="text-sm text-slate-500">{item.value}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/75 shadow-[0_30px_80px_rgba(124,58,237,0.14)] backdrop-blur-3xl transition-transform duration-300"
            >
              <div className="absolute left-4 top-4 h-28 w-28 rounded-full bg-emerald-200/25 blur-3xl" />
              <div className="absolute right-8 top-12 h-36 w-36 rounded-full bg-violet-200/20 blur-3xl" />
              <div className="relative z-10 p-6 lg:p-8">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-[0_15px_30px_rgba(16,185,129,0.18)]">
                    <Leaf className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-sm uppercase tracking-[0.32em] text-slate-500">Recommended for You</p>
                    <h2 className="mt-2 text-3xl font-semibold text-slate-950">Recommended for You</h2>
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-xl">
                    <p className="text-xl font-semibold text-slate-950">Afternoon stress detected</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">Try 5-min Calming Breath to relax your mind.</p>
                    <button onClick={handleStartBreathing} className="mt-6 inline-flex items-center justify-center rounded-3xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_rgba(124,58,237,0.24)] transition hover:-translate-y-0.5" type="button">
                      Start Breathing
                    </button>
                  </div>

                  <div className="relative mx-auto flex h-72 w-full max-w-[250px] items-center justify-center">
                    <div className="absolute -left-10 top-8 h-28 w-28 rounded-full bg-violet-300/30 blur-3xl" />
                    <div className="absolute right-0 bottom-0 h-40 w-40 rounded-full bg-emerald-200/20 blur-3xl" />
                    <svg viewBox="0 0 260 320" className="relative h-full w-full">
                      <defs>
                        <linearGradient id="personGlow" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#E9D5FF" />
                          <stop offset="100%" stopColor="#D8B4FE" />
                        </linearGradient>
                      </defs>
                      <circle cx="130" cy="145" r="110" fill="url(#personGlow)" opacity="0.25" />
                      <ellipse cx="130" cy="180" rx="72" ry="32" fill="#F8F4FF" opacity="0.95" />
                      <circle cx="130" cy="72" r="24" fill="#F3E8FF" />
                      <path d="M100 112 C100 88 160 88 160 112 C160 138 100 138 100 112 Z" fill="#E9D5FF" />
                      <path d="M94 126 C84 138 84 170 112 188 C124 196 136 196 148 188 C176 170 176 138 166 126 C154 114 146 114 130 114 C114 114 106 114 94 126 Z" fill="#D8B4FE" />
                      <path d="M102 184 C94 202 98 228 118 238 C138 248 156 248 176 238 C196 228 200 202 192 184 C186 170 174 163 162 166 C150 169 150 182 138 188 C126 194 118 190 110 182 C104 176 106 168 102 184 Z" fill="#FFF5FF" opacity="0.95" />
                      <path d="M88 230 C82 252 92 276 110 288 C128 300 152 300 170 288 C188 276 198 252 192 230" fill="#C4B5FD" opacity="0.75" />
                      <path d="M123 119 C124 113 132 112 136 117 C140 122 139 131 134 136 C129 141 120 143 116 138 C112 133 122 126 123 119 Z" fill="#A78BFA" opacity="0.85" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-[28px] border border-white/55 bg-white/80 px-5 py-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Day Streak</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">7</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-100 text-orange-600 shadow-[0_15px_30px_rgba(251,191,36,0.18)]">
                  <Flame className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="rounded-[28px] border border-white/55 bg-white/80 px-5 py-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Positivity Rate</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">60%</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-700 shadow-[0_15px_30px_rgba(16,185,129,0.18)]">
                  <ArrowUpRight className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-[28px] border border-white/55 bg-white/80 px-5 py-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Most Stressful Time</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">Afternoon</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 shadow-[0_15px_30px_rgba(124,58,237,0.18)]">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65 }}
              className="rounded-[28px] border border-white/55 bg-white/80 px-5 py-6 shadow-[0_20px_60px_rgba(124,58,237,0.08)] backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Most Calm Time</p>
                  <p className="mt-3 text-3xl font-semibold text-slate-950">Night</p>
                </div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-indigo-100 text-indigo-700 shadow-[0_15px_30px_rgba(99,102,241,0.18)]">
                  <Moon className="h-6 w-6" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mood Logging Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">How are you feeling today?</DialogTitle>
            <DialogDescription className="text-sm text-center text-gray-500">
              Select your mood and intensity level to log your daily mood.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Mood Selection - Categorized */}
            <div className="space-y-5">
              {/* Positive Moods */}
              <div>
                <Label className="text-base mb-3 block flex items-center gap-2">
                  <span className="text-2xl">🌈</span>
                  <span>Positive Moods</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {moodCategories.positive.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-2.5 rounded-lg border-2 transition-all ${
                        selectedMood === option.value
                          ? 'border-purple-500 bg-purple-50 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Neutral Moods */}
              <div>
                <Label className="text-base mb-3 block flex items-center gap-2">
                  <span className="text-2xl">😐</span>
                  <span>Neutral Moods</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {moodCategories.neutral.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-2.5 rounded-lg border-2 transition-all ${
                        selectedMood === option.value
                          ? 'border-blue-500 bg-blue-50 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Negative Moods */}
              <div>
                <Label className="text-base mb-3 block flex items-center gap-2">
                  <span className="text-2xl">😟</span>
                  <span>Negative Moods</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {moodCategories.negative.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-2.5 rounded-lg border-2 transition-all ${
                        selectedMood === option.value
                          ? 'border-red-500 bg-red-50 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep-Related Moods */}
              <div>
                <Label className="text-base mb-3 block flex items-center gap-2">
                  <span className="text-2xl">😴</span>
                  <span>Sleep-Related Moods</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {moodCategories.sleep.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-2.5 rounded-lg border-2 transition-all ${
                        selectedMood === option.value
                          ? 'border-indigo-500 bg-indigo-50 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mental / Emotional States */}
              <div>
                <Label className="text-base mb-3 block flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  <span>Mental / Emotional States</span>
                </Label>
                <div className="grid grid-cols-4 gap-2">
                  {moodCategories.mental.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedMood(option.value)}
                      className={`p-2.5 rounded-lg border-2 transition-all ${
                        selectedMood === option.value
                          ? 'border-purple-500 bg-purple-50 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="text-2xl mb-1">{option.emoji}</div>
                      <div className="text-xs font-medium">{option.label}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Intensity Slider */}
            <div>
              <Label className="text-base mb-3 block">
                Intensity: <span className="text-purple-600 font-bold">{intensity[0]}/5</span>
              </Label>
              <Slider
                value={intensity}
                onValueChange={setIntensity}
                min={1}
                max={5}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span>Moderate</span>
                <span>Strong</span>
              </div>
            </div>

            {/* Optional Note */}
            <div>
              <Label htmlFor="note" className="text-base mb-3 block">
                Why? <span className="text-gray-500 text-sm">(Optional)</span>
              </Label>
              <Input
                id="note"
                placeholder="Short note about your mood..."
                value={moodNote}
                onChange={(e) => setMoodNote(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveMood}
                className="flex-1 bg-[#6B5B95] hover:bg-[#5A4A85] text-white"
              >
                Save Mood
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}