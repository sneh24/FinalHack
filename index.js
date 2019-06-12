const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const port = 3000;




//importing routes...........................................................
const placeRoutes = require('./routes/place');



//middlewares
app.use(bodyParser.json());

app.use('/place',placeRoutes);




//server......................................................................

app.listen(port,function(){
    console.log(`Server listening on ${port}`)
}); 