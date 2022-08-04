const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController')
const productController= require('../controllers/productController')
const {AuthenticationCheck}= require("../middleware/auth")
const cartController = require('../controllers/cartController');
const orderController= require('../controllers/orderController')


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

// Cart
router.post('/users/:userId/cart',cartController.addToCart);
router.put('/users/:userId/cart',cartController.updateCart);
router.get('/users/:userId/cart',cartController.getCart);
router.delete('/users/:userId/cart',cartController.deleteCart);

router.post('/users/:userId/orders',orderController.createOrder);
router.put('/users/:userId/orders',orderController.updateOrder)



module.exports=router