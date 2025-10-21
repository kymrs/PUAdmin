'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('facilities', [
      { name: 'Free WiFi' },
      { name: 'Swimming Pool' },
      { name: 'Gym' },
      { name: 'Spa' },
      { name: 'Restaurant' },
      { name: 'Bar' },
      { name: 'Parking' },
      { name: 'Airport Shuttle' },
      { name: 'Conference Room' },
      { name: 'Laundry Service' }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('facilities', null, {});
  }
};
