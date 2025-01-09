'use strict';
const bcrypt = require('bcryptjs');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.HacklancerProfile, { foreignKey: 'HacklancerId' });
      User.hasMany(models.Project, { foreignKey: 'ClientId' });
      User.hasMany(models.Bid, { foreignKey: 'HacklancerId' }); // Join table
      User.hasMany(models.Service, { foreignKey: 'HacklancerId' });
      User.hasMany(models.Contract, { foreignKey: 'HacklancerId' });
      User.hasMany(models.Review, { foreignKey: 'ClientId' });
    }
  }
  User.init({
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Username required',
        },
        notEmpty: {
          msg: 'Username required!'
        },
        isLowercase: {
          args: true,
          msg: 'Username must be lowercase!'
        },
      },
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Name required',
        },
        notEmpty: {
          msg: 'Name required!'
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Email required',
        },
        notEmpty: {
          msg: 'Email required!'
        },
        isEmail: {
          msg: 'Input is not an email!'
        }
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Password required',
        },
        notEmpty: {
          msg: 'Password required!'
        }
      },
    },
    role: {
      type: DataTypes.ENUM('client', 'hacklancer', 'admin'),
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Role required',
        },
        notEmpty: {
          msg: 'Role required!'
        }
      },
    },
    balance: DataTypes.DECIMAL
  }, {
    hooks: {
      beforeCreate: (user, options) => {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(user.password, salt);
        user.password = hash;
        user.balance = 0;
      },
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};