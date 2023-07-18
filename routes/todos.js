var express = require("express");
var router = express.Router();
var models = require("../models");

/* GET todos listing. */
router.get("/", async function (req, res, next) {
  try {
    const todos = await models.Todo.findAll({
      include: [
        {
          model: models.User,
        },
      ],
    });
    res.json(todos);
  } catch (e) {
    res.json({ e });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const todo = await models.Todo.create({
      title: req.body.title,
      UserId: req.body.UserId,
    });
    res.json(todo);
  } catch (e) {
    res.json({ e });
  }
});

router.put("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const todo = await models.Todo.update(
      {
        title: req.body.title,
        complete: req.body.complete,
      },
      {
        where: {
          id,
        },
        returning: true,
        plain: true,
      }
    );
    res.json(todo[1]);
  } catch (e) {
    res.json({ e });
  }
});

router.delete("/:id", async function (req, res, next) {
  try {
    const id = req.params.id;
    const todo = await models.Todo.destroy({
      where: {
        id,
      },
    });
    res.json(todo);
  } catch (e) {
    res.json({ e });
  }
});

module.exports = router;
