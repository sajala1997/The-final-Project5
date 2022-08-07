
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
const isValidName = (name) => {
    if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) return true;
};
const isValidEmail = (email) => {
    if (/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email))
        return true
}

const passwordRegex = function checkPassword(password)
{
    var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;
   
    return re.test(password);
}

  const phoneRegex = (value) => {
    let mobileRegex = /^[6-9]\d{9}$/;
    let mobileRegex1 = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/
    if (mobileRegex1.test(value))
      return true;
  }

  const pincodeRegex = (value) => {
    return /^[1-9][0-9]{5}$/.test(value)
  }

  const priceRegex = (value) => {
    let priceRegex = /^\d{1,8}(?:\.\d{1,4})?$/;

    if (priceRegex.test(value))
      return true;
  }

  const isValidSize = (Size) => {
    let correctSize = ["S", "XS", "M", "X", "L", "XXL", "XL"]
    console.log(Size)
    return (correctSize.includes(Size))
}

const regex = /\d/;
const isVerifyNumber = function (number) {
    let   trimNumber=number.trim()
    return regex.test(trimNumber)
} 


module.exports = {isValid,isValidObjectId,isValidEmail,keyValue,phoneRegex,isValidName,passwordRegex,pincodeRegex, priceRegex,isValidSize,isVerifyNumber }
