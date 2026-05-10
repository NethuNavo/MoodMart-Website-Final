import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Scan, AlertCircle, Smile, Frown, Meh, AlertTriangle, CloudRain, ThumbsDown, Zap, Music } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { useUser } from '../context/UserContext';
import { useMood } from '../context/MoodContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import facialRecognitionImage from "../../assets/facial-recognition.png";
import calmCoverImage from "../../assets/calm.jpg";

export function FaceScanPage() {
  const { isGuest, isRegistered } = useUser();
  const navigate = useNavigate();
  const { addToCart, products } = useMood();
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Track guest scans
  const [hasUsedGuestScan, setHasUsedGuestScan] = useState(() => {
    return localStorage.getItem('faceScanGuestUsed') === 'true';
  });

  const [isScanning, setIsScanning] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showWebcam, setShowWebcam] = useState(true);

  const handleRequestCamera = () => {
    setCameraError(null);
    setIsCameraReady(false);
    setIsDemoMode(false);
    setShowWebcam(false);
    // Trigger re-render to request camera again
    setTimeout(() => setShowWebcam(true), 100);
  };

  const [emotions, setEmotions] = useState([
    { name: 'Neutral', percentage: 100, icon: <Meh className="w-5 h-5" />, largeIcon: <Meh className="w-12 h-12 text-gray-500" />, color: 'text-gray-500', barColor: 'bg-gray-500', description: 'You seem calm and balanced right now.' },
    { name: 'Happy', percentage: 0, icon: <Smile className="w-5 h-5" />, largeIcon: <Smile className="w-12 h-12 text-amber-500" />, color: 'text-amber-500', barColor: 'bg-amber-500', description: 'You seem happy! Keep smiling!' },
    { name: 'Sad', percentage: 0, icon: <CloudRain className="w-5 h-5" />, largeIcon: <CloudRain className="w-12 h-12 text-blue-500" />, color: 'text-blue-500', barColor: 'bg-blue-500', description: 'You seem a bit down. Maybe try a breathing exercise?' },
    { name: 'Angry', percentage: 0, icon: <Frown className="w-5 h-5" />, largeIcon: <Frown className="w-12 h-12 text-red-500" />, color: 'text-red-500', barColor: 'bg-red-500', description: 'You seem frustrated. Take a moment to pause.' },
    { name: 'Fearful', percentage: 0, icon: <AlertTriangle className="w-5 h-5" />, largeIcon: <AlertTriangle className="w-12 h-12 text-purple-500" />, color: 'text-purple-500', barColor: 'bg-purple-500', description: 'You seem anxious. Everything will be okay.' },
    { name: 'Disgusted', percentage: 0, icon: <ThumbsDown className="w-5 h-5" />, largeIcon: <ThumbsDown className="w-12 h-12 text-green-500" />, color: 'text-green-500', barColor: 'bg-green-500', description: 'Something seems off. Stay positive.' },
    { name: 'Surprised', percentage: 0, icon: <Zap className="w-5 h-5" />, largeIcon: <Zap className="w-12 h-12 text-pink-500" />, color: 'text-pink-500', barColor: 'bg-pink-500', description: 'You seem surprised! Hope it\'s good news.' },
  ]);

  const [dominantEmotion, setDominantEmotion] = useState(emotions[0]);
  const [currentMood, setCurrentMood] = useState(emotions[0]);
  const [selectedManualMood, setSelectedManualMood] = useState('Neutral');
  const [moodNote, setMoodNote] = useState('');

  const moodAudioTracks: Record<string, { title: string; description: string; duration: string; src: string; image: string }> = {
    Neutral: {
      title: 'Calm & Centered',
      description: 'A gentle track to maintain balance and inner peace.',
      duration: '5:24',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: calmCoverImage,
    },
    Happy: {
      title: 'Uplifting Morning',
      description: 'Bright and joyful sounds to match your good mood.',
      duration: '4:48',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?w=800&q=80',
    },
    Sad: {
      title: 'Gentle Rain Reflection',
      description: 'Soft ambient tones to help ease heavy feelings.',
      duration: '6:02',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    },
    Angry: {
      title: 'Soothing Release',
      description: 'Calming rhythms to soften tension and help reset.',
      duration: '4:35',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80',
    },
    Fearful: {
      title: 'Breath of Calm',
      description: 'Slow meditative audio to steady your breath and mind.',
      duration: '5:10',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: 'https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?w=800&q=80',
    },
    Disgusted: {
      title: 'Refreshing Reset',
      description: 'A cleansing track to help move toward a lighter mood.',
      duration: '4:55',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: 'https://images.unsplash.com/photo-1485241317846-8a92f53dbfda?w=800&q=80',
    },
    Surprised: {
      title: 'Bright Awakening',
      description: 'An energizing audio track for unexpected moments.',
      duration: '4:18',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      image: 'https://images.unsplash.com/photo-1511376777868-611b54f68947?w=800&q=80',
    },
  };

  const productRecommendations: Record<string, Array<{ name: string; price: string; rating: string; label: string; image?: string }>> = {
    Neutral: [
      {
        name: 'Lavender Essential Oil',
        price: '$18.00',
        rating: '4.6 (120)',
        label: 'Calming blend',
        image: 'https://images.unsplash.com/photo-1647934174425-61136513aed7?w=400&h=300&fit=crop',
      },
      {
        name: 'Gratitude Journal',
        price: '$16.00',
        rating: '4.8 (90)',
        label: 'Daily reflection',
        image: '/gratitude.png',
      },
      {
        name: 'Aromatherapy Candle',
        price: '$22.00',
        rating: '4.7 (76)',
        label: 'Soothing scent',
        image: 'https://images.unsplash.com/photo-1509482560494-4126c5d30c8f?w=400&h=300&fit=crop',
      },
      {
        name: 'Mindful Living Book',
        price: '$15.00',
        rating: '4.5 (62)',
        label: 'Wellness guide',
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
      },
    ],
    Happy: [
      { name: 'Joyful Bath Salts', price: '$14.00', rating: '4.9 (82)', label: 'Mood booster' },
      { name: 'Bloom Diffuser', price: '$24.00', rating: '4.7 (71)', label: 'Bright aroma' },
      { name: 'Sparkling Tea Set', price: '$20.00', rating: '4.8 (60)', label: 'Uplifting ritual' },
      { name: 'Happy Notes Journal', price: '$17.00', rating: '4.6 (53)', label: 'Positive prompts' },
    ],
    Sad: [
      { name: 'Comfort Tea', price: '$12.00', rating: '4.7 (54)', label: 'Warm support' },
      { name: 'Healing Candle', price: '$19.00', rating: '4.6 (48)', label: 'Soft glow' },
      { name: 'Hope Journal', price: '$18.00', rating: '4.5 (36)', label: 'Gentle prompts' },
      { name: 'Cozy Wrap', price: '$28.00', rating: '4.8 (42)', label: 'Soft comfort' },
    ],
    Angry: [
      { name: 'Stress Relief Balm', price: '$13.00', rating: '4.6 (38)', label: 'Cooling support' },
      { name: 'Grounding Stones', price: '$21.00', rating: '4.7 (44)', label: 'Stability kit' },
      { name: 'Calm Down Candle', price: '$20.00', rating: '4.6 (39)', label: 'Slow burn' },
      { name: 'Deep Breath Mist', price: '$15.00', rating: '4.5 (31)', label: 'Instant reset' },
    ],
    Fearful: [
      { name: 'Peace Blend Oil', price: '$18.00', rating: '4.7 (45)', label: 'Anxiety ease' },
      { name: 'Safe Space Journal', price: '$19.00', rating: '4.8 (50)', label: 'Secure voice' },
      { name: 'Night Light Candle', price: '$23.00', rating: '4.6 (38)', label: 'Gentle glow' },
      { name: 'Deep Breath Mist', price: '$15.00', rating: '4.5 (32)', label: 'Soothing spray' },
    ],
    Disgusted: [
      { name: 'Fresh Linen Spray', price: '$12.00', rating: '4.6 (29)', label: 'Clean reset' },
      { name: 'Detox Tea', price: '$13.00', rating: '4.5 (34)', label: 'Refresh blend' },
      { name: 'Balance Journal', price: '$17.00', rating: '4.7 (30)', label: 'Mood reset' },
      { name: 'Citrus Candle', price: '$20.00', rating: '4.6 (27)', label: 'Bright energy' },
    ],
    Surprised: [
      { name: 'Discovery Notebook', price: '$16.00', rating: '4.7 (28)', label: 'New ideas' },
      { name: 'Spark Candle', price: '$22.00', rating: '4.8 (33)', label: 'Bright scent' },
      { name: 'Mood Booster Drops', price: '$14.00', rating: '4.6 (25)', label: 'Instant lift' },
      { name: 'Morning Glow Tea', price: '$15.00', rating: '4.5 (24)', label: 'Fresh energy' },
    ],
  };

  // Map moods to product IDs from the shop
  const moodProductIds: Record<string, string[]> = {
    Neutral: ['1', '5', '6', '7'],
    Happy: ['8', '4', '1', '5'],
    Sad: ['1', '5', '7', '3'],
    Angry: ['6', '4', '3', '8'],
    Fearful: ['5', '1', '7', '4'],
    Disgusted: ['6', '7', '5', '1'],
    Surprised: ['1', '5', '2', '7'],
  };

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(`${product.name} added to cart!`, {
      description: 'Click to view your cart',
      duration: 3000,
      action: {
        label: 'View Cart',
        onClick: () => navigate('/cart'),
      },
    });
  };

  const moodOptions = [
    { name: 'Neutral', icon: <Meh className="w-5 h-5" />, color: 'border-purple-300 bg-purple-50 text-purple-800', bg: 'bg-purple-100 text-purple-800' },
    { name: 'Happy', icon: <Smile className="w-5 h-5" />, color: 'border-amber-300 bg-amber-50 text-amber-800', bg: 'bg-amber-100 text-amber-800' },
    { name: 'Sad', icon: <CloudRain className="w-5 h-5" />, color: 'border-blue-300 bg-blue-50 text-blue-800', bg: 'bg-blue-100 text-blue-800' },
    { name: 'Angry', icon: <Frown className="w-5 h-5" />, color: 'border-red-300 bg-red-50 text-red-800', bg: 'bg-red-100 text-red-800' },
    { name: 'Fearful', icon: <AlertTriangle className="w-5 h-5" />, color: 'border-violet-300 bg-violet-50 text-violet-800', bg: 'bg-violet-100 text-violet-800' },
    { name: 'Disgusted', icon: <ThumbsDown className="w-5 h-5" />, color: 'border-emerald-300 bg-emerald-50 text-emerald-800', bg: 'bg-emerald-100 text-emerald-800' },
    { name: 'Surprised', icon: <Zap className="w-5 h-5" />, color: 'border-pink-300 bg-pink-50 text-pink-800', bg: 'bg-pink-100 text-pink-800' },
  ];

  const updateCurrentMood = (moodName: string) => {
    const newMood = emotions.find((emotion) => emotion.name === moodName) || emotions[0];
    setCurrentMood(newMood);
    setDominantEmotion(newMood);
    setEmotions((prev) => prev.map((emotion) => ({
      ...emotion,
      percentage: emotion.name === moodName ? 100 : 0,
    })));
  };

  const handleSaveManualMood = () => {
    updateCurrentMood(selectedManualMood);
    setMoodNote('');
    toast.success(`Logged mood as ${selectedManualMood}`);
  };

  const currentAudioTrack = moodAudioTracks[currentMood.name] || moodAudioTracks.Neutral;
  
  // Get recommended products for current mood
  const recommendedProductIds = moodProductIds[currentMood.name] || moodProductIds.Neutral;
  const currentProducts = recommendedProductIds
    .map(id => products.find(p => p.id === id))
    .filter(p => p !== undefined);
  
  const sortedEmotions = [...emotions].sort((a, b) => b.percentage - a.percentage);

  const handleScan = useCallback(() => {
    // Check if guest has already used their free scan
    if (isGuest && hasUsedGuestScan) {
      setShowAuthPrompt(true);
      return;
    }

    setIsScanning(true);
    setShowResult(false);
    
    // Simulate scanning delay
    setTimeout(() => {
      // Create a new array for updated emotions
      const newEmotions = emotions.map(e => ({...e, percentage: 0}));
      
      // Randomly pick a dominant emotion index (0 to length-1)
      const dominantIndex = Math.floor(Math.random() * newEmotions.length);
      
      // Assign high percentage (60-90%)
      let remaining = 100;
      const dominantVal = Math.floor(Math.random() * 31) + 60; 
      newEmotions[dominantIndex].percentage = dominantVal;
      remaining -= dominantVal;
      
      // Distribute remaining among others
      const otherIndices = newEmotions.map((_, i) => i).filter(i => i !== dominantIndex);
      
      // Shuffle indices to distribute randomly
      for (let i = otherIndices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [otherIndices[i], otherIndices[j]] = [otherIndices[j], otherIndices[i]];
      }
      
      otherIndices.forEach((idx, i) => {
        if (i === otherIndices.length - 1) {
          newEmotions[idx].percentage = remaining;
        } else {
          const val = Math.floor(Math.random() * (remaining / 2));
          newEmotions[idx].percentage = val;
          remaining -= val;
        }
      });
      
      // Update state
      setEmotions(newEmotions);
      setDominantEmotion(newEmotions[dominantIndex]);
      setCurrentMood(newEmotions[dominantIndex]);
      
      setIsScanning(false);
      setShowResult(true);

      // Mark guest scan as used
      if (isGuest) {
        setHasUsedGuestScan(true);
        localStorage.setItem('faceScanGuestUsed', 'true');
      }
    }, 2000);
  }, [isGuest, hasUsedGuestScan, emotions]);


  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header Section */}
      <section className="relative h-80 overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative h-full">
           {/* Background Image Layer */}
           <div className="absolute inset-0 z-0">
             <img 
               src={facialRecognitionImage} 
               alt="Facial Recognition Banner" 
               className="w-full h-full object-cover"
             />
           </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column: Camera Feed */}
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-purple-50">
                <div className="bg-[#0f172a] rounded-xl aspect-[4/3] flex flex-col items-center justify-center relative overflow-hidden mb-6">
                    {!isDemoMode && !cameraError ? (
                        showWebcam && (
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="absolute inset-0 w-full h-full object-cover"
                                videoConstraints={{ facingMode: "user" }}
                                onUserMedia={() => setIsCameraReady(true)}
                                onUserMediaError={(err) => {
                                    // Quietly handle the error without cluttering the console
                                    setCameraError("Unable to access camera. Please check your permissions.");
                                }}
                            />
                        )
                    ) : isDemoMode ? (
                        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                            <div className="text-center opacity-50">
                                <Smile className="w-24 h-24 mx-auto mb-4 text-purple-400" />
                                <p className="text-white text-lg font-medium">Demo Mode Active</p>
                                <p className="text-sm text-gray-400">Simulating camera feed</p>
                            </div>
                        </div>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1e293b] text-gray-400 z-10 p-8 text-center">
                            {/* Red Circle with Exclamation */}
                            <div className="w-20 h-20 rounded-full border-4 border-red-500 flex items-center justify-center mb-6">
                                <AlertCircle className="w-10 h-10 text-red-500" />
                            </div>
                            
                            <h3 className="text-2xl font-bold text-white mb-3">Camera Access Denied</h3>
                            <p className="text-gray-400 text-base mb-3 max-w-md">
                                Unable to access camera. Please check your permissions.
                            </p>
                            
                            {/* Instructions */}
                            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 max-w-md text-left">
                                <p className="text-sm text-gray-300 mb-2 font-semibold">To enable camera:</p>
                                <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                                    <li>Click the lock/camera icon in your browser's address bar</li>
                                    <li>Change camera permissions to "Allow"</li>
                                    <li>Click "Try Again" below to request access</li>
                                </ol>
                            </div>
                            
                            <div className="flex gap-4">
                                <Button 
                                    variant="outline" 
                                    size="lg"
                                    className="bg-transparent text-white border-2 border-gray-600 hover:bg-gray-700 hover:border-gray-500 px-8 py-6 text-base font-semibold rounded-xl"
                                    onClick={handleRequestCamera}
                                >
                                    <Camera className="w-5 h-5 mr-2" />
                                    Try Again
                                </Button>
                                <Button 
                                    size="lg"
                                    className="bg-purple-600 text-white hover:bg-purple-700 border-none px-8 py-6 text-base font-semibold rounded-xl"
                                    onClick={() => {
                                        setCameraError(null);
                                        setIsDemoMode(true);
                                        setIsCameraReady(true);
                                    }}
                                >
                                    Use Demo Mode
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {!isCameraReady && !cameraError && !isDemoMode && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f172a] text-gray-400 z-10">
                            <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">Waiting for camera...</p>
                        </div>
                    )}

                    {isScanning && (!cameraError || isDemoMode) && (
                        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 animate-[scan_2s_linear_infinite] shadow-[0_0_10px_#a855f7] z-20"></div>
                    )}
                    
                    {/* Corner accents similar to the image */}
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-gray-600 rounded-tl-lg z-20"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-gray-600 rounded-tr-lg z-20"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-gray-600 rounded-bl-lg z-20"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-gray-600 rounded-br-lg z-20"></div>
                </div>

                <div className="flex flex-col items-center gap-4">
                    <Button 
                        onClick={handleScan}
                        disabled={(!isDemoMode && (!!cameraError || !isCameraReady))}
                        className={`px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all active:scale-95 ${
                            (!isDemoMode && (!!cameraError || !isCameraReady))
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                            : 'bg-[#a855f7] hover:bg-[#9333ea] text-white shadow-purple-200'
                        }`}
                    >
                        <Scan className="w-5 h-5 mr-2" />
                        {isScanning ? 'Scanning...' : 'Start Scan'}
                    </Button>
                </div>
            </div>

            {/* Right Column: Scan Results */}
            <div className="bg-white rounded-3xl p-8 shadow-xl shadow-purple-50 border border-gray-50">
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        {dominantEmotion.largeIcon || <Meh className="w-12 h-12 text-gray-500" />}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">{dominantEmotion.name}</h2>
                    <p className="text-gray-500">{dominantEmotion.description}</p>
                </div>

                <div className="space-y-6">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Emotion Breakdown</h3>
                    
                    <div className="space-y-4">
                        {sortedEmotions.map((emotion) => (
                            <div key={emotion.name} className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gray-50 ${emotion.color}`}>
                                    {emotion.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">{emotion.name}</span>
                                        <span className="text-sm font-bold text-gray-900">{emotion.percentage}%</span>
                                    </div>
                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full ${emotion.barColor} rounded-full transition-all duration-1000`} 
                                            style={{ width: `${emotion.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

        <div className="grid xl:grid-cols-[1.4fr_1fr] gap-8 mb-12">
          <Card className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-50 border border-gray-50">
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-gray-400 font-semibold">Recommended Audio</p>
                  <h3 className="text-2xl font-bold text-gray-900">For your current mood</h3>
                </div>
                <div className="rounded-2xl bg-purple-100 px-4 py-2 text-purple-700 text-sm font-semibold">
                  {currentMood.name}
                </div>
              </div>

              <div className="rounded-3xl border border-gray-200 p-6 bg-slate-50">
                <div className="grid gap-6 md:grid-cols-[220px_1fr] items-start">
                  <div className="overflow-hidden rounded-3xl bg-slate-100 shadow-inner shadow-slate-100">
                    <ImageWithFallback
                      src={currentAudioTrack.image}
                      alt={`${currentAudioTrack.title} cover`}
                      className="h-full w-full object-cover min-h-[220px]"
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm uppercase tracking-[0.24em] text-gray-400 font-semibold">
                      <Music className="w-4 h-4" />
                      Recommended Audio
                    </div>
                    <div>
                      <h4 className="text-2xl font-semibold text-gray-900">{currentAudioTrack.title}</h4>
                      <p className="mt-2 text-sm text-gray-500 max-w-xl">{currentAudioTrack.description}</p>
                      <p className="mt-3 text-sm font-medium text-gray-700">Duration: {currentAudioTrack.duration}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-3xl bg-white p-4 shadow-sm shadow-gray-200">
                <audio controls className="w-full rounded-3xl" src={currentAudioTrack.src} />
              </div>
            </div>
          </Card>

          <Card className="bg-white p-8 rounded-3xl shadow-xl shadow-purple-50 border border-gray-50">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400 font-semibold">Your Mood Log</p>
              <h3 className="text-2xl font-bold text-gray-900">Manual Mood Entry</h3>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {moodOptions.map((option) => (
                  <button
                    key={option.name}
                    type="button"
                    onClick={() => setSelectedManualMood(option.name)}
                    className={`rounded-3xl border p-6 text-center transition flex flex-col items-center justify-center gap-3 min-h-[160px] ${
                      selectedManualMood === option.name
                        ? `${option.color} shadow-lg`
                        : `border-gray-200 bg-white text-gray-700 hover:border-purple-400 hover:bg-purple-50`
                    }`}
                  >
                    <span className={`rounded-full p-3 ${option.bg}`}>
                      {option.icon}
                    </span>
                    <span className="text-sm font-semibold">{option.name}</span>
                    <p className="text-xs text-gray-500">Tap to select</p>
                  </button>
                ))}
              </div>

              <div>
                <textarea
                  value={moodNote}
                  onChange={(event) => setMoodNote(event.target.value)}
                  className="w-full rounded-3xl border border-gray-200 p-4 text-sm text-gray-700 focus:border-purple-500 focus:ring-purple-100"
                  rows={4}
                  placeholder="How are you feeling?"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={handleSaveManualMood} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-4 rounded-3xl">
                  Save Mood
                </Button>
                <div>
                  <p className="text-sm text-gray-500">Current mood will update product and audio recommendations.</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <section className="mb-12">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-gray-400 font-semibold">Handpicked Products</p>
              <h3 className="text-2xl font-bold text-gray-900">Handpicked Products For You</h3>
            </div>
            <p className="text-sm text-gray-500">Mood: {currentMood.name}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentProducts.map((item) => (
              <div key={item?.id} className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="h-44 overflow-hidden bg-gray-100">
                  <ImageWithFallback
                    src={item?.image || 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&h=300&fit=crop'}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-2">{item?.name}</p>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2">{item?.description ?? ''}</p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-purple-600">Rs.{typeof item?.price === 'number' ? item.price.toFixed(2) : item?.price}</span>
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2"
                      onClick={() => item && handleAddToCart(item)}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Info Cards */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-[#efe4ff] via-[#f7f0ff] to-white border border-purple-200/70 p-8 shadow-2xl shadow-purple-100/40 ring-1 ring-purple-100/70">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-3xl bg-purple-100 text-purple-700 mb-5 shadow-inner shadow-purple-100/50">
              <span className="text-2xl">✨</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">How It Works</h3>
            <p className="text-slate-600 leading-relaxed">
              Our AI analyzes facial expressions using computer vision to detect emotions like happiness, sadness, anger, and stress. This enhances your mood tracking data.
            </p>
          </div>
          <div className="rounded-[2rem] bg-gradient-to-br from-[#e8fdfd] via-[#f4f9f9] to-white border border-teal-200/70 p-8 shadow-2xl shadow-teal-100/30 ring-1 ring-teal-100/70">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-3xl bg-teal-100 text-teal-700 mb-5 shadow-inner shadow-teal-100/50">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Privacy First</h3>
            <p className="text-slate-600 leading-relaxed">
              Your facial data is processed locally and never stored. We only save the emotional analysis results to improve your recommendations.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>

      {/* Auth Prompt Dialog */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You've used your free guest scan. Please log in or sign up to continue using the Face Scan feature.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button 
              onClick={() => navigate('/auth')} 
              className="flex-1 bg-purple-600 hover:bg-purple-700"
            >
              Login
            </Button>
            <Button 
              onClick={() => navigate('/auth')} 
              variant="outline" 
              className="flex-1"
            >
              Sign Up
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}