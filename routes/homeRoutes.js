const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')


//import event modules
const eventModel = require('../models/eventsModel');
const userModel = require('../models/userModel');



// //get request
// router.get('/',function(req,res,next){
//     eventModel.find({})
//     .exec()
//     .then((event)=>{
//         res.render('home',{events:event});
//     })
//     .catch(next);
// })



router.get('/',function(req,res,next){
    userModel.find()
    .exec()
    .then((user)=>{
        if(user.length>0)
        {
           
            res.render('home',{user:user});
        }
        else{
            res.send("No Events");
        }
    })
    .catch(next)
})


module.exports = router;