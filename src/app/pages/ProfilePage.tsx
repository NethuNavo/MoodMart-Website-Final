import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { 
  User, Calendar, 
  Edit, Camera, Mail,
  Lock, LogOut, Trash2
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
const profileHeaderImage = new URL('../../assets/c1c22aeaf747e6e647054c44eeb1adb7396ee566.png', import.meta.url).href;

export function ProfilePage() {
  const { logout } = useMood();
  const { user, logoutUser } = useUser();
  const navigate = useNavigate();

  // Profile/settings state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');

  useEffect(() => {
    setName(user.name || '');
    setEmail(user.email || '');
  }, [user]);
  
  const userName = user.name || 'User';
  const userEmail = user.email || 'user@email.com';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);


  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // Save all settings (mock)
    toast.success('Settings saved successfully!');
  };

  const handleLogout = () => {
    logoutUser();
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      logoutUser();
      logout();
      toast.success('Account deleted');
      navigate('/');
    }
  };



  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img 
            src={profileHeaderImage} 
            alt="Profile - View your wellness journey & achievements" 
            className="w-full h-60 sm:h-80 object-cover animate-fade-in"
          />
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-5 left-10 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-5 right-10 w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <Card className="p-8 mb-8 bg-gradient-to-r from-purple-600 to-teal-600 text-white relative overflow-hidden lux-elevated">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-purple-600 text-4xl font-bold shadow-xl lux-elevated">
                  {initials}
                </div>
                <button className="absolute bottom-0 right-0 bg-teal-500 hover:bg-teal-600 text-white p-2 rounded-full shadow-lg transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl mb-2 lux-heading">{userName}</h1>
                <div className="flex flex-col md:flex-row gap-4 text-white/90 mb-4">
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Mail className="h-4 w-4" />
                    <span>{userEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center md:justify-start">
                    <Calendar className="h-4 w-4" />
                    <span>Member since Jan 2025</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Premium Member</span>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm">Wellness Enthusiast</span>
                </div>
              </div>

            </div>
          </Card>







          {/* Account & Settings Sections */}
          <div className="mt-16 max-w-4xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
            {/* Profile Settings */}
            <section className="bg-white rounded-2xl p-6 lux-elevated">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl text-gray-900">Profile Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-3">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-teal-400 flex items-center justify-center overflow-hidden">
                        {profilePicture ? (
                          <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-12 h-12 text-white" />
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 bg-purple-600 rounded-full p-2 cursor-pointer hover:bg-purple-700 transition-colors">
                        <Camera className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleProfilePictureUpload}
                        />
                      </label>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Upload a profile picture</p>
                      <p className="text-gray-400">JPG, PNG or GIF (max. 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Name / Username */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                    Name / Username
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </section>

            {/* Account Settings */}
            <section className="bg-white rounded-2xl p-6 lux-elevated">
              <div className="flex items-center gap-3 mb-6">
                <Lock className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl text-gray-900">Account Settings</h2>
              </div>

              <div className="space-y-6">
                {/* Password */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-gray-900 mb-2">
                      Current Password
                    </label>
                    <input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-gray-900 mb-2">
                      New Password
                    </label>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      twoFactorAuth ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Logout / Delete Account */}
                <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </section>

            {/* Save Changes Button */}
            <div className="sticky bottom-6 mt-8">
              <button
                onClick={handleSaveChanges}
                className="w-full lux-btn lux-btn-primary py-4 font-semibold text-lg"
              >
                Save Changes
              </button>
            </div>
        </div>
      </div>
    </div>
  </div>
  );
}