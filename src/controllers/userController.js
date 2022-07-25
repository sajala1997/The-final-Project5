const userModel = require("../models/userModel");
const secretKey = "Project5-Group3";
const jwt = require("jsonwebtoken");
const validator = require("../validators/validator");

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

    if (!validator.isValid(email)) {
    return res
        .status(400)
        .send({ status: false, message: "email id is required" });
    }

    if (!validator.isValidEmail(email)) {
    return res
        .status(400)
        .send({ status: false, message: "Valid email id required" });
    }

    //Password validation

    if (!validator.isValid(password)) {
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
module.exports ={ createUser, loginUser };
