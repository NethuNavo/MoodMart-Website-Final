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

  // Prevent rendering if not registered
  if (!isRegistered) {
    return null;
  }

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

  const today = new Date().toISOString().split('T')[0];

  const moodLabelMap = useMemo(
    () =>
      Object.values(moodCategories)
        .flat()
        .reduce<Record<MoodType, string>>((map, option) => {
          map[option.value] = option.label;
          return map;
        }, {} as Record<MoodType, string>),
    [moodCategories]
  );

  const moodDescriptions: Record<MoodType, string> = {
    happy: 'You are feeling positive, energized, and ready to take on the day.',
    calm: 'You feel relaxed and balanced. Keep breathing steadily.',
    relaxed: 'You are unwinding nicely. Maintain this gentle pace.',
    content: 'You feel satisfied and comfortable in the moment.',
    energetic: 'You have strong energy. Use it for focused progress.',
    motivated: 'Your mood is driving you forward. Keep that momentum.',
    grateful: 'You feel thankful and grounded. It’s a great emotional state.',
    okay: 'You feel neutral right now. A small boost can make this better.',
    normal: 'You are in a steady state. Continue to check in with yourself.',
    focused: 'Your attention is sharp and present. Great for productivity.',
    bored: 'You are feeling under-stimulated. Try a new activity.',
    stressed: 'You are feeling pressure. Try a calming breathing exercise.',
    anxious: 'Your mind is restless. Slow breathing can help.',
    overwhelmed: 'You may be carrying a lot. Take one pause at a time.',
    sad: 'You feel low. Gentle self-care can support your mood.',
    frustrated: 'You feel irritated. Try grounding and slow breaths.',
    angry: 'You feel heated. Deep breathing can help release tension.',
    lonely: 'You feel disconnected. Reach out or be kind to yourself.',
    sleepy: 'You need rest. A short pause or nap may help.',
    tired: 'Your energy is low. Slow moments can restore you.',
    exhausted: 'You need recovery. Prioritize sleep and calm routines.',
    rested: 'You feel refreshed. Keep this restorative rhythm going.',
    insomnia: 'Sleep is difficult. Calm breathing can ease your mind.',
    depressed: 'You feel heavy. Small, gentle habits can make a difference.',
    confused: 'Your thoughts feel scattered. Slow down and regroup.',
    'mentally-drained': 'You are drained. Give yourself permission to rest.',
    overthinking: 'Your mind is racing. Pause and breathe slowly.',
  };

  const todayEntries = useMemo(
    () => moodEntries.filter(entry => entry.date === today),
    [moodEntries, today]
  );

  const currentMoodEntry = useMemo(() => {
    if (todayEntries.length > 0) {
      return todayEntries[todayEntries.length - 1];
    }
    return moodEntries.length > 0 ? moodEntries[moodEntries.length - 1] : undefined;
  }, [todayEntries, moodEntries]);

  const timeSegments = ['Morning', 'Afternoon', 'Night'] as const;
  const getTimeSegment = (date = new Date()): typeof timeSegments[number] => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    return 'Night';
  };

  const maxMoodLogsPerDay = timeSegments.length;
  const currentTimeSegment = getTimeSegment();
  const todayMoodCount = todayEntries.length;
  const currentSegmentEntry = todayEntries.find(entry => entry.segment === currentTimeSegment);
  const canLogToday = todayMoodCount < maxMoodLogsPerDay && !currentSegmentEntry;

  const nextAllowedLogin = currentSegmentEntry
    ? currentTimeSegment === 'Morning'
      ? 'This afternoon'
      : currentTimeSegment === 'Afternoon'
      ? 'Tonight'
      : 'Tomorrow morning'
    : 'Now';

  const todayMoodTimeline = timeSegments.map((segment) => {
    const entry = todayEntries.find((item) => item.segment === segment);
    return {
      segment,
      mood: entry ? moodLabelMap[entry.mood] : 'No entry yet',
      intensity: entry?.intensity ?? 0,
      stressLevel: entry?.stressLevel ?? 0,
      note: entry?.notes || 'Log this part of the day to improve your mood insights.',
      filled: Boolean(entry),
    };
  });

  const todayMoodTrendData = useMemo(
    () =>
      timeSegments.map((segment) => {
        const entry = todayEntries.find((item) => item.segment === segment);
        return {
          period: segment,
          value: entry ? Math.round((entry.intensity / 5) * 100) : 0,
          mood: entry ? moodLabelMap[entry.mood] : 'No entry',
        };
      }),
    [todayEntries, moodLabelMap, timeSegments]
  );

  const getThisWeekEntries = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1); // Monday
    startOfWeek.setHours(0, 0, 0, 0);
    return moodEntries.filter(entry => new Date(entry.date) >= startOfWeek);
  }, [moodEntries]);

  const moodDistributionData = useMemo(() => {
    const negativeMoods = ['stressed', 'anxious', 'overwhelmed', 'sad', 'frustrated', 'angry', 'lonely', 'depressed', 'confused', 'mentally-drained', 'overthinking', 'exhausted', 'insomnia'];
    const positiveMoods = ['happy', 'calm', 'relaxed', 'content', 'energetic', 'motivated', 'grateful', 'rested'];
    const neutralMoods = ['okay', 'normal', 'focused', 'bored'];

    const entries = getThisWeekEntries;
    const positiveCount = entries.filter(entry => positiveMoods.includes(entry.mood)).length;
    const negativeCount = entries.filter(entry => negativeMoods.includes(entry.mood)).length;
    const neutralCount = entries.filter(entry => neutralMoods.includes(entry.mood)).length;
    const total = positiveCount + negativeCount + neutralCount;

    if (total === 0) {
      return [
        { name: 'Positive', value: 33, fill: '#88D8B0' },
        { name: 'Neutral', value: 34, fill: '#C4B5FD' },
        { name: 'Negative', value: 33, fill: '#F9A8D4' },
      ];
    }

    return [
      { name: 'Positive', value: Math.round((positiveCount / total) * 100), fill: '#88D8B0' },
      { name: 'Neutral', value: Math.round((neutralCount / total) * 100), fill: '#C4B5FD' },
      { name: 'Negative', value: Math.round((negativeCount / total) * 100), fill: '#F9A8D4' },
    ];
  }, [getThisWeekEntries]);

  const dailyMoodAverage = useMemo(() => {
    if (!todayEntries.length) return 63;
    return Math.round(
      todayEntries.reduce((sum, entry) => sum + entry.intensity * 20, 0) / todayEntries.length
    );
  }, [todayEntries]);

  const positivityRate = useMemo(() => {
    const positiveMoods = ['happy', 'calm', 'relaxed', 'content', 'energetic', 'motivated', 'grateful', 'rested'];
    const positiveCount = moodEntries.filter(entry => positiveMoods.includes(entry.mood)).length;
    const total = moodEntries.length;
    return total > 0 ? Math.round((positiveCount / total) * 100) : 0;
  }, [moodEntries]);

  const dayStreak = useMemo(() => {
    const allDates = Array.from(new Set(moodEntries.map(entry => entry.date))).sort((a, b) => b.localeCompare(a));
    let streak = 0;
    const date = new Date();

    while (true) {
      const isoDate = date.toISOString().split('T')[0];
      if (allDates.includes(isoDate)) {
        streak += 1;
        date.setDate(date.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [moodEntries]);

  const moodStability = useMemo(() => {
    const positiveValue = positivityRate;
    return Math.round(Math.min(92, Math.max(64, 56 + positiveValue * 0.25)));
  }, [positivityRate]);

  const moodChange = useMemo(() => {
    if (todayEntries.length < 2) {
      return 0;
    }
    return Math.round((todayEntries[todayEntries.length - 1].intensity - todayEntries[0].intensity) * 20);
  }, [todayEntries]);

  const stressTime = useMemo(() => {
    if (!todayEntries.length) return 'Afternoon';
    const index = todayEntries.reduce((maxIndex, entry, idx, arr) => entry.stressLevel > arr[maxIndex].stressLevel ? idx : maxIndex, 0);
    return timeSegments[index] ?? 'Afternoon';
  }, [todayEntries, timeSegments]);

  const calmTime = useMemo(() => {
    if (!todayEntries.length) return 'Night';
    const index = todayEntries.reduce((minIndex, entry, idx, arr) => entry.stressLevel < arr[minIndex].stressLevel ? idx : minIndex, 0);
    return timeSegments[index] ?? 'Night';
  }, [todayEntries, timeSegments]);

  const currentMoodDescription = currentMoodEntry
    ? moodDescriptions[currentMoodEntry.mood]
    : 'Track your mood today to get tailored insights and recommendations.';

  const handleSaveMood = () => {
    if (!canLogToday) {
      toast.error(
        currentSegmentEntry
          ? `You've already logged your ${currentTimeSegment.toLowerCase()} mood. Next allowed login is ${nextAllowedLogin}.`
          : 'You have reached the maximum of 3 mood logs for today. Please try again tomorrow.'
      );
      return;
    }

    const result = addMoodEntry({
      date: new Date().toISOString().split('T')[0],
      mood: selectedMood,
      intensity: intensity[0],
      stressLevel: intensity[0],
      notes: moodNote,
    });

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    setSelectedMood('calm');
    setIntensity([3]);
    setMoodNote('');
    setIsModalOpen(false);
    toast.success(result.message);

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
          <div className="flex flex-col items-center justify-center gap-4 mb-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              disabled={!canLogToday}
              className={`text-white px-8 py-6 text-lg rounded-full shadow-[0_22px_80px_rgba(124,58,237,0.24)] transition hover:-translate-y-1 ${canLogToday ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            >
              <Plus className="mr-2 h-5 w-5" />
              {canLogToday ? 'Log My Mood' : currentSegmentEntry ? `Already logged ${currentTimeSegment.toLowerCase()}` : 'Mood logging limit reached'}
            </Button>
            <p className="text-sm text-slate-600">
              {todayMoodCount} of {maxMoodLogsPerDay} mood checks logged for today.
            </p>
            {currentSegmentEntry && (
              <p className="text-sm text-purple-700">
                You already logged this {currentTimeSegment.toLowerCase()}. Next allowed login is {nextAllowedLogin}.
              </p>
            )}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.65fr_0.95fr] mb-8">
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-3">
            {todayMoodTimeline.map((slot, index) => (
              <motion.div
                key={slot.segment}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_28px_80px_rgba(99,102,241,0.08)] backdrop-blur-xl"
              >
                <div className="absolute -right-10 top-8 h-28 w-28 rounded-full bg-violet-200/25 blur-3xl" />
                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-violet-100 text-violet-700 shadow-[0_15px_40px_rgba(124,58,237,0.16)] text-xl">
                      {slot.filled ? '✨' : '➕'}
                    </div>
                    <span className="rounded-full bg-white/80 px-3 py-1 text-xs uppercase tracking-[0.32em] text-slate-700 shadow-sm">
                      {slot.segment}
                    </span>
                  </div>
                  <p className="mt-6 text-sm uppercase tracking-[0.24em] text-slate-500">Mood</p>
                  <h3 className="mt-3 text-2xl font-semibold text-slate-950">{slot.mood}</h3>
                  <p className="mt-3 text-sm text-slate-600">{slot.filled ? 'Recorded from your latest mood log.' : 'No log yet in this time slot.'}</p>
                  <div className="mt-6">
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
                      <span>Intensity</span>
                      <span>{slot.filled ? `${slot.intensity}/5` : '—'}</span>
                    </div>
                    <Slider
                      value={[slot.filled ? slot.intensity : 1]}
                      onValueChange={() => {}}
                      min={1}
                      max={5}
                      step={1}
                      className="mt-3"
                    />
                  </div>
                  <div className="mt-6 rounded-3xl border border-white/60 bg-slate-50 p-4 text-sm text-slate-700 shadow-[0_15px_35px_rgba(99,102,241,0.08)]">
                    {slot.note}
                  </div>
                  <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">Stress: {slot.filled ? `${slot.stressLevel}/10` : 'No data'}</p>
                </div>
              </motion.div>
            ))}
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
                      <p className="mt-2 text-sm font-semibold text-slate-900">{moodChange > 0 ? `+${moodChange} Improved` : moodChange < 0 ? `${moodChange} Since start` : 'No change yet'}</p>
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
                      <XAxis dataKey="period" tick={{ fontSize: 12, fill: '#7C3AED' }} label={{ value: 'Time of Day', position: 'insideBottom', offset: -5 }} />
                      <YAxis tick={{ fontSize: 12, fill: '#7C3AED' }} domain={[0, 100]} label={{ value: 'Mood Intensity (%)', angle: -90, position: 'insideLeft' }} />
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
                      <p className="text-xl font-semibold text-slate-950">{getThisWeekEntries.length} Entries</p>
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
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{dayStreak}</p>
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
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{positivityRate}%</p>
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
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{stressTime}</p>
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
                  <p className="mt-3 text-3xl font-semibold text-slate-950">{calmTime}</p>
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