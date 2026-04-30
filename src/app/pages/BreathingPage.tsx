import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from '../components/icons';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
const headerBg = new URL('../../assets/a29c988cecf7518aefa1051e53ffc3b671037802.png', import.meta.url).href;
const guidedBreathingImage = new URL('../../assets/56deb1cbc104300eab46909bff0b6ae29dd296b8.png', import.meta.url).href;

export function BreathingPage() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [cycles, setCycles] = useState([4]);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [remainingTime, setRemainingTime] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);

  const presetTimes = [5, 8, 10, 12];
  const cycleSeconds = cycles[0] * 3; // inhale + hold + exhale

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setPhaseTime(prev => {
        if (prev >= cycles[0] - 1) {
          // Move to next phase
          if (phase === 'inhale') {
            setPhase('hold');
            return 0;
          } else if (phase === 'hold') {
            setPhase('exhale');
            return 0;
          } else {
            setPhase('inhale');
            setRemainingTime(prev => {
              if (prev <= 0) {
                setIsRunning(false);
                return 0;
              }
              return prev - cycleSeconds;
            });
            return 0;
          }
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, cycles, cycleSeconds]);

  const handleStart = () => {
    if (!isRunning && remainingTime === 0) {
      setRemainingTime(selectedTime * 60);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('inhale');
    setRemainingTime(0);
    setPhaseTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-purple-400 to-pink-400';
      case 'exhale':
        return 'from-teal-400 to-purple-400';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img 
            src={guidedBreathingImage} 
            alt="Guided Breathing - Practice mindful breathing exercises for relaxation and stress relief" 
            className="w-full h-80 object-cover animate-fade-in"
          />
        </div>
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Controls Card */}
            <Card className="p-8 md:col-span-1">
              <h2 className="text-2xl mb-6 text-gray-900">Select Breathing Time</h2>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {presetTimes.map(time => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-3 px-4 rounded-lg transition-colors ${
                      selectedTime === time
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {time} Minutes
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-6"
                    size="lg"
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {remainingTime > 0 ? 'Resume' : 'Start'}
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    className="w-full bg-teal-600 hover:bg-teal-700 py-6"
                    size="lg"
                  >
                    <Pause className="h-5 w-5 mr-2" />
                    Pause
                  </Button>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full py-6"
                  size="lg"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </div>
            </Card>

            {/* Breathing Visualization */}
            <Card className="p-8 md:col-span-2 flex flex-col items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-white">
              <div className="text-center mb-8">
                <p className="text-gray-600 mb-2">Time Remaining</p>
                <p className="text-4xl text-gray-900">
                  {remainingTime > 0 ? formatTime(remainingTime) : formatTime(selectedTime * 60)}
                </p>
              </div>

              <div className="relative mb-12">
                <div
                  className={`w-64 h-64 rounded-full bg-gradient-to-br ${getPhaseColor()} flex items-center justify-center transition-all duration-1000 ${
                    isRunning ? (phase === 'inhale' ? 'scale-125' : phase === 'exhale' ? 'scale-75' : 'scale-100') : 'scale-100'
                  }`}
                >
                  <div className="text-white text-center">
                    <p className="text-3xl mb-2">{getPhaseInstruction()}</p>
                    <p className="text-lg opacity-90">{cycles[0] - phaseTime}s</p>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-md">
                <h3 className="text-xl mb-3 text-gray-900">Breathing Pattern</h3>
                <p className="text-gray-600">
                  Inhale for {cycles[0]} seconds → Hold for {cycles[0]} seconds → Exhale for {cycles[0]} seconds
                </p>
              </div>
            </Card>
          </div>

          {/* Benefits Section */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6">
              <h3 className="text-lg mb-2 text-gray-900">Reduces Stress</h3>
              <p className="text-gray-600 text-sm">Deep breathing activates your parasympathetic nervous system, promoting relaxation</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg mb-2 text-gray-900">Improves Focus</h3>
              <p className="text-gray-600 text-sm">Controlled breathing enhances oxygen flow to the brain, improving concentration</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg mb-2 text-gray-900">Better Sleep</h3>
              <p className="text-gray-600 text-sm">Regular breathing exercises can help calm your mind and prepare for restful sleep</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}