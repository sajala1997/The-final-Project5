const cartModel = require('../models/cartModel')
const userModel = require('../models/userModel')
const productModel = require('../models/productModel');
const validator = require('../validators/validator')
const mongoose = require('mongoose');




const addToCart = async (req,res)=>{
    let errMsg = {}
    errMsg.userId = (req.params.userId===undefined)?"UserId required": mongoose.Types.ObjectId.isValid(req.params.userId)?false:"Invalid UserId"
    errMsg.cartId = (req.body.cartId===undefined)?"CartId Required":mongoose.Types.ObjectId.isValid(req.params.cartId)?false:"Invalid UserId"
    errMsg.productId = (req.body.productId===undefined)?"ProductId Required!":mongoose.Types.ObjectId.isValid(req.params.productId)?false:"Invalid UserId"
    Object.keys(errMsg).forEach(key => errMsg[key] === false && delete errMsg[key])
    if(Object.keys(errMsg).length!==0) return res.status(400).send({status:false,msg:errMsg})



    
}