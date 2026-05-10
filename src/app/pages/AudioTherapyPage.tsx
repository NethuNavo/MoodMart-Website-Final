import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Play, Pause, SkipForward, SkipBack, Volume2, Clock, Headphones, Search } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
const headerBg = new URL('../../assets/a29c988cecf7518aefa1051e53ffc3b671037802.png', import.meta.url).href;
const audioTherapyImage = new URL('../../assets/e2b640b8b8dd6e106e29853af90b36d6d877ec1d.png', import.meta.url).href;
const calmCoverImage = new URL('../../assets/calm.jpg', import.meta.url).href;
const anxietyCoverImage = new URL('../../assets/images.jpg', import.meta.url).href;

export function AudioTherapyPage() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(70);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = [
    {
      id: 1,
      title: 'Ocean Waves for Relaxation',
      category: 'Stress Relief',
      duration: '15:00',
      description: 'Gentle ocean sounds to calm your mind and reduce stress',
      color: 'from-blue-400 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1661953029179-e1b0dc900490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmVhY2h8ZW58MXx8fHwxNzY2Mzc2MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      audioUrl: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce99.mp3'
    },
    {
      id: 2,
      title: 'Forest Ambience',
      category: 'Meditation',
      duration: '20:00',
      description: 'Peaceful forest sounds for deep meditation',
      color: 'from-purple-400 to-purple-500',
      image: 'https://images.unsplash.com/photo-1656783208368-a7d176736535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjB0cmVlc3xlbnwxfHx8fDE3NjYzMDYxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      audioUrl: 'public/audio/audiopapkin-forest-ambience-296528.mp3'
    },
    {
      id: 3,
      title: 'Calm & Centered',
      category: 'Meditation',
      duration: '5:24',
      description: 'A gentle track to maintain balance and inner peace.',
      color: 'from-slate-400 to-slate-500',
      image: calmCoverImage,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 4,
      title: 'Anxiety Relief Meditation',
      category: 'Anxiety',
      duration: '12:00',
      description: 'Guided meditation specifically designed for anxiety management',
      color: 'from-purple-400 to-pink-500',
      image: anxietyCoverImage,
      audioUrl: 'public/audio/Mindfulness+for+Anxiety+and+Stress.mp3'
    },
    {
      id: 5,
      title: 'Sleep Soundly',
      category: 'Sleep',
      duration: '30:00',
      description: 'Soothing sounds to help you fall asleep naturally',
      color: 'from-indigo-400 to-purple-500',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      audioUrl: 'public/audio/kontraa-no-sleep-hiphop-music-473847.mp3'
    },
    {
      id: 6,
      title: 'Depression Support',
      category: 'Depression',
      duration: '18:00',
      description: 'Uplifting guided meditation for managing depression',
      color: 'from-yellow-400 to-orange-500',
      image: 'https://images.unsplash.com/photo-1545500425-a514ded6a000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwcGVhY2VmdWwlMjBuYXR1cmV8ZW58MXx8fHwxNzY2Mzc2MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      audioUrl: 'public/audio/intensity-by-audio-club-intensity-by-audio-club-343637.mp3'
    },
    {
      id: 7,
      title: 'Rain & Thunder',
      category: 'Stress Relief',
      duration: '25:00',
      description: 'Natural rain and distant thunder for ultimate relaxation',
      color: 'from-gray-400 to-slate-500',
      image: 'https://images.unsplash.com/photo-1664976694406-3e9f37768a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwc3Rvcm0lMjBjbG91ZHN8ZW58MXx8fHwxNzY2Mzc2MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      audioUrl: 'public/audio/johnbritton-thunder-156423.mp3'
    },
    {
      id: 8,
      title: 'Mindful Morning',
      category: 'Wellness',
      duration: '18:32',
      description: 'A gentle audio experience to start your day grounded and calm.',
      color: 'from-emerald-400 to-sky-500',
      image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      audioUrl: 'public/audio/creative_spark-morning-birdsong-246402.mp3'
    },
    {
      id: 9,
      title: 'Deep Breath Journey',
      category: 'Meditation',
      duration: '22:18',
      description: 'Breathing cues and soft soundscapes for deep relaxation and focus.',
      color: 'from-blue-400 to-indigo-500',
      image: new URL('../../assets/deep.jpg', import.meta.url).href,
      audioUrl: 'public/audio/white_records-breath-of-autumn-instrumental-background-music-for-video-46-sec-487275 (1).mp3'
    },
    {
      id: 10,
      title: 'Nighttime Calm',
      category: 'Sleep',
      duration: '28:40',
      description: 'Soft ambient tones and lullaby waves to wind down your evening.',
      color: 'from-slate-400 to-slate-600',
      image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      audioUrl: 'public/audio/freesound_community-calm-music-64526.mp3'
    },
    {
      id: 11,
      title: 'Mental Wellness Soundscape',
      category: 'Wellness',
      duration: '20:00',
      description: 'A soothing soundscape designed to support mental clarity and emotional balance.',
      color: 'from-teal-400 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      audioUrl: 'public/audio/joelfazhari-aquarium-ambience-sounds-10-min-193236.mp3'
    },
  ];

  const categories = ['All', 'Stress Relief', 'Anxiety', 'Depression', 'Sleep', 'Meditation', 'Wellness'];
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const targetTrackId = Number(params.get('track'));
    if (!Number.isNaN(targetTrackId)) {
      const targetIndex = tracks.findIndex((track) => track.id === targetTrackId);
      if (targetIndex !== -1) {
        setCurrentTrack(targetIndex);
      }
    }
  }, [location.search]);

  const filteredTracks = tracks.filter((track) => {
    const matchesCategory = selectedCategory === 'All' || track.category === selectedCategory;
    const matchesSearch = searchTerm.trim() === '' ||
      track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      track.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume / 100;
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      });
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.src = tracks[currentTrack].audioUrl;
      audio.load();
      if (isPlaying) {
        audio.play();
      }
    }
  }, [currentTrack, isPlaying]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const handlePrevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (audio) {
      const bounds = e.currentTarget.getBoundingClientRect();
      const clickX = e.clientX - bounds.left;
      const width = bounds.width;
      const percentage = clickX / width;
      audio.currentTime = percentage * audio.duration;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Audio Element */}
      <audio ref={audioRef} />
      
      {/* Header Section - Beautiful Audio Therapy Design */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ImageWithFallback 
            src={audioTherapyImage} 
            alt="Audio Therapy - Listen to curated audio sessions for peace and relaxation" 
            className="w-full h-72 sm:h-96 object-cover animate-fade-in"
          />
        </div>
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Current Player */}
        <div className="relative text-white p-8 mb-8 lux-elevated overflow-hidden rounded-xl" style={{ backgroundColor: 'rgba(15, 23, 42, 0.95)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/70 via-slate-900/30 to-slate-800/70 pointer-events-none" />
          <div className="relative grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] items-center">
            <div className="overflow-hidden rounded-3xl bg-white/10 ring-1 ring-white/10 shadow-2xl">
              <ImageWithFallback
                src={tracks[currentTrack].image}
                alt={`${tracks[currentTrack].title} cover image`}
                className="w-full h-full object-cover min-h-[320px]"
              />
            </div>
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/70 mb-3">{tracks[currentTrack].category}</p>
                <h2 className="text-4xl font-semibold leading-tight">{tracks[currentTrack].title}</h2>
                <p className="mt-4 max-w-2xl text-white/80">{tracks[currentTrack].description}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 rounded-full h-2 mb-2 cursor-pointer" onClick={handleProgressClick}>
                  <div className="bg-white rounded-full h-2" style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}></div>
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>{formatTime(currentTime)}</span>
                  <span>{tracks[currentTrack].duration}</span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-center space-x-6">
                  <button className="hover:scale-110 transition-transform" onClick={handlePrevTrack}>
                    <SkipBack className="w-8 h-8 text-white" />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="w-16 h-16 bg-white text-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg lux-btn"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                  <button className="hover:scale-110 transition-transform" onClick={handleNextTrack}>
                    <SkipForward className="w-8 h-8 text-white" />
                  </button>
                </div>
                <div className="flex items-center space-x-4 max-w-md">
                  <Volume2 className="w-5 h-5 text-white/70" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-2 bg-white bg-opacity-30 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-white/70">{volume}%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter and Search */}
        <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`lux-btn cursor-pointer ${selectedCategory === category ? 'lux-btn-primary' : ''}`}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="w-full max-w-sm">
            <label className="sr-only" htmlFor="track-search">Search tracks</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className="w-5 h-5 text-purple-600" />
              </div>
              <input
                id="track-search"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search audio tracks..."
                className="w-full rounded-3xl border border-gray-200 bg-white px-12 py-3 text-sm text-slate-700 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>
        </div>

        {/* Track List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => setCurrentTrack(index)}
              className={`bg-white rounded-xl overflow-hidden text-left hover:shadow-xl transition-all hover:scale-105 cursor-pointer ${
                currentTrack === index ? 'ring-2 ring-purple-500' : ''
              } lux-elevated`}
            >
              <div className="relative w-full h-48 overflow-hidden">
                <ImageWithFallback
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-purple-600 ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="inline-block px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-sm mb-2">
                  {track.category}
                </span>
                <h3 className="mb-2 lux-heading">{track.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{track.description}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{track.duration}</span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-100 to-pink-100 p-8 lux-elevated">
          <h2 className="mb-6 text-center">Benefits of Audio Therapy</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center lux-elevated">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                💆
              </div>
              <h3 className="mb-2 lux-heading">Reduces Stress</h3>
              <p className="text-gray-600">Calming sounds lower cortisol levels and promote relaxation</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center lux-elevated">
              <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                😴
              </div>
              <h3 className="mb-2 lux-heading">Improves Sleep</h3>
              <p className="text-gray-600">Natural soundscapes help you fall asleep faster and sleep deeper</p>
            </div>
            <div className="bg-white rounded-lg p-6 text-center lux-elevated">
              <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center mx-auto mb-4">
                🧘
              </div>
              <h3 className="mb-2 lux-heading">Enhances Focus</h3>
              <p className="text-gray-600">Guided meditations improve concentration and mental clarity</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}