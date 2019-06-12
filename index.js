const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const port = 3000;


mongoose.connect("mongodb+srv://Razr7:batman123@cluster0-g0pwk.mongodb.net/test?retryWrites=true&w=majority",function(err){
    if(err){
        console.log(err);
    }
    else
    console.log("Atlas Connected");
})


//importing routes...........................................................
const placeRoutes = require('./routes/place');



//middlewares
app.use(bodyParser.json());

app.use('/place',placeRoutes);




//server......................................................................

app.listen(port,function(){
    console.log(`Server listening on ${port}`)
}); 