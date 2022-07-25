
const userModel = require('../models/userModel')
const {uploadFile}=require("../cloudComputing/aws")


const createUser = async (req, res) => {
    try {
        let finalDetails = req.body
        let files = req.files
       // let { fname, lname, email, password, phone } = data
        
       if(files && files.length>0){
        let uploadedFileURL= await uploadFile( files[0] )
        finalDetails["profileImage"]=uploadedFileURL
    }
    else{
        res.status(400).send({ msg: "No file found" })
    }
       // const finalDetails = { fname, lname, email, profileImage, password, phone, address }
        let savedData = await userModel.create(finalDetails)
        return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
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