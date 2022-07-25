const jwt = require("jsonwebtoken");
const secretKey = "Functionup-Radon";
const mongoose=require("mongoose")
const userModel = require("../models/userModel");



//*----------------Authorization For Book Creation------------------

const AuthorizationCheck = async function (req, res, next) {
  try {
    let token = req.headers["x-api-key"]
  let decoded= jwt.verify(token,secretKey)
  const userId=req.body.userId
  
  if (!userId) {
    return res
      .status(400)
      .send({ status: false, message: "UesrId is required" });
  }
  if (!mongoose.isValidObjectId(userId)) {
    return res
      .status(400)
      .send({ status: false, message: `${userId} is Invalid UserId` });
  }
  const uId = await userModel.findById({ _id:userId });
  if (!uId) {
    return res
      .status(404)
      .send({ status: false, message: `no user found with this UserId ${userId}` });
  }


   if(decoded.userId!==userId){
    return res.status(403).send({status:false,message:"Login User Is Not Authorized To perform This Task"})
   } 
  
  next();
      
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
}

module.exports = { AuthorizationCheck };
