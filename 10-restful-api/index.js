const express = require('express');
require('dotenv').config();  // for .env file (to load the variables of the .env file into the OS)
const MongoUtil = require('./MongoUtil'); // require in the MongoUtil.js file (it's the same directory as our index.js)
const MONGO_URI = process.env.MONGO_URI;
const cors = require('cors');
const { ObjectId } = require('mongodb');
const app = express();


// ENABLE CROSS SITE ORIGIN RESOURCES SHARING
app.use(cors());

// RESTFUL API expects data sent to the endpoint
// should be in JSON format, we need tell Express
// to configure all recieved data to be converted to JSON
app.use(express.json());

async function main() {

    const db = await MongoUtil.connect(MONGO_URI, "tgc18_food_sightings");
    console.log("Connected to database");
    app.get('/', function(req, res){
        res.send("hello world")
    })

    // POST route cannot be tested via the browser
    app.post('/food_sightings', async function(req,res){
        // TODO: validation (as an execrise for the student)
        let description = req.body.description;
        let food = req.body.food;
        // when new Date() is called without an argument, then automatically
        // it will be the server's date and time
        let datetime = req.body.datetime ? new Date(req.body.datetime) : new Date();
        let result = await db.collection('sightings').insertOne({
            'description': description,
            'food': food,
            'datetime': datetime
        })
        res.status(201); // set the status code to be 201
        res.send(result);
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
            '_id': ObjectId(req.params.id)
        });
        res.status(200);
        res.json({
            'status':'Ok'
        })
    })
} 
main();


app.listen(3000, function(){
    console.log("Server has started")
})