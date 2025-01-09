'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let contracts = JSON.parse(await fs.readFile('./data/contracts.json', 'utf8')).map(contract => {
      delete contract.id
      contract.createdAt = new Date()
      contract.updatedAt = new Date()
      return contract
    })
    await queryInterface.bulkInsert('Contracts', contracts, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Contracts', null, {});
  }
};
