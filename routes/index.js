const {Router}=require('express')
const passport  = require('passport')
const router=Router()

const {homePage}=require('../controllers/')


router.get('/',passport.checkAuthentication,homePage)
router.use('/users',require('./users'))
router.use('/captcha',require('./captcha'))
module.exports=router