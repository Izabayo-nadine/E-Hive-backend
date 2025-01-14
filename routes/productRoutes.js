const express=require('express');
const Product=require('../models/product');
const auth=require('../middleWare/auth')
const admin=require('../middleWare/admin');
const Review=require('../models/review');
const router=express.Router();
router.get('/products',async(req,res)=>{

    try{
        const products=await Product.find();
        res.json(products);
    }catch(error){
        res.status(500).json({message:error.message});
    }
})



router.post('/product',auth,admin,async(req,res)=>{
    const {name,description,price,categories,imageUrl,countInStore}=req.body;
try{
  const newProduct=new Product({
    name,
    description,
    price,
    imageUrl,
    categories,
    countInStore
  })
  const savedProduct=await newProduct.save();
  res.status(201).json(savedProduct);
}catch(error){
    res.status(500).json({message:error.message});
}
});


router.get('/product/:id',async(req,res)=>{
    try{
    const product=await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({error:'product not found'});
    }
    res.json(product);
}catch{
    res.status(500).json({error:'internal server error.'});
}
})



router.put('/product/:id/',auth,admin,async(req,res)=>{
    try{
        const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
if(!product){
   return res.status(404).json({error: 'product not found'})
}
res.json(product);
    }catch(error){
        res.status(500).json({error:'internal server error.'});
    }

})

router.put('/products/:id/stock', auth, admin, async (req, res) => {
    const { countInStore } = req.body;

    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.countInStore = countInStore;  // Update stock
        await product.save();
        res.json({ message: 'Stock updated', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.delete('/product/:id',auth,admin,async(req,res)=>{
    try{
        const product=await Product.findByIdAndDelete(req.params.id);
        if(!product){
            return res.status(404).json({error:'product not found'})
        }
        res.status(204).send();
    }catch{
        res.status(500).json({error:'internal server error'});
    }
})


router.post('/product/:id/review',auth, async(req,res)=>{
    const{rating,comment}=req.body;
    const productId=req.params.id;
    try{
        const review=new Review({
            user:req.user.id,
            product:productId,
            rating,
            comment
        });
        await review.save()
        res.status(201).json({message:'Review added successfully.'});
    }catch(error){
        res.status(500).json({message:error.message});
    }
})


router.get('/product/:id/reviews',auth,async (req,res) => {

    try{
        const reviews=await Review.find({product:req.params.id}).populate('user', 'username')
            res.json(reviews)
    }catch(error){
        res.status(500).json({message:error.message})
    }
})

router.get('product/search',async(req,res)=>{
    const {query}=req.query;
    try{
        const search=await Product.find({name:{$regex:query, $option:'i'} })
        res.json(search);
    }catch(error){
        res.status(500).json({message:error.message})
    }
})
module.exports=router;
