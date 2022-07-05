const express = require('express');
require('dotenv').config();  // for .env file (to load the variables of the .env file into the OS)
const MongoUtil = require('./MongoUtil'); // require in the MongoUtil.js file (it's the same directory as our index.js)
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
const app = express();


// ENABLE CROSS SITE ORIGIN RESOURCES SHARING
app.use(cors());

// RESTFUL API expects data sent to the endpoint
// should be in JSON format, we need tell Express
// to configure all recieved data to be converted to JSON
app.use(express.json());

const dummyMiddleware = function(req,res,next) {
    req.date = new Date();
    next();
}

function checkIfAuthenticated(req,res,next) {
    let authorizationHeaders = req.headers.authorization;
    if (!authorizationHeaders) {
        res.sendStatus(401);
        return;
    }
    // get the token
    let token = authorizationHeaders.split(" ")[1];
    
    // verify the token with the token secret
    // after the verification, the token data will be passed to
    // the function specified in the third argument
    jwt.verify(token, process.env.TOKEN_SECRET, function(err,tokenData){
        // if there is error (err will be null or undefined if there are no error)
        if (err) {
            res.sendStatus(401); // res.status() + res.send()
            return;
        } else {
            req.user = tokenData;
            next();
        }
    })

}

async function main() {

    const db = await MongoUtil.connect(MONGO_URI, "tgc18_food_sightings_jwt");
    console.log("Connected to database");
    app.get('/', function(req, res){
        console.log("hello world");
        res.send("hello world")
    })

    // POST route cannot be tested via the browser
    // To protect this route (deny it to unauthorized user), we have
    // to provide a way for the accessToken (i.e, the JWT) to be provided
    app.post('/food_sightings', async function(req,res){

        // check if there is an authorization header
        let authorizationHeaders = req.headers.authorization;
        if (!authorizationHeaders) {
            res.sendStatus(401);
            return;
        }
        // get the token
        let token = authorizationHeaders.split(" ")[1];
        
        // verify the token with the token secret
        // after the verification, the token data will be passed to
        // the function specified in the third argument
        jwt.verify(token, process.env.TOKEN_SECRET, function(err,tokenData){
            // if there is error (err will be null or undefined if there are no error)
            if (err) {
                res.sendStatus(401); // res.status() + res.send()
                return;
            } else {
                req.user = tokenData;
            }
        })
 

        // TODO: validation (as an execrise for the student)
        let description = req.body.description;
        let food = req.body.food;
        // when new Date() is called without an argument, then automatically
        // it will be the server's date and time
        let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();
        let result = await db.collection('sightings').insertOne({
            'description': description,
            'food': food,
            'datetime': datetime,
            'owner': ObjectId(req.user.user_id)
        })
        res.status(201); // set the status code to be 201
        res.send(result);
    })

    app.get('/food_sightings/:id', async function(req,res){
        res.json(await db.collection('sightings').findOne({
            '_id': ObjectId(req.params.id)
        }))
    })

    app.get('/food_sightings', async function(req,res){
        // base query: the query that will get ALL the documents
        let criteria = {};

        if (req.query.description) {
            // {
            // "description": ....    
            //}
            // add the `description` key to the criteria object
            criteria['description'] = {
                '$regex': req.query.description, '$options':'i'
            }
        }

        if (req.query.food) {
            criteria['food'] = {
                '$in': [req.query.food]
            }
        }

        let results = await db.collection('sightings').find(criteria);
        res.status(200);
        // ! toArray() is async
        res.send(await results.toArray());
    } )

    // update
    // patch vs. put (most of the time we will use put)
    app.put('/food_sightings/:id', async function(req,res){
        let description = req.body.description;
        let food = req.body.food;
        let datetime = req.body.date ? new Date(req.body.date) : new Date();
        let results = await db.collection('sightings').updateOne({
            '_id': ObjectId(req.params.id)
        },{
            '$set':{
                'description': description,
                'food': food,
                'datetime': datetime
            }
        });
        res.status(200);
        res.json(results);
    })
    
    // delete
    app.delete('/food_sightings/:id', async function(req,res){
        let results = await db.collection('sightings').deleteOne({
            '_id': ObjectId
        });
        res.status(200);
        res.json({
            'status':'Ok'
        })
    })

    // user signup
    // for user signup, we need the user email and user password
    // POST => creating
    // If the endpoint is `POST /users` ==> creating new users
    // We assume req.body contains `password` and `email`
    app.post('/users', async function(req,res){
        let newUser = {
            'email': req.body.email,
            'password': req.body.password
        }
        await db.collection('users').insertOne(newUser);
        res.status(201);
        res.json({
            'message': "New user created successfully!"
        })
    })

    // RESTFUL API -- the URL suggest dealing with a resource ("piece of data")
    // when the user login, the client must pass us the password and email
    app.post('/login', async function(req,res){
        // attempt to find a doucment with the same password and email given
        let user = await db.collection('users').findOne({
            'email': req.body.email,
            'password': req.body.password
        })
        // only if user is not undefined or not null
        if (user) {
            // the token can store data
            let token = jwt.sign({
                'email': req.body.email,
                'user_id': user._id
            }, process.env.TOKEN_SECRET, {
                'expiresIn':'15m'   // m for minutes, h for hours, w for weeks, d for days
            });
            res.json({
                'accessToken': token
            })
        } else {
            res.status(401);
            res.json({
                'message':"Invalid email or password"
            })
        }
    } )
} 
main();


app.listen(3000, function(){
    console.log("Server has started")
})