const userModel = require('../models/orderModel');
const productModel = require('../models/productModel');
const cartModel = require('../models/cartModel');
const orderModel = require('../models/orderModel');
const { keyValue,isValid,isValidName,priceRegex,isValidObjectId,isValidSize,isVerifyNumber} = require("../validators/validator");



const createOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let body = req.body
        let { cartId } = body
        //pending:- with a cart id many order are created, prevent that

        if (!keyValue(body)) return res.status(400).send({ status: false, message: 'please enter body' })
        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Invalid userId' })
       // if (!(await userModel.findById(userId))) return res.status(404).send({ status: false, message: 'No user found, with userId' })

       if (userId !== req.loggedInUserId)
       return res.status(403).send({ status: false, msg: "Not Authorised" })

        if (!(await cartModel.findOne({ userId }))) return res.status(404).send({ status: false, message: 'No cart found, with userId' })

        if (!("cartId" in body)) return res.status(400).send({ status: false, message: 'please, give cartId in body, it is required' })
        if (!isValid(cartId)) return res.status(400).send({ status: false, message: 'please do not leave cartId empty' })
        if (!isValidObjectId(cartId)) return res.status(400).send({ status: false, message: 'Invalid cartId' })
        let cart = await cartModel.findById(cartId)
        if (!cart) return res.status(404).send({ status: false, message: 'No cart found, with cartId' })

        if(await orderModel.findOne({ cartId: cartId })) return res.status(400).send({ status: false, message: 'order is already placed for this id' })
        let items = cart.items;
        let totalPrice = cart.totalPrice;
        let totalItems = cart.totalItems;
        //let totalQuantity= cart.totalQuantity
        let totalQuantity = 0
        for (let i = 0; i < cart.items.length; i++) {
            totalQuantity += cart.items[i].quantity
        }

        let orderDetails = {}

        orderDetails.userId = userId;
        orderDetails.items = items;
        orderDetails.totalPrice = totalPrice;
        orderDetails.totalItems = totalItems;
        orderDetails.totalQuantity = totalQuantity;

        let orderdata = await orderModel.create(orderDetails)
        await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
        res.status(201).send({ status: true, message: 'success', data: orderdata })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}

//-----------------------------------------------update order------------------------------------------
const updateOrder = async function (req, res) {
    try {
        let userId = req.params.userId;
        let body = req.body
        let { orderId, status } = body

        if (!keyValue(body)) return res.status(400).send({ status: false, message: 'please enter body' })

        if (!isValidObjectId(userId)) return res.status(400).send({ status: false, message: 'Invalid userId' })
        //if (!(await userModel.findById(userId))) return res.status(404).send({ status: false, message: 'No user found, with userId' })

        if (userId !== req.loggedInUserId)
        return res.status(403).send({ status: false, msg: "Not Authorised" })

        if (!(await orderModel.findOne({ userId }))) return res.status(404).send({ status: false, message: 'No order found, with userId' })

        if (!("orderId" in body)) return res.status(400).send({ status: false, message: 'please, give orderId in body, it is required' })
        if (!isValid(orderId)) return res.status(400).send({ status: false, message: 'please do not leave orderId empty' })
        if (!isValidObjectId(orderId)) return res.status(400).send({ status: false, message: 'Invalid orderId' })
      
        let order = await orderModel.findById(orderId)
        if (!order) return res.status(404).send({ status: false, message: 'No order found, with orderId' })

        if(order.isDeleted == true) {
            return res.status(400).send({status: false, msg: "order is already deleted"})
        }
        let validStatus = ['pending', 'completed', 'cancled']
        if (!("status" in body)) return res.status(400).send({ status: false, message: 'please, give status key in body, it is required' })
        if (!isValid(status)) return res.status(400).send({ status: false, message: 'please do not leave status empty' })
        if (!validStatus.includes(status)) return res.status(400).send({ status: false, message: `status should be among  ${validStatus} ` })


            if(status == 'pending' ){
                if (order.status=='completed'){
                    await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
                    return res.status(400).send({status:true,message:"order completed!! can't change to pending"})
                }
                if (order.status=='cancled'){
                    await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
                    return res.status(400).send({status:true,message:"order cancled!! can't change to pending"})
                }
                if (order.status=='pending'){
                    await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
                    return res.status(400).send({status:true,message:"order already pending!!"})
                }
            }

            if(status == 'completed' ){
                if (order.status=='completed'){
                    await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
                    return res.status(400).send({status:true,message:"order already completed!!"})
                }
                if (order.status=='cancled'){
                    await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
                    return res.status(400).send({status:true,message:"order cancled!! can't change to complete"})
                }
                
            }

            if (order.status =='cancled') {
                await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
                return res.status(400).send({status:true, message:'order already cancled'})
              }

        if (status == 'cancled') {
            if (order.cancellable === true) {
                order.status = status
                order.save()  }else{
                    return res.status(400).send({status:true, message:'order can not be cancled'})
                }
            } else {
                order.status = status
                order.save()
            }
            await cartModel.findOneAndUpdate({userId :userId}, {items:[], totalItems: 0, totalPrice: 0},{new: true})
            res.status(200).send({ status: true, message: 'success', data: order })
        }
        catch (error) {
            res.status(500).send({ status: false, message: error.message })
        }
    }
    
    module.exports = { createOrder, updateOrder }