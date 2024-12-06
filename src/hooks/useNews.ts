import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { News, CreateNews, UpdateNews } from '../types/news';
import api from '../utils/api';

export const useNews = () => {
  const queryClient = useQueryClient();

  const getNews = useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const { data } = await api.get<News[]>('/news');
      return data;
    }
  });

  const createNews = useMutation({
    mutationFn: async (news: CreateNews) => {
      const { data } = await api.post<News>('/news', news);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News created successfully');
    }
  });

  const updateNews = useMutation({
    mutationFn: async ({ id, news }: { id: string; news: UpdateNews }) => {
      const { data } = await api.put<News>(`/news/${id}`, news);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News updated successfully');
    }
  });

  const deleteNews = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/news/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] });
      toast.success('News deleted successfully');
    }
  });

  const trackView = useMutation({
    mutationFn: async (newsId: string) => {
      try {
        const { data } = await api.post<{ viewCount: number }>(`/news/${newsId}/view`);
        return data;
      } catch (error) {
        console.error('Error tracking view:', error);
        throw error;
      }
    },
    onSuccess: (data, newsId) => {
      queryClient.setQueryData(['news'], (oldData: News[] | undefined) => {
        if (!oldData) return [];
        return oldData.map(news => 
          news._id === newsId 
            ? { ...news, viewCount: data.viewCount }
            : news
        );
      });
    },
    onError: () => {
      console.error('Failed to track view');
    }
  });

  return {
    getNews,
    createNews,
    updateNews,
    deleteNews,
    trackView
  };
};