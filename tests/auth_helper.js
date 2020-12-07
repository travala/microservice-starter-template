import config from 'config'

export function authToken() {
  return Buffer.from(
    `${config.auth.api_key}:${config.auth.api_secret}`
  ).toString('base64')
}

export function apiKeyAuth() {
  return 'testhash'
}
