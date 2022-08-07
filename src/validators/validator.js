// const mongoose = require("mongoose");

// const isValidName = (name) => {
//     if (/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name)) return true;
// };
// const isValidUserDetails = (UserDetails) => {
//     if (/^(?=.*?[a-zA-Z])[. %?a-zA-Z\d ]+$/.test(UserDetails)) return true;
// };

// const isValid = function (value) {
//     if (typeof value !== "string" || value === null) return false;
//     if (typeof value === "string" && value.trim().length === 0) return false;
//     return true;
// };

// const isValidMobile = (mobile) => {
//     if (/^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[6789]\d{9}$/.test(mobile))
//     return true;
// };

// const isValidEmail = (email) => {
//     if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return true;
// };

// const isValidPassword = (password) => {
//   if (/^(?!.* )(?=.*\d)(?=.*[a-z]).{8,15}$/.test(password)) return true;
// };

// const isValidObjectId = function (objectId) {
//   return mongoose.Types.ObjectId.isValid(objectId);
// };

// module.exports = {
//   isValidName,
//   isValid,
//   isValidEmail,
//   isValidMobile,
//   isValidPassword,
//   isValidObjectId,
//   isValidUserDetails,
// };


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
// const passwordRegex = (value) => {
//     let passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d]{8,15}$/;
//     if (passwordRegex.test(value))
//       return true;
//   }
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
  // const isValidSize= (value) => {
  //   let correctSize =["S", "XS","M","X", "L","XXL", "XL"]
  //   return (correctSize.includes(value))
  // }
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

  // const isValidAvailableSizes = (title) => {
  //   return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
  // };
  

module.exports = {isValid,isValidObjectId,isValidEmail,keyValue,phoneRegex,isValidName,passwordRegex,pincodeRegex, priceRegex,isValidSize,isVerifyNumber }
