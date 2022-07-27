
const userModel = require('../models/userModel')
const secretKey = "Project5-Group3";
const bcrypt = require("bcrypt")
const {uploadFile}=require("../cloudComputing/aws")
const { keyValue,isValid,isValidEmail,passwordRegex ,phoneRegex,isValidName,isValidObjectId,pincodeRegex} = require("../validators/validator");
const jwt = require("jsonwebtoken");
//const {AuthenticationCheck, AuthorizationCheck}= require("../middleware/auth")


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
         return res.status(400).send({status : false, msg: "No Profile Image found" })
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
    if (!isValidName(fname)) {
        return res.status(400).send({ status: false, messege: "please provide correct name" })
    }
    if (!isValid(lname)) {
        return res.status(400).send({ status: false, messege: "please provide lname" })
    }
    if (!isValidName(lname)) {
        return res.status(400).send({ status: false, messege: "please provide correct lname" })
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

    req.body.password = await bcrypt.hash(password,10);

    // const salt= await bcrypt.genSalt(10)
    // const hashedPassword = await bcrypt.hash(password,salt)
    // req.body.password=hashedPassword
    // console.log(password)
    // console.log( req.body.password)
    // console.log(hashedPassword)
    
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
    if (!pincodeRegex(req.body["address.shipping.pincode"])) {
        return res.status(400).send({ status: false, messege: "invalid shipping pincode" })
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
    if (!pincodeRegex(req.body["address.billing.pincode"])) {
        return res.status(400).send({ status: false, messege: "invalid billing pincode" })
    }

    

  
        
    let savedData = await userModel.create(finalDetails)
    return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

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
       
       
        let hashedPassword = await bcrypt.compare(password, findUser.password)
        
        if (!hashedPassword) return res.status(404).send({status: false, msg: "Login failed! Wrong password."});

        //Token Generation
    
        var token = jwt.sign({ 
            userId: findUser._id.toString() ,
            iat:Math.floor(new Date().getTime()/1000)},
         secretKey, {
          expiresIn: "1h", // token expire date
        });
    
        // req.header("x-api-key", token); //setting headers
        return res.status(200).send({status: true,message: "login successfully",data: { userId:findUser._id.toString(), token: token },
        });
    } catch (error) {
        res.status(500).send({ status: false, Error: error.message });
    }
    };


const getUser = async function (req, res) {
    try {

        let data=req.params.userId
        if(!data)return res.status(400).send({status:false,msg:"please enter user id"})
        if (!isValidObjectId(data))  return res.status(400).send({ status: false, data: "please provide correct id" })

        if(req.loggedInUserId != data) {
            return res.status(401).send({ status: false, msg: "Unauthorize! userId doesnot match"})
        }
       // return res.status(200).send({status:true,message:'User list',Data:findUsers})
        
        let findUser=await userModel.findOne({_id:data})
        if(!findUser)return res.status(404).send({status:false, meg:"No Data Found For this ID"})
       // let findUsers=await userModel.find(({ _id:data })).select({isDeleted:0,createdAt:0,updatedAt:0, __v:0})
       
        return res.status(200).send({status:true,message:'User list',Data:findUser})
}
catch (err) {
    console.log(err)
    res.status(500).send({ status: false, msg: err.message })
}
}


const updateUser = async (req, res) => {
    try {
        const userId = req.params.userId
        let files = req.files

        
        if (!keyValue(userId)) {
             return res.status(400).send({ status: false, message: "please provide userid to update details of user" });}

        if (!isValidObjectId(userId)) {
          return res.status(400).send({ status: false, message: "invalid user id "}) }

        //   req.loggedInUserId = decodedToken._id
        // if (req.loggedInUserId!=userId)
        //  {return res.status(403).send({status: false,message: "user is Unauthorized" }); }
        


        const userFind = await userModel.findById({ _id:userId })

        if (!userFind) return res.status(404).send({ status: false, message: "User not found" })

        let data = req.body

        const { fname, lname, email, phone, address, password } = data
         req.body.address= JSON.parse(address)
        
        if (!keyValue(data)) {
            return res.status(400).send({ status: false, message: "please provide user data to update" })
        }

        if (fname) {
            if (!isValidName(fname)) {
                return res.status(400).send({ status: false, message: " please provide valid First Name " })
            }
        }

        if (lname) {
            if (!isValidName(lname)) {
                return res.status(400).send({ status: false, message: "please provide valid last Name " })
            }
        }

        if (email) {
            if (!isValidEmail(email)) {
                return res.status(400).send({ status: false, message: " invalid Email ID " })
            }
        }

        let isDuplicateEmail = await userModel.findOne({ email })
        if (isDuplicateEmail) {
            return res.status(400).send({ status: false, message: "email already exists" })
        }

        if(files && files.length>0){
            let uploadedFileURL= await uploadFile( files[0] )
            finalDetails["profileImage"]=uploadedFileURL
        }
       
        if (phone) {
            if (!phoneRegex(phone)) {
                return res.status(400).send({ status: false, message: "Please Send Valid Phone Number " })
            }
        }
        let duplicatePhone = await userModel.findOne({ phone })        // DB Call

        if (duplicatePhone) return res.status(400).send({ status: false, msg: "phone number is already registered!" }) 
        
        if (password) {
            if (!passwordRegex(password)) {
                return res.status(400).send({ status: false, message: "Password Length should be between 8 and 15" })
            }
            // generate salt to hash password
                                                               
            req.body.password = await bcrypt.hash(password,10);
        }

        

        const updateData=req.body
        const update = await userModel.findOneAndUpdate({ _id:userId},{ $set:updateData },{ new: true })
       
        return res.status(200).send({ status: true, message: "User Profile updated", data: update })
    }
    catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
}


module.exports.createUser=createUser
module.exports.getUser=getUser
module.exports.loginUser=loginUser
module.exports.updateUser=updateUser
