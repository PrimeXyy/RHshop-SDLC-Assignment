import React from 'react';
import { Link } from 'react-router-dom';
import { useAdminMetrics } from '../../hooks/useAdminMetrics';
import { OrderStatusBadge } from '../../components/order/OrderStatusBadge';
import { OrderStatus } from '../../types';

export const LiveMetrics: React.FC = () => {
  const { metrics, serverTime, isLoading, isRefetching, newlyArrivedOrderIds } =
    useAdminMetrics(4000); // 4000ms polling

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: '#111827' }}>
              Admin Live Operations & Inventory
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
                }}
              />
              Live Polling (4s)
            </span>
          </div>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>
            Live throughput, real-time inventory telemetry, and audio/visual arrival change detection across queues.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          {serverTime && (
            <div style={{ fontSize: '0.75rem', color: '#9ca3af', textAlign: 'right' }}>
              Server Time: {new Date(serverTime).toLocaleTimeString()}
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to="/fulfillment" style={{ textDecoration: 'none', padding: '0.35rem 0.75rem', background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              📦 Warehouse Queue &rarr;
            </Link>
            <Link to="/admin/dashboard" style={{ textDecoration: 'none', padding: '0.35rem 0.75rem', background: '#f8fafc', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
              ⚙️ Full Admin Panel &rarr;
            </Link>
          </div>
        </div>
      </div>

      {isLoading || !metrics ? (
        <div style={{ padding: '4rem', textAlign: 'center', color: '#6b7280' }}>
          Loading live metrics telemetry...
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.25rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Total Revenue
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#065f46', marginTop: '0.25rem' }}>
                ${(metrics.totalRevenueInCents / 100).toFixed(2)}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', marginTop: '4px' }}>
                ✓ Across non-cancelled orders
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Total Orders Placed
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#111827', marginTop: '0.25rem' }}>
                {metrics.totalOrders}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#6b7280', marginTop: '4px' }}>
                Active throughout system lifecycle
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Active Warehouse Backlog
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#d97706', marginTop: '0.25rem' }}>
                {metrics.activeBacklog}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: '4px' }}>
                Placed + Processing + Staged
              </div>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1.25rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                Total Catalog Inventory
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4338ca', marginTop: '0.25rem' }}>
                {metrics.totalInventoryUnits || 0}{' '}
                <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#6b7280' }}>units</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#4f46e5', marginTop: '4px' }}>
                {metrics.totalReservedUnits || 0} units committed in active orders
              </div>
            </div>
          </div>

          {/* Section: Live Inventory Management Table */}
          {metrics.inventory && metrics.inventory.length > 0 && (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                  Real-Time Catalog Inventory & Stock Allocation
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                  Auto-updated on order placement, cancellation, & delivery
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Product Name</th>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Category</th>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Unit Price</th>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Total Physical Stock</th>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Reserved in Orders</th>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Available to Sell</th>
                      <th style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#4b5563' }}>Stock Health</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.inventory.map((item) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600, color: '#111827' }}>{item.name}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#6b7280' }}>{item.category}</td>
                        <td style={{ padding: '0.65rem 0.75rem', fontFamily: 'monospace' }}>
                          ${(item.priceInCents / 100).toFixed(2)}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', fontWeight: 600 }}>{item.stock}</td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#d97706', fontWeight: 600 }}>
                          {item.reservedStock}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem', color: '#059669', fontWeight: 700 }}>
                          {item.availableStock}
                        </td>
                        <td style={{ padding: '0.65rem 0.75rem' }}>
                          <span
                            style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: 700,
                              background: item.isLowStock ? '#fef3c7' : '#ecfdf5',
                              color: item.isLowStock ? '#92400e' : '#065f46',
                            }}
                          >
                            {item.isLowStock ? '⚠️ Low Stock' : '✓ In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Section: Live Admin Order Queue with Arrival Highlight & Audio Alert */}
          {metrics.recentOrders && metrics.recentOrders.length > 0 && (
            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', margin: 0 }}>
                    Live Admin Order Queue & Arrival Telemetry
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280' }}>
                    Orders glow with arrival animation and sound a chime when tickets arrive on poll.
                  </p>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    color: '#6b7280',
                    background: '#f3f4f6',
                    padding: '3px 8px',
                    borderRadius: '4px',
                  }}
                >
                  ⚡ Change Detection Active
                </span>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                {metrics.recentOrders.map((ord) => {
                  const isNewArrival = newlyArrivedOrderIds.has(ord.id);
                  return (
                    <div
                      key={ord.id}
                      className={isNewArrival ? 'arrival-highlight' : ''}
                      style={{
                        border: isNewArrival ? '2px solid #eab308' : '1px solid #e5e7eb',
                        borderRadius: '8px',
                        padding: '1rem',
                        background: '#ffffff',
                        position: 'relative',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {isNewArrival && (
                        <div
                          style={{
                            position: 'absolute',
                            top: '-9px',
                            right: '12px',
                            background: '#eab308',
                            color: '#713f12',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.625rem',
                            fontWeight: 800,
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                          }}
                        >
                          ⚡ Just Arrived
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.9rem' }}>
                          {ord.orderNumber}
                        </span>
                        <OrderStatusBadge status={ord.status} size="sm" />
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                        Customer: <strong>{ord.customerName}</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#4b5563' }}>
                        <span>{ord.fulfillmentType === 'PICKUP' ? '🛍️ Pickup' : '🚚 Delivery'}</span>
                        <span style={{ fontWeight: 600 }}>${(ord.totalAmountInCents / 100).toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Status Breakdown Grid */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '1.5rem',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
              Order Lifecycle Distribution
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '1rem',
              }}
            >
              {(Object.keys(metrics.statusBreakdown) as OrderStatus[]).map((status) => (
                <div
                  key={status}
                  style={{
                    background: '#f9fafb',
                    borderRadius: '8px',
                    padding: '0.85rem',
                    textAlign: 'center',
                  }}
                >
                  <OrderStatusBadge status={status} size="sm" />
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#111827', marginTop: '0.5rem' }}>
                    {metrics.statusBreakdown[status]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Live Activity Stream */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: '10px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', marginBottom: '1rem' }}>
              Real-Time Transition Activity Stream
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {metrics.recentActivity.map((act) => (
                <div
                  key={act.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    background: '#f9fafb',
                    borderRadius: '6px',
                    fontSize: '0.8125rem',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#4f46e5' }}>
                      {act.orderNumber}
                    </span>
                    <span>
                      {act.fromStatus ? `${act.fromStatus} → ` : ''}
                      <strong>{act.toStatus}</strong>
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                      ({act.note || `Transitioned by ${act.changedByRole}`})
                    </span>
                  </div>
                  <div style={{ color: '#9ca3af', fontSize: '0.72rem' }}>
                    {new Date(act.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
