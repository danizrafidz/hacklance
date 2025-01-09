'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HacklancerProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      HacklancerProfile.hasMany(models.Review, { foreignKey: 'ProfileId' });
      HacklancerProfile.belongsTo(models.User, { foreignKey: 'HacklancerId' });
      HacklancerProfile.belongsTo(models.Skill, { foreignKey: 'SkillId' });
    }
  }
  HacklancerProfile.init({
    bio: DataTypes.TEXT,
    profilePicture: DataTypes.STRING,
    portfolioURL: DataTypes.STRING,
    HacklancerId: DataTypes.INTEGER,
    SkillId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'HacklancerProfile',
  });
  return HacklancerProfile;
};