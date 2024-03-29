const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/authhost');

//import local modules----------------------------------------------------------
const hostModel = require('../models/hostModel');
const eventModel = require('../models/eventsModel');

//host login--------------------------------------------------------------------
router.get('/login',function(req,res,next){
    res.render('loginHost');
})




//host login-----------------------------------------------------------------------
router.get('/login',function(req,res,next){
    res.render('loginHost');
})

//host register-----------------------------------------------------------------------
router.get('/register',function(req,res,next){
    res.render('hostRegister');
})

router.get('/profile',ensureAuthenticated,function(req,res,next){
    console.log(req.user);
    res.render('hostProfile',{host:req.user});
})





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
            req.flash('error_msg', 'Account Already Exists');
                res.redirect('/host/register');
        }
        else{
            newHost.save()
            .then(hosts => {
                
                res.redirect('/host/login');
            })
            .catch(next);
        }
    })
    .catch(next);
})

//Login Handle
router.post('/login', (req,res,next) => {
    passport.authenticate('host-local', {
        successRedirect: '/host/home',
        failureRedirect: '/host/login',
        failureFlash: true
    })(req,res,next);
});


//After Login page
router.get('/home',ensureAuthenticated, (req,res) => {
    // console.log(req.user)
    eventModel.find({})
    .then((event)=>{
        //console.log(event);
        res.render('host_page',{host:req.host,events:event}).status(200);
    })
    
})

router.get('/home/event',ensureAuthenticated, (req,res) => {

    res.render('new_event',{host:req.user});
})

//Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/host/login');
})

//host adding events ---------------------------------------------------------------
router.post('/addevent/:hostid',ensureAuthenticated,function(req,res,next){
    console.log(req.body);
    console.log("in post")
    const newEvent = new eventModel({
        _id : new mongoose.Types.ObjectId(),
        host: req.params.hostid,
        place: req.body.place,
        sport: req.body.sport,
        date:req.body.date,
        capacity:req.body.capacity,
        count: 0,
        status: true
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
            // .exec()
            .then((newEvent)=>{
                console.log(newEvent);
                console.log("saved new event")
                hostModel.find({_id:newEvent.host})
                .exec()
                .then((host)=>{

                    console.log(host);
                    console.log("found host");
                    console.log(host.id);
                    console.log(req.params.hostid)

                    hostModel.findByIdAndUpdate({_id:req.params.hostid},{ "$push": { "Curevent": newEvent._id }})
                    .then(()=>{
                        console.log("inside host");
                        hostModel.findOne({_id:req.params.hostid})
                        .exec()
                        .then((host1)=>{
                            eventModel.find({})
                            .then((event)=>{
                                //console.log(event);
                                res.render('host_page',{events:event}).status(200);
                            })
                            
                        })
                    })
                })
            })
            .catch(next);

        }
    })
    .catch(next);
})





//get the list of all host------------------------------------------------------------------
router.get('/allhost',ensureAuthenticated,function(req,res,next){
    hostModel.find({})
    .exec()
    .then((host=>{
         res.send(host);
    
    }))
    .catch(next);
})













module.exports = router;