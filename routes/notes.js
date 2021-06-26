var express = require("express");
var router = express.Router();

var data = require("../data/data.json");

/* GET notes listing. */
router.get("/", function (req, res, next) {
  res.send(data);
});

router.get("/stats", function (req, res, next) {
  const stats = data.reduce((acc, note) => {
    let categoryInstance = acc.find((el) => el.category === note.category);
    if (!categoryInstance) {
      categoryInstance = {
        category: note.category,
      };
      acc.push(categoryInstance);
    }

    if (note._archived) {
      categoryInstance.archived = (categoryInstance.archived ?? 0) + 1;
    } else {
      categoryInstance.active = (categoryInstance.active ?? 0) + 1;
    }

    return acc;
  }, []);
  res.send(stats);
});

router.get("/:id", function (req, res, next) {
  let { id } = req.params;
  id = +id;
  const idx = data.findIndex((el) => el._id === id);

  if (idx != -1) {
    res.send(data[idx]);
    return;
  }

  res.sendStatus(404);
});

router.post("/", function (req, res, next) {
  const newNote = { ...req.body };
  const created = new Date().toLocaleDateString();
  const _archived = false;
  const _id = Date.now();

  data.push({
    ...newNote,
    created,
    _archived,
    _id,
  });
  res.send(data);
});

router.patch("/:id", function (req, res, next) {
  const updData = { ...req.body };

  let { id } = req.params;
  id = +id;
  const idx = data.findIndex((el) => el._id === id);

  if (idx != -1) {
    data[idx] = {
      ...data[idx],
      ...updData,
    };
    res.send(data[idx]);
    return;
  }

  res.sendStatus(404);
});

router.delete("/:id", function (req, res, next) {
  let { id } = req.params;
  id = +id;
  const idx = data.findIndex((el) => el._id === id);

  if (idx != -1) {
    data.splice(idx, 1);
    res.send(data);
    return;
  }

  res.sendStatus(404);
});

module.exports = router;
