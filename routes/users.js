var express = require("express");
var router = express.Router();
var models = require("../models");

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    const users = await models.User.findAll({
      include: [
        {
          model: models.Todo,
        },
      ],
    });
    res.json(users);
  } catch (e) {
    res.json({ e });
  }
});

router.post("/", async function (req, res, next) {
  try {
    const user = await models.User.create({
      firstName: req.body.email,
      password: req.body.password,
    });
    res.json(user);
  } catch (e) {
    res.json({ e });
  }
});

module.exports = router;
