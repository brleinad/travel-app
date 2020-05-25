require('regenerator-runtime/runtime')
test('Testing the server', async () => {
    const app = await require('../src/server/server')
    //const res = await request(app)
    expect(app).toBeDefined()
})

//import { app } from '../src/server/server'
//const request = require('supertest')
/*
describe('Post endpoint', () => {
    it('Should post some stuff', async () => {
        const res = await request(app)
        .post('/post')
        .send({
            city: 'London',
            date: '2020-05-25'
        })
        expect(res.statusCode).toEqual(201)
        expect(res.body).toHaveProperty('post')
    })
})
*/