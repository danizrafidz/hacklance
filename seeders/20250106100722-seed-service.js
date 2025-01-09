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
     * 
    */
    let services = JSON.parse(await fs.readFile('./data/services.json', 'utf8')).map(service => {
      delete service.id
      service.createdAt = new Date()
      service.updatedAt = new Date()
      return service
    })
    await queryInterface.bulkInsert('Services', services, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Services', null, {});
  }
};
