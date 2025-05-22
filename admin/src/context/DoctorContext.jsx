import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const [dToken, setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'');
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false)
  const [profileData,setProfileData] = useState(false)
  const dId= localStorage.getItem("dId")
  console.log(dId)


  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getDoctorProfile = async () => {
    try {
      const { data } = await axios.post(backendUrl + "/api/doctor/profile",{docId:dId}, {
        headers: { dToken },
      });
      if (data.success) {
        setDoctorProfile(data.doctor);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getAppointments = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/appointments',{docId:dId}, {
        headers: { dToken },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    }
  };

  const completeAppointment = async (appointmentId)=>{
    try {
      
      const{data} = await axios.post(backendUrl+ '/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})

      if(data.success)
      {
        toast.success(data.message)
        getAppointments()
      }else{
        toast.error(data.message)
      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const cancelAppointment = async (appointmentId)=>{
    try {
      
      const{data} = await axios.post(backendUrl+ '/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})

      if(data.success)
      {
        toast.success(data.message)
        getAppointments()
      }else{
        toast.error(data.message)
      }


    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const getDashData =async ()=>{
    try {
      const {data}= await axios.post(backendUrl+'/api/doctor/dashboard',{docId:dId},{headers:{dToken}})

      if(data.success){
        setDashData(data.dashData)
        console.log(data.dashData);
        

      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  const getProfileData = async()=>{
    try {
      const {data} = await axios.post(backendUrl+'/api/doctor/profile',{docId:dId},{headers:{dToken}})

      if(data.success)
      {
        setProfileData(data.profileData)
        console.log(data);

      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  const value = {
    dToken,
    setDToken,
    backendUrl,
    doctorProfile,
    getDoctorProfile,
    appointments,setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData, setDashData, getDashData,
    profileData,setProfileData,getProfileData
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
