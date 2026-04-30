import { useState, useEffect } from 'react';
import { X, ShoppingCart, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface MiniCartProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MiniCart({ isOpen, onClose }: MiniCartProps) {
  const { cart, removeFromCart, updateCartQuantity } = useMood();
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      onClose();
      // Remove purple color from cart icon after closing MiniCart (e.g., after Continue Shopping)
      // This is handled by Header via isMiniCartOpen prop
    }, 300);
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleViewCart = () => {
    handleClose();
    navigate('/cart');
  };

  const handleCheckout = () => {
    handleClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          isAnimating ? 'opacity-50' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      {/* Slide Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isAnimating ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B5B95] to-[#B4D4D3] text-white p-6 flex items-center justify-between lux-elevated">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6" />
            <div>
              <h2 className="text-xl">Shopping Cart</h2>
              <p className="text-sm opacity-90">{cart.length} {cart.length === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ maxHeight: 'calc(100vh - 280px)' }}>
          {cart.length === 0 ? (
              <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
              <Button
                onClick={handleClose}
                className="mt-4 lux-btn-primary"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            cart.map((item) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 flex gap-4 lux-elevated">
                {/* Product Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden lux-elevated">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm mb-1 truncate">{item.name}</h3>
                  <p className="text-purple-600 mb-2">Rs.{item.price.toFixed(2)}</p>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
              <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="text-2xl text-gray-900">Rs.{subtotal.toFixed(2)}</span>
            </div>

            {/* Buttons */}
              <div className="space-y-2">
              <Button
                onClick={handleViewCart}
                className="w-full lux-btn-primary rounded-full py-6 text-lg"
              >
                View Cart
              </Button>
              <Button
                onClick={handleCheckout}
                className="w-full lux-btn-primary rounded-full py-6 text-lg"
              >
                Checkout
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
