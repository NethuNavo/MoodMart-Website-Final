import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Lock, Heart, TrendingUp, BookOpen } from 'lucide-react';

interface GuestAccessGuardProps {
  children: React.ReactNode;
  featureName: string;
  requiresAuth?: boolean;
}

export function GuestAccessGuard({ children, featureName, requiresAuth = false }: GuestAccessGuardProps) {
  const navigate = useNavigate();
  
  // For now, we'll use a simple isAuthenticated check from MoodContext
  // In a real app, this would check the UserContext
  const isGuest = true; // This would come from UserContext

  if (!requiresAuth || !isGuest) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl p-12 text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lock className="w-10 h-10 text-purple-600" />
        </div>
        
        <h1 className="text-3xl mb-4">Unlock {featureName}</h1>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto">
          This feature is available to registered members. Create a free account to access personalized wellness features.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <Heart className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Personalized Tips</h3>
            <p className="text-sm text-gray-600">Get recommendations based on your mood</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your wellness journey</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-medium mb-2">Private Journal</h3>
            <p className="text-sm text-gray-600">Your thoughts, safe and secure</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => navigate('/auth')}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
          >
            Create Free Account
          </Button>
          <Button
            onClick={() => navigate('/shop')}
            variant="outline"
            className="px-8 py-6 text-lg"
          >
            Browse as Guest
          </Button>
        </div>

        <p className="text-sm text-gray-600 mt-6">
          No pressure, no barriers. Your mental well-being comes first.
        </p>
      </Card>
    </div>
  );
}
