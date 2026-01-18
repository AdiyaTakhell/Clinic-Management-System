import mongoose from 'mongoose';

const appointmentSchema = mongoose.Schema(
    {
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        date: {
            type: Date,
            required: true,
            default: Date.now,
        },
        tokenNumber: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'In-Progress', 'Completed', 'Cancelled' ,'Billed'],
            default: 'Pending',
        },
        type: {
            type: String,
            enum: ['Consultation', 'Follow-up', 'Emergency'],
            default: 'Consultation',
        },
        receptionistId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    {
        timestamps: true,
    }
);

// Optimize query speed for fetching "Today's Queue"
appointmentSchema.index({ date: 1, doctorId: 1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;