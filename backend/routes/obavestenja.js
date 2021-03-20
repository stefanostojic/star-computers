const express = require("express");
const multer = require("multer");

const Obavestenje = require("../models/obavestenje");
const checkIfAdmin = require("../middleware/check-if-admin");

const router = express.Router();

router.get("", checkIfAdmin, (req, res, next) => {
  Obavestenje.find().then(obavestenja => {
    res.status(200).json(
      obavestenja
    );
  });
});

router.get("/:id", checkIfAdmin, (req, res, next) => {
  try {
    if (req.params.id == "za-navigaciju") {
      const obavestenjaQuery = Obavestenje.find({vidjeno: false});
      obavestenjaQuery.limit(10);
      obavestenjaQuery.sort('-datumVreme');
      let fetchedObavestenja;
      obavestenjaQuery
        .then(documents => {
          fetchedObavestenja = documents;
          return Obavestenje.countDocuments({vidjeno: false});
        })
        .then(count => {
          // console.log("count: " + count);
          res.status(200).json({
            obavestenja: fetchedObavestenja,
            ukupnoObavestenja: count
          });
        })
    } else {
      Obavestenje.findById(req.params.id).then(obavestenje => {
        if (obavestenje) {
          res.status(200).json(obavestenje);
        } else {
          res.status(404).json({ message: "Proizvod not found!" });
        }
      });
    }
  }
  catch (error) {
    console.log("error: " + error.error);
  }

});

router.put("/:id", checkIfAdmin, (req, res, next) => {
  console.log("obavestenjeeeee " + req.params.id + " vidjeno");
  Obavestenje.updateOne({_id: req.params.id}, {vidjeno: true}).then(response => {
    console.log("obavestenje.js: update obavestenje gotov");
  });
});

module.exports = router;
