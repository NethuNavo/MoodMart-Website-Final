const CartSession = require('./models/CartSession');
const CheckoutSession = require('./models/CheckoutSession');
const DashboardStat = require('./models/DashboardStat');
const Profile = require('./models/Profile');
const Settings = require('./models/Settings');
const ShopProduct = require('./models/ShopProduct');
const OrderSuccess = require('./models/OrderSuccess');
const cartSessions = [
  { user: 'admin@moodmart.com', items: [{ productId: '1', quantity: 2, price: 2499.00 }], subtotal: 4998, shipping: 300, discount: 0, total: 5298, date: new Date('2026-01-25T10:00:00Z') },
  { user: 'jane@moodmart.com', items: [{ productId: '2', quantity: 1, price: 1899.00 }], subtotal: 1899, shipping: 300, discount: 0, total: 2199, date: new Date('2026-01-26T12:00:00Z') }
];

const checkoutSessions = [
  { user: 'admin@moodmart.com', paymentMethod: 'cod', subtotal: 4998, shipping: 300, total: 5298, status: 'completed', date: new Date('2026-01-25T10:10:00Z') },
  { user: 'jane@moodmart.com', paymentMethod: 'card', subtotal: 1899, shipping: 300, total: 2199, status: 'pending', date: new Date('2026-01-26T12:10:00Z') }
];

const dashboardStats = [
  { user: 'admin@moodmart.com', averageStress: 2.5, streak: 7, recommendations: ['Continue Your Streak', 'Try Morning Meditation'], date: new Date('2026-01-26T09:00:00Z') }
];

const profiles = [
  { user: 'admin@moodmart.com', totalEntries: 20, currentStreak: 7, averageStress: 2.5, wellnessScore: 75, achievements: ['First Step', 'Week Warrior'], date: new Date('2026-01-26T09:00:00Z') }
];

const settings = [
  { user: 'admin@moodmart.com', emailNotifications: true, appNotifications: true, promotionalEmails: false, theme: 'light', language: 'en', fontSize: 'medium', dataSharing: false, activityStatus: true, date: new Date('2026-01-26T09:00:00Z') }
];

const shopProducts = [
  { id: '1', name: 'Mindfulness Journal', category: 'journal', price: 2499.00, rating: 4.8, reviews: 156, description: 'Daily guided journal for tracking thoughts and emotions', tag: 'Bestseller', image: 'https://images.unsplash.com/photo-1594997652537-2e2dce4ebf28?w=400&h=300&fit=crop' },
  { id: '2', name: 'Lavender Essential Oil', category: 'essential-oil', price: 1899.00, rating: 4.9, reviews: 243, description: 'Pure lavender oil for relaxation and better sleep', tag: 'Popular', image: 'https://images.unsplash.com/photo-1647934174425-61136513aed7?w=400&h=300&fit=crop' },
  { id: '3', name: 'The Anxiety Toolkit', category: 'book', price: 1699.00, rating: 4.7, reviews: 89, description: 'Evidence-based strategies for managing anxiety', tag: '', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop' }
];

const orderSuccesses = [
  { user: 'admin@moodmart.com', orderId: 'ORD123', completed: true, date: new Date('2026-01-25T10:20:00Z') },
  { user: 'jane@moodmart.com', orderId: 'ORD124', completed: true, date: new Date('2026-01-26T12:20:00Z') }
];
const BreathingSession = require('./models/BreathingSession');
const FaceScanSession = require('./models/FaceScanSession');
const breathingSessions = [
  { durationMinutes: 5, cycles: 4, completed: true, date: new Date('2026-01-20T08:00:00Z') },
  { durationMinutes: 8, cycles: 5, completed: true, date: new Date('2026-01-21T09:00:00Z') },
  { durationMinutes: 10, cycles: 6, completed: false, date: new Date('2026-01-22T10:00:00Z') },
  { durationMinutes: 12, cycles: 7, completed: true, date: new Date('2026-01-23T11:00:00Z') }
];

const faceScanSessions = [
  { mood: 'happy', confidence: 0.95, result: 'Detected happy expression', date: new Date('2026-01-20T08:30:00Z') },
  { mood: 'calm', confidence: 0.88, result: 'Detected calm expression', date: new Date('2026-01-21T09:30:00Z') },
  { mood: 'anxious', confidence: 0.76, result: 'Detected anxious expression', date: new Date('2026-01-22T10:30:00Z') },
  { mood: 'tired', confidence: 0.81, result: 'Detected tired expression', date: new Date('2026-01-23T11:30:00Z') }
];
const CommunityPost = require('./models/CommunityPost');
const QASession = require('./models/QASession');
const CommunityQuestion = require('./models/CommunityQuestion');
const communityPosts = [
  {
    id: '1',
    author: 'CalmBreeze47',
    category: 'daily',
    title: 'Taking small steps every day',
    content: 'Today I finally managed to complete my morning routine without feeling overwhelmed. It took weeks of practice, but I\'m getting there. Small wins matter! 🌱',
    likes: 24,
    replies: 8,
    timeAgo: '2h ago',
    moodTag: 'calm',
    isLiked: false,
  },
  {
    id: '2',
    author: 'GentleMoon83',
    category: 'anxiety',
    title: 'Breathing exercises really work',
    content: 'I was skeptical at first, but the 5-minute breathing exercises on this platform have genuinely helped reduce my anxiety during stressful moments at work.',
    likes: 42,
    replies: 15,
    timeAgo: '5h ago',
    moodTag: 'anxious',
    isLiked: false,
  },
  {
    id: '3',
    author: 'SereneStar12',
    category: 'sleep',
    title: 'Sleep routine that changed my life',
    content: 'Started following a consistent sleep schedule 3 weeks ago. No screens 1 hour before bed, audio therapy sessions, and herbal tea. Best sleep in years!',
    likes: 38,
    replies: 22,
    timeAgo: '1d ago',
    moodTag: 'tired',
    isLiked: false,
  },
  {
    id: '4',
    author: 'MindfulCloud56',
    category: 'motivation',
    title: 'Celebrating 30 days of mood tracking',
    content: 'Just hit 30 consecutive days of logging my mood. Seeing the patterns has been eye-opening. Thank you to this supportive community! 💙',
    likes: 67,
    replies: 19,
    timeAgo: '1d ago',
    moodTag: 'happy',
    isLiked: false,
  },
];

const qaSessions = [
  {
    id: '1',
    topic: 'Managing Anxiety in Daily Life',
    coach: 'Dr. Sarah Mitchell',
    date: 'Dec 22, 2024',
    time: '3:00 PM EST',
    status: 'upcoming',
  },
  {
    id: '2',
    topic: 'Building Healthy Sleep Habits',
    coach: 'Dr. James Cooper',
    date: 'Dec 24, 2024',
    time: '6:00 PM EST',
    status: 'upcoming',
  },
];

const communityQuestions = [
  {
    id: '1',
    question: 'How can I stop overthinking before bed?',
    answer: 'Try a "worry journal" - write down your thoughts 30 minutes before bed. This helps externalize worries. Follow with a calming activity like reading or listening to soft music. Your brain learns to associate bed with rest, not problem-solving.',
    coach: 'Dr. Sarah Mitchell',
    timeAgo: '2d ago',
    saves: 45,
    isSaved: false,
  },
  {
    id: '2',
    question: 'What\'s the difference between stress and anxiety?',
    answer: 'Stress is typically a response to an external trigger (deadlines, events). Anxiety is internal worry that persists even without immediate threats. Both are manageable with proper techniques - breathing exercises for immediate relief, and therapy for long-term support.',
    coach: 'Dr. James Cooper',
    timeAgo: '4d ago',
    saves: 32,
    isSaved: false,
  },
];
const MoodEntry = require('./models/MoodEntry');
const Notification = require('./models/Notification');
const Order = require('./models/Order');
const moodEntries = [
  { date: '2026-01-20', mood: 'happy', intensity: 5, stressLevel: 1, notes: 'Had a great day at work!' },
  { date: '2026-01-21', mood: 'stressed', intensity: 2, stressLevel: 4, notes: 'Deadlines were tough.' },
  { date: '2026-01-22', mood: 'calm', intensity: 4, stressLevel: 2, notes: 'Relaxed with meditation.' },
  { date: '2026-01-23', mood: 'tired', intensity: 2, stressLevel: 3, notes: 'Did not sleep well.' },
  { date: '2026-01-24', mood: 'motivated', intensity: 5, stressLevel: 1, notes: 'Started a new project.' },
  { date: '2026-01-25', mood: 'anxious', intensity: 3, stressLevel: 4, notes: 'Upcoming presentation.' },
  { date: '2026-01-26', mood: 'content', intensity: 4, stressLevel: 2, notes: 'Spent time with family.' },
];

const notifications = [
  { id: '1', message: '🌈 Your positivity is contagious! Keep shining!', icon: 'sparkles', mood: 'happy' },
  { id: '2', message: '☀️ Wake up with determination, go to bed with satisfaction.', icon: 'sun', mood: 'happy' },
  { id: '3', message: '⚡ Your energy is amazing! Channel it into your goals!', icon: 'rocket', mood: 'happy' },
  { id: '4', message: '🌱 Peace comes from within. You\'re doing great!', icon: 'heart', mood: 'calm' },
  { id: '5', message: '🧋 Believe in the power of new beginnings!', icon: 'sparkles', mood: 'calm' },
  { id: '6', message: '☀️ Your calm energy is your superpower!', icon: 'sun', mood: 'calm' },
  { id: '16', message: '🌊 Take a deep breath. You\'ve got this!', icon: 'heart', mood: 'stressed' },
  { id: '17', message: '💪 You\'re stronger than your stress. One step at a time.', icon: 'trending', mood: 'stressed' },
  { id: '18', message: '☀️ This too shall pass. Be gentle with yourself.', icon: 'sun', mood: 'stressed' },
  { id: '19', message: '🌸 Breathe in peace, breathe out worry. You\'re safe.', icon: 'heart', mood: 'anxious' },
  { id: '20', message: '💡 You\'re closer than you think. Keep pushing!', icon: 'lightbulb', mood: 'anxious' },
  { id: '21', message: '🌱 Take it one moment at a time. You\'re doing your best.', icon: 'sparkles', mood: 'anxious' },
];

const orders = [
  {
    user: 'admin@moodmart.com',
    products: [
      { productId: '1', quantity: 2 },
      { productId: '2', quantity: 1 }
    ],
    total: 74.48,
    status: 'completed',
    createdAt: new Date('2026-01-25T10:00:00Z')
  },
  {
    user: 'jane@moodmart.com',
    products: [
      { productId: '3', quantity: 1 }
    ],
    total: 39.0,
    status: 'pending',
    createdAt: new Date('2026-01-26T12:00:00Z')
  }
];
const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const AudioTrack = require('./models/AudioTrack');
const audioTracks = [
  {
    title: 'Ocean Waves for Relaxation',
    category: 'Stress Relief',
    duration: '15:00',
    description: 'Gentle ocean sounds to calm your mind and reduce stress',
    color: 'from-blue-400 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1661953029179-e1b0dc900490?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmVhY2h8ZW58MXx8fHwxNzY2Mzc2MjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/05/13/audio_257112ce99.mp3'
  },
  {
    title: 'Forest Ambience',
    category: 'Meditation',
    duration: '20:00',
    description: 'Peaceful forest sounds for deep meditation',
    color: 'from-purple-400 to-purple-500',
    image: 'https://images.unsplash.com/photo-1656783208368-a7d176736535?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3Jlc3QlMjBuYXR1cmUlMjB0cmVlc3xlbnwxfHx8fDE3NjYzMDYxMDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/10/audio_4a6bf5a518.mp3'
  },
  {
    title: 'Anxiety Relief Meditation',
    category: 'Anxiety',
    duration: '12:00',
    description: 'Guided meditation specifically designed for anxiety management',
    color: 'from-purple-400 to-pink-500',
    image: 'https://images.unsplash.com/photo-1641391400871-3a6578a11d5a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpdGF0aW9uJTIwcGVhY2VmdWwlMjB6ZW58ZW58MXx8fHwxNzY2MzYxMjQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    audioUrl: 'https://cdn.pixabay.com/audio/2023/10/23/audio_13c741d5b5.mp3'
  },
  {
    title: 'Sleep Soundly',
    category: 'Sleep',
    duration: '30:00',
    description: 'Soothing sounds to help you fall asleep naturally',
    color: 'from-indigo-400 to-purple-500',
    image: 'https://images.unsplash.com/photo-1756058811187-6cfc539fdfa6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbGVlcCUyMG5pZ2h0JTIwbW9vbnxlbnwxfHx8fDE3NjYzNzYyNjd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/03/15/audio_13c2e69c00.mp3'
  },
  {
    title: 'Depression Support',
    category: 'Depression',
    duration: '18:00',
    description: 'Uplifting guided meditation for managing depression',
    color: 'from-yellow-400 to-orange-500',
    image: 'https://images.unsplash.com/photo-1545500425-a514ded6a000?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5yaXNlJTIwcGVhY2VmdWwlMjBuYXR1cmV8ZW58MXx8fHwxNzY2Mzc2MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    audioUrl: 'https://cdn.pixabay.com/audio/2022/11/22/audio_4eb166d25e.mp3'
  },
  {
    title: 'Rain & Thunder',
    category: 'Stress Relief',
    duration: '25:00',
    description: 'Natural rain and distant thunder for ultimate relaxation',
    color: 'from-gray-400 to-slate-500',
    image: 'https://images.unsplash.com/photo-1664976694406-3e9f37768a2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyYWluJTIwc3Rvcm0lMjBjbG91ZHN8ZW58MXx8fHwxNzY2Mzc2MjY4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    audioUrl: 'https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3'
  },
];
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mernapp';

const products = [
  [
  {
    "id": "1",
    "name": "Mindfulness Journal",
    "category": "journal",
    "price": 2499.00,
    "rating": 4.8,
    "reviews": 156,
    "description": "Daily guided journal for tracking thoughts and emotions",
    "tag": "Bestseller",
    "image": "https://images.unsplash.com/photo-1594997652537-2e2dce4ebf28?w=400&h=300&fit=crop"
  },
  {
    "id": "2",
    "name": "Lavender Essential Oil",
    "category": "essential-oil",
    "price": 1899.00,
    "rating": 4.9,
    "reviews": 243,
    "description": "Pure lavender oil for relaxation and better sleep",
    "tag": "Popular",
    "image": "https://images.unsplash.com/photo-1647934174425-61136513aed7?w=400&h=300&fit=crop"
  },
  {
    "id": "3",
    "name": "The Anxiety Toolkit",
    "category": "book",
    "price": 1699.00,
    "rating": 4.7,
    "reviews": 89,
    "description": "Evidence-based strategies for managing anxiety",
    "image": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop"
  },
  {
    "id": "4",
    "name": "Meditation Cushion",
    "category": "supplement",
    "price": 3999.00,
    "rating": 4.6,
    "reviews": 67,
    "description": "Comfortable zafu cushion for meditation practice",
    "image": "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop"
  },
  {
    "id": "5",
    "name": "Gratitude Journal",
    "category": "journal",
    "price": 1999.00,
    "rating": 4.9,
    "reviews": 201,
    "description": "Daily prompts for cultivating gratitude",
    "tag": "Recommended",
    "image": "/gratitude.png"
  },
  {
    "id": "6",
    "name": "Eucalyptus Essential Oil",
    "category": "essential-oil",
    "price": 1599.00,
    "rating": 4.7,
    "reviews": 134,
    "description": "Invigorating eucalyptus for clarity and focus",
    "image": "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop"
  },
  {
    "id": "7",
    "name": "The Power of Now",
    "category": "book",
    "price": 1499.00,
    "rating": 4.8,
    "reviews": 312,
    "description": "A guide to spiritual enlightenment by Eckhart Tolle",
    "tag": "Classic",
    "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop"
  },
  {
    "id": "8",
    "name": "Aromatherapy Diffuser",
    "category": "supplement",
    "price": 4999.00,
    "rating": 4.5,
    "reviews": 178,
    "description": "Ultrasonic diffuser with LED lighting",
    "image": "https://images.unsplash.com/photo-1707920961189-290d19b363f3?w=400&h=300&fit=crop"
  }
]
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@moodmart.com',
    password: '$2b$10$Q9f0uVYFz1Xz3W0kqG0p9O6VgQ7k5LkJH6Z8gk6JQ7xk2Y4x8F9G2', // hashed 'admin123'
    role: 'admin',
  },
  {
    name: 'Jane Doe',
    email: 'jane@moodmart.com',
    password: '$2b$10$Q9f0uVYFz1Xz3W0kqG0p9O6VgQ7k5LkJH6Z8gk6JQ7xk2Y4x8F9G2', // hashed 'password123'
    role: 'user',
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: '$2b$10$M3vWc1P9K8sQ5LzX6F0JQO9N4gY7H2D1Rk8ZpT6bXcV5U2W9A3B7e', // hashed '123456'
    role: 'user',
  }
];



async function seed() {
      await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB');

      await CartSession.deleteMany({});
      const createdCartSessions = await CartSession.insertMany(cartSessions);
      console.log(`Inserted ${createdCartSessions.length} cart sessions`);

      await CheckoutSession.deleteMany({});
      const createdCheckoutSessions = await CheckoutSession.insertMany(checkoutSessions);
      console.log(`Inserted ${createdCheckoutSessions.length} checkout sessions`);

      await DashboardStat.deleteMany({});
      const createdDashboardStats = await DashboardStat.insertMany(dashboardStats);
      console.log(`Inserted ${createdDashboardStats.length} dashboard stats`);

      await Profile.deleteMany({});
      const createdProfiles = await Profile.insertMany(profiles);
      console.log(`Inserted ${createdProfiles.length} profiles`);

      await Settings.deleteMany({});
      const createdSettings = await Settings.insertMany(settings);
      console.log(`Inserted ${createdSettings.length} settings`);

      await ShopProduct.deleteMany({});
      const createdShopProducts = await ShopProduct.insertMany(shopProducts);
      console.log(`Inserted ${createdShopProducts.length} shop products`);

      await OrderSuccess.deleteMany({});
      const createdOrderSuccesses = await OrderSuccess.insertMany(orderSuccesses);
      console.log(`Inserted ${createdOrderSuccesses.length} order successes`);
    await BreathingSession.deleteMany({});
    const createdBreathingSessions = await BreathingSession.insertMany(breathingSessions);
    console.log(`Inserted ${createdBreathingSessions.length} breathing sessions`);

    await FaceScanSession.deleteMany({});
    const createdFaceScanSessions = await FaceScanSession.insertMany(faceScanSessions);
    console.log(`Inserted ${createdFaceScanSessions.length} face scan sessions`);
  try {
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    await CommunityPost.deleteMany({});
    const createdCommunityPosts = await CommunityPost.insertMany(communityPosts);
    console.log(`Inserted ${createdCommunityPosts.length} community posts`);

    await QASession.deleteMany({});
    const createdQASessions = await QASession.insertMany(qaSessions);
    console.log(`Inserted ${createdQASessions.length} Q&A sessions`);

    await CommunityQuestion.deleteMany({});
    const createdCommunityQuestions = await CommunityQuestion.insertMany(communityQuestions);
    console.log(`Inserted ${createdCommunityQuestions.length} community questions`);

    await MoodEntry.deleteMany({});
    const createdMoodEntries = await MoodEntry.insertMany(moodEntries);
    console.log(`Inserted ${createdMoodEntries.length} mood entries`);

    await Notification.deleteMany({});
    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`Inserted ${createdNotifications.length} notifications`);

    await Order.deleteMany({});
    const createdOrders = await Order.insertMany(orders);
    console.log(`Inserted ${createdOrders.length} orders`);

    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log(`Inserted ${created.length} products`);

    await User.deleteMany({});
    const createdUsers = await User.insertMany(users);
    console.log(`Inserted ${createdUsers.length} users`);

    await AudioTrack.deleteMany({});
    const createdTracks = await AudioTrack.insertMany(audioTracks);
    console.log(`Inserted ${createdTracks.length} audio tracks`);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
