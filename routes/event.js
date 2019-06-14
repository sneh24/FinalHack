const express = require('express')
const router = express.Router()
const Event = require('../models/eventsModel') 
router.get('/',function(req,res,next){
    Event.find({})
    .then((event)=>{
        res.send(event)
    })
    .catch(next);
})


module.exports = router;