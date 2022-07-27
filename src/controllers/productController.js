const getSymbolFromCurrency = require('currency-symbol-map')
const productModel= require("../models/productModel")

const createProduct = async (req, res) => {
    let finalDetails= req.body
    if(req.body.currencyId==='INR'){
       req.body.currencyFormat =  getSymbolFromCurrency('INR')
    }
    else
    return res.status(400).send({ status: true, msg: "wrong currency"});
    let savedData = await productModel.create(finalDetails)
    return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
    }

module.exports.createProduct=createProduct