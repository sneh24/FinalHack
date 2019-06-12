const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type:String,required:true},
    email : {type:String,required:true,unique:true},
    password : {type:String,required:true},
    phoneno : {type:Number,required:true},
    sport : {type:String,required:true},
    Curevent:{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : false
    }
})

module.exports = mongoose.model('User',userSchema);