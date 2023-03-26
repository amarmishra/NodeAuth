require('dotenv').config()

const mongoose=require('mongoose')


mongoose.connect(process.env.MONGODB_SERVER_URL)

const db=mongoose.connection;

db.on('error',()=>{
    console.error.bind(console,'An error occured while connecting database')
})

db.once('open',()=>{
    console.log("Successfully connected to the database")
})

module.exports=db