const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_TOKEN

module.exports = {
  sign : function(payload) {
    return jwt.sign(payload, secret)
  },
  verify : function(token) {
    try {
      const decoded = jwt.verify(token, secret)
      if (decoded) {
        return decoded
      }
    } catch(err) {
      throw {
        Status : 404,
        message : `Invalid Token || JWT Error`
      }
    }
  }
};
