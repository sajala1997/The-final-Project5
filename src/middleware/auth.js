const jwt = require("jsonwebtoken");

const mongoose = require("mongoose")
const userModel = require("../models/userModel");

//--------------------Authneication-------------------

const AuthenticationCheck = async function (req, res, next) {
  try {
    let token = req.headers.authorization;
    if (!token) return res.send({ status: false, message: "token must be present" });
    let bearerToken = token.split(" ")[1]


    jwt.verify(bearerToken, "Project5-Group3", function (err, decodedToken) {
      if (err) {
        return res.status(401).send({ status: false, message: "invalid token" })
      } else {
        console.log(decodedToken)
        req.loggedInUserId = decodedToken.userId
        next()
      }
    })

  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}



module.exports.AuthenticationCheck = AuthenticationCheck
