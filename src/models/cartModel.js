const mongoose = require('mongoose');
const ObjectId= mongoose.Schema.Types.ObjectId




const cartSchema = new mongoose.Schema( {
    totalPrice:{
        type:Number,
        require:true,
        comment:"Holds total price of all the items in the cart"

    },
    totalItems:{
        type:Number,
        require:true,
        comment:"Holds total number of items in the cart" 
    },
    items:[
        {productId:{type:ObjectId,ref:'Product',require:true,unique:true}
        ,quantity:{type : Number,require:true,min:1}}
    ],

    userId:{
           type:ObjectId,
           ref:"User",
           unique:true,
           required:true,

    }
}
    ,{ timestamps: true });




    module.exports.cartModel = mongoose.model('cartModel',cartSchema);