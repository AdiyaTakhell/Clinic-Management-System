import asyncHandler from 'express-async-handler';
import Appointment from '../models/appointmentModel.js';
import User from '../models/userModel.js';

// @desc    Create new appointment (Generate Token)
// @route   POST /api/appointments
// @access  Private (Receptionist)
const createAppointment = asyncHandler(async (req, res) => {
    const { patientId, doctorId, type } = req.body;

    // 1. Verify Doctor exists and is actually a Doctor
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'Doctor') {
        res.status(400);
        throw new Error('Invalid Doctor selected');
    }

    // 1.5 PREVENT DUPLICATE: Check if patient already has an appointment with this doctor TODAY
    // (Optional: remove this block if your clinic allows multiple visits per day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointment = await Appointment.findOne({
        patientId,
        doctorId,
        date: { $gte: startOfDay, $lte: endOfDay },
        status: { $ne: 'Cancelled' } // Ignore cancelled apps
    });

  if (existingAppointment) {
    return res.status(409).json({
        message: `Appointment already exists. Token #${existingAppointment.tokenNumber} is active for today.`
    });
}


    const lastAppointment = await Appointment.findOne({
        doctorId,
        date: {
            $gte: startOfDay,
            $lte: endOfDay,
        },
    }).sort({ tokenNumber: -1 }); // Get the highest token number

    const newTokenNumber = lastAppointment ? lastAppointment.tokenNumber + 1 : 1;

    const appointment = await Appointment.create({
        patientId,
        doctorId,
        tokenNumber: newTokenNumber,
        type,
        receptionistId: req.user._id, // Logged in user (Receptionist)
        date: Date.now() // Explicitly set date
    });

    res.status(201).json(appointment);
});


const getTodaysAppointments = asyncHandler(async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);


    let query = {
        date: { $gte: startOfDay, $lte: endOfDay },
    };

    if (req.user.role === 'Doctor') {
        query.doctorId = req.user._id;
    } else if (req.query.doctorId) {
        // Allow receptionist to filter by doctor: ?doctorId=123
        query.doctorId = req.query.doctorId;
    }

    const appointments = await Appointment.find(query)
        .populate('patientId', 'name age gender contact') // Join Patient Data
        .populate('doctorId', 'name specialization')     // Join Doctor Data
        .sort({ tokenNumber: 1 }); // Sort by token number ascending

    res.json(appointments);
});

// @desc    Update Appointment Status (e.g., Doctor marks as Completed)
// @route   PATCH /api/appointments/:id/status
// @access  Private (Doctor)
const updateAppointmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    // Validate status input (Security Best Practice)
    const validStatuses = ['Pending', 'In-Progress', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status update');
    }

    const appointment = await Appointment.findById(req.params.id);

    if (appointment) {
        appointment.status = status;
        const updatedAppointment = await appointment.save();
        res.json(updatedAppointment);
    } else {
        res.status(404);
        throw new Error('Appointment not found');
    }
});

export { createAppointment, getTodaysAppointments, updateAppointmentStatus };