const express = require("express");
const multer = require("multer");

const Proizvod = require("../models/proizvod");
const checkIfAdmin = require("../middleware/check-if-admin");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

router.post(
  "",
  checkIfAdmin,
  multer({ storage: storage }).single("slika"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const proizvod = new Proizvod({
      naziv: req.body.naziv,
      proizvodjac: req.body.proizvodjac,
      slika: url + "/images/" + req.file.filename,
      sazetOpis: req.body.sazetOpis,
      detaljanOpis: req.body.detaljanOpis,
      cena: req.body.cena,
      kolicina: req.body.kolicina,
      prodato: req.body.prodato,
      kategorija: req.body.kategorija,
      karakteristike: JSON.parse(req.body.karakteristike),
      komentari: JSON.parse(req.body.komentari)
    });
    proizvod.save().then(sacuvaniProizvod => {
      res.status(201).json({
        proizvod: sacuvaniProizvod
      });
    });
  }
);

router.put("/:id", checkIfAdmin, multer({ storage: storage }).single("slika"), (req, res, next) => {
  console.log('app.js: app.put(): ');
  let slikaPath = req.body.slika;
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    slikaPath = url + "/images/" + req.file.filename
  }
  const proizvod = new Proizvod({
    _id: req.body._id,
    naziv: req.body.naziv,
    proizvodjac: req.body.proizvodjac,
    slika: slikaPath,
    sazetOpis: req.body.sazetOpis,
    detaljanOpis: req.body.detaljanOpis,
    cena: req.body.cena,
    kolicina: req.body.kolicina,
    prodato: req.body.prodato,
    kategorija: req.body.kategorija,
    karakteristike: req.body.karakteristike,
    komentari: req.body.komentari
  });
  console.log("app.js: Azuriranje proizvoda sa ID: " + req.params.id + " ...");
  Proizvod.updateOne({ _id: req.params.id }, proizvod).then(result => {
    res.status(200).json({ slika: req.body.slika });
    console.log("app.js: Azuriranje proizvoda sa ID: " + req.body._id + " gotovo");
  });
});

router.get("", (req, res, next) => {
  const id = req.query.id;
  const naziv = req.query.naziv;
  if (req.query.proizvodjaci === "undefined" || req.query.proizvodjaci.length === 0) {
    proizvodjaci = "undefined";
  } else {
    proizvodjaci = JSON.parse(req.query.proizvodjaci);
  }
  const kategorija = req.query.kategorija;
  const cenaMin = req.query.cenaMin;
  const cenaMax = req.query.cenaMax;
  const prodatoMin = req.query.prodatoMin;
  const prodatoMax = req.query.prodatoMax;
  const kolicinaMin = req.query.kolicinaMin;
  const kolicinaMax = req.query.kolicinaMax;
  const sortiranje = req.query.sortiranje;
  const proizvodaPoStrani = +req.query.proizvodaPoStrani;
  const trenutnaStrana = +req.query.trenutnaStrana;

  console.log("");
  console.log("id: ", id);
  console.log("naziv: ", naziv);
  console.log("proizvodjaci: ", proizvodjaci);
  console.log("kategorija: ", kategorija);
  console.log("cenaMin: ", cenaMin);
  console.log("cenaMax: ", cenaMax);
  console.log("prodatoMin: ", prodatoMin);
  console.log("prodatoMax: ", prodatoMax);
  console.log("kolicinaMin: ", kolicinaMin);
  console.log("kolicinaMax: ", kolicinaMax);
  console.log("sortiranje: ", sortiranje);
  console.log("proizvodaPoStrani: ", proizvodaPoStrani);
  console.log("trenutnaStrana: ", trenutnaStrana);

  let proizvodQuery;

  uslovi = {};

  if (id !== "" && id !== "null" && id !== "undefined") {
    uslovi._id = id;
  }

  if (naziv !== "" && naziv !== "null" && naziv !== "undefined") {
    uslovi.naziv = new RegExp(naziv, 'i');
  }

  if (proizvodjaci !== [] && proizvodjaci !== "null" && proizvodjaci !== "undefined" && proizvodjaci !== null && proizvodjaci.length !== 0) {
    uslovi.proizvodjac = { $in: proizvodjaci };
  }

  if (kategorija !== "" && kategorija !== "null" && kategorija !== "undefined") {
    uslovi.kategorija = kategorija;
  }

  if (
    cenaMax !== "" && cenaMax !== "null" && cenaMax !== "undefined" &&
    cenaMin !== "" && cenaMin !== "null" && cenaMin !== "undefined"
  ) {
    uslovi.cena = { $gte: cenaMin, $lte: cenaMax };
  } else if (cenaMax !== "" && cenaMax !== "null" && cenaMax !== "undefined") {
    uslovi.cena = { $lte: cenaMax };
  } else if (cenaMin !== "" && cenaMin !== "null" && cenaMin !== "undefined") {
    uslovi.cena = { $gte: cenaMin };
  }

  if (
    prodatoMax !== "" && prodatoMax !== "null" && prodatoMax !== "undefined" &&
    prodatoMin !== "" && prodatoMin !== "null" && prodatoMin !== "undefined"
  ) {
    uslovi.prodato = { $gte: prodatoMin, $lte: prodatoMax };
  } else if (prodatoMax !== "" && prodatoMax !== "null" && prodatoMax !== "undefined") {
    uslovi.prodato = { $lte: prodatoMax };
  } else if (prodatoMin !== "" && prodatoMin !== "null" && prodatoMin !== "undefined") {
    uslovi.prodato = { $gte: prodatoMin };
  }

  if (
    kolicinaMax !== "" && kolicinaMax !== "null" && kolicinaMax !== "undefined" &&
    kolicinaMin !== "" && kolicinaMin !== "null" && kolicinaMin !== "undefined"
  ) {
    uslovi.kolicina = { $gte: kolicinaMin, $lte: kolicinaMax };
  } else if (kolicinaMax !== "" && kolicinaMax !== "null" && kolicinaMax !== "undefined") {
    uslovi.kolicina = { $lte: kolicinaMax };
  } else if (kolicinaMin !== "" && kolicinaMin !== "null" && kolicinaMin !== "undefined") {
    uslovi.kolicina = { $gte: kolicinaMin };
  }

  let fetchedProizvodi;

  console.log("uslovi: ", uslovi);

  proizvodQuery = Proizvod.find(uslovi);

  proizvodQuery.countDocuments().then(ukupno => {
    console.log("broj pronadjenih proizvoda: ", ukupno);

    if (sortiranje !== "" && sortiranje !== "null" && sortiranje !== "undefined") {
      console.log("sortiranje po: ", sortiranje);
      proizvodQuery.sort(sortiranje);
    }

    proizvodQuery.skip(proizvodaPoStrani * (trenutnaStrana - 1)).limit(proizvodaPoStrani);

    proizvodQuery.find(uslovi).then(documents => {
      console.log("proizvodi pronadjeni uspesno");
      res.status(200).json({
        proizvodi: documents,
        ukupnoProizvoda: ukupno
      })
    });
  })
});

router.get("/:id", (req, res, next) => {
  Proizvod.findById(req.params.id).then(proizvod => {
    if (proizvod) {
      res.status(200).json(proizvod);
    } else {
      res.status(404).json({ message: "Proizvod not found!" });
    }
  });
});

router.delete("/:id", checkIfAdmin, (req, res, next) => {
  console.log("brisanje proizvoda sa ID: " + req.params.id);
  Proizvod.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
    res.status(200).json({ message: "Proizvod deleted!" });
  });
});

module.exports = router;
