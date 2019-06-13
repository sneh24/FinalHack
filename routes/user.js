const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth');

const userModel = require('../models/userModel');
const eventModel = require('../models/eventsModel');



//user register page---------------------------------------------------------------------
router.get('/register',function(req,res,next){
    res.render('register');
})


//user login page---------------------------------------------------------------------
router.get('/login',function(req,res,next){
    res.render('index');
})





//user homepage-----------------------------------------------------------------------------
router.get('/',function(req,res,next){
    res.send("user").status(200);
})

// router.get('/register',function(req,res,next){
//     res.render('Login_v6/register.ejs').status(200);

// })

router.get('/login',function(req,res,next){
    res.render('index').status(200);

})


//register-----------------------------------------------------------------------------------
router.post('/register',function(req,res,next){
    console.log(req.body);
    const newUser = new userModel({
        _id: new mongoose.Types.ObjectId(),
        name : req.body.name,
        email : req.body.email,
        password : bcrypt.hashSync(req.body.password,10),
        phoneno : req.body.phoneno,
        sport : req.body.sport
    })

   
    userModel.find({email:req.body.email},(err,users)=>{
        if(users.length>0){
            res.send("Account already exists").status(400);
        }
        else{
            newUser.save()
            .then(users => {
                
                res.redirect('/user/login');
            })
            .catch(next);
        }
    });

})

//Login Handle
router.post('/login', (req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/user/home',
        failueRedirect: '/user/login',
        failueFlash: true
    })(req,res,next);
});



//After Login page
router.get('/home',ensureAuthenticated, (req,res) => {
    res.render('user_page');
})

//Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/user/login');
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