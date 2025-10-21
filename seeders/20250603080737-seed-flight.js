'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('flights', [
      { flight_number: 'MH123', airline: 'Malaysia Airlines', flight_number: 'MH123', departure_airport: 'Kuala Lumpur International Airport', arrival_airport: 'King Abdulaziz International Airport', departure_time: new Date('2025-06-01T10:00:00Z'), arrival_time: new Date('2025-06-01T15:00:00Z'), createdAt: new Date(), updatedAt: new Date() },
      { flight_number: 'EK456', airline: 'Emirates', flight_number: 'EK456', departure_airport: 'Dubai International Airport', arrival_airport: 'King Abdulaziz International Airport', departure_time: new Date('2025-06-02T08:00:00Z'), arrival_time: new Date('2025-06-02T11:00:00Z'), createdAt: new Date(), updatedAt: new Date() },
      { flight_number: 'QR789', airline: 'Qatar Airways', flight_number: 'QR789', departure_airport: 'Hamad International Airport', arrival_airport: 'King Abdulaziz International Airport', departure_time: new Date('2025-06-03T12:00:00Z'), arrival_time: new Date('2025-06-03T15:00:00Z'), createdAt: new Date(), updatedAt: new Date() },
      { flight_number: 'SV101', airline: 'Saudi Arabian Airlines', flight_number: 'SV101', departure_airport: 'King Khalid International Airport', arrival_airport: 'King Abdulaziz International Airport', departure_time: new Date('2025-06-04T14:00:00Z'), arrival_time: new Date('2025-06-04T16:00:00Z'), createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('facilities', null, {});
  }
};
