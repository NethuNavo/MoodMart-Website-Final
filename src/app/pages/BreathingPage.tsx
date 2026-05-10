import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Leaf, Brain, Moon, Waves, Target } from 'lucide-react';
import { Play, Pause, RotateCcw } from '../components/icons';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
const guidedBreathingImage = new URL('../../assets/56deb1cbc104300eab46909bff0b6ae29dd296b8.png', import.meta.url).href;

const phaseDurations = {
  inhale: 4,
  hold: 4,
  exhale: 4,
};

const phaseOrder = {
  inhale: 'hold',
  hold: 'exhale',
  exhale: 'inhale',
} as const;

type Phase = 'inhale' | 'hold' | 'exhale';

export function BreathingPage() {
  const [selectedTime, setSelectedTime] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>('inhale');
  const [phaseTime, setPhaseTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const presetTimes = [5, 8, 10, 12];

  useEffect(() => {
    if (!isRunning) return;

    const interval = window.setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });

      setPhaseTime(prev => {
        if (prev + 1 >= phaseDurations[phase]) {
          setPhase(phaseOrder[phase]);
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isRunning, phase]);

  const handleStart = () => {
    if (remainingTime === 0) {
      setRemainingTime(selectedTime * 60);
      setPhase('inhale');
      setPhaseTime(0);
    }
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setPhase('inhale');
    setPhaseTime(0);
    setRemainingTime(0);
  };

  const displayedTime = remainingTime > 0 ? remainingTime : selectedTime * 60;
  const phaseCountdown = Math.max(phaseDurations[phase] - phaseTime, 0);

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

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img 
            src={guidedBreathingImage} 
            alt="Guided Breathing - Practice mindful breathing exercises for relaxation and stress relief" 
            className="w-full h-60 sm:h-80 object-cover animate-fade-in"
          />
        </div>
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-purple-50 via-white to-fuchsia-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="relative"
            >
              <Card className="relative overflow-hidden rounded-[40px] border border-white/50 bg-gradient-to-br from-violet-50/90 via-white/70 to-fuchsia-50/80 shadow-[0_40px_120px_rgba(124,58,237,0.18)] backdrop-blur-2xl transition-all duration-300 hover:shadow-[0_50px_140px_rgba(124,58,237,0.22)]">
                <div className="absolute -right-12 -top-10 h-56 w-56 rounded-full bg-violet-300/30 blur-3xl" />
                <div className="absolute left-4 top-20 h-28 w-28 rounded-full bg-cyan-200/20 blur-3xl" />
                <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white/90 to-transparent" />
                <div className="absolute inset-0 rounded-[40px] border border-violet-200/30" />

                <div className="relative z-10 p-8">
                  <div className="inline-flex items-center rounded-full bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-violet-700 shadow-[0_10px_30px_rgba(124,58,237,0.08)]">
                    Start Your Flow
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.34em] text-violet-600">SELECT BREATHING TIME</p>
                  <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">Set your session</h2>

                  <div className="grid grid-cols-2 gap-3 mt-8">
                    {presetTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-3xl py-4 text-sm font-semibold transition-all duration-300 ${
                          selectedTime === time
                            ? 'bg-gradient-to-br from-violet-700 to-fuchsia-600 text-white shadow-[0_24px_60px_rgba(124,58,237,0.28)]'
                            : 'bg-white/85 text-slate-700 ring-1 ring-slate-200/90 hover:bg-white/95 hover:shadow-[0_12px_30px_rgba(124,58,237,0.12)]'
                        }`}
                      >
                        {time} Minutes
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 space-y-4">
                    {!isRunning ? (
                      <Button
                        onClick={handleStart}
                        className="w-full rounded-3xl bg-gradient-to-br from-violet-700 to-fuchsia-600 py-5 text-base font-semibold text-white shadow-[0_20px_60px_rgba(124,58,237,0.32)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(124,58,237,0.38)]"
                        size="lg"
                      >
                        <Play className="h-5 w-5 mr-2" />
                        Resume
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePause}
                        className="w-full rounded-3xl bg-violet-100 py-5 text-base font-semibold text-violet-700 shadow-sm transition hover:bg-violet-200"
                        size="lg"
                      >
                        <Pause className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}

                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="w-full rounded-3xl border border-slate-200 bg-white/80 py-5 text-base font-semibold text-slate-700 shadow-sm transition hover:border-violet-200 hover:bg-white"
                      size="lg"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>

                  <div className="mt-8 rounded-[28px] border border-violet-100/80 bg-violet-50/95 p-5 shadow-[0_20px_50px_rgba(124,58,237,0.08)]">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-violet-700">Recommended</p>
                        <p className="mt-2 text-sm text-slate-700">Start with 5 Minutes for a quick reset and calm mind.</p>
                      </div>
                      <span className="inline-flex h-10 min-w-[80px] items-center justify-center rounded-full bg-violet-100/85 px-3 text-xs font-bold uppercase tracking-[0.2em] text-violet-700">
                        Easy
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            >
              <Card className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/80 shadow-[0_45px_120px_rgba(124,58,237,0.16)] backdrop-blur-2xl">
                <div className="absolute -left-16 -top-10 h-72 w-72 rounded-full bg-violet-200/30 blur-3xl" />
                <div className="absolute right-6 top-10 h-36 w-36 rounded-full bg-fuchsia-300/20 blur-3xl opacity-90" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(168,85,247,0.12),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.1),_transparent_28%)]" />
                <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-white/90 to-transparent" />

                <div className="relative z-10 p-8">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.35em] text-violet-600/90">TIME REMAINING</p>
                      <p className="mt-3 text-5xl font-semibold text-slate-950 sm:text-6xl">{formatTime(displayedTime)}</p>
                    </div>
                    <button className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_24px_60px_rgba(124,58,237,0.28)] transition hover:-translate-y-0.5 hover:shadow-[0_30px_80px_rgba(124,58,237,0.34)]">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white shadow-[0_0_20px_rgba(255,255,255,0.18)]">
                        <Waves className="h-4 w-4" />
                      </span>
                      Breathe Mode
                    </button>
                  </div>

                  <div className="relative mx-auto my-10 flex h-[360px] w-[360px] items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-100/60 via-white/10 to-fuchsia-100/40 shadow-[0_0_120px_rgba(168,85,247,0.24)]" />
                    <div className="absolute inset-0 rounded-full border border-white/70 opacity-90" />
                    <div className="absolute inset-6 rounded-full border border-violet-200/60" />
                    <div className="absolute inset-12 rounded-full border border-violet-100/70" />
                    <div className="absolute inset-20 rounded-full border border-fuchsia-200/60" />
                    <div className="absolute inset-28 rounded-full border border-violet-100/40" />
                    <div className="absolute -left-6 top-16 h-6 w-6 rounded-full bg-violet-500/30 blur-2xl animate-float" />
                    <div className="absolute right-10 top-14 h-4 w-4 rounded-full bg-fuchsia-400/40 blur-2xl animate-float" style={{ animationDelay: '0.4s' }} />
                    <div className="absolute left-12 bottom-20 h-5 w-5 rounded-full bg-purple-400/35 blur-2xl animate-float" style={{ animationDelay: '0.8s' }} />
                    <div className="absolute bottom-16 right-16 h-4 w-4 rounded-full bg-violet-400/35 blur-2xl animate-float" style={{ animationDelay: '1.2s' }} />
                    <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.55)_0%,_rgba(255,255,255,0)_38%)]" />

                    <motion.div
                      animate={{ scale: [1, 1.045, 1], opacity: [0.95, 1, 0.95] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="relative flex h-72 w-72 items-center justify-center rounded-full bg-white/90 shadow-[0_32px_90px_rgba(168,85,247,0.16)] ring-1 ring-white/80"
                    >
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/80 via-violet-100/70 to-fuchsia-100/65" />
                      <div className="absolute inset-0 rounded-full border border-white/80 shadow-[0_0_40px_rgba(168,85,247,0.16)]" />
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                        className="absolute inset-0"
                      >
                        <div className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full bg-violet-300/80 shadow-[0_0_20px_rgba(168,85,247,0.35)]" />
                        <div className="absolute right-2 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full bg-fuchsia-300/80 shadow-[0_0_18px_rgba(236,72,153,0.3)]" />
                        <div className="absolute left-4 bottom-8 h-2 w-2 rounded-full bg-purple-300/70 shadow-[0_0_16px_rgba(168,85,247,0.24)]" />
                      </motion.div>
                      <div className="relative z-10 text-center">
                        <p className="text-xl font-semibold uppercase tracking-[0.28em] text-violet-700/90">{getPhaseInstruction()}</p>
                        <p className="mt-3 text-6xl font-semibold text-violet-900 drop-shadow-[0_0_30px_rgba(139,92,246,0.28)]">{phaseCountdown}s</p>
                      </div>
                    </motion.div>
                  </div>

                  <div className="text-center mx-auto max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Breathing Pattern</p>
                    <p className="mt-3 text-base text-slate-600">
                      Inhale for 4 seconds — Hold for 4 seconds — Exhale for 4 seconds
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          <div className="grid gap-6 mt-10 md:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              whileHover={{ y: -6 }}
            >
              <Card className="relative overflow-hidden rounded-[28px] border border-white/40 bg-emerald-50/40 shadow-[0_34px_90px_rgba(46,204,113,0.14)] backdrop-blur-2xl transition-transform duration-300 hover:border-white/60 hover:shadow-[0_40px_120px_rgba(46,204,113,0.18)]">
                <div className="pointer-events-none absolute -right-10 top-10 h-44 w-44 rounded-full bg-emerald-300/30 blur-3xl" />
                <div className="pointer-events-none absolute left-6 top-12 h-20 w-20 rounded-full bg-cyan-200/30 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/70 to-transparent" />
                <div className="relative z-10 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100/90 text-emerald-700 shadow-[0_18px_40px_rgba(72,187,120,0.18)]">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.35em] text-emerald-700/80">Mindful calm</div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-950">Reduces Stress</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">Deep breathing activates your parasympathetic nervous system, promoting relaxation.</p>
                  <div className="pointer-events-none absolute right-6 bottom-6 h-24 w-24 rounded-full border border-emerald-200/70 bg-emerald-100/20 blur-xl" />
                  <div className="pointer-events-none absolute right-8 bottom-8 h-24 w-24 rounded-[32px] border border-emerald-200/60 bg-emerald-200/10" />
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -6 }}
            >
              <Card className="relative overflow-hidden rounded-[28px] border border-white/40 bg-violet-50/40 shadow-[0_34px_90px_rgba(168,85,247,0.14)] backdrop-blur-2xl transition-transform duration-300 hover:border-white/60 hover:shadow-[0_40px_120px_rgba(168,85,247,0.18)]">
                <div className="pointer-events-none absolute -right-12 top-8 h-44 w-44 rounded-full bg-violet-300/30 blur-3xl" />
                <div className="pointer-events-none absolute left-10 top-16 h-16 w-16 rounded-full bg-fuchsia-300/20 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />
                <div className="relative z-10 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-violet-100/90 text-violet-700 shadow-[0_18px_40px_rgba(168,85,247,0.18)]">
                      <Target className="h-6 w-6" />
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.35em] text-violet-700/80">Focus boost</div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-950">Improves Focus</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">Controlled breathing enhances oxygen flow to the brain, improving concentration.</p>
                  <div className="pointer-events-none absolute right-8 bottom-6 h-24 w-24 rounded-full border border-violet-200/70 bg-violet-200/15 blur-xl" />
                  <div className="pointer-events-none absolute right-12 bottom-10 h-16 w-16 rounded-full bg-fuchsia-200/30 blur-2xl" />
                  <div className="pointer-events-none absolute right-14 bottom-14 opacity-70">
                    <Brain className="h-28 w-28 text-violet-200/60" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -6 }}
            >
              <Card className="relative overflow-hidden rounded-[28px] border border-white/40 bg-pink-50/40 shadow-[0_34px_90px_rgba(236,72,153,0.14)] backdrop-blur-2xl transition-transform duration-300 hover:border-white/60 hover:shadow-[0_40px_120px_rgba(236,72,153,0.18)]">
                <div className="pointer-events-none absolute -right-12 top-10 h-44 w-44 rounded-full bg-pink-300/30 blur-3xl" />
                <div className="pointer-events-none absolute left-8 top-14 h-16 w-16 rounded-full bg-rose-200/20 blur-2xl" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white/80 to-transparent" />
                <div className="relative z-10 p-6 sm:p-7">
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-pink-100/90 text-pink-700 shadow-[0_18px_40px_rgba(236,72,153,0.18)]">
                      <Moon className="h-6 w-6" />
                    </div>
                    <div className="text-right text-xs uppercase tracking-[0.35em] text-pink-700/80">Night ritual</div>
                  </div>
                  <h3 className="mt-6 text-2xl font-semibold text-slate-950">Better Sleep</h3>
                  <p className="mt-3 max-w-sm text-sm leading-7 text-slate-600">Regular breathing exercises can help calm your mind and prepare for restful sleep.</p>
                  <div className="pointer-events-none absolute right-8 bottom-6 h-24 w-24 rounded-full border border-pink-200/70 bg-pink-200/15 blur-xl" />
                  <div className="pointer-events-none absolute right-10 bottom-10 h-16 w-16 rounded-full bg-rose-200/30 blur-2xl" />
                  <div className="pointer-events-none absolute right-12 bottom-16 opacity-80">
                    <div className="relative h-24 w-24">
                      <div className="absolute left-0 top-0 h-8 w-8 rounded-full bg-white/70 blur-xl" />
                      <div className="absolute left-8 top-3 text-4xl font-semibold text-pink-200/90">Zzz</div>
                      <div className="absolute bottom-0 right-0 h-16 w-16 rounded-full border border-white/60 bg-pink-100/20" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}