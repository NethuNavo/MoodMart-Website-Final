import { useMood } from '../context/MoodContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ShoppingCart, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const cartBanner = new URL('../../assets/Gemini_Generated_Image_hte0ibhte0ibhte0 (1).png', import.meta.url).href;

export function CartPage() {
  const { cart, removeFromCart, updateCartQuantity } = useMood();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 300; // Free shipping above Rs.5000
  const discount = appliedCoupon ? (subtotal * appliedCoupon.discount) : 0;
  const total = subtotal + shipping - discount;

  const applyCoupon = () => {
    // Mock coupon codes
    const validCoupons: Record<string, number> = {
      'WELLNESS10': 0.10,
      'MOOD20': 0.20,
      'FREESHIP': 0.05,
    };

    const code = couponCode.toUpperCase();
    if (validCoupons[code]) {
      setAppliedCoupon({ code, discount: validCoupons[code] });
      toast.success(`Coupon ${code} applied! ${(validCoupons[code] * 100)}% discount`);
    } else {
      toast.error('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.info('Coupon removed');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <Card className="p-12 text-center max-w-md lux-elevated">
          <ShoppingCart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
          <h1 className="text-3xl mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">
            Looks like you haven't added any wellness products yet.
          </p>
          <Button
            onClick={() => navigate('/shop')}
            className="lux-btn-primary px-6 py-2"
          >
            Continue Shopping
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
              src={cartBanner}
              alt="Your Shopping Cart"
              className="w-full h-60 sm:h-80 object-cover object-center"
            />
          </div>
          <p className="text-xl font-semibold text-purple-700 bg-purple-50 inline-block px-3 py-2 rounded-lg shadow-sm">
            {cart.length} {cart.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {subtotal < 5000 && (
              <Card className="p-4 bg-gradient-to-r from-teal-50 to-purple-50 lux-elevated">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Add Rs.{(5000 - subtotal).toFixed(2)} more for FREE shipping!</span>
                  <span className="text-sm text-purple-600">{((subtotal / 5000) * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-purple-600 to-purple-400 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((subtotal / 5000) * 100, 100)}%` }}
                  />
                </div>
              </Card>
            )}

            {/* Cart Items List */}
            {cart.map((item) => (
              <Card key={item.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Product Image */}
                  <div className="w-full lg:w-32 h-32 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden lux-elevated">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="mb-1">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Category: {item.category}</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 transition-colors ml-4"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-600">Quantity:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Rs.{item.price.toFixed(2)} each</p>
                        <p className="text-xl text-purple-600">Rs.{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 lg:sticky lg:top-24 lux-elevated">
              <h2 className="text-xl mb-6 lux-heading">Order Summary</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Have a coupon code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center gap-2 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <span className="text-sm text-purple-700 flex-1">
                      {appliedCoupon.code} applied
                    </span>
                    <button
                      onClick={removeCoupon}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      onClick={applyCoupon}
                      className="lux-btn-primary px-6 py-2 text-sm"
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Try: WELLNESS10, MOOD20, or FREESHIP
                </p>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between text-purple-600">
                    <span>Discount ({(appliedCoupon.discount * 100)}%)</span>
                    <span>-Rs.{discount.toFixed(2)}</span>
                  </div>
                )}

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

                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total</span>
                    <span className="text-2xl text-purple-600">Rs.{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full lux-btn-primary rounded-full py-6 text-lg"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-center text-gray-600">
                  ✨ No account required • Guest checkout available
                </p>
                <Button
                  onClick={() => navigate('/shop')}
                  className="w-full lux-btn-primary"
                >
                  Continue Shopping
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Secure Payment
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% Safe & Protected
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Easy Returns
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}