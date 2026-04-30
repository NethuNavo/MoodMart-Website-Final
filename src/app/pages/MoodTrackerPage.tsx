import { useState, useMemo } from 'react';
import { useMood } from '../context/MoodContext';
import { useNotification } from '../context/NotificationContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
const headerBg = new URL('../../assets/a29c988cecf7518aefa1051e53ffc3b671037802.png', import.meta.url).href;
const moodTrackerImage = new URL('../../assets/dee9378edbd4ba6c11d239aea2f3bed41d87b621.png', import.meta.url).href;

type MoodType = 'happy' | 'calm' | 'relaxed' | 'content' | 'energetic' | 'motivated' | 'grateful' | 
                'okay' | 'normal' | 'focused' | 'bored' | 
                'stressed' | 'anxious' | 'overwhelmed' | 'sad' | 'frustrated' | 'angry' | 'lonely' | 
                'sleepy' | 'tired' | 'exhausted' | 'rested' | 'insomnia' | 
                'depressed' | 'confused' | 'mentally-drained' | 'overthinking';

export function MoodTrackerPage() {
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img 
            src={moodTrackerImage} 
            alt="Mood Tracker - Track your daily mood & view trends" 
            className="w-full h-80 object-cover animate-fade-in"
          />
        </div>
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-[#B4D4D3] via-white to-[#C5B8D8]">
        {/* Charts Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Log Mood Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Log My Mood
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Weekly Mood Trend */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl mb-6 text-gray-900">Weekly Mood Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 50]} label={{ value: 'Mood Score', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#88D8B0" strokeWidth={2} dot={{ fill: '#88D8B0', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-gray-600 mt-2">Last 7 Days</p>
            </Card>

            {/* Emotion Distribution */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl mb-6 text-gray-900">Emotion Distribution</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={emotionDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="emotion" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} label={{ value: 'Frequency %', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="frequency">
                    {emotionDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6B5B95' : '#88D8B0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-gray-600 mt-2">Top 10 Moods</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mood Tracker - Weekly Trend (Alternative View) */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl mb-2 text-gray-900">Mood Tracker</h3>
              <h4 className="text-lg mb-6 text-gray-700">Weekly Mood Trend</h4>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 50]} label={{ value: 'Mood Score/Level', angle: -90, position: 'insideLeft', fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#9B8BC6" strokeWidth={2} dot={{ fill: '#9B8BC6', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-center text-xs text-gray-600 mt-2">Days of the Week</p>
            </Card>

            {/* Mood Breakdown */}
            <Card className="p-6 bg-white">
              <h3 className="text-xl mb-6 text-gray-900">Mood Breakdown</h3>
              <div className="flex items-center justify-center mb-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={moodBreakdownData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {moodBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex gap-6 justify-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#9B8BC6]"></div>
                  <span className="text-sm text-gray-700">Negative ({moodBreakdownData[0].value}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#88D8B0]"></div>
                  <span className="text-sm text-gray-700">Positive ({moodBreakdownData[1].value}%)</span>
                </div>
              </div>
              <div className="flex gap-3 justify-center">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg">
                  View Weekly Report
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-full shadow-lg">
                  Download Data
                </Button>
              </div>
            </Card>
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