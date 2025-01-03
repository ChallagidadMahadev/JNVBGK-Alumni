import { z } from 'zod';

// Schema for batch data validation
export const BatchSchema = z.object({
  _id: z.string(),
  batchNumber: z.number(),
  title: z.string(),
  year: z.number(),
  students: z.array(z.object({
    name: z.string(),
    rollNumber: z.string().optional(),
    house: z.enum(['ARAVALI', 'NILGIRI', 'SHIVALIK', 'UDAIGIRI']).optional(),
    achievements: z.string().optional(),
    currentStatus: z.string().optional()
  })),
  createdAt: z.string(),
  updatedAt: z.string()
});

export type Batch = z.infer<typeof BatchSchema>;
export type BatchStudent = Batch['students'][0];

// Form data type for batch upload
export interface BatchUploadFormData {
  batchNumber: number;
  title: string;
  year: number;
}

export interface BatchUploadProps {
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
}