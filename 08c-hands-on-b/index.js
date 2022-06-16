const express = require("express");
const hbs = require("hbs");
const { ObjectId } = require("mongodb");
const wax = require("wax-on");
const MongoUtil = require("./MongoUtil.js");
require('dotenv').config();

const helpers = require('handlebars-helpers')({
  'handlebars': hbs.handlebars
})

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

  function getCheckboxValues(rawTags) {
    let tags = [];
    if (Array.isArray(rawTags)) {
      tags = rawTags;
    } else if (rawTags) {
      tags = [ rawTags ]
    }
    return tags;
  }

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

      let tags = [];
      if (Array.isArray(req.body.tags)) {
        tags = req.body.tags
      } else if (req.body.tags) {
        tags = [ req.body.tags ]
      }

      let newDocument = {
          'name': req.body.name,
          'age': req.body.age,
          'breed': req.body.breed,
          'problems': req.body.problems.split(','),
          'tags': tags,
          'hdb_approved': req.body.hdb_approved == 'true'
      }

      await db.collection(PETS).insertOne(newDocument);
      res.redirect('/')
  })

  app.get('/update/:id', async function(req,res){
    let id = req.params.id;
    let animal = await db.collection(PETS).findOne({
      '_id':ObjectId(id)
    })
    console.log(animal);
    res.render('edit-animal', {
      animal  // => 'animal':animal
    });
  })

  app.post('/update/:id', async function(req,res){
    let id = req.params.id;
    let updatedAnimal = {
      'name': req.body.name,
      'breed': req.body.breed,
      'age': req.body.age,
      'problems': req.body.problems.split(','),
      'hdb_approved': req.body.hdb_approved == 'true',
      'tags': getCheckboxValues(req.body.tags)
    }
    await db.collection(PETS).updateOne({
      '_id': ObjectId(id)
    }, {
      '$set': updatedAnimal
    })
    res.redirect('/')
  })

  app.listen(3000, function(){
    console.log("Server has started")
});

}

main();

