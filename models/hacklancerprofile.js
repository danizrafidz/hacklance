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
    bio: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Bio required',
        },
        notEmpty: {
          msg: 'Bio required!'
        }
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Profile Picture required',
        },
        notEmpty: {
          msg: 'Profile Picture required!'
        }
      },
    },
    portfolioURL: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Portfolio required',
        },
        notEmpty: {
          msg: 'Portfolio required!'
        }
      },
    },
    HacklancerId: DataTypes.INTEGER,
    SkillId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Skill required',
        },
        notEmpty: {
          msg: 'Skill required!'
        }
      },
    },
  }, {
    sequelize,
    modelName: 'HacklancerProfile',
  });
  return HacklancerProfile;
};