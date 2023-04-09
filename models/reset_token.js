const mongoose=require('mongoose')

const resetTokenSchema=new mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    token:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:300                 //5 min==300 sec
    }
},{timestamps:true}) 

const ResetToken=mongoose.model('ResetToken',resetTokenSchema)
module.exports=ResetToken