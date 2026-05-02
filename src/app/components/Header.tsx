import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { MiniCart } from './MiniCart';
import { useState, useEffect } from 'react';
const logo = new URL('../../assets/0b38a103a78cc9cd2458edca47c9ee2cf8746513.png', import.meta.url).href;

export function Header() {
  const location = useLocation();
  const { cart, isAuthenticated, logout } = useMood();
  const { isAdmin } = useUser();
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
          <div className="flex flex-wrap items-center justify-between gap-3 py-2 md:h-18">
            <Link to="/" className="flex items-center gap-3 group">
              <img src={logo} alt="MoodMart" className="h-10 w-10 md:h-12 md:w-12 transform group-hover:scale-110 transition-transform duration-300" />
              <span className="text-xl md:text-2xl lux-heading">MoodMart</span>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'text-purple-700 bg-purple-50 shadow-sm'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === '/admin'
                      ? 'text-purple-700 bg-purple-50 shadow-sm'
                      : 'text-gray-600 hover:text-purple-700 hover:bg-purple-50'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>

            <button
              type="button"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="md:hidden p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => setIsMiniCartOpen(true)}
                className="relative cursor-pointer group"
              >
                <ShoppingCart className={`h-6 w-6 transition-all duration-300 group-hover:text-purple-600 group-hover:scale-110 ${isMiniCartOpen ? 'text-purple-600' : 'text-gray-600'}`} />
                {cartItemsCount > 0 && (
                  <span 
                    className={`absolute -top-2 -right-2 bg-gradient-to-r from-var(--lux-primary) to-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center transition-all shadow-lg ${
                      cartAnimation ? 'animate-bounce scale-110' : ''
                    }`}
                  >
                    {cartItemsCount}
                  </span>
                )}
              </button>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-gray-600 hover:text-purple-600 transition-all duration-300 hover:scale-110">
                    <User className="h-6 w-6" />
                  </Link>
                  <button onClick={logout} className="text-gray-600 hover:text-red-600 transition-all duration-300 hover:scale-110">
                    <LogOut className="h-6 w-6" />
                  </button>
                </>
              ) : (
                <Link to="/auth" className="lux-btn-primary px-4 py-2">
                  Login
                </Link>
              )}
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