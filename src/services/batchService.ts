import api from '../utils/api';
import { Batch, BatchUploadFormData } from '../types/batch';
import { parseCSV, parseExcel, parseTXT } from './fileParser';

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

export const validateBatchFile = async (file: File): Promise<boolean> => {
  try {
    let students;
    switch (file.type) {
      case 'text/csv':
        students = await parseCSV(file);
        break;
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/vnd.ms-excel':
        students = await parseExcel(file);
        break;
      case 'text/plain':
        students = await parseTXT(file);
        break;
      default:
        throw new Error('Unsupported file type');
    }

    return students.length > 0 && students.every(student => student.name);
  } catch (error) {
    console.error('File validation error:', error);
    return false;
  }
};