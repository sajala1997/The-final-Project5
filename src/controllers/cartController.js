    const cartModel = require('../models/cartModel')
    const userModel = require('../models/userModel')
    const productModel = require('../models/productModel');
    const validator = require('../validators/validator')
    const mongoose = require('mongoose');




    const addToCart = async (req,res)=>{
    try{
    let userId=req.params.userId
    let data=req.body
    let productId=req.body.productId
    let quantity=req.body.quantity

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
        
    // create

    let cartExist;
    
    if(!(cartExist = await cartModel.findOne({userId:userId}))){
        const savedData = await cartModel.create({ userId: userId,
            items: [{productId,quantity}],
            totalPrice: findProduct.price*quantity,
            totalQuantity:quantity,
            totalItems: 1})
        return res.status(201).send({status:true, message:"cart created successfully", data:savedData})
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
        const savedData = await cartModel.findOneAndUpdate({_id:cartExist._id},update,{new:true, "arrayFilters": [
            {
            "element.productId": productId
            }
        ]})
        
        
        return res.status(201).send({status:true, message:"cart created successfully", data:savedData})
    }


    update.$inc = {totalPrice:(findProduct.price*quantity),totalItems:1,totalQuantity:quantity}
    update.$push = {items:{productId,quantity}}


    const savedData = await cartModel.findOneAndUpdate({_id:cartExist._id},update,{new:true})
    return res.status(201).send({status:true, message:"cart created successfully", data:savedData})

    }
    catch(error){
        return res.status(500).send({ status: false, message: error.message });
    }
    }






















    const updateCart = async (req,res)=>{
        try {
            let errMsg = {}
            errMsg.userId = (req.params.userId===undefined)?"UserId required": validator.isValidObjectId(req.params.userId)?false:"Invalid UserId"
            errMsg.cartId = (req.body.cartId===undefined)?"CartId Required":validator.isValidObjectId(req.body.cartId)?false:"Invalid cartId"
            errMsg.productId = (req.body.productId===undefined)?"ProductId Required!":validator.isValidObjectId(req.body.productId)?false:"Invalid ProductId"
            errMsg.removeKey = (req.body.removeKey===undefined)?"removeKey Required!":!isNaN(parseInt(req.body.removeKey))&&(parseInt(req.body.removeKey)==0||parseInt(req.body.removeKey)==1)?false:"Invalid RemoveKey"
            Object.keys(errMsg).forEach(key => errMsg[key] === false && delete errMsg[key])
            if(Object.keys(errMsg).length!==0) return res.status(400).send({status:false,msg:errMsg})
            
            

            // if(req.loggedInUserId!==req.params.userId)
            //     return res.status(403).send({status:false,message:"Autherization Failed"})
            
            // Checking User
            if(!await userModel.findById(req.params.userId))
            return res.status(404).send({status:false,message:"User DoesNot Exist"})
            let product;
            if(!(product = await productModel.findById(req.body.productId)) || product.isDeleted==true)
            return res.status(404).send({status:false,message:"Product DoesNot Exist"})

            if(!await cartModel.findById(req.body.cartId))
            return res.status(404).send({status:false,message:"Cart DoesNot Exist"})
            let cart;
            if(req.body.removeKey==0){

                let update = {}
                update.$inc = { totalPrice:-(product.price*'items.$[element].quantity'),
                    totalQuantity:-'items.$[element].quantity',
                    totalItems:-1
                }

            cart = await cartModel.findOneAndUpdate({_id:req.body.cartId},{$pull:{items:{productId:product_id}},$inc:update.$inc})
            res.status(200).send({status:true,data:cart});
            }

// removeKey==1

            cart = await cartModel.findById(req.body.cartId);
            let productQuantity
            if(cart.items.find((x)=>{
                if(x.productId.toString() == product._id){
                    productQuantity = x.quantity;
                return true;
                }
            })){

                if(productQuantity==1){
                    
                    cart = await cartModel.findOneAndUpdate({_id:cart._id},{$inc:{totalQuantity:-1,totalItems:-1,totalPrice:-product.price},"$pull": { "items": { "productId": product._id } }},{new:true})
                    
                }

                else{


                    let update = {}
                    update.$inc = { totalPrice:-product.price,
                        totalQuantity:-1,
                        'items.$[element].quantity':-1}
                    cart = await cartModel.findOneAndUpdate({_id:cart._id},update,{new:true, "arrayFilters": [
                        {
                        "element.productId": product._id
                        }
                    ]})
                }


                
                
                return res.status(201).send({status:true, message:"cart created successfully", data:cart})
            }
        


            



        } catch (err) {
            res.status(500).send({status:false,message:err.message})
        }


    }


    const getCart = async (req,res)=>{
        try {
            let errMsg = {}
            errMsg.userId = (req.params.userId===undefined)?"UserId required": mongoose.Types.ObjectId.isValid(req.params.userId)?false:"Invalid UserId"
            errMsg.cartId = (req.body.cartId===undefined)?"CartId Required":mongoose.Types.ObjectId.isValid(req.params.cartId)?false:"Invalid UserId"
            Object.keys(errMsg).forEach(key => errMsg[key] === false && delete errMsg[key])
            if(Object.keys(errMsg).length!==0) return res.status(400).send({status:false,msg:errMsg})

            if(req.loggedInUserId!==userId)
                return res.status(403).send({status:false,message:"Autherization Failed"})
            
            // Checking User
            if(!await userModel.findById(req.params.userId))
            return res.status(404).send({status:false,message:"User DoesNot Exist"})
            let cart;
            if(!(cart = await cartModel.findById(req.body.cartId)))
            return res.status(404).send({status:false,message:"Cart DoesNot Exist"})
            
            res.status(200).send({status:true,data:cart})

        } catch (err) {
            res.status(500).send({status:false,message:err.message})
        }
    }

    const deleteCart = async (req,res)=>{
        try {
            let errMsg = {}
            errMsg.userId = (req.params.userId===undefined)?"UserId required": mongoose.Types.ObjectId.isValid(req.params.userId)?false:"Invalid UserId"
            errMsg.cartId = (req.body.cartId===undefined)?"CartId Required":mongoose.Types.ObjectId.isValid(req.params.cartId)?false:"Invalid UserId"
            Object.keys(errMsg).forEach(key => errMsg[key] === false && delete errMsg[key])
            if(Object.keys(errMsg).length!==0) return res.status(400).send({status:false,msg:errMsg})
            if(req.loggedInUserId!==userId)
                return res.status(403).send({status:false,message:"Autherization Failed"})
            
            // Checking User
            if(!await userModel.findById(req.params.userId))
            return res.status(404).send({status:false,message:"User DoesNot Exist"})
            let product;
            if(!await cartModel.findById(req.body.cartId))
            return res.status(404).send({status:false,message:"Cart DoesNot Exist"})
            
            let cart = await cartModel.findOneAndUpdate({_id:req.body.cartId},{totalPrice:0,totalItems:0,$pullAll:items})

        } catch (err) {
            res.status(500).send({status:false,message:err.message})
        }
    }


    module.exports.addToCart = addToCart;
    module.exports.getCart = getCart
    module.exports.deleteCart = deleteCart;
    module.exports.updateCart = updateCart;
