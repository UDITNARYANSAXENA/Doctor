import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";



 // Toggle doctor availability
const changeAvailability = async (req, res) => {
  try{
    const {docId} = req.body

    const docData = await doctorModel.findById(docId)
    await doctorModel.findById(docId,{available:!docData.available})
    res.json({success:true, message : "Availability Changed"})
  }
  catch (error) {
    console.error("Error in changeAvailability:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get list of all doctors (excluding sensitive data)
const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select('-password -email');
    res.status(200).json({ success: true, doctors });
  } catch (error) {
    console.error("Error in doctorList:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get a single doctor by ID
const getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await doctorModel.findById(id).select('-password');

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, doctor });
  } catch (error) {
    console.error("Error in getDoctorById:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedDoctor = await doctorModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedDoctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Error in updateDoctorProfile:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a doctor by ID
const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await doctorModel.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
  } catch (error) {
    console.error("Error in deleteDoctor:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//API for doctor login
const loginDoctor =async(req,res) =>{
  try {
    const{email,password}= req.body
    const doctor= await doctorModel.findOne({email})
    if(!doctor){
      return res.json({success:false, message:'Invalid credentials'})
    }

    const isMatch = await bcrypt.compare(password,doctor.password)
    if(isMatch){
      const token= jwt.sign({id:doctor._id},process.env.JWT_SECRET)

      res.json({success:true,token,id:doctor._id})
    }
    else{
      res.json({success:false, message:'Invalid credentials'})
    }

  } catch (error) {
    console.log(error)
    res.json({success:false, message: error.message})
  }
}


//API to get doctor appointments for doctor panel
const appointmentsDoctor = async(req,res) =>{
  const {docId} =req.body
    console.log(docId)
  try {
    
    // const {docId} =req.body
    // console.log(docId)
    const appointments = await appointmentModel.find({docId})
    res.json({success:true, appointments})


  } catch (error) {
    console.log(error)
    res.json({success:false, message: error.message})
  }
}

//API to mark appointments completed for doctor panel
const appointmentComplete =async(req,res)=>{
  try{
    const {docId,appointmentId} =req.body

    const appointmentData = await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.docId === docId)
    {
      await appointmentModel.findByIdAndUpdate(appointmentId,{isCompleted: true})

      return res.json({success:true, message:'Appointment Completed'})
    }
    else{
      return res.json({success:false, message:'Mark Failed'})
    }
  }
  catch(error){
    console.log(error)
    res.json({success:false ,message:error.message})
  }
}


//API to cancel appointments for doctor panel
const appointmentCancel =async(req,res)=>{
  try{
    const {docId,appointmentId} =req.body

    const appointmentData = await appointmentModel.findById(appointmentId)

    if(appointmentData && appointmentData.docId === docId)
    {
      await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled: true})

      return res.json({success:true, message:'Appointment Cancelled'})
    }
    else{
      return res.json({success:false, message:'Cancellation Failed'})
    }
  }
  catch(error){
    console.log(error)
    res.json({success:false ,message:error.message})
  }
}


// API to get dashboard data for doctor panel 
const doctorDashboard= async (req,res) =>{
  try {
    const {docId} = req.body

    const appointments = await appointmentModel.find({docId})

    let earnings = 0
    appointments.map((item)=>{

      if(item.isCompleted || item.payment)
      {
        earnings+=item.amount

      }

    })
    let patients = []

    appointments.map((item)=>{
      if(!patients.includes(item.userId)){
        patients.push(item.userId)
      }
    })
    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: patients.length,
      latestAppointment : appointments.reverse().slice(0,5)
    }

    res.json({success:true,dashData})

  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}

//API to get doctor profile dor Doctor Panel
const doctorProfile = async (req,res)=>{
  try {
    const {docId} = req.body
    console.log(docId)
    const profileData=await doctorModel.findById(docId).select('-password')

    res.json({success : true, profileData})

  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}


//API to update doctor profile data from doctor panel

const updDoctorProfile = async(rq,res)=>{
  try {
    const {docId,fees, address,available} =req.body

    await doctorModel.findByIdAndUpdate(docId,{fees,address,available})
    res.json({success:true, message:'Profile Updated'})
  } catch (error) {
    console.log(error)
    res.json({success:false, message:error.message})
  }
}
export {
  changeAvailability,
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
  updDoctorProfile
};
