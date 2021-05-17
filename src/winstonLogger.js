import path from 'path'
import config from 'config'

import { createLogger, transports } from 'winston'
import { console as dbLogger } from 'tracer'
import LogzioWinstonTransport from 'winston-logzio'

const debugLogger = dbLogger()

const PROJECT_ROOT = path.join(__dirname, '..')

function catchError(err) {
  if (err) debugLogger.error(err)
}

function getStackInfo(stackIndex = 1) {
  try {
    const stacklist = new Error('').stack.split('\n').slice(3)
    // http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
    // do not remove the regex expresses to outside of this method (due to a BUG in node.js)
    const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi
    const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi

    const s = stacklist[stackIndex] || stacklist[0]
    const sp = stackReg.exec(s) || stackReg2.exec(s)

    if (sp && sp.length === 5) {
      return {
        method: sp[1],
        relativePath: path.relative(PROJECT_ROOT, sp[2]),
        line: sp[3],
        pos: sp[4],
        file: path.basename(sp[2]),
        stack: stacklist.join('\n'),
      }
    }
  } catch (e) {
    console.error(e)
  }
}

function formatLogArguments(args) {
  args = Array.prototype.slice.call(args)
  const stackInfo = getStackInfo()

  if (stackInfo) {
    const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`
    if (typeof args[0] === 'string') {
      args[0] = `${calleeStr} ${args[0]}`
    } else {
      args.unshift(calleeStr)
    }
  }
  return args
}

let logger

const logzioWinstonTransport = new LogzioWinstonTransport({
  level: 'debug',
  name: 'winston_logzio',
  type: 'backend',
  token: config.logs_token || '',
  host: 'listener-au.logz.io',
  callback: catchError,
  compress: true,
})

logger = createLogger({
  level: 'debug',
  internalLogger: debugLogger,
  transports: [
    new transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: false,
      prettyPrint: true,
    }),
    logzioWinstonTransport,
  ],
  exceptionHandlers: [logzioWinstonTransport],
  exitOnError: false,
})

logger.stream = {
  write(message, encoding) {
    logger.debug(JSON.parse(message))
  },
}

export function debug(...args) {
  logger.debug(...formatLogArguments(args))
}

export function info(...args) {
  logger.info(...formatLogArguments(args))
}

export function warn(...args) {
  logger.warn(...formatLogArguments(args))
}

export function error(...args) {
  logger.error(...formatLogArguments(args))
}

export var stream = logger.stream
