const mongoose = require('mongoose');

const proizvodSchema = mongoose.Schema({
  naziv: { type: String, required: true },
  proizvodjac: { type: String, required: true },
  slika: { type: String, required: true },
  sazetOpis: { type: String, required: true },
  detaljanOpis: { type: String, required: true },
  cena: { type: Number, required: true },
  kolicina: { type: Number, required: true },
  prodato: { type: Number, required: true },
  kategorija: { type: String, required: true },
  karakteristike: [{ naziv: String, vrednost: String }],
  komentari: [{ _id: mongoose.Schema.Types.ObjectId, autor: String, tekst: String, odgovor: String }]
});

module.exports = mongoose.model('Proizvod', proizvodSchema, 'proizvodi');
