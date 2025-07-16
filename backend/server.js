import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRoute.js'
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'
import Razorpay from 'razorpay'
// import paymentRouter from './routes/paymentRoute.js'

const app = express()
const port = process.env.PORT || 4001
connectDB()
connectCloudinary()


app.use(express.json())
app.use(cors())


app.use('/api/admin', adminRouter) 
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)
// app.use('/api/payment',paymentRouter)




app.get("/payment/:paymentId", async(req,res)=>{
  const {paymentId}= req.params;

  const razorpay = new Razorpay({
      key_id:"rzp_test_eeKhaMlVvfb8uM",
      key_secret:"Qcldvplbo1kn0d5XbSl63kXE"
  })

  try {
      const payment = await razorpay.payments.fetch(paymentId)

      if(!payment){
          return res.status(500).json()
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



app.get('/', (req, res) => {
  res.send('Api working...')
})

app.listen(port, () => console.log('Server started', port)) 