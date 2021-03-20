const mongoose = require('mongoose');

const obavestenjeSchema = mongoose.Schema({
  tip: { type: String, required: true },
  naziv: { type: String, required: true },
  opis: { type: String, required: true },
  datumVreme: { type: Date, required: true },
  link: { type: mongoose.Schema.Types.ObjectId, ref: "Proizvod", required: true },
  vidjeno: { type: Boolean, required: true }
});

module.exports = mongoose.model('Obavestenje', obavestenjeSchema, 'obavestenja');
