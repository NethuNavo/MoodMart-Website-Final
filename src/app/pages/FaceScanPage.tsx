import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Scan, AlertCircle, Smile, Frown, Meh, AlertTriangle, CloudRain, ThumbsDown, Zap } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import facialRecognitionImage from "../../assets/facial-recognition.png";

export function FaceScanPage() {
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

  const handleScan = useCallback(() => {
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
      
      setIsScanning(false);
      setShowResult(true);
    }, 2000);
  }, []); // Remove dependency on emotions to avoid stale closures if not careful, or just use functional update if needed. But here emotions is constant structure. Actually wait, emotions is state now.
  // Better to use functional update or refs if emotions changes frequently, but here it changes on scan.
  // Safest to just depend on empty array as the structure is known or use functional state update.


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
        
        {/* Warning/Info Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" />
            <p className="text-gray-500 text-sm">
                This is a demo interface. In production, this would use TensorFlow.js or similar ML frameworks for real-time facial emotion detection.
            </p>
        </div>

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

                <div className="flex justify-center">
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
                        {emotions.sort((a,b) => b.percentage - a.percentage).map((emotion) => (
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

        {/* Bottom Info Cards */}
        <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-purple-50/50 border border-gray-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
                <p className="text-gray-500 leading-relaxed">
                    Our AI analyzes facial expressions using computer vision to detect emotions like happiness, sadness, anger, and stress. This enhances your mood tracking data.
                </p>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg shadow-purple-50/50 border border-gray-50">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy First</h3>
                <p className="text-gray-500 leading-relaxed">
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
    </div>
  );
}