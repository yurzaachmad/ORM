"use strict";

const bcrypt = require("bcrypt");
const saltRounds = 10;

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Todo);
    }
    async authenticate(password) {
      const match = await bcrypt.compare(password, this.password);
      return match;
    }
  }
  User.init(
    {
      firstName: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );

  //implement hook
  User.beforeCreate(async (user, options) => {
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    user.password = hashedPassword;
  });

  return User;
};
