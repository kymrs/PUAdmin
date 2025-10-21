'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('hotel_facilities', [
      { hotel_id: 1, name: 'WiFi' },
      { hotel_id: 1, name: 'AC' },
      { hotel_id: 2, name: 'Breakfast' },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hotel_facilities', null, {});
  }
};
