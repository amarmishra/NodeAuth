const bcrypt=require('bcrypt')
const crypto=require('crypto')

const reset_token_secret=process.env.JWT_RESET_TOKEN_SECERET_KEY
const {sendMailService}=require('../utils/nodemailer')
const User=require('../models/users')
const ResetToken=require('../models/reset_token')


async function generateLinkWithResetToken(req,res){

    const receiverMail=req.body.email

    try{
         //delete previous resettoken from database(if any)
        const user = await User.findOne({ email:receiverMail });

        if (!user) {
            throw new Error("User does not exist");
        
        }
        if(user.authType!=='local'){
            req.flash('notification',JSON.stringify({message:"User exit. Try login with social account",success:false}))
            return res.redirect('/');
        }

        let token = await ResetToken.findOne({ user: user._id });
        if (token) { 
                await token.deleteOne()
        };

        //generate resettoken
        let resetToken=crypto.randomBytes(64).toString('hex')
        let resetTokenHash=await bcrypt.hash(resetToken,Number(process.env.BCYPT_SALT))

        token=await ResetToken.create({
            user:user._id,
            token:resetTokenHash,
            createdAt:Date.now()
        })
     
        
        //send plain resetToken in the link along with userId
        const link=`${EXPRESS_SERVER_URL}/users/setNewPasswordPage/?token=${resetToken}&userId=${user.id}`
        //sendMail
        sendMailService(receiverMail,link)

        req.flash('notification',JSON.stringify({message:"Check your mail for restore link.",success:true}))
        return res.redirect('/');
    }
    catch(e){
        console.log(`Error:::`,e)
        res.redirect('back')
    }



  
}

module.exports={generateLinkWithResetToken}