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
            req.flash('error_msg', 'Account Already Exists');
                res.redirect('/user/register');
        }
        else{
            newUser.save()
            .then(users => {
                req.flash('success_msg', 'Registration Successfull');
                res.redirect('/user/login');
            })
            .catch(next);
        }
    });

})

//Login Handle------------------------------------------------------------------------------------
router.post('/login', (req,res,next) => {
    passport.authenticate('user-local', {
        successRedirect: '/user/home',
        failueRedirect: '/user/login',
        failueFlash: true
    })(req,res,next);
});



//After Login page
router.get('/home',ensureAuthenticated, (req,res) => {
    eventModel.find({})
    .then((event)=>{
       // console.log(event);
        res.render('user_page',{events:event});
    })
    
})

//Logout Handle
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
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









//get the list of all user------------------------------------------------------------------
router.get('/alluser',function(req,res,next){
    userModel.find({})
    .exec()
    .then((user=>{
         res.send(user);
    
    }))
    .catch(next);
})




// router.get('/getevents',function(req,res,next){
//     eventModel.find()
//     .exec()
//     .then((event)=>{
//         if(event.length>0)
//         {
//             res.render('home',{date:date});
//         }
//         else{
//             res.send("No Events");
//         }
//     })
//     .catch(next)
// })





// router.get('/', function (req, res) {
//     productModel.find()
//         .select("name , cost")
//         .exec()
//         .then(products => {
//             res.json(products).status(200);
//         })
// })

module.exports = router;