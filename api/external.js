import axios from 'axios'
import config from 'config'
import logger from '../logger.js'

const sendNotification = async (input) => {
  try {
    let config = {
      method: 'post',
      url: 'https://external-api',
      data: {
        input,
      },
    }

    return (await axios(config)).data
  } catch (error) {
    logger.error(error.response ? error.response.data : error)
    throw error
  }
}

module.exports = {
  sendNotification,
}
