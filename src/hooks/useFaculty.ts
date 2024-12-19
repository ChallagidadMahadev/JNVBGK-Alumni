
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { Faculty } from '../types/faculty';
import { getFaculty, createFaculty, updateFaculty, deleteFaculty } from '../services/facultyService';

export const useFaculty = () => {
  const queryClient = useQueryClient();

  const facultyQuery = useQuery({
    queryKey: ['faculty'],
    queryFn: getFaculty
  });

  const createMutation = useMutation({
    mutationFn: createFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty member added successfully');
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Faculty> }) =>
      updateFaculty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty member updated successfully');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFaculty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['faculty'] });
      toast.success('Faculty member deleted successfully');
    }
  });

  return {
    faculty: facultyQuery.data || [],
    isLoading: facultyQuery.isLoading,
    error: facultyQuery.error,
    createFaculty: createMutation.mutateAsync,
    updateFaculty: updateMutation.mutateAsync,
    deleteFaculty: deleteMutation.mutateAsync
  };
};