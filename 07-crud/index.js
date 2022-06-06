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

app.get('/food_sighting/edit/:food_sighting_id', async function(req,res){
    // 1. we need to WHICH piece of data to edit hence we needs it unique identifier in the URL
    // and we extract it
    let foodSightingId = req.params.food_sighting_id;

    // 2. extract out the current values of that piece of data so that we can populate the form
    let response = await axios.get(BASE_API_URL + 'sighting/' + foodSightingId);
    let foodSighting = response.data;
    console.log(foodSighting.datetime);
    res.render('edit_food_form', {
        'description': foodSighting.description,
        'food': foodSighting.food,
        'datetime': foodSighting.datetime.slice(0,-1)
    })
})

app.post('/food_sighting/edit/:food_sighting_id', async function(req,res){
    // 1. extract out what the user sent through the form
    let description = req.body.description;
    let food = req.body.food.split(',');
    let datetime = req.body.datetime;
    
    // 2. extract out the id of the food sighting that we want to change
    let sightingId = req.params.food_sighting_id;

    // 3. create the payload for the request
    let payload = {
        'description': description,
        'food': food,
        'datetime': datetime
    }

    // 4. send the request
    let url = BASE_API_URL + 'sighting/' + sightingId;
    console.log("url ====================>", url);
    await axios.put(url, payload);

    res.redirect('/')

})

app.listen(3000, function(){
    console.log("server started");
})