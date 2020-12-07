import config from 'config'
import logger from '../logger'

async function createUser(req, reply) {
  try {
    logger.debug(req.body)
    // ... Create user
    return req.body
  } catch (e) {
    logger.error(e.response ? e.response.data : e)
    return reply
      .code(e.response ? e.response.status : 400)
      .send(e.response ? e.response.data.error : e)
  }
}

export default { createUser }
