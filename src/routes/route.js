const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController');
const { createUser, loginUser } = require("../controllers/userController");

const {AuthenticationCheck, BodyValidation} = require("../middleware/Authentication");

const { AuthorizationCheck } = require("../middleware/Authorization");

//*-----------------------------------**User Create**--------------------------------------------------------
router.post('/register',userController.createUser,BodyValidation);
//*-----------------------------------**User Login**--------------------------------------------------------
router.post("/login",userController.loginUser,BodyValidation); 

router.get('/user/:userId/profile',userController.getUser )



module.exports=router