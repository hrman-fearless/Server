'use strict';
const mongoose = require('mongoose');
const querystring = require('querystring');
const rekognition = require('./config/config');
const { Expo } = require('expo-server-sdk');

const { AWSRekognition } = require('./helpers/rekognition');
const { employeeArrive } = require('./methods/employeeArrive');
const { employeeLeave } = require('./methods/employeeLeave');
const EmployeeMethods = require('./methods/employee');
const { pushNotif } =require('./methods/pushNotif');

const connectDB = mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true
}, function(err) {
  if (err) console.log(err);
});

mongoose.set('useCreateIndex', true)
const User = require('./models/user');


module.exports.employeeFindAll = async (event, context, callback) => {
  const response = await EmployeeMethods.findAll();
  return response
}

module.exports.employeeFindById = async (event, context, callback) => {
  const pathParam = event.pathParameters;
  const response = await EmployeeMethods.findById(pathParam.id);
  return response;
}

module.exports.employeeSignIn = async (event, context, callback) => {
  // const data = querystring.parse(event.body);
  const data = JSON.parse(event.body);
  const response = await EmployeeMethods.signIn({email: data.email, password: data.password, deviceID: data.deviceID});
  return response
}

module.exports.betaRegister = async (event, context, callback) => {
  const data = JSON.parse(event.body);
  const response = await EmployeeMethods.register(data);
  return response;
}

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

module.exports.getWeekly = async (event, context, callback) => {
  const response = await EmployeeMethods.getWeekly();
  return response;
}

module.exports.getDaily = async (event, context, callback) => {
  const response = await EmployeeMethods.getDaily();
  return response;
}

module.exports.employeeLeave = async (event, context, callback) => {
  const pathParam = event.pathParameters;
  const response = await employeeLeave(pathParam.id);
  return response;
}

module.exports.employeeArrived = async (event, context, callback) => {
  const data = event.Records[0].s3
  const payload = {
    Bucket : data.bucket.name,
    Name: data.object.key
  }
  const result = await AWSRekognition(payload)
  const user = await employeeArrive(result);
  await pushNotif(user);
}

module.exports.testNotif = async (payload, event, context, callback) => {
  const expo = new Expo()
  const postNotifications = (data, tokens) => {
    var plus7time = new Date().toLocaleString("en-US", {timeZone: "Asia/Jakarta"});
    plus7time = new Date(plus7time);

    const messages = {
      to: tokens, //payload
      sound: 'default',
      title: 'You Have Arrived at the Office',
      body: `You Arrive at: ${plus7time.getHours()}:${(plus7time.getMinutes() < 10) ? '0' + plus7time.getMinutes() : plus7time.getMinutes()}`,
      data,
    }

    return Promise.all(
      expo.chunkPushNotifications([messages]).map(expo.sendPushNotificationsAsync, expo)
    )
  }
  try {
    await postNotifications({ some: 'data' }, [
      'ExponentPushToken[DJiyg3OxxI_eUAXc96Cxyo]',
    ])
  } catch (error) {
    console.log(error, 'Error');
  }

}
