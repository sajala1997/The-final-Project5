
const userModel = require('../models/userModel')
const secretKey = "Project5-Group3";
const {uploadFile}=require("../cloudComputing/aws")
const { keyValue,isValid,isValidEmail,passwordRegex ,phoneRegex} = require("../validators/validator");
const jwt = require("jsonwebtoken");
const {AuthenticationCheck, AuthorizationCheck}= require("../middleware/auth")


const createUser = async (req, res) => {
try {
    let finalDetails = req.body;
    let files = req.files;
    // let { fname, lname, email, password, phone } = data

    // const finalDetails = { fname, lname, email, profileImage, password, phone, address }
    let savedData = await userModel.create(finalDetails);
    return res
    .status(201)
    .send({
        status: true,
        msg: "user created successfully",
        data: savedData,
    });
} catch (error) {
    return res.status(500).send({ status: false, message: error.message });
}
};

//----------------------------------------login user----------------------------------------------------------------------------------------------------------------------------------------------------------/

const loginUser = async function (req, res) {
    try {
        const { email, password } = req.body; //destructioring
    
        //Email Validation
    
        if (!isValid(email)) {
        return res
            .status(400)
            .send({ status: false, message: "email id is required" });
        }
    
        if (!isValidEmail(email)) {
        return res
            .status(400)
            .send({ status: false, message: "Valid email id required" });
        }
    
        //Password validation
    
        if (!isValid(password)) {
        return res
            .status(400)
            .send({ status: false, message: "password is required" });
        }
    
        const findUser = await userModel.findOne({ email });
    
        if (!findUser) {
        return res
            .status(401)
            .send({ status: false, message: "Incorrect email Id" });
        }
        if (findUser.password !== req.body.password) {
        return res
            .status(401)
            .send({ status: false, message: "Incorrectpassword" });
        }
    
        //Token Generation
    
        var token = jwt.sign({ userId: findUser._id.toString() }, secretKey, {
          expiresIn: "365d", // token expire date
        });
    
        req.header("x-api-key", token); //setting headers
        return res
        .status(200)
        .send({
            status: true,
            message: "login successfully",
            data: { token: token },
        });
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }
    };


const getUser = async function (req, res) {
    try {

        let data=req.params.userId
        if(!data)return res.status(400).send({status:false,msg:"please enter user id"})
        //if (!isValidObjectId(data))  return res.status(400).send({ status: false, data: "please provide correct id" })
        let findUser=await userModel.findOne({_id:data})
        if(!findUser)return res.status(404).send({status:false, meg:"No Data Found For this ID"})
        let findUsers=await userModel.find(({ _id:data })).select({isDeleted:0,createdAt:0,updatedAt:0, __v:0})
       
        return res.status(200).send({status:true,message:'User list',Data:findUsers})
}
catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
}
}
module.exports.createUser=createUser
module.exports.getUser=getUser
module.exports.loginUser=loginUser
