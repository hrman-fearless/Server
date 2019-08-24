'use strict';
const mongoose = require('mongoose');
const querystring = require('querystring');
const AWS = require('aws-sdk');
const rekognition = require('./config/config');
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
  try {
    const found = await User.findOne({
      email : returningUser.email
    })
    if (found) {
      if (compareHash(returningUser.password, found.password)) {
        const token = sign({
          id: found._id,
          email : found.email,
          name: found.name,
          title: found.title
        }, process.env.SECRET_TOKEN);
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

const triggered = async (payload) =>  {
  // AWS.config.loadFromPath(config);

  let params = {
    SimilarityThreshold: 70, 
    SourceImage: {
     S3Object: {
        Bucket: payload.Bucket, 
        Name: payload.Name
      }
    }, 
    TargetImage: {
     S3Object: {
        Bucket: "herman-photos", 
        Name: "yuda2.jpg"
      }
    }
  };
  console.log(params);
  let result = rekognition.compareFaces(params, (err, data) => {
    if (err) return err
    else {
      console.log(data)
      return data
    };           // successful response
  });
  console.log(result);
  // try{
  //     faceMatches = await rekognition.compareFaces(params);
  //     let a = 1;
  // }catch(err){
  //     console.log("Error comparing faces",err);
  //     return;
  // }
  // console.log(faceMatches, '<<<<< ini');

  // return payload + `kontol`
  }

module.exports.employeeArrived = async (event, context, callback) =>  {
  console.log('Start Here');
  const imageURL = {
    Bucket: "herman-photos", 
    Name: "laras1.jpg"
  }
  const message = await triggered(imageURL)
  // console.log(message);
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify({
  //     result: message
  //   })
  // }
}

