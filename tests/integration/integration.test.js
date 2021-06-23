import { expect } from 'chai'
import { authToken } from '../auth_helper.js'
import nock from 'nock'
import build from '../../src/app'

nock('api_url').persist().get(`/credits`).reply(200, { available_credits: 0 })

let userToken, app

describe('tests', () => {
  beforeAll(async () => {
    app = build()
    userToken = authToken()

    return
  })

  afterAll(() => {
    app.close()
  })

  it('should create users', async () => {
    const res = await app.inject({
      method: 'POST',
      headers: { Authorization: `Basic ${userToken}` },
      url: '/users',
      payload: {
        name: 'test',
        type: 'a',
        age: 10,
      },
    })

    expect(res.statusCode).to.equals(200)
    expect(res.json().name).to.equals('test')
  })
})
