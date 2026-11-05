import React from 'react';
import { OrderStatus } from '../../types';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; color: string; border: string }
> = {
  PLACED: {
    label: 'Ticket Placed',
    bg: '#fef3c7',
    color: '#92400e',
    border: '#fcd34d',
  },
  PROCESSING: {
    label: 'Processing',
    bg: '#e0e7ff',
    color: '#3730a3',
    border: '#a5b4fc',
  },
  READY_FOR_PICKUP: {
    label: 'Ready For Pickup',
    bg: '#f0fdf4',
    color: '#166534',
    border: '#86efac',
  },
  SHIPPED: {
    label: 'Shipped',
    bg: '#ccfbf1',
    color: '#115e59',
    border: '#5eead4',
  },
  COMPLETED: {
    label: 'Completed',
    bg: '#ecfdf5',
    color: '#065f46',
    border: '#6ee7b7',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: '#dcfce7',
    color: '#15803d',
    border: '#86efac',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: '#fee2e2',
    color: '#991b1b',
    border: '#fca5a5',
  },
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; size?: 'sm' | 'md' | 'lg' }> = ({
  status,
  size = 'md',
}) => {
  const conf = STATUS_CONFIG[status] || {
    label: status,
    bg: '#f3f4f6',
    color: '#4b5563',
    border: '#e5e7eb',
  };

  const padding = size === 'sm' ? '2px 8px' : size === 'lg' ? '6px 14px' : '4px 10px';
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '0.85rem' : '0.75rem';

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding,
        fontSize,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        borderRadius: '9999px',
        backgroundColor: conf.bg,
        color: conf.color,
        border: `1px solid ${conf.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: conf.color,
          marginRight: '6px',
        }}
      />
      {conf.label}
    </span>
  );
};
