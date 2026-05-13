import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { MiniCart } from './MiniCart';
import { UserProfileDropdown } from './UserProfileDropdown';
import { useState, useEffect } from 'react';
const logo = new URL('../../assets/0b38a103a78cc9cd2458edca47c9ee2cf8746513.png', import.meta.url).href;

export function Header() {
  const location = useLocation();
  const { cart, isAuthenticated, logout } = useMood();
  const { isAdmin, logoutUser } = useUser();
  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartAnimation, setCartAnimation] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(0);

  // Animate cart badge when items are added
  useEffect(() => {
    if (cartItemsCount > prevCartCount) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 600);
    }
    setPrevCartCount(cartItemsCount);
  }, [cartItemsCount]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/mood', label: 'Mood' },
    { to: '/face-scan', label: 'Face Scan' },
    { to: '/audio', label: 'Audio' },
    { to: '/breathing', label: 'Breathing' },
    { to: '/shop', label: 'Shop' },
    { to: '/community', label: 'Community' },
    // show dashboard link when user is logged in
    ...(isAuthenticated ? [{ to: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <>
      <header className="site-header sticky top-0 z-50">
        <div className="container">
          <div className="flex h-16 items-center justify-between gap-4 md:gap-6">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 flex-shrink-0 group">
              <img src={logo} alt="MoodMart" className="h-10 w-10 md:h-12 md:w-12 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="hidden sm:inline text-lg md:text-2xl lux-heading">MoodMart</span>
            </Link>

            {/* Center: Navigation + Admin */}
            <nav className="hidden md:flex items-center gap-6 flex-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-purple-700 bg-purple-50 shadow-sm'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Group */}
            <div className="flex items-center gap-3 md:gap-4 flex-shrink-0">
              {/* Admin Link - Visible on md+ screens */}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                    location.pathname === '/admin'
                      ? 'text-purple-700 bg-purple-50 shadow-sm'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  Admin
                </Link>
              )}

              {/* Cart Icon */}
              <button
                onClick={() => setIsMiniCartOpen(true)}
                className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-all duration-200 hover:border-purple-300 hover:text-purple-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300 group"
                aria-label="Open cart"
              >
                <ShoppingCart className={`h-5 w-5 transition-all duration-300 group-hover:scale-110 ${isMiniCartOpen ? 'text-purple-600' : 'text-gray-600'}`} />
                {cartItemsCount > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 bg-gradient-to-r from-var(--lux-primary) to-pink-600 text-white text-[11px] rounded-full h-5 w-5 flex items-center justify-center transition-all shadow-lg font-semibold ${
                      cartAnimation ? 'animate-bounce scale-110' : ''
                    }`}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* Profile Dropdown or Login */}
              {isAuthenticated ? (
                <UserProfileDropdown />
              ) : (
                <Link to="/auth" className="lux-btn-primary h-10 px-4 flex items-center justify-center text-sm font-medium">
                  Login
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                aria-label="Toggle mobile menu"
                aria-expanded={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((open) => !open)}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className={`md:hidden mt-3 ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <nav className="grid gap-2 rounded-2xl border border-gray-200 bg-white/95 p-3 shadow-sm backdrop-blur-sm">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    location.pathname === link.to
                      ? 'bg-purple-50 text-purple-700 shadow-sm'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    location.pathname === '/admin'
                      ? 'bg-purple-50 text-purple-700 shadow-sm'
                      : 'text-gray-700 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
          </div>
        </div>
      </header>

      <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
    </>
  );
}