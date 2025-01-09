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
    let bids = JSON.parse(await fs.readFile('./data/bids.json', 'utf8')).map(bid => {
      delete bid.id
      bid.createdAt = new Date()
      bid.updatedAt = new Date()
      return bid
    })
    await queryInterface.bulkInsert('Bids', bids, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Bids', null, {});
  }
};
