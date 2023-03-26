const User=require('../models/users')
const passport=require('passport')




passport.checkAuthentication=(req,res,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect('/users/logIn')
}

passport.setAuthenticatedUser=function (req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user
        return next()
    }
    return next()
}



//
passport.isLocalLogin=function (req,res,next){
    if(req.isAuthenticated()) {
        if(res.locals.user.authType==='local'){
            return next()
        }
        req.flash('notification',JSON.stringify({message:'You are not permitted to change password.',success:false}))
        return res.redirect('/')
    }
    return res.redirect('/')
}

//called after req.login(userid) and useId gets stored in session
passport.serializeUser((userId,done)=>{
    return done(null,userId)
})



//from the session pull user and store it in req.user 
//also req.isAuthenticated() returns true
passport.deserializeUser(async (id,done)=>{
try{
    let user=await User.findById(id)
    if(user){return done(null,user)}
    else{ return done(null,false) }
} 
catch(err){
    return done(err)
}
 
})

module.exports=passport