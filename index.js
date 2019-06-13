const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const port = 3000;

<<<<<<< HEAD
=======

>>>>>>> 7b6f8196339f0e33609d160bbb159f440e561971
mongoose.connect("mongodb+srv://Razr7:batman123@cluster0-g0pwk.mongodb.net/test?retryWrites=true&w=majority",function(err){
    if(err){
        console.log(err);
    }
    else
    console.log("Atlas Connected");
})


//importing routes...........................................................
const placeRoutes = require('./routes/place');
const userRoutes = require('./routes/user');



//middlewares
app.use(bodyParser.json());

app.use('/place',placeRoutes);
app.use('/user',userRoutes);



//error handling
app.use(function(err,req,res,next){
    console.log(err);
    res.send({error:err}).status(400);
});




//server......................................................................

app.listen(port,function(){
    console.log(`Server listening on ${port}`)
}); 