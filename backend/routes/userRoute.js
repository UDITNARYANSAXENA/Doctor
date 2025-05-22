import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay ,verifyRazorpay} from '../controllers/userController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'
import Razorpay from 'razorpay'
import appointmentModel from '../models/appointmentModel.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile)
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/my-appointments', authUser, listAppointment)
userRouter.post('/cancel-appointment', authUser, cancelAppointment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)
userRouter.post('/verifyRazorpay',authUser,verifyRazorpay)
userRouter.post("/orders", async(req,res)=>{
    console.log("payment")

    const razorpay = new Razorpay({
         key_id:"rzp_test_eeKhaMlVvfb8uM",
        key_secret:"Qcldvplbo1kn0d5XbSl63kXE"
    })
  
    const options={
        amount: req.body.amount,
        currency:req.body.currency,
        receipt:"receipt#1",
        payment_capture:1
    }
  
  
  
    try {
        const response = await razorpay.orders.create(options)
  
         return res.json({
            order_id:response.id,
            currency:response.currency,
            amount:response.amount,
            response: response
        })
    } catch (error) {
        console.log(error)
        res.status(500).send("Something Went Wrong")
        
    }
  })
userRouter.post("/checkPayment/:paymentId",  async(req,res)=>{
    const {paymentId}= req.params;
    const {appointmentId}= req.body
    console.log("ferfee",appointmentId)

    const razorpay = new Razorpay({
        key_id:"rzp_test_eeKhaMlVvfb8uM",
        key_secret:"Qcldvplbo1kn0d5XbSl63kXE"
    })

    try {
        const payment = await razorpay.payments.fetch(paymentId)

        if(!payment){
            return res.status(500).json()
        }
        console.log(payment.status,"jfjjf")
        if (payment.status === "authorized") {
            console.log("payment to success h")
              await appointmentModel.findByIdAndUpdate(appointmentId, {
                payment: true,
              });

             
            //   res.json({ success: true, message: "Payment Successful" });
            } else {
            //   res.json({ success: false, message: "Payment Failed" });
            }
        res.json({
            status:payment.status,
            method:payment.method,
            amount: payment.amount,
            currency: payment.currency,
            response:payment
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json("Internal server Error")

    }

  })


export default userRouter