const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const korisnikSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  lozinka: { type: String, required: true },
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  telefon: { type: String, required: true },
  grad: { type: String, required: true },
  ulica: { type: String, required: true },
  postanskiBroj: { type: Number, required: true },
});

korisnikSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Korisnik", korisnikSchema, "korisnici");
