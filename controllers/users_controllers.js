require('dotenv').config()
const bcrypt=require('bcrypt')

const User=require('../models/users')
const {generateCaptcha}=require('./captcha_controllers')


const createSessionStoreforUser=(req,res)=>{
    return res.redirect('/');
}

const destroySessionStoreforUser=(req,res)=>{
    return res.redirect('/users/logIn');
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

const resetCredentials=(req,res)=>{
    if(req.isAuthenticated()){
        
        res.redirect('/')
    }

    return res.render('reset_user_credentials');
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

    const {GOOGLE_AUTH_URI,GOOGLE_AUTH_CLIENT_ID,GOOGLE_AUTH_REDIRECT_URI}=process.env

    let main=GOOGLE_AUTH_URI
    let options={
        client_id:GOOGLE_AUTH_CLIENT_ID,
        redirect_uri:GOOGLE_AUTH_REDIRECT_URI,
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

        //send notification: password and confirm password do not match
        
       
        //console.log("Session flash before redirect",req.session.flash)
        // delete req.session.flash
       // req.session['notification']="Password and Confirm password do not match"
        
        req.flash('notification',JSON.stringify({message:"Password and Confirm password do not match",success:false}))
        // req.session.save()
        return res.redirect('back')
       
    }

    let saltRounds=10;
    await bcrypt.hash(password, saltRounds,async function(err, hash) {
        // Store hash in your password DB.
        await User.create({
            email:email,
            password:hash
        })
    });
       
        
        req.flash('notification',JSON.stringify({message:"User created successfully.Please login",success:true}))
        return res.redirect('/users/logIn')
      
    
    
}



module.exports={createSessionStoreforUser,destroySessionStoreforUser,displayLoginPage,resetCredentials,displaySignUp,createUser}