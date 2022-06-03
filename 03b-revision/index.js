const express = require('express'); 
// const variables will be reassigned to

const hbs = require('hbs');

// setup app
const app = express();

// setup express to use hbs
app.set('view engine', 'hbs')

// setup express to define where to find static files
app.use(express.static('public'));

// routes are defined before you start the server
app.get('/', function(req, res){
    res.render('index');
})

app.get('/hello/:name', function(req,res){
    let name = req.params.name;
    res.render('hello',{
        // the key is the variable name in the hbs file
        'name': name
    });
})


// start the server at port 3000
app.listen(3000, function(){
    console.log("Server started");
})