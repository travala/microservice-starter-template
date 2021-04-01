import * as winstonLogger from './winstonLogger'
import { colorConsole as colorLogger } from 'tracer'

const environment = process.env.NODE_ENV || 'development'

let logger = colorLogger()

export default environment === 'production' ? winstonLogger : logger
