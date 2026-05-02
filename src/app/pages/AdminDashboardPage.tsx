import { useState, useEffect } from 'react';
import { useMood, Product } from '../context/MoodContext';
import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Settings, 
  Plus, 
  Trash2, 
  Search, 
  Edit, 
  MoreVertical, 
  Ban, 
  CheckCircle, 
  XCircle, 
  ChevronDown, 
  Upload, 
  LogOut,
  DollarSign,
  TrendingUp,
  Mail,
  User as UserIcon,
  X,
  Menu,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import adminHeaderImage from "../../assets/admin-dashboard.png";

export function AdminDashboardPage() {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct, 
    orders, 
    updateOrderStatus, 
    users, 
    updateUserStatus, 
    deleteUser 
  } = useMood();

  const { isAdmin } = useUser();

  // redirect if not authorized
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'users' | 'settings'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<Partial<Product>>({
    name: '',
    category: 'journal',
    price: 0,
    description: '',
    image: '',
    tag: '',
    stock: 0
  });

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@moodmart.com',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
  });

  // --- Calculations ---
  const totalRevenue = orders.reduce((sum, order) => order.status !== 'Cancelled' ? sum + order.total : sum, 0);
  const totalOrders = orders.length;
  const totalUsers = users.length;
  const totalProducts = products.length;

  // --- Handlers ---

  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductFormData(product);
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        category: 'journal',
        price: 0,
        description: '',
        image: '',
        tag: '',
        stock: 0
      });
    }
    setIsProductModalOpen(true);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.price || !productFormData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    const productData = {
      ...productFormData,
      image: productFormData.image || 'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=400&h=300&fit=crop',
    } as Product;

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      toast.success('Product updated successfully');
    } else {
      addProduct(productData);
      toast.success('Product added successfully');
    }
    setIsProductModalOpen(false);
  };

  const handleUpdateAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Profile updated successfully');
  };

  // --- Render Functions ---

  const renderSidebar = () => (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen hidden md:block">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
          M
        </div>
        <div>
          <h1 className="font-bold text-gray-900">MoodMart</h1>
          <p className="text-xs text-gray-500">Admin Panel</p>
        </div>
      </div>
      
      <nav className="mt-6 px-4 space-y-2">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-purple-100 text-purple-700 font-medium' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 w-full px-4">
        <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-3">
          <img src={adminProfile.image} className="w-10 h-10 rounded-full object-cover" alt="Admin" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{adminProfile.name}</p>
            <p className="text-xs text-gray-500 truncate">{adminProfile.email}</p>
          </div>
          <LogOut className="w-4 h-4 text-gray-400 cursor-pointer hover:text-red-500" />
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            label: 'Total Revenue', 
            value: `Rs.${totalRevenue.toLocaleString()}`, 
            icon: DollarSign, 
            color: 'text-emerald-600', 
            bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
            iconBg: 'bg-emerald-500',
           
          },
          { 
            label: 'Total Orders', 
            value: totalOrders, 
            icon: ShoppingCart, 
            color: 'text-blue-600', 
            bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
            iconBg: 'bg-blue-500',
           
          },
          { 
            label: 'Total Products', 
            value: totalProducts, 
            icon: Package, 
            color: 'text-purple-600', 
            bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
            iconBg: 'bg-purple-500',
           
          },
          { 
            label: 'Total Users', 
            value: totalUsers, 
            icon: Users, 
            color: 'text-orange-600', 
            bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
            iconBg: 'bg-orange-500',
           
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`p-6 border-none shadow-lg hover:shadow-xl transition-all duration-300 ${stat.bg} relative overflow-hidden group cursor-pointer`}>
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl ${stat.iconBg} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h3 className={`text-3xl font-bold ${stat.color} tracking-tight`}>
                    {stat.value}
                  </h3>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-none shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {orders.slice(0, 5).map(order => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">
                    {order.customerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                    <p className="text-xs text-gray-500">{order.items.length} items • Rs.{order.total}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium 
                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                  {order.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-none shadow-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Low Stock Alert</h3>
            <div className="space-y-4">
                {products.filter(p => (p.stock || 0) < 20).map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-center gap-3">
                            <img src={product.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">{product.name}</p>
                                <p className="text-xs text-red-600 font-medium">Only {product.stock} left</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="h-8 text-xs border-red-200 text-red-700 hover:bg-red-100" onClick={() => handleOpenProductModal(product)}>
                            Restock
                        </Button>
                    </div>
                ))}
                {products.filter(p => (p.stock || 0) < 20).length === 0 && (
                    <p className="text-gray-500 text-sm">All products are well stocked.</p>
                )}
            </div>
        </Card>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
        <Button onClick={() => handleOpenProductModal()} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <Card className="border-none shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Search products..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[150px]">{product.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{product.category}</td>
                  <td className="px-6 py-4 text-sm">Rs.{product.price}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${(product.stock || 0) < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                      {product.stock || 0} in stock
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenProductModal(product)}>
                        <Edit className="w-4 h-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        if(confirm('Delete this product?')) deleteProduct(product.id);
                      }}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Order Management</h2>
      
      <Card className="border-none shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-medium">Rs.{order.total}</td>
                  <td className="px-6 py-4">
                    <select 
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                      className={`text-xs font-medium px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-purple-500 outline-none cursor-pointer
                        ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {order.status !== 'Cancelled' && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                                if(confirm('Cancel this order?')) updateOrderStatus(order.id, 'Cancelled');
                            }}
                        >
                            Cancel
                        </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
      
      <Card className="border-none shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Join Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joinDate}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium 
                      ${user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {user.role !== 'admin' && (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => updateUserStatus(user.id, user.status === 'active' ? 'blocked' : 'active')}
                                    title={user.status === 'active' ? "Block User" : "Unblock User"}
                                >
                                    {user.status === 'active' ? <Ban className="w-4 h-4 text-orange-500" /> : <CheckCircle className="w-4 h-4 text-green-500" />}
                                </Button>
                                <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => {
                                        if(confirm('Delete this user?')) deleteUser(user.id);
                                    }}
                                    title="Delete User"
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Admin Profile Settings</h2>
      
      <Card className="p-8 border-none shadow-md">
        <form onSubmit={handleUpdateAdminProfile} className="space-y-6">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <img 
                src={adminProfile.image} 
                alt="Profile" 
                className="w-24 h-24 rounded-full object-cover border-4 border-purple-100"
              />
              <button type="button" className="absolute bottom-0 right-0 p-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
                <Upload className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input 
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Current Password</label>
                <Input type="password" placeholder="••••••••" />
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">New Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                  <Input type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 min-w-[150px]">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Toggle */}
      <div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'} md:hidden`} onClick={() => setIsSidebarOpen(false)} />
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 p-4 overflow-y-auto transition-transform duration-200 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-xl">
              M
            </div>
            <div>
              <h1 className="font-bold text-gray-900">MoodMart</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
          </div>
        </div>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingCart },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <img src={adminProfile.image} className="w-10 h-10 rounded-full object-cover" alt="Admin" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{adminProfile.name}</p>
              <p className="text-xs text-gray-500 truncate">{adminProfile.email}</p>
            </div>
          </div>
        </div>
      </div>

      {renderSidebar()}
      
      <main className="flex-1 min-w-0 overflow-auto">
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-center flex-1 px-4">
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Admin</p>
              <h2 className="text-base font-semibold text-gray-900 truncate">{activeTab === 'dashboard' ? 'Dashboard' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Home
            </button>
          </div>
        </div>
        {/* Header Image Banner */}
        <div className="relative h-80 bg-gradient-to-r from-purple-900/40 via-purple-800/30 to-teal-900/40">
           <img 
             src={adminHeaderImage} 
             alt="Admin Dashboard" 
             className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 p-6 md:p-8 pb-20">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'products' && renderProducts()}
          {activeTab === 'orders' && renderOrders()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>

      {/* Product Modal */}
      <AnimatePresence>
        {isProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                        <h3 className="text-xl font-bold text-gray-900">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </h3>
                        <Button variant="ghost" size="icon" onClick={() => setIsProductModalOpen(false)}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                    
                    <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Product Name</label>
                                <Input 
                                    name="name" 
                                    value={productFormData.name} 
                                    onChange={(e) => setProductFormData({...productFormData, name: e.target.value})} 
                                    placeholder="e.g. Calming Tea" 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Category</label>
                                <select 
                                    name="category"
                                    value={productFormData.category}
                                    onChange={(e) => setProductFormData({...productFormData, category: e.target.value as any})}
                                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                >
                                    <option value="journal">Journal</option>
                                    <option value="book">Book</option>
                                    <option value="essential-oil">Essential Oil</option>
                                    <option value="supplement">Supplement</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Price (Rs.)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">Rs.</span>
                                    <Input 
                                        type="number" 
                                        name="price" 
                                        value={productFormData.price || ''} 
                                        onChange={(e) => setProductFormData({...productFormData, price: parseFloat(e.target.value)})} 
                                        placeholder="0.00" 
                                        className="pl-10"
                                        required 
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                                <Input 
                                    type="number" 
                                    name="stock" 
                                    value={productFormData.stock || ''} 
                                    onChange={(e) => setProductFormData({...productFormData, stock: parseInt(e.target.value)})} 
                                    placeholder="0" 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea 
                                name="description" 
                                value={productFormData.description} 
                                onChange={(e) => setProductFormData({...productFormData, description: e.target.value})} 
                                className="w-full min-h-[100px] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Product description..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Image URL</label>
                            <div className="flex gap-2">
                                <Input 
                                    name="image" 
                                    value={productFormData.image} 
                                    onChange={(e) => setProductFormData({...productFormData, image: e.target.value})} 
                                    placeholder="https://..." 
                                />
                                <Button type="button" variant="outline" onClick={() => window.open('https://unsplash.com', '_blank')}>
                                    <ImageIcon className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tag (Optional)</label>
                            <Input 
                                name="tag" 
                                value={productFormData.tag} 
                                onChange={(e) => setProductFormData({...productFormData, tag: e.target.value})} 
                                placeholder="e.g. New Arrival" 
                            />
                        </div>

                        <div className="pt-4 flex flex-row gap-3 border-t border-gray-100">
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium" 
                                onClick={() => setIsProductModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit" 
                                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium shadow-md hover:shadow-lg transition-all"
                            >
                                {editingProduct ? 'Save Changes' : 'Save Product'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
}