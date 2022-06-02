// we need to use Express for this, we are going to include
// nodejs will look for the `express` folder into `node_modules`
// and locate the `index.js` there. The `index.js` will return an object
// and will be stored into `const express`
const express = require('express');

// create an express application
let app = express(); 

// add routes
// a route is a URL on our server
// first argument: path of the url
// second argumnet: a function that happens when a client tries to access the path
app.get('/', function(req, res){
    // first argument -- the request from the client
    // second argument -- the response which we are going to send back
    res.send("<h1>Hello World</h1>");
})

app.get('/about-us', function(req,res){
    res.send("<h1>About Us</h1><p>About our company</p>");
})

// any words or sequence of characters that : in front
// is a parameter or arugment
app.get('/hello/:firstname', function(req,res){
    // res.send() can back a string or an integer
    // but if it is an integer it must be a HTTP status code
    // eg. 200, 404, 500
    res.send("Hi," + req.params.firstname);

})

// we expect the URL to have two parameters in the query string,
// which will be a and b
// eg. /calculate?a=3&b=4
app.get('/calculate', function(req,res){
    // all query string parameters will be in the query object
    let a = parseInt(req.query.a);
    let b = parseInt(req.query.b);
    let sum = a + b;
    res.send("sum =" + sum);
})

// start the server
// first arg: port number
app.listen(3000, function(){
    console.log("server started");
})