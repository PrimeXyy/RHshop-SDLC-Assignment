import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFulfillmentQueue } from '../../hooks/useFulfillmentQueue';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { Order } from '../../types';

export const FulfillmentQueue: React.FC = () => {
  const {
    queue,
    counts,
    isLoading,
    isRefetching,
    newlyArrivedOrderIds,
    acceptOrder,
    dispatchOrder,
    transitionStatus,
    isMutating,
  } = useFulfillmentQueue(3000); // 3000ms background polling

  const [filter, setFilter] = useState<string>('ALL');
  const [actingOrderId, setActingOrderId] = useState<string | null>(null);

  const filteredQueue = queue.filter((order) => {
    if (filter === 'ALL') return true;
    if (filter === 'PLACED') return order.status === 'PLACED';
    if (filter === 'PROCESSING') return order.status === 'PROCESSING';
    if (filter === 'READY_FOR_PICKUP') return order.status === 'READY_FOR_PICKUP';
    if (filter === 'SHIPPED') return order.status === 'SHIPPED';
    return true;
  });

  const handleAccept = async (orderId: string) => {
    setActingOrderId(orderId);
    try {
      await acceptOrder(orderId);
    } finally {
      setActingOrderId(null);
    }
  };

  const handleDispatch = async (order: Order) => {
    setActingOrderId(order.id);
    try {
      if (order.fulfillmentType === 'DELIVERY') {
        const tracking =
          window.prompt('Enter carrier tracking number (optional):', `TRK-${Date.now().toString().slice(-8)}`) ||
          undefined;
        await dispatchOrder({ orderId: order.id, trackingNumber: tracking, carrier: 'FastTrack Express' });
      } else {
        await dispatchOrder({ orderId: order.id });
      }
    } finally {
      setActingOrderId(null);
    }
  };

  const handleComplete = async (orderId: string, currentStatus: string) => {
    setActingOrderId(orderId);
    try {
      const nextStatus = currentStatus === 'READY_FOR_PICKUP' ? 'COMPLETED' : 'DELIVERED';
      await transitionStatus({
        orderId,
        nextStatus,
        note: nextStatus === 'COMPLETED' ? 'Customer picked up at counter' : 'Carrier confirmed delivery',
      });
    } finally {
      setActingOrderId(null);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header with Live Sync Status */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#111827' }}>
              Warehouse Fulfillment Queue
            </h1>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#f0fdf4',
                color: '#15803d',
                border: '1px solid #bbf7d0',
                padding: '3px 10px',
                borderRadius: '9999px',
                fontSize: '0.72rem',
                fontWeight: 600,
              }}
            >
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: isRefetching ? '#22c55e' : '#16a34a',
                  boxShadow: isRefetching ? '0 0 8px #22c55e' : 'none',
                  transition: 'all 0.2s',
                }}
              />
              Live Polling (3s)
            </span>
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Real-time ticket dispatcher with audio arrival chimes and instant cache updates.
          </p>
        </div>

        {/* Counter Summary Cards */}
        {counts && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div
              style={{
                background: '#fef3c7',
                border: '1px solid #fde68a',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#92400e', textTransform: 'uppercase' }}>
                New Tickets
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#78350f' }}>{counts.newTickets}</div>
            </div>
            <div
              style={{
                background: '#e0e7ff',
                border: '1px solid #c7d2fe',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3730a3', textTransform: 'uppercase' }}>
                Processing
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#312e81' }}>{counts.inProcessing}</div>
            </div>
            <div
              style={{
                background: '#ccfbf1',
                border: '1px solid #99f6e4',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#115e59', textTransform: 'uppercase' }}>
                Ready / Shipped
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#134e4a' }}>
                {counts.readyForPickup + counts.shipped}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '1px solid #e5e7eb', paddingBottom: '0.5rem' }}>
        {['ALL', 'PLACED', 'PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '6px',
              border: 'none',
              background: filter === f ? '#111827' : 'transparent',
              color: filter === f ? '#ffffff' : '#4b5563',
              fontWeight: filter === f ? 600 : 500,
              fontSize: '0.8125rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {f === 'ALL' ? 'All Active' : f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {isLoading ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#6b7280' }}>
          Loading active fulfillment queue...
        </div>
      ) : filteredQueue.length === 0 ? (
        <div
          style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            background: '#ffffff',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
          }}
        >
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#111827', margin: '0 0 0.5rem' }}>
            Queue is empty
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
            Place a new order from the Storefront; it will arrive here within 3-5 seconds!
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {filteredQueue.map((order) => {
            const isNewArrival = newlyArrivedOrderIds.has(order.id);
            const isProcessingThis = actingOrderId === order.id;

            return (
              <div
                key={order.id}
                className={isNewArrival ? 'arrival-highlight' : ''}
                style={{
                  background: '#ffffff',
                  borderRadius: '10px',
                  border: isNewArrival ? '2px solid #eab308' : '1px solid #e5e7eb',
                  padding: '1.25rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
              >
                {/* New Arrival Badge */}
                {isNewArrival && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      right: '16px',
                      background: '#eab308',
                      color: '#713f12',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    ⚡ Just Arrived
                  </div>
                )}

                {/* Card Top: Order Number & Status */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontFamily: 'monospace',
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#111827',
                        }}
                      >
                        {order.orderNumber}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#6b7280' }}>
                        Customer: <strong>{order.customerName}</strong>
                      </div>
                    </div>
                    <OrderStatusBadge status={order.status} />
                  </div>

                  {/* Fulfillment Type & Destination */}
                  <div
                    style={{
                      background: '#f9fafb',
                      borderRadius: '6px',
                      padding: '0.6rem 0.75rem',
                      marginBottom: '0.85rem',
                      fontSize: '0.78rem',
                      color: '#374151',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                      <span style={{ fontWeight: 600, color: '#4b5563' }}>Fulfillment:</span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: order.fulfillmentType === 'PICKUP' ? '#d97706' : '#2563eb',
                        }}
                      >
                        {order.fulfillmentType === 'PICKUP' ? '🛍️ In-Store Pickup' : '🚚 Home Delivery'}
                      </span>
                    </div>
                    <div style={{ color: '#6b7280' }}>
                      {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                      {order.shippingAddress.state} {order.shippingAddress.postalCode}
                    </div>
                  </div>

                  {/* Items Summary */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
                      Items ({order.itemCount || order.items.length}):
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.8125rem' }}>
                      {order.items.map((it, idx) => (
                        <li
                          key={idx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '2px 0',
                            borderBottom: '1px dashed #f3f4f6',
                          }}
                        >
                          <span>
                            {it.quantity}x {it.name} <span style={{ color: '#9ca3af' }}>({it.size} / {it.color})</span>
                          </span>
                          <span style={{ fontWeight: 500 }}>
                            ${((it.priceInCents * it.quantity) / 100).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Actions: State Machine Transitions */}
                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '0.85rem' }}>
                  {order.status === 'PLACED' && (
                    <button
                      onClick={() => handleAccept(order.id)}
                      disabled={isProcessingThis || isMutating}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        background: '#3730a3',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      {isProcessingThis ? 'Accepting...' : '✓ Accept Ticket → Move to Processing'}
                    </button>
                  )}

                  {order.status === 'PROCESSING' && (
                    <button
                      onClick={() => handleDispatch(order)}
                      disabled={isProcessingThis || isMutating}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        background: order.fulfillmentType === 'PICKUP' ? '#15803d' : '#0f766e',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isProcessingThis
                        ? 'Dispatching...'
                        : order.fulfillmentType === 'PICKUP'
                        ? '📦 Stage Order → Ready For Pickup'
                        : '🚚 Hand to Carrier → Mark Shipped'}
                    </button>
                  )}

                  {(order.status === 'READY_FOR_PICKUP' || order.status === 'SHIPPED') && (
                    <button
                      onClick={() => handleComplete(order.id, order.status)}
                      disabled={isProcessingThis || isMutating}
                      style={{
                        width: '100%',
                        padding: '0.55rem',
                        background: '#111827',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {isProcessingThis
                        ? 'Updating...'
                        : order.status === 'READY_FOR_PICKUP'
                        ? '🤝 Complete Order (Customer Collected)'
                        : '✅ Mark Order Delivered'}
                    </button>
                  )}

                  <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                    <Link
                      to={`/track/${order.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.72rem',
                        color: '#6366f1',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>📍 View Customer Live Tracker</span>
                      <span style={{ fontSize: '0.65rem' }}>↗</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
