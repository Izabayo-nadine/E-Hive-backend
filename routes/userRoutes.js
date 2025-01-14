const express=require('express');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const User=require('../models/userModel');
const auth=require('../middleWare/auth')
const { findById } = require('../models/product');


const router=express.Router();


router.post('/register',async(req,res)=>{
    let {username,email,password,role}=req.body;

    try{

    let user=await User.findOne({email});

    if(user){
       return res.status(400).json({message:'user already exist'});
    }

    user=new User({
        username,
        email,
        password,
        role
    })
await user.save();

res.status(201).json({message:'user registered successfully.'});

    }catch(error){
        res.status(500).json({message:error.message});
    }

});


router.post('/login',async(req,res)=>{
    
    const {email,password}=req.body;

    try{

    const user=await User.findOne({email})
    if(!user){
        return res.status(400).json({message:'user does not exists'})
    }
    
    const checkPassword=await bcrypt.compare(password,user.password)

    if(!checkPassword){
       return res.status(400).json({message:'invalid credentials'});
    }

    const token=jwt.sign({id:user._id,role:user.role},process.env.SECRET_KEY,{expiresIn:'1h'});
    res.json({token});

}catch(error){
    res.status(500).json({message:error.message})
}})


router.get('/profile',auth,async(req,res)=>{

    try{
        const user=await User.findById(req.user.id).select('-password')//this will exclude password.
        if(!user){
            return res.status(404).json({message:'user not found'});
        }
        res.json(user);

    }catch(error){
        res.status(500).json({message:error.message});
    }

})

module.exports=router;