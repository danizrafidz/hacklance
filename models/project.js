'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.Bid, { foreignKey: 'ProjectId' }); // Join table
      Project.hasOne(models.Contract, { foreignKey: 'ProjectId' });
      Project.belongsTo(models.Skill, { foreignKey: 'SkillId' });
      Project.belongsTo(models.User, { foreignKey: 'ClientId' });
    }
  }
  Project.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    budget: DataTypes.DECIMAL,
    status: DataTypes.ENUM('open', 'in progress', 'completed'),
    SkillId: DataTypes.INTEGER,
    ClientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Project',
  });
  return Project;
};