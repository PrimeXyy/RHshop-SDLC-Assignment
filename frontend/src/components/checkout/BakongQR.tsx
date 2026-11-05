import { useEffect, useRef, useState } from 'react';
import { createBakongQR, getBakongStatus } from '../../api/payment';
import { useCurrency } from '../../utils/money';
import Button from '../common/Button';
import Spinner from '../common/Spinner';

interface Props {
  orderId: string;
  totalInCents: number;
  onSuccess: () => void;
  onError: (msg: string) => void;
  onBack: () => void;
}

type Stage = 'loading' | 'ready' | 'paid' | 'error';

const BakongQR = ({ orderId, totalInCents, onSuccess, onError, onBack }: Props) => {
  const { formatPrice } = useCurrency();
  const [stage, setStage] = useState<Stage>('loading');
  const [bakongRef, setBakongRef] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Generate QR on mount or fallback to demo ref
  useEffect(() => {
    let mounted = true;
    createBakongQR(orderId)
      .then(({ bakongRef: ref }) => {
        if (!mounted) return;
        setBakongRef(ref);
        setStage('ready');
      })
      .catch(() => {
        if (!mounted) return;
        // Graceful fallback for local development or guest checkout
        const fallbackRef = `bkg_${orderId || 'ord'}_${Date.now()}`;
        setBakongRef(fallbackRef);
        setStage('ready');
      });

    return () => {
      mounted = false;
    };
  }, [orderId]);

  // Poll for payment status once ready
  useEffect(() => {
    if (stage !== 'ready' || !bakongRef) return;

    pollRef.current = setInterval(async () => {
      try {
        const { status } = await getBakongStatus(bakongRef);
        if (status === 'paid') {
          clearInterval(pollRef.current!);
          setStage('paid');
          setTimeout(onSuccess, 1200);
        }
      } catch {
        // Keep polling on transient errors
      }
    }, 4000);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [stage, bakongRef, onSuccess]);

  // Simulate Instant Webhook Payment
  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    try {
      const apiUrl = import.meta.env?.VITE_API_URL || '/api';
      await fetch(`${apiUrl}/payment/bakong/webhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bakongRef: bakongRef || `bkg_${orderId}_${Date.now()}` }),
      });
    } catch (err) {
      console.warn('Webhook simulation error:', err);
    } finally {
      if (pollRef.current) clearInterval(pollRef.current);
      setStage('paid');
      setTimeout(onSuccess, 1200);
    }
  };

  if (stage === 'loading') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3.5rem 0' }}>
        <Spinner />
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
          Initializing Bakong KHQR session…
        </p>
      </div>
    );
  }

  if (stage === 'paid') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#ecfdf5',
          border: '2px solid #10b981',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#059669',
          fontSize: '2rem',
          fontWeight: 700,
        }}>
          ✓
        </div>
        <h3 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.85rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          Bakong KHQR Payment Confirmed!
        </h3>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.9rem', color: '#64748b', margin: 0 }}>
          Merchant: <strong>CHOU TITHOURA</strong> · Ref: <code>{bakongRef || orderId}</code>
        </p>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.825rem', color: '#059669', fontWeight: 600, margin: '0.5rem 0 0' }}>
          Redirecting to order confirmation…
        </p>
      </div>
    );
  }

  const khrEstimate = Math.round((totalInCents / 100) * 4100).toLocaleString();

  return (
    <div style={{ maxWidth: '440px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '9999px', padding: '0.25rem 0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ background: '#dc2626', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '0.2rem', letterSpacing: '0.05em' }}>
            KHQR
          </span>
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#991b1b' }}>
            National Payment Network
          </span>
        </div>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem' }}>
          Scan to Pay with Bakong
        </h2>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
          Open Bakong, ABA Mobile, ACLEDA, Sathapana, or Wing to scan
        </p>
      </div>

      {/* Official KHQR Card Container */}
      <div style={{
        background: '#f8fafc',
        border: '1.5px solid #e2e8f0',
        borderRadius: '1rem',
        padding: '1.25rem',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
        marginBottom: '1.25rem',
      }}>
        {/* The Authentic KHQR Card Image */}
        <div style={{
          position: 'relative',
          borderRadius: '0.85rem',
          overflow: 'hidden',
          background: '#ffffff',
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
          textAlign: 'center',
        }}>
          <img
            src="/images/bakong_khqr.png"
            alt="Bakong KHQR - CHOU TITHOURA"
            style={{
              width: '100%',
              maxWidth: '320px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
            }}
          />
        </div>

        {/* Dynamic Order Payment Summary */}
        <div style={{
          marginTop: '1rem',
          padding: '0.85rem 1rem',
          background: '#ffffff',
          borderRadius: '0.65rem',
          border: '1px solid #e2e8f0',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Beneficiary
            </span>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
              CHOU TITHOURA
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Order Amount Due
            </span>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.1 }}>
                {formatPrice(totalInCents)} USD
              </div>
              <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', color: '#94a3b8' }}>
                ≈ ៛{khrEstimate} KHR
              </div>
            </div>
          </div>
        </div>

        {/* Polling live status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.85rem' }}>
          <span style={{
            display: 'inline-block',
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: '#22c55e',
            boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
          <span style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
            Waiting for payment scan…
          </span>
        </div>
      </div>

      {/* Instant Action / Demo Simulation Button */}
      <button
        type="button"
        onClick={handleSimulatePayment}
        disabled={isSimulating}
        style={{
          width: '100%',
          padding: '0.85rem 1rem',
          background: '#059669',
          color: '#ffffff',
          border: 'none',
          borderRadius: '0.5rem',
          fontFamily: '"DM Sans", sans-serif',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: isSimulating ? 'not-allowed' : 'pointer',
          marginBottom: '0.75rem',
          boxShadow: '0 2px 4px rgba(5, 150, 105, 0.2)',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; }}
      >
        {isSimulating ? 'Confirming Payment…' : '⚡ Simulate / Confirm Instant Payment'}
      </button>

      {/* Instructions */}
      <div style={{ background: '#f8fafc', borderRadius: '0.5rem', padding: '0.85rem 1rem', marginBottom: '1rem', border: '1px solid #f1f5f9' }}>
        <p style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.75rem', fontWeight: 700, color: '#334155', margin: '0 0 0.4rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          How to pay:
        </p>
        <ol style={{ fontFamily: '"DM Sans", sans-serif', fontSize: '0.78rem', color: '#64748b', paddingLeft: '1.15rem', margin: 0, lineHeight: 1.6 }}>
          <li>Open your <strong>Bakong</strong> app or Cambodian Mobile Banking app</li>
          <li>Tap <strong>Scan</strong> and point at the QR code above</li>
          <li>Verify payee name <strong>CHOU TITHOURA</strong> and confirm</li>
          <li>This checkout screen will automatically detect payment</li>
        </ol>
      </div>

      <Button variant="secondary" type="button" onClick={onBack} style={{ width: '100%' }}>
        ← Back to Order Details
      </Button>
    </div>
  );
};

export default BakongQR;
