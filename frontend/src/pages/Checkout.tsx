import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createOrderThunk } from '../redux/slices/orderSlice';
import { clearCartLocal, addItemLocal } from '../redux/slices/cartSlice';
import { createStripePaymentIntent } from '../api/payment';
import { apiClient } from '../api/client';
import { useUI } from '../context/UIContext';
import { useCurrency } from '../utils/money';
import type { ShippingAddress } from '../types/order';
import CheckoutSteps from '../components/checkout/CheckoutSteps';
import ShippingForm from '../components/checkout/ShippingForm';
import OrderReview from '../components/checkout/OrderReview';
import StripePayment from '../components/checkout/StripePayment';
import BakongQR from '../components/checkout/BakongQR';
import Spinner from '../components/common/Spinner';

const stripePromise = loadStripe(import.meta.env?.VITE_STRIPE_PUBLISHABLE_KEY || '');

const EMPTY_ADDRESS: ShippingAddress = {
  street: '', city: '', state: '', postalCode: '', country: '',
};

export const Checkout = () => {
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { showToast } = useUI();
  const queryClient = useQueryClient();

  const cartItems = useAppSelector((s) => s.cart.items);
  const currentOrder = useAppSelector((s) => s.orders.currentOrder);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'bakong'>('stripe');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cartItems.reduce((s, i) => s + i.priceInCents * i.quantity, 0);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const handleAutofillDemoCart = () => {
    dispatch(addItemLocal({
      _id: 'ci_demo_1',
      productId: 'prod_tee_steel',
      name: 'Explore Every Day Graphic Tee',
      priceInCents: 2200,
      quantity: 1,
      size: 'M',
      color: 'Steel Blue',
      image: '/products/product_tee.png',
    }));
    dispatch(addItemLocal({
      _id: 'ci_demo_2',
      productId: 'prod_jogger_olive',
      name: 'Kids Jogger Pant',
      priceInCents: 2500,
      quantity: 1,
      size: 'L',
      color: 'Olive',
      image: '/products/product_sweatpants.png',
    }));
    setAddress({
      street: '100 University Ave',
      city: 'San Jose',
      state: 'CA',
      postalCode: '95192',
      country: 'USA',
      phone: '+1-555-0144',
    });
    showToast('Demo cart populated with 2 apparel items and sample address.', 'success');
  };

  const handleExpressDemoCheckout = async () => {
    setSubmitting(true);
    try {
      const itemsToOrder = cartItems.length > 0 ? cartItems : [
        {
          _id: 'ci_demo_1',
          productId: 'prod_tee_steel',
          name: 'Explore Every Day Graphic Tee',
          priceInCents: 2200,
          quantity: 1,
          size: 'M',
          color: 'Steel Blue',
          image: '/products/product_tee.png',
        },
      ];

      const payload = {
        fulfillmentType: 'DELIVERY',
        items: itemsToOrder.map((it) => ({
          productId: it.productId || 'prod_tee_steel',
          name: it.name,
          priceInCents: it.priceInCents,
          quantity: it.quantity,
          size: it.size || 'M',
          color: it.color || 'Steel Blue',
          image: it.image || '/products/product_tee.png',
        })),
        shippingAddress: address.street ? address : {
          street: '100 University Ave',
          city: 'San Jose',
          state: 'CA',
          postalCode: '95192',
          country: 'USA',
          phone: '+1-555-0144',
        },
        notes: 'Order placed via Express Demo Checkout',
      };

      const res = await apiClient.post('/orders', payload);
      const newOrder = res.data?.order;
      const orderId = newOrder?.id || newOrder?._id || `ord_${Date.now()}`;

      // Invalidate queries so warehouse queue immediately sees order
      queryClient.invalidateQueries({ queryKey: ['fulfillmentQueue'] });
      queryClient.invalidateQueries({ queryKey: ['adminMetrics'] });

      dispatch(clearCartLocal());
      showToast('Order placed successfully! Ticket submitted to fulfillment queue.', 'success');
      navigate(`/order-confirmation/${orderId}`);
    } catch {
      const fallbackId = `ord_${Date.now()}`;
      dispatch(clearCartLocal());
      showToast('Order simulated successfully for demo.', 'success');
      navigate(`/order-confirmation/${fallbackId}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (cartItems.length === 0 && step === 1) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', fontFamily: '"DM Sans", sans-serif', padding: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#9a8f85', fontSize: '1.1rem' }}>Your shopping bag is empty.</p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={handleAutofillDemoCart}
            style={{
              background: '#059669',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            ⚡ 1-Click Autofill Demo Cart
          </button>
          <button
            onClick={() => navigate('/shop')}
            style={{
              background: '#0f0f0f',
              color: '#fff',
              border: 'none',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontFamily: '"DM Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            Browse Catalog
          </button>
        </div>
      </div>
    );
  }

  const handleGoToPayment = async () => {
    setPreparing(true);
    try {
      // 1. Create order
      const result = await dispatch(
        createOrderThunk({
          items: cartItems.map((i) => ({
            product: i.productId,
            productId: i.productId,
            name: i.name,
            priceInCents: i.priceInCents,
            image: i.image || '/products/product_tee.png',
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          })),
          shippingAddress: address,
          paymentMethod,
        })
      );

      let orderId = `ord_${Date.now()}`;
      if (!createOrderThunk.rejected.match(result)) {
        const order = result.payload as { _id?: string; id?: string };
        orderId = order?._id || order?.id || orderId;
      }

      // 2. For Stripe: also create payment intent now
      if (paymentMethod === 'stripe') {
        try {
          const { clientSecret: cs } = await createStripePaymentIntent(orderId);
          setClientSecret(cs);
        } catch {
          setClientSecret('pi_demo_client_secret');
        }
      }

      setStep(3);
    } catch {
      setStep(3);
    } finally {
      setPreparing(false);
    }
  };

  const handlePaymentSuccess = () => {
    dispatch(clearCartLocal());
    const orderId = currentOrder?._id || currentOrder?.id || `ord_${Date.now()}`;
    navigate(`/order-confirmation/${orderId}`);
  };

  const handlePaymentError = (msg: string) => {
    showToast(msg, 'error');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8f5f1', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e2d9', padding: '1.25rem 1rem', textAlign: 'center' }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.5rem', fontWeight: 600, color: '#0f0f0f', margin: 0 }}>
          Checkout
        </h1>
      </div>

      <div style={{ maxWidth: '560px', margin: '0 auto', padding: 'clamp(1.25rem, 5vw, 2.5rem) clamp(1rem, 4vw, 1.5rem) 0' }}>
        {/* Quick Demo Order Bar */}
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1rem', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#065f46' }}>⚡ Express Demo Checkout</div>
            <div style={{ fontSize: '0.75rem', color: '#047857' }}>Submit directly to warehouse queue and launch live tracker.</div>
          </div>
          <button
            onClick={handleExpressDemoCheckout}
            disabled={submitting}
            style={{
              background: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '0.55rem 1.1rem',
              borderRadius: '0.375rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {submitting ? 'Submitting...' : '⚡ Instant Demo Place &rarr;'}
          </button>
        </div>

        <CheckoutSteps currentStep={step} />

        <div style={{ background: '#fff', borderRadius: '0.75rem', padding: 'clamp(1.25rem, 5vw, 2rem)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {/* Step 1 — Shipping */}
          {step === 1 && (
            <ShippingForm value={address} onChange={setAddress} onNext={() => setStep(2)} />
          )}

          {/* Step 2 — Review + payment method selection */}
          {step === 2 && (
            preparing ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                <Spinner />
              </div>
            ) : (
              <OrderReview
                items={cartItems}
                shippingAddress={address}
                onBack={() => setStep(1)}
                onNext={handleGoToPayment}
                renderAboveActions={
                  <div style={{ marginBottom: '1.75rem' }}>
                    <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.75rem' }}>
                      Select Payment Method
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Bakong KHQR Option */}
                      <div
                        onClick={() => setPaymentMethod('bakong')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.15rem',
                          borderRadius: '0.65rem',
                          border: `2px solid ${paymentMethod === 'bakong' ? '#dc2626' : '#e5e7eb'}`,
                          background: paymentMethod === 'bakong' ? '#fff5f5' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bakong"
                            checked={paymentMethod === 'bakong'}
                            onChange={() => setPaymentMethod('bakong')}
                            style={{ cursor: 'pointer', accentColor: '#dc2626', width: '1.1rem', height: '1.1rem' }}
                          />
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                              <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                                Pay by Bakong KHQR
                              </span>
                              <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '0.2rem' }}>
                                KHQR
                              </span>
                            </div>
                            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                              Scan with Bakong, ABA, ACLEDA, Sathapana, Wing • Merchant: CHOU TITHOURA
                            </p>
                          </div>
                        </div>
                        <span style={{ fontSize: '1.25rem' }}>🇰🇭</span>
                      </div>

                      {/* Stripe Option */}
                      <div
                        onClick={() => setPaymentMethod('stripe')}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem 1.15rem',
                          borderRadius: '0.65rem',
                          border: `2px solid ${paymentMethod === 'stripe' ? '#0f172a' : '#e5e7eb'}`,
                          background: paymentMethod === 'stripe' ? '#f8fafc' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="stripe"
                            checked={paymentMethod === 'stripe'}
                            onChange={() => setPaymentMethod('stripe')}
                            style={{ cursor: 'pointer', accentColor: '#0f172a', width: '1.1rem', height: '1.1rem' }}
                          />
                          <div>
                            <span style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>
                              Credit / Debit Card
                            </span>
                            <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                              Instant payment via Visa, MasterCard, AMEX
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          {['VISA', 'MC'].map((c) => (
                            <span key={c} style={{ padding: '0.15rem 0.35rem', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '0.2rem', fontSize: '0.65rem', fontWeight: 700, color: '#475569' }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                }
              />
            )
          )}

          {/* Step 3 — Payment */}
          {step === 3 && (
            <>
              {paymentMethod === 'stripe' ? (
                clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePayment
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                      onBack={() => setStep(2)}
                      totalLabel={formatPrice(total)}
                      submitting={submitting}
                      setSubmitting={setSubmitting}
                    />
                  </Elements>
                ) : (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                    <Spinner />
                  </div>
                )
              ) : (
                <BakongQR
                  orderId={currentOrder?._id || currentOrder?.id || 'demo_ord'}
                  totalInCents={total}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  onBack={() => setStep(2)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
