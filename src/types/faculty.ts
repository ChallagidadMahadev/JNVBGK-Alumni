import { z } from 'zod';

export const SubjectEnum = {
  Mathematics: 'Mathematics',
  Physics: 'Physics',
  Chemistry: 'Chemistry',
  Biology: 'Biology',
  English: 'English',
  Hindi: 'Hindi',
  SocialScience: 'Social Science',
  Kannada: 'Kannada',
  PhysicalEducation: 'Physical Education',
  ComputerScience: 'Computer Science'
} as const;

export const DesignationEnum = {
  Principal: 'Principal',
  VicePrincipal: 'Vice Principal',
  PGT: 'Post Graduate Teacher',
  TGT: 'Trained Graduate Teacher',
  Librarian: 'Librarian',
  ComputerInstructor: 'Computer Instructor',
  PhysicalEducationTeacher: 'Physical Education Teacher',
  ArtTeacher: 'Art Teacher',
  MusicTeacher: 'Music Teacher',
  Counselor: 'Counselor',
  LabAssistant: 'Laboratory Assistant',
  AdministrativeStaff: 'Administrative Staff',
  Accountant: 'Accountant',
  Clerk: 'Clerk',
  Matron: 'Matron',
  Warden: 'Warden',
  Nurse: 'Nurse',
  SecurityGuard: 'Security Guard',
  Sweeper: 'Sweeper',
  Cook: 'Cook',
  Driver: 'Driver'
} as const;


export const FacultySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
  contactNumber: z.string().optional(),
  isCurrentlyTeaching: z.boolean().default(true),
  location: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string()
});

// export const FacultySchema = z.object({
//   id: z.string(),
//   name: z.string().min(1, 'Name is required'),
//   designation: z.enum(Object.values(DesignationEnum) as [string, ...string[]]),
//   subject: z.enum(Object.values(SubjectEnum) as [string, ...string[]]),
//   contactNumber: z.string().optional(),
//   isCurrentlyTeaching: z.boolean(),
//   location: z.string(),
//   createdAt: z.string(),
//   updatedAt: z.string()
// });

export type Faculty = z.infer<typeof FacultySchema>;
