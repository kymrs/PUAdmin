'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('hotels', [
      { name: 'Hotel Mekkah Bintang 5', location: 'Mekkah', rating: 5, description: 'Dekat Masjidil Haram', createdAt: new Date() },
      { name: 'Hotel Madinah Nyaman', location: 'Madinah', rating: 4, description: 'Dekat Masjid Nabawi', createdAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('hotels', null, {});
  }
};
