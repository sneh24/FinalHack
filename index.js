const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const ejs = require('ejs')

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
const userRoutes = require('./routes/user');
const homeRoutes = require('./routes/homeRoutes');
const hostRoutes = require('./routes/host');



//middlewares
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine','ejs')
app.set('views','./views')
app.use(express.static(__dirname+'/public'));




app.use('/homepage',homeRoutes);
app.use('/place',placeRoutes);
app.use('/user',userRoutes);
app.use('/host',hostRoutes);



//error handling
app.use(function(err,req,res,next){
    console.log(err);
    res.send({error:err}).status(400);
});




//server......................................................................

app.listen(port,function(){
    console.log(`Server listening on ${port}`)
}); 