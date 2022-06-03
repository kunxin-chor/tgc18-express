const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on'); // wax-on provides template inheritance for hbs

const app = express();
app.set('view engine', 'hbs');  // set the view engine to hbs
app.use(express.static('public')) // the public folder will hold our static files

// setup wax-on
waxOn.on(hbs.handlebars);
// tell wax-on where to find the base layouts (layouts=template)
waxOn.setLayoutPath('./views/layouts');

// begin routes here
app.get('/', function(req,res){
    res.render('index')
})

app.get('/about-us', function(req,res){
    res.render('about-us.hbs')
})

app.get('/contact-us', function(req,res){
    res.render('contact-us');
})

app.listen(3000, function(){
    console.log('server started')
})

