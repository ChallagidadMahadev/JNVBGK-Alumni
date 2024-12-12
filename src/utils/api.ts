import axios from 'axios';
import { Alumni, Event, News } from '../types';
import { CreateNews, UpdateNews } from '../types/news';
import { Batch } from '../types/batch';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 15000 // Increased timeout to 15 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only remove token if it's an invalid token error
      if (error.response?.data?.message === 'Invalid token') {
        localStorage.removeItem('token');
      }
      
      // Only redirect to login if not already on auth-related pages
      const nonAuthPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
      if (!nonAuthPaths.some(path => window.location.pathname.includes(path))) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post('/auth/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// // Auth endpoints old with expireIN 15minutes
// export const login = async (email: string, password: string) => {
//   try {
//     const { data } = await api.post('/auth/login', { email, password });
//     if (data.token) {
//       localStorage.setItem('token', data.token);
//     }
//     return data;
//   } catch (error) {
//     console.error('Login error:', error);
//     throw new Error('Invalid credentials');
//   }
// };

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/forgot-password', { email });
  } catch (error) {
    console.error('Password reset request error:', error);
    throw new Error('Failed to send reset email');
  }
};

export const verifyOTP = async (email: string, otp: string): Promise<{ resetToken: string }> => {
  try {
    const { data } = await api.post('/auth/verify-otp', { email, otp });
    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    throw new Error('Invalid OTP');
  }
};

export const resetPassword = async (resetToken: string, password: string): Promise<void> => {
  try {
    await api.post('/auth/reset-password', 
      { password },
      { headers: { Authorization: `Bearer ${resetToken}` } }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    throw new Error('Failed to reset password');
  }
};

export const register = async (userData: Partial<Alumni>) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Event endpoints
export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const createEvent = async (formData: FormData) => {
  const response = await api.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const updateEvent = async (id: string, formData: FormData) => {
  const response = await api.put(`/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const registerForEvent = async (eventId: string, attending: boolean) => {
  const response = await api.post(`/events/${eventId}/register`, { attending });
  return response.data;
};




// Alumni endpoints
export const getAlumni = async () => {
  const response = await api.get('/alumni');
  return response.data;
};

export const updateProfile = async (formData: FormData) => {
  const response = await api.put('/alumni/profile', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};


// News endpoints
export const getNews = async (): Promise<News[]> => {
  const { data } = await api.get<News[]>('/news');
  return data;
};

export const createNews = async (news: CreateNews): Promise<News> => {
  const { data } = await api.post<News>('/news', news);
  return data;
};

export const updateNews = async ({ _id, ...news }: UpdateNews & { _id: string }): Promise<News> => {
  const { data } = await api.put<News>(`/news/${_id}`, news);
  return data;
};

export const deleteNews = async (id: string): Promise<void> => {
  await api.delete(`/news/${id}`);
};

export const incrementNewsViews = async (id: string): Promise<{ viewCount: number }> => {
  const { data } = await api.post<{ viewCount: number }>(`/news/${id}/view`);
  return data;
};






// Batch endpoints
export const getBatches = async (): Promise<Batch[]> => {
  const { data } = await api.get<Batch[]>('/batches');
  return data;
};

export const uploadBatch = async (formData: FormData): Promise<Batch> => {
  const { data } = await api.post<Batch>('/batches/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return data;
};

export const updateBatch = async (id: string, batch: Partial<Batch>): Promise<Batch> => {
  const { data } = await api.put<Batch>(`/batches/${id}`, batch);
  return data;
};

export const deleteBatch = async (id: string): Promise<void> => {
  await api.delete(`/batches/${id}`);
};

export default api;
