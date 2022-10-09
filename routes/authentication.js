const express=require('express');
const router=express.Router();
const { body, validationResult } = require('express-validator');
const User=require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

require('../middleware/passports')(passport);

const JWT_SECRET="shashwat!"

router.post('/newuser',[
    body('email','Enter a valid email').isEmail(),
    body('password','Password cannot be blank').exists(),
    body('name','Name cannot be blank').exists(),
    body('phone','Enter a valid phone number').isLength({ min: 10, max:10}),
],async (req,res) => {
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors : errors.array()});
    }

    try{
        let user = await User.findOne({email : req.body.email});
        if(user){
            return res.status(400).json({success,error : "Sorry!! User already exists"})
        }

        const salt = bcrypt.genSaltSync(11);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        user = await User.create({
            name : req.body.name,
            email : req.body.email,
            password : hashedPassword,
            phone : req.body.phone
        }) 

        const authToken = jwt.sign({user},JWT_SECRET);
        success = true
        res.json({success,authToken}); 
    }

    catch(error){
        res.status(500).send('Internal Server Error');
    }
})

router.post('/login',[],async(req,res) =>{
    let success = false;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({success,errors : errors.array()});
    }

    const {email,password} = req.body;
    try{
        let user = await User.findOne({email});
        console.log(user);
        if(!user){
            return res.status(400).json({success,error : "Please login with correct credentials"});
        }

        const passwordCompare = await bcrypt.compare(password,user.password);
        if(!passwordCompare){
            return res.status(400).json({success,error : "Please login with correct credentials"});
        }

        success = true;
        const authToken = jwt.sign({user},JWT_SECRET);
        res.json({success,authToken});

    }

    catch(error){
        res.status(500).send("Internal Server Error");
    }
})

router.post('/user',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    return res.status(200).json({success: true,message: "Good deed!"});
})

module.exports = router;

