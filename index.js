const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express() 
const ejs = require('ejs')
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');


const port = 3000;

require('./config/passport')(passport);


const db = require('./config/keys').MongoURI;

mongoose.connect(db,{ useNewUrlParser: true })
    .then(() => console.log('Atlas Connected'))
    .catch(err => console.log(err))



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
app.use(flash());

//Express session middleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

//Global Vars
// app.use((req,res,next) => {
//     res.locals.success_msg = req.flash('success_msg');
//     res.locals.error_msg = req.flash('error_msg');
// })


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