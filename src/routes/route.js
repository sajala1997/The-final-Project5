const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const {AuthenticationCheck,AuthorizationCheck}= require("../middleware/auth")

const {AuthenticationCheck, BodyValidation} = require("../middleware/Authentication");

router.post('/register',userController.createUser )
router.post('/login', userController.loginUser)

router.get('/user/:userId/profile',AuthenticationCheck,AuthorizationCheck,userController.getUser )





module.exports=router