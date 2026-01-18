import express from 'express';
import {
    createAppointment,
    getTodaysAppointments,
    updateAppointmentStatus
} from '../controllers/appointmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createAppointment);

router.route('/today')
    .get(protect, getTodaysAppointments);

router.route('/:id/status')
    .patch(protect, updateAppointmentStatus);

export default router;