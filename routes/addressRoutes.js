const express = require('express');
const Address = require('../models/address');
const auth = require('../middleWare/auth');


const router = express.Router();

// Add address
router.post('/address', auth, async (req, res) => {
    const { street, city, state, zipCode, country } = req.body;

    try {
        const address = new Address({ user: req.user.id, street, city, state, zipCode, country });
        await address.save();
        res.status(201).json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get addresses
router.get('/address', auth, async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user.id });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.put('/address/:id',auth,async (req,res)=>{
    try{
    const address= await Address.findByIdAndUpdate(req.params.id,req.body,{new:true})

    if(!address){
        return res.status(404).json({message:'no address found.'})
    }
res.json(address)
    }catch(error){
        res.status(500).json({message:error.message});
    }
})

router.delete('/address/:id',auth,async(req,res)=>{
    try{
        const address=await Address.findByIdAndDelete(req.params.id);

        if(!address){
            return res.status(404).json({message:'address not found'});
        }
        res.status(204).send();
    }catch(error){
        res.status(500).json({message:error.message})
    }

})

// Update and delete routes can be added similarly.
