var express = require("express");
var router = express.Router();

var data = require("../data/data.json");

/* GET notes listing. */
router.get("/", function (req, res, next) {
  res.send(data);
});

router.get("/:id", function (req, res, next) {
  let { id } = req.params;
  id = +id;
  const idx = data.findIndex((el) => el._id === id);
  res.send(data[idx]);
});

router.delete("/:id", function (req, res, next) {
  let { id } = req.params;
  id = +id;
  const idx = data.findIndex((el) => el._id === id);
  data.splice(idx, 1);
  res.send(data);
});

module.exports = router;
