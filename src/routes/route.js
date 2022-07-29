const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const productController= require('../controllers/productController')
const {AuthenticationCheck}= require("../middleware/auth")


//user
router.post('/register',userController.createUser )  //Done
router.post('/login', userController.loginUser)
router.get('/user/:userId/profile',AuthenticationCheck,userController.getUser )
router.put('/user/:userId/profile',AuthenticationCheck, userController.updateUser)

//product
router.post('/products',productController.createProduct )

router.get('/products/:productId',productController.getByProductId )
router.delete('/products/:productId', productController.deleteProduct)
router.get('/products',productController.getProduct)
router.put('/products/:productId', productController.updateProduct)




module.exports=router