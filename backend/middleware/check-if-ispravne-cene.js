const Proizvod = require("../models/proizvod");
var mongoose = require('mongoose');

module.exports = (req, res, next) => {
  // try {
    const stavke = req.body.stavke;

    // // provera da li su cene okej
    let ukupnaVrednostPorudzbine = 0;
    let brojac = 0

    for (const stavka of stavke) {
      console.log("stavka: " + JSON.stringify(stavka));
      Proizvod.findById(stavka.proizvodId).then(proizvod => {
        ukupnaVrednostPorudzbine += proizvod.cena;
        brojac++;
        console.log("brojac: " + brojac);
      });
    }
    while (true) {
      console.log("brojac: " + brojac);
        console.log("stavke.length: " + stavke.length);
      if (brojac == stavke.length) {
        console.log("brojac*: " + brojac);
        console.log("stavke.length*: " + stavke.length);
        break;
      }
    }
    // console.log("check-if-ispravne-cene: ukupnaVrednostPorudzbine: " + ukupnaVrednostPorudzbine);

    console.log("check-if-ispravne-cene: gotovo");
  // } catch (error) {
  //   res.status(402).json({ message: "check-if-ispravne-cene.js: bedak" });
  // }
};

// // provera da li su cene okej
// let ukupnaVrednostPorudzbine = 0;
// for (const stavka of porudzbina.sadrzaj) {
//   console.log("prolay");
//   Proizvod.findById(stavka.proizvodId).then(proizvod => {
//     ukupnaVrednostPorudzbine += proizvod.cena;
//   });
// }
