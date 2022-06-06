const express = require('express');
const hbs = require('hbs');
const waxOn = require('wax-on');

// look-up table
const fruitPrices = {
    'apple': 3,
    'durian': 15,
    'orange': 6,
    'banana': 4
}

let app = express(); //create the express application
app.set('view engine', 'hbs'); // inform express that we are using hbs as the view engine
waxOn.on(hbs.handlebars); // enable wax-on for handlebars (for template inheritance)
waxOn.setLayoutPath('./views/layouts') // inform wax-on where to find the layouts

app.use(express.urlencoded({
    'extended':false // for processing HTML forms usually it's false because
                     // HTML forms are usually quite simple
}))

// routes
app.get('/', function(req,res){
    // req is request from the client. All the data from the client are inside req
    // res is for us to send back to the client
    res.send('hello world');

    // you must ensure that the function will eventually at least one res.send
    // only one res.send can be executed 
    // the following functions are considered to be variants of res.send:
    // res.render(), res.json(), res.status() and res.send()
    // all send back response, only one of them can be executed per function
    // take note: res.send or res.josn etc is not a return (i.e does not end the function)
})

// one route to display the form
app.get('/fruits', function(req,res){
    res.render('fruit-form');
})

app.post('/fruits', function(req,res){
    // res.send(req.body); // send the body of the form back to the client for visual inspection
    
    // state variable -- it represents the answer to a problem
    let fruits = [];

    // if req.body.items is already an array no further processing
    if (Array.isArray(req.body.items)) {
        fruits = req.body.items;
    } else {
        // if req.body.items is a single item then covert it an array consisting of just that item
        if (req.body.items) {
            fruits = [ req.body.items]
        } else {
               // if req.body.items is undefined (or otherwise falsely) then the result is an empty array
            fruits = []; // <-- reduduant, can be removed since we already default fruits to be an empty array
        }    
    }

    let total = 0;
    // for (let eachFruit of fruits) {
    //     switch(eachFruit) {
    //         case 'apple':
    //             total += 3
    //             breakl
    //         case 'durian':
    //             total += 15;
    //             break;
    //         case 'orange':
    //             total += 6
    //             break;
    //         case 'banana':
    //             total += 4;
    //             break;
    //     }
    // }

    for (let eachFruit of fruits ) {
        let price = fruitPrices[eachFruit];
        total += price;
    }

    res.render('total',{
        'total': total
    })

 
})

app.listen(3000, function(){
    console.log("server started");
})