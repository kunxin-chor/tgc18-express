const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
// require('mongodb') will return a Mongo object
// the Mongo client contains many other objects (aka properties)
// but we are only interested in the MongoClient
// hence put `.MongoClient` at the back of the require
const MongoClient = require('mongodb').MongoClient;

// dotenv
// a dotenv files also to create variables
// when we run config on the dotenv, all variables defined in the .env file
// are transfered to the environment
const dotenv = require('dotenv').config();

// process is a NodeJS object automatically available to all NodeJs programs
// BE SURE NOT TO NAME ANY VARIABLES AS `process`
// the process variable refers to the current NodeJS that is running
// .env is the environment -- it is where the operating system stores its variables
console.log(process.env);


const app = express();
app.set('view engine', 'hbs'); // tell express we are using hbs as the view engine
wax.on(hbs.handlebars);  // setup template inheritance
wax.setLayoutPath('./views/layouts');

const MONGO_URI = process.env.MONGO_URI;

async function main() {
    // need to the Mongo Database using the MongoClient
    // the MongoClient.connect function takes in two arguments:
    // 1) the connection string
    // 2) an options object
    const client = await MongoClient.connect(MONGO_URI, {
        "useUnifiedTopology": true // there were different versions of Mongo
                                  // when this is true we don't have to care about those versions
    })

    const db = client.db('sample_airbnb');

    app.get('/test', async function(req,res) {
        // we use the .toArray() to convert the results to an array of JavaScript objects
        let data = await db.collection('listingsAndReviews').find({}).limit(10).toArray();
        res.send(data);
    });

    app.get('/', function (req, res) {
        res.render('hello.hbs')
    })
}
main();


app.listen(3000, function () {
    console.log("hello world");
})