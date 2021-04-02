// Giuliani Study Schema

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GiulianiStudySchema = new Schema({
  studyNum: {
    type: Number,
    required: true
  },
  studyPath: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number,
    required: true
  },
});


// The first argument is the singular name of the collection your model is for. 
module.exports = Item = mongoose.model('GiulianiStudy', GiulianiStudySchema);