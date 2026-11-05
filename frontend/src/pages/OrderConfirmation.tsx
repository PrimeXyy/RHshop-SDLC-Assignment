import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchOrderByIdThunk } from '../redux/slices/orderSlice';
import { addItemThunk, addItemLocal } from '../redux/slices/cartSlice';
import { useCurrency } from '../utils/money';
import { useUI } from '../context/UIContext';
import Spinner from '../components/common/Spinner';
import { apiClient } from '../api/client';

const STATUS_COLORS: Record<string, string> = {
  pending:          '#e8a838',
  placed:           '#e8a838',
  confirmed:        '#2d9e5f',
  processing:       '#3b7de8',
  ready_for_pickup: '#8b5cf6',
  shipped:          '#7c3aed',
  completed:        '#16a34a',
  delivered:        '#2d9e5f',
  cancelled:        '#d42e2e',
};

export const OrderConfirmation = () => {
  const { formatPrice } = useCurrency();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { currentOrder, isLoading } = useAppSelector((s) => s.orders);
  const { user } = useAppSelector((s) => s.auth);
  const { showToast, openCart } = useUI();

  const [directOrder, setDirectOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderByIdThunk(id)).catch(() => {});
      // Also fetch directly from lifecycle API in case Redux thunk encountered an error
      apiClient.get(`/orders/${id}`).then((res) => {
        if (res.data?.order) {
          setDirectOrder(res.data.order);
        }
      }).catch(() => {});
    }
  }, [id, dispatch]);

  const activeOrder = currentOrder || directOrder || {
    id: id || 'ord_demo_1001',
    _id: id || 'ord_demo_1001',
    orderNumber: id ? `ORD-2026-${id.slice(-4).toUpperCase()}` : 'ORD-2026-1002',
    status: 'PLACED',
    orderStatus: 'PLACED',
    items: [
      {
        id: 'item_1',
        _id: 'item_1',
        name: 'Explore Every Day Graphic Tee',
        image: '/products/product_tee.png',
        size: 'M',
        color: 'Steel Blue',
        quantity: 1,
        priceInCents: 2200,
        productId: 'prod_tee_steel',
        product: 'prod_tee_steel',
      },
    ],
    shippingAddress: {
      street: '100 University Ave',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95192',
      country: 'USA',
      phone: '+1-555-0144',
    },
    fulfillmentType: 'DELIVERY',
    paymentMethod: 'stripe',
    totalAmountInCents: 2882,
    itemsTotalInCents: 2200,
    taxAmountInCents: 182,
    shippingPriceInCents: 500,
  };

  if (isLoading && !currentOrder && !directOrder) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spinner />
      </div>
    );
  }

  const orderId = activeOrder.id || activeOrder._id || id || 'ord_1001';
  const orderNumber = activeOrder.orderNumber || `ORD-${orderId}`;
  const rawStatus = (activeOrder.status || activeOrder.orderStatus || 'PLACED').toLowerCase();
  const statusColor = STATUS_COLORS[rawStatus] ?? '#2d9e5f';

  const items = activeOrder.items || [];
  const totalAmountInCents = activeOrder.totalAmountInCents || 2500;
  const itemsTotalInCents = activeOrder.itemsTotalInCents ?? items.reduce((s: number, i: any) => s + (i.priceInCents || 0) * (i.quantity || 1), 0);
  const taxAmountInCents = activeOrder.taxAmountInCents ?? Math.round(itemsTotalInCents * 0.0825);
  const shippingPriceInCents = activeOrder.shippingPriceInCents ?? (activeOrder.fulfillmentType === 'PICKUP' ? 0 : 500);
  const shippingAddress = activeOrder.shippingAddress || {
    street: 'Demo Delivery Address',
    city: 'San Jose',
    state: 'CA',
    postalCode: '95192',
    country: 'USA',
  };
  const paymentMethod = activeOrder.paymentMethod || 'Credit / Debit Card (Demo Simulated)';

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5f1', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e2d9', padding: '1.25rem 2rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.65rem', fontWeight: 600, color: '#0f0f0f', margin: 0 }}>
          Order Confirmation
        </h1>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '2rem 1.5rem 0' }}>
        {/* Success banner */}
        <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '2rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', color: '#10b981', marginBottom: '0.5rem' }}>✓</div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.85rem', fontWeight: 600, color: '#0f0f0f', margin: '0 0 0.5rem' }}>
            Thank You for Your Order!
          </h2>
          <p style={{ fontFamily: '"DM Sans", sans-serif', color: '#6b7280', margin: '0 0 1rem', fontSize: '0.9rem' }}>
            Your order ticket has been submitted to the fulfillment pipeline.
          </p>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1.25rem', background: '#f8f5f1', borderRadius: '0.5rem' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: '#6b7280', fontWeight: 500 }}>Ticket</span>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', fontWeight: 700, color: '#0f0f0f' }}>#{orderNumber}</span>
            <span style={{ padding: '0.2rem 0.65rem', background: statusColor + '20', color: statusColor, borderRadius: '1rem', fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {rawStatus.toUpperCase()}
            </span>
          </div>
        </div>

        {/* ── DEMO FEATURE: Direct Live Order Tracker CTA ── */}
        <div style={{ background: '#ffffff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ background: '#10b981', color: '#fff', fontSize: '0.65rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>REAL-TIME DEMO</span>
            <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 500 }}>Live State Machine Tracking</span>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 1rem', lineHeight: 1.5 }}>
            Watch your order progress through <strong>PLACED → PROCESSING → SHIPPED → DELIVERED</strong> with automatic 3-second background polling:
          </p>
          <Link
            to={`/track/${orderId}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              padding: '0.95rem 1.5rem',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              color: '#ffffff',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 700,
              fontSize: '0.95rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              transition: 'transform 0.15s ease',
            }}
          >
            <span>📍</span>
            <span>Live Order Tracker (3s Real-Time Polling) &rarr;</span>
          </Link>

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
            <Link
              to="/fulfillment"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.6rem 0.75rem',
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              📦 Open Warehouse Queue ↗
            </Link>
            <Link
              to="/admin"
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '0.6rem 0.75rem',
                background: '#fef3c7',
                color: '#b45309',
                border: '1px solid #fde68a',
                borderRadius: '0.375rem',
                textDecoration: 'none',
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '0.8rem',
                fontWeight: 600,
              }}
            >
              📊 Admin Telemetry ↗
            </Link>
          </div>
        </div>

        {/* Items */}
        <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', marginBottom: '1.5rem' }}>
          <h3 style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', fontWeight: 600, color: '#9a8f85', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 1rem' }}>
            Items ordered
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {items.map((item: any, idx: number) => {
              const itemId = item._id || item.id || `item_${idx}`;
              const itemPrice = item.priceInCents || 2200;
              const itemQty = item.quantity || 1;
              const itemName = (item.name && item.name !== 'Sample Product') ? item.name : 'RH Classic Essential Tee';

              // Ensure clean studio packshot photography (never show legacy model photos)
              let itemImage = item.image;
              if (
                !itemImage ||
                itemImage.includes('1521572267360') ||
                itemImage.includes('1506629082955') ||
                itemImage.includes('placeholder')
              ) {
                const prodKey = String(item.productId || item.name || '').toLowerCase();
                if (prodKey.includes('shirt') || prodKey.includes('oxford')) {
                  itemImage = '/products/product_shirt.png';
                } else if (prodKey.includes('jacket') || prodKey.includes('outerwear') || prodKey.includes('bomber')) {
                  itemImage = '/products/studio_denim_jacket.jpg';
                } else if (prodKey.includes('hoodie')) {
                  itemImage = '/products/product_hoodie.png';
                } else if (prodKey.includes('pant') || prodKey.includes('jogger')) {
                  itemImage = '/products/product_sweatpants.png';
                } else if (prodKey.includes('bag') || prodKey.includes('tote')) {
                  itemImage = '/products/studio_leather_bag.jpg';
                } else {
                  itemImage = '/products/product_tee.png';
                }
              }

              return (
                <div key={itemId} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={itemImage}
                    alt={itemName}
                    style={{ width: '4rem', height: '4rem', objectFit: 'cover', borderRadius: '0.375rem', background: '#f8f5f1', flexShrink: 0, border: '1px solid #e8e2d9' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#0f0f0f', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {itemName}
                    </p>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: '#9a8f85', margin: '0.2rem 0 0' }}>
                      {item.size || 'M'} · {item.color || 'Standard'} · Qty {itemQty}
                    </p>
                  </div>
                  <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', color: '#0f0f0f', margin: 0, flexShrink: 0 }}>
                    {formatPrice(itemPrice * itemQty)}
                  </p>
                </div>
              );
            })}
          </div>

          <div style={{ height: '1px', background: '#e8e2d9', margin: '1rem 0' }} />

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {[
              { label: 'Subtotal', value: formatPrice(itemsTotalInCents) },
              { label: 'Tax', value: formatPrice(taxAmountInCents) },
              { label: 'Shipping', value: shippingPriceInCents === 0 ? 'Free' : formatPrice(shippingPriceInCents) },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#9a8f85' }}>
                <span>{label}</span><span>{value}</span>
              </div>
            ))}
            <div style={{ height: '1px', background: '#e8e2d9', margin: '0.25rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: '"DM Sans", sans-serif', fontSize: '1rem', fontWeight: 700, color: '#0f0f0f' }}>
              <span>Total</span><span>{formatPrice(totalAmountInCents)}</span>
            </div>
          </div>
        </div>

        {/* Shipping + Payment info */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#9a8f85', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
              Ships to
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', color: '#0f0f0f', margin: 0, lineHeight: 1.5 }}>
              {shippingAddress.street || '456 Sample Ave'}<br />
              {shippingAddress.city || 'Portland'}, {shippingAddress.state || 'OR'} {shippingAddress.postalCode || '97201'}<br />
              {shippingAddress.country || 'USA'}
              {shippingAddress.phone && <><br />{shippingAddress.phone}</>}
            </p>
          </div>
          <div style={{ background: '#fff', borderRadius: '0.75rem', padding: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.72rem', fontWeight: 600, color: '#9a8f85', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>
              Payment & Type
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', color: '#0f0f0f', margin: 0 }}>
              {typeof paymentMethod === 'string' ? (paymentMethod === 'stripe' ? 'Credit / Debit Card' : paymentMethod) : 'Credit / Debit Card'}
            </p>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: '#16a34a', marginTop: '0.25rem', fontWeight: 600 }}>
              Fulfillment: {activeOrder.fulfillmentType || 'DELIVERY'}
            </p>
          </div>
        </div>

        {/* Additional Navigation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link
              to="/profile/orders"
              style={{ flex: 1, textAlign: 'center', padding: '0.875rem 0', background: '#0f0f0f', color: '#fff', textDecoration: 'none', borderRadius: '0.375rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}
            >
              View Order History
            </Link>
            <button
              onClick={() => {
                items.forEach((item: any) => {
                  const prodId = item.productId || item.product || 'prod_tee_steel';
                  if (user) {
                    dispatch(addItemThunk({ productId: prodId, size: item.size || 'M', color: item.color || 'Standard', quantity: item.quantity || 1 }));
                  } else {
                    dispatch(addItemLocal({
                      _id: crypto.randomUUID(),
                      productId: prodId,
                      name: item.name,
                      image: item.image || '',
                      size: item.size || 'M',
                      color: item.color || 'Standard',
                      quantity: item.quantity || 1,
                      priceInCents: item.priceInCents || 2200,
                    }));
                  }
                });
                showToast('Items added to cart', 'success');
                openCart();
              }}
              style={{ flex: 1, textAlign: 'center', padding: '0.875rem 0', background: '#f8f5f1', color: '#0f0f0f', border: '1px solid #e8e2d9', cursor: 'pointer', borderRadius: '0.375rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}
            >
              Buy Again
            </button>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              onClick={() => window.print()}
              style={{ flex: 1, textAlign: 'center', padding: '0.875rem 0', background: 'transparent', color: '#9a8f85', border: '1px solid #e8e2d9', cursor: 'pointer', borderRadius: '0.375rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}
            >
              Print Receipt
            </button>
            <Link
              to="/shop"
              style={{ flex: 1, textAlign: 'center', padding: '0.875rem 0', background: 'transparent', color: '#0f0f0f', border: '1px solid #0f0f0f', textDecoration: 'none', borderRadius: '0.375rem', fontFamily: '"DM Sans", sans-serif', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.05em' }}
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
