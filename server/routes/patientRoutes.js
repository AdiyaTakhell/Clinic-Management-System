import express from 'express';
import { 
  registerPatient, 
  getPatients, 
  getPatientById,      // <--- Import this
  addPatientHistory    // <--- Import this
} from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Base Route: /api/patients
router.route('/')
    .post(protect, registerPatient)
    .get(protect, getPatients);

// ID Route: /api/patients/:id
router.route('/:id')
    .get(protect, getPatientById);

// History Route: /api/patients/:id/history
router.route('/:id/history')
    .post(protect, addPatientHistory);

export default router;