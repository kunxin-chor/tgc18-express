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

    try {
        let url = BASE_API_URL + 'movies';
        let response = await axios.get(url);
        res.render('movies.hbs',{
            'movies': response.data
        })
    } catch(e){
        console.log(e);
        res.send("Error")
    }
   
})

// typical standard for the URL 
// <noun>/<verb>
app.get('/movies/create', function(req,res){
    res.render('create_movie')
})

// app.post('/movies/create', async function(req,res){
//     let movieTitle = req.body.movie_title;
//     let moviePlot = req.body.movie_plot;

//     await axios.post(BASE_API_URL + "movie/create",{
//         'title': movieTitle,
//         'plot':moviePlot
//     })
//     res.redirect('/movies');
// })

app.post('/movies/create', async function(req,res){
    let title = req.body.title;
    let plot = req.body.plot;
    await axios.post(BASE_API_URL  + "movie/create",{
        'title': title,
        'plot': plot
    })
    res.redirect('/movies');
})

app.listen(3000, function(){
    console.log("server started");
})