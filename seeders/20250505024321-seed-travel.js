'use strict';

const { name } = require('ejs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('travels', [
      {
        name: 'Umrah Package 2025',
        description: 'A complete Umrah package including flights, hotels, and transportation.',
        logo_url: 'https://example.com/logo-umrah-package-2025.png',
        contact_person: 'John Doe',
        phone: '+1234567890',
        website: 'https://example.com/umrah-package-2025',
        email: 'www.smackdown.com',
        is_verified: 1,
        address: '123 Umrah Street, Makkah, Saudi Arabia',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('travels', null, {});
  }
};
