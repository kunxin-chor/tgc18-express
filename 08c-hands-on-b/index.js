const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");
require('dotenv').config();

// use constants to store magic strings 
const DATABASE = "tgc18-animal-shelter";
const PETS = "pets";


async function main() {
  /* 1. SETUP EXPRESS */
  let app = express();

  // 1B. SETUP VIEW ENGINE
  app.set("view engine", "hbs");

  // 1C. SETUP STATIC FOLDER
  app.use(express.static("public"));

  // 1D. SETUP WAX ON (FOR TEMPLATE INHERITANCE)
  wax.on(hbs.handlebars);
  wax.setLayoutPath("./views/layouts");

  // 1E. ENABLE FORMS
  app.use(express.urlencoded({ extended: false }));

  const db = await MongoUtil.connect(process.env.MONGO_URI, DATABASE);
  console.log("connected to DB");
  
  app.get('/', async function(req,res){
      let pets = await db.collection(PETS).find({}).toArray();
      res.render('all-pets',{
        // if the key name is the same as the variable name, we can just have the variable name    
        //pets
        'pets': pets
      })
  })

  app.get('/create', async function(req,res){
      res.render('add-animal.hbs');
  })

  app.post('/create', async function(req,res){
      let newDocument = {
          'name': req.body.name,
          'age': req.body.age,
          'breed': req.body.breed,
          'problems': req.body.problems.split(','),
          'tags': req.body.tags.split(',')
      }

      await db.collection(PETS).insertOne(newDocument);
      res.redirect('/')
  })

  app.listen(3000, function(){
    console.log("Server has started")
});

}

main();

