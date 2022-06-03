// require in dependencies
const express = require('express'); 
const hbs = require('hbs');
const waxOn = require('wax-on');

/* 1. SETUP EXPRESS */
const app = express();
app.set('view engine', 'hbs');
app.use(express.static('public')); // whenever express recieves a request for a static file
                                   // it will look for it in the public folder
waxOn.on(hbs.handlebars);
waxOn.setLayoutPath('views/layouts');

/* 2. ROUTES */
app.get('/', function(req,res){
    res.send("Hello World");
})

/* 3. START SERVER */
app.listen(3000, function(){
    console.log("server has been started");
})