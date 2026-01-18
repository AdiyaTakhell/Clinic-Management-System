import mongoose from 'mongoose';

const prescriptionSchema = mongoose.Schema(
    {
        appointmentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Appointment',
            required: true,
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        patientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Patient',
            required: true,
        },
        medicines: [
            {
                name: { type: String, required: true },
                dosage: { type: String, required: true },
                frequency: { type: String, required: true },
                duration: { type: String, required: true },
                instruction: { type: String },
            },
        ],
        notes: { type: String },
    },
    {
        timestamps: true,
    }
);

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;