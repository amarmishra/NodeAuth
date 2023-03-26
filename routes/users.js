const {Router}=require('express')
const router=Router()
const passport=require('passport')

const {displayLoginPage,createSessionStoreforUser,destroySessionStoreforUser,resetCredentialsPage,displaySignUp,createUser,logOutUser,changePasswordHandler}=require('../controllers/users_controllers');
const auth=require('../auth')

router.get('/logIn',displayLoginPage)
router.get('/signUp',displaySignUp)
router.get('/auth/google/createSession',auth.createSessionForGoogleLogin,createSessionStoreforUser)
router.post('/auth/local/createSession',auth.createSessionForLocalLogin,createSessionStoreforUser)
router.post('/createUser',createUser)
router.get('/logout',auth.destroySession,destroySessionStoreforUser)
router.get('/changePassword',passport.isLocalLogin,resetCredentialsPage)
router.post('/changePasswordRequest',passport.isLocalLogin,changePasswordHandler)
module.exports=router