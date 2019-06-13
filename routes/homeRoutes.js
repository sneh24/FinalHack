const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')


//import event modules
const eventModel = require('../models/eventModel');


//get request
router.get('/',function(req,res,next){
    eventModel.find({})
    .exec()
    .then((event)=>{
        res.render('home',{events:event});
    })
    .catch(next);
})

module.exports = router;