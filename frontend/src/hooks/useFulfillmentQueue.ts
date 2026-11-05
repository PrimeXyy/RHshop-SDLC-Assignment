import { useState, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { FulfillmentQueueResponse, OrderStatus } from '../types';
import { audioAlert } from '../utils/audio';

export const FULFILLMENT_QUEUE_QUERY_KEY = ['fulfillmentQueue'];

export function useFulfillmentQueue(pollIntervalMs = 3000) {
  const queryClient = useQueryClient();
  const [newlyArrivedOrderIds, setNewlyArrivedOrderIds] = useState<Set<string>>(new Set());
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  // Background polling query (3000ms - 5000ms)
  const query = useQuery<FulfillmentQueueResponse>({
    queryKey: FULFILLMENT_QUEUE_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get<FulfillmentQueueResponse>('/fulfillment/queue');
      return res.data;
    },
    refetchInterval: pollIntervalMs,
    refetchIntervalInBackground: true,
  });

  // Change Detection for Audio & Visual Arrival Alert
  useEffect(() => {
    if (!query.data?.queue) return;

    const currentOrders = query.data.queue;
    const currentIds = new Set(currentOrders.map((o) => o.id));

    if (isInitialLoadRef.current) {
      // On initial load, record existing IDs without chiming
      knownOrderIdsRef.current = currentIds;
      isInitialLoadRef.current = false;
      return;
    }

    // Find newly arrived order IDs not present in previous poll
    const brandNewIds: string[] = [];
    currentIds.forEach((id) => {
      if (!knownOrderIdsRef.current.has(id)) {
        brandNewIds.push(id);
      }
    });

    if (brandNewIds.length > 0) {
      // 1. Play audio chime via Web Audio API
      audioAlert.playNewOrderChime();

      // 2. Mark newly arrived order cards for visual highlight animation
      setNewlyArrivedOrderIds((prev) => {
        const next = new Set(prev);
        brandNewIds.forEach((id) => next.add(id));
        return next;
      });

      // Update known IDs
      knownOrderIdsRef.current = currentIds;

      // Automatically fade highlight after 6 seconds
      setTimeout(() => {
        setNewlyArrivedOrderIds((prev) => {
          const next = new Set(prev);
          brandNewIds.forEach((id) => next.delete(id));
          return next;
        });
      }, 6000);
    } else {
      knownOrderIdsRef.current = currentIds;
    }
  }, [query.data]);

  // Mutation 1: Accept Order (PLACED -> PROCESSING) with instant cache invalidation
  const acceptOrderMutation = useMutation({
    mutationFn: async (orderId: string) => {
      const res = await apiClient.post(`/fulfillment/orders/${orderId}/accept`);
      return res.data;
    },
    onSuccess: (_, orderId) => {
      // Instant cache invalidation
      queryClient.invalidateQueries({ queryKey: FULFILLMENT_QUEUE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['orderStatus', orderId] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
  });

  // Mutation 2: Dispatch Order (PROCESSING -> SHIPPED / READY_FOR_PICKUP) with instant cache invalidation
  const dispatchOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      trackingNumber,
      carrier,
    }: {
      orderId: string;
      trackingNumber?: string;
      carrier?: string;
    }) => {
      const res = await apiClient.post(`/fulfillment/orders/${orderId}/dispatch`, {
        trackingNumber,
        carrier,
      });
      return res.data;
    },
    onSuccess: (_, { orderId }) => {
      // Instant cache invalidation
      queryClient.invalidateQueries({ queryKey: FULFILLMENT_QUEUE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['orderStatus', orderId] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
  });

  // Mutation 3: Generic State Transition
  const transitionStatusMutation = useMutation({
    mutationFn: async ({
      orderId,
      nextStatus,
      trackingNumber,
      note,
    }: {
      orderId: string;
      nextStatus: OrderStatus;
      trackingNumber?: string;
      note?: string;
    }) => {
      const res = await apiClient.patch(`/fulfillment/orders/${orderId}/status`, {
        nextStatus,
        trackingNumber,
        note,
      });
      return res.data;
    },
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: FULFILLMENT_QUEUE_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['orderStatus', orderId] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });
    },
  });

  return {
    queue: query.data?.queue || [],
    counts: query.data?.counts,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    newlyArrivedOrderIds,
    acceptOrder: acceptOrderMutation.mutateAsync,
    dispatchOrder: dispatchOrderMutation.mutateAsync,
    transitionStatus: transitionStatusMutation.mutateAsync,
    isMutating:
      acceptOrderMutation.isPending ||
      dispatchOrderMutation.isPending ||
      transitionStatusMutation.isPending,
  };
}
