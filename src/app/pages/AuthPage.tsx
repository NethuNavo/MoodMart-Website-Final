import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
const logo = new URL('../../assets/0b38a103a78cc9cd2458edca47c9ee2cf8746513.png', import.meta.url).href;
import { toast } from 'sonner';

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useMood();
  const { registerUser, loginUser } = useUser();
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Check if user came from cart/checkout
  const fromCheckout = location.state?.from === 'checkout';
  const fromCart = location.state?.from === 'cart';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (activeTab === 'signup') {
      registerUser({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      toast.success('Account created successfully!');
    } else {
      loginUser(formData.email, formData.password);
      toast.success('Welcome back!');
    }
    
    login();
    
    // Navigate based on where they came from
    if (fromCheckout) {
      navigate('/checkout');
    } else if (fromCart) {
      navigate('/cart');
    } else {
      navigate('/dashboard');
    }
  };

  const handleGuestCheckout = () => {
    navigate('/shop');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-purple-100 to-blue-200 flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        
        {/* White Card Container */}
        <div className="bg-white rounded-3xl p-8 lux-elevated">
          
          {/* Logo */}
          <div className="text-center mb-6">
            <img src={logo} alt="MoodMart" className="h-24 w-24 mx-auto mb-4" />
            <h1 className="text-3xl text-gray-900 mb-8">Join MoodMart</h1>
          </div>

          {/* Custom Tab Buttons */}
          <div className="grid grid-cols-2 gap-0 mb-8">
            <button
              onClick={() => setActiveTab('signup')}
              className={`py-3 text-center font-medium transition-all ${
                activeTab === 'signup'
                  ? 'bg-purple-600 text-white rounded-full'
                  : 'bg-gray-200 text-gray-700 rounded-full'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className={`py-3 text-center font-medium transition-all ${
                activeTab === 'login'
                  ? 'bg-purple-600 text-white rounded-full'
                  : 'bg-gray-200 text-gray-700 rounded-full'
              }`}
            >
              Login
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name - Only for Sign Up */}
            {activeTab === 'signup' && (
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-900 mb-2">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required={activeTab === 'signup'}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            )}
            
            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-full font-semibold text-lg transition-colors mt-6"
            >
              {activeTab === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {/* Already have account / Don't have account */}
          <div className="text-center mt-6">
            {activeTab === 'signup' ? (
              <p className="text-gray-600 text-sm">
                Already have your account?{' '}
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-purple-600 font-medium hover:underline"
                >
                  Log In
                </button>
              </p>
            ) : (
              <p className="text-gray-600 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => setActiveTab('signup')}
                  className="text-purple-600 font-medium hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

          {/* Guest Checkout */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleGuestCheckout}
              className="text-gray-700 font-medium hover:text-purple-600 transition-colors"
            >
              Guest Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
