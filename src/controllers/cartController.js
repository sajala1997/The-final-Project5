const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel');
const validator = require('../validators/validator')
const mongoose = require('mongoose');
const { keyValue,} = require("../validators/validator");



const addToCart = async (req,res)=>{
    // let errMsg = {}
    // errMsg.userId = (req.params.userId===undefined)?"UserId required": mongoose.Types.ObjectId.isValid(req.params.userId)?false:"Invalid UserId"
    // errMsg.cartId = (req.body.cartId===undefined)?"CartId Required":mongoose.Types.ObjectId.isValid(req.params.cartId)?false:"Invalid UserId"
    // errMsg.productId = (req.body.productId===undefined)?"ProductId Required!":mongoose.Types.ObjectId.isValid(req.params.productId)?false:"Invalid UserId"
    // Object.keys(errMsg).forEach(key => errMsg[key] === false && delete errMsg[key])
    // if(Object.keys(errMsg).length!==0) return res.status(400).send({status:false,msg:errMsg})

    // let data= req.body
    // let { userId, items, totalPrice, totalItems  } = data

    // if (!keyValue(data)) {
    //     return res.status(400).send({ status: false, message: "please provide product details" })
    // }
    // if (!isValid(userId)) {
    //     return res.status(400).send({ status: false, messege: "please provide userId" })
    // }

    // if (!isValidObjectId(userId)) {
    //     return res.status(400).send({ status: false, msg: "userId is invalid" });
    // }
    // const userCheck = await userModel.findById(userId)
    // if(!userCheck) return res.status(404).send({ status: false, msg: "no data found" })

    // if (!isValid(productId)) {
    //     return res.status(400).send({ status: false, messege: "please provide productId" })
    // }
    // if (!isValidObjectId(productId)) {
    //     return res.status(400).send({ status: false, msg: "productId is invalid" });
    // }
    // const productCheck = await productModel.findById(productId)
    // if(!productCheck) return res.status(404).send({ status: false, msg: "no data found" })

    try{
        let userId=req.params.userId
        let data=req.body
        let productId=req.body.productId
        let quantity=req.body.quantity
        
        if (!isValidObjectId(userId)) {
            return res.status(400).send({ status: false, msg: "userId is invalid" });
        }
        const findUser = await userModel.findById({ _id:userId })
        if (!findUser) return res.status(404).send({ status: false, msg: "user not found" })
        
        if (!isValid(productId)) {
            return res.status(400).send({ status: false, messege: "please provide productId" })
        }
        
        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "productId is invalid" });
        }
        const findProduct = await productModel.findById({ _id:productId })
        if (!findProduct) return res.status(404).send({ status: false, msg: "product not found" })
        
        if (!isValid(quantity)) {
            return res.status(400).send({ status: false, messege: "please provide quantity" })
        }
        
        
        const cartExist = await cartModel.findOne({userId:userId})
        
        if(!cartExist){
            const savedData = await cartModel.create({ userId: userId,
                items: [{productId,quantity}],
                totalPrice: findProduct.price*quantity,
                totalItems: 1})
            return res.status(201).send({status:true, message:"cart created successfully", data:savedData})
        }
        if (cartExist) {
            const updatePrice =cartExist.totalPrice + (findProduct.price*quantity)
         
        }
        }
        catch(error){
            return res.status(500).send({ status: false, message: error.message });
        }
        }
        module.exports.addToCart=addToCart

    
