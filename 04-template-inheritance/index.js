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

// register our custom helpers
// - ifEquals - 
// the callback function has three arguments:
// arg1, arg2 are the data from the hbs
hbs.handlebars.registerHelper('ifEquals', function(arg1, arg2, options){
    if (arg1==arg2) {
        options.fn(this);
    } else {
        options.inverse(this);
    }
})

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

app.get('/fruits', function(req,res){

    let dishes = [
        {
            'name':'Chicken rice',
            'calories': 700
        },
        {
            'name':'Roasted Duck rice',
            'calories': 800
        },
        {
            'name':'Wanton Mee',
            'calories': 650
        }
    ]

    res.render('fruits',{
        'fruits':['apples', 'oranges', 'pears','mangosteens'],
        'dishes':dishes,
        'favouriteDrink':'coke diet'
    })
})

app.listen(3000, function(){
    console.log('server started')
})

