const jwt = require("jsonwebtoken");
const secretKey = "Project5-Group3";

//--------------------Authneication-------------------

const AuthenticationCheck = async function (req, res, next) {
try {
    let token = req.headers["x-api-key"] || req.headers["X-api-key"];
    if (!token) {
    return res
        .status(401)
        .send({ status: false, message: "token must be present" });
    }
    jwt.verify(
    token,
    secretKey,
    { ignoreExpiration: true },
    function (error, decoded) {
        if (error) {
        return res
            .status(401)
            .send({ status: false, message: "invalid token" });
        }
        if (Date.now() > decoded.exp * 1000) {
        return res
            .status(401)
            .send({ status: false, message: "token expired" });
        }
        next();
    }
    );
} catch (error) {
    return res.status(500).send({ status: false, error: error.message });
}
};

//----------------------BodyValidation-----------------------------------------------------------//

const BodyValidation = function (req, res, next) {
try {
    if (Object.keys(req.body).length === 0) {
    return res
        .status(400)
        .send({ status: false, message: "body couldnot be empty" });
    }
    next();
} catch (error) {
    return res.status(500).send({ status: false, error: error.message });
}
};

module.exports = { AuthenticationCheck,BodyValidation };
