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
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Price required',
        },
        notEmpty: {
          msg: 'Price required!'
        }
      },
    },
    terms: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Terms required',
        },
        notEmpty: {
          msg: 'Terms required!'
        }
      },
    },
    HacklancerId: DataTypes.INTEGER,
    SkillId: {
      type: DataTypes.INTEGER,
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
    modelName: 'Service',
  });
  return Service;
};