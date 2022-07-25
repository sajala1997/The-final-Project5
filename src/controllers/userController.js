
const userModel = require('../models/userModel')
const { keyValue,isValid,isValidEmail,passwordRegex ,phoneRegex} = require("../validators/validator");


const createUser = async (req, res) => {
    try {
        let details = req.body
        let files = req.files
       let { fname, lname, email, password, phone, address } = details

       if (!keyValue(details)) {
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
 
    if(!address){
            return res.status(400).send({status:false, message:"please provide address"})
        }
       
        let savedData = await userModel.create(details)
        return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.createUser=createUser