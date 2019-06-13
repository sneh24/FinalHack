const express = require('express')
const router = express.Router();

//import place model
const placeModel = require('../models/placeModel');

//get places
router.get('/',function(req,res,next){
    placeModel.find({})
    .exec()
    .then(place=>{
        res.send(place).status(200);
    })
    .catch(next);
})

//post new places
router.post('/',function(req,res,next){
    let newPlace = new placeModel({
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