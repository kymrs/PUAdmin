'use strict';

const { name } = require('ejs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert('umrah_packages', [
      {
        name: 'Paket Umrah Reguler 14 Hari',
        travel_agency_id: 1,
        package_type: 'regular',
        price: 25000000,
        duration_days: 14,
        description: 'Paket umrah reguler dengan akomodasi hotel bintang 3, transportasi bus, dan makan 3 kali sehari.',
        created_at: new Date(),
        updated_at: null
      },
      {
        name: 'Paket Umrah VIP 12 Hari',
        travel_agency_id: 1,
        package_type: 'vip',
        price: 45000000,
        duration_days: 12,
        description: 'Paket umrah VIP dengan akomodasi hotel bintang 5, transportasi mobil pribadi, dan layanan khusus.',
        created_at: new Date(),
        updated_at: null
      },
      {
        name: 'Paket Umrah Deluxe 10 Hari',
        travel_agency_id: 1,
        package_type: 'deluxe',
        price: 35000000,
        duration_days: 10,
        description: 'Paket umrah deluxe dengan akomodasi hotel bintang 4, transportasi bus, dan layanan tambahan.',
        created_at: new Date(),
        updated_at: null
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('umrah_packages', null, {});
  }
};
