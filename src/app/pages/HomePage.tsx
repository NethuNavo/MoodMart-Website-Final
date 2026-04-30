import { Link, useNavigate } from 'react-router-dom';
import { MessageCircle, Camera, TrendingUp, Headphones, Wind, Users, Quote } from 'lucide-react';
import { useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useNotification } from '../context/NotificationContext';
import { useMood } from '../context/MoodContext';
const heroImage = new URL('../../assets/e8741628041c196123a6d53ca1d67a561fc66035.png', import.meta.url).href;
const heroBannerImage = new URL('../../assets/683421661700aa65fdf714555327e8a9830b3ffb.png', import.meta.url).href;
const wellnessDesign = new URL('../../assets/4b30ac2453362cc9d4add552f78ebd7948229050.png', import.meta.url).href;
const guidedBreathingImage = new URL('../../assets/56deb1cbc104300eab46909bff0b6ae29dd296b8.png', import.meta.url).href;
const facialRecognitionImage = new URL('../../assets/8679d179690d05cf96d9ad060eee651464a381ff.png', import.meta.url).href;
const communityForumImage = new URL('../../assets/90621acae070342fba2db6779262061faacbe89a.png', import.meta.url).href;
const moodTrackerImage = new URL('../../assets/dee9378edbd4ba6c11d239aea2f3bed41d87b621.png', import.meta.url).href;
const audioTherapyImage = new URL('../../assets/e2b640b8b8dd6e106e29853af90b36d6d877ec1d.png', import.meta.url).href;
const calmBannerImage = new URL('../../assets/38f2b74273910fa7a9788ab45ec66398595f64b8.png', import.meta.url).href;

export function HomePage() {
  const navigate = useNavigate();
  const { showMoodBasedNotification } = useNotification();
  const { moodEntries } = useMood();

  // Show motivational notification on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      // Get the latest mood entry
      const latestMood = moodEntries[moodEntries.length - 1];
      if (latestMood) {
        showMoodBasedNotification(latestMood.mood, latestMood.stressLevel);
      } else {
        // Show default motivational message
        showMoodBasedNotification('default');
      }
    }, 2000); // Show after 2 seconds

    return () => clearTimeout(timer);
  }, []);

  const quickAccess = [
    {
      icon: <MessageCircle className="h-10 w-10" />,
      title: 'Mood Tracker',
      subtitle: 'Log Your Mood',
      // subtle mint gradient with soft highlight
      bg: 'bg-gradient-to-r from-[#E8F7F2] to-[#DFF6EE]',
      iconColor: 'text-[#0F6B58]',
      link: '/mood'
    },
    {
      icon: <Camera className="h-10 w-10" />,
      title: 'Emotion Scan',
      subtitle: 'Scan Camera',
      // reversed mint gradient for variety
      bg: 'bg-gradient-to-r from-[#DFF6EE] to-[#E8F7F2]',
      iconColor: 'text-[#0F6B58]',
      link: '/face-scan'
    },
  ];

  const wellnessJourney = [
    {
      title: 'Mood Tracker & Insights',
      icon: <TrendingUp className="h-8 w-8" />,
      subtitle: 'View My Reports',
      bg: 'bg-[#8B5CF6]',
      iconColor: 'text-white',
      link: '/mood'
    },
    {
      title: 'Guided Breathing',
      icon: <Wind className="h-8 w-8" />,
      bg: 'bg-[#63A6F0]',
      iconColor: 'text-white',
      link: '/breathing'
    },
    {
      title: 'Audio Therapy',
      icon: <Headphones className="h-8 w-8" />,
      bg: 'bg-[#0F6B58]',
      iconColor: 'text-white',
      link: '/audio'
    },
    {
      title: 'Community Forum',
      icon: <Users className="h-8 w-8" />,
      bg: 'bg-[#0CA588]',
      iconColor: 'text-white',
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
          <img 
            src={calmBannerImage} 
            alt="Unlock Your Inner Calm - Your personal journey to emotional wellness" 
            className="w-full h-80 object-cover animate-fade-in"
          />
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
          <div className="grid md:grid-cols-3 gap-6">
            {quickAccess.map((item, index) => (
              <Card 
                key={index}
                onClick={() => navigate(item.link)}
                className={`p-6 cursor-pointer transition-all duration-300 group hover:-translate-y-2 animate-fade-in border-0 rounded-2xl shadow-md overflow-hidden ${item.bg}`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 p-4 rounded-xl shadow-lg ${item.iconColor || 'text-purple-600'} bg-white/30 group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg text-gray-900 group-hover:text-[#0F6B58] transition-colors font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Daily Motivation */}
            <Card className="p-6 bg-gradient-to-br from-[#E8F7F2] to-[#F6FFF9] rounded-2xl shadow-lg animate-fade-in transition-all duration-300" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-white/90 shadow-sm">
                  <Quote className="h-6 w-6 text-[#0F6B58]" />
                </div>
                <div>
                  <h3 className="text-lg mb-2 text-gray-900 font-semibold">Daily Motivation</h3>
                  <p className="text-sm text-gray-700 mb-2 italic">
                    Wake up to determination, go to bed your satisfaction.
                  </p>
                  <Link to="/mood" className="text-sm text-[#0F6B58] hover:text-[#0F6B58]/90 hover:underline font-medium transition-colors">
                    View My Reports →
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Your Wellness Journey */}
        <section className="mb-12">
          <h2 className="text-2xl mb-6 text-gray-900 animate-slide-in">Your Wellness Journey</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {wellnessJourney.map((item, index) => (
              <Card 
                key={index}
                onClick={() => navigate(item.link)}
                className={`p-8 cursor-pointer transition-all duration-300 group hover:shadow-2xl rounded-2xl overflow-hidden ${item.bg} hover:scale-102`}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <div className="flex flex-col items-start h-full justify-between">
                  <div className="flex items-center justify-center w-14 h-14 rounded-lg mb-4 bg-white/20 shadow-inner">
                    <div className={`${item.iconColor || 'text-purple-600'} text-2xl`}>{item.icon}</div>
                  </div>
                  <div>
                    <h3 className={`${item.iconColor === 'text-white' ? 'text-white' : 'text-gray-900'} text-lg font-semibold mb-2`}>{item.title}</h3>
                    {item.subtitle && <p className={`text-sm ${item.iconColor === 'text-white' ? 'text-white/90' : 'text-[#0F6B58]'} font-medium`}>{item.subtitle}</p>}
                  </div>
                </div>
              </Card>
            ))}
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