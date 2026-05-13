import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { productAPI } from '../utils/api';

export interface MoodEntry {
  id: string;
  date: string;
  mood: 'happy' | 'calm' | 'relaxed' | 'content' | 'energetic' | 'motivated' | 'grateful' | 
        'okay' | 'normal' | 'focused' | 'bored' | 
        'stressed' | 'anxious' | 'overwhelmed' | 'sad' | 'frustrated' | 'angry' | 'lonely' | 
        'sleepy' | 'tired' | 'exhausted' | 'rested' | 'insomnia' | 
        'depressed' | 'confused' | 'mentally-drained' | 'overthinking';
  intensity: number; // 1-5 scale
  stressLevel: number;
  segment?: 'Morning' | 'Afternoon' | 'Night';
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  category: 'book' | 'journal' | 'essential-oil' | 'supplement';
  image: string;
  description: string;
  rating?: number;
  reviews?: number;
  tag?: string;
  stock?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export type ThemeKey =
  | 'neutral'
  | 'happy'
  | 'sad'
  | 'angry'
  | 'fearful'
  | 'disgusted'
  | 'surprised';

export interface Order {
  id: string;
  customerName: string;
  email: string;
  date: string;
  total: number;
  status: 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
  items: CartItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'blocked';
  joinDate: string;
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  addMoodEntry: (entry: Omit<MoodEntry, 'id' | 'segment'>) => { success: boolean; message: string };
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (user: User) => User | null;
  logout: () => void;
  currentTheme: ThemeKey;
  setCurrentTheme: (theme: ThemeKey) => void;
  currentMoodEntry?: MoodEntry;
  recommendedProductsByMood: Product[];
  autoThemeEnabled: boolean;
  setAutoThemeEnabled: (enabled: boolean) => void;
  products: Product[];
  isProductsLoading: boolean;
  loadProducts: () => Promise<Product[]>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<Product | null>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;
  orders: Order[];
  updateOrderStatus: (id: string, status: Order['status']) => void;
  users: User[];
  updateUserStatus: (id: string, status: User['status']) => void;
  deleteUser: (id: string) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function useMood() {
  const context = useContext(MoodContext);
  if (!context) {
    // Return safe defaults during hot reload or if provider is missing
    return {
      moodEntries: [],
      addMoodEntry: () => ({ success: false, message: 'Context not available' }),
      cart: [],
      addToCart: () => {},
      removeFromCart: () => {},
      updateCartQuantity: () => {},
      clearCart: () => {},
      isAuthenticated: false,
      currentUser: null,
      login: () => null,
      logout: () => {},
      currentTheme: 'neutral',
      setCurrentTheme: () => {},
      currentMoodEntry: undefined,
      recommendedProductsByMood: [],
      autoThemeEnabled: true,
      setAutoThemeEnabled: () => {},
      products: [],
      isProductsLoading: false,
      loadProducts: async () => [],
      addProduct: async () => null,
      updateProduct: async () => null,
      deleteProduct: async () => {},
      orders: [],
      updateOrderStatus: () => {},
      users: [],
      updateUserStatus: () => {},
      deleteUser: () => {},
    };
  }
  return context;
}

// Add a safe version that returns null if not in provider (for hot reload)
export function useMoodSafe() {
  return useContext(MoodContext);
}

export const MoodProvider = ({ children }: { children: ReactNode }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([
    { id: '1', date: '2025-12-10', mood: 'calm', intensity: 3, stressLevel: 3, notes: 'Meditated for 10 minutes' },
    { id: '2', date: '2025-12-11', mood: 'happy', intensity: 2, stressLevel: 2, notes: 'Great day at work' },
    { id: '3', date: '2025-12-12', mood: 'anxious', intensity: 4, stressLevel: 7, notes: 'Work deadline stress' },
    { id: '4', date: '2025-12-13', mood: 'calm', intensity: 3, stressLevel: 4, notes: 'Yoga helped' },
    { id: '5', date: '2025-12-14', mood: 'stressed', intensity: 5, stressLevel: 6, notes: 'Busy day' },
    { id: '6', date: '2025-12-15', mood: 'happy', intensity: 2, stressLevel: 2, notes: 'Weekend relaxation' },
    { id: '7', date: '2025-12-16', mood: 'calm', intensity: 3, stressLevel: 3, notes: 'Feeling centered' },
  ]);
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>(() => {
    if (typeof window === 'undefined') return 'neutral';
    const savedTheme = window.localStorage.getItem('moodmart-theme') as ThemeKey | null;
    return savedTheme ?? 'neutral';
  });

  const [autoThemeEnabled, setAutoThemeEnabled] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem('moodmart-auto-theme');
    return saved !== null ? JSON.parse(saved) : true; // Default to enabled
  });

  useEffect(() => {
    const root = document.documentElement;
    const themeClasses: ThemeKey[] = ['neutral', 'happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
    themeClasses.forEach((themeClass) => root.classList.remove(`theme-${themeClass}`));
    root.classList.add(`theme-${currentTheme}`);
    window.localStorage.setItem('moodmart-theme', currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    window.localStorage.setItem('moodmart-auto-theme', JSON.stringify(autoThemeEnabled));
  }, [autoThemeEnabled]);

  // Initial products
  const [products, setProducts] = useState<Product[]>([
    {
      id: '1',
      name: 'Mindfulness Journal',
      category: 'journal',
      price: 2499.00,
      rating: 4.8,
      reviews: 156,
      description: 'Daily guided journal for tracking thoughts and emotions',
      tag: 'Bestseller',
      image: 'https://images.unsplash.com/photo-1594997652537-2e2dce4ebf28?w=400&h=300&fit=crop',
      stock: 45
    },
    {
      id: '2',
      name: 'Lavender Essential Oil',
      category: 'essential-oil',
      price: 1899.00,
      rating: 4.9,
      reviews: 243,
      description: 'Pure lavender oil for relaxation and better sleep',
      tag: 'Popular',
      image: 'https://images.unsplash.com/photo-1647934174425-61136513aed7?w=400&h=300&fit=crop',
      stock: 32
    },
    {
      id: '3',
      name: 'The Anxiety Toolkit',
      category: 'book',
      price: 1699.00,
      rating: 4.7,
      reviews: 89,
      description: 'Evidence-based strategies for managing anxiety',
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
      stock: 12
    },
    {
      id: '4',
      name: 'Meditation Cushion',
      category: 'supplement',
      price: 3999.00,
      rating: 4.6,
      reviews: 67,
      description: 'Comfortable zafu cushion for meditation practice',
      image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400&h=300&fit=crop',
      stock: 8
    },
    {
      id: '5',
      name: 'Gratitude Journal',
      category: 'journal',
      price: 1999.00,
      rating: 4.9,
      reviews: 201,
      description: 'Daily prompts for cultivating gratitude',
      tag: 'Recommended',
      image: '/gratitude.png',
      stock: 100
    },
    {
      id: '6',
      name: 'Eucalyptus Essential Oil',
      category: 'essential-oil',
      price: 1599.00,
      rating: 4.7,
      reviews: 134,
      description: 'Invigorating eucalyptus for clarity and focus',
      image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&h=300&fit=crop',
      stock: 25
    },
    {
      id: '7',
      name: 'The Power of Now',
      category: 'book',
      price: 1499.00,
      rating: 4.8,
      reviews: 312,
      description: 'A guide to spiritual enlightenment by Eckhart Tolle',
      tag: 'Classic',
      image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
      stock: 50
    },
    {
      id: '8',
      name: 'Aromatherapy Diffuser',
      category: 'supplement',
      price: 4999.00,
      rating: 4.5,
      reviews: 178,
      description: 'Ultrasonic diffuser with LED lighting',
      image: 'https://images.unsplash.com/photo-1707920961189-290d19b363f3?w=400&h=300&fit=crop',
      stock: 15
    },
  ]);

  // Mock Orders
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 'ORD-001',
      customerName: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      date: '2025-12-15',
      total: 4398.00,
      status: 'Delivered',
      items: [
        { ...products[0], quantity: 1 },
        { ...products[1], quantity: 1 }
      ]
    },
    {
      id: 'ORD-002',
      customerName: 'Michael Chen',
      email: 'm.chen@example.com',
      date: '2025-12-16',
      total: 1699.00,
      status: 'Processing',
      items: [
        { ...products[2], quantity: 1 }
      ]
    },
    {
      id: 'ORD-003',
      customerName: 'Emma Wilson',
      email: 'emma.w@example.com',
      date: '2025-12-16',
      total: 3999.00,
      status: 'Pending',
      items: [
        { ...products[3], quantity: 1 }
      ]
    }
  ]);

  // Mock Users
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@moodmart.com', role: 'admin', status: 'active', joinDate: '2025-01-01' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'user', status: 'active', joinDate: '2025-11-15' },
    { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', role: 'user', status: 'active', joinDate: '2025-12-01' },
    { id: '4', name: 'Emma Wilson', email: 'emma.w@example.com', role: 'user', status: 'blocked', joinDate: '2025-12-05' },
    { id: '5', name: 'David Smith', email: 'david.s@example.com', role: 'user', status: 'active', joinDate: '2025-12-10' },
  ]);

  const getTimeSegment = (date = new Date()): MoodEntry['segment'] => {
    const hour = date.getHours();
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 18) return 'Afternoon';
    return 'Night';
  };

  // Map mood types to theme keys for automatic theme switching
  const getThemeForMood = (mood: MoodEntry['mood']): ThemeKey => {
    const moodThemeMap: Record<string, ThemeKey> = {
      // Happy themes
      'happy': 'happy',
      'calm': 'happy',
      'relaxed': 'happy',
      'content': 'happy',
      'energetic': 'happy',
      'motivated': 'happy',
      'grateful': 'happy',
      'okay': 'happy',
      'normal': 'happy',
      'focused': 'happy',
      'rested': 'happy',

      // Sad themes
      'sad': 'sad',
      'lonely': 'sad',
      'depressed': 'sad',
      'mentally-drained': 'sad',
      'overthinking': 'sad',
      'confused': 'sad',

      // Angry themes
      'angry': 'angry',
      'frustrated': 'angry',
      'overwhelmed': 'angry',

      // Fearful themes
      'anxious': 'fearful',
      'stressed': 'fearful',
      'insomnia': 'fearful',

      // Disgusted themes
      'bored': 'disgusted',
      'tired': 'disgusted',
      'exhausted': 'disgusted',
      'sleepy': 'disgusted',

      // Surprised themes (for intense emotions)
      'surprised': 'surprised'
    };

    return moodThemeMap[mood] || 'neutral';
  };

  const currentMoodEntry = useMemo<MoodEntry | undefined>(() => {
    if (moodEntries.length === 0) return undefined;
    return moodEntries[moodEntries.length - 1];
  }, [moodEntries]);

  useEffect(() => {
    if (!autoThemeEnabled || !currentMoodEntry) return;
    const themeForMood = getThemeForMood(currentMoodEntry.mood);
    if (themeForMood !== currentTheme) {
      setCurrentTheme(themeForMood);
    }
  }, [autoThemeEnabled, currentMoodEntry, currentTheme]);

  const recommendedProductsByMood = useMemo<Product[]>(() => {
    const mood = currentMoodEntry?.mood;
    const moodTheme = mood ? getThemeForMood(mood) : 'neutral';

    const moodProductMap: Record<ThemeKey, { categories: Product['category'][]; tags: string[]; names: string[] }> = {
      neutral: {
        categories: ['journal', 'book'],
        tags: ['Recommended', 'Popular', 'Bestseller'],
        names: [],
      },
      happy: {
        categories: ['journal', 'book', 'supplement'],
        tags: ['Recommended', 'Popular', 'Bestseller'],
        names: ['Gratitude Journal', 'Mindfulness Journal', 'The Power of Now', 'Aromatherapy Diffuser'],
      },
      sad: {
        categories: ['book', 'journal', 'essential-oil', 'supplement'],
        tags: ['Recommended'],
        names: ['Lavender Essential Oil', 'The Anxiety Toolkit', 'Gratitude Journal', 'Aromatherapy Diffuser', 'Meditation Cushion'],
      },
      angry: {
        categories: ['essential-oil', 'supplement', 'journal'],
        tags: ['Popular', 'Recommended'],
        names: ['Eucalyptus Essential Oil', 'Aromatherapy Diffuser', 'Meditation Cushion'],
      },
      fearful: {
        categories: ['book', 'journal', 'essential-oil'],
        tags: ['Recommended', 'Bestseller'],
        names: ['Lavender Essential Oil', 'The Anxiety Toolkit', 'Gratitude Journal', 'Aromatherapy Diffuser'],
      },
      disgusted: {
        categories: ['journal', 'essential-oil', 'supplement'],
        tags: ['Featured', 'Recommended'],
        names: ['Gratitude Journal', 'Aromatherapy Diffuser', 'Lavender Essential Oil', 'Meditation Cushion'],
      },
      surprised: {
        categories: ['book', 'journal', 'supplement'],
        tags: ['Bestseller', 'Featured'],
        names: ['The Power of Now', 'Gratitude Journal', 'Meditation Cushion'],
      },
    };

    const criteria = moodProductMap[moodTheme];
    const matches = products.filter((product) => {
      if (criteria.names.includes(product.name)) return true;
      if (criteria.tags.some((tag) => product.tag?.includes(tag))) return true;
      if (criteria.categories.includes(product.category)) return true;
      return false;
    });

    if (matches.length > 0) {
      return matches.slice(0, 4);
    }

    return products.filter((product) => product.tag && ['Recommended', 'Bestseller', 'Popular', 'Featured'].includes(product.tag)).slice(0, 4);
  }, [products, currentMoodEntry]);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id' | 'segment'>) => {
    const today = new Date().toISOString().split('T')[0];
    const segment = getTimeSegment();
    const existingSegmentEntry = moodEntries.find(
      (existing) => existing.date === today && existing.segment === segment
    );

    if (existingSegmentEntry) {
      return {
        success: false,
        message: `You've already logged your ${segment.toLowerCase()} mood. Next available login is ${
          segment === 'Morning' ? 'this afternoon' : segment === 'Afternoon' ? 'this evening' : 'tomorrow morning'
        }.`,
      };
    }

    const newEntry: MoodEntry = {
      ...entry,
      id: Date.now().toString(),
      segment,
    };
    setMoodEntries([...moodEntries, newEntry]);

    // Automatically change theme based on mood if auto-theme is enabled
    if (autoThemeEnabled) {
      const themeForMood = getThemeForMood(entry.mood);
      setCurrentTheme(themeForMood);
    }

    return {
      success: true,
      message: autoThemeEnabled
        ? `Mood logged for ${segment.toLowerCase()} successfully. Theme updated to match your mood!`
        : `Mood logged for ${segment.toLowerCase()} successfully.`,
    };
  };


  const loadProducts = useCallback(async (): Promise<Product[]> => {
    setIsProductsLoading(true);
    try {
      const backendProducts = await productAPI.getAll();
      const normalizedProducts = backendProducts.map((product: any) => ({
        ...product,
        id: product._id || product.id,
        stock: product.stock ?? 0,
      }));
      setProducts(normalizedProducts);
      return normalizedProducts;
    } catch (err) {
      console.error('Failed to load backend products', err);
      return [];
    } finally {
      setIsProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts().catch(() => {
      // Ignore load errors here; keep fallback products available.
    });
  }, [loadProducts]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const login = (user: User) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    return user;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const created = await productAPI.create(product);
    const normalizedProduct: Product = {
      ...created,
      id: created._id || created.id,
      stock: created.stock ?? 0,
    };
    setProducts(prev => [...prev, normalizedProduct]);
    return normalizedProduct;
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    const updated = await productAPI.update(id, updatedProduct);
    const normalizedProduct: Product = {
      ...updated,
      id: updated._id || updated.id,
      stock: updated.stock ?? 0,
    };
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...normalizedProduct } : p));
    return normalizedProduct;
  };

  const deleteProduct = async (id: string) => {
    await productAPI.delete(id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const updateUserStatus = (id: string, status: User['status']) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <MoodContext.Provider
      value={{
        moodEntries,
        addMoodEntry,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isAuthenticated,
        currentUser,
        login,
        logout,
        currentTheme,
        setCurrentTheme,
        currentMoodEntry,
        recommendedProductsByMood,
        autoThemeEnabled,
        setAutoThemeEnabled,
        products,
        isProductsLoading,
        loadProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        orders,
        updateOrderStatus,
        users,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </MoodContext.Provider>
  );
};
