'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get termsDay() {
      return `${this.terms} days`
    }

    static associate(models) {
      // define association here
      Service.belongsTo(models.User, { foreignKey: 'HacklancerId', as: 'Hacklancer' });
      Service.belongsTo(models.Skill, { foreignKey: 'SkillId' });
    }
  }
  Service.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    terms: DataTypes.INTEGER,
    HacklancerId: DataTypes.INTEGER,
    SkillId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Service',
  });
  return Service;
};