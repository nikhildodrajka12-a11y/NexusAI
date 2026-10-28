import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    orderId:{
        type:String,
        required:true
    },

 qrId: {
        type: String,
        default: null
    },

    paymentId:String,
    amount:Number,
    currency:{
        type:String,
        default:"INR"
    },
    credits:{
        type:Number
    },
    plan:{
        type:String
    },

 paymentMethod: {
        type: String,
        enum: ["razorpay", "upi", "qr"],
        default: "razorpay"
    },

    status:{
        type:String,
        enum:["created","paid","failed"],
        default:"created"
    }
},{timestamps:true})

const Payment=mongoose.model("Payment",paymentSchema)
export default Payment