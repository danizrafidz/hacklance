'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bid extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Bid.belongsTo(models.User, { foreignKey: 'HacklancerId',as: 'Hacklancer' })
      Bid.belongsTo(models.Project, { foreignKey: 'ProjectId' })
    }
  }
  Bid.init({
    ProjectId: DataTypes.INTEGER,
    HacklancerId: DataTypes.INTEGER,
    proposalText: DataTypes.TEXT,
    bidAmount: DataTypes.INTEGER,
    terms: DataTypes.INTEGER,
    status: DataTypes.ENUM('pending', 'accepted', 'rejected')
  }, {
    sequelize,
    modelName: 'Bid',
  });
  return Bid;
};