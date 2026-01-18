import express from 'express';
import { getDoctors } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to get list of doctors. Protected because we don't want public access to staff list.
router.get('/doctors', protect, getDoctors);

export default router;