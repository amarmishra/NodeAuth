require('dotenv').config()
const express=require('express')

const app=express()

const PORT=process.env.EXPRESS_SERVER_PORT_NO || 8000
const db=require('./config/mongoose')

app.use(express.static('./assets'))
app.set('view engine','ejs')
app.set('views','./views')


//express layout wrapper 
const expressLayouts=require('express-ejs-layouts')
app.use(expressLayouts)
app.set("layout extractStyles", true)
app.set("layout extractScripts", true)

const passport=require('./config/passport-auth')

//parse req urlencoded data and json  

app.use(express.urlencoded({extended:false}))
app.use(express.json({limit:'1mb'}))

//middleware to parse cookie data
const cookieParser=require('cookie-parser')
const { setAuthenticatedUserForViews } = require('./auth')
 app.use(cookieParser(process.env.SESSION_SECERET_KEY))

const session=require('express-session')
const MongoStore=require('connect-mongo')

app.use(session({
    name:'__node_auth_login__',
    secret: process.env.SESSION_SECERET_KEY,
    resave:true,        //resave sessionData back to the store on every request
    saveUninitialized:false,          //set cookies only if session gets created by passport
    cookie: { secure: false }, //set expiration to 40 min
    store: MongoStore.create({
        mongoUrl:  process.env.MONGODB_SERVER_URL, 
        // ttl: 14 * 24 * 60 * 60,      //either set cookies expiration or ttl here
       //  autoRemove: 'native' 
    })
}))

//attach flash messages on session cookie on redirect
const flash=require('connect-flash')



app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

//custom middleware added to mimic connect-flash work on the redirect
app.use((req, res, next) => {
    // console.log("Req object after going through middlewares----,express-session,passport,flash")
    // console.log("Session is::::",req.session)
    // console.log("Flash is set to at custom middleware in index.js:::", req.session.flash)
    if( req.session.flash && Object.keys(req.session.flash).length!==0){
        
        let flashMessage =req.flash('notification');
       
        res.locals.notification=JSON.parse(flashMessage)
      
        //delete req.session.notification
    }
    
    next();
  });

app.use(passport.setAuthenticatedUser)



app.use('/',require('./routes'))

app.listen(PORT,(err)=>{
    if(err){return console.log(`Error:${err}`)}
    console.log(`EXPRESS Server running successfully on port${PORT}`)
})