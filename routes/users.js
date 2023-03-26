const {Router}=require('express')
const router=Router()


const {displayLoginPage,createSessionStoreforUser,destroySessionStoreforUser,resetCredentials,displaySignUp,createUser,logOutUser}=require('../controllers/users_controllers');
const auth=require('../auth')

router.get('/logIn',displayLoginPage)
router.get('/signUp',displaySignUp)
router.get('/resetCredentials',resetCredentials)
router.get('/auth/google/createSession',auth.createSessionForGoogleLogin,createSessionStoreforUser)
router.post('/auth/local/createSession',auth.createSessionForLocalLogin,createSessionStoreforUser)
router.post('/createUser',createUser)
router.get('/logout',auth.destroySession,destroySessionStoreforUser)
module.exports=router