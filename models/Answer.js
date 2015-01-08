"use strict";

module.exports = function(sequelize, DataTypes) {
  var Answer = sequelize.define("Answer", {
    answer: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Answer.belongsTo(models.Question);
        Answer.belongsTo(models.Guest);
      }
    }
  });

  return Answer;
};