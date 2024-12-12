import api from '../utils/api';
import { Batch, BatchUpload } from '../types/batch';

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
