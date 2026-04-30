import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import MotivationalNotification, { NotificationMessage } from '../components/MotivationalNotification';

interface NotificationContextType {
  showNotification: (message: string, icon?: NotificationMessage['icon'], mood?: NotificationMessage['mood']) => void;
  showMoodBasedNotification: (mood: string, stressLevel?: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

const motivationalMessages: Record<string, NotificationMessage[]> = {
  // Positive moods
  happy: [
    { id: '1', message: '🌈 Your positivity is contagious! Keep shining!', icon: 'sparkles', mood: 'positive' },
    { id: '2', message: '☀️ Wake up with determination, go to bed with satisfaction.', icon: 'sun', mood: 'positive' },
    { id: '3', message: '⚡ Your energy is amazing! Channel it into your goals!', icon: 'rocket', mood: 'positive' },
  ],
  calm: [
    { id: '4', message: '🌱 Peace comes from within. You\'re doing great!', icon: 'heart', mood: 'supportive' },
    { id: '5', message: '🦋 Believe in the power of new beginnings!', icon: 'sparkles', mood: 'positive' },
    { id: '6', message: '☀️ Your calm energy is your superpower!', icon: 'sun', mood: 'supportive' },
  ],
  motivated: [
    { id: '7', message: '🔥 Don\'t stop when you\'re tired — stop when you\'re done!', icon: 'flame', mood: 'motivational' },
    { id: '8', message: '🚀 Small steps today lead to big wins tomorrow.', icon: 'rocket', mood: 'motivational' },
    { id: '9', message: '🎯 Focus on your goal. Distractions can wait.', icon: 'target', mood: 'motivational' },
  ],
  
  // Neutral/Okay moods
  okay: [
    { id: '10', message: '🌟 Believe in yourself — every expert was once a beginner!', icon: 'star', mood: 'motivational' },
    { id: '11', message: '🌈 Even slow progress is progress — keep moving forward!', icon: 'trending', mood: 'supportive' },
    { id: '12', message: '💡 You\'re closer than you think. Keep pushing!', icon: 'lightbulb', mood: 'motivational' },
  ],
  normal: [
    { id: '13', message: '⚡ Your only limit is your mindset. Break the boundaries!', icon: 'rocket', mood: 'motivational' },
    { id: '14', message: '🌱 Progress, not perfection. Keep growing!', icon: 'heart', mood: 'supportive' },
    { id: '15', message: '🎯 Every step counts. You\'re on the right path!', icon: 'target', mood: 'supportive' },
  ],
  
  // Challenging moods
  stressed: [
    { id: '16', message: '🌊 Take a deep breath. You\'ve got this!', icon: 'heart', mood: 'supportive' },
    { id: '17', message: '💪 You\'re stronger than your stress. One step at a time.', icon: 'trending', mood: 'supportive' },
    { id: '18', message: '☀️ This too shall pass. Be gentle with yourself.', icon: 'sun', mood: 'supportive' },
  ],
  anxious: [
    { id: '19', message: '🌸 Breathe in peace, breathe out worry. You\'re safe.', icon: 'heart', mood: 'supportive' },
    { id: '20', message: '💡 You\'re closer than you think. Keep pushing!', icon: 'lightbulb', mood: 'supportive' },
    { id: '21', message: '🌱 Take it one moment at a time. You\'re doing your best.', icon: 'sparkles', mood: 'supportive' },
  ],
  overwhelmed: [
    { id: '22', message: '🎯 Focus on your goal. Distractions can wait.', icon: 'target', mood: 'supportive' },
    { id: '23', message: '🌈 Break it down into small steps. You can do this!', icon: 'trending', mood: 'supportive' },
    { id: '24', message: '💡 Remember: Progress over perfection!', icon: 'lightbulb', mood: 'supportive' },
  ],
  sad: [
    { id: '25', message: '🦋 It\'s okay to not be okay. Tomorrow is a new day.', icon: 'heart', mood: 'supportive' },
    { id: '26', message: '🌟 You are valued. This feeling will pass.', icon: 'star', mood: 'supportive' },
    { id: '27', message: '☀️ The sun will shine again. Hold on.', icon: 'sun', mood: 'supportive' },
  ],
  tired: [
    { id: '28', message: '🌙 Rest is productive too. Take care of yourself!', icon: 'heart', mood: 'supportive' },
    { id: '29', message: '🌱 Your body needs rest to grow stronger!', icon: 'sparkles', mood: 'supportive' },
    { id: '30', message: '💙 Self-care isn\'t selfish. You deserve rest.', icon: 'heart', mood: 'supportive' },
  ],
  
  // Default/General
  default: [
    { id: '31', message: '🌟 Believe in yourself — every expert was once a beginner!', icon: 'star', mood: 'motivational' },
    { id: '32', message: '🚀 Small steps today lead to big wins tomorrow.', icon: 'rocket', mood: 'motivational' },
    { id: '33', message: '💡 You\'re closer than you think. Keep pushing!', icon: 'lightbulb', mood: 'motivational' },
    { id: '34', message: '🔥 Don\'t stop when you\'re tired — stop when you\'re done!', icon: 'flame', mood: 'motivational' },
    { id: '35', message: '🌱 Progress, not perfection. Keep growing!', icon: 'heart', mood: 'supportive' },
  ],
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notificationQueue, setNotificationQueue] = useState<NotificationMessage[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationMessage | null>(null);
  const [usedMessageIds, setUsedMessageIds] = useState<Set<string>>(new Set());
  const [positionIndex, setPositionIndex] = useState(0);

  // Available notification positions - cycle through ALL corners and middle positions
  const positions: Array<'top-right' | 'top-left' | 'bottom-left' | 'bottom-right' | 'center-right' | 'center-left' | 'right-middle' | 'left-middle'> = 
    ['top-right', 'top-left', 'bottom-left', 'bottom-right', 'center-right', 'center-left', 'right-middle', 'left-middle'];

  // Get next position in sequence to ensure all sides are used
  const getNextPosition = () => {
    const position = positions[positionIndex];
    setPositionIndex((positionIndex + 1) % positions.length); // Cycle through all positions
    return position;
  };

  // Sequential notification display logic - one at a time, every 10 seconds
  useEffect(() => {
    if (currentNotification) {
      // Current notification is showing, wait for it to finish
      return;
    }

    if (notificationQueue.length === 0) {
      // No notifications in queue
      return;
    }

    // Show the next notification from the queue
    const nextNotification = notificationQueue[0];
    setCurrentNotification(nextNotification);
    setNotificationQueue(prev => prev.slice(1)); // Remove from queue

    // Auto-hide after 10 seconds
    const timer = setTimeout(() => {
      setCurrentNotification(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, [currentNotification, notificationQueue]);

  const showNotification = useCallback((
    message: string,
    icon: NotificationMessage['icon'] = 'sparkles',
    mood: NotificationMessage['mood'] = 'motivational'
  ) => {
    const notification: NotificationMessage = {
      id: Date.now().toString(),
      message,
      icon,
      mood,
      position: getNextPosition(),
    };
    
    setNotificationQueue(prev => [...prev, notification]);
  }, [positionIndex]);

  const showMoodBasedNotification = useCallback((mood: string, stressLevel?: number) => {
    // Determine which message pool to use
    let messagePool = motivationalMessages[mood] || motivationalMessages.default;
    
    // For high stress levels, show supportive messages
    if (stressLevel && stressLevel > 6) {
      messagePool = [...motivationalMessages.stressed, ...motivationalMessages.anxious];
    }
    
    // Filter out recently used messages to avoid immediate repeats
    let availableMessages = messagePool.filter(msg => !usedMessageIds.has(msg.id));
    
    // If all messages have been used, reset the used set and use all messages
    if (availableMessages.length === 0) {
      setUsedMessageIds(new Set());
      availableMessages = messagePool;
    }
    
    // Randomly select a message from available ones
    const randomMessage = availableMessages[Math.floor(Math.random() * availableMessages.length)];
    
    // Mark this message as used
    setUsedMessageIds(prev => new Set([...prev, randomMessage.id]));
    
    // Add all messages to the queue for sequential display with varied positions
    const notificationsToQueue = messagePool.map((msg, index) => {
      const position = positions[(positionIndex + index) % positions.length];
      return {
        ...msg,
        id: `${Date.now()}-${index}`,
        position: position,
      };
    });
    
    // Update position index for next call
    setPositionIndex((positionIndex + messagePool.length) % positions.length);
    
    setNotificationQueue(prev => [...prev, ...notificationsToQueue]);
  }, [usedMessageIds, positionIndex]);

  const removeNotification = useCallback(() => {
    setCurrentNotification(null);
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification, showMoodBasedNotification }}>
      {children}
      {currentNotification && (
        <MotivationalNotification
          key={currentNotification.id}
          notification={currentNotification}
          onClose={removeNotification}
          duration={10000}
        />
      )}
    </NotificationContext.Provider>
  );
};