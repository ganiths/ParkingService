const chai = require('chai');
const request = require('supertest');

const expect = chai.expect;

const server = require('../../server/server');

describe('GET /health', () => {
  it('responds with json', () => {
    return request(server)
      .get('/health/')
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200, {
        status: 'UP',
      });
  });
});

describe('GET /swagger/api-docs', () => {
  it('responds with swagger', () => {
    return request(server)
      .get('/swagger/api-docs/')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .then(response => {
        expect(response.text).to.include('Swagger');
      });
  });
});