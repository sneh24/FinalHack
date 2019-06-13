const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

//import local modules----------------------------------------------------------
const hostModel = require('../models/hostModel');


router.post('/register',function(req,res,next){
    const newHost = new hostModel({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,10),
        phoneno : req.body.phoneno
    })

   
    hostModel.find({email:req.body.email})
    .exec()
    .then(hosts=>{
        if(hosts.length>0){
            res.send("Account already exists").status(400);
        }
        else{
            newHost.save();
            res.send("Account created").status(201);
        }
    })
    .catch(next);
})



module.export = router;