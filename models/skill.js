'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Skill.hasMany(models.Project, { foreignKey: 'SkillId' });
      Skill.hasMany(models.Service, { foreignKey: 'SkillId' });
      Skill.hasMany(models.HacklancerProfile, { foreignKey: 'SkillId' });
    }
  }
  Skill.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Skill',
  });
  return Skill;
};