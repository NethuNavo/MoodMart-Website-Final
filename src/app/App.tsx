import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { MoodProvider } from './context/MoodContext';
import { NotificationProvider } from './context/NotificationContext';
import { UserProvider } from './context/UserContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { MoodTrackerPage } from './pages/MoodTrackerPage';
import { FaceScanPage } from './pages/FaceScanPage';
import { AudioTherapyPage } from './pages/AudioTherapyPage';
import { BreathingPage } from './pages/BreathingPage';
import { ShopPage } from './pages/ShopPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { CommunityPage } from './pages/CommunityPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <MoodProvider key="mood-provider">
          <NotificationProvider>
            <div className="min-h-screen flex flex-col bg-white">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/mood" element={<MoodTrackerPage />} />
                  <Route path="/face-scan" element={<FaceScanPage />} />
                  <Route path="/audio" element={<AudioTherapyPage />} />
                  <Route path="/breathing" element={<BreathingPage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/admin" element={<AdminDashboardPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </main>
              <Footer />
              <Toaster position="bottom-right" richColors />
            </div>
          </NotificationProvider>
        </MoodProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;