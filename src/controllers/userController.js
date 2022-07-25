
const userModel = require('../models/userModel')
const {uploadFile}=require("../cloudComputing/aws")
const { keyValue,isValid,isValidEmail,passwordRegex ,phoneRegex} = require("../validators/validator");


const createUser = async (req, res) => {
    try {
        let finalDetails = req.body
        let files = req.files
        let { fname, lname, email, password, phone, address } = finalDetails
        
       if(files && files.length>0){
        let uploadedFileURL= await uploadFile( files[0] )
        finalDetails["profileImage"]=uploadedFileURL
    }
    else{
        res.status(400).send({ msg: "No file found" })
    }
       // const finalDetails = { fname, lname, email, profileImage, password, phone, address }
    //     let savedData = await userModel.create(finalDetails)
    //    let { fname, lname, email, password, phone, address } = details

       if (!keyValue(finalDetails)) {
        return res.status(400).send({ status: false, message: "please provide user data" })
    }

     if (!isValid(fname)) {
        return res.status(400).send({ status: false, messege: "please provide name" })
    }
    if (!isValid(lname)) {
        return res.status(400).send({ status: false, messege: "please provide lname" })
    }

    if (!isValid(email)) {
        return res.status(400).send({ status: false, messege: "please provide email" })
    }

    if (!isValidEmail(email)) {
        return res.status(400).send({ status: false, message: "Please provide valid Email Address" });
    }

    let isDuplicateEmail = await userModel.findOne({ email })
    if (isDuplicateEmail) {
        return res.status(400).send({ status: false, message: "email already exists" })
    }

    if (!isValid(phone)) {
        return res.status(400).send({ status: false, messege: "please provide phone number" })
    }
    if (!phoneRegex(phone)) {
    return res.status(400).send({ status: false, msg: "phone number is invalid!" })  // 7th V used here
    }
    let duplicatePhone = await userModel.findOne({ phone })        // DB Call

    if (duplicatePhone) return res.status(400).send({ status: false, msg: "phone number is already registered!" }) 
    
    if (!isValid(password)) {
        return res.status(400).send({ status: false, messege: "please provide password" })
    }

    if (!passwordRegex(password)) {
        return res.status(400).send({ status: false, messege: "invalid password" })
    }
    
    console.log(req.body["address.shipping.street"])
    
    if(!req.body["address.shipping.street"]){
        return res.status(400).send({status:false, message:"please provide shipping street"})
    }
    if(!req.body["address.shipping.city"]){
        return res.status(400).send({status:false, message:"please provide shipping city"})
    }
    if(!req.body["address.shipping.pincode"]){
        return res.status(400).send({status:false, message:"please provide shipping pincode"})
    }
    if(!req.body["address.billing.street"]){
        return res.status(400).send({status:false, message:"please provide billing street"})
    }
    if(!req.body["address.billing.city"]){
        return res.status(400).send({status:false, message:"please provide billing city"})
    }
    if(!req.body["address.billing.pincode"]){
        return res.status(400).send({status:false, message:"please provide billing pincode"})
    }

  
        
   // let savedData = await userModel.create(finalDetails)
    return res.status(201).send({ status: true, msg: "user created successfully", data: "done" });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getUser = async function (req, res) {
    try {

        let allQuery = req.query
        let usersDetail = await userModel.find(allQuery)
  
        if (usersDetail == false)
        {return res.status(404).send({ status: false, msg: "data not found" })}
    
        res.status(200).send({ status: true, message: "user List", data: usersDetail })
    
}
catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
}
}
module.exports.createUser=createUser
module.exports.getUser=getUser