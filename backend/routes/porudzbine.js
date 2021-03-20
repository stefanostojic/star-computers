const express = require("express");
const Porudzbina = require("../models/porudzbina");
const Obavestenje = require("../models/obavestenje");
const Korisnik = require("../models/korisnik");
const Proizvod = require("../models/proizvod");
const checkIfAdmin = require("../middleware/check-if-admin");
const checkIfKorisnik = require("../middleware/check-if-korisnik");
var mongoose = require('mongoose');
var nodemailer = require('nodemailer');
const checkIfIspravneCene = require("../middleware/check-if-ispravne-cene");

const router = express.Router();

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mapiranje.la@gmail.com',
    pass: 'lokalni8vodic9'
  }
});

router.post(
  "",
  checkIfKorisnik,
  (req, res, next) => {
    console.log("porudzbine.js: post: ...");
    console.log("porudzbine.js: post: napomena: " + req.body.napomena);

    // provera da li su cene okej
    let ukupnaVrednostPorudzbine = 0;
    let ukupanBrojArtikalaPorudzbine = 0;
    let validnostKolicine  = 0;
    let brojac = 0
    let fetchedProizvodi = [];
    for (const stavka of req.body.stavke) {
      Proizvod.findById(stavka.proizvodId).then(proizvod => {
        console.log("porudzbine.js: post: dodavanje elementa " + proizvod + " u niz fetchedProizvodi");
        fetchedProizvodi.push(proizvod);
        console.log("porudzbine.js: post: fetchedProizvodi.length: " + fetchedProizvodi.length);
        ukupnaVrednostPorudzbine += proizvod.cena * stavka.kolicina;
        ukupanBrojArtikalaPorudzbine += stavka.kolicina;
        if (stavka.kolicina > proizvod.kolicina) {
          validnostKolicine--;
          console.log("NEMA dovoljno na stanju: " + proizvod._id);
          res.status(500).json({
            nedostupanProizvod: proizvod.proizvodjac + proizvod.naziv,
            trazenaKolicina: stavka.kolicina,
            dostupnaKolicina: proizvod.kolicina
          });
          return;
        }
        brojac++;
        if (brojac == req.body.stavke.length) {
          console.log("ukupnaVrednostPorudzbine na kraju: " + ukupnaVrednostPorudzbine);
          console.log("ukupanBrojArtikalaPorudzbine na kraju: " + ukupanBrojArtikalaPorudzbine);
          Korisnik.findById(req.userData.userId).then(korisnik => {
            const porudzbina = new Porudzbina({
              korisnik: req.userData.userId,
              sadrzaj: req.body.stavke,
              napomena: req.body.napomena
            });
            porudzbina.save().then(kreiranaPorudzbina => {
              const obavestenje = new Obavestenje({
                tip: "porudzbina",
                naziv: korisnik.grad + ", " + korisnik.ulica,
                opis: ukupanBrojArtikalaPorudzbine + " artikal/la ukupne vrednosti: " + ukupnaVrednostPorudzbine + " din",
                datumVreme: kreiranaPorudzbina.datumVreme,
                link: kreiranaPorudzbina._id,
                vidjeno: false
              });
              console.log("obavestenje: " + JSON.stringify(obavestenje));
              obavestenje.save().then(kreiranoObavestenje => {
                console.log("porudzbine.js: post: obavestenje napravljeno");
                res.status(201).json({
                  message: "uspeh"
                });

                for (const stavka of req.body.stavke) {
                  Proizvod.findById(stavka.proizvodId).then(proizvod => {
                    const novaKolicina = proizvod.kolicina - stavka.kolicina;
                    const novoProdato = proizvod.prodato + stavka.kolicina;
                    Proizvod.update({ _id: proizvod._id }, { kolicina: novaKolicina, prodato: novoProdato }).then(() => {
                      console.log("uspesno azurirano stanje proizvoda");
                    });
                  });
                }

                const subjectMejla = "Potvrda porudzbine " + kreiranaPorudzbina._id;
                let bodyMejla = ``;
                bodyMejla += `<h1>Star computers</h1>
                <p>Poštovani, </p><p>Primili smo Vašu porudžbinu ${kreiranoObavestenje.link}. Ovo ste poručili: </p>`;
                let j = 0;
                for (const p in fetchedProizvodi) {
                  bodyMejla += `<p>${fetchedProizvodi[p].proizvodjac} ${fetchedProizvodi[p].naziv} x ${fetchedProizvodi[p].cena} din x ${req.body.stavke[j].kolicina}</p>`;
                  j++;
                }

                if (req.body.napomena !== "" && req.body.napomena !== null && req.body.napomena !== undefined) {
                  bodyMejla += `<p>Primili smo i Vašu napomenu: </p>
                  ${req.body.napomena}
                  <p>i razmotricemo je.</p>`;
                }

                bodyMejla += `<p>Ukupna vrednost porudžbine: ${ukupnaVrednostPorudzbine} din</p>`;

                bodyMejla += `<p>Pozdrav,<br>Vaš Star Computers </p>`;

                console.log("bodyMejla: ", bodyMejla);
                var mailOptions = {
                  from: 'mapiranje.la@gmail.com',
                  to: req.userData.email,
                  // to: [req.userData.email, "mkaranovic@uns.ac", "mira994@gmail.com"], // Mira
                  // to: [req.userData.email, "sladojevic@uns.ac.rs", "ssladojevic@gmail.com"], // Sladojevic
                  // to: [req.userData.email, "dejanvarmedja@gmail.com"], // Dejan
                  subject: subjectMejla,
                  text: 'That was easy!',
                  html: bodyMejla
                };
                transporter.sendMail(mailOptions, function(error, info){
                  if (error) {
                    console.log(error);
                  } else {
                    console.log('Email sent: ' + info.response);
                  }
                });

              });
            });
          })
        }
      });
    }
  }
);

router.get("", checkIfAdmin, (req, res, next) => {
  let id = req.query.id;
  let obradjenost = req.query.obradjenost;
  const korisnikId = req.query.korisnikId;
  const datumVreme = req.query.datumVreme;
  const pojam = req.query.pojam;
  const porudzbinaPoStrani = +req.query.porudzbinaPoStrani;
  const trenutnaStrana = +req.query.trenutnaStrana;
  let porudzbinaQuery;

  let uslovi = {};
  console.log('id: ', id);
  let niz = [];
  // niz.push(mongoose.Types.ObjectId('5d533a3c1aeea80568741e7f'));
  // niz.push(idParam);
  if (id !== 'null' && id !== 'undefined') {
    console.log("id jeste definisan, pa ce se traziti bas po tom ID-ju");
    uslovi._id = id;
  } else {
    console.log("id nije definisan, pa ce se traziti po bilo kod ID-ju");
  }

  if (obradjenost !== "sve") {
    uslovi.obradjenost = obradjenost;
  }

  // uslovi._id = { $in: niz };
  console.log("uslovi: ", uslovi);

  porudzbinaQuery = Porudzbina.find(uslovi);

  porudzbinaQuery.countDocuments().then(ukupno => {
    console.log("broj pronadjenih porudzbina: ", ukupno);

    porudzbinaQuery.sort('-datumVreme').skip(porudzbinaPoStrani * (trenutnaStrana - 1)).limit(porudzbinaPoStrani);
    console.log("porudzbinaPoStrina: ", porudzbinaPoStrani);
    console.log("trenutnaStrana: ", trenutnaStrana);

    porudzbinaQuery.find(uslovi).then(documents => {
      console.log("porudzbine pronadjene uspesno");
      res.status(200).json({
        porudzbine: documents,
        ukupnoPorudzbina: ukupno
      })
    });
  })
});

router.get("/:id", checkIfAdmin, (req, res, next) => {
  console.log("porudzbine.js: get(id): id: ", req.params.id);
  Porudzbina.findById(req.params.id).populate('korisnik').then(porudzbina => {
    console.log("porudzbine.js: get(id): pronadjen!");
    if (porudzbina) {
      res.status(200).json(porudzbina);
    } else {
      res.status(404).json({ message: "Porudzbina not found!" });
    }
  });
});

router.put("/:id", checkIfAdmin, (req, res, next) => {
  console.log("update porudzbine zapocet");
  Porudzbina.update({_id: req.params.id}, { obradjenost: req.body.obradjenost}).then(() => {
    console.log("update porudzbine uspesan");
    res.status(200).json();
  })
});

module.exports = router;
