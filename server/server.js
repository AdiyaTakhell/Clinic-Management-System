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
import invoiceRoutes from "./routes/invoiceRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // Parse JSON bodies


app.use(cors({
    origin: process.env.CLIENT_URL || '*', // Use env var if exists, else allow all
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(helmet());       // Security headers
app.use(morgan('dev'));  // Logger

// 3. Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use('/api/auth', authRoutes); 
app.use('/api/users', userRoutes); 
app.use('/api/patients', patientRoutes); 
app.use('/api/appointments', appointmentRoutes); 
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/invoices', invoiceRoutes); 

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