import { z } from 'zod';
import { NewsCategory, NewsStatus } from './news';

export interface NewsViews {
  count: number;
  uniqueUsers: string[];
}

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
  createdAt: string;
  updatedAt: string;
  views: NewsViews;
  tags?: string[];
}

export interface Alumni {
  _id: string;
  name: string;
  email: string;
  batchYear: number;
  gender: 'male' | 'female';
  phoneNumber?: string;
  showPhoneNumber?: boolean;
  address?: string;
  house?: 'ARAVALI' | 'NILGIRI' | 'SHIVALIK' | 'UDAIGIRI';
  profilePicture?: string;
  occupation?: string;
  occupationSubField?: string;
  participation?: string[];
  customParticipation?: string;
  role: 'alumni' | 'admin';
  createdAt: string;
}

export const OCCUPATION_PREFIXES: Record<string, string> = {
  'Engineering': 'Er.',
  'Medicine': 'Dr.',
  'Teaching': 'Prof.',
  'Law': 'Adv.',
  'Research & Academia': 'Dr.',
  'Armed Forces': 'Off.',
  'Business': 'Mr./Ms.',
  'Government Service': 'Mr./Ms.',
  'Arts & Entertainment': 'Mr./Ms.',
  'Agriculture': 'Mr./Ms.',
  'Others': 'Mr./Ms.'
};
export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image?: string;
  registeredUsers: string[];
  createdBy: string;
  createdAt: string;
}



export const HOUSE_COLORS = {
  ARAVALI: 'blue',
  NILGIRI: 'green',
  SHIVALIK: 'red',
  UDAIGIRI: 'yellow'
} as const;

export const OCCUPATIONS = [
  'Engineering',
  'Medicine',
  'Teaching',
  'Business',
  'Government Service',
  'Armed Forces',
  'Law',
  'Arts & Entertainment',
  'Agriculture',
  'Research & Academia',
  'Others'
] as const;

export const OCCUPATION_SUBFIELDS = {
  Engineering: [
    'Software Development',
    'Civil Engineering',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Others'
  ],
  Medicine: [
    'General Physician',
    'Surgery',
    'Pediatrics',
    'Cardiology',
    'Others'
  ],
  'Government Service': [
    'IAS',
    'IPS',
    'State Services',
    'PSU',
    'Others'
  ],
  // Add more subfields for other occupations
} as const;

export const PARTICIPATION_CATEGORIES = [
  'Education',
  'Sports',
  'Music',
  'Dance',
  'Drama',
  'Debate',
  'Science & Technology',
  'Social Service',
  'Others'
] as const;


export interface Event {
  _id: string;
  title: string;
  description: string;
  startDate: string | Date;
  endDate: string | Date;
  location: string;
  image?: string;
  registeredUsers: string[];
  createdBy: string;
  createdAt: string;
}