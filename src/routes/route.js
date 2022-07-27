const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const productController= require('../controllers/productController')
const {AuthenticationCheck}= require("../middleware/auth")


//user
router.post('/register',userController.createUser )
router.post('/login', userController.loginUser)
router.get('/user/:userId/profile',AuthenticationCheck,userController.getUser )
router.put('/user/:userId/profile',userController.updateUser)

//product
router.post('/products',productController.createProduct )

router.get('/products/:productId',productController.getByProductId )






module.exports=router