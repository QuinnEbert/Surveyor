"use strict";

module.exports = function(sequelize, DataTypes) {
  var Guest = sequelize.define("Guest", {
    email: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Guest.hasMany(models.Answer)
      }
    }
  });

  return Guest;
};