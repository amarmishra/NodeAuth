const {Router}=require('express')
const router=Router()
const passport=require('passport')

const {displayLoginPage,createSessionStoreforUser,destroySessionStoreforUser,resetCredentialsPage,displaySignUp,createUser,logOutUser,changePasswordHandler,displayForgotPasswordPage,displayNewPasswordView,finalizeForgotPassword}=require('../controllers/users_controllers');
const {generateLinkWithResetToken}=require('../controllers/reset_token_controllers')
const auth=require('../auth')
const {matchResetToken}=require('../middlewares/confirm_reset_token')

router.get('/logIn',displayLoginPage)
router.get('/signUp',displaySignUp)
router.get('/auth/google/createSession',auth.createSessionForGoogleLogin,createSessionStoreforUser)
router.post('/auth/local/createSession',auth.createSessionForLocalLogin,createSessionStoreforUser)
router.post('/createUser',createUser)
router.get('/logout',auth.destroySession,destroySessionStoreforUser)
router.get('/changePassword',passport.isLocalLogin,resetCredentialsPage)
router.post('/changePasswordRequest',passport.isLocalLogin,changePasswordHandler)
router.get('/forgotPassword',displayForgotPasswordPage)
router.post('/resetTokenRequest',generateLinkWithResetToken)
router.get('/setNewPasswordPage',matchResetToken,displayNewPasswordView)
router.post('/finalizeForgotPassword',finalizeForgotPassword)
module.exports=router