import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'


const MyAppointments = () => {
  const [responseId, setResponseId]= useState("");
  const [responseState, setResponseState]= useState();
  const [enterAmount, setEnterAmount]= useState()
  const { backendUrl, token, getDoctorsData } = useContext(AppContext)
  const [appointments, setAppointments] = useState([])
  const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const [appointmentId, setAppointmentId]= useState(null)

  const loadScript = (src)=>{
    return new Promise((resolve)=>{
      const script = document.createElement("script")

      script.src=src;

      script.onload=()=>{
        resolve(true)
      }
      script.onerror=()=>{
        resolve(false)
      }

      document.body.appendChild(script)
    })
  }
  const createRazorpayOrder =(amount,appointId)=>{
    setAppointmentId(appointId)
    let data = JSON.stringify({
      amount:amount* 100,
      currency:"INR"
    })

    let config = {
      method:"post",
      maxBodyLength:Infinity,
      url:"http://localhost:4001/api/user/orders",
      headers:{
        'Content-Type':'application/json'
      },
      data:data
    }

    axios.request(config)
    .then((response)=>{
      console.log(JSON.stringify(response.data))
      console.log("Inside Create RazorpayOrder", response)
      handleRazorpayScreen(response.data.amount)
    })
    .catch((error)=>{
      console.log("error at", error)
    })


  }
  const  handleRazorpayScreen= async(amount)=>{
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")
    if(!res){
      alert("Some error at razorpay screen loading")
      return;
    }

    const options= {
      key:"rzp_test_eeKhaMlVvfb8uM",
      amount: amount,
      currency:"INR",
      name:"Udit Narayan Saxena",
      description:"Payment to Udit Narayan Saxena",
      image:"https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcT7Q9Xo9QouXoJDlYivVWyn1Cko8rp3QaE6pkrwpBXaiBnGv9In",
      handler: function(response){
        setResponseId(response.razorpay_payment_id)
        console.log(" inside handle razorpay screen",response)

      },
      prefill:{
        name:"Udit Narayan ",
        email:"udit9407@gmail.com"
      },
      theme:{
        color:"#F4C430"

      }


    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()




  }

  if (responseId){

    const checkPayment= async()=>{
      try {
        const {data}= await axios.post("http://localhost:4001/api/user/verifyRazorpay",{
          razorpay_order_id:responseId},{headers:{token}})

          console.log(data)
        if(data.success){
          getUserAppointments()
          navigate('/my-appointments')

        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)

      }

    }
   
            // checkPayment()
  }


  useEffect(()=>{const paymentId= responseId

    
      const paymentFetch = ()=>{

    // e.preventDefault();

    // const paymentId= e.target.paymentId.value;

    axios.post(`http://localhost:4001/api/user/checkPayment/${paymentId}`,{appointmentId})
    .then((response)=>{
      console.log("fetch payment",response);
      setResponseState(response.data)
    })
    .catch((error)=>{
      console.log("error occurs", error)
    })
  }
  console.log(appointmentId)
  paymentFetch()
},[responseId])


 
  


  const navigate =useNavigate()
  
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + ' ' + months[Number(dateArray[1])] + ' ' + dateArray[2]
  }

  const getUserAppointments = async () => {

    try {

      const { data } = await axios.get(backendUrl + '/api/user/my-appointments', { headers: { token } })

      if (data.success) {
        setAppointments(data.appointments.reverse())
        console.log(data.appointments)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {

      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments()
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  // const initPay=(order)=>{
  //   const options={
  //     key: "rzp_test_eeKhaMlVvfb8uM",
  //     amount: order.amount,
  //     currency: order.currency,
  //     name: 'Appointment Payment',
  //     description : 'Appointment Payment',
  //     order_id: order.id,
  //     receipt: order.receipt,
  //     handler: async(response)=>{
  //       console.log(response)

  //       try {
  //         const {data}= await axios.post(backendUrl +'/api/user/verifyRazorpay',response,{headers:{token}})
  //         if(data.success){
  //           getUserAppointments()
  //           navigate('/my-appointments')

  //         }
  //       } catch (error) {
  //         console.log(error)
  //         toast.error(error.message)

  //       }
  //     }

  //   }
  //   const rzp = new window.Razorpay(options)
  //   rzp.open()
  // }

  
  
  
  // const appointmentRazorpay =async(appointmentId)=>{
  //   console.log("clicked")
  //   try {
  //     const {data}=await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})
  //     if(data.success){
  //       console.log(date.order);
  //       console.log("kuch hua")
        
  //       initPay(data.order)
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     toast.error("Payment Failed")
  //   }
  // }



  useEffect(() => {
    if (token) {
      getUserAppointments()
    }
  }, [token])
  console.log(appointments);
  

  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My appointments</p>

      <div>
        {appointments?.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-32 bg-indigo-50' src={item.docData.image} alt="" />
            </div>

            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} |  {item.slotTime}</p>
            </div>

            <div></div>

            <div className='flex flex-col gap-2 justify-end'>
              {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
              {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={()=>createRazorpayOrder(item?.amount, item._id)
              

              } className='text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay Online</button>}
              {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 sm:min-w-48 py-2 border rounded hover:bg-red-600 hover:text-white transition-all duration-300'>Cancel Appointment</button>}
              {item.cancelled && !item.isCompleted && <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
              {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded text-green-500'>Completed</button>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments