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
    title: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title required',
        },
        notEmpty: {
          msg: 'Title required!'
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Description required',
        },
        notEmpty: {
          msg: 'Description required!'
        }
      },
    },
    imageURL: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Image required',
        },
        notEmpty: {
          msg: 'Image required!'
        }
      },
    },
    budget: {
      type: DataTypes.DECIMAL,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Budget required',
        },
        notEmpty: {
          msg: 'Budget required!'
        }
      },
    },
    status: DataTypes.ENUM('open', 'in progress', 'completed'),
    SkillId: DataTypes.INTEGER,
    ClientId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (project, options) => {
        project.status = 'open'
      },
    },
    sequelize,
    modelName: 'Project',
  });
  return Project;
};