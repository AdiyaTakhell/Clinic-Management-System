import asyncHandler from 'express-async-handler';
import Prescription from '../models/prescriptionModel.js';
import Appointment from '../models/appointmentModel.js';


const createPrescription = asyncHandler(async (req, res) => {
    const { appointmentId, medicines, notes } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    if (appointment.doctorId.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('Not authorized to treat this patient');
    }

    const prescription = await Prescription.create({
        appointmentId,
        doctorId: req.user._id,
        patientId: appointment.patientId,
        medicines,
        notes,
    });

    if (prescription) {
        appointment.status = 'Completed';
        await appointment.save();

        res.status(201).json(prescription);
    } else {
        res.status(400);
        throw new Error('Invalid prescription data');
    }
});

const getPrescriptionById = asyncHandler(async (req, res) => {
    const prescription = await Prescription.findById(req.params.id)
        .populate('patientId', 'name age gender address') // Patient info for header
        .populate('doctorId', 'name specialization');     // Doctor info for header

    if (prescription) {
        res.json(prescription);
    } else {
        res.status(404);
        throw new Error('Prescription not found');
    }
});

export { createPrescription, getPrescriptionById };