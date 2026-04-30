import { X, Star, ShoppingCart, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Product } from '../context/MoodContext';

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

interface ProductDetailsModalProps {
  product: (Product & { rating: number; reviews: number; tag?: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  isAdded: boolean;
}

export default function ProductDetailsModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart,
  isAdded 
}: ProductDetailsModalProps) {
  const [selectedTab, setSelectedTab] = useState<'details' | 'reviews'>('details');
  const [helpfulReviews, setHelpfulReviews] = useState<Set<string>>(new Set());

  if (!product) return null;

  // Mock reviews data
  const productReviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah M.',
      rating: 5,
      date: '2 weeks ago',
      comment: 'This product has truly changed my daily routine! The quality is exceptional and I can feel the difference in my mood and stress levels.',
      helpful: 24
    },
    {
      id: '2',
      userName: 'John D.',
      rating: 4,
      date: '1 month ago',
      comment: 'Great value for money. Shipping was fast and the product arrived in perfect condition. Highly recommend!',
      helpful: 18
    },
    {
      id: '3',
      userName: 'Emma L.',
      rating: 5,
      date: '3 weeks ago',
      comment: 'Absolutely love it! Been using it every day and it\'s become an essential part of my wellness journey.',
      helpful: 31
    },
    {
      id: '4',
      userName: 'Mike R.',
      rating: 4,
      date: '1 week ago',
      comment: 'Good product overall. Does what it promises. Would buy again.',
      helpful: 12
    },
  ];

  const toggleHelpful = (reviewId: string) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const ratingDistribution = [
    { stars: 5, count: 180, percentage: 72 },
    { stars: 4, count: 45, percentage: 18 },
    { stars: 3, count: 15, percentage: 6 },
    { stars: 2, count: 7, percentage: 3 },
    { stars: 1, count: 3, percentage: 1 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden pointer-events-auto lux-elevated">
              {/* Header */}
              <div className="relative border-b border-gray-200 p-6">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Product Header */}
                <div className="grid md:grid-cols-2 gap-8 p-6">
                  {/* Image */}
                  <div className="relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-96 object-cover rounded-xl"
                    />
                    {product.tag && (
                      <span className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full">
                        {product.tag}
                      </span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <p className="text-sm text-gray-500 uppercase mb-2">{product.category}</p>
                    <h2 className="mb-4">{product.name}</h2>
                    
                    <div className="flex items-center gap-4 mb-4">
                      {renderStars(product.rating, 'lg')}
                      <span className="text-gray-600">
                        {product.rating} ({product.reviews} reviews)
                      </span>
                    </div>

                    <p className="text-gray-700 mb-6">{product.description}</p>

                    <div className="mb-6">
                      <p className="text-4xl text-purple-600 mb-2">Rs.{product.price.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">Free shipping on orders over Rs.5000</p>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className={`w-full py-4 rounded-xl transition-all flex items-center justify-center space-x-2 ${
                        isAdded
                          ? 'bg-purple-600 text-white hover:bg-purple-700'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span>Added to Cart</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="w-5 h-5" />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>

                    {/* Benefits */}
                    <div className="mt-6 space-y-3 bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>100% Authentic Products</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>30-Day Money Back Guarantee</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-purple-500" />
                        <span>Secure Payment Options</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-t border-gray-200">
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setSelectedTab('details')}
                      className={`flex-1 py-4 px-6 transition-colors ${
                        selectedTab === 'details'
                          ? 'border-b-2 border-purple-600 text-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Product Details
                    </button>
                    <button
                      onClick={() => setSelectedTab('reviews')}
                      className={`flex-1 py-4 px-6 transition-colors ${
                        selectedTab === 'reviews'
                          ? 'border-b-2 border-purple-600 text-purple-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Reviews ({product.reviews})
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {selectedTab === 'details' ? (
                      <div className="space-y-4">
                        <div>
                          <h3 className="mb-2">About This Product</h3>
                          <p className="text-gray-700 leading-relaxed">
                            {product.description} This carefully crafted wellness product is designed to support your mental health journey. Made with high-quality materials and backed by research in mental wellness practices.
                          </p>
                        </div>
                        <div>
                          <h3 className="mb-2">Key Features</h3>
                          <ul className="list-disc list-inside space-y-2 text-gray-700">
                            <li>Premium quality materials</li>
                            <li>Scientifically designed for wellness</li>
                            <li>Easy to integrate into daily routine</li>
                            <li>Suitable for all experience levels</li>
                            <li>Eco-friendly and sustainable</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="mb-2">How to Use</h3>
                          <p className="text-gray-700">
                            Incorporate this product into your daily wellness routine for best results. Consistent use can help support your emotional well-being and mental clarity.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Rating Summary */}
                        <div className="bg-gray-50 rounded-xl p-6">
                          <div className="grid md:grid-cols-2 gap-8">
                            <div className="text-center">
                              <div className="text-5xl text-purple-600 mb-2">{product.rating}</div>
                              {renderStars(product.rating, 'lg')}
                              <p className="text-gray-600 mt-2">Based on {product.reviews} reviews</p>
                            </div>
                            <div className="space-y-2">
                              {ratingDistribution.map((dist) => (
                                <div key={dist.stars} className="flex items-center gap-3">
                                  <span className="text-sm text-gray-600 w-8">{dist.stars}★</span>
                                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-yellow-500 rounded-full"
                                      style={{ width: `${dist.percentage}%` }}
                                    />
                                  </div>
                                  <span className="text-sm text-gray-600 w-12 text-right">{dist.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Individual Reviews */}
                        <div className="space-y-4">
                          <h3 className="">Customer Reviews</h3>
                          {productReviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-4">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <div className="flex items-center gap-3 mb-1">
                                    <span className="text-gray-900">{review.userName}</span>
                                    {renderStars(review.rating, 'sm')}
                                  </div>
                                  <p className="text-sm text-gray-500">{review.date}</p>
                                </div>
                              </div>
                              <p className="text-gray-700 mb-3">{review.comment}</p>
                              <button
                                onClick={() => toggleHelpful(review.id)}
                                className={`flex items-center gap-2 text-sm transition-colors ${
                                  helpfulReviews.has(review.id)
                                    ? 'text-purple-600'
                                    : 'text-gray-600 hover:text-purple-600'
                                }`}
                              >
                                <ThumbsUp className="w-4 h-4" />
                                <span>Helpful ({review.helpful + (helpfulReviews.has(review.id) ? 1 : 0)})</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
