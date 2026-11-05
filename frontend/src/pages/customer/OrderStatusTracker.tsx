import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useOrderStatusTracker } from '../../hooks/useOrderStatusTracker';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { OrderStatus } from '../../types';

export const OrderStatusTracker: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [inputOrderId, setInputOrderId] = useState<string>(id || 'ord_1001');
  const [activeOrderId, setActiveOrderId] = useState<string>(id || 'ord_1001');

  React.useEffect(() => {
    if (id) {
      setInputOrderId(id);
      setActiveOrderId(id);
    }
  }, [id]);

  const { orderStatus, isLoading, isRefetching, error, cancelOrder, isCancelling } =
    useOrderStatusTracker(activeOrderId, 3000); // 3000ms polling

  // Define steps for Delivery vs Pickup
  const isPickup = orderStatus?.fulfillmentType === 'PICKUP';

  const steps: { key: OrderStatus; label: string; desc: string }[] = isPickup
    ? [
        { key: 'PLACED', label: 'Ticket Placed', desc: 'Received by warehouse' },
        { key: 'PROCESSING', label: 'Processing', desc: 'Packing & preparing items' },
        { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Staged at store counter' },
        { key: 'COMPLETED', label: 'Completed', desc: 'Collected by customer' },
      ]
    : [
        { key: 'PLACED', label: 'Order Placed', desc: 'Submitted to fulfillment' },
        { key: 'PROCESSING', label: 'Processing', desc: 'Packing in warehouse' },
        { key: 'SHIPPED', label: 'Shipped', desc: 'Handed to carrier' },
        { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your door' },
      ];

  const getStepIndex = (status: OrderStatus): number => {
    if (status === 'CANCELLED') return -1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx >= 0 ? idx : 0;
  };

  const currentStepIdx = orderStatus ? getStepIndex(orderStatus.status) : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputOrderId.trim()) {
      setActiveOrderId(inputOrderId.trim());
    }
  };

  return (
    <div style={{ maxWidth: '840px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      {/* Header & Order Lookup Input */}
      <div style={{ marginBottom: '2rem' }}>
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2.2rem',
            fontWeight: 600,
            color: '#111827',
            marginBottom: '0.5rem',
          }}
        >
          Live Order Status Tracker
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
          This page polls the server every <strong>3 seconds</strong>. Status changes made by the warehouse
          will reflect here automatically without refreshing!
        </p>

        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', maxWidth: '480px' }}>
          <input
            type="text"
            value={inputOrderId}
            onChange={(e) => setInputOrderId(e.target.value)}
            placeholder="Enter Order ID (e.g. ord_1001)"
            style={{
              flex: 1,
              padding: '0.6rem 0.85rem',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              fontSize: '0.875rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.25rem',
              background: '#111827',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
            }}
          >
            Track Order
          </button>
        </form>
      </div>

      {isLoading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#6b7280' }}>
          Connecting to live order tracker...
        </div>
      ) : error || !orderStatus ? (
        <div
          style={{
            padding: '2.5rem',
            textAlign: 'center',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#991b1b',
          }}
        >
          Order <strong>{activeOrderId}</strong> not found. Try placing an order on the Storefront first!
        </div>
      ) : (
        <div
          style={{
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            padding: '2rem',
          }}
        >
          {/* Status Bar Top */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid #f3f4f6',
              paddingBottom: '1.25rem',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Order Number
              </span>
              <div style={{ fontFamily: 'monospace', fontSize: '1.35rem', fontWeight: 700, color: '#111827' }}>
                {orderStatus.orderNumber}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: '#f0fdf4',
                  color: '#15803d',
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isRefetching ? '#22c55e' : '#16a34a',
                    boxShadow: isRefetching ? '0 0 6px #22c55e' : 'none',
                  }}
                />
                Live Polling (3s)
              </span>

              <OrderStatusBadge status={orderStatus.status} size="lg" />
            </div>
          </div>

          {/* Stepper Progress Bar */}
          {orderStatus.status === 'CANCELLED' ? (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                padding: '1.25rem',
                borderRadius: '8px',
                textAlign: 'center',
                color: '#991b1b',
                marginBottom: '2rem',
              }}
            >
              <strong>Order Cancelled:</strong> This order has been voided.
            </div>
          ) : (
            <div style={{ marginBottom: '2.5rem' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${steps.length}, 1fr)`,
                  position: 'relative',
                  gap: '0.5rem',
                }}
              >
                {steps.map((st, i) => {
                  const isDone = currentStepIdx > i;
                  const isCurrent = currentStepIdx === i;

                  return (
                    <div key={st.key} style={{ textAlign: 'center', position: 'relative' }}>
                      {/* Step Indicator Node */}
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          margin: '0 auto 0.6rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          background: isDone ? '#10b981' : isCurrent ? '#4f46e5' : '#f3f4f6',
                          color: isDone || isCurrent ? '#ffffff' : '#9ca3af',
                          border: isCurrent ? '3px solid #c7d2fe' : 'none',
                          boxShadow: isCurrent ? '0 0 12px rgba(79, 70, 229, 0.4)' : 'none',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>

                      <div
                        style={{
                          fontSize: '0.8125rem',
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? '#111827' : isDone ? '#059669' : '#9ca3af',
                          marginBottom: '2px',
                        }}
                      >
                        {st.label}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>{st.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Details & Live Carrier Tracking */}
          <div
            style={{
              background: '#f9fafb',
              borderRadius: '8px',
              padding: '1.25rem',
              marginBottom: '1.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Fulfillment Mode
              </span>
              <div style={{ fontWeight: 600, color: '#111827', marginTop: '2px' }}>
                {orderStatus.fulfillmentType === 'PICKUP' ? '🛍️ In-Store Pickup' : '🚚 Home Delivery'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Carrier Tracking
              </span>
              <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#2563eb', marginTop: '2px' }}>
                {orderStatus.trackingNumber ? orderStatus.trackingNumber : 'Pending dispatch by warehouse'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: 600 }}>
                Last Updated
              </span>
              <div style={{ fontSize: '0.85rem', color: '#374151', marginTop: '2px' }}>
                {new Date(orderStatus.updatedAt).toLocaleTimeString()}
              </div>
            </div>
          </div>

          {/* Status Timeline History */}
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: '#111827', marginBottom: '0.75rem' }}>
              Event Audit Trail
            </h4>
            <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              {orderStatus.statusHistory.map((log) => (
                <div key={log.id} style={{ marginBottom: '0.75rem', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: '-21px',
                      top: '4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#4f46e5',
                    }}
                  />
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#111827' }}>
                    Status: {log.toStatus}{' '}
                    <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 400 }}>
                      by {log.changedByRole || 'SYSTEM'}
                    </span>
                  </div>
                  {log.note && <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>{log.note}</div>}
                  <div style={{ fontSize: '0.7rem', color: '#9ca3af' }}>
                    {new Date(log.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cancel Option if still PLACED */}
          {orderStatus.status === 'PLACED' && (
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', textAlign: 'right' }}>
              <button
                onClick={() => cancelOrder('Customer cancelled order before warehouse processing')}
                disabled={isCancelling}
                style={{
                  background: 'none',
                  border: '1px solid #fca5a5',
                  color: '#dc2626',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {isCancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OrderStatusTracker;
