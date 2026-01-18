import asyncHandler from 'express-async-handler';
import Invoice from '../models/invoiceModel.js';
import Appointment from '../models/appointmentModel.js';

const createInvoice = asyncHandler(async (req, res) => {
    const { appointmentId, totalAmount, paymentMethod } = req.body;

    // 1. Check if appointment exists
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        res.status(404);
        throw new Error('Appointment not found');
    }

    // 2. Prevent duplicate invoices
    const existingInvoice = await Invoice.findOne({ appointmentId });
    if (existingInvoice) {
        res.status(400);
        throw new Error('Invoice already generated for this appointment');
    }

    // 3. Create Invoice (Status defaults to Paid since we are confirming payment now)
    const invoice = await Invoice.create({
        appointmentId,
        patientId: appointment.patientId,
        totalAmount,
        paymentMethod,
        status: 'Paid', // You confirmed payment
        generatedBy: req.user._id,
    });

    // 4. CRITICAL FIX: Update Appointment Status to 'Billed'
    // This removes it from the "Pending Billing" list on the frontend
    if (invoice) {
        appointment.status = 'Completed'; // Keep it completed or change to 'Archived'
        // Actually, let's use a flag or check if invoice exists on frontend
        // BETTER WAY: Update status to "Billed" to hide it from the list
        appointment.status = 'Billed';
        await appointment.save();

        res.status(201).json(invoice);
    } else {
        res.status(400);
        throw new Error('Invalid invoice data');
    }
});

// @desc    Get Invoice by ID (For Printing)
// @route   GET /api/invoices/:id
const getInvoiceById = asyncHandler(async (req, res) => {
    const invoice = await Invoice.findById(req.params.id)
        .populate('patientId', 'name contact address') // For the "Bill To" section
        .populate({
            path: 'appointmentId',
            populate: { path: 'doctorId', select: 'name specialization' } // Nested populate to show Doctor name on bill
        });

    if (invoice) {
        res.json(invoice);
    } else {
        res.status(404);
        throw new Error('Invoice not found');
    }
});

export { createInvoice, getInvoiceById };
