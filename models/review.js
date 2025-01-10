'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Review.belongsTo(models.HacklancerProfile, { foreignKey: 'ProfileId' });
      Review.belongsTo(models.User, { foreignKey: 'ClientId', as: 'Client' });
    }
  }
  Review.init({
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: 1,
          msg: 'Rating value minimum 1',
        },
        max: {
          args: 5,
          msg: 'Rating value maximum 5'
        }
      },
    },
    comment: DataTypes.TEXT,
    ProfileId: DataTypes.INTEGER,
    ClientId: DataTypes.INTEGER
  }, {
    hooks: {
      beforeCreate: (review, options) => {
        if (!review.comment) {
          review.rating = 0
          review.comment = 'auto-generated: CONTRACT DONE'
        }
      },
    },
    sequelize,
    modelName: 'Review',
  });
  return Review;
};