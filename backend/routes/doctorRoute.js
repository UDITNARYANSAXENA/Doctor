import express from 'express';
import {
  doctorList,
  getDoctorById,
  updateDoctorProfile,
  deleteDoctor,
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updDoctorProfile,
  changeAvailability
} from '../controllers/doctorController.js';
// import authDoctor from '../middlewares.js';

const doctorRouter = express.Router();

// Get all doctors
doctorRouter.get('/list', doctorList);

// Get doctor by ID
doctorRouter.get('/:id', getDoctorById);

// Update doctor profile
doctorRouter.put('/:id', updateDoctorProfile);

// Delete a doctor
doctorRouter.delete('/:id', deleteDoctor);

// Toggle availability
doctorRouter.post('/change-availability', changeAvailability);

//login doctor
doctorRouter.post('/login',loginDoctor)
doctorRouter.post('/appointments', appointmentsDoctor)
doctorRouter.post('/complete-appointment',appointmentComplete)
doctorRouter.post('/cancel-appointment',appointmentCancel)

doctorRouter.post('/dashboard',doctorDashboard)
doctorRouter.post('/profile',doctorProfile)
doctorRouter.post('/update-profile',updDoctorProfile)

export default doctorRouter;
