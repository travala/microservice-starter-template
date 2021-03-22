import { description, version } from '../package.json'
import convert from 'joi-to-json'
import config from 'config'

const swaggerConf = {
  routePrefix: '/documentation',
  openapi: {
    info: {
      description,
      version,
      title: 'Microservice',
    },
    servers: [
      {
        schemes: [config.scheme],
        url: `${config.host}:${config.port}`,
      },
    ],
    consumes: ['application/json'],
    produces: ['application/json'],
    security: {
      basicAuth: {
        type: 'basic',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
      },
    },
    tags: ['users'],
  },
  transform: (schema) => {
    if (!schema) return null
    return Object.keys(schema).reduce((o, key) => {
      o[key] = ['params', 'body', 'querystring', 'headers'].includes(key)
        ? convert(schema[key])
        : schema[key]
      return o
    }, {})
  },
  exposeRoute: true,
}

export default swaggerConf
