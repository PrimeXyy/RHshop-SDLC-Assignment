import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../../api/client';
import { FulfillmentType } from '../../types';

interface SampleItem {
  id: string;
  name: string;
  priceInCents: number;
  category: string;
  color: string;
  size: string;
  image: string;
}

const SAMPLE_PRODUCTS: SampleItem[] = [
  {
    id: 'prod_tee_steel',
    name: 'Explore Every Day Graphic Tee',
    priceInCents: 2200,
    category: 'Shirt (Kids)',
    color: 'Steel Blue',
    size: 'M',
    image: "/products/product_tee.png",
  },
  {
    id: 'prod_jogger_olive',
    name: 'Kids Jogger Pant',
    priceInCents: 2500,
    category: 'Pant (Kids)',
    color: 'Olive',
    size: 'L',
    image: "/products/product_sweatpants.png",
  },
  {
    id: 'prod_hoodie_sage',
    name: 'Kids Crewneck Sweatshirt',
    priceInCents: 3200,
    category: 'Outerwear (Kids)',
    color: 'Sage',
    size: 'S',
    image: "/products/product_hoodie.png",
  },
  {
    id: 'prod_men_oxford_shirt',
    name: 'Classic Oxford Button-Down Shirt',
    priceInCents: 4800,
    category: 'Shirt (Men)',
    color: 'Steel Blue',
    size: 'L',
    image: "/products/studio_oxford_shirt.jpg",
  },
  {
    id: 'prod_men_wool_bomber',
    name: 'Insulated Flight Bomber Jacket',
    priceInCents: 8900,
    category: 'Outerwear (Men)',
    color: 'Olive',
    size: 'XL',
    image: "/products/product_coat.png",
  },
  {
    id: 'prod_men_selvedge_denim',
    name: 'Slim Taper Japanese Selvedge Jeans',
    priceInCents: 7500,
    category: 'Pant (Men)',
    color: 'Blue',
    size: 'M',
    image: "/products/product_denim.png",
  },
  {
    id: 'prod_women_cashmere_crew',
    name: 'Pure Cashmere Relaxed Crewneck',
    priceInCents: 7800,
    category: 'Outerwear (Women)',
    color: 'Sage',
    size: 'S',
    image: "/products/product_knitwear.png",
  },
  {
    id: 'prod_women_linen_blouse',
    name: 'Breezy French Linen Oversized Shirt',
    priceInCents: 5200,
    category: 'Shirt (Women)',
    color: 'White',
    size: 'M',
    image: "/products/studio_women_blouse.jpg",
  },
  {
    id: 'prod_women_wide_trouser',
    name: 'High-Rise Wide-Leg Pleated Pant',
    priceInCents: 5800,
    category: 'Pant (Women)',
    color: 'Charcoal',
    size: 'S',
    image: "/products/product_sweatpants.png",
  },
  {
    id: 'prod_canvas_commute_backpack',
    name: 'Weatherproof Roll-Top Commuter Backpack',
    priceInCents: 6800,
    category: 'Accessories (Unisex)',
    color: 'Olive',
    size: 'One Size',
    image: "/products/studio_tote_bag.jpg",
  },
  {
    id: 'prod_women_knit_turtleneck',
    name: 'Oversized Merino Wool Turtleneck Sweater',
    priceInCents: 6800,
    category: 'Knitwear (Women)',
    color: 'Camel',
    size: 'M',
    image: "/products/product_knitwear.png",
  },
  {
    id: 'prod_women_ribbed_tee',
    name: 'Supima Cotton Ribbed Baby Tee',
    priceInCents: 2800,
    category: 'Shirt (Women)',
    color: 'Sage',
    size: 'S',
    image: "/products/product_tee.png",
  },
  {
    id: 'prod_kids_sherpa_zip_jacket',
    name: 'Plush Sherpa Fleece Full-Zip Jacket',
    priceInCents: 4200,
    category: 'Outerwear (Kids)',
    color: 'Khaki',
    size: 'M',
    image: "/products/studio_puffer_jacket.jpg",
  },
  {
    id: 'prod_kids_hoodie_fleece',
    name: 'Colorblock Organic Cotton Pullover Hoodie',
    priceInCents: 3600,
    category: 'Outerwear (Kids)',
    color: 'Blue',
    size: 'S',
    image: "/products/product_hoodie.png",
  },
  {
    id: 'prod_men_corduroy_overshirt',
    name: '8-Wale Cotton Corduroy Overshirt',
    priceInCents: 6400,
    category: 'Shirt (Men)',
    color: 'Khaki',
    size: 'L',
    image: "/products/studio_oxford_shirt.jpg",
  },
  {
    id: 'prod_men_tech_fleece_zip',
    name: 'Thermal Double-Knit Zip Track Hoodie',
    priceInCents: 7400,
    category: 'Outerwear (Men)',
    color: 'Black',
    size: 'L',
    image: "/products/product_hoodie.png",
  },
];

export const Storefront: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>('DELIVERY');
  const [selectedProduct, setSelectedProduct] = useState<SampleItem>(SAMPLE_PRODUCTS[0]);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const placeOrderMutation = useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/orders', {
        fulfillmentType,
        items: [
          {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            priceInCents: selectedProduct.priceInCents,
            quantity: 1,
            size: selectedProduct.size,
            color: selectedProduct.color,
            image: selectedProduct.image,
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
        notes: `Simulated live order via Storefront (${fulfillmentType})`,
      });
      return res.data;
    },
    onSuccess: (data) => {
      // Invalidate fulfillment queue and admin metrics instantly
      queryClient.invalidateQueries({ queryKey: ['fulfillmentQueue'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });

      setCreatedOrderNumber(data.order.orderNumber);
      setCreatedOrderId(data.order.id);
    },
  });

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '3rem',
            fontWeight: 500,
            color: '#111827',
            marginBottom: '0.75rem',
            letterSpacing: '0.02em',
          }}
        >
          Customer Storefront
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Test the end-to-end order state machine: place an order here, then watch the Warehouse Fulfillment
          screen receive the ticket within <strong>3-5 seconds</strong>!
        </p>
      </div>

      {/* Success Notification Bar */}
      {createdOrderId && (
        <div
          style={{
            background: '#ecfdf5',
            border: '2px solid #6ee7b7',
            borderRadius: '10px',
            padding: '1.25rem 1.5rem',
            marginBottom: '2.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ fontWeight: 700, color: '#065f46', fontSize: '1rem' }}>
              🎉 Order Successfully Placed!
            </div>
            <div style={{ color: '#047857', fontSize: '0.875rem', marginTop: '2px' }}>
              Order ID: <strong style={{ fontFamily: 'monospace' }}>{createdOrderId}</strong> ({createdOrderNumber})
              — Ticket sent to warehouse queue!
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => navigate(`/track/${createdOrderId}`)}
              style={{
                background: '#047857',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Open Live Tracker →
            </button>
            <button
              onClick={() => navigate('/fulfillment')}
              style={{
                background: '#111827',
                color: '#ffffff',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              View Warehouse Queue →
            </button>
          </div>
        </div>
      )}

      {/* Product Selection */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
          1. Select Product to Order
        </h3>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {SAMPLE_PRODUCTS.map((prod) => {
            const isSelected = selectedProduct.id === prod.id;
            return (
              <div
                key={prod.id}
                onClick={() => setSelectedProduct(prod)}
                style={{
                  border: isSelected ? '2px solid #4f46e5' : '1px solid #e5e7eb',
                  background: isSelected ? '#f5f3ff' : '#ffffff',
                  borderRadius: '10px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 10px rgba(79, 70, 229, 0.15)' : 'none',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase' }}>
                    {prod.category}
                  </span>
                  <span style={{ fontWeight: 700, color: '#111827' }}>
                    ${(prod.priceInCents / 100).toFixed(2)}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '1rem', fontWeight: 600, color: '#111827' }}>
                  {prod.name}
                </h4>
                <div style={{ fontSize: '0.78rem', color: '#6b7280' }}>
                  Size: <strong>{prod.size}</strong> · Color: <strong>{prod.color}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fulfillment Selection */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', color: '#111827' }}>
          2. Select Fulfillment Mode
        </h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label
            style={{
              flex: '1 1 240px',
              border: fulfillmentType === 'DELIVERY' ? '2px solid #2563eb' : '1px solid #e5e7eb',
              background: fulfillmentType === 'DELIVERY' ? '#eff6ff' : '#ffffff',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <input
              type="radio"
              name="fulfillment"
              checked={fulfillmentType === 'DELIVERY'}
              onChange={() => setFulfillmentType('DELIVERY')}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>🚚 Home Delivery</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Order transitions: PLACED → PROCESSING → SHIPPED → DELIVERED
              </div>
            </div>
          </label>

          <label
            style={{
              flex: '1 1 240px',
              border: fulfillmentType === 'PICKUP' ? '2px solid #d97706' : '1px solid #e5e7eb',
              background: fulfillmentType === 'PICKUP' ? '#fffbeb' : '#ffffff',
              borderRadius: '8px',
              padding: '1rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <input
              type="radio"
              name="fulfillment"
              checked={fulfillmentType === 'PICKUP'}
              onChange={() => setFulfillmentType('PICKUP')}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#111827' }}>🛍️ In-Store Pickup</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Order transitions: PLACED → PROCESSING → READY_FOR_PICKUP → COMPLETED
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Checkout Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={() => placeOrderMutation.mutate()}
          disabled={placeOrderMutation.isPending}
          style={{
            padding: '1rem 3rem',
            background: '#111827',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: 'pointer',
            letterSpacing: '0.02em',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.15s ease',
          }}
        >
          {placeOrderMutation.isPending
            ? 'Placing Order...'
            : `⚡ Place Order ($${(selectedProduct.priceInCents / 100).toFixed(2)})`}
        </button>
      </div>
    </div>
  );
};
