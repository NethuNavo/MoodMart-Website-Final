import { Link, useNavigate } from 'react-router-dom';
import { Camera, TrendingUp, Headphones, Wind, Users, Smile, Heart } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNotification } from '../context/NotificationContext';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
const heroImage = new URL('../../assets/e8741628041c196123a6d53ca1d67a561fc66035.png', import.meta.url).href;
const heroBannerImage = new URL('../../assets/683421661700aa65fdf714555327e8a9830b3ffb.png', import.meta.url).href;
const wellnessDesign = new URL('../../assets/home motivate.jpg', import.meta.url).href;
const guidedBreathingImage = new URL('../../assets/56deb1cbc104300eab46909bff0b6ae29dd296b8.png', import.meta.url).href;
const facialRecognitionImage = new URL('../../assets/8679d179690d05cf96d9ad060eee651464a381ff.png', import.meta.url).href;
const faceScanImage = new URL('../../assets/face scan.png', import.meta.url).href;
const communityForumImage = new URL('../../assets/90621acae070342fba2db6779262061faacbe89a.png', import.meta.url).href;
const moodTrackerImage = new URL('../../assets/dee9378edbd4ba6c11d239aea2f3bed41d87b621.png', import.meta.url).href;
const audioTherapyImage = new URL('../../assets/e2b640b8b8dd6e106e29853af90b36d6d877ec1d.png', import.meta.url).href;
const calmBannerImage = new URL('../../assets/38f2b74273910fa7a9788ab45ec66398595f64b8.png', import.meta.url).href;

export function HomePage() {
  const navigate = useNavigate();
  const { showMoodBasedNotification } = useNotification();
  const { moodEntries } = useMood();
  const { isRegistered } = useUser();

  // Show motivational notification on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      const latestMood = moodEntries[moodEntries.length - 1];

      if (isRegistered && latestMood) {
        // Logged in user: use mood-based notifications
        showMoodBasedNotification(latestMood.mood, latestMood.stressLevel);
      } else {
        // Guest or no mood data: show normal motivational notifications
        showMoodBasedNotification('default');
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, [isRegistered, moodEntries, showMoodBasedNotification]);

  const quickAccess = [
    {
      icon: <Camera className="h-12 w-12" />,
      title: 'Face Scan',
      subtitle: 'Scan Camera',
      bg: 'bg-[#7C63E9]',
      iconColor: 'text-white',
      link: '/face-scan'
    },
  ];

  const wellnessJourney = [
    {
      title: 'Mood Tracker',
      icon: <TrendingUp className="h-8 w-8" />,
      subtitle: 'Track your emotions, spot patterns, and gain insights to feel your best.',
      cta: 'Track Your Mood',
      bg: 'from-[#E9D5FF] to-[#C4B5FD]',
      iconBg: 'bg-[#7C3AED] text-white',
      link: '/mood'
    },
    {
      title: 'Guided Breathing',
      icon: <Wind className="h-8 w-8" />,
      subtitle: 'Practice calming breathing exercises to reduce stress and find your center.',
      cta: 'Start Breathing',
      bg: 'from-[#DBEAFE] to-[#93C5FD]',
      iconBg: 'bg-[#2563EB] text-white',
      link: '/breathing'
    },
    {
      title: 'Audio Therapy',
      icon: <Headphones className="h-8 w-8" />,
      subtitle: 'Relax with soothing music, meditations, and sounds for a peaceful mind.',
      cta: 'Listen Now',
      bg: 'from-[#D1FAE5] to-[#6EE7B7]',
      iconBg: 'bg-[#047857] text-white',
      link: '/audio'
    },
    {
      title: 'Community Forum',
      icon: <Users className="h-8 w-8" />,
      subtitle: 'Connect with others, share experiences, and support your wellness journey together.',
      cta: 'Join the Community',
      bg: 'from-[#FFEDD5] to-[#FDBA74]',
      iconBg: 'bg-[#C2410C] text-white',
      link: '/community'
    },
  ];

  const featuredProducts = [
    {
      id: '1',
      name: 'Essential Oils',
      image: 'https://images.unsplash.com/photo-1608571424634-58ae03e6edcf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGVzfGVufDF8fHx8MTc2NjAyOTcwN3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '2',
      name: 'Essential Oil',
      image: 'https://images.unsplash.com/photo-1647934174425-61136513aed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3NlbnRpYWwlMjBvaWwlMjBib3R0bGV8ZW58MXx8fHwxNzY1OTIwOTE4fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '3',
      name: 'Journals',
      image: 'https://images.unsplash.com/photo-1597765487956-a0de8b29d44b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwam91cm5hbCUyMGJvb2t8ZW58MXx8fHwxNzY2MDI5NzA2fDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '4',
      name: 'Supplements',
      image: 'https://images.unsplash.com/photo-1714761693838-e58d9b8677cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHN1cHBsZW1lbnRzfGVufDF8fHx8MTc2NjAxODg5M3ww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '5',
      name: 'Journals',
      image: 'https://images.unsplash.com/photo-1594997652537-2e2dce4ebf28?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMGpvdXJuYWwlMjBub3RlYm9va3xlbnwxfHx8fDE3NjU4NjA5OTd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '6',
      name: 'Remedies',
      image: 'https://images.unsplash.com/photo-1722931303388-527993417e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjByZW1lZHklMjBib3R0bGVzfGVufDF8fHx8MTc2NjAyOTcwOHww&ixlib=rb-4.1.0&q=80&w=1080'
    },
    {
      id: '7',
      name: 'Remedies',
      image: 'https://images.unsplash.com/photo-1584389007693-cc2c58dff872?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWxsbmVzcyUyMHRlYSUyMGNvbGxlY3Rpb258ZW58MXx8fHwxNzY1OTQ2NzkxfDA&ixlib=rb-4.1.0&q=80&w=1080'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Meditation Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#B4D4D3] via-white to-[#C5B8D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="overflow-hidden rounded-b-3xl bg-white shadow-sm">
            <img 
              src={calmBannerImage} 
              alt="Unlock Your Inner Calm - Your personal journey to emotional wellness" 
              className="w-full h-auto max-h-[320px] sm:max-h-[420px] object-contain object-center animate-fade-in"
            />
          </div>
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-lavender-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-float" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Main CTA Section Below Hero */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-800 animate-slide-in">
              Begin Your Wellness Journey Today
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              Discover peace, track your emotions, and connect with a supportive community dedicated to mental wellness.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              onClick={() => navigate('/mood')}
              className="lux-btn-primary px-12 py-6 text-lg animate-pulse-glow"
            >
              Start Your Wellness Journey
            </Button>
            <Button 
              onClick={() => navigate('/shop')}
              className="lux-btn-primary px-12 py-6 text-lg"
            >
              Explore Wellness Shop
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Access */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-gray-900 animate-slide-in">Quick Access</h2>
          <div className="rounded-[2rem] bg-[#7C63E9]/10 p-4">
            <Card
              onClick={() => navigate('/face-scan')}
              className="relative overflow-hidden p-6 md:p-8 rounded-[1.75rem] shadow-2xl bg-gradient-to-br from-[#8157F8] via-[#A178FF] to-[#D8ABFF] text-white"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.35),_transparent_35%)] opacity-70 pointer-events-none" />
              <div className="relative grid gap-6 lg:grid-cols-[1.2fr_0.9fr] items-center">
                <div className="space-y-5">
                  <span className="inline-flex rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/90 border border-white/20">
                    Featured Tool
                  </span>
                  <h3 className="text-4xl md:text-5xl font-semibold tracking-tight">Face Scan</h3>
                  <p className="text-base md:text-lg text-white/85 max-w-xl leading-relaxed">
                    Scan Camera with a free personalized emotional blueprint to help you discover emotional patterns.
                  </p>

                  <button
                    onClick={() => navigate('/face-scan')}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#4B3DCB] shadow-lg shadow-white/20 transition hover:bg-white/90"
                  >
                    Try on your new Face Scan →
                  </button>
                </div>

                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-full max-w-sm">
                    <img
                      src={faceScanImage}
                      alt="Face Scan Illustration"
                      className="w-full h-auto rounded-[1.75rem] object-cover shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Your Wellness Journey */}
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-purple-600 font-semibold mb-4">Your Wellness Journey</p>
            <h2 className="text-4xl md:text-5xl font-semibold text-slate-900 mb-4">Your Wellness Journey</h2>
            <p className="text-base md:text-lg text-slate-600">
              Explore personalized tools and activities designed to support your mental well-being every step of the way.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {wellnessJourney.map((item, index) => (
              <Card
                key={index}
                onClick={() => navigate(item.link)}
                className={`rounded-[2rem] overflow-hidden p-8 cursor-pointer transition-all duration-300 shadow-xl hover:-translate-y-1 bg-gradient-to-br ${item.bg}`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex h-full flex-col justify-between">
                  <div>
                    <div className={`inline-flex items-center justify-center rounded-3xl p-4 mb-6 ${item.iconBg}`}>
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                    <p className="text-sm text-slate-600 mb-8 leading-7">{item.subtitle}</p>
                  </div>
                  <button className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100">
                    {item.cta}
                  </button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-10 rounded-[2rem] border border-purple-200/70 bg-gradient-to-r from-white via-purple-50 to-teal-50 p-8 shadow-2xl ring-1 ring-purple-100/70 flex flex-col gap-8 lg:flex-row lg:items-center">
            <div className="flex-1">
              <p className="text-sm uppercase tracking-[0.3em] text-purple-800 font-semibold mb-4">Daily encouragement</p>
              <p className="text-3xl md:text-4xl font-semibold text-slate-900 leading-tight">
                Small steps every day lead to big changes. You’ve got this! ♡
              </p>
              <p className="mt-4 text-sm md:text-base text-slate-600 max-w-xl">
                Relax, reflect, and keep moving forward with gentle support from your wellness tools and community.
              </p>
            </div>
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <ImageWithFallback
                src={wellnessDesign}
                alt="Wellness illustration"
                className="w-full h-auto rounded-[2rem] object-cover shadow-2xl border border-white/80"
              />
            </div>
          </div>
        </section>

        {/* Featured Wellness Tools */}
        <section>
          <h2 className="text-2xl mb-6 text-gray-900 animate-slide-in">Featured Wellness Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {featuredProducts.map((product, index) => (
              <Card 
                key={product.id}
                onClick={() => navigate('/shop')}
                className="relative overflow-hidden cursor-pointer transition-all duration-300 bg-white group rounded-xl shadow-sm hover:shadow-lg"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="aspect-square overflow-hidden rounded-t-xl bg-gradient-to-br from-purple-100 to-teal-100">
                  <ImageWithFallback
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm text-center text-gray-800 group-hover:text-[#0F6B58] transition-colors font-medium">{product.name}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}