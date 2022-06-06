const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');
const axios = require('axios')

let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
waxOn.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
waxOn.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts
app.use(express.static('public'));

app.use(express.urlencoded({
    'extended':false // for processing HTML forms usually it's false because
                     // HTML forms are usually quite simple
}))

const BASE_API_URL = "https://ckx-movies-api.herokuapp.com/"

// routes
app.get('/', function(req,res){
    res.send("hello world")
})

app.get('/movies', async function(req,res){
    let url = BASE_API_URL + 'movies';
    let response = await axios.get(url);
    res.render('movies.hbs',{
        'movies': response.data
    })
})

app.listen(3000, function(){
    console.log("server started");
})