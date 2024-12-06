import { z } from 'zod';

export const NewsCategory = z.enum(['announcement', 'achievement', 'event', 'general']);
export const NewsStatus = z.enum(['draft', 'published']);

export const CreateNewsSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  content: z.string().min(1, 'Content is required'),
  category: NewsCategory,
  status: NewsStatus,
  image: z.string().url().optional(),
  tags: z.array(z.string()).optional()
});

export interface News {
  _id: string;
  title: string;
  content: string;
  category: z.infer<typeof NewsCategory>;
  status: z.infer<typeof NewsStatus>;
  image?: string;
  author: {
    _id: string;
    name: string;
  };
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
}

export type CreateNews = z.infer<typeof CreateNewsSchema>;
export type UpdateNews = Partial<CreateNews>;