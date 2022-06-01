const crypto = require('crypto')
const db = require('../models/db')

module.exports.validPassword = (password) => {
  const user = db
    .get('user')
    .value()

  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 512, 'sha512')
    .toString('hex')

  return hash === user.hash
}

module.exports.validation = (password) => {
  const user = db
    .get('user')
    .value()
  const hash = crypto
    .pbkdf2Sync(password, user.salt, 1000, 512, 'sha512')
    .toString('hex')

  return hash === user.hash
}