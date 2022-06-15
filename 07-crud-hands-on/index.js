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
app.get('/movies/details/:movie_id', function(req,res){
    res.send("get movie detail")
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

// the url in the first argument is for the browser/client interacting with our express
app.get('/movies/edit/:movie_id', async function(req,res){
    let movieId = req.params.movie_id;
    // use axios.get to communicate with the API
    // we follow the rules of the API for this part
    let response = await axios.get(BASE_API_URL + 'movie/' + movieId);
    let movie = response.data;
    res.render('edit_movie',{
        'movieData':movie
    });
})

app.post('/movies/edit/:movie_id', async function(req,res){
    let movieId = req.params.movie_id;
    let newTitle = req.body.title;
    let newPlot = req.body.plot;
    await axios.patch(BASE_API_URL + '/movie/' + movieId,{
        'title': newTitle,
        'plot': newPlot
    })
    res.redirect('/movies')

})

app.get('/movies/delete/:movie_id', async function(req,res){
    let movieId = req.params.movie_id;
    let response = await axios.get(BASE_API_URL + 'movie/' + movieId);
    res.render('confirm_delete',{
        'movie': response.data
    })
})

app.post('/movies/delete/:movie_id', async function(req,res){
    let movieId = req.params.movie_id;
    await axios.delete(BASE_API_URL + 'movie/' + movieId);
    res.redirect('/movies')
})

app.listen(3000, function(){
    console.log("server started");
})