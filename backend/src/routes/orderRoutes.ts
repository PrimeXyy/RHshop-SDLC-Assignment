import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  getOrderStatus,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';
import { memoryDb } from '../config/prisma.js';

const router = Router();

// Create order (Customer)
router.post(
  '/',
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    const customerHeader = req.headers['x-customer-token'];
    if (authHeader || customerHeader) {
      return authenticate('CUSTOMER')(req, res, next);
    }
    // Fall back to default demo customer
    const cust = memoryDb.users.get('cust_001');
    if (cust) {
      (req as any).user = { id: cust.id, email: cust.email, name: cust.name, role: cust.role };
    }
    next();
  },
  createOrder
);

// Customer order list
router.get('/my-orders', authenticate('CUSTOMER'), getCustomerOrders);

// All orders list (Admin / Storefront / Customer overview)
router.get(
  '/',
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    const staffHeader = req.headers['x-staff-token'];
    const customerHeader = req.headers['x-customer-token'];
    if (authHeader || staffHeader || customerHeader) {
      return authenticate()(req, res, next);
    }
    next();
  },
  getAllOrders
);

// Live Order Status Polling (Customer tracker, 3-5s polling)
router.get('/:id/status', getOrderStatus);

// Customer cancels their PLACED order
router.post('/:id/cancel', authenticate('CUSTOMER'), cancelOrder);

// Get order details
router.get(
  '/:id',
  (req, res, next) => {
    const authHeader = req.headers.authorization;
    const staffHeader = req.headers['x-staff-token'];
    const customerHeader = req.headers['x-customer-token'];
    if (authHeader || staffHeader || customerHeader) {
      return authenticate()(req, res, next);
    }
    const cust = memoryDb.users.get('cust_001');
    if (cust) {
      (req as any).user = { id: cust.id, email: cust.email, name: cust.name, role: cust.role };
    }
    next();
  },
  getOrderById
);

// State machine transition (Warehouse, Admin, or Customer cancellation)
// Both PUT and PATCH supported for Axios / REST clients
router.put('/:id/status', authenticate(), updateOrderStatus);
router.patch('/:id/status', authenticate(), updateOrderStatus);

export default router;
