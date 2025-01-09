'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contract extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Contract.belongsTo(models.Project, { foreignKey: 'ProjectId' });
      Contract.belongsTo(models.User, { foreignKey: 'HacklancerId' });
    }
  }
  Contract.init({
    fee: DataTypes.INTEGER,
    terms: DataTypes.TEXT,
    isCompleted: DataTypes.BOOLEAN,
    ProjectId: DataTypes.INTEGER,
    HacklancerId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (contract, options) => {
        contract.isCompleted = false
      },
    },
    sequelize,
    modelName: 'Contract',
  });
  return Contract;
};