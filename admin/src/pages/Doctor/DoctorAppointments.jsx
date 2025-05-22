import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets_admin/assets'

const DoctorAppointments = () => {

  const {dToken,appointments,getAppointments,completeAppointment, cancelAppointment} = useContext(DoctorContext)

  const{calculateAge, slotDateFormat , currency}=useContext(AppContext)
  useEffect(()=>{
    if(dToken){
      getAppointments()
    }

  },[dToken])





 return(
  <div className='w-full max-w-6xl mx-auto my-5'>
  <p className='mb-4 text-xl font-semibold text-gray-700'>All Appointments</p>
  <div className='bg-white border border-gray-200 rounded-lg shadow-md overflow-y-scroll max-h-[80vh] min-h-[50vh]'>
    
    {/* Sticky Header */}
    <div className='hidden sm:grid grid-cols-[0.5fr_2.5fr_1fr_2fr_2fr_1fr_1fr] gap-3 px-4 py-3 bg-gray-100 border-b font-medium text-gray-600 sticky top-0 z-10'>
      <p>#</p>
      <p>Patient</p>
      <p>Payment</p>
      <p>Age</p>
      <p>Date</p>
      <p>Fees</p>
      <p>Action</p>
    </div>

    {
      appointments.slice().reverse().map((item, index) => (
        <div
          key={index}
          className='flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2.5fr_1fr_2fr_2fr_1fr_1fr] items-center gap-3 px-4 py-3 border-b text-sm text-gray-700 hover:bg-gray-50 transition'
        >
          <p className='hidden sm:block'>{index + 1}</p>
          
          {/* Patient Info */}
          <div className='flex items-center gap-2'>
            <img className='w-8 h-8 rounded-full object-cover' src={item.userData.image} alt="" />
            <p>{item.userData.name}</p>
          </div>

          {/* Payment Mode */}
          <div>
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium 
              ${item.payment ? 'text-green-600 border-green-500 bg-green-50' : 'text-yellow-600 border-yellow-400 bg-yellow-50'}`}>
              {item.payment ? 'Online' : 'Cash'}
            </span>
          </div>

          {/* Age */}
          <p className='hidden sm:block'>{calculateAge(item.userData.dob)}</p>

          {/* Date */}
          <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>

          {/* Fees */}
          <p>{currency} {item.amount}</p>

          {/* Actions */}
          {
            item.cancelled ? (
              <p className='text-red-500 font-medium text-xs'>Cancelled</p>
            ) : item.isCompleted ? (
              <p className='text-green-600 font-medium text-xs'>Completed</p>
            ) : (
              <div className='flex items-center gap-2'>
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className='w-8 h-8 p-1 bg-red-100 rounded-full cursor-pointer hover:bg-red-200 transition'
                  src={assets.cancel_icon}
                  alt="Cancel"
                />
                <img
                  onClick={() => completeAppointment(item._id)}
                  className='w-8 h-8 p-1 bg-green-100 rounded-full cursor-pointer hover:bg-green-200 transition'
                  src={assets.tick_icon}
                  alt="Complete"
                />
              </div>
            )
          }
        </div>
      ))
    }
  </div>
</div>

 )
}

export default DoctorAppointments
