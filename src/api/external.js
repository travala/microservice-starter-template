import axios from 'axios'
import config from 'config'
import logger from '../logger.js'

const sendNotification = async (input) => {
  try {
    let options = {
      method: 'post',
      url: 'https://external-api',
      data: {
        input,
      },
    }

    return (await axios(options)).data
  } catch (error) {
    logger.error(error.response ? error.response.data : error)
    throw error
  }
}

export default {
  sendNotification,
}
