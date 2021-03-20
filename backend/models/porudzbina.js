const mongoose = require('mongoose');
const Korisnik = require("./korisnik");

const porudzbinaSchema = mongoose.Schema({
  korisnik: { type: mongoose.Schema.Types.ObjectId, ref: "Korisnik", required: true },
  datumVreme: { type: Date, default: Date.now },
  sadrzaj: { type: [{ proizvodId: String, kolicina: Number }], required: true },
  napomena: String,
  obradjenost: { type: String, default: "neobradjena"}
});

module.exports = mongoose.model('Porudzbina', porudzbinaSchema, 'porudzbine');
