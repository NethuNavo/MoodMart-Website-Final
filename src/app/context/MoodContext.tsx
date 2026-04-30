import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string) => User | null;
  logout: () => void;
  currentTheme: string;
  setCurrentTheme: (theme: string) => void;
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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
    throw new Error('useMood must be used within MoodProvider');
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
  const [currentTheme, setCurrentTheme] = useState('default');

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
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@moodmart.com', role: 'admin', status: 'active', joinDate: '2025-01-01' },
    { id: '2', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'user', status: 'active', joinDate: '2025-11-15' },
    { id: '3', name: 'Michael Chen', email: 'm.chen@example.com', role: 'user', status: 'active', joinDate: '2025-12-01' },
    { id: '4', name: 'Emma Wilson', email: 'emma.w@example.com', role: 'user', status: 'blocked', joinDate: '2025-12-05' },
    { id: '5', name: 'David Smith', email: 'david.s@example.com', role: 'user', status: 'active', joinDate: '2025-12-10' },
  ]);

  const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
    const newEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    setMoodEntries([...moodEntries, newEntry]);
  };

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

  const login = (email: string) => {
    // Find user in our mock database
    const user = users.find(u => u.email === email && u.status === 'active');
    
    if (user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
      return user;
    }
    
    // Fallback for demo purposes if email not in list (treat as new user)
    const newUser: User = {
        id: Date.now().toString(),
        name: 'New User',
        email: email,
        role: 'user',
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
    };
    setIsAuthenticated(true);
    setCurrentUser(newUser);
    return newUser;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
  };

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
        ...product,
        id: Date.now().toString(),
        rating: 0,
        reviews: 0,
        stock: product.stock || 0
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => p.id === id ? { ...p, ...updatedProduct } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
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
        products,
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
