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

// !IMPORTANT!
// setup express to process forms
app.use(express.urlencoded({
    'extended': false // use extended: true if you are processing object in objects in a form
}))

function processCheckbox(checkboxes) {
    let values = checkboxes;
    if (!values) {
        values = [];
    } else if (Array.isArray(values) == false)  {
        values = [values];
    }
    return values;
}

/* 2. ROUTES */
app.get('/', function(req,res){
    res.send("Hello World");
})

// the route below to display a form
app.get('/add-food', function(req,res){
    res.render('add')
})

app.post('/add-food', function(req,res){
    // the content of the form is in req.body
    console.log(req.body);
    let foodName = req.body.foodName;
    let calories = req.body.calories;
    let meal = req.body.meal;

    // if 2 or more checkboxes are checked, we just save it as it is
    // if only 1 checkbox, turn it in array with just that checkbox's value
    // if no checkboxes is checked, the it becomes an empty array
    // let tags = req.body.tags;

    // tags will be undefined if the user never selects any checkboxes
    // undefined is falsely value, !tags == !undefined == !false == true
    // if (!tags) {
    //     tags = [];
    // } else if (Array.isArray(tags) == false)  {
    //         tags = [tags]
        
    // }

    // tags = Array.isArray(tags) ? tags : tags ? [tags] : [];
    // tags = tags || [];
    // tags = Array.isArray(tags) ? tags : [tags];
    let tags = processCheckbox(req.body.tags);
    console.log("tags=", tags);
    res.render('result', {
        'foodName': foodName,
        'meal': meal,
        'calories': calories,
        'tags': tags
    })
})

/* 3. START SERVER */
app.listen(3000, function(){
    console.log("server has been started");
})