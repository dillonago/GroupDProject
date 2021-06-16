// modules =================================================
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

// set our port
const port = 3000;
// configuration ===========================================
const path = require('path');

app.use(express.json())
app.use(express.urlencoded());

// frontend ===========================================
app.use(express.static(__dirname + '/assets/images'));
app.use(express.static(__dirname + '/assets/css'));

// config files
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true }); //Mongoose connection created

//Middleware to send post requests
app.use(express.json());

// frontend routes =========================================================
app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/views/index.html')));

//defining routes
const userRoute = require('./routes/userRoute');

app.use('/user', userRoute)

const sam2Route = require('./routes/sam2');

app.use('/sam2', sam2Route);


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
app.listen(port, () => console.log(`App listening on port ${port}!`));
