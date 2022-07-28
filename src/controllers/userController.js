
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
        let userId = req.params.userId

        if (!userId)
         return res.status(400).send({ status: false, message: 'pls give a userId in params' })
        if (!isValidObjectId(userId))
         return res.status(400).send({ status: false, message: 'pls give a valid userId in params' })

        let user = await userModel.findById(userId)
        if (!user)
        return res.status(404).send({ status: false, message: 'sorry, No such user exists with this Id' })

        let body = req.body;
        let { fname, lname, email, profileImage, phone, password, address, shipping, billing } = body;
        if (Object.keys(body).length === 0 && req.files == undefined) return res.status(400).send({ status: false, message: 'please enter body' })
       // pending work in files isvalidfiles
       //if (isValidBody(body)) return res.status(400).send({ status: false, message: 'please enter body' })

        let obj = {};
        if(fname =="") return res.status(400).send({status:false, message: "Don't leave fname Empty"})
        if (fname) {
            if (!isValid(fname)) return res.status(400).send({ status: false, message: "Don't leave fname Empty" })
            if (!isValidName(fname)) return res.status(400).send({ status: false, message: "Pls Enter Valid fname" })
            obj.fname = fname
        }
        if(lname =="") return res.status(400).send({status:false, message: "Don't leave lname Empty"})
        if (lname) {
            if (!isValid(lname)) return res.status(400).send({ status: false, message: "Don't leave lname Empty" })
            if (!isValidName(lname)) return res.status(400).send({ status: false, message: "Pls Enter Valid lname" })
            obj.lname = lname
        }
        if(email =="") return res.status(400).send({status:false, message: "Don't leave email Empty"})
        if (email) {
            if (!isValid(email)) return res.status(400).send({ status: false, message: "Don't leave email Empty" })
            if (!isValidEmail(email)) return res.status(400).send({ status: false, message: "Pls Enter Valid email" })
            if (await userModel.findOne({ email })) return res.status(400).send({ status: false, message: "this email has already been used" })
            obj.email = email
        }
        if (profileImage) {
            let files = req.files
            if (!(files && files.length > 0)) {
                return res.status(400).send({ status: false, message: " Please Provide The Profile Image" });
            }
            const uploadedBookImage = await uploadFile(files[0])
            obj.profileImage = uploadedBookImage
        }
        if(phone =="") return res.status(400).send({status:false, message: "Don't leave phone Empty"})
        if (phone) {
            if (!isValid(phone)) return res.status(400).send({ status: false, message: "Don't leave phone number Empty" })
            if (!phoneRegex(phone)) return res.status(400).send({ status: false, message: "Pls Enter Valid phone number" })
            if (await userModel.findOne({ phone })) return res.status(400).send({ status: false, message: "this phone number has already been used" })
            obj.phone = phone
        }
        if(password =="") return res.status(400).send({status:false, message: "Don't leave password Empty"})
        if (password) {
            if (!isValid(password)) return res.status(400).send({ Status: false, message: " password is required" })
            if (!passwordRegex(password)) return res.status(400).send({ Status: false, message: " Please enter a valid password, minlength 8, maxxlength 15" })
            // //generate salt to hash password
            // const salt = await bcrypt.genSalt(10);
            // now we set user password to hashed password
            bcryptedPassword = await bcrypt.hash(password,10);
            obj.password = bcryptedPassword
        }
        if(address =="") return res.status(400).send({status:false, message: "Don't leave address Empty"})
        if ("address" in body) {
            // address = JSON.stringify(address)
            //address = JSON.parse(address)


            if (!address || Object.keys(address).length === 0) {
                return res.status(400).send({ status: false, message: "Please enter address and it should be in object!!" })
            }
            //  address = JSON.stringify(address)
            let addresss = JSON.parse(address)
            const { shipping, billing } = addresss
            if ("shipping" in addresss) {
                const { street, city, pincode } = shipping
                if ("street" in shipping) {
                    if (!isValid(street)) {
                        return res.status(400).send({ status: false, message: "street is not valid" })
                    }
                    obj["addresss.shipping.street"] = street
                }
                if ("city" in shipping) {
                    if (!isValid(city)) return res.status(400).send({ status: false, message: "city is not valid" })
                    if(!isValidName(city)) return res.status(400).send({ status: false, message: "city name is not in valid format" })
                    
                    obj["addresss.shipping.city"] = city
                }
                if ("pincode" in shipping) {
                    if (!isValid(pincode)) return res.status(400).send({ status: false, message: "pincode is not valid" })
                    if (!pincodeRegex(pincode)) return res.status(400).send({ status: false, message: "pincode is not in valid format" })
                    obj["addresss.shipping.pincode"] = pincode
                }
            }

            if ("billing" in addresss) {
                const { street, city, pincode } = billing
                if ("street" in billing) {
                    if (!isValid(street)) return res.status(400).send({ status: false, message: "street is not valid" })
                    obj["addresss.billing.street"] = street
                }

                if ("city" in billing) {
                    if (!isValid(city)) return res.status(400).send({ status: false, message: "city is not valid" })
                    if(!isValidName(city)) return res.status(400).send({ status: false, message: "city name is not in valid format" })
                    obj["addresss.billing.city"] = city
                }
                if ("pincode" in billing) {
                    if (!isValid(pincode)) return res.status(400).send({ status: false, message: "shipping pincode is not valid" })
                        if (!pincodeRegex(pincode)) return res.status(400).send({ status: false, message: "pincode is not in valid format" })
                        obj["addresss.billing.pincode"] = pincode
                    }
                }
                obj["address"] = addresss
            }
    
            let updatedUser = await userModel.findOneAndUpdate({ _id: userId }, { $set: obj }, { new: true })
            res.status(200).send({ status: true, message: "User profile updated", data: updatedUser })
    
        } catch (error) {
            res.status(500).send({ status: false, message: error.message })
       }
    }

module.exports.createUser=createUser
module.exports.getUser=getUser
module.exports.loginUser=loginUser
module.exports.updateUser=updateUser
