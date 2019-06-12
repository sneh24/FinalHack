const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//import place model
const placeModel = require('../models/placeModel');

//get places
router.get('/',function(req,res,next){
    res.send("place").status(200);
})

//post new places
router.post('/',function(req,res,next){
    const newPlace = new placeModel({
        _id: new mongoose.Types.ObjectId(),
        location : req.body.location,
        sport : req.body.sport
    })

    newPlace.save()
   
    .then((place)=>{
        res.send(place)
    })
    .catch(next);


})







module.exports = router;