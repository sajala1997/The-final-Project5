const getSymbolFromCurrency = require('currency-symbol-map')
const productModel= require("../models/productModel")
const {uploadFile}=require("../cloudComputing/aws")
const { keyValue,isValid,isValidName,priceRegex,isValidObjectId,isValidSize,isVerifyNumber} = require("../validators/validator");


const createProduct = async (req, res) => {

    try {
    let data= req.body
    let files = req.files
    let { title, description, price, currencyId, style, availableSizes, installments  } = data

    if (!keyValue(data)) {
        return res.status(400).send({ status: false, message: "please provide product details" })
    }
    if (!isValid(title)) {
        return res.status(400).send({ status: false, messege: "please provide title" })
    }
    if (!isValidName(title)) {
        return res.status(400).send({ status: false, messege: "please provide correct title" })
    }
    let isDuplicateTitle = await productModel.findOne({ title })
    if (isDuplicateTitle) {
        return res.status(400).send({ status: false, message: "title already exists" })
    }
    if (!isValid(description)) {
        return res.status(400).send({ status: false, messege: "please provide description" })
    }
    if (!priceRegex(price)) {
        return res.status(400).send({ status: false, msg: "price is invalid!" })  
    }
    if (!isValid(currencyId)) {
        return res.status(400).send({ status: false, messege: "please provide currencyId" })
    }

    if(req.body.currencyId==='INR'){
       req.body.currencyFormat =  getSymbolFromCurrency('INR')
    }
    else
    return res.status(400).send({ status: true, msg: "Please provide the currencyId INR"});
    if(style)
    data.style= style
    if(files && files.length>0){
    let uploadedFileURL= await uploadFile( files[0] )
    data["productImage"]=uploadedFileURL
    }
    else{
    return res.status(400).send({status : false, msg: "No Product Image found" })
    }

    if (!isValid(availableSizes)) {
        return res.status(400).send({ status: false, messege: "please provide available Sizes" })
    }
    // const isValidavailableSizes = function(availableSizes) {return ["S", "XS","M","X", "L","XXL", "XL"].indexOf(availableSizes) !== -1}
    // console.log(isValidavailableSizes(availableSizes))
    //     if (!isValidavailableSizes(availableSizes)) {return res.status(400).send({ status: false, message: `Sizes should be among S, XS ,M, X, L, XXL, XL` }) }
    // availableSizes= availableSizes.split(',').map(x=> x.trim().toUpperCase())
    // if(availableSizes.map(x=>isValidSize(x).filter(x=> x=== false).length!==0))
    //     return res.status(400).send({ status: false, messege: "choose correct size" })
    //     body.availableSizes= availableSizes

    availableSizes = availableSizes.split(',').map(x => x.trim().toUpperCase())
        if (availableSizes.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be Among  S,XS,M,X,L,XXL,XL" })
        data.availableSizes = availableSizes

    
    
    let savedData = await productModel.create(data)
    return res.status(201).send({ status: true, msg: "product created successfully", data: savedData });
    }
    catch(error){
        return res.status(500).send({ status: false, msg: error.message });
   
    }
}

const getByProductId = async (req, res) => {
    try{
        const productId = req.params.productId

        if (!isValidObjectId(productId)) {
            return res.status(400).send({ status: false, msg: "productId is invalid" });
        }

        const findProduct = await productModel.findById({_id:productId,isDeleted:false})

        if (!findProduct) {
            return res.status(404).send({ status: false, message: 'product not found' })
        }

        return res.status(200).send({ status: true, message: 'Product found successfully', data: findProduct })
    }
    catch(error){
        return res.status(500).json({ status: false, message: error.message });
    }
}

const deleteProduct = async function (req, res) {
    try {
        let product = req.params.productId
        console.log(product)
        const check = await productModel.findById(product)
        if(check.isDeleted==true) return res.status(404).send({ status: false, msg: "Product is already deleted" })
        let deletedProduct = await productModel.findByIdAndUpdate(  { _id: product }, {$set: { isDeleted: true,deletedAt:new Date() }})

        return res.status(200).send({ status: true, data:"Deleted successfully " })
    }
    catch (err) {
        console.log(err.message)
        res.status(500).send({ status: false, msg: err.message })
    }


};


const getProduct = async function (req, res) {
    try {
        const filter = {};
        if(req.body.UserId){
        if(!isValidObjectId(req.body.UserId)) return res.status(400).send({status:false,msg:"enter valid UserId"})}
        
        let  product = await productModel.find({$and:[req.body,{isDeleted:false}]})
            if (product.length > 0) {
                res.status(200).send({ status: true, message: 'Success', data:product })
            }
            else {
                res.status(404).send({ status: false, msg: "No product found" })
            }
            if (req.body.UserId){

            }else{
                filter.userId = product.userId;
            }
            //if (product.availableSizes) {
              //  filter.availableSizes = product.availableSizes;
            //}
    }
    catch (err) {
        res.status(500).send({ msg:err.message})
    }
}
let updateProduct=async function (req,res){
    try {
        let body=req.body 
        let product=req.params.productId 
        const findProduct = await productModel.findOne({_id:product,isDeleted:false})
        if(!findProduct) return res.status(404).send({ status: false, msg:"No product found"  })
        let {  title, description, price, currencyId, isFreeShipping, productImage, style, availableSizes, installments } = body
        console.log(Object.keys(body))
        if (Object.keys(body).length === 0 && req.files == undefined) return res.status(400).send({ status: false, message: 'please enter body' })
        
        let obj = {};
        if(title =="") return res.status(400).send({status:false, message: "Don't leave title Empty"})
        if (title) {
            if (!isValid(title)) return res.status(400).send({ status: false, message: "Don't leave title Empty" })
            if (!isValidName(title)) return res.status(400).send({ status: false, message: "Pls Enter Valid title" })
            let isDuplicateTitle = await productModel.findOne({ title })
            if (isDuplicateTitle) {
            return res.status(400).send({ status: false, message: "title already exists" })
            }
            obj.title = title
        }
        if(description =="") return res.status(400).send({status:false, message: "Don't leave description Empty"})
        if (description) {
            if (!isValid(description)) return res.status(400).send({ status: false, message: "Don't leave description Empty" })
            if (!isValidName(description)) return res.status(400).send({ status: false, message: "Pls Enter Valid description" })
            obj.description = description
        }
        if(price =="") return res.status(400).send({status:false, message: "Don't leave price Empty"})
        if (price) {
            if (!isValid(price)) return res.status(400).send({ status: false, message: "Don't leave price empty" })
            if (!priceRegex(price)) return res.status(400).send({ status: false, message: "Pls Enter Valid price" })
            obj.price = price
        }
        if(isFreeShipping =="") return res.status(400).send({status:false, message: "Don't leave price Empty"})
        if (isFreeShipping) {
            if (!isValid(isFreeShipping)) return res.status(400).send({ status: false, message: "Don't leave isFreeShipping empty" })
            if(!(isFreeShipping== "true" || isFreeShipping=="false")) return res.status(400).send({ status: false, message: "pls enter valid shipping " })
            obj.isFreeShipping = isFreeShipping
        }

        if (productImage) {
            let files = req.files
            if (!(files && files.length > 0)) {
                return res.status(400).send({ status: false, message: " Please Provide The product Image" });
            }
            const uploadedProductImage = await uploadFile(files[0])
            obj.productImage = uploadedProductImage
        }
        if(style =="") return res.status(400).send({status:false, message: "Don't leave style Empty"})
        if (style) {
            if (!isValid(style)) return res.status(400).send({ status: false, message: "Don't leave style empty" })
            obj.style = style
        }
        if(availableSizes =="") return res.status(400).send({status:false, message: "Don't leave availableSizes Empty"})
        if (availableSizes) {
            if (!isValid(availableSizes)) return res.status(400).send({ status: false, message: "Don't leave availableSizes empty" })
            availableSizes = availableSizes.split(',').map(x => x.trim().toUpperCase())
            if (availableSizes.map(x => isValidSize(x)).filter(x => x === false).length !== 0) return res.status(400).send({ status: false, message: "Size Should be Among  S,XS,M,X,L,XXL,XL" })
            obj.availableSizes = availableSizes
        }
        if(installments =="") return res.status(400).send({status:false, message: "Don't leave installments Empty"})
        if (installments) {
            if (!isValid(installments)) return res.status(400).send({ status: false, message: "Don't leave installments empty" })
    
            obj.installments = installments
        }


        let updatedProduct = await productModel.findOneAndUpdate({ _id: product }, { $set: obj }, { new: true })
        res.status(200).send({ status: true, message: "product updated", data: updatedProduct })

        
    
        
    } catch (error) {
        console.log(error.message)
        res.status(500).send({ status: false, msg: error.message })
    }
} 

module.exports.createProduct=createProduct
module.exports.getByProductId=getByProductId
module.exports.deleteProduct=deleteProduct
module.exports.getProduct=getProduct
module.exports.updateProduct=updateProduct


