'use strict';
const { Op, Sequelize } = require('sequelize')

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
    static async sortAndSearch(sort, search, User, Skill, Bid) {
      if (!sort) sort = 'DESC'
      if (!search) search = ''

      let projects = await Project.findAll({
        include: [User, Skill, Bid],
        order: [
          ['status', 'ASC'],
          ['createdAt', sort]
        ],
        where: {
          title: {
            [Op.iLike]: `%${search}%`
          }
        }
      })
      return projects
    }

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
    SkillId: {
      type: DataTypes.INTEGER,
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