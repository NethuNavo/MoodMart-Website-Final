// Backend API configuration and helpers
const rawApiUrl = import.meta.env.VITE_API_URL?.toString().trim();
const defaultApiUrl = import.meta.env.DEV ? 'http://localhost:5000' : '/_/backend';
export const API_BASE_URL = rawApiUrl
  ? rawApiUrl.startsWith(':')
    ? `http://localhost${rawApiUrl}`
    : rawApiUrl.startsWith('http://') || rawApiUrl.startsWith('https://')
    ? rawApiUrl
    : rawApiUrl.startsWith('/')
    ? rawApiUrl
    : `http://${rawApiUrl}`
  : defaultApiUrl;

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface ProductPayload {
  name: string;
  category: 'book' | 'journal' | 'essential-oil' | 'supplement';
  price: number;
  description: string;
  image?: string;
  tag?: string;
  rating?: number;
  reviews?: number;
  stock?: number;
}

// Auth API endpoints
export const authAPI = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Registration failed');
    }

    return response.json();
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    console.log('Login attempt with email:', data.email);
    console.log('API URL:', `${API_BASE_URL}/api/auth/login`);
    
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log('Login response status:', response.status);
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Login error response:', error);
      throw new Error(error.msg || 'Login failed');
    }

    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    return response.json();
  },
};

export const productAPI = {
  async getAll() {
    return apiCall<any[]>('/api/products', {
      method: 'GET',
    });
  },

  async getById(id: string) {
    return apiCall<any>(`/api/products/${id}`, {
      method: 'GET',
    });
  },

  async create(product: ProductPayload) {
    return apiCall<any>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async update(id: string, product: Partial<ProductPayload>) {
    return apiCall<any>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    });
  },

  async delete(id: string) {
    return apiCall<any>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },
};

// Helper to store and retrieve authentication token
export const tokenManager = {
  setToken(token: string) {
    localStorage.setItem('auth_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  removeToken() {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};

// Generic fetch wrapper with token
export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = tokenManager.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
