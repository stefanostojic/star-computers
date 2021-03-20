const express = require("express");
// const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const Proizvod = require("./models/proizvod");
const Korisnik = require("./models/korisnik");
const proizvodiRoutes = require("./routes/proizvodi");
const korisniciRoutes = require("./routes/korisnici");
const porudzbineRoutes = require("./routes/porudzbine");
const obavestenjaRoutes = require("./routes/obavestenja");
const checkIfAdmin = require("./middleware/check-if-admin");
const checkIfKorisnik = require("./middleware/check-if-korisnik");
const Obavestenje = require("./models/obavestenje");
const Porudzbina = require("./models/porudzbina");


const app = express();

// setInterval(() => {
//   // console.log("setInterval() radii");
//   // console.log("Date.now(): " + Date.now());
//   console.log(new Date().toLocaleDateString('en-GB'));
//   console.log(new Date().toLocaleDateString('en-GB').replace("/", '.').replace("/", '.'));
//   console.log(new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''));
// }, 5000);
console.log(new Date().toLocaleTimeString('en-GB'));

mongoose
  .connect("mongodb://localhost:27017/MongoBaza", { useNewUrlParser: true, useCreateIndex: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch(() => {
    console.log("Connection failed!");
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

// let najprodavanijiRacunari = [{proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}];
// let najprodavanijiRacunariSaPodacima = [];
// let najprodavanijiLaptopovi = [{proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}];
// let najprodavanijiLaptopoviSaPodacima = [];
// let najprodavanijiTelefoni = [{proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}, {proizvodId: "", prodato: 0}];
// let najprodavanijiTelefoniSaPodacima = [];

// function pronalazakNajprodavanijihProizvoda() {
//   try {
//     Proizvod.find().then(proizvodi => {

//       // prvi prolaz
//       for (const proizvod of proizvodi) {
//         if (proizvod.kategorija == "Računar") {
//           if (proizvod.prodato >= najprodavanijiRacunari[0].prodato) {
//             najprodavanijiRacunari[0].proizvodId = proizvod._id;
//             najprodavanijiRacunari[0].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Laptop") {
//           if (proizvod.prodato >= najprodavanijiLaptopovi[0].prodato) {
//             najprodavanijiLaptopovi[0].proizvodId = proizvod._id;
//             najprodavanijiLaptopovi[0].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Telefon") {
//           if (proizvod.prodato >= najprodavanijiTelefoni[0].prodato) {
//             najprodavanijiTelefoni[0].proizvodId = proizvod._id;
//             najprodavanijiTelefoni[0].prodato = proizvod.prodato;
//           }
//         }
//       }

//       // drugi prolaz
//       for (const proizvod of proizvodi) {
//         if (proizvod.kategorija == "Računar") {
//           if (proizvod.prodato >= najprodavanijiRacunari[1].prodato && proizvod._id !== najprodavanijiRacunari[0].proizvodId) {
//             najprodavanijiRacunari[1].proizvodId = proizvod._id;
//             najprodavanijiRacunari[1].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Laptop") {
//           if (proizvod.prodato >= najprodavanijiLaptopovi[1].prodato && proizvod._id !== najprodavanijiLaptopovi[0].proizvodId) {
//             najprodavanijiLaptopovi[1].proizvodId = proizvod._id;
//             najprodavanijiLaptopovi[1].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Telefon") {
//           if (proizvod.prodato >= najprodavanijiTelefoni[1].prodato && proizvod._id !== najprodavanijiTelefoni[0].proizvodId) {
//             najprodavanijiTelefoni[1].proizvodId = proizvod._id;
//             najprodavanijiTelefoni[1].prodato = proizvod.prodato;
//           }
//         }
//       }

//       // treci prolaz
//       for (const proizvod of proizvodi) {
//         if (proizvod.kategorija == "Računar") {
//           if (proizvod.prodato >= najprodavanijiRacunari[2].prodato && proizvod._id !== najprodavanijiRacunari[0].proizvodId && proizvod._id !== najprodavanijiRacunari[1].proizvodId) {
//             najprodavanijiRacunari[2].proizvodId = proizvod._id;
//             najprodavanijiRacunari[2].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Laptop") {
//           if (proizvod.prodato >= najprodavanijiLaptopovi[2].prodato && proizvod._id !== najprodavanijiLaptopovi[0].proizvodId && proizvod._id !== najprodavanijiLaptopovi[1].proizvodId) {
//             najprodavanijiLaptopovi[2].proizvodId = proizvod._id;
//             najprodavanijiLaptopovi[2].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Telefon") {
//           if (proizvod.prodato >= najprodavanijiTelefoni[2].prodato && proizvod._id !== najprodavanijiTelefoni[0].proizvodId && proizvod._id !== najprodavanijiTelefoni[1].proizvodId) {
//             najprodavanijiTelefoni[2].proizvodId = proizvod._id;
//             najprodavanijiTelefoni[2].prodato = proizvod.prodato;
//           }
//         }
//       }

//       // cetvrti prolaz
//       for (const proizvod of proizvodi) {
//         if (proizvod.kategorija == "Računar") {
//           if (proizvod.prodato >= najprodavanijiRacunari[3].prodato && proizvod._id !== najprodavanijiRacunari[0].proizvodId && proizvod._id !== najprodavanijiRacunari[1].proizvodId && proizvod._id !== najprodavanijiRacunari[2].proizvodId) {
//             najprodavanijiRacunari[3].proizvodId = proizvod._id;
//             najprodavanijiRacunari[3].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Laptop") {
//           if (proizvod.prodato >= najprodavanijiLaptopovi[3].prodato && proizvod._id !== najprodavanijiLaptopovi[0].proizvodId && proizvod._id !== najprodavanijiLaptopovi[1].proizvodId && proizvod._id !== najprodavanijiLaptopovi[2].proizvodId) {
//             najprodavanijiLaptopovi[3].proizvodId = proizvod._id;
//             najprodavanijiLaptopovi[3].prodato = proizvod.prodato;
//           }
//         } else if (proizvod.kategorija == "Telefon") {
//           if (proizvod.prodato >= najprodavanijiTelefoni[3].prodato && proizvod._id !== najprodavanijiTelefoni[0].proizvodId && proizvod._id !== najprodavanijiTelefoni[1].proizvodId && proizvod._id !== najprodavanijiTelefoni[2].proizvodId) {
//             najprodavanijiTelefoni[3].proizvodId = proizvod._id;
//             najprodavanijiTelefoni[3].prodato = proizvod.prodato;
//           }
//         }
//       }

//       for (let index = 0; index < najprodavanijiRacunari.length; index++) {
//         Proizvod.findById(najprodavanijiRacunari[index].proizvodId).then(proizvod => {
//           najprodavanijiRacunariSaPodacima[index] = proizvod;
//         });
//       }
//       for (let index = 0; index < najprodavanijiLaptopovi.length; index++) {
//         if (najprodavanijiLaptopovi[index].proizvodId != "") {
//           Proizvod.findById(najprodavanijiLaptopovi[index].proizvodId).then(proizvod => {
//             najprodavanijiLaptopoviSaPodacima[index] = proizvod;
//           });
//         }
//       }
//       for (let index = 0; index < najprodavanijiTelefoni.length; index++) {
//         if (najprodavanijiTelefoni[index].proizvodId != "") {
//           Proizvod.findById(najprodavanijiTelefoni[index].proizvodId).then(proizvod => {
//             najprodavanijiTelefoniSaPodacima[index] = proizvod;
//           })
//         }
//       }

//       // console.log("najprodavanijiRacunari: " + JSON.stringify(najprodavanijiRacunari));
//       // console.log("najprodavanijiLaptopovi: " + JSON.stringify(najprodavanijiLaptopovi));
//       // console.log("najprodavanijiTelefoni: " + JSON.stringify(najprodavanijiTelefoni));
//     });
//   }
//   catch(error) {
//     console.log("greska error: " + error.message);
//   }
// }


// pronalazakNajprodavanijihProizvoda();
// setInterval(() => {
//   pronalazakNajprodavanijihProizvoda();
// }, 60000);

app.put("/api/komentari/:idProizvoda", (req, res) => {
  console.log("app.js: patch komentari: ");
  console.log(req.params.idProizvoda);
  console.log(req.body.autor);
  console.log(req.body.tekst);
  var komentar = { "_id": mongoose.Types.ObjectId(), "autor": req.body.autor, "tekst": req.body.tekst, "odgovor": req.body.odgovor };
  Proizvod.updateOne({_id: req.params.idProizvoda}, {$push: {komentari: komentar}}).then(result => {
    console.log("app.js: Azuriranje proizvoda sa ID: " + req.params.idProizvoda + " gotovo");
    Proizvod.findById(req.params.idProizvoda).then(proizvod => {
      const obavestenje = new Obavestenje({
        tip: "komentar",
        naziv: proizvod.naziv,
        opis: req.body.autor + ": " + req.body.tekst,
        datumVreme: new Date(),
        link: req.params.idProizvoda,
        vidjeno: false
      });
      obavestenje.save().then(kreiranoObavestenje => {
        console.log("porudzbine.js: post: obavestenje napravljeno");
        res.status(201).json({
          message: "uspesno dodat komentar"
        });
      });
    });
  });
});

app.get("/api/najprodavaniji", (req, res, next) => {
  console.log("app.js: get: /api/najprodavaniji ...");
  let resp = {};
  Proizvod.find({kategorija: 'Računar'}).sort('-prodato').limit(4).then(data1 => {
    resp.najprodavanijiRacunari = data1;
    Proizvod.find({kategorija: 'Laptop'}).sort('-prodato').limit(4).then(data2 => {
      resp.najprodavanijiLaptopovi = data2;
      Proizvod.find({kategorija: 'Telefon'}).sort('-prodato').limit(4).then(data3 => {
        resp.najprodavanijiTelefoni = data3;
        // console.log('resp: ', resp);
        res.status(200).json(resp);
      })
    })
  })
  // res.status(200).json({najprodavanijiRacunari: najprodavanijiRacunariSaPodacima, najprodavanijiLaptopovi: najprodavanijiLaptopoviSaPodacima, najprodavanijiTelefoni: najprodavanijiTelefoniSaPodacima });
});

app.get("/api/proizvodjaci", (req, res, next) => {
  console.log("app.js: get: /api/proizvodjaci ...");
  let proizvodjaci = [];
  Proizvod.find().then(proizvodi => {
    for (let i = 0; i < proizvodi.length; i++) {
      let index = proizvodjaci.findIndex(p => p === proizvodi[i].proizvodjac);
      if (index === -1) {
        proizvodjaci.push(proizvodi[i].proizvodjac)
      }
    }
    res.status(200).json(proizvodjaci);
  });
});

app.get("/api/porudzbineZaKorisnika", (req, res) => {
  const idKorisnika = req.query.idKorisnika;
  const porudzbinaPoStrani = +req.query.porudzbinaPoStrani;
  const trenutnaStrana = +req.query.trenutnaStrana;

  console.log("idKorisnika: ", idKorisnika);
  console.log("porudzbinaPoStrani: ", porudzbinaPoStrani);
  console.log("trenutnaStrana: ", trenutnaStrana);

  let ukupnoPorudzbina;
  let porudzbineFetched;
  Porudzbina.find({korisnik: idKorisnika}).countDocuments().then(porudzbineCount => {
    ukupnoPorudzbina = porudzbineCount;
    console.log("porudzbineCount: ", porudzbineCount);
    Porudzbina.find({korisnik: idKorisnika}).sort('-datumVreme').skip(porudzbinaPoStrani * (trenutnaStrana - 1)).limit(porudzbinaPoStrani).then(porudzbine => {
      console.log("porudzbine: ", porudzbine);
      res.status(200).json({
        porudzbine,
        ukupnoPorudzbina
      });
    });
  });
});

app.use("/api/proizvodi", proizvodiRoutes);
app.use("/api/korisnici", korisniciRoutes);
app.use("/api/porudzbine", porudzbineRoutes);
app.use("/api/obavestenja", obavestenjaRoutes);

module.exports = app;
