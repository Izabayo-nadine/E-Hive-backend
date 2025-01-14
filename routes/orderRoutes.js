const express=require('express');
const auth=require('../middleWare/auth')
const Order=require('../models/order');
const Product = require('../models/product');
const admin=require('../middleWare/admin');

const router=express.Router();

// place order.

router.post('/orders', auth, async(req,res)=>{
    const {products,totalprice}=req.body;

    try{
        const order=new Order({user:req.user.id,products,totalprice})

        //adjasting the levelof stoken after order is made

        for(const item of products){
            const product=await Product.findById(item.product)

            if(!product){
                return res.status(404).json({message:'product not found.'})
            }

            if(product.countInStore < item.quantity){
                return res.status(400).json({message:'there is no enough stock for ${item.product}'});
            }


            console.log(`Before update: ${product.name} - In Stock: ${product.countInStore}`);

            product.countInStore-=item.quantity;
            product.sales +=item.quantity; //increment sales count.

            
            console.log(`After update: ${product.name} - In Stock: ${product.countInStore}`);

            await product.save();//save changes to the product.
        }

        await order.save();
        res.status(201).json(order);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})


router.get('/orders',auth,async(req,res)=>{

try{
    const orders=await Order.find({user:req.user.id}).populate('products.product')
    if(!orders){
        return res.status(404).json({message:'order not found.'})
    }
    res.json(orders)
}catch(error){
    res.status(500).json({message:error.message});
}
})


router.put('/orders/:id',auth,admin,async(req,res)=>{

    try{
        const order=await Order.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true})
        if(!order)return res.status(404).json({message:'order not found'})
            res.json(order);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

 
module.exports=router;