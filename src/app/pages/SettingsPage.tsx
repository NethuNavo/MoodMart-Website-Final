import { useState } from 'react';
import { User, Mail, Lock, Bell, Palette, Globe, Shield, HelpCircle, LogOut, Trash2, Camera, Eye, EyeOff } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
const settingsHeaderImage = new URL('../../assets/368203aed1d463941c676b9b75867fef801eaf37.png', import.meta.url).href;

export function SettingsPage() {
  const { logout, currentTheme, setCurrentTheme, autoThemeEnabled, setAutoThemeEnabled } = useMood();
  const navigate = useNavigate();

  // Notifications
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [appNotifications, setAppNotifications] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);

  // App Preferences
  const [language, setLanguage] = useState('en');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');

  // Privacy & Security
  const [dataSharing, setDataSharing] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);

  const handleSaveChanges = () => {
    toast.success('Settings saved successfully!');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      toast.success('Account deleted');
      logout();
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <img
            src={settingsHeaderImage}
            alt="Settings - Manage your account and preferences"
            className="w-full h-60 sm:h-80 object-cover animate-fade-in"
          />
        </div>
        <div className="absolute top-5 left-10 w-24 h-24 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute bottom-5 right-10 w-32 h-32 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      </section>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Notifications */}
          <section className="bg-white rounded-2xl p-6 lux-elevated">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <button
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      emailNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* App Notifications */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">App Notifications</p>
                  <p className="text-sm text-gray-600">Get notified within the app</p>
                </div>
                <button
                  onClick={() => setAppNotifications(!appNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    appNotifications ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      appNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Promotional Emails */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Promotional Emails</p>
                  <p className="text-sm text-gray-600">Receive special offers and deals</p>
                </div>
                <button
                  onClick={() => setPromotionalEmails(!promotionalEmails)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    promotionalEmails ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      promotionalEmails ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* App Preferences */}
          <section className="bg-white rounded-2xl p-6 lux-elevated">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl text-gray-900">App Preferences</h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Color Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { key: 'neutral', label: 'Neutral', emoji: '🙂' },
                    { key: 'happy', label: 'Happy', emoji: '😊' },
                    { key: 'sad', label: 'Sad', emoji: '😢' },
                    { key: 'angry', label: 'Angry', emoji: '😠' },
                    { key: 'fearful', label: 'Fearful', emoji: '😨' },
                    { key: 'disgusted', label: 'Disgusted', emoji: '🤢' },
                    { key: 'surprised', label: 'Surprised', emoji: '😲' },
                  ].map((themeOption) => (
                    <button
                      key={themeOption.key}
                      onClick={() => setCurrentTheme(themeOption.key as any)}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                        currentTheme === themeOption.key
                          ? 'border-purple-600 bg-purple-50 text-purple-800 shadow-sm'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-xl">{themeOption.emoji}</span>
                      <div>
                        <div className="font-semibold capitalize">{themeOption.label}</div>
                        <div className="text-xs text-gray-500">
                          {themeOption.key === 'neutral' ? 'Soft neutral palette' :
                           themeOption.key === 'happy' ? 'Warm bright palette' :
                           themeOption.key === 'sad' ? 'Cool calm palette' :
                           themeOption.key === 'angry' ? 'Bold alert palette' :
                           themeOption.key === 'fearful' ? 'Clear blue palette' :
                           themeOption.key === 'disgusted' ? 'Fresh green palette' :
                           'Bright teal palette'}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Auto Theme Change</p>
                  <p className="text-sm text-gray-600">Automatically change theme based on your mood</p>
                </div>
                <button
                  onClick={() => setAutoThemeEnabled(!autoThemeEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    autoThemeEnabled ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      autoThemeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-900 mb-2">
                  Language
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                  <option value="ja">Japanese</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-3">Font Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {(['small', 'medium', 'large'] as const).map((sizeOption) => (
                    <button
                      key={sizeOption}
                      onClick={() => setFontSize(sizeOption)}
                      className={`px-4 py-3 rounded-lg border-2 transition-all capitalize ${
                        fontSize === sizeOption
                          ? 'border-purple-600 bg-purple-50 text-purple-600'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {sizeOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="bg-white rounded-2xl p-6 lux-elevated">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl text-gray-900">Privacy & Security</h2>
            </div>

            <div className="space-y-4">
              {/* Data Sharing */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Data Sharing</p>
                  <p className="text-sm text-gray-600">Share data with third-party services</p>
                </div>
                <button
                  onClick={() => setDataSharing(!dataSharing)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    dataSharing ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      dataSharing ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Activity Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Activity Status</p>
                  <p className="text-sm text-gray-600">Show when you're online</p>
                </div>
                <button
                  onClick={() => setActivityStatus(!activityStatus)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    activityStatus ? 'bg-purple-600' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      activityStatus ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </section>

          {/* Support */}
          <section className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <HelpCircle className="w-6 h-6 text-purple-600" />
              <h2 className="text-2xl text-gray-900">Support</h2>
            </div>

            <div className="space-y-3">
              <a
                href="#"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Help Center</p>
                    <p className="text-sm text-gray-600">Browse FAQs and guides</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </a>

              <a
                href="#"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-gray-900">Contact Support</p>
                    <p className="text-sm text-gray-600">Get help from our team</p>
                  </div>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            </div>
          </section>

          {/* Save Changes Button (Floating) */}
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
  );
};