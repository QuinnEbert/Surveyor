"use strict";

module.exports = function(sequelize, DataTypes) {
  var Admin = sequelize.define("Admin", {
    username: DataTypes.STRING,
    base_key: DataTypes.STRING
  }, {
    classMethods: {
      
    }
  });

  return Admin;
};