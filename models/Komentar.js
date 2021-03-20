const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define collection and schema for Business
let Komentar = new Schema({
  komentar: {
    type: String
  },
  korisnik: {
    type: String
  }
},{
    collection: 'proizvodi'
});

module.exports = mongoose.model('Komentar', Komentar);
