import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
            unique: true
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        totalAmount: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ['Cash', 'Card', 'UPI', 'Insurance'],
            default: 'Cash',
        },
        status: {
            type: String,
            enum: ['Paid', 'Unpaid', 'Pending'],
            default: 'Unpaid',
        },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;