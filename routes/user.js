const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/authuser');
const stripe = require('stripe')('sk_test_09bnhJ5rGUDFeQjMmQ2c0QpD00fjpjHpbe');


const userModel = require('../models/userModel');
const eventModel = require('../models/eventsModel');
const hostModel = require('../models/hostModel');



//user register page---------------------------------------------------------------------
router.get('/register',function(req,res,next){
    res.render('register');
})


//user login page---------------------------------------------------------------------
router.get('/login',function(req,res,next){
    res.render('index');
})



//profile get----------------------------------------------------------------------------------

router.get('/profile',ensureAuthenticated,function(req,res,next){
    console.log(req.user);
    eventModel.find({})
    .then((event)=>{
        res.render('userProfile',{user:req.user,events:event});
    })
    .catch(next);
    
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
        failureRedirect: '/user/login',
        failureFlash: true
    })(req,res,next);
});



//After Login page.........................................................................
router.get('/home',ensureAuthenticated, (req,res) => {
    //console.log(req.user);
    eventModel.find({sport:req.user.sport})
    .then((event)=>{
        res.render('user_page',{events:event,user:req.user});
    })
    
})

//Logout Handle---------------------------------------------------------------------------------
router.get('/logout', (req,res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/user/login');
})



//get all events by sports----------------------------------------------------------------
router.get('/getevents/:sport',ensureAuthenticated,function(req,res,next){
    eventModel.find({sport:req.params.sport})
    .exec()
    .then((event)=>{
        res.render('user_page',{events:event,user:req.user});
    })
    .catch(next);
})


//get all events
router.get('/getevents/',ensureAuthenticated,function(req,res,next){
    eventModel.find({})
    .exec()
    .then((event)=>{
        res.render('user_page',{events:event,user:req.user});
    })
    .catch(next);
})





//update request after join----------------------------------------------------------------------
router.get('/updateJoinRequest/:eventid',ensureAuthenticated,function(req,res,next){
    console.log(req.user);
    eventModel.findByIdAndUpdate({_id:req.params.eventid},{ "$push": { "user": req.user._id }})
    .exec()
    .then(()=>{
        eventModel.findOne({_id:req.params.eventid})
        .then((event)=>{
            eventModel.findByIdAndUpdate({_id:req.params.eventid},{"count":(event.count+1)})
            .then(()=>{
                console.log("after 2nd update")
                eventModel.find({_id:req.params.eventid})
                .then((event)=>{
                    console.log(event);
                    console.log("pushing event to user");
                    console.log(event._id);
                    userModel.findByIdAndUpdate({_id:req.user._id},{"$push": { "Curevent": event._id }})
                    .then(()=>{
                        userModel.find({_id:req.user._id})
                        .then((updatedUser)=>{
                            console.log(updatedUser);
                            eventModel.find({})
                            .then((event)=>{
                                console.log("befoe=r user page")
                                console.log(event)
                                console.log(req.user)
                                res.render('user_page',{events:event,user:req.user});
                            })
                        })
                    })
                })
            })
        })
        
        // userModel.findByIdAndUpdate({_id:req.body.user._id},{"$push":{Curevent:eventModel.find({_id:req.params.eventid})}})
        // res.send("added");
    })
    .catch(next);
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




//on click join button on home user page-----------------------------------------------------------
router.get('/joinpage/:eventid',ensureAuthenticated,function(req,res,next){
     eventModel.find({_id:req.params.eventid})
     .then((event)=>
            res.render('join',{events:event})
 ) })
        
 
    

//post for payment button and redirect to success.ejs
router.post('/charge/:eventid',ensureAuthenticated,function(req,res){
    const amount=1500;
    stripe.customers.create({
        email:req.body.stripeEmail,
        source:req.body.stripeToken
    })
    .then(customer=>stripe.charges.create({
        amount,
        description:'Event Joining',
        currency:'usd',
        customer:customer.id
    }))
    .then((charge) =>{

        res.render('success',{eventid:req.params.eventid})
    } )
    // console.log(req.body)

})





//after successfull join------------------------------------------------------------------------







//go to post yourr review page--------------------------------------------------------------------
router.get('/review/:eventid',ensureAuthenticated,function(req,res,next){
    eventModel.findOne({_id:req.params.eventid})
    .then((event)=>{
        res.render('review',{event:event});
    })
    
})




//post the review inside host--------------------------------------------------------------------
router.post('/review/:eventid',ensureAuthenticated,function(req,res,next){
    eventModel.findOne({_id:req.params.eventid})
    .then((event)=>{
        hostModel.findByIdAndUpdate({_id:event.host},{"$push":{review:{
            userName:req.user.name,
            review:req.body.review
        }}})
        .then(()=>{
            hostModel.find({_id:event.host})
            .then((host)=>{
                eventModel.find({})
                .then((event)=>{
                    res.render('userProfile',{events:event,user:req.user});
                })
                
            })
        })
    })
})





/router.get('/acceptUnjoinRequest/:eventid',function(req,res,next){
    eventModel.findByIdAndUpdate({_id:req.params.eventid},{$pull:{user:req.user._id}})
    .then(()=>{

        eventModel.findOne({_id:req.params.eventid})
        .then((event)=>{
            console.log("after first update");
            console.log(event);
            console.log(event.count);
            eventModel.findByIdAndUpdate({_id:req.params.eventid},{"count":(event.count-1)})
            .exec()
            .then(()=>{
                console.log("after second update");
                eventModel.find({})
                .then((event)=>{
                    res.render('user_page',{events:event,user:req.user});
                })
            })

        })

    })
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