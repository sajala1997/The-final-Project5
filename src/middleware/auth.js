const jwt = require("jsonwebtoken");

const mongoose=require("mongoose")
const userModel = require("../models/userModel");

//--------------------Authneication-------------------

// const AuthenticationCheck = async function (req, res, next) {
// try {
//     let token = req.headers.authorization.split(" ")[1];
//     console.log(req.headers.authorization)
//     console.log(token)
    
//     if (!token) {
//     return res.status(401).send({ status: false, message: "token must be present" });
//     }
//     let decodedToken = jwt.verify(token, secretKey)  
    
//          if (!decodedToken) return res.status(401).send({ status: false, msg: "Authentication failed" });
    
  
//         next()
    
    // jwt.verify(token,secretKey,
    // { ignoreExpiration: true },
    // function (error, decoded) {
    //     if (error) {
    //     return res
    //         .status(401)
    //         .send({ status: false, message: "invalid token" });
    //     }
    //     if (Date.now() > decoded.exp * 1000) {
    //     return res
    //         .status(401)
    //         .send({ status: false, message: "token expired" });
    //     }
    //     next();
    // }
    // );
// } catch (err) {
//   if(err.message=="jwt expired") return res.status(401).send({status:false,msg:" Your token is expired "})
//   return res.status(500).send({ status: false, msg: err.message })
// }
// };


const AuthenticationCheck= async function(req,res,next){
  try{
    let token= req.headers.authorization;
    if (!token) return res.send({ status: false, message: "token must be present" });
   let bearerToken = token.split(" ")[1]
  // let token req.headers.authorization= req.header.authorization.split(" ")[1];
   
   jwt.verify(bearerToken, "Project5-Group3",function (err, decodedToken) {
      if (err) {
           return res.status(401).send({ status: false, message: "invalid token" })
      } else {
          console.log(decodedToken)
          req.loggedInUserId = decodedToken.userId
          next()
      }
  })
  
}
catch(err){
  return res.status(500).send({status:false,message:err.message})
}
}


// const AuthorizationCheck = async function (req, res, next) {
//     try {
//       let token = req.headers.authorization.split(" ")[1]
//     let decoded= jwt.verify(token,secretKey)
//     const userId=req.params.userId
    
//     if (!userId) {
//       return res.status(400).send({ status: false, message: "UesrId is required" });
//     }
//     if (!mongoose.isValidObjectId(userId)) {
//       return res.status(400).send({ status: false, message: `${userId} is Invalid UserId` });
//     }
//     const uId = await userModel.findById({ _id:userId });
//     if (!uId) {
//       return res.status(404).send({ status: false, message: `no user found with this UserId ${userId}` });
//     }
  
  
//      if(decoded.userId!==userId){
//       return res.status(403).send({status:false,message:"Login User Is Not Authorized To perform This Task"})
//      } 
    
//     next();
        
//     } catch (error) {
//       return res.status(500).send({ status: false, error: error.message });
//     }
//   }
  
  // module.exports = { AuthorizationCheck };
  

module.exports.AuthenticationCheck=AuthenticationCheck
