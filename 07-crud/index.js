const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
const axios = require('axios'); // for access to RESTful API

let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
waxOn.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
waxOn.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts

app.use(express.urlencoded({
    'extended':false // for processing HTML forms usually it's false because
                     // HTML forms are usually quite simple
}))

const BASE_API_URL = 'https://ckx-restful-api.herokuapp.com/';

// routes
app.get('/', async function(req,res){
    let response = await axios.get(BASE_API_URL + 'sightings');
    res.render('sightings',{
        'foodSightings': response.data
    })
})

// show the create food sighting form
app.get('/food_sighting/create', function(req,res){
    res.render('food_form');
})

app.post('/food_sighting/create', async function(req,res){
    let data = {
        'description': req.body.description,
        'food': req.body.food.split(','),
        'datetime': req.body.datetime
    }
    await axios.post(BASE_API_URL + "sighting", data);
    res.redirect('/');
})

app.listen(3000, function(){
    console.log("server started");
})