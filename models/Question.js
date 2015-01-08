"use strict";

module.exports = function(sequelize, DataTypes) {
  var Question = sequelize.define("Question", {
    question: DataTypes.STRING,
    answers: DataTypes.STRING
  }, {
    classMethods: {
    }
  });

  return Question;
};