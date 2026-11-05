import { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { LiveMetricsResponse } from '../types';
import { audioAlert } from '../utils/audio';

export const ADMIN_METRICS_QUERY_KEY = ['adminMetrics'];

export function useAdminMetrics(pollIntervalMs = 4000) {
  const [newlyArrivedOrderIds, setNewlyArrivedOrderIds] = useState<Set<string>>(new Set());
  const knownOrderIdsRef = useRef<Set<string>>(new Set());
  const isInitialLoadRef = useRef<boolean>(true);

  const query = useQuery<LiveMetricsResponse>({
    queryKey: ADMIN_METRICS_QUERY_KEY,
    queryFn: async () => {
      const res = await apiClient.get<LiveMetricsResponse>('/admin/metrics');
      return res.data;
    },
    refetchInterval: pollIntervalMs,
    refetchIntervalInBackground: true,
  });

  // Change Detection for Audio & Visual Arrival Alert on Admin Order Queue
  useEffect(() => {
    if (!query.data?.metrics?.recentOrders) return;

    const currentOrders = query.data.metrics.recentOrders;
    const currentIds = new Set(currentOrders.map((o) => o.id));

    if (isInitialLoadRef.current) {
      knownOrderIdsRef.current = currentIds;
      isInitialLoadRef.current = false;
      return;
    }

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

      knownOrderIdsRef.current = currentIds;

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

  return {
    metrics: query.data?.metrics,
    serverTime: query.data?.serverTime,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    error: query.error,
    newlyArrivedOrderIds,
  };
}
