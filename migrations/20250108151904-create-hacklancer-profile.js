'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('HacklancerProfiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      bio: {
        type: Sequelize.TEXT
      },
      profilePicture: {
        type: Sequelize.STRING
      },
      portfolioURL: {
        type: Sequelize.STRING
      },
      HacklancerId: {
        type: Sequelize.INTEGER
      },
      SkillId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('HacklancerProfiles');
  }
};