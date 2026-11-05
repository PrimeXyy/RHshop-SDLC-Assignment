import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { OrderStatusResponse } from '../types';

export function useOrderStatusTracker(orderId: string | undefined, pollIntervalMs = 3000) {
  const queryClient = useQueryClient();

  const query = useQuery<OrderStatusResponse>({
    queryKey: ['orderStatus', orderId],
    queryFn: async () => {
      if (!orderId) throw new Error('Order ID is required');
      const res = await apiClient.get<OrderStatusResponse>(`/orders/${orderId}/status`);
      return res.data;
    },
    enabled: !!orderId,
    // Poll every 3000ms until a terminal status (COMPLETED, DELIVERED, CANCELLED) is reached
    refetchInterval: (queryData) => {
      if (queryData?.state.data?.isTerminal) {
        return false;
      }
      return pollIntervalMs;
    },
    refetchIntervalInBackground: true,
  });

  // Cancel order mutation with instant cache invalidation
  const cancelOrderMutation = useMutation({
    mutationFn: async (reason?: string) => {
      if (!orderId) throw new Error('No order ID');
      const res = await apiClient.post(`/orders/${orderId}/cancel`, {
        reason: reason || 'Customer requested cancellation',
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orderStatus', orderId] });
      queryClient.invalidateQueries({ queryKey: ['fulfillmentQueue'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
  });

  return {
    orderStatus: query.data,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    cancelOrder: cancelOrderMutation.mutateAsync,
    isCancelling: cancelOrderMutation.isPending,
  };
}
