const environment = process.env.NODE_ENV || 'development'
const isProd = environment.includes('production')
const isTest = environment && environment.includes('test')

import config from 'config'
import path from 'path'
import AutoLoad from 'fastify-autoload'
import * as Sentry from '@sentry/node'
import * as Tracing from '@sentry/tracing'
import mercurius from 'mercurius'
import * as fastifyHelmet from 'fastify-helmet'
import * as fastifyRateLimit from 'fastify-rate-limit'
import logger from './logger.js'

import fastifyApp from 'fastify'
const fastify = fastifyApp({
  logger: {
    serializers: {
      res(reply) {
        return {
          statusCode: reply.statusCode,
        }
      },
      req(request) {
        return {
          method: request.method,
          url: request.url,
          path: request.path,
          parameters: request.parameters,
          headers: request.headers,
        }
      },
    },
  },
})

import gqSchema from './graphql/schema'
import swagger_config from './config/swagger_conf.js'

const format = ({ details }) => details.map(({ message }) => message).join(', ')

import * as fastifyHealth from 'fastify-healthcheck'
import * as fastifyAuth from 'fastify-auth'
import * as fastifyCors from 'fastify-cors'
import * as fastifyRequestId from 'fastify-x-request-id'
import * as fastifySwagger from 'fastify-swagger'

fastify
  .register(mercurius, {
    schema: gqSchema,
    graphiql: 'playground',
    context: ({ headers }, reply) => {
      const token = headers.authorization || ''

      let hash = Buffer.from(
        `${config.auth.api_key}:${config.auth.api_secret}`
      ).toString('base64')

      return { isAuthenticated: token === hash }
    },
    jit: 1,
  })
  .register(fastifyHealth)
  .register(fastifyAuth)
  .register(fastifyCors, {
    origin: true,
  })
  .register(fastifyRequestId)
  .register(fastifySwagger, swagger_config)
  .after(() => {
    fastify.setErrorHandler((error, { validationError }, reply) => {
      const { details = undefined } = validationError
        ? validationError
        : error.isJoi
        ? error
        : {}
      if (details) {
        const message = format({ details })
        return reply.status(422).send(new Error(message))
      }
      if (error && error.isBoom) {
        return reply.code(error.output.statusCode).send(error.output.payload)
      }
      return reply.code(error.statusCode || 400).send(error)
    })
  })

fastify.register(AutoLoad, {
  dir: path.join(__dirname, 'services'),
})

if (isProd) {
  fastify.register(fastifyHelmet).register(fastifyRateLimit, {
    max: 400,
    timeWindow: '1 minute',
  })

  Sentry.init({
    dsn: config.sentry_dsn,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    // Each transaction has a 20% chance of being sent to Sentry
    tracesSampleRate: 0.3,
    environment,
  })

  fastify.addHook('onError', (request, reply, error, done) => {
    // Only send Sentry errors when not in development
    Sentry.withScope((scope) => {
      scope.setUser({
        ip_address: request.raw.ip,
      })
      scope.setTag('path', request.raw.url)
      Sentry.captureException(error)
    })

    done()
  })
}

;(async () => {
  try {
    let address = await fastify.listen(
      process.env.PORT || config.port,
      '0.0.0.0'
    )
    logger.info(
      `server listening on ${address}. GraphQl Playground ${address}/playground. ${
        !isProd ? `Docs at ${address}/documentation` : ''
      }`
    )
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
})()

if (process) {
  process.on('SIGINT', async () => {
    logger.log('stopping fastify server')
    await fastify.close()
    logger.log('fastify server stopped')
    process.exit(0)
  })
  process.once('SIGUSR2', async () => {
    logger.log('stopping fastify server SIGUSR2')
    await fastify.close()
    process.exit(0)
  })
  process.once('SIGHUP', async () => {
    logger.log('stopping fastify server SIGHUP')
    await fastify.close()
    process.exit(0)
  })
}

export default fastify
