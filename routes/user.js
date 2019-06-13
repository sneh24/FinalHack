const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userModel = require('../models/userModel');
const eventModel = require('../models/eventsModel');


//user homepage-----------------------------------------------------------------------------
router.get('/',function(req,res,next){
    res.send("user").status(200);
})


//register-----------------------------------------------------------------------------------
router.post('/register',function(req,res,next){
    const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,10),
        phoneno : req.body.phoneno,
        sport : req.body.sport
    })

   
    userModel.find({email:req.body.email})
    .exec()
    .then(users=>{
        if(users.length>0){
            res.send("Account already exists").status(400);
        }
        else{
            newUser.save();
            res.send("Account created").status(201);
        }
    })

})


router.get('/getevents/:sport',function(req,res,next){
    eventModel.find({sport:req.params.sport})
    .exec()
    .then((event)=>{
        if(event.length>0)
        {
            res.send(event);
        }
        else{
            res.send("No Events");
        }
    })
    .catch(next)
})

module.exports = router;