require('dotenv').config()
const bcrypt=require('bcrypt')

const bcryptSalt=parseInt(process.env.BCRYPT_SALT)

const User=require('../models/users')
const {generateCaptcha}=require('./captcha_controllers')


const createSessionStoreforUser=(req,res)=>{
    req.flash('notification',JSON.stringify({message:"Logged in successfully.",success:true}))
    return res.redirect('/');
}

const destroySessionStoreforUser=(req,res)=>{
    req.flash('notification',JSON.stringify({message:"Logged out successfully",success:true}))
    return res.redirect('/');
}

const displayLoginPage=(req,res)=>{
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    let captcha=generateCaptcha(5)  //generate Captcha of 5 length string

    //store captcha in the session object
    req.session['captcha']=captcha
    
    return res.render('login_page',{
        googleLoginURI:getGoogleConsentPageURI(),
        captcha        
    });
}

const resetCredentialsPage=(req,res)=>{
    if(req.isAuthenticated()){
        
        return res.render('reset_user_credentials');
    }
    return res.redirect('/')
}


const changePasswordHandler=async (req,res)=>{
    if(req.isAuthenticated()){
        
        try{
            const {oldPassword,newPassword,confirmPassword}=req.body
            const match=await bcrypt.compare(oldPassword,req.user.password)
            
            if(!match){
                req.flash('notification',JSON.stringify({message:"Old password is incorrect.",success:false}))
                return res.redirect('back')
            }
    
            if(newPassword!==confirmPassword){
                req.flash('notification',JSON.stringify({message:"New Password and Confirm password do not match",success:false}))
                return res.redirect('back')
            }
           
            //change password
            let saltRounds=10;
            bcrypt.hash(newPassword, saltRounds,async function(err, hash) {
                
                
                let user=await User.findById(req.user._id)
                user.password=hash
                await user.save()


                req.flash('notification',JSON.stringify({message:"Password updated successfully.",success:true}))
                return res.redirect('/users/changePassword')
            })
           
            
           
            
            return
            
         
        }
        catch(err){
            console.log('Error::',err)
            req.flash('notification',JSON.stringify({message:"Internal error.Cannot change password",success:false}))
            return res.redirect('back')
        }

       
        
      
    }
    return res.redirect('/')
}





// Refer to below link:
// https://developers.google.com/identity/protocols/oauth2/web-server#httprest_1




const displaySignUp=(req,res)=>{
    if(req.isAuthenticated()){
        
       return res.redirect('/')
    }
   
    //let notification=req.flash('notification')
     console.log("Session flash after redirect",res.locals.notification)
     
     return res.render('signup_page',{
        googleLoginURI:getGoogleConsentPageURI(),
    });
    
}

//helper function for displayLoginPage and displaySinUp
function getGoogleConsentPageURI(){

    let main=process.env.GOOGLE_AUTH_URI
    let options={
        client_id: process.env.GOOGLE_AUTH_CLIENT_ID,
        redirect_uri: process.env.GOOGLE_AUTH_REDIRECT_URI,
        response_type:'code',
        approval_prompt:'force',  
         //include above (approval_prompt:'force')  especially for prompting 
         //forceful authentication when session is not created for the user 
         //else google server recognizes the app and registers it so second time 
         // consent page is not shown and redirection takes place to redirected URI       
        scope:['profile','email'].join(" ")
    }

    let query=(new URLSearchParams(options)).toString() 
    return `${main}?${query}`
}


const createUser=async (req,res)=>{
    const {email,password,confirmPassword} =req.body
    if(password!==confirmPassword){

      
        
        req.flash('notification',JSON.stringify({message:"Password and Confirm password do not match",success:false}))
        // req.session.save()
        return res.redirect('back')
       
    }

 
    let hash=await bcrypt.hash(password, Number(bcryptSalt))
        // Store hash in your password DB.
        await User.create({
            email:email,
            password:hash,
            authType:'local'
        })    
   
        
        req.flash('notification',JSON.stringify({message:"User created successfully.Please login",success:true}))
        return res.redirect('/users/logIn')
      
    
    
}

const displayForgotPasswordPage=(req,res)=>{
    return res.render('forgot_password')
}


const displayNewPasswordView=(req,res)=>{
    return res.render('new_password')
}

const finalizeForgotPassword=async (req,res)=>{

    const {password,confirmPassword,userId}=req.body

    if(password!==confirmPassword){
        //add notification that password and confirmpass do not match
        req.flash('notification',JSON.stringify({message:"Password and ConfirmPass do not match",success:false}))
        return res.redirect('/users/logIn')
    }


    const hash = await bcrypt.hash(password, Number(bcryptSalt));
    let user=await User.findById(userId);
    user.password=hash;
    await user.save()

    req.flash('notification',JSON.stringify({message:"Password set successfully.",success:true}))
    return res.redirect('/users/logIn')
} 

module.exports={createSessionStoreforUser,destroySessionStoreforUser,displayLoginPage,resetCredentialsPage,displaySignUp,createUser,changePasswordHandler,displayForgotPasswordPage,displayNewPasswordView,finalizeForgotPassword}