import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import toast from 'react-hot-toast';

// Axios interceptor for automatic token attachment
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('icy-token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Axios interceptor for handling 401 responses
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('icy-token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post('/api/auth/login', credentials);
          const { token, user } = response.data;
          
          // Store token in localStorage and axios headers
          localStorage.setItem('icy-token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          toast.success(`Welcome back, ${user.firstName}! 🎉`);
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Login failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          });
          
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      register: async (userData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.post('/api/auth/register', userData);
          const { token, user } = response.data;
          
          // Store token in localStorage and axios headers
          localStorage.setItem('icy-token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
          
          toast.success(`Welcome to ICY, ${user.firstName}! ✨`);
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Registration failed';
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage
          });
          
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      logout: () => {
        // Clear localStorage and axios headers
        localStorage.removeItem('icy-token');
        delete axios.defaults.headers.common['Authorization'];
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        
        toast.success('Logged out successfully');
      },

      fetchUser: async () => {
        const token = localStorage.getItem('icy-token');
        if (!token) return;

        set({ isLoading: true });
        
        try {
          const response = await axios.get('/api/auth/me');
          const { user } = response.data;
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Failed to fetch user:', error);
          // Token is invalid, clear it
          localStorage.removeItem('icy-token');
          delete axios.defaults.headers.common['Authorization'];
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null
          });
        }
      },

      updateProfile: async (profileData) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await axios.put('/api/auth/profile', profileData);
          const { user } = response.data;
          
          set((state) => ({
            user: { ...state.user, ...user },
            isLoading: false,
            error: null
          }));
          
          toast.success('Profile updated successfully');
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Profile update failed';
          set({ isLoading: false, error: errorMessage });
          
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      changePassword: async (passwordData) => {
        set({ isLoading: true, error: null });
        
        try {
          await axios.post('/api/auth/change-password', passwordData);
          
          set({ isLoading: false, error: null });
          toast.success('Password changed successfully');
          return { success: true };
        } catch (error) {
          const errorMessage = error.response?.data?.error || 'Password change failed';
          set({ isLoading: false, error: errorMessage });
          
          toast.error(errorMessage);
          return { success: false, error: errorMessage };
        }
      },

      clearError: () => set({ error: null }),

      // Initialize store on app load
      initialize: () => {
        const token = localStorage.getItem('icy-token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          get().fetchUser();
        }
      }
    }),
    {
      name: 'icy-auth-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Initialize the store when the module is loaded
if (typeof window !== 'undefined') {
  useAuthStore.getState().initialize();
}