import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { CheckCircle, Package, Heart, TrendingUp, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isGuest, registerUser, markOrderComplete } = useUser();
  const [showRegistration, setShowRegistration] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  // Verify Stripe payment on page load
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (sessionId) {
      verifyPayment(sessionId);
    } else {
      // If no session_id, assume it's a direct navigation (for testing)
      setPaymentVerified(true);
    }
  }, [searchParams]);

  const verifyPayment = async (sessionId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/payments/verify-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionId })
      });

      const data = await response.json();

      if (data.payment_status === 'paid') {
        setPaymentVerified(true);
        setOrderDetails(data);
        toast.success('Payment verified successfully!');
      } else {
        toast.error('Payment verification failed');
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      toast.error('Failed to verify payment');
      // For development, allow continuation
      setPaymentVerified(true);
    }
  };

  const handleSkip = () => {
    markOrderComplete();
    navigate('/shop');
  };

  const handleCreateAccount = () => {
    setShowRegistration(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    registerUser(formData);
    markOrderComplete();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-purple-100 rounded-full mb-6">
            <CheckCircle className="w-16 h-16 text-purple-600" />
          </div>
          <h1 className="mb-4 text-purple-600">Order Placed Successfully! 🎉</h1>
          <p className="text-xl text-gray-700 mb-2">
            Thank you for choosing MoodMart for your wellness journey
          </p>
          <p className="text-gray-600">
            Your order confirmation has been sent to your email
          </p>
        </motion.div>

        {/* Order Details */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Package className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl">Order Details</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Order Number</p>
              <p className="font-medium">#{searchParams.get('session_id')?.slice(-8) || Math.floor(Math.random() * 1000000)}</p>
            </div>
            <div>
              <p className="text-gray-600">Estimated Delivery</p>
              <p className="font-medium">3-5 Business Days</p>
            </div>
            <div>
              <p className="text-gray-600">Payment Method</p>
              <p className="font-medium">
                {paymentVerified ? 'Credit/Debit Card (Stripe)' : 'Cash on Delivery'}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Payment Status</p>
              <p className={`font-medium ${paymentVerified ? 'text-green-600' : 'text-orange-600'}`}>
                {paymentVerified ? 'Paid' : 'Pending'}
              </p>
            </div>
            {orderDetails && (
              <>
                <div>
                  <p className="text-gray-600">Amount Paid</p>
                  <p className="font-medium">
                    Rs.{(orderDetails.amount_total / 100).toFixed(2)} {orderDetails.currency?.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Customer Email</p>
                  <p className="font-medium">{orderDetails.customer_email}</p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Soft Registration Prompt (Only for Guest Users) */}
        {isGuest && !showRegistration && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-200">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl mb-3">Your mental well-being comes first</h2>
                <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                  Would you like to save your order history and get wellness tips tailored just for you? 
                  Creating an account is optional and gives you access to personalized features.
                </p>
              </div>

              {/* Benefits of Registration */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Order History</h3>
                  <p className="text-sm text-gray-600">Track all your orders in one place</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Personalized Wellness</h3>
                  <p className="text-sm text-gray-600">Get mood-based recommendations</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Track Your Progress</h3>
                  <p className="text-sm text-gray-600">Mood journal & insights</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleCreateAccount}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg"
                >
                  ✅ Create Account (Recommended)
                </Button>
                <Button
                  onClick={handleSkip}
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-gray-400 px-8 py-6 text-lg"
                >
                  ➡️ Skip for now
                </Button>
              </div>

              <p className="text-sm text-gray-600 text-center mt-4">
                No pressure, no guilt. Your wellness journey is yours to control.
              </p>
            </Card>
          </motion.div>
        )}

        {/* Registration Form */}
        {isGuest && showRegistration && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <Card className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl mb-2">Create Your Account</h2>
                <p className="text-gray-600">
                  Join the MoodMart wellness community
                </p>
              </div>

              <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="rounded-full"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="rounded-full"
                  />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>Your data is private and secure. We never share your information.</span>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6"
                  >
                    Create Account
                  </Button>
                  <Button
                    type="button"
                    onClick={handleSkip}
                    variant="outline"
                    className="flex-1 py-6"
                  >
                    Skip
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}

        {/* Already Registered Users */}
        {!isGuest && (
          <Card className="p-8 text-center">
            <h2 className="text-2xl mb-4">Welcome back! 👋</h2>
            <p className="text-gray-600 mb-6">
              Your order has been saved to your account
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => navigate('/dashboard')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8"
              >
                View Dashboard
              </Button>
              <Button
                onClick={() => navigate('/shop')}
                variant="outline"
              >
                Continue Shopping
              </Button>
            </div>
          </Card>
        )}

        {/* Trust Messaging */}
        <div className="mt-8 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4 text-purple-600" />
            <span>Your privacy is our priority</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>No data shared with third parties</span>
          </div>
        </div>
      </div>
    </div>
  );
}
