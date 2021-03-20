const mongoose = require('mongoose');

const komentarSchema = mongoose.Schema({
  _id: String, // mozda treba ObjectId
  odgovorNa: String,
  autor: String,
  tekst: String
});

module.exports = mongoose.model('Komentar', komentarSchema, 'komentari');
