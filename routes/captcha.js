const {Router}=require('express')
const router=Router()

const {refreshCaptcha}=require('../controllers/captcha_controllers')
router.get('/refresh',refreshCaptcha)

module.exports=router