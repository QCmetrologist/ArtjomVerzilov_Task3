var DataTypes = require("sequelize").DataTypes;
var _author = require("./author");
var _book = require("./book");
var _category = require("./category");
var _user = require("./users");
var _role = require("./roles");
var _comment = require("./comment");

const { Sequelize } = require('sequelize');

function initModels(sequelize) {
  var author = _author(sequelize, DataTypes);
  var book = _book(sequelize, DataTypes);
  var category = _category(sequelize, DataTypes);
  var users = _user(sequelize, DataTypes);
  var roles = _role(sequelize, DataTypes);
  var comment = _comment(sequelize, DataTypes);

  return {
    category,
    book,
    author,
    roles,
    users,
    comment
  };
}
module.exports = initModels;