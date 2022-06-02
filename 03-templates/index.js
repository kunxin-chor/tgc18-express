// 1. require in express
const express = require('express');

// 1b. require in hbs
const hbs = require('hbs');

// 2. create the express application
const app = express();

// 2b. tell Express that we want to use hbs as the template engine
app.set('view engine', 'hbs')

// 3. put in the routes
app.get('/', function(req,res){
    res.render("index.hbs")
})

app.get('/hello/:firstname/:lastname', function(req,res){
    let fname = req.params.firstname;
    let lname = req.params.lastname;
    // the second argument to render
    // allows us to pass variables
    // to the hbs file
    // the key is the variable in the hbs file
    // the value is the value for that variable
    res.render('hello', {
        'firstName': fname,
        'lastName': lname
    })
})

// 4. start server
app.listen(3000, function(){
    console.log("server started")
})