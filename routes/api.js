const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/prvaBaza');
const db = "mongodb://localhost:27017/prvaBaza";
mongoose.Promise = global.Promise;
mongoose.connect(db, { useNewUrlParser: true }, function (err) {
  if(err){
    console.error("Error! " + err);
  }
  console.log("ekstra api");
});

router.get('/', function(req, res) {
  res.send('api works');
});
router.get('/shit', function(req, res) {
  res.send('shit works');
});

module.exports = router;
