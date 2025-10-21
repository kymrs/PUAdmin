'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('travel_reviews', [
      {
        travel_id: 1,
        user_id: 1,
        rating: 5,
        comment: 'tes',
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('travel_reviews', null, {});
  }
};
