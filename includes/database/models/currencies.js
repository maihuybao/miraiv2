'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Currencies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  Currencies.init({
    userID: DataTypes.BIGINT,
    money: DataTypes.BIGINT,
    exp: DataTypes.BIGINT,
    dailyTime: DataTypes.BIGINT,
    workTime: DataTypes.BIGINT
  },
  {
    sequelize,
    modelName: 'Currencies',
  });
  return Currencies;
};