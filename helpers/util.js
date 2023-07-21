var jwt = require("jsonwebtoken");
var models = require("../models");

const secretKey = "rubicamp";

class Response {
  constructor(data, success = true) {
    this.data = data;
    this.success = success;
  }
}

module.exports = {
  tokenValid: async (req, res, next) => {
    try {
      const headerToken = req.get("Authorization");
      const token = headerToken.replace("Bearer ", "");
      var decoded = jwt.verify(token, secretKey);
      const user = models.User.findOne({ id: decoded.id });
      if (!user) return new Response("token not valid", false);
      req.user = user;
      next();
    } catch (e) {
      console.log(e);
      res.json(new Response("token not valid", false));
    }
  },
  Response,
  secretKey,
};
