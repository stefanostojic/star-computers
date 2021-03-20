const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// "naziv" je naziv proizvoda
// "slika" je lokacija slike proizvoda
// "sazetOpis" je ona sazeta specifikacija ispod slicica proizvoda unutar kartica
// "detaljanOpis" opisuje namenu proizvoda
// "specifikacijaProizvodaSchema" je schema koja predstavlja key-value parove karakteristika i njihovih vrednosti

// const specifikacijaProizvodaSchema = new Schema({
//   karakteristika: String,
//   vrednost: String
// });

const proizvodUkratkoSchema = new Schema({
  tip: String,
  naziv: {
    type: String,
    maxLength: 50
  },
  slika: String,
  sazetOpis: {
    type: String,
    maxLength: 50
  }
});
// module.exports = mongoose.model('Proizvod', proizvodUkratkoSchema, proizvodi);
module.exports = mongoose.model('Proizvod', proizvodUkratkoSchema, 'proizvodi');

// const proizvodDetaljnoSchema = new Schema({
//   naziv: {
//     type: String,
//     maxLength: 50
//   },
//   slika: String,
//   detaljanOpis: { // tipa ovo je gejmerski racunar koji gura sve najnovije igrice
//     type: String,
//     maxLength: 50
//   },
//   specifikacija: {
//     type: [specifikacijaProizvodaSchema],
//     default: undefined
//   }
// });
// module.exports = mongoose.model('proizvodDetaljno', proizvodDetaljnoSchema, proizvodi);

// const proizvodKompletnoSchema = new Schema({
//   naziv: {
//     type: String,
//     maxLength: 50
//   },
//   slika: String,
//   sazetOpis: {
//     type: String,
//     maxLength: 50
//   },
//   detaljanOpis: {
//     type: String,
//     maxLength: 50
//   },
//   specifikacija: {
//     type: [specifikacijaProizvodaSchema],
//     default: undefined
//   }
// });
// module.exports = mongoose.model('proizvodKompletno', proizvodKompletnoSchema, proizvodi);
