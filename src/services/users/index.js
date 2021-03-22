'use strict'

import Joi from 'joi'

import usersController from '../../controllers/users'

const BASE_PATH = 'users'

export default async (fastify, opts) => {
  fastify.post(
    `/`,
    {
      onRequest: fastify.basicAuth,
      schema: {
        tags: [BASE_PATH],
        body: Joi.object().keys({
          name: Joi.string().required(),
          type: Joi.string().required().valid('a', 'b'),
          age: Joi.number().positive().required(),
        }),
      },
      validatorCompiler: ({ schema }) => (data) =>
        Joi.compile(schema).validate(data),
    },
    usersController.createUser
  )
}
