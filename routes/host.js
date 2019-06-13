const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

//import local modules----------------------------------------------------------
const hostModel = require('../models/hostModel');
const eventModel = require('../models/eventsModel');



//host register------------------------------------------------------------------
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



//host adding events ---------------------------------------------------------------
router.post('addevent/:hostid',function(req,res,next){
    const newEvent = new eventModel({
        _id : new mongoose.Types.ObjectId(),
        host: req.params.hostid,
        place: req.body.place,
        sport: req.body.sport,
        date:req.body.date,
        capacity:req.body.capacity,
        count:req.body.count
    })

    eventModel.find({date:req.body.date,place:req.body.place,sport:req.body.sport})
    .exec()
    .then((event)=>{
        if(event.length>0)
        {
            res.send("ON GIVEN DATE EVENT EXISTS").status(200);
        }
        else{
            newEvent.save()
            .then(()=>{
                res.send("event added");
            })
            .catch(next);

        }
    })
    .catch(next);
})


module.exports = router;