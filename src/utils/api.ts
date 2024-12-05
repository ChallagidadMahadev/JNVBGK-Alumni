import axios from 'axios';
import { Alumni, Event, News } from '../types';

const baseURL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true,
  timeout: 10000 // 10 seconds timeout
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timed out. Please try again.');
    }
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const message = error.response.data?.message || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Please try again later.');
    } else {
      // Something happened in setting up the request that triggered an Error
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
    
    // Add timestamp to prevent caching
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
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
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

// News endpoints
export const getNews = async () => {
  const response = await api.get('/news');
  return response.data;
};

export const createNews = async (newsData: Partial<News>) => {
  const response = await api.post('/news', newsData);
  return response.data;
};

export const updateNews = async (id: string, newsData: Partial<News>) => {
  const response = await api.put(`/news/${id}`, newsData);
  return response.data;
};

export const deleteNews = async (id: string) => {
  const response = await api.delete(`/news/${id}`);
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

export default api;
