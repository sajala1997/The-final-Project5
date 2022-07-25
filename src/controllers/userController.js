
const userModel = require('../models/userModel')


const createUser = async (req, res) => {
    try {
        let finalDetails = req.body
        let files = req.files
       // let { fname, lname, email, password, phone } = data
        
        
       // const finalDetails = { fname, lname, email, profileImage, password, phone, address }
        let savedData = await userModel.create(finalDetails)
        return res.status(201).send({ status: true, msg: "user created successfully", data: savedData });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports.createUser=createUser