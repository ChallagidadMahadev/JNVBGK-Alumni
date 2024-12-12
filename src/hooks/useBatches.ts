import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { getBatches, uploadBatch, updateBatch, deleteBatch } from '../services/batchService';
import { Batch } from '../types/batch';

export const useBatches = () => {
  const queryClient = useQueryClient();

  const batchesQuery = useQuery({
    queryKey: ['batches'],
    queryFn: getBatches
  });

  const uploadBatchMutation = useMutation({
    mutationFn: uploadBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch uploaded successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to upload batch');
    }
  });

  const updateBatchMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Batch> }) =>
      updateBatch(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update batch');
    }
  });

  const deleteBatchMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['batches'] });
      toast.success('Batch deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete batch');
    }
  });

  return {
    batches: batchesQuery.data || [],
    isLoading: batchesQuery.isLoading,
    error: batchesQuery.error,
    uploadBatch: uploadBatchMutation.mutateAsync,
    updateBatch: updateBatchMutation.mutateAsync,
    deleteBatch: deleteBatchMutation.mutateAsync
  };
};
