var express = require("express");
var router = express.Router();

var data = require("../data/data.json");
const schema = require("../data/schema");

/* Get all notes. */
router.get("/", function (req, res, next) {
  res.send(data);
});

/* Get aggregated data statistics */
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

/* Retrieve item */
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

/* Create a note object */
router.post("/", function (req, res, next) {
  const newNote = { ...req.body };
  const created = new Date().toLocaleDateString();
  const _archived = false;
  const _id = Date.now();

  const note = {
    ...newNote,
    created,
    _archived,
    _id,
  };

  schema
    .validate(note)
    .then((_) => {
      data.push(note);
      res.send(data);
    })
    .catch((err) => {
      res.status(400);
      res.send({ err: err.message });
    });
});

/* Edit item */
router.patch("/:id", function (req, res, next) {
  const updData = { ...req.body };

  let { id } = req.params;
  id = +id;
  const idx = data.findIndex((el) => el._id === id);

  if (idx != -1) {
    const updatedNote = {
      ...data[idx],
      ...updData,
    };

    schema
      .validate(updatedNote)
      .then((_) => {
        data[idx] = updatedNote;
        res.send(data[idx]);
      })
      .catch((err) => {
        res.status(400);
        res.send({ err: err.message });
      });

    return;
  }

  res.status(404);
  res.send({ err: `Note with id = ${id} not found` });
});

/* Remove item */
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
