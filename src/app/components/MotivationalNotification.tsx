import React, { useEffect, useState } from 'react';
import { X, Flame, Lightbulb, Target, Sparkles, Sun, Rocket, TrendingUp, Heart, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface NotificationMessage {
  id: string;
  message: string;
  icon: 'flame' | 'lightbulb' | 'target' | 'sparkles' | 'sun' | 'rocket' | 'trending' | 'heart' | 'star';
  mood?: 'positive' | 'neutral' | 'motivational' | 'supportive';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center-right' | 'center-left' | 'right-middle' | 'left-middle';
}

interface MotivationalNotificationProps {
  notification: NotificationMessage;
  onClose: () => void;
  duration?: number;
}

const iconMap = {
  flame: Flame,
  lightbulb: Lightbulb,
  target: Target,
  sparkles: Sparkles,
  sun: Sun,
  rocket: Rocket,
  trending: TrendingUp,
  heart: Heart,
  star: Star,
};

const iconColors = {
  flame: 'text-orange-500',
  lightbulb: 'text-yellow-500',
  target: 'text-red-500',
  sparkles: 'text-purple-500',
  sun: 'text-yellow-400',
  rocket: 'text-blue-500',
  trending: 'text-purple-500',
  heart: 'text-pink-500',
  star: 'text-yellow-500',
};

export default function MotivationalNotification({
  notification,
  onClose,
  duration = 20000,
}: MotivationalNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const Icon = iconMap[notification.icon];
  const position = notification.position || 'top-right';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const positionClasses = {
    'top-right': 'top-20 right-4 md:right-8',
    'top-left': 'top-20 left-4 md:left-8',
    'bottom-right': 'bottom-8 right-4 md:right-8',
    'bottom-left': 'bottom-8 left-4 md:left-8',
    'center-right': 'top-1/2 -translate-y-1/2 right-4 md:right-8',
    'center-left': 'top-1/2 -translate-y-1/2 left-4 md:left-8',
    'right-middle': 'top-1/2 -translate-y-1/2 right-4 md:right-8',
    'left-middle': 'top-1/2 -translate-y-1/2 left-4 md:left-8',
  };

  const slideVariants = {
    'top-right': {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 },
    },
    'top-left': {
      initial: { x: -400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -400, opacity: 0 },
    },
    'bottom-right': {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 },
    },
    'bottom-left': {
      initial: { x: -400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -400, opacity: 0 },
    },
    'center-right': {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 },
    },
    'center-left': {
      initial: { x: -400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -400, opacity: 0 },
    },
    'right-middle': {
      initial: { x: 400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 400, opacity: 0 },
    },
    'left-middle': {
      initial: { x: -400, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: -400, opacity: 0 },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={slideVariants[position].initial}
          animate={slideVariants[position].animate}
          exit={slideVariants[position].exit}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed ${positionClasses[position]} z-50 max-w-md`}
        >
          <div className="bg-gradient-to-r from-purple-100 to-lavender-100 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-200/50 p-4 pr-12 lux-elevated">
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 ${iconColors[notification.icon]}`}>
                <Icon className="w-8 h-8" strokeWidth={2} />
              </div>
              <p className="text-gray-800 flex-1 mt-1">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(onClose, 300);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close notification"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}