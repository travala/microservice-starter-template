import { description, version } from '../package.json'
import convert from 'joi-to-json'
import config from 'config'

const swaggerConf = {
  routePrefix: '/documentation',
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    components: {},
    info: {
      description,
      version,
      title: 'Microservice',
    },
    host: `${config.fqdn}:${config.port}`,
    basePath: '/',
    schemes: [config.scheme],
    tags: ['discounts', 'credits', 'coupons', 'partners'],
    securityDefinitions: {
      basicAuth: {
        type: 'basic',
      },
      apiKey: {
        type: 'apiKey',
        in: 'header',
        name: 'x-api-key',
      },
    },
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
