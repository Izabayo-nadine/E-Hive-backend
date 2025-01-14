const mongoose=require('mongoose');

const orderSchema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        require:true

    },
    products:[{
        product:{type: mongoose.Schema.Types.ObjectId,ref:'Product',required:true},
        quantity:{type:Number,required:true}
 }],
 totalprice:{type:Number,required:true},
 status:{type:String,enum:['pending','shipped','delivered'],default:'pending'} //other types are shipped,completed 
},{timestamps:true})


module.exports=mongoose.model('Order',orderSchema);