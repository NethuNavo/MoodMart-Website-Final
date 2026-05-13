import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { API_BASE_URL } from '../utils/api';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group';
import { Separator } from '../components/ui/separator';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { 
  CreditCard, 
  Smartphone, 
  Building2, 
  Package, 
  Lock, 
  CheckCircle,
  ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';

type PaymentMethod = 'cod' | 'stripe' | 'mobile' | 'bank';

const checkoutBanner = new URL('../../assets/checkout-banner.png', import.meta.url).href;

export function CheckoutPage() {
  const { cart, isAuthenticated } = useMood();
  const { user } = useUser();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // Shipping details
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Mobile wallet
    mobileNumber: '',
    
    // Bank transfer
    bankSlip: null as File | null,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 300;
  const total = subtotal + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error('Please fill in all shipping details');
      return;
    }

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    if (paymentMethod === 'mobile') {
      if (!formData.mobileNumber) {
        toast.error('Please enter your mobile number');
        return;
      }
    }

    setIsProcessing(true);

    try {
      if (paymentMethod !== 'stripe') {
        toast.success('Order placed successfully!');
        setIsProcessing(false);
        navigate('/order-success');
        return;
      }

      // Prepare data for Stripe
      const checkoutData = {
        cart: cart.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          description: item.description,
          image: item.image
        })),
        shipping: shipping,
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          paymentMethod: 'Stripe'
        }
      };

      // Call Stripe API
      console.log('Calling create-checkout-session with API_BASE_URL:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/api/payments/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData)
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Stripe checkout response:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || `Failed to create checkout session: ${response.status}`);
      }

      if (data.url) {
        console.log('Redirecting to Stripe checkout:', data.url);
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No checkout URL received from server');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      console.error('Error details:', error.message);
      toast.error(`Payment setup failed: ${error.message || 'Please try again.'}`);
      setIsProcessing(false);
    }
  };

  const getButtonText = () => {
    if (isProcessing) return 'Processing...';
    switch (paymentMethod) {
      case 'cod': return 'Place Order';
      case 'stripe': return 'Pay with Stripe';
      case 'mobile': return 'Pay via Mobile';
      case 'bank': return 'Complete Order';
      default: return 'Place Order';
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md lux-elevated">
          <Package className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Add some wellness products to continue with checkout
          </p>
          <Button
            onClick={() => navigate('/shop')}
            className="lux-btn lux-btn-primary px-8 py-3"
          >
            Browse Products
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="-mx-4 sm:-mx-6 lg:-mx-8 mb-4">
            <img
              src={checkoutBanner}
              alt="Checkout banner"
              className="w-full h-60 sm:h-80 object-cover object-center"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* STEP 1: Shipping Details */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">1</div>
                <h2 className="text-xl">Shipping Details</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    placeholder="+94 77 123 4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main Street"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="Colombo"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="Western"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip/Postal Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    placeholder="10100"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {!isAuthenticated && (
                <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-teal-50 border border-purple-200 rounded-xl lux-elevated">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-800 mb-2">
                        <strong>You're checking out as a guest</strong> — no account needed! 🎉
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        Your mental well-being comes first. Complete your order stress-free.
                      </p>
                      <button
                        onClick={() => navigate('/auth', { state: { from: 'checkout' } })}
                        className="text-xs text-purple-600 hover:text-purple-700 underline"
                      >
                        Have an account? Sign in for order tracking
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* STEP 2: Payment Method */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">2</div>
                <h2 className="text-xl">Select Payment Method</h2>
              </div>

              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as PaymentMethod)}>
                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Package className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay when you receive your order</p>
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'stripe' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <RadioGroupItem value="stripe" id="stripe" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Stripe Checkout</span>
                      </div>
                      <p className="text-sm text-gray-600">Pay securely with Stripe using Visa, MasterCard, or Amex</p>
                    </div>
                  </label>

                  {/* Mobile Wallets */}
                  <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'mobile' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <RadioGroupItem value="mobile" id="mobile" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Smartphone className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Mobile Wallets</span>
                      </div>
                      <p className="text-sm text-gray-600">eZ Cash, mCash, Genie</p>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank' ? 'border-purple-600 bg-purple-50' : 'border-gray-200 hover:border-purple-300'
                  }`}>
                    <RadioGroupItem value="bank" id="bank" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-5 h-5 text-purple-600" />
                        <span className="font-medium">Bank Transfer</span>
                      </div>
                      <p className="text-sm text-gray-600">Upload payment slip after transfer</p>
                    </div>
                  </label>
                </div>
              </RadioGroup>
            </Card>

            {/* STEP 3: Payment Details (Dynamic based on selection) */}
            {paymentMethod !== 'cod' && (
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center">3</div>
                  <h2 className="text-xl">Payment Details</h2>
                </div>

                {/* Stripe Checkout Notice */}
                {paymentMethod === 'stripe' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                      <p className="font-medium text-gray-800 mb-2">Stripe Checkout</p>
                      <p className="text-sm text-gray-600">
                        You will be redirected to Stripe's secure checkout page to complete your card payment.
                        No card details are stored by MoodMart on this site.
                      </p>
                    </div>
                  </div>
                )}

                {/* Mobile Wallet Form */}
                {paymentMethod === 'mobile' && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="mobileNumber">Mobile Number *</Label>
                      <Input
                        id="mobileNumber"
                        name="mobileNumber"
                        placeholder="+94 77 123 4567"
                        value={formData.mobileNumber}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800">
                        You will receive a payment request on your mobile wallet app.
                      </p>
                    </div>
                  </div>
                )}

                {/* Bank Transfer Instructions */}
                {paymentMethod === 'bank' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2">Bank Transfer Details:</h3>
                      <p className="text-sm text-gray-700 mb-1"><strong>Bank:</strong> Commercial Bank</p>
                      <p className="text-sm text-gray-700 mb-1"><strong>Account Name:</strong> MoodMart Wellness</p>
                      <p className="text-sm text-gray-700 mb-1"><strong>Account Number:</strong> 1234567890</p>
                      <p className="text-sm text-gray-700"><strong>Branch:</strong> Colombo</p>
                    </div>
                    <div>
                      <Label htmlFor="bankSlip">Upload Payment Slip (Optional)</Label>
                      <Input
                        id="bankSlip"
                        name="bankSlip"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          setFormData(prev => ({ ...prev, bankSlip: file }));
                        }}
                      />
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 lg:sticky lg:top-24">
              <h2 className="text-xl mb-6">Order Summary</h2>

              {/* Product List */}
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex-shrink-0 overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm text-purple-600">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Price Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-purple-600">FREE</span>
                      ) : (
                        `Rs.${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl text-purple-600">Rs.{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <Button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full lux-btn-primary py-6 mb-4"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  getButtonText()
                )}
              </Button>

              {/* Trust & Security */}
              <div className="space-y-3 pt-4 border-t">
                <h3 className="font-medium text-sm mb-3">🔐 Safe & Secure Payment</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span>SSL Encrypted Connection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Your data is protected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <span>100% Safe Payment</span>
                </div>

                {/* Payment Logos */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">Visa</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">MasterCard</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">PayHere</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">Genie</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}