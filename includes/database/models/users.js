'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };

  Users.init({
    userID: DataTypes.BIGINT,
    name: DataTypes.STRING,
    banned: DataTypes.BOOLEAN,
    time2unban: DataTypes.STRING,
    reasonban: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};