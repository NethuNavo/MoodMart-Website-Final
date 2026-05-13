import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, LogOut, Settings, User, LayoutDashboard } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useMood } from '../context/MoodContext';

export function UserProfileDropdown() {
  const { user, logoutUser } = useUser();
  const { logout } = useMood();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const userName = user.name || 'User';
  const displayName = userName.split(' ')[0] || userName;
  const userEmail = user.email || 'user@email.com';
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase() || 'U';

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLogout = () => {
    setIsOpen(false);
    logoutUser();
    logout();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-3xl bg-gradient-to-r from-purple-600 to-violet-600 text-white shadow-[0_15px_30px_-15px_rgba(124,58,237,0.65)] transition-all duration-200 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group min-w-[140px] max-w-[220px] flex-shrink-0"
        aria-label="User profile menu"
        aria-expanded={isOpen}
      >
        {/* Circular Avatar */}
        <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm transition-all duration-200">
          {initials}
        </div>

        {/* User Name (visible on desktop) */}
        <span className="hidden md:inline overflow-hidden whitespace-nowrap truncate max-w-[100px] text-sm font-medium text-white">
          {displayName}
        </span>

        {/* Dropdown Arrow */}
        <ChevronDown
          className={`h-4 w-4 text-white transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header with user info */}
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                <p className="text-xs text-gray-600 truncate">{userEmail}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            {/* Dashboard */}
            <button
              onClick={() => handleNavigation('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 group"
            >
              <LayoutDashboard className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* My Profile */}
            <button
              onClick={() => handleNavigation('/profile')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 group"
            >
              <User className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              <span className="font-medium">My Profile</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => handleNavigation('/settings')}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors duration-150 group"
            >
              <Settings className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
              <span className="font-medium">Settings</span>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-gray-100"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 group"
            >
              <LogOut className="h-4 w-4 text-red-400 group-hover:text-red-600 transition-colors" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
