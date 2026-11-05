import { Router } from 'express';
import {
  getFulfillmentQueue,
  acceptOrder,
  dispatchOrder,
  completeOrder,
  deliverOrder,
  transitionFulfillmentOrderStatus,
} from '../controllers/fulfillmentController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();

// Staff authentication guard (Warehouse or Admin)
router.use(authenticate('STAFF'), requireRole('WAREHOUSE', 'ADMIN'));

// Live Fulfillment Queue Polling (3-5s polling)
router.get('/queue', getFulfillmentQueue);

// State transitions
router.post('/orders/:id/accept', acceptOrder);
router.post('/orders/:id/dispatch', dispatchOrder);
router.post('/orders/:id/complete', completeOrder);
router.post('/orders/:id/deliver', deliverOrder);
router.patch('/orders/:id/status', transitionFulfillmentOrderStatus);

export default router;
