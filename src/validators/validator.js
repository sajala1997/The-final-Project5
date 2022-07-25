
const mongoose = require("mongoose");


const isValidObjectId = function (objectId) {
  return mongoose.Types.ObjectId.isValid(objectId);
};

const keyValue = (value) => {
    if (Object.keys(value).length === 0) return false;
    return true;
  };
const isValid = (value) => {
    if (typeof value === "undefined" || value === null) return false
    if (typeof value === "string" && value.trim().length === 0) return false
    return true

}
const isValidEmail = (email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
        return true
}
const passwordRegex = (value) => {
    let passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,15}$/;
    if (passwordRegex.test(value))
      return true;
  }
  const phoneRegex = (value) => {
    let mobileRegex = /^[6-9]\d{9}$/;
    if (mobileRegex.test(value))
      return true;
  }

module.exports = {isValid,isValidObjectId,isValidEmail,keyValue,passwordRegex,phoneRegex}
