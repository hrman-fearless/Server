'use strict';
const mongoose = require('mongoose');
const querystring = require('querystring');
const { Expo } = require('expo-server-sdk');

const { AWSRekognition } = require('./helpers/rekognition');
const { employeeArrive } = require('./methods/employeeArrive');
const { employeeLeave } = require('./methods/employeeLeave');
const EmployeeMethods = require('./methods/employee');
const { pushNotif } =require('./methods/pushNotif');

mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true
}, function(err) {
  if (err) console.log(err);
});

mongoose.set('useCreateIndex', true);


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
  // const data = JSON.parse(event.body);
  const data = event.body;
  const response = await EmployeeMethods.signIn({email: data.email, password: data.password, deviceID: data.deviceID});
  return response
}

module.exports.employeeRegister = async (event, context, callback) => {
  // const data = JSON.parse(event.body);
  const data = event.body;
  const response = await EmployeeMethods.register(data);
  return response;
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

/* istanbul ignore next */
module.exports.employeeArrived = async (event, context, callback) => {
  const data = event.Records[0].s3
  const payload = {
    Bucket : data.bucket.name,
    Name: data.object.key
  }
  const result = await AWSRekognition(payload);
  const user = await employeeArrive(result);
  await pushNotif(user);
}
