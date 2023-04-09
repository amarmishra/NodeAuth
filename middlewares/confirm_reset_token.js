const bcrypt=require('bcrypt')
const User=require('../models/users')
const ResetToken = require('../models/reset_token')

async function matchResetToken(req,res,next){
    const {token,userId}=req.query

    try{    
        
        const resetToken=await ResetToken.findOne({user:userId})
        const isTokenValid=await bcrypt.compare(token,resetToken.token)
        
        if(!isTokenValid){
            throw new Error("Invalid or expired password reset token");
        }

        //set userId in locals
        res.locals.userId=userId;
        next()
    }
    catch(Error){
        console.log('Error::',Error)
        return res.send('Request timed out or invalid token')
    }
}
module.exports={matchResetToken}