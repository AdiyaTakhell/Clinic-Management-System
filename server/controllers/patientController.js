import asyncHandler from 'express-async-handler';
import Patient from '../models/patientModel.js';

const registerPatient = asyncHandler(async (req, res) => {
    const { name, age, gender, contact, address } = req.body;

    const patientExists = await Patient.findOne({ contact });

    if (patientExists) {
        res.status(400);
        throw new Error('Patient with this contact number already exists');
    }

    const patient = await Patient.create({
        name,
        age,
        gender,
        contact,
        address,
        registeredBy: req.user._id, 
    });

    if (patient) {
        res.status(201).json(patient);
    } else {
        res.status(400);
        throw new Error('Invalid patient data');
    }
});

const getPatients = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        $or: [
            { name: { $regex: req.query.keyword, $options: 'i' } },    // Search Name
            { contact: { $regex: req.query.keyword, $options: 'i' } }  // Search Phone
        ]
    } : {};

    const patients = await Patient.find(keyword).limit(10).sort({ createdAt: -1 });
    res.json(patients);
});

const getPatientById = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
        res.json(patient);
    } else {
        res.status(404);
        throw new Error('Patient not found');
    }
});


const addPatientHistory = asyncHandler(async (req, res) => {
    const { description } = req.body;
    const patient = await Patient.findById(req.params.id);
  
    if (patient) {
      const newHistory = {
        description,
        date: new Date(),
        addedBy: req.user._id
      };
  
      // Push to the array
      patient.medicalHistory.push(newHistory);
      await patient.save();
  
      res.status(201).json(patient.medicalHistory);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
});

export { 
    registerPatient, 
    getPatients, 
    getPatientById, 
    addPatientHistory 
};