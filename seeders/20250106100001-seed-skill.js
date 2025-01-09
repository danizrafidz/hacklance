'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let skills = JSON.parse(await fs.readFile('./data/skills.json', 'utf8')).map(skill => {
      delete skill.id
      skill.createdAt = new Date()
      skill.updatedAt = new Date()
      return skill
    })
    await queryInterface.bulkInsert('Skills', skills, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Skills', null, {});
  }
};
