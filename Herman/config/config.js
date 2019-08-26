const AWS = require('aws-sdk');
const rekognition = { 
  "accessKeyId": process.env.HERMAN_REKOG_AWS_ACCESS_KEY,
  "secretAccessKey": process.env.HERMAN_REKOG_AWS_SECRET_KEY,
  "region": "ap-southeast-1"
  }

const Recognition = new AWS.Rekognition(rekognition);

module.exports = Recognition
