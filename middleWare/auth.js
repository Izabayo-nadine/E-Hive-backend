const jwt=require('jsonwebtoken');
const User=require('../models/userModel')

const auth=async(req,res,next)=>{

    const token=req.header('Authorization');
    res.cookie('auth-token',token,{httpOnly:true,secure:true})

    if(!token){
        return res.status(401).json({message:'access denied, no token provided.'})
    }
        try{
    const decoded=jwt.verify(token,process.env.SECRET_KEY);
    const user=await User.findById(decoded.id)
     req.user={id: decoded.id,role: user.role}       
console.log(req.user)
    next();


    }catch(error){
    res.status(400).json({message:'invalid token'})
}
}

module.exports=auth;