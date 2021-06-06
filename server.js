// modules =================================================
const express = require('express');
const app = express();
const mongoose = require('mongoose');

// set our port
const port = 3000;
// configuration ===========================================
const path = require('path');

// frontend ===========================================
app.use('assets/images', express.static(__dirname + 'assets/images'));
app.use('assets/css', express.static(__dirname + 'assets/css'));

// config files
var db = require('./config/db');
console.log("connecting--",db);
mongoose.connect(db.url, { useNewUrlParser: true, useUnifiedTopology: true }); //Mongoose connection created

// frontend routes =========================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/views/index.html')));

//defining routes

//SAMPLE ROUTE
app.get('/tproute', function (req, res) {
   res.send('This is routing for the application developed using Node and Express...');
});

// sample api route
// grab the Dog model we just created
/*var Dog = require('./models/Dog');
app.get('/api/dogs', function(req, res) {
   // use mongoose to get all dogs in the database
   Dog.find(function(err, dogs) {
      // if there is an error retrieving, send the error.
      // nothing after res.send(err) will execute
      if (err)
         res.send(err);
      res.json(dogs); // return all dogs in JSON format
   });
});*/
// startup our app at http://localhost:3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));