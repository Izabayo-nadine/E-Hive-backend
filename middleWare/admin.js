const authAdmin=(req, res, next)=>{
    console.log(req.user);
    if(req.user.role !== 'admin'){
       return res.status(403).json({message:'access denied.only admin is allowed'})
    }
    next();
};

module.exports=authAdmin;