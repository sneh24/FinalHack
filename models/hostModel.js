const mongoose = require('mongoose');
const hostSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    name : {type:String,required:true},
    email : {type:String,required:true,unique:true},
    password : {type:String,required:true},
    phoneno : {type:Number,required:true},
    Curevent : {type:Array,required:false},
    review:{type:Array,required:false}
})

module.exports = mongoose.model('Host',hostSchema);