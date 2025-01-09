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
    let hacklancerProfiles = JSON.parse(await fs.readFile('./data/hacklancerprofiles.json', 'utf8')).map(profile => {
      delete profile.id
      profile.createdAt = new Date()
      profile.updatedAt = new Date()
      return profile
    })
    await queryInterface.bulkInsert('HacklancerProfiles', hacklancerProfiles, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('HacklancerProfiles', null, {});
  }
};
