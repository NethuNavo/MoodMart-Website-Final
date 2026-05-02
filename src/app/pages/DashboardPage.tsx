import { useMood } from '../context/MoodContext';
import { TrendingUp, Heart, Smile, Calendar, Music, Wind } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
const dashboardHeaderImage = new URL('../../assets/e1299fdd0ff99a6c327fbb27c1d21487c3c0e4dd.png', import.meta.url).href;

export function DashboardPage() {
  const { moodEntries } = useMood();

  const recentEntries = moodEntries.slice(-7);
  const chartData = recentEntries.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    stress: entry.stressLevel,
  }));

  const averageStress = moodEntries.length > 0
    ? (moodEntries.reduce((sum, entry) => sum + entry.stressLevel, 0) / moodEntries.length).toFixed(1)
    : 0;

  const recommendations = [
    {
      title: 'Continue Your Streak',
      description: 'You\'ve logged your mood 7 days in a row! Keep it up!',
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-purple-100 text-purple-600',
      cardBg: 'bg-purple-50',
      cardText: 'text-purple-900'
    },
    {
      title: 'Try Morning Meditation',
      description: 'Based on your stress patterns, a 10-minute morning meditation could help.',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-pink-100 text-pink-600',
      cardBg: 'bg-pink-50',
      cardText: 'text-pink-900'
    },
    {
      title: 'Explore Audio Therapy',
      description: 'Our anxiety relief sessions match your current needs.',
      icon: <Music className="h-6 w-6" />,
      color: 'bg-teal-100 text-teal-600',
      cardBg: 'bg-teal-50',
      cardText: 'text-teal-900'
    },
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-12">
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-teal-500 text-white rounded-2xl p-6 overflow-hidden lux-elevated">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-semibold lux-heading">Welcome Back!</h1>
                  <p className="mt-1 text-purple-100/90">Here's your wellness overview for today</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/25 rounded-full flex items-center justify-center">
                    <Smile className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
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

          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Stress Trend Chart */}
            <Card className="p-6 lg:col-span-2">
                <h2 className="text-2xl mb-6 text-gray-900 lux-heading">Your Wellness Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis domain={[0, 10]} stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="stress" stroke="#9333ea" strokeWidth={3} dot={{ fill: '#9333ea' }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

          </div>

          {/* AI Recommendations */}
          <div className="mt-8">
            <h2 className="text-2xl mb-6 text-gray-900">Personalized Recommendations</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {recommendations.map((rec, index) => (
                <Card key={index} className={`p-6 hover:shadow-lg transition-shadow ${rec.cardBg}`}>
                  <div className={`w-12 h-12 rounded-lg ${rec.color} flex items-center justify-center mb-4`}>
                    {rec.icon}
                  </div>
                  <h3 className={`text-lg mb-2 ${rec.cardText || 'text-gray-900'}`}>{rec.title}</h3>
                  <p className={`text-sm ${rec.cardText ? rec.cardText.replace('-900','-700') : 'text-gray-600'}`}>{rec.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Weekly Insight */}
          <Card className="p-8 mt-8 bg-gradient-to-r from-purple-600 to-teal-600 text-white lux-elevated">
            <div className="text-center">
              <h2 className="text-3xl mb-4 lux-heading">Your Weekly Insight</h2>
              <p className="text-lg mb-6 opacity-90">
                Great progress this week! Your stress levels are trending downward, and you've maintained consistency with mood tracking. Keep using the breathing exercises—they're making a difference!
              </p>

            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}