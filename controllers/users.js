import config from 'config'
import logger from '../logger'

async function createUser({ body }, reply) {
  try {
    // ... Create user
    return {}
  } catch (e) {
    logger.error(e.response ? e.response.data : e)
    return reply
      .code(e.response ? e.response.status : 400)
      .send(e.response ? e.response.data.error : e)
  }
}

export default { createUser }
