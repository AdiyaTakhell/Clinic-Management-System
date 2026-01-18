import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';


const getDoctors = asyncHandler(async (req, res) => {
    const doctors = await User.find({ role: 'Doctor' })
        .select('-password')
        .sort({ name: 1 }); // Sort alphabetically by name

    res.json(doctors);
});

export { getDoctors };