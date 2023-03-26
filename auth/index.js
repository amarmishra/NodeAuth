require('dotenv').config()
const base64=require('base-64')
const bcrypt=require('bcrypt')
const passport=require('passport')
const { urlencoded } = require('express')

const {GOOGLE_AUTH_CLIENT_ID,GOOGLE_AUTH_CLIENT_SECRET,GOOGLE_AUTH_REDIRECT_URI}=process.env
const User=require('../models/users')


//Defining middlewares for session creation when User authentication is successful 


const createSessionForGoogleLogin=async (req,res,next)=>{
    //receive token after the consent page gets authorized
    let code=req.query.code;

   try{
    const response=await fetch('https://oauth2.googleapis.com/token',{
        method:'POST',
        body:JSON.stringify({
                client_id: GOOGLE_AUTH_CLIENT_ID,
                client_secret: GOOGLE_AUTH_CLIENT_SECRET,
                redirect_uri: GOOGLE_AUTH_REDIRECT_URI,
                grant_type:'authorization_code',
                code:code,
              
        }),
        headers:{
            'Content-Type':"application/json"
        }
    })
 

    let {access_token,id_token}=await response.json()
    //split id token for userinfo
    let jwt = id_token.split(".");
    let userinfo=JSON.parse(base64.decode(jwt[1]))

  
    // console.log(userinfo.name)
    // console.log(userinfo.email)
    // console.log(userinfo.picture)

        //CHECK IF USER EXIT WITH THIS EMAIL IN THE DATABASE
        let user=await User.findOne({email:userinfo.email})
        if(!user){
            //user does not exist -------> create a user without password
            user=await User.create({
                email:userinfo.email,
                name:userinfo.name,
                picture:userinfo.picture
            })
        }
        console.log("User Id is :::",user.id)
        // passport function that initiates session creation --> after this passport.serializeUser gets called automatically
        req.login(user.id,(err)=>{
            if(err){throw err}
            return next()
        })


    }
    catch(err){
        console.log("Error",err)
        return res.redirect('back')
    }

}

const createSessionForLocalLogin=async (req,res,next)=>{
    //receive form fields 1.(emailorusername) and 2.password here
    
   const {email,password,captcha}=req.body
   console.log('Email:',email,'Password:',password)
   try {
        let user=await User.findOne({email:email})
        console.log(user)

        if(!user){
            //email and password do not match

            req.flash('notification',JSON.stringify({message:'Email entered does not match',success:false}))
            return res.redirect('back')
        }

        const match= bcrypt.compare(password,user.password)

        if(!match){
            req.flash('notification',JSON.stringify({message:'Password entered does not match',success:false}))
            return res.redirect('back')
        }


        if(captcha!==req.session.captcha){
            //captcah verification failed
            console.log(captcha," is entered")
            console.log(req.session.captcha," is needed")
            req.flash('notification',JSON.stringify({message:'Captcha verification failed',success:false}))
            return res.redirect('back')
        }
        

        //clear session captcha object
        delete req.session.captcha

        //passport function that initiates session creation --> after this passport.serializeUser gets called automatically
        req.login(user.id,(err)=>{
            if(err){throw err}
            req.flash('notification',JSON.stringify({message:'Logged In ',success:true}))
            return next()
        })

   }
   catch(err){
    console.log(`Error:: Failed to STORE session  FOR THE user::${err}`)
    
    req.flash('notification',JSON.stringify({message:'Failed to STORE session  FOR THE user',success:false}))
    return res.redirect('back')
   }
   console.log('Email or password do not match')
            req.flash('notification',JSON.stringify({message:'Email or password do not match',success:false}))

}

const destroySession= (req,res,next)=>{
    try{ 
          req.logout(function(err) {
              if (err) { throw err }
              req.flash('notification',JSON.stringify({
                    message:"Logged out successfully",
                    success: true 
              }))
              return next()
          });
      }
      catch(err){
          console.log('Cannot logout :::Internal error::',err)
          req.flash('notification',JSON.stringify({
            message:"Error in logging out",
            success: false
            }))
          return next(err)
      }
  }

module.exports={createSessionForGoogleLogin,createSessionForLocalLogin,destroySession}