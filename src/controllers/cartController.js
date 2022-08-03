    const cartModel = require('../models/cartModel')
    const userModel = require('../models/userModel')
    const productModel = require('../models/productModel');
    const validator = require('../validators/validator')
    const mongoose = require('mongoose');




    const addToCart = async (req,res)=>{
    try{
    let userId=req.params.userId
    let productId=req.body.productId
    let quantity=req.body.quantity||1

    if (!validator.isValidObjectId(userId)) {
        return res.status(400).send({ status: false, msg: "userId is invalid" });
    }
    const findUser = await userModel.findById({ _id:userId })
    if (!findUser) return res.status(404).send({ status: false, msg: "user not found" })

    // if(req.loggedInUserId!==userId)
    //     return res.status(403).send({status:false,message:"Not Authorised"})

    if (!validator.isValid(productId)) {
        return res.status(400).send({ status: false, messege: "please provide productId" })
    }

    if (!validator.isValidObjectId(productId)) {
        return res.status(400).send({ status: false, msg: "productId is invalid" });
    }
    const findProduct = await productModel.findById({ _id:productId })
    if (!findProduct) return res.status(404).send({ status: false, msg: "product not found" })

    if (!validator.isValid(quantity)) {
        return res.status(400).send({ status: false, messege: "please provide quantity" })
    }
    quantity = parseInt(quantity);
    if(isNaN(quantity))
        return res.status(400).send({ status: false, messege: "please provide valid quantity" })
// Create
    let cartExist;
    if(!(cartExist = await cartModel.findOne({userId:userId}))){
        const savedData = await cartModel.create({ userId: userId,
            items: [{productId,quantity}],
            totalPrice: findProduct.price*quantity,
            totalQuantity:quantity,
            totalItems: 1}).populate('items.productId',{__v:0})
        return res.status(201).send({status:true, message:"Success", data:savedData})
    }

    let update = {};
    update.$inc = { totalPrice:(findProduct.price*quantity),
                    totalQuantity:quantity,
                    'items.$[element].quantity':quantity}
  
    if(cartExist.items.find((x)=>{
        if(x.productId.toString() == productId){
        return true;
        }
    })){
        const savedData = await cartModel.findOneAndUpdate({_id:cartExist._id},update,{new:true, "arrayFilters": [{ "element.productId": productId}]}).populate('items.productId',{__v:0})
    
        return res.status(201).send({status:true, message:"Success", data:savedData})
    }

    update.$inc = {totalPrice:(findProduct.price*quantity),totalItems:1,totalQuantity:quantity}
    update.$push = {items:{productId,quantity}}
    const savedData = await cartModel.findOneAndUpdate({_id:cartExist._id},update,{new:true}).populate('items.productId',{__v:0})
    return res.status(201).send({status:true, message:"Success", data:savedData})

    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
    }

    const updateCart = async (req,res)=>{
        try {
            let errMsg = {}
            errMsg.userId = (req.params.userId===undefined)?"UserId required": validator.isValidObjectId(req.params.userId)?false:"Invalid UserId"
            errMsg.productId = (req.body.productId===undefined)?"ProductId Required!":validator.isValidObjectId(req.body.productId)?false:"Invalid ProductId"
            errMsg.removeKey = (req.body.removeKey===undefined)?"removeKey Required!":!isNaN(parseInt(req.body.removeKey))&&(parseInt(req.body.removeKey)==0||parseInt(req.body.removeKey)==1)?false:"Invalid RemoveKey"
            Object.keys(errMsg).forEach(key => errMsg[key] === false && delete errMsg[key])
            if(Object.keys(errMsg).length!==0) return res.status(400).send({status:false,msg:errMsg})

            // if(req.loggedInUserId!==req.params.userId)
            //     return res.status(403).send({status:false,message:"Autherization Failed"})
            
            // Checking User
            let user;
            if(!(user = await userModel.findById(req.params.userId)))
            return res.status(404).send({status:false,message:"User DoesNot Exist"})
            let product;
            if(!(product = await productModel.findById(req.body.productId)) || product.isDeleted==true)
            return res.status(404).send({status:false,message:"Product DoesNot Exist"})
            let cart;
            if(!(cart = await cartModel.findOne({userId:user._id})))
            return res.status(404).send({status:false,message:"Cart DoesNot Exist"})
            
            if(req.body.removeKey==0){

                let productQuantity;
            
                cart.items.forEach((x)=>{
                
                    if(x.productId.toString()==product._id)
                       productQuantity = x.quantity;
                })

               
                if(productQuantity===undefined) return res.status(404).send({status:false,message:"Product not In Cart"})
                let update = {}
                    update.$inc = { totalPrice:-(product.price*productQuantity),
                    totalQuantity:-productQuantity,
                    totalItems:-1
                }
                
            cart = await cartModel.findOneAndUpdate({userId:user._id},{$pull:{items:{productId:product._id}},$inc:update.$inc},{new:true,"arrayFilters": [ { "element.productId": product._id }]},{__v:0}).populate('items.productId',{__v:0})
            res.status(200).send({status:true, message:"Success",data:cart});
            }




// removeKey==1
            cart = await cartModel.findOne({userId:user._id});
            let productQuantity;
            cart.items.forEach((x)=>{
                if(x.productId.toString() == product._id){
                    productQuantity = x.quantity;
                
                }
            })
                
                if(productQuantity===undefined) return res.status(404).send({status:false,message:"Product not In Cart"})

                if(productQuantity==1)
                    cart = await cartModel.findOneAndUpdate({_id:cart._id},{$inc:{totalQuantity:-1,totalItems:-1,totalPrice:-product.price},"$pull": { "items": { "productId": product._id } }},{new:true}).populate('items.productId',{__v:0})
                    
                else{
                    let update = {}
                           update.$inc = { totalPrice:-product.price,
                           totalQuantity:-1,
                           'items.$[element].quantity':-1}
                    cart = await cartModel.findOneAndUpdate({_id:cart._id},update,{new:true, "arrayFilters": [ { "element.productId": product._id }]}).populate('items.productId',{__v:0})
                }

                if(cart.totalItems==0)
                    cart = await cartModel.findOneAndUpdate({_id:cart._id},{totalPrice:0},{new:true}).populate('items.productId',{__v:0})
                return res.status(201).send({status:true, message:"Success", data:cart})
            

        } catch (err) {
            res.status(500).send({status:false,message:err.message})
        }


    }


    const getCart = async (req,res)=>{
        try {
            if(!validator.isValidObjectId(req.params.userId))
                res.status(403).send({status:false,message:"Invalid UserId"})
            // if(req.loggedInUserId!==userId)
            //     return res.status(403).send({status:false,message:"Autherization Failed"})
            
            // Checking User
            let user;
            if(!(user = await userModel.findById(req.params.userId)))
            return res.status(404).send({status:false,message:"User DoesNot Exist"})
           
            let cart;
            if(!(cart = await cartModel.findOne({userId:user._id},{__v:0}).populate('items.productId',{__v:0})))
            return res.status(404).send({status:false,message:"Cart DoesNot Exist"})
            
            res.status(200).send({status:true,data:cart})

        } catch (err) {
            res.status(500).send({status:false,message:err.message})
        }
    }

    const deleteCart = async (req,res)=>{
        try {
            if(!validator.isValidObjectId(req.params.userId))
                res.status(403).send({status:false,message:"Invalid UserId"})
            // if(req.loggedInUserId!==req.params.userId)
            //     return res.status(403).send({status:false,message:"Autherization Failed"})
            
            // Checking User
            let user;
            if(!(user = await userModel.findById(req.params.userId)))
            return res.status(404).send({status:false,message:"User DoesNot Exist"})
            if(!await cartModel.findOne({userId:user._id}))
            return res.status(404).send({status:false,message:"Cart DoesNot Exist"})
            
            let cart = await cartModel.findOneAndUpdate({userId:user._id},{totalPrice:0,totalItems:0,items:[],totalQuantity:0},{new:true})
            res.status(200).send({status:true,message:"Success",data:cart})
        } catch (err) {
            res.status(500).send({status:false,message:err.message})
        }
    }


    module.exports.addToCart = addToCart;
    module.exports.getCart = getCart
    module.exports.deleteCart = deleteCart;
    module.exports.updateCart = updateCart;
