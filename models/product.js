const mongoose = require('mongoose')

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
        required: true,
        min:0
    },
    imageUrl:{
        type:String,
    },
    categories:{
        type:String,

    },
    countInStore:{
        type:Number,
        required:true,
        // default:0,
        // min:0
    },
    sales:{
        type:Number,
        default:0
    }
},{
        timestamps:true
    });


module.exports=mongoose.model('Product',productSchema);