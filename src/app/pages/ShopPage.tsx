/// <reference types="vite/client" />
import { useState } from 'react';
import { ShoppingCart, Star, Filter, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useMood, Product } from '../context/MoodContext';
import { MiniCart } from '../components/MiniCart';
import ProductDetailsModal from '../components/ProductDetailsModal';
import { GuestInfoBanner } from '../components/GuestInfoBanner';
const wellnessDesign = new URL('../../assets/4b30ac2453362cc9d4add552f78ebd7948229050.png', import.meta.url).href;
const gratitudeImg = new URL('../../assets/gratitude.png', import.meta.url).href;

export function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const bannerSrc = wellnessDesign;
  const [sortBy, setSortBy] = useState('popular');
  const [addedProducts, setAddedProducts] = useState<Set<string>>(new Set());
  const [isMiniCartOpen, setIsMiniCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<(Product & { rating: number; reviews: number; tag?: string }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { addToCart, isAuthenticated, products, isProductsLoading } = useMood();


  const shouldShowLoading = isProductsLoading;

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'journal', label: 'Journals' },
    { id: 'book', label: 'Books' },
    { id: 'essential-oil', label: 'Essential Oils' },
    { id: 'supplement', label: 'Supplements' },
  ];

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedProducts(prev => new Set(prev).add(product.id));
    
    // Show success toast
    toast.success(`${product.name} added to cart!`, {
      duration: 2000,
    });

    // Open mini cart
    setIsMiniCartOpen(true);

    // Reset button state after 2.5 seconds
    setTimeout(() => {
      setAddedProducts(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.id);
        return newSet;
      });
    }, 2500);
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct({
      ...product,
      rating: product.rating ?? 0,
      reviews: product.reviews ?? 0,
      tag: product.tag,
    });
    setIsModalOpen(true);
  };

  // prepare product cards once to avoid JSX parsing complexity
  const productCards = shouldShowLoading ? (
    <div className="col-span-full text-center py-12 text-gray-500">Loading products...</div>
  ) : (
    filteredProducts.map((product) => {
      const isAdded = addedProducts.has(product.id);
      return (
        <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
          <div
            className="relative cursor-pointer"
            onClick={() => handleViewDetails(product)}
          >
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            {product.tag && (
              <span className="absolute top-2 right-2 bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {product.tag}
              </span>
            )}
          </div>
          <div className="p-4">
            <p className="text-sm text-gray-500 mb-1">{product.category}</p>
            <h3
              className="mb-2 cursor-pointer hover:text-purple-600 transition-colors"
              onClick={() => handleViewDetails(product)}
            >
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
            <button
              onClick={() => handleViewDetails(product)}
              className="text-sm text-purple-600 hover:underline mb-3"
            >
              View Details & Reviews
            </button>
            <div className="flex items-center mb-3">
              <div className="flex items-center text-yellow-500 mr-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1 text-sm">{product.rating}</span>
              </div>
              <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-2xl text-purple-600">Rs.{product.price.toFixed(2)}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(product);
                }}
                className={`px-4 py-2 rounded-lg transition-all flex items-center space-x-2 ${
                  isAdded
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      );
    })
  );

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header Section - Beautiful Wellness Shop Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-purple-50 to-purple-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="max-w-4xl mx-auto">
                <img
                  src={bannerSrc}
                  alt="Shop Our Wellness Product"
                  className="w-full h-56 sm:h-72 object-cover rounded-md shadow-sm mx-auto animate-fade-in"
                />
              </div>
            
          </div>
          {/* Decorative floating elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        </section>

        {/* Guest Info Banner */}
        {!isAuthenticated && <div className="px-4 py-6"><GuestInfoBanner page="shop" /></div>}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Filters */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2 flex-wrap gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-2">
                <label className="text-gray-600">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {productCards}
          </div>

          {/* Personalized Recommendations */}
          <div className="bg-gradient-to-r from-[#6a2fb3] via-[#5b2591] to-[#4b237f] rounded-[2rem] p-8 shadow-2xl ring-1 ring-white/20 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Recommended For You</h2>
                <p className="text-white/85 max-w-2xl">
                  Based on your mood tracking data and preferences, we think you'll love these products:
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white border border-white/20">
                Tailored picks for your wellness journey
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/95 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Stress Relief Bundle</h3>
                <p className="text-slate-600 mb-4">Essential oils, journal, and guided meditation book</p>
                <p className="text-2xl font-bold text-purple-700">Rs.5999.00</p>
              </div>
              <div className="bg-white/95 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Sleep Better Kit</h3>
                <p className="text-slate-600 mb-4">Lavender oil, sleep journal, and relaxation guide</p>
                <p className="text-2xl font-bold text-purple-700">Rs.4499.00</p>
              </div>
              <div className="bg-white/95 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-xl hover:-translate-y-1 hover:shadow-2xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Mindfulness Starter</h3>
                <p className="text-slate-600 mb-4">Meditation cushion, journal, and beginner's book</p>
                <p className="text-2xl font-bold text-purple-700">Rs.7499.00</p>
              </div>
            </div>
          </div>
        </div>

        <MiniCart isOpen={isMiniCartOpen} onClose={() => setIsMiniCartOpen(false)} />
        <ProductDetailsModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddToCart={handleAddToCart}
          isAdded={selectedProduct ? addedProducts.has(selectedProduct.id) : false}
        />
      </div>
    </>
  );
}