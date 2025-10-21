'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('gallery_categories', [
      {
        name: 'Umrah',
        slug: 'umrah',
        created_at: new Date()
      },
      {
        name: 'Haji',
        slug: 'haji',
        created_at: new Date()
      },
      {
        name: 'Umrah plus tour',
        slug: 'umrah-plus-tour',
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('gallery_categories', null, {});
  }
};
