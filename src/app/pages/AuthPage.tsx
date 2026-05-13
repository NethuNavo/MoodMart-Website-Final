import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { authAPI, tokenManager } from '../utils/api';
import { toast } from 'sonner';
const logo = new URL('../../assets/0b38a103a78cc9cd2458edca47c9ee2cf8746513.png', import.meta.url).href;

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useMood();
  const { registerUser, loginUser, logoutUser } = useUser();
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  // Check if user came from cart/checkout
  const fromCheckout = location.state?.from === 'checkout';
  const fromCart = location.state?.from === 'cart';
  const [isLoading, setIsLoading] = useState(false);

  const handleGuestAccess = () => {
    logoutUser();
    navigate(fromCheckout ? '/checkout' : fromCart ? '/cart' : '/shop');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let response;
      
      if (activeTab === 'signup') {
        response = await authAPI.register({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        });
        toast.success('Account created successfully!');
      } else {
        response = await authAPI.login({
          email: formData.email,
          password: formData.password,
        });
        toast.success('Welcome back!');
      }

      tokenManager.setToken(response.token);
      loginUser({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        hasCompletedOrder: true,
      });
      login({
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        role: response.user.role,
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0],
      });

      const isAdminUser = response.user.role === 'admin' || response.user.email === 'admin@moodmart.com';

      if (isAdminUser) {
        navigate('/admin');
      } else if (fromCheckout) {
        navigate('/checkout');
      } else if (fromCart) {
        navigate('/cart');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

            {activeTab === 'login' && (
              <button
                type="button"
                onClick={handleGuestAccess}
                className="w-full mt-4 border border-purple-600 text-purple-600 py-3 rounded-full font-semibold text-lg transition-colors hover:bg-purple-50"
              >
                Continue as Guest
              </button>
            )}
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

        </div>
      </div>
    </div>
  );
}
