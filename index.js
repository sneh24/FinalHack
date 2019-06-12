const express = require('express')
const parser = require('body-parser')
const mongoose = require('mongoose')
const app = express()

const port = 3000;

app.listen(port,function(){
    console.log(`Server listening on ${port}`)
}); 