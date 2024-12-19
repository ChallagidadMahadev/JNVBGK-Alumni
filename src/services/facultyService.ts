
import api from '../utils/api';
import { Faculty } from '../types/faculty';

export const getFaculty = async (): Promise<Faculty[]> => {
  const { data } = await api.get('/api/faculty');
  return data;
};

export const createFaculty = async (facultyData: Omit<Faculty, 'id' | 'createdAt' | 'updatedAt'>): Promise<Faculty> => {
  const { data } = await api.post('/api/faculty', facultyData);
  return data;
};

export const updateFaculty = async (id: string, facultyData: Partial<Faculty>): Promise<Faculty> => {
  const { data } = await api.put(`/api/faculty/${id}`, facultyData);
  return data;
};

export const deleteFaculty = async (id: string): Promise<void> => {
  await api.delete(`/api/faculty/${id}`);
};
