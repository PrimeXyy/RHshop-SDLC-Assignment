import { Router } from 'express';
import {
  getLiveMetrics,
  getAdminStats,
  getAdminProducts,
  getAdminUsers,
} from '../controllers/adminMetricsController.js';
import { getAllOrders } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

// Staff authentication guard (falls back gracefully to Admin Charlie in development)
router.use(authenticate('STAFF'));

// 1. Live Metrics Polling (3-5s polling)
router.get('/metrics', getLiveMetrics);

// 2. Admin Dashboard Stats
router.get('/stats', getAdminStats);

// 3. Admin Products Catalog Management
router.get('/products', getAdminProducts);

// 4. Admin Orders Listing
router.get('/orders', getAllOrders);

// 5. Admin Users Listing
router.get('/users', getAdminUsers);

export default router;
