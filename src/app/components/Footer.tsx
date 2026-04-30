import { Link } from 'react-router-dom';
import { Instagram, Twitter, Linkedin, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { useUser } from '../context/UserContext';
import logo from '../../assets/f4c24801ede734faa0ef43426098838b5fa49112.png';


export function Footer() {
  const { isAdmin } = useUser();
  return (
    <footer className="bg-gradient-to-r from-[#5B5A7E] via-[#6B5B95] to-[#5B5A7E] text-white mt-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <img src={logo} alt="MoodMart" className="h-12 w-12" />
              <span className="text-xl font-semibold">MoodMart</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-6">
              Your dedicated space for mental clarity and emotional well-being. Enhance your journey to a happier, healthier you.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-3">
              <a href="#" className="bg-white/10 hover:bg-white/30 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/30 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/30 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/30 p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-lg">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold mb-4 text-lg">Features</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><Link to="/audio" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Guided Meditations</Link></li>
              <li><Link to="/community" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Community Forum</Link></li>
              <li><Link to="/mood" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Mood Tracker</Link></li>
              <li><Link to="/breathing" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Breathing Exercises</Link></li>
              <li><Link to="/shop" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Shop</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-2.5 text-sm text-white/70">
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">FAQ</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Contact Us</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Terms of Service</a></li>
              {isAdmin && (
                <li><Link to="/admin" className="hover:text-white hover:translate-x-1 inline-block transition-all duration-300">Admin Dashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Get in Touch */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <h3 className="font-semibold mb-4 text-lg">Get in Touch</h3>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-3 hover:text-white transition-colors duration-300">
                <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="mailto:support@moodmart.com" className="hover:underline">
                  support@moodmart.com
                </a>
              </li>
              <li className="flex items-start gap-3 hover:text-white transition-colors duration-300">
                <Phone className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <a href="tel:+12345678900" className="hover:underline">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-start gap-3 hover:text-white transition-colors duration-300">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>
                  123 Wellness Street<br />
                  Mindful City, MC 12345
                </span>
              </li>
            </ul>
          </div>
        </div>

        
      </div>
    </footer>
  );
}