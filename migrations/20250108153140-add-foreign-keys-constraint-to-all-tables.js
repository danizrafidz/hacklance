'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    // Projects
    await queryInterface.addConstraint('Projects', {
      fields: ['SkillId'],
      type: 'foreign key',
      name: 'fkey_project_skill',
      references: {
        table: 'Skills',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Projects', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'fkey_project_client',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Contracts
    await queryInterface.addConstraint('Contracts', {
      fields: ['ProjectId'],
      type: 'foreign key',
      name: 'fkey_contract_project',
      references: {
        table: 'Projects',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Contracts', {
      fields: ['HacklancerId'],
      type: 'foreign key',
      name: 'fkey_contract_hacklancer',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Services
    await queryInterface.addConstraint('Services', {
      fields: ['HacklancerId'],
      type: 'foreign key',
      name: 'fkey_service_hacklancer',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Services', {
      fields: ['SkillId'],
      type: 'foreign key',
      name: 'fkey_service_skill',
      references: {
        table: 'Skills',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // HacklancerProfiles
    await queryInterface.addConstraint('HacklancerProfiles', {
      fields: ['HacklancerId'],
      type: 'foreign key',
      name: 'fkey_profile_hacklancer',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('HacklancerProfiles', {
      fields: ['SkillId'],
      type: 'foreign key',
      name: 'fkey_profile_skill',
      references: {
        table: 'Skills',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Reviews
    await queryInterface.addConstraint('Reviews', {
      fields: ['ProfileId'],
      type: 'foreign key',
      name: 'fkey_review_profile',
      references: {
        table: 'HacklancerProfiles',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Reviews', {
      fields: ['ClientId'],
      type: 'foreign key',
      name: 'fkey_review_client',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

    // Bids
    await queryInterface.addConstraint('Bids', {
      fields: ['ProjectId'],
      type: 'foreign key',
      name: 'fkey_bid_project',
      references: {
        table: 'Projects',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Bids', {
      fields: ['HacklancerId'],
      type: 'foreign key',
      name: 'fkey_bid_hacklancer',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    // Projects
    await queryInterface.removeConstraint('Projects', 'fkey_project_skill');
    await queryInterface.removeConstraint('Projects', 'fkey_project_client');

    // Contracts
    await queryInterface.removeConstraint('Contracts', 'fkey_contract_project');
    await queryInterface.removeConstraint('Contracts', 'fkey_contract_hacklancer');

    // Services
    await queryInterface.removeConstraint('Services', 'fkey_service_hacklancer');
    await queryInterface.removeConstraint('Services', 'fkey_service_skill');

    // HacklancerProfiles
    await queryInterface.removeConstraint('HacklancerProfiles', 'fkey_profile_hacklancer');
    await queryInterface.removeConstraint('HacklancerProfiles', 'fkey_profile_skill');

    // Reviews
    await queryInterface.removeConstraint('Reviews', 'fkey_review_profile');
    await queryInterface.removeConstraint('Reviews', 'fkey_review_client');

    // Bids
    await queryInterface.removeConstraint('Bids', 'fkey_bid_project');
    await queryInterface.removeConstraint('Bids', 'fkey_bid_hacklancer');

  }
};
