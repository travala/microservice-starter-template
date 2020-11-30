'use strict'

import config from 'config'
import crypto from 'crypto'

export function convertHexChar(input) {
  return input.replace(/&#x([0-9A-Fa-f]{2});/g, function (...args) {
    return String.fromCharCode(parseInt(args[1], 16))
  })
}

export function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, '') // trim
  str = str.toLowerCase()

  // remove accents, swap ñ for n, etc
  const from = 'àáäâèéëêìíïîòóöôùúüûñç·/_,:;'
  const to = 'aaaaeeeeiiiioooouuuunc------'
  for (let i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i))
  }

  str = str
    .replace(/[^a-z0-9 -]/g, '') // remove invalid chars
    .replace(/\s+/g, '-') // collapse whitespace and replace by -
    .replace(/-+/g, '-') // collapse dashes

  return str
}

export function generateHmac(payload, secret) {
  const hmac = crypto.createHmac('sha256', secret)
  hmac.update(payload)

  return hmac.digest('hex').toString()
}
export function generateCode(len) {
  len = len || 7
  return Math.random().toString(35).substr(2, len)
}
export const generateApiKey = () => {
  return crypto.randomBytes(64).toString('base64')
}
export const hashString = (input) => {
  return crypto.createHash('sha256').update(input).digest('hex')
}
export const validateBasicAuth = async (username, password) => {
  if (username !== config.auth.api_key || password !== config.auth.api_secret) {
    return new Error('Unauthorized')
  }
}
export function compare(a, b) {
  try {
    // may throw if they have different length, can't convert to Buffer, etc...
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b))
  } catch {
    return false
  }
}
export function generateSecureCode(len) {
  len = len || 7
  let hash = crypto
    .createHash('sha1')
    .update(new Date().toString())
    .digest('hex')
  return hash.substr(2, len)
}
