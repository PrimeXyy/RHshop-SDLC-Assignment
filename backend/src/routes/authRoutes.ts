import { Router } from 'express';
import { login, demoLogin, getCurrentUser } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/demo/:role', demoLogin);
router.get('/me', authenticate(), getCurrentUser);

export default router;
