/* Giuliani Arpeggio Helper App Back-end */

const express = require('express');
const mongoose = require('mongoose');
const config = require('config'); // stores the URI securely 
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const url = require('url');
const querystring = require('querystring');
const port = process.env.PORT || 5000;
const app = express();
const random = require('mongoose-query-random')

app.use(cors());

const db = process.env.MONGODB_URL;
const Study = require('./models/Study');
 
mongoose
  .connect(db, { 
    useNewUrlParser: true, 
    useCreateIndex: true, 
    useFindAndModify: false 
  })
  .then( () => console.log('\nMongoDB Connected...') )
  .catch( err => console.log(err) );

// THE GETS ------------------------------------------------------
// Get all studies 
app.get('/get-all-studies', (req, res) => {
  Study.find()
    .then( items => console.log( res.json(items) ));
});

// Get study by id 
app.get('/get-studies-by-id/:id', (req, res) => {
  let id = req.params.id;
  Study.findById(id, (err, data) => {
    res.json(data);
  })
});

// Get randomized studies by difficulty
app.get('/get-randomized-studies-by-difficulty', (req, res) => {
  let difficulty = parseInt(req.query.difficulty);
  let limit = parseInt(req.query.limit);

  Study.find({ difficulty : difficulty }).random(limit, true, (err, data ) => {
    res.json(data);
  })
})

// Get randomzied studies from all studies
app.get('/get-randomized-studies-all', (req, res) => {
  let limit = parseInt(req.query.limit);

  Study.find().random(limit, true, (err, data ) => {
    res.json(data);
  })
})

//-----------------------------------------------------------------

// Create (POST)
app.post('/add-study', (req, res) => {
  const newStudy = new Study({
    studyNum: req.body.studyNum,
    studyPath: req.body.studyPath,
    difficulty: req.body.difficulty
  })
  newStudy
    .save()
    .then( item => res.json(item) )
    .catch( err => res.status(500).json( { success: false}  ));
});

// Delete
app.delete('/delete-study-by-id/:id', (req, res) => {
  Study.findOneAndDelete( { _id: req.params.id })
    .then(() => res.json( { success: true }) )
    .catch(err => res.status(404).json( { success: false } ));
})

// Update (PUT)
app.put('/update-study-by-id/:id', (req, res) => {
  Study.findOneAndUpdate( { _id: req.params.id } , req.body )
    .then(() => res.json( { success: true } ))
    .catch(err => res.status(404).json( { success: false } ));
})

// --------------------------------------------------------------------
app.listen( port, "0.0.0.0", () => 
   console.log(`\nServer started on port: http://localhost:${port}\n`)
 )