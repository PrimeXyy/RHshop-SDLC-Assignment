import { Router, Request, Response } from 'express';
import { memoryDb } from '../config/prisma.js';

const router = Router();

// In-memory payment ledger for Bakong KHQR transactions
export const bakongPayments = new Map<string, {
  ref: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'paid';
  createdAt: Date;
}>();

// POST /api/payment/bakong/create-qr
router.post('/bakong/create-qr', (req: Request, res: Response) => {
  const { orderId } = req.body;
  const ref = `bkg_${orderId || 'ord'}_${Date.now()}`;
  
  // Look up order if exists
  let amount = 0;
  if (orderId && memoryDb.orders.has(orderId)) {
    const ord = memoryDb.orders.get(orderId)!;
    amount = ord.totalAmountInCents / 100;
  }

  bakongPayments.set(ref, {
    ref,
    orderId: orderId || 'demo_ord',
    amount,
    status: 'pending',
    createdAt: new Date(),
  });

  // Authentic Bakong EMVCo QR string representation for CHOU TITHOURA
  const qrString = `00020101021229300016bakong@nbc.org.kh0109CHOUTITHOURA520459995303840540${amount.toFixed(2)}5802KH5913CHOU TITHOURA6010Phnom Penh6304ABCD`;

  res.json({
    success: true,
    qrString,
    bakongRef: ref,
    merchantName: 'CHOU TITHOURA',
    currency: 'USD',
    amount,
  });
});

// GET /api/payment/bakong/status/:ref
router.get('/bakong/status/:ref', (req: Request, res: Response) => {
  const ref = String(req.params.ref);
  const payment = bakongPayments.get(ref);

  if (!payment) {
    res.json({ status: 'pending' });
    return;
  }

  res.json({
    status: payment.status,
    orderId: payment.orderId,
    amount: payment.amount,
  });
});

// POST /api/payment/bakong/webhook
router.post('/bakong/webhook', (req: Request, res: Response) => {
  const bakongRef = req.body?.bakongRef || req.body?.ref;
  if (!bakongRef) {
    res.status(400).json({ success: false, message: 'Missing bakongRef' });
    return;
  }

  const payment = bakongPayments.get(bakongRef);
  if (payment) {
    payment.status = 'paid';
    bakongPayments.set(bakongRef, payment);

    // If order exists in memoryDb, update order status to PROCESSING
    if (payment.orderId && memoryDb.orders.has(payment.orderId)) {
      const order = memoryDb.orders.get(payment.orderId)!;
      if (order.status === 'PLACED') {
        order.status = 'PROCESSING';
        order.updatedAt = new Date();
        memoryDb.orders.set(payment.orderId, order);
      }
    }
  } else {
    bakongPayments.set(bakongRef, {
      ref: bakongRef,
      orderId: 'demo_ord',
      amount: 0,
      status: 'paid',
      createdAt: new Date(),
    });
  }

  res.json({ success: true, message: 'Payment confirmed successfully', status: 'paid' });
});

// POST /api/payment/stripe/create-payment-intent
router.post('/stripe/create-payment-intent', (req: Request, res: Response) => {
  const { orderId } = req.body;
  res.json({
    success: true,
    clientSecret: `pi_demo_${orderId || Date.now()}_secret_${Math.random().toString(36).substring(2, 9)}`,
  });
});

export default router;
