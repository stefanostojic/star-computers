const mongoose = require('mongoose');

const karakteristikaSchema = mongoose.Schema({
  naziv: { type: String, required: true },
  vrednost: { type: String, required: true }
});

module.exports = mongoose.model('Karakteristika', karakteristikaSchema, 'karakteristike');
