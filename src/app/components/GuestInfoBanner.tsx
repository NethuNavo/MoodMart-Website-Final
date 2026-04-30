import { useNavigate } from 'react-router-dom';
import { X, Heart, ShoppingBag, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';

interface GuestInfoBannerProps {
  page: 'shop' | 'community' | 'general';
}

export function GuestInfoBanner({ page }: GuestInfoBannerProps) {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const messages = {
    shop: {
      icon: ShoppingBag,
      title: 'Shopping as Guest',
      description: 'You can browse and purchase without an account. Create one later to track orders!',
    },
    community: {
      icon: Heart,
      title: 'Join Our Community',
      description: 'Sign up to participate in discussions and connect with others on their wellness journey.',
    },
    general: {
      icon: UserPlus,
      title: 'Enhance Your Experience',
      description: 'Create a free account to unlock personalized wellness features and track your progress.',
    },
  };

  const message = messages[page];
  const Icon = message.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="bg-gradient-to-r from-purple-600 to-purple-500 text-white lux-elevated"
      >
        <div className="container py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <Icon className="w-6 h-6 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium">{message.title}</p>
                <p className="text-sm text-purple-100">{message.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/auth')}
                variant="secondary"
                size="sm"
                className="lux-btn bg-white text-purple-600 hover:bg-purple-50"
              >
                Sign Up
              </Button>
              <button
                onClick={() => setIsVisible(false)}
                className="text-white hover:text-purple-200 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
