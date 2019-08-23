const bcrypt = require('bcrypt');

function hashPassword(input) {
  return bcrypt.hashSync(input, 10);
}

function compareHash(input, hash) {
  return bcrypt.compareSync(input, hash)
}

module.exports = {
  hashPassword,
  compareHash
};