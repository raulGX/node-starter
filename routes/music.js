var express = require("express");
var router = express.Router();

var songs = ["Crying Lightning", "Seven Nation Army"];

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("music", {
    title: "Playlist:",
    songs: songs,
  });
});

router.post("/", function (req, res, next) {
  songs.push(req.body.name);
  res.render("music", {
    title: "Playlist:",
    songs: songs,
  });
});

module.exports = router;
