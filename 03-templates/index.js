// 1. require in express
const express = require('express')

// 2. create the express application
const app = express();

// 3. put in the routes
app.get('/', function(req,res){
    res.send("hello world")
})

// 4. start server
app.listen(3000, function(){
    console.log("server started")
})