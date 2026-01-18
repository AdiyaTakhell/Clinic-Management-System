import mongoose from 'mongoose';

const patientSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other'],
            required: true
        },
        contact: { type: String, required: true },
        address: { type: String },
        medicalHistory: [
            {
                diagnosis: String,
                treatment: String,
                date: { type: Date, default: Date.now }
            }
        ],
        registeredBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;