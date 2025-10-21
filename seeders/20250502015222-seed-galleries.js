'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('galleries', [
      {
        title: 'Umrah',
        image_url: 'images/galeri/galeri1.png',
        description: 'Beautiful landscapes and wildlife',
        category_id: 1,
        created_at: new Date()
      },
      {
        title: 'Umrah plus turki',
        image_url: 'images/galeri/galeri2.png',
        description: 'Stunning architecture and cityscapes',
        category_id: 2,
        created_at: new Date()
      },
      {
        title: 'Haji',
        image_url: 'images/galeri/galeri3.png',
        description: 'Innovative technology and gadgets',
        category_id: 3,
        created_at: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('galleries', null, {});
  }
};
