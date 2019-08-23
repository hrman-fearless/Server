'use strict';
const mongoose = require('mongoose');
const querystring = require('querystring');
const { compareHash } = require('./helpers/bcrypt');
const { sign } = require('./helpers/jwt');
const connectDB = mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true
}, function(err) {
  if (err) console.log(err);
});
mongoose.set('useCreateIndex', true)
const User = require('./models/user');

module.exports.createUser = async (event, context, callback) => {
  const newUser = querystring.parse(event.body);
  newUser.birthday = new Date (newUser.birthday.split('-').reverse().join('-'))
  try {
    const created = await User.create(newUser)
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: `User ${newUser.fullname} has been created`,
          data: created,
        }
      )
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: `Error`,
          error,
        }
      )
    }
  }
}

module.exports.signIn = async (event, context, callback) => {
  const returningUser = querystring.parse(event.body);
  console.log(returningUser);
  try {
    const found = await User.findOne({
      email : returningUser.email
    })
    if (found) {
      console.log(found);
      if (compareHash(returningUser.password, found.password)) {
        const token = sign({
          id: found._id,
          email : found.email,
          name: found.name,
          title: found.title
        }, process.env.SECRET_TOKEN);
        console.log(token);
        return ({
          statusCode: 200,
          body: JSON.stringify(
            {
              token
            }
          )
        })
      } else {
        return ({
        status : 401,
          message : 'Invalid Username or Password'
        })
      }
    } else {
      return ({
        status : 401,
        message : 'Invalid Username or Password'
      })
    }
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: `Error`,
          error,
        }
      )
    }
  }
}



