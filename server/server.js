import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import patientRoutes from "./routes/patientRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js"; // Note the .js extension is required in ES Modules

// 1. Config
dotenv.config();
connectDB();

const app = express();

// 2. Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors());         // Enable CORS
app.use(helmet());       // Security headers
app.use(morgan('dev'));  // Logger

// 3. Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/auth', authRoutes); // Mount the auth routes
app.use('/api/users', userRoutes); // Mount user routes
app.use('/api/patients', patientRoutes); // Mount patient routes
app.use('/api/appointments', appointmentRoutes); // Mount appointment routes
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/invoices', invoiceRoutes); // <--- Add this// Mount

// Placeholder for future routes
// app.use('/api/auth', authRoutes);

// 4. Error Handling (Global)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Server Error' });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});