'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('User', [
      {
        id: '3c00edc4-450a-4a58-a2b7-2997c6eb6b9d',
        username: 'John',
        email: 'john@email.com',
        password: '$2b$10$IpRvNothEcDQN5IUWzznwOXzmG79ONbBLUJDBNcO8euit5phRL9Xa',
        is_admin: false,
        profile_picture: 'person/1.jpeg',
        desc: 'this is John desc',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '07f367bd-33cc-4b8f-81ab-8d44966d7a91',
        username: 'Jane',
        email: 'jane@email.com',
        password: '$2b$10$ISMfbwrDtx2xqvpJOI5dOOS5duYvLn2ewA.8cjEfK0ZQKUuTURbb2',
        is_admin: false,
        profile_picture: 'person/6.jpeg',
        desc: 'this is Jane desc',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('Post', [
      {
        id: '99b5926b-ce0b-452d-82f7-05120a03e51c',
        user_id: '3c00edc4-450a-4a58-a2b7-2997c6eb6b9d',
        img: 'post/1.jpeg',
        desc: 'post 1 from JOHN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '34e534f7-a773-4351-a364-1a5348dfcdc5',
        user_id: '07f367bd-33cc-4b8f-81ab-8d44966d7a91',
        img: 'post/1.jpeg',
        desc: 'post 1 from JANE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    await queryInterface.bulkInsert('Comment', [
      {
        id: '3d875681-5a9f-4f6f-b515-09b4a0b0528a',
        user_id: '3c00edc4-450a-4a58-a2b7-2997c6eb6b9d',
        post_id: '34e534f7-a773-4351-a364-1a5348dfcdc5',
        desc: 'comment 1 from JOHN to JANE#1 post',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '908f20d2-92d9-4d2f-b477-f64712c1bcb8',
        user_id: '07f367bd-33cc-4b8f-81ab-8d44966d7a91',
        post_id: '99b5926b-ce0b-452d-82f7-05120a03e51c',
        desc: 'comment 1 from JANE to JOHN#1 post',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('User', null, {});
    await queryInterface.bulkDelete('Post', null, {});
    await queryInterface.bulkDelete('Comment', null, {});
  }
};
