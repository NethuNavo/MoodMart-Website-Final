import { MessageSquare, Heart, User, Send, Shield, Flag, Calendar, Award, TrendingUp, Edit, Trash2, BookmarkPlus, Clock, ShieldCheck } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useMood } from '../context/MoodContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const headerBg = new URL('../../assets/a29c988cecf7518aefa1051e53ffc3b671037802.png', import.meta.url).href;
const communityForumImage = new URL('../../assets/90621acae070342fba2db6779262061faacbe89a.png', import.meta.url).href;

interface Post {
  id: string;
  author: string; // Anonymous username
  category: string;
  title: string;
  content: string;
  likes: number;
  replies: number;
  timeAgo: string;
  moodTag?: string;
  isLiked?: boolean;
}

interface QASession {
  id: string;
  topic: string;
  coach: string;
  date: string;
  time: string;
  status: 'upcoming' | 'live' | 'completed';
}

interface Question {
  id: string;
  question: string;
  answer?: string;
  coach?: string;
  timeAgo: string;
  saves: number;
  isSaved?: boolean;
}

// Generate random anonymous username
const generateAnonymousName = (): string => {
  const adjectives = ['Calm', 'Peaceful', 'Gentle', 'Serene', 'Tranquil', 'Mindful', 'Zen', 'Quiet', 'Soft', 'Bright'];
  const nouns = ['Leaf', 'Wave', 'Cloud', 'Sky', 'Moon', 'Star', 'Breeze', 'Sun', 'Rain', 'Dawn'];
  const randomAdj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNum = Math.floor(Math.random() * 99) + 1;
  return `${randomAdj}${randomNoun}${randomNum}`;
};

export function CommunityPage() {
  const { isRegistered } = useUser();
  const { moodEntries } = useMood();
  const navigate = useNavigate();
  
  const [anonymousName] = useState(() => generateAnonymousName());
  const [newPost, setNewPost] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'forum' | 'qa'>('forum');

  // Redirect if not registered
  useEffect(() => {
    if (!isRegistered) {
      toast.error('Please log in to access the Community Forum');
      navigate('/auth');
    }
  }, [isRegistered, navigate]);

  // Get current mood
  const currentMood = moodEntries.length > 0 
    ? moodEntries[moodEntries.length - 1].mood 
    : 'calm';

  // Weekly stats
  const weeklyStats = {
    postsShared: 3,
    repliesGiven: 8,
    supportReceived: 12,
    daysActive: 4,
  };

  const forumCategories = [
    { id: 'daily', icon: '🌱', name: 'Daily Experiences', description: 'Share personal stories & reflections', posts: 156 },
    { id: 'wellness', icon: '🧠', name: 'Mental Wellness Tips', description: 'Coping strategies & habits', posts: 203 },
    { id: 'anxiety', icon: '😌', name: 'Anxiety Support', description: 'Calm discussions & grounding tips', posts: 189 },
    { id: 'sleep', icon: '😴', name: 'Sleep & Rest', description: 'Sleep routines & recovery', posts: 142 },
    { id: 'motivation', icon: '💪', name: 'Motivation & Growth', description: 'Encouragement & progress stories', posts: 178 },
  ];

  const [posts, setPosts] = useState<Post[]>([
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
  ]);

  const qaSessions: QASession[] = [
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

  const [questions, setQuestions] = useState<Question[]>([
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
      saves: 62,
      isSaved: false,
    },
  ]);

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleSaveQuestion = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId 
        ? { ...q, saves: q.isSaved ? q.saves - 1 : q.saves + 1, isSaved: !q.isSaved }
        : q
    ));
    toast.success(questions.find(q => q.id === questionId)?.isSaved ? 'Answer removed from saved' : 'Answer saved!');
  };

  const handleSubmitPost = () => {
    if (!newPost.trim()) return;
    
    const post: Post = {
      id: Date.now().toString(),
      author: anonymousName,
      category: selectedCategory || 'daily',
      title: newPost.substring(0, 50) + (newPost.length > 50 ? '...' : ''),
      content: newPost,
      likes: 0,
      replies: 0,
      timeAgo: 'Just now',
      moodTag: currentMood,
      isLiked: false,
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
    toast.success('Your post has been shared anonymously!');
  };

  const handleSubmitQuestion = () => {
    if (!newQuestion.trim()) return;
    
    toast.success('Your question has been submitted anonymously to our wellness coaches!');
    setNewQuestion('');
  };

  const filteredPosts = selectedCategory 
    ? posts.filter(post => post.category === selectedCategory)
    : posts;

  // Don't render if not registered (will redirect)
  if (!isRegistered) return null;

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img 
            src={communityForumImage} 
            alt="Community Forum - You are not alone. Share, learn, and grow together." 
            className="w-full h-60 sm:h-80 object-cover animate-fade-in"
          />
        </div>
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="bg-gradient-to-br from-[#B4D4D3] via-white to-[#C5B8D8] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-8">
            <Button
              onClick={() => setActiveTab('forum')}
              className={`flex-1 py-6 rounded-2xl transition-all ${
                activeTab === 'forum'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Discussion Forum
            </Button>
            <Button
              onClick={() => setActiveTab('qa')}
              className={`flex-1 py-6 rounded-2xl transition-all ${
                activeTab === 'qa'
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/80 text-gray-700 hover:bg-white'
              }`}
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              Q&A with Coaches
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              
              {activeTab === 'forum' ? (
                <>
                  {/* Forum Categories */}
                  <div>
                    <h2 className="text-2xl mb-4 text-gray-900">Forum Categories</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {forumCategories.map(category => (
                        <Card
                          key={category.id}
                          onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                          className={`p-6 cursor-pointer transition-all hover:shadow-xl ${
                            selectedCategory === category.id
                              ? 'bg-gradient-to-br from-purple-100 to-teal-100 border-purple-300 shadow-lg'
                              : 'bg-white/80 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{category.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                              <p className="text-xs text-gray-500">{category.posts} posts</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* New Post Card */}
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h2 className="text-xl mb-4 text-gray-900">Share Your Experience</h2>
                    <Textarea
                      placeholder="What's on your mind? Share your thoughts, experiences, or ask for support... Your post will be anonymous."
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      rows={4}
                      className="mb-4 bg-white"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-gray-600">Your post is anonymous as <span className="font-semibold">{anonymousName}</span></p>
                      </div>
                      <Button 
                        onClick={handleSubmitPost}
                        disabled={!newPost.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Post
                      </Button>
                    </div>
                  </Card>

                  {/* Discussion Feed */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl text-gray-900">
                        {selectedCategory 
                          ? forumCategories.find(c => c.id === selectedCategory)?.name 
                          : 'Recent Discussions'}
                      </h2>
                      {selectedCategory && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCategory(null)}
                          className="text-gray-600"
                        >
                          View All
                        </Button>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      {filteredPosts.map(post => (
                        <Card key={post.id} className="p-6 hover:shadow-xl transition-all bg-white/80 backdrop-blur-sm">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-teal-200 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="font-medium text-gray-900">{post.author}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-sm text-gray-500">{post.timeAgo}</span>
                                {post.moodTag && (
                                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs capitalize">
                                    {post.moodTag}
                                  </span>
                                )}
                                <button className="ml-auto text-gray-400 hover:text-red-500 transition-colors">
                                  <Flag className="w-4 h-4" />
                                </button>
                              </div>
                              <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                              <p className="text-gray-600 mb-4">{post.content}</p>
                              <div className="flex items-center gap-6 text-sm">
                                <button 
                                  onClick={() => handleLikePost(post.id)}
                                  className={`flex items-center gap-2 transition-colors ${
                                    post.isLiked ? 'text-pink-600' : 'text-gray-500 hover:text-pink-600'
                                  }`}
                                >
                                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                                  <span>{post.likes} {post.likes === 1 ? 'Support' : 'Supports'}</span>
                                </button>
                                <button className="flex items-center gap-2 text-gray-500 hover:text-purple-600 transition-colors">
                                  <MessageSquare className="h-4 w-4" />
                                  {post.replies} replies
                                </button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Q&A Section */}
                  
                  {/* Upcoming Sessions */}
                  <div>
                    <h2 className="text-2xl mb-4 text-gray-900">Upcoming Q&A Sessions</h2>
                    <div className="space-y-4">
                      {qaSessions.map(session => (
                        <Card key={session.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-teal-400 rounded-full flex items-center justify-center flex-shrink-0">
                              <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium uppercase">
                                  {session.status}
                                </span>
                              </div>
                              <h3 className="font-semibold text-gray-900 text-lg mb-1">{session.topic}</h3>
                              <p className="text-gray-600 mb-3">with {session.coach}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {session.date}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {session.time}
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {/* Ask Question */}
                  <Card className="p-6 bg-white/80 backdrop-blur-sm">
                    <h2 className="text-xl mb-4 text-gray-900">Ask a Question Anonymously</h2>
                    <Textarea
                      placeholder="What would you like to ask our wellness coaches? Your question will be submitted anonymously..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                      rows={4}
                      className="mb-4 bg-white"
                    />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        <p className="text-sm text-gray-600">Anonymous question</p>
                      </div>
                      <Button 
                        onClick={handleSubmitQuestion}
                        disabled={!newQuestion.trim()}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Question
                      </Button>
                    </div>
                  </Card>

                  {/* Previous Q&A Answers */}
                  <div>
                    <h2 className="text-2xl mb-4 text-gray-900">Coach Answers</h2>
                    <div className="space-y-4">
                      {questions.map(q => (
                        <Card key={q.id} className="p-6 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
                          <div className="mb-4">
                            <div className="flex items-start gap-2 mb-3">
                              <MessageSquare className="w-5 h-5 text-purple-600 flex-shrink-0 mt-1" />
                              <p className="font-medium text-gray-900">{q.question}</p>
                            </div>
                            {q.answer && (
                              <div className="ml-7 pl-4 border-l-2 border-purple-200">
                                <div className="flex items-center gap-2 mb-2">
                                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium text-purple-700">{q.coach}</span>
                                  <span className="text-sm text-gray-400">• {q.timeAgo}</span>
                                </div>
                                <p className="text-gray-700">{q.answer}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <button
                              onClick={() => handleSaveQuestion(q.id)}
                              className={`flex items-center gap-2 transition-colors ${
                                q.isSaved ? 'text-purple-600' : 'text-gray-500 hover:text-purple-600'
                              }`}
                            >
                              <BookmarkPlus className={`h-4 w-4 ${q.isSaved ? 'fill-current' : ''}`} />
                              <span>{q.saves} saves</span>
                            </button>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Personal Progress */}
              <Card className="p-6 bg-gradient-to-br from-purple-100 to-teal-100">
                <h3 className="text-lg mb-4 text-gray-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Your Progress This Week
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Posts shared</span>
                    <span className="font-semibold text-purple-700">{weeklyStats.postsShared} 🌱</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Replies given</span>
                    <span className="font-semibold text-purple-700">{weeklyStats.repliesGiven} 💬</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Support received</span>
                    <span className="font-semibold text-purple-700">{weeklyStats.supportReceived} ❤️</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Days active</span>
                    <span className="font-semibold text-purple-700">{weeklyStats.daysActive} 📅</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-white/50 rounded-xl">
                  <p className="text-sm text-gray-700 text-center">
                    🎉 You shared {weeklyStats.postsShared} reflections this week!
                  </p>
                </div>
              </Card>

              {/* Community Guidelines */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg mb-4 text-gray-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  Community Guidelines
                </h3>
                <ul className="space-y-3 text-sm text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 text-lg">•</span>
                    <span>Be respectful and supportive to all members</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 text-lg">•</span>
                    <span>No medical advice or diagnosis allowed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 text-lg">•</span>
                    <span>Maintain anonymity for everyone's privacy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 text-lg">•</span>
                    <span>Report inappropriate content immediately</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 text-lg">•</span>
                    <span>Share experiences, not personal information</span>
                  </li>
                </ul>
              </Card>

              {/* Privacy Notice */}
              <Card className="p-6 bg-white/80 backdrop-blur-sm border-2 border-purple-200">
                <div className="flex items-start gap-3 mb-3">
                  <Shield className="w-6 h-6 text-purple-600 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Your Privacy Matters</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      All posts are anonymous. You appear as <span className="font-semibold">{anonymousName}</span>. No real names or photos required.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <Edit className="w-3 h-3" />
                      <span>Edit or delete your posts anytime</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Disclaimer */}
              <Card className="p-6 bg-yellow-50 border-2 border-yellow-200">
                <h3 className="font-semibold text-gray-900 mb-2">⚠️ Important Notice</h3>
                <p className="text-sm text-gray-700 mb-3">
                  This community provides peer support, not medical advice. If you're experiencing a mental health crisis, please contact a professional immediately.
                </p>
                <Button variant="outline" className="w-full border-yellow-400 hover:bg-yellow-100">
                  Crisis Resources
                </Button>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}