const mongoose = require('mongoose');
const eventSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    host :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Host',
        required : true
    },
    place :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Place',
        required : true
    },
    date : {type:Date,required:true},
    user : {type:Array,required:false},
    capacity : {type:Number,required:true},
    count : {type:Number,required:true}
})

module.exports = mongoose.model('Event',eventSchema);