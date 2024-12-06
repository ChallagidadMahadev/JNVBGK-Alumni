import axios from 'axios';
import { Alumni, Event, News } from '../types';
import { CreateNews, UpdateNews } from '../types/news';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 15000 // Increased timeout to 15 seconds
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.response) {
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error('No response from server. Please try again later.');
    } else {
      throw new Error('Request failed. Please check your connection.');
    }
  }
);

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add cache-busting parameter to GET requests
    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now()
      };
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth endpoints
export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
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

export default api;
