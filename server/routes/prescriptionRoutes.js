import express from 'express';
import { createPrescription, getPrescriptionById } from '../controllers/prescriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// The doctor sends a POST request here to save the medicines
router.post('/', protect, createPrescription);

// To view/print a specific prescription
router.get('/:id', protect, getPrescriptionById);

export default router;