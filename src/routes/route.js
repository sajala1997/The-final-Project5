const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const {AuthenticationCheck}= require("../middleware/auth")



router.post('/register',userController.createUser )
router.post('/login', userController.loginUser)

router.get('/user/:userId/profile',AuthenticationCheck,userController.getUser )
router.put('/user/:userId/profile',userController.updateUser)





module.exports=router