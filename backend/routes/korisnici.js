const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Korisnik = require("../models/korisnik");
const checkIfAdmin = require("../middleware/check-if-admin");
const checkIfKorisnik = require("../middleware/check-if-korisnik");

const router = express.Router();

router.post("/registracija", (req, res, next) => {
  console.log('korisnici.js: /registracija: idemoooo');
  bcrypt.hash(req.body.lozinka, 10).then(hash => {
    const korisnik = new Korisnik({
      email: req.body.email,
      lozinka: hash,
      ime: req.body.ime,
      prezime: req.body.prezime,
      telefon: req.body.telefon,
      grad: req.body.grad,
      ulica: req.body.ulica,
      postanskiBroj: req.body.postanskiBroj,
    });
    korisnik
      .save()
      .then(result => {
        res.status(201).json({
          message: "Korisnik created!",
          result: result
        });
      })
      .catch(err => {
        // const emailGreska = Object.getOwnPropertyNames(err.errors).indexOf('email');
        // const postanskiBrojGreska = Object.getOwnPropertyNames(err.errors).indexOf('postanskiBroj');
        if (emailGreska !== -1) {
          res.status(500).json({
            message: "email zauzet"
          });
        }
        if (emailGreska !== -1) {
          res.status(500).json({
            message: "postanski broj treba da bude broj"
          });
        }
      });
  });
});

router.post("/prijava", (req, res, next) => {
  console.log("evo stize prijavaa");
  let fetchedKorisnik;
  Korisnik.findOne({ email: req.body.email })
    .then(korisnik => {
      if (!korisnik) {
        console.log("korisnicko ime nije pronadjeno");
        return res.status(401).json({
          message: "Korisničko ime nije pronađeno"
        });
      }
      console.log("korisnicko ime pronadjeno");
      fetchedKorisnik = korisnik;
      return bcrypt.compare(req.body.lozinka, korisnik.lozinka);
    })
    .then(result => {
      if (!result) {
        console.log("lozinka nije dobra");
        return res.status(401).json({
          message: "Lozinka nije ispravna"
        });
      }
      console.log("lozinka je dobra");
      console.log("fetchedKorisnik.email:" + fetchedKorisnik.email);
      console.log("fetchedKorisnik._id:" + fetchedKorisnik._id);
      const token = jwt.sign(
        { email: fetchedKorisnik.email, korisnikId: fetchedKorisnik._id },
        "veryLongSecretKeyveryLongSecretKeyveryLongSecretKeyveryLongSecretKeyveryLongSecretKey",
        { expiresIn: "1h" }
      );
      console.log("token napravljen: " + JSON.stringify(token));
      console.log("fetchedKorisnik._id: " + fetchedKorisnik._id);
      console.log("Admin ID: " + "5d4b4a7d11d59916ec10f6ce");
      const daLiJeAdmin = (fetchedKorisnik._id == "5d4b4a7d11d59916ec10f6ce") ? true : false;
      console.log("daLiJeAdmin: " + daLiJeAdmin);
      if (fetchedKorisnik._id == "5d4b4a7d11d59916ec10f6ce") {
        res.status(200).json({
          token: token,
          isticeZa: 3600,
          korisnikId: fetchedKorisnik._id,
          isAdmin: true
        });
      } else {
        res.status(200).json({
          token: token,
          isticeZa: 3600,
          korisnikId: fetchedKorisnik._id,
          isAdmin: false
        });
      }
    })
    .catch(err => {
      return res.status(401).json({
        message: "Auth failed"
      });
    });
});

router.put("/:id", checkIfKorisnik, (req, res, next) => {
  console.log('korisnici.js: put(): ');
  try {
    Korisnik.findById(req.userData.userId).then(result => {
      const korisnik = new Korisnik({
        email: result.email,
        lozinka: result.lozinka,
        ime: req.body.ime,
        prezime: req.body.prezime,
        telefon: req.body.telefon,
        grad: req.body.grad,
        ulica: req.body.ulica,
        postanskiBroj: req.body.postanskiBroj
      });
      if (req.params.id === req.userData.userId || req.userData.userId === "5d4b4a7d11d59916ec10f6ce") {
        console.log("korisnici.js: Azuriranje korisnika sa ID: " + req.params.id + " ...");
        console.log(JSON.stringify(korisnik));
        Korisnik.updateOne(
          { _id: req.params.id },
          { $set: {
            lozinka: result.lozinka,
            ime: req.body.ime,
            prezime: req.body.prezime,
            telefon: req.body.telefon,
            grad: req.body.grad,
            ulica: req.body.ulica,
            postanskiBroj: req.body.postanskiBroj
           }
         }
          ).then(result => {
          res.status(200).json({});
          console.log("korisnici.js: Azuriranje korisnika sa ID: " + req.body._id + " gotovo");
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });;
      } else {
        res.status(401).json({ message: "niste autorizovani" });
      }
    });
  }
  catch(error) {
    console.log(error);
    res.status(500).json({message: "greska pri aziriranju korisnika"});
  }
});

router.get("", checkIfAdmin, (req, res, next) => {
  console.log("korisnici.js: get(): ...");
  console.log("req.userData.userId: " + req.userData.userId);
  Korisnik.find().then(documents => {
    console.log("korisnici.js: get(): gotovo");
    res.status(200).json({
      message: "Korisnici fetched successfully!",
      korisnici: documents
    });
  });
});

router.get("/:id", checkIfKorisnik, (req, res, next) => {
  if (req.params.id === req.userData.userId || req.userData.userId === "5d4b4a7d11d59916ec10f6ce") {
    Korisnik.findById(req.params.id).then(korisnik => {
      if (korisnik) {
        res.status(200).json(korisnik);
      } else {
        res.status(404).json({ message: "Korisnik not found!" });
      }
    });
  } else {
    res.status(401).json({ message: "korisnici.js: get(id): zahtev odbijen" });
  }
});

router.delete("/:id", checkIfKorisnik, (req, res, next) => {
  if (req.params.id === req.userData.userId || req.userData.userId === "5d4b4a7d11d59916ec10f6ce") {
    Korisnik.deleteOne({ _id: req.params.id }).then(result => {
      console.log(result);
      res.status(200).json({ message: "Korisnik deleted!" });
    });
  } else {
    res.status(401).json({ message: "korisnici.js: delete(id): zahtev odbijen" });
  }
});

module.exports = router;
