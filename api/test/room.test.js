const request = require('supertest');
const server = require('../index');

describe('User tests', () => {
    it('should connect user to room', async () => {
        await request(server)
            .get('/room/testRoom/user/testUser')
            .expect(200);
    });
});
