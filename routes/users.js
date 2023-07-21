var express = require("express");
var router = express.Router();
var models = require("../models");
var jwt = require("jsonwebtoken");
var { secretKey, Response, tokenValid } = require("../helpers/util");

router.post("/auth", async function (req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await models.User.findOne({
      where: {
        //email : email
        firstName: email,
      },
    });
    if (!user) return res.json(new Response("user not found", false));

    const match = await user.authenticate(password);
    if (!match) return res.json(new Response("password is wrong", false));

    var token = jwt.sign({ user: user.id }, secretKey);
    res.json(new Response({ email: user.firstName, token: token }));
  } catch (e) {
    console.log(e);
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.get("/", tokenValid, async function (req, res, next) {
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
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.post("/", tokenValid, async function (req, res, next) {
  try {
    const user = await models.User.create({
      firstName: req.body.email,
      password: req.body.password,
    });
    res.json(user);
  } catch (e) {
    res.status(500).json(new Response("something went wrong", false));
  }
});

router.delete("/:id", tokenValid, async function (req, res, next) {
  try {
    const id = req.params.id;
    const user = await models.User.destroy({
      where: {
        id,
      },
    });
    res.json(user);
  } catch (e) {
    res.status(500).json(new Response("something went wrong", false));
  }
});

module.exports = router;
