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
    totalQuantity:{
        type:Number,
        require:true,
    },
    items:[
        {productId:{type:mongoose.Schema.ObjectId,ref:'Product',require:true,unique:true}    // [{pid1,pqnt1},{pid2,pqnt2},{pid3,pqnt3},{pid4,pqnt4},v]
        ,quantity:{type : Number,require:true,min:1},_id:false}
    ],

    userId:{
           type:mongoose.Schema.ObjectId,
           ref:"User",
           unique:true,
           required:true,

    }
}
    ,{ timestamps: true });




    module.exports = mongoose.model('Cart',cartSchema);