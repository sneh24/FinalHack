const mongoose = require('mongoose');
const placeSchema = mongoose.Schema({
    _id : mongoose.Schema.Types.ObjectId,
    location : {type:String,required:true},
    sport : {type:String,required:true}

})

module.exports = mongoose.model('Place',placeSchema);